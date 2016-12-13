import express from 'express';
import fetch from 'node-fetch';

import merge from './index.js';

import dotenv from '../.env.json';

const app = express();

app.use(express.static('public'));

app.get('/.env.json', (req, res) => {
	const options = {
		root: './',
		dotfiles: 'allow'
	};

	res.sendFile('.env.json', options);
});

app.get('/combine.ics', (req, res) => {
	if(!req.query.urls){
		res.sendStatus(400);
		return;
	}

	let icals = getIcalsFromUrls(req.query.urls);

	setHeaders(res);

	let options = {};
	if(dotenv && dotenv.combine)
		options = Object.assign({}, dotenv.combine);
	options = Object.assign({}, options, req.query);

	icals.then(icals => {
		res.send(merge(icals, options));
	})
	.catch(err => {
		console.error(`Error merging: ${err}`);
	});
});

if(dotenv && dotenv.calendars){
	for(let calendarName in dotenv.calendars){
		let calendarConfig = dotenv.calendars[calendarName];

		respondWithCalendar(calendarConfig, calendarName);
	}

	if(dotenv.calendarGroups){
		for(let calendarName in dotenv.calendarGroups){
			let calendarConfig = dotenv.calendarGroups[calendarName];

			respondWithCalendar(calendarConfig, calendarName);
		}
	}
}

app.get('/:calendarId', (req, res) => {
	res.sendFile('index.html', {
		root: './public/'
	});
});

function respondWithCalendar(calendar, calendarName){
	app.get(`/${calendarName}.ics`, (req, res) => {
		if(!calendar){
			res.sendStatus(501);
			return;
		}

		let urls = [];
		if(calendar.url)
			urls.push(calendar.url);
		if(calendar.calendars)
			for(let calId of calendar.calendars){
				let calendar = dotenv.calendars[calId];
				if(calendar){
					if(calendar.url)
						urls.push(calendar.url);
					if(calendar.subCalendars)
						urls = urls.concat(calendar.subCalendars.map(subCal => subCal.url));
				}
			}
		if(calendar.subCalendars)
			urls = urls.concat(calendar.subCalendars.map(subCal => subCal.url));

		let icals = getIcalsFromUrls(urls);

		setHeaders(res);

		let options = Object.assign({}, calendar);

		icals.then(icals => {
			res.send(merge(icals, options));
		})
		.catch(err => {
			console.error(`Error merging: ${err}`);
		});
	});
}

function setHeaders(res){
	res.set('Expires', 'Mon, 01 Jan 1990 00:00:00 GMT');
	res.set('Date', new Date().toGMTString());
	res.set('Content-Type', 'text/calendar; charset=UTF-8');
	res.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
	res.set('Pragma', 'no-cache');
}

const port = app.get('env') === 'production' ? 80 : 3000;

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});

function getIcalsFromUrls(urls){
	let promises = [];
	for(let url of urls){
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
