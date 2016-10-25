import express from 'express';
import fetch from 'node-fetch';

import merge from './index.js';

const app = express();

app.get('/combined.ics', (req, res) => {

	if(!req.query.urls){
		res.sendStatus(400);
		return;
	}

	let inputs = [];
	let promises = [];
	for(let url of req.query.urls){
		promises.push(fetch(url).then(response => {
			return response.text();
		}).then(text => {
			inputs.push(text);
		}).catch(err => {
			console.error(`Error reading ${url}: ${err}`);
		}));
	}

	res.set('Content-Type', 'text/calendar; charset=UTF-8');

	Promise.all(promises).then(() => {
		res.send(merge(inputs));
	});
});

let port = 3000;
if(app.get('env') === 'production')
	port = 80;

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
