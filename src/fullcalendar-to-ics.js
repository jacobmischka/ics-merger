/** @format */
/* eslint-env node */

const ICAL = require("ical.js");

const { icalMerger } = require("../package.json");

function fullCalendarEventsToIcs(events, options = {}) {
	const calendar = new ICAL.Component(["vcalendar", [], []]);

	calendar.updatePropertyWithValue("prodid", icalMerger.prodid);
	calendar.updatePropertyWithValue("version", icalMerger.version);

	let { timezone: tzid } = options;

	if (!tzid) {
		const moment = require('moment-timezone');
		tzid = moment.tz.guess();
	}
	calendar.updatePropertyWithValue("x-wr-timezone", tzid);

	const vtimezone = new ICAL.Component('vtimezone');
	const timezone = new ICAL.Timezone({
		component: vtimezone,
		tzid
	});

	if (options.calname)
		calendar.updatePropertyWithValue("x-wr-calname", options.calname);

	if (options.caldesc)
		calendar.updatePropertyWithValue("x-wr-caldesc", options.caldesc);

	for (const fcEvent of events) {
		const vevent = new ICAL.Component("vevent");
		const event = new ICAL.Event(vevent);

		event.startDate = new ICAL.Time(getTimeData(fcEvent.start), timezone);
		event.endDate = new ICAL.Time(getTimeData(fcEvent.end), timezone);
		event.description = fcEvent.title;
		event.uid = fcEvent.id;

		calendar.addSubcomponent(vevent);
	}

	return calendar.toString();
}

function getTimeData(date) {
	date = new Date(date);
	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
		hour: date.getHours(),
		minute: date.getMinutes(),
		second: date.getSeconds()
	};
}

module.exports = fullCalendarEventsToIcs;
