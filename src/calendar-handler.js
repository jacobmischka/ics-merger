/** @format */
/* eslint-env node */

const { parse } = require("url");
const { basename } = require("path");

const {
	getIcalsFromUrls,
	getIcalsFromFullCalendarEventSourceCalendars,
	setHeaders,
	isCalendarVisible,
	getDeepCalendarIdsFromSubGroups
} = require("./server-utils.js");
const merge = require("./index.js");

const dotenv = require("../.env.json");

module.exports = (req, res) => {
	const { query, pathname } = parse(req.url, true);
	const isVisible = calendar => isCalendarVisible(calendar, query.key);
	const calendarName = basename(pathname, ".ics");

	const calendar =
		(dotenv.calendars && dotenv.calendars[calendarName]) ||
		(dotenv.calendarGroups && dotenv.calendarGroups[calendarName]);

	if (!calendar || !isVisible(calendar)) {
		res.writeHead(501);
		res.end();
		return;
	}

	let urls = [];
	let sourceCalendars = [];
	if (calendar.url) {
		urls.push(calendar.url);
	} else if (calendar.source) {
		sourceCalendars.push(calendar);
	}

	if (calendar.calendars || calendar.subGroups) {
		let calIds = getDeepCalendarIdsFromSubGroups(
			calendar,
			dotenv.calendars,
			dotenv.calendarGroups
		);

		for (let calId of calIds) {
			let calendar = dotenv.calendars[calId];
			if (isVisible(calendar)) {
				if (calendar.url) {
					urls.push(calendar.url);
				} else if (calendar.source) {
					sourceCalendars.push(calendar);
				}

				if (calendar.subCalendars) {
					const visible = calendar.subCalendars.filter(isVisible);
					urls = urls.concat(
						visible.map(subCal => subCal.url).filter(Boolean)
					);
					sourceCalendars = sourceCalendars.concat(
						visible.filter(subCal => subCal.source)
					);
				}
			}
		}
	}

	if (calendar.subCalendars) {
		const visible = calendar.subCalendars.filter(isVisible);
		urls = urls.concat(
			visible.map(subCal => subCal.url)
		);
		sourceCalendars = sourceCalendars.concat(
			visible.filter(subCal => subCal.source)
		);
	}

	urls = Array.from(new Set(urls));
	sourceCalendars = Array.from(new Set(sourceCalendars));

	let icals = Promise.all([getIcalsFromUrls(urls), getIcalsFromFullCalendarEventSourceCalendars(sourceCalendars)]).then(icalArrs => icalArrs.flat());

	setHeaders(res);

	let options = Object.assign({}, calendar);

	icals
		.then(icals => {
			res.writeHead(200);
			res.end(merge(icals, options));
		})
		.catch(err => {
			console.error(`Error merging: ${err}`);
			res.writeHead(500);
			res.end();
		});
};
