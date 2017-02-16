import colorString from 'color-string';

export function getEventSources(calendars){
	let eventSources = [];
	
	for(let calendar of calendars){
		if(calendar){
			let color = calendar.color;
			let googleCalendarId = calendar.googleCalendarId;
			if(googleCalendarId){
				eventSources.push({
					googleCalendarId: googleCalendarId,
					color: color,
					eventDataTransform(eventData){
						return Object.assign(eventData, {
							color: color,
							calendar: calendar
						});
					}
				});
			}
			if(calendar.subCalendars){
				for(let subCalendar of calendar.subCalendars){
					eventSources.push({
						googleCalendarId: subCalendar.googleCalendarId,
						color: color,
						eventDataTransform(eventData){
							return Object.assign(eventData, {
								color: color,
								calendar: calendar
							});
						}
					});
				}
			}
		}
	}
	
	return eventSources;
}

export function nl2br(text){
	return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
}

export function ucfirst(str){
	return str.charAt(0).toUpperCase() + str.substring(1);
}

export function camelCaseToWords(str){
	let result = '';
	for(let char of str){
		if(result === ''){
			result += char.toUpperCase();
		}
		else if(char === char.toUpperCase()){
			result += ' ' + char.toLowerCase();
		}
		else {
			result += char;
		}
	}
	return result;
}

export function rgbaOverRgb(rgba, rgb = [255, 255, 255]){
	rgba = colorToArray(rgba);
	rgb = colorToArray(rgb);

	if(rgba.length < 4 || rgba[rgba.length - 1] === 1)
		return colorString.to.rgb(rgba);

	const rgbaAlpha = rgba.pop();

	let resultPieces = [];
	for(let i = 0; i < rgb.length; i++){
		resultPieces.push(rgb[i] + (rgba[i] - rgb[i]) * rgbaAlpha);
	}

	return colorString.to.rgb(resultPieces);
}

function colorToArray(color){
	if(!Array.isArray(color)){
		switch(typeof color){
			case 'object': return color.array();
			case 'string': return colorString.get(color).value;
		}
	}

	return color;
}
