/* @flow */

import moment from 'moment';
import colorString from 'color-string';

import type { ColorLike } from 'color';
import type { FullCalendarEvent } from 'fullcalendar';

type DateLike = String | Date;

type CalendarConfig = {
	TRUSTED_ORIGINS: Array<string>,
	GOOGLE_CALENDAR_API_KEY: Array<string>,
	calendars: {[string]: Calendar},
	calendarGroups: {[string]: CalendarGroup}
};

type Calendar = {
	calname: string,
	caldesc: string,
	timezone: string,
	color: string,
	googleCalendarId?: string,
	source?: string,
	url: string,
	subCalendars?: Array<Calendar>,
	aliases?: Array<string>,

	private?: boolean,
	key?: string
};

type CalendarGroup = {
	calname: string,
	caldesc: string,
	timezone: string,
	color: string,
	calendars: Array<string>,
	aliases?: Array<string>,

	private?: boolean,
	key?: string
};

export function isCalendarVisible(
	calendar: Calendar | CalendarGroup,
	keys: Array<string> | string
): boolean {
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

export function getAliases(config: CalendarConfig): Map<string, string> {
	let aliasMap: Map<string, string> = new Map();

	// $FlowFixMe: https://github.com/facebook/flow/issues/2221
	for (let [calendarId, calendar]: [string, Calendar] of Object.entries(config.calendars)) {
		if (calendar.aliases) {
			for (let alias of calendar.aliases) {
				aliasMap.set(alias, calendarId);
			}
		}
	}

	// $FlowFixMe: https://github.com/facebook/flow/issues/2221
	for (let [calendarGroupId, calendarGroup]: [string, Calendar] of Object.entries(config.calendarGroups)) {
		if (calendarGroup.aliases) {
			for (let alias of calendarGroup.aliases) {
				aliasMap.set(alias, calendarGroupId);
			}
		}
	}

	return aliasMap;
}

export function filterHiddenCalendars(config: CalendarConfig, keys: Array<string>) {

	const isVisible: (Calendar | CalendarGroup) => boolean
		= calendar => isCalendarVisible(calendar, keys);

	for(const groupId in config.calendarGroups) {
		let group = config.calendarGroups[groupId];
		if (isVisible(group) && group.calendars)
			group.calendars = group.calendars.filter(calendarId =>
				isVisible(config.calendars[calendarId]));
		else
			delete config.calendarGroups[groupId];
	}

	for(const calendarId in config.calendars) {
		let calendar = config.calendars[calendarId];
		if (isVisible(calendar)) {
			if (calendar.subCalendars)
				calendar.subCalendars = calendar.subCalendars.filter(isVisible);
		}
		else
			delete config.calendars[calendarId];
	}

	return config;
}

export function replaceCalendarMacros(config: CalendarConfig): CalendarConfig {

	// $FlowFixMe: https://github.com/facebook/flow/issues/2221
	for (let calendarGroup: CalendarGroup of Object.values(config.calendarGroups)) {
		if (
			calendarGroup.calendars
			&& Array.isArray(calendarGroup.calendars)
			&& calendarGroup.calendars.length === 1
			&& calendarGroup.calendars[0] === '<all>'
		)
			calendarGroup.calendars = Object.keys(config.calendars);
	}

	return config;
}

export function getEventSources(calendars: Array<Calendar>): Array<EventSource> {
	let eventSources = [];

	for(let calendar of calendars) {
		if (calendar) {
			let calendarSource = getSource(calendar);
			if (calendarSource)
				eventSources.push(calendarSource);

			if (calendar.subCalendars && Array.isArray(calendar.subCalendars)) {
				for(let subCalendar of calendar.subCalendars) {
					eventSources.push(getSource(subCalendar, calendar.color));
				}
			}
		}
	}

	return eventSources;
}

type EventSource = {
	color?: ?string,
	eventDataTransform?: FullCalendarEvent => EnhancedFullCalendarEvent,
	googleCalendarId?: string,
	url?: string
};

type EnhancedFullCalendarEvent = FullCalendarEvent & {
	color: string,
	calendar: Calendar
};

export function getSource(
	calendar: Calendar,
	color: string = calendar.color
): EventSource {
	if (!calendar || (!calendar.googleCalendarId && !calendar.source))
		return {};

	let source: EventSource = {
		color,
		eventDataTransform(eventData: FullCalendarEvent) {
			return Object.assign({}, eventData, {
				color,
				calendar
			});
		}
	};

	if (calendar.googleCalendarId) {
		source.googleCalendarId = calendar.googleCalendarId;
	} else if (calendar.source) {
		source.url = calendar.source;
	}

	return source;
}

export function nl2br(text: string): string {
	return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
}

export function ucfirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

export function camelCaseToWords(str: string): string {
	let result = '';
	for(let char of str) {
		if (result === '') {
			result += char.toUpperCase();
		}
		else if (char === char.toUpperCase()) {
			result += ' ' + char.toLowerCase();
		}
		else {
			result += char;
		}
	}
	return result;
}

export function rgbaOverRgb(rgba: ColorLike, rgb: ColorLike = [255, 255, 255]) {
	rgba = colorToArray(rgba);
	rgb = colorToArray(rgb);

	if (rgba.length < 4 || rgba[rgba.length - 1] === 1)
		return colorString.to.rgb(rgba);

	const rgbaAlpha = rgba.pop();

	let resultPieces = [];
	for(let i = 0; i < rgb.length; i++) {
		resultPieces.push(rgb[i] + (rgba[i] - rgb[i]) * rgbaAlpha);
	}

	return colorString.to.rgb(resultPieces);
}

function colorToArray(color: Array<number> | string | Object): Array<number> {
	if (Array.isArray(color)) {
		return color;
	} else {
		switch(typeof color) {
			case 'object': return color.array();
			case 'string': return colorString.get(color).value;
		}
	}

	return [];
}

export function fullCalendarToGoogleUrl(event: FullCalendarEvent): string {
	// TODO
	const url = 'https://calendar.google.com/calendar/render';
	const params = new URLSearchParams();
	params.set('action', 'TEMPLATE');
	params.set('dates', `${formatCalendarDate(event.start)}/${formatCalendarDate(event.end)}`);
	params.set('location', event.location);
	params.set('text', event.title);
	params.set('details', event.description);

	return `${url}?${params.toString()}`;
}

export function fullCalendarToIcs(event: FullCalendarEvent): string {
	return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${event.url}
DTSTART:${formatCalendarDate(event.start)}
DTEND:${formatCalendarDate(event.end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

}

export function fullCalendarToIcsUrl(event: FullCalendarEvent): string {
	return encodeURI(`data:text/calendar;charset=utf8,${fullCalendarToIcs(event)}`);
}

function formatCalendarDate(date: DateLike): string {
	return moment(date).toISOString().replace(/-|:|\.\d+/g, '');
}
