import 'es6-promise';
import 'whatwg-fetch';
import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/gcal.js';

fetch('/.env.json')
	.then(response => {
		return response.json();
	}).then(dotenv => {

		let calendarId = 'basic';
		if(window.location.search){
			let urlParams = new URLSearchParams(window.location.search);
			if(urlParams.has('calendar'))
				calendarId = urlParams.get('calendar');
		}

		let apiKey = dotenv.GOOGLE_CALENDAR_API_KEY;
		let calendar = dotenv.calendars[calendarId];

		if(calendar){
			let googleCalendarIds = calendar.ids;

			$('#calendar').fullCalendar({
				googleCalendarApiKey: apiKey,
				eventSources: googleCalendarIds.map(id => {
					return {
						googleCalendarId: id
					};
				})
			});
		}
		else {
			document.querySelector('#calendar')
				.innerHTML = `No calendar <code>${calendarId}</code> found.`;
		}
	}).catch(err => {
		console.error(err);
	});
