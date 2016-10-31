'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));
var fetch = _interopDefault(require('node-fetch'));
var ICAL = _interopDefault(require('ical.js'));

var icalMerger = {"prodid":"-//Jacob Mischka//iCal Merger//EN","version":"2.0"};

function merge(inputs, options = {}){
	if(!Array.isArray(inputs))
		inputs = [...arguments];

	let calendar;
	for(let input of inputs){
		let jcal = ICAL.parse(input);
		let cal = new ICAL.Component(jcal);

		if(!calendar) {
			calendar = cal;
			calendar.updatePropertyWithValue('prodid', icalMerger.prodid);
			calendar.updatePropertyWithValue('version', icalMerger.version);

			if(options.calname)
				calendar.updatePropertyWithValue('x-wr-calname', options.calname);
			if(options.timezone)
				calendar.updatePropertyWithValue('x-wr-timezone', options.timezone);
			if(options.caldesc)
				calendar.updatePropertyWithValue('x-wr-caldesc', options.caldesc);
		}
		else {
			for(let vevent of cal.getAllSubcomponents('vevent')){
				calendar.addSubcomponent(vevent);
			}
		}
	}

	if(!calendar){
		console.error('No icals parsed successfully');
		return;
	}

	return calendar.toString();
}

var basic = {"calname":"MCW Anesthesiology","caldesc":"Master departmental education calendar.","timezone":"America/Chicago","urls":["https://calendar.google.com/calendar/ical/bq6padl7b3gn95ic74r2u67pr8%40group.calendar.google.com/private-8a9dccb7b52269e74463b53e7ae890c4/basic.ics","https://calendar.google.com/calendar/ical/gh0q78i24a87p2sc16nfeeuot8%40group.calendar.google.com/private-6ac79343a37f608ff56c370bcd9fc842/basic.ics","https://calendar.google.com/calendar/ical/u5gi8hio0pf2jas1epc21ret98%40group.calendar.google.com/private-065deaa080b73cd4ecf7389f1aa1fcab/basic.ics"]};
var dotenv = {
	basic: basic
};

const app = express();

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

app.get('/basic.ics', (req, res) => {
	if(!dotenv || !dotenv.basic || !dotenv.basic.urls || !Array.isArray(dotenv.basic.urls)){
		res.sendStatus(501);
		return;
	}

	let icals = getIcalsFromUrls(dotenv.basic.urls);

	setHeaders(res);

	let options = Object.assign({}, dotenv.basic);

	icals.then(icals => {
		res.send(merge(icals, options));
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
