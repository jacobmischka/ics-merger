/** @format */
/* eslint-env node */

const { parse } = require("url");
const { basename } = require("path");

const {
	getIcalsFromUrls,
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
	if (calendar.url) urls.push(calendar.url);

	if (calendar.calendars || calendar.subGroups) {
		let calIds = getDeepCalendarIdsFromSubGroups(
			calendar,
			dotenv.calendars,
			dotenv.calendarGroups
		);

		for (let calId of calIds) {
			let calendar = dotenv.calendars[calId];
			if (isVisible(calendar)) {
				if (calendar.url) urls.push(calendar.url);
				if (calendar.subCalendars)
					urls = urls.concat(
						calendar.subCalendars.filter(isVisible).map(subCal => subCal.url)
					);
			}
		}
	}

	if (calendar.subCalendars) {
		urls = urls.concat(
			calendar.subCalendars.filter(isVisible).map(subCal => subCal.url)
		);
	}

	urls = Array.from(new Set(urls));

	let icals = getIcalsFromUrls(urls);

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
