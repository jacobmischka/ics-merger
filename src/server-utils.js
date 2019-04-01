/* eslint-env node */

const fetch = require('node-fetch');

function setHeaders(res) {
	res.setHeader('Expires', 'Mon, 01 Jan 1990 00:00:00 GMT');
	res.setHeader('Date', new Date().toGMTString());
	res.setHeader('Content-Type', 'text/calendar; charset=UTF-8');
	res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
	res.setHeader('Pragma', 'no-cache');
}

function getIcalsFromUrls(urls) {
	let promises = [];
	for(let url of urls) {
		promises.push(fetch(url).then(response => {
			return response.text();
		}).then(text => {
			return text;
		}).catch(err => {
			console.error(`Error reading ${url}: ${err}`);
			return err;
		}));
	}

	return Promise.all(promises);
}

function isCalendarVisible(
	calendar,
	keys,
) {
	if (!Array.isArray(keys))
		keys = [keys];

	return calendar && (
		!calendar.private
		|| (
			Boolean(calendar.key)
			&& typeof calendar.key === 'string'
			&& keys.includes(calendar.key)
		));
}

function getDeepCalendarIdsFromSubGroups(
	calendarGroup,
	allCalendars,
	allCalendarGroups,
) {
	let calendarIds = [];

	if (calendarGroup.subGroups && calendarGroup.subGroups.length > 0) {
		let subGroups = calendarGroup.subGroups.map(id => allCalendarGroups[id]);
		for (let subGroup of subGroups) {
			calendarIds.push(...getDeepCalendarIdsFromSubGroups(subGroup, allCalendars, allCalendarGroups));
		}
	}

	if (calendarGroup.calendars && calendarGroup.calendars.length > 0) {
		calendarIds.push(...calendarGroup.calendars);
	}

	return calendarIds;
}


module.exports = {
	setHeaders,
	getIcalsFromUrls,
	isCalendarVisible,
	getDeepCalendarIdsFromSubGroups
};
