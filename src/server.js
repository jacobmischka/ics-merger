/* eslint-env node */

const express = require('express');

const handleCalendar = require('./calendar-handler.js');
const combineCalendars = require('./combine-handler.js');

const dotenv = require('../.env.json');

const app = express();

app.use(express.static('public'));

app.get('/env.json', (req, res) => {
	const options = {
		root: './',
		dotfiles: 'allow'
	};

	res.sendFile('env.json', options);
});

app.get('/combine.ics', combineCalendars);

if (dotenv && dotenv.calendars) {
	for(let calendarName in dotenv.calendars) {
		app.get(`/${calendarName}.ics`, handleCalendar);
	}

	if (dotenv.calendarGroups) {
		for(let calendarName in dotenv.calendarGroups) {
			app.get(`/${calendarName}.ics`, handleCalendar);
		}
	}
}

app.get('/:calendarId', (req, res) => {
	res.sendFile('index.html', {
		root: './public/'
	});
});

let port = process.env.PORT;

if (!port && app.get('env') !== 'production') {
	port = 3000;
}

app.listen(port, () => {
	console.log(`Listening on ${port}`); // eslint-disable-line no-console
});
