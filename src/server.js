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
	});
});

if(dotenv && dotenv.calendarGroups){
	for(let calendarName in dotenv.calendarGroups){
		let calendarConfig = dotenv.calendarGroups[calendarName];

		app.get(`/${calendarName}.ics`, (req, res) => {
			if(!calendarConfig || !calendarConfig.calendars){
				res.sendStatus(501);
				return;
			}

			let calendars = calendarConfig.calendars;
			let urls = calendars.map(calId => dotenv.calendars[calId].url);
			let icals = getIcalsFromUrls(urls);

			setHeaders(res);

			let options = Object.assign({}, calendarConfig);

			icals.then(icals => {
				res.send(merge(icals, options));
			});
		});
	}
}

app.get('/:calendarId', (req, res) => {
	res.sendFile('index.html', {
		root: './public/'
	});
});

function setHeaders(res){
	res.set('Expires', 'Mon, 01 Jan 1990 00:00:00 GMT');
	res.set('Date', new Date().toGMTString());
	res.set('Content-Type', 'text/calendar; charset=UTF-8');
	res.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
	res.set('Pragma', 'no-cache');
}

let port = 3000;
if(app.get('env') === 'production')
	port = 80;

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});

function getIcalsFromUrls(urls){
	let icals = [];
	let promises = [];
	for(let url of urls){
		promises.push(fetch(url).then(response => {
			return response.text();
		}).then(text => {
			icals.push(text);
		}).catch(err => {
			console.error(`Error reading ${url}: ${err}`);
		}));
	}

	return Promise.all(promises).then(() => {
		return icals;
	});
}
