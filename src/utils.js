/* @flow */

import moment from 'moment';
import colorString from 'color-string';

import { isCalendarVisible, getDeepCalendarIdsFromSubGroups } from './server-utils.js';

import type { ColorLike } from 'color';
import type { FullCalendarEvent } from 'fullcalendar';

export type DateLike = String | Date;

export type CalendarConfig = {
	TRUSTED_ORIGINS: Array<string>,
	GOOGLE_CALENDAR_API_KEY: Array<string>,
	calendars: {[string]: Calendar},
	calendarGroups: {[string]: CalendarGroup},
	calendarTree?: CalendarTreeDef,
	calendarGroupTree?: CalendarTreeDef
};

export type Calendar = {
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

export type CalendarGroup = {
	calname: string,
	caldesc: string,
	timezone: string,
	color: string,
	calendars?: Array<string>,
	subGroups?: Array<string>,
	aliases?: Array<string>,

	private?: boolean,
	key?: string
};

export type CalendarLike = Calendar | CalendarGroup;

export type CalendarTreeDef = {
	label?: string,
	items: Array<string | CalendarTreeDef>
};

export type EventSource = {
	color?: ?string,
	eventDataTransform?: FullCalendarEvent => EnhancedFullCalendarEvent,
	googleCalendarId?: string,
	url?: string
};

export type EnhancedFullCalendarEvent = FullCalendarEvent & {
	color: string,
	calendar: Calendar
};

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

export function getCalendars(
	calendarId: string,
	allCalendars: {[string]: Calendar},
	allCalendarGroups: {[string]: CalendarGroup},
	customCalendar: CalendarGroup
): {
	calendar: ?CalendarLike,
	calendars: Array<CalendarLike>,
	eventSources: Array<EventSource>
} {

	let calendar: Calendar | CalendarGroup,
		calendars: Array<CalendarLike> = [],
		eventSources: Array<EventSource> = [],
		calendarMap: {[string]: CalendarLike} = {};

	if (calendarId === 'custom') {

		calendar = customCalendar;

		if (customCalendar.calendars) {
			let customCalendars = customCalendar.calendars;
			let actualCalendars = customCalendars
				.filter(id => id in allCalendars)
				.map(id => allCalendars[id]);

			for (let calendarId of customCalendars) {
				if (!(calendarId in calendarMap))
					calendarMap[calendarId] = allCalendars[calendarId];
			}

			calendars.push(...actualCalendars);
			eventSources.push(...actualCalendars.map(cal => getSource(cal)));
		}

	} else if (calendarId in allCalendars) {

		calendar = allCalendars[calendarId];

		if (calendar.googleCalendarId || calendar.source) {
			calendars.push(calendar);
			calendarMap[calendarId] = calendar;
			eventSources.push(getSource(calendar));
		}

		if (
			calendar.subCalendars
			&& Array.isArray(calendar.subCalendars)
			&& calendar.subCalendars.length > 0
		) {
			let subCals = calendar.subCalendars;
			calendars.push(...subCals);
			eventSources.push(...subCals.map(subCal => getSource(subCal)));
		}

	} else if (calendarId in allCalendarGroups) {

		calendar = allCalendarGroups[calendarId];

		if (calendar.calendars) {
			let calIds = calendar.calendars;
			let cals = calIds.map(id => allCalendars[id]);
			calendars.push(...cals);
			eventSources.push(...cals.map(cal => getSource(cal)));
			for (let calId of calIds) {
				if (!(calId in calendarMap))
					calendarMap[calId] = allCalendars[calId];
			}
		}

		// Add subGroups last
		if (calendar.subGroups) {
			let subGroupIds = calendar.subGroups.filter(id =>
				id in allCalendarGroups && allCalendarGroups[id] !== calendar
			);
			let subGroups = subGroupIds.map(id => allCalendarGroups[id]);

			for (let subGroupId of subGroupIds) {
				if (!(subGroupId in calendarMap))
					calendarMap[subGroupId] = allCalendarGroups[subGroupId];
			}

			calendars.push(...subGroups);


			for (let subGroup of subGroups) {
				let deepCalendarIds = getDeepCalendarIdsFromSubGroups(
					subGroup,
					allCalendars,
					allCalendarGroups
				);
				deepCalendarIds = Array.from(new Set(deepCalendarIds));
				let deepCalendars = deepCalendarIds.map(id => allCalendars[id]);

				eventSources.push(...deepCalendars
					.map(cal => getSource(cal, subGroup.color))
				);
			}
		}
	}

	eventSources = dedupeSources(eventSources);

	return { calendar, calendarMap, calendars, eventSources };
}

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

	if (calendar.googleCalendarId && typeof calendar.googleCalendarId === 'string') {
		source.googleCalendarId = calendar.googleCalendarId;
	} else if (calendar.source && typeof calendar.source === 'string') {
		source.url = calendar.source;
	}

	return source;
}

function dedupeSources(sources: Array<EventSource>): Array<EventSource> {
	// TODO: merge duplicates instead of just using the first one

	let sourceMap: Map<string, EventSource> = new Map();

	for (let source of sources) {
		if (source.googleCalendarId && !sourceMap.has(source.googleCalendarId))
			sourceMap.set(source.googleCalendarId, source);
		else if (source.url && !sourceMap.has(source.url))
			sourceMap.set(source.url, source);
	}

	return Array.from(sourceMap.values());
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
