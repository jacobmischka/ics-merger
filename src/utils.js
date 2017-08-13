import colorString from 'color-string';

export function isCalendarVisible(calendar, keys) {
	if (!Array.isArray(keys))
		keys = [keys];

	return calendar && (!calendar.private || keys.includes(calendar.key));
}

export function filterHiddenCalendars(config, keys) {
	
	const isVisible = calendar => isCalendarVisible(calendar, keys);
		
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

export function getEventSources(calendars) {
	let eventSources = [];
	
	for(let calendar of calendars) {
		if (calendar) {
			let calendarSource = getSource(calendar);
			if (calendarSource)
				eventSources.push(calendarSource);

			if (calendar.subCalendars) {
				for(let subCalendar of calendar.subCalendars) {
					eventSources.push(getSource(subCalendar, calendar.color));
				}
			}
		}
	}
	
	return eventSources;
}

export function getSource(calendar, color = calendar.color) {
	if (!calendar || (!calendar.googleCalendarId && !calendar.source))
		return;
	
	let source = {
		color,
		eventDataTransform(eventData) {
			return Object.assign(eventData, {
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

export function nl2br(text) {
	return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
}

export function ucfirst(str) {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

export function camelCaseToWords(str) {
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

export function rgbaOverRgb(rgba, rgb = [255, 255, 255]) {
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

function colorToArray(color) {
	if (!Array.isArray(color)) {
		switch(typeof color) {
			case 'object': return color.array();
			case 'string': return colorString.get(color).value;
		}
	}

	return color;
}
