'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const express = _interopDefault(require('express'));
const fetch = _interopDefault(require('node-fetch'));
const ICAL = _interopDefault(require('ical.js'));
const colorString = _interopDefault(require('color-string'));

var icalMerger = {"prodid":"-//Jacob Mischka//iCal Merger//EN","version":"2.0"};

function merge(inputs, options = {}){
	if(!Array.isArray(inputs))
		inputs = [...arguments];

	let calendar;
	for(let input of inputs){
		try {
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
		catch(e) {
			console.error(`Failed to merge: ${e}\n\nWith input: ${input}`);
		}
	}

	if(!calendar){
		console.error('No icals parsed successfully');
		return;
	}

	return calendar.toString();
}

function isCalendarVisible(calendar, keys){
	if(!Array.isArray(keys))
		keys = [keys];

	return calendar && (!calendar.private || keys.includes(calendar.key));
}

var GOOGLE_CALENDAR_API_KEY = "AIzaSyA2b7fRua-Cnw22xkI7zZgVZfYTdLMMFjM";
var GOOGLE_ANALYTICS_TRACKING_ID = "UA-70580800-4";
var calendars = {"general":{"calname":"General","caldesc":"General and common MCW Anesthesiology events","timezone":"America/Chicago","color":"#888","googleCalendarId":"mcw.anesthesiology.dept@gmail.com","url":"https://calendar.google.com/calendar/ical/mcw.anesthesiology.dept%40gmail.com/public/basic.ics"},"didacticSessions":{"calname":"Didactic Sessions","caldesc":"Didactic Sessions","timezone":"America/Chicago","color":"#462aa3","googleCalendarId":"gh0q78i24a87p2sc16nfeeuot8@group.calendar.google.com","url":"https://calendar.google.com/calendar/ical/gh0q78i24a87p2sc16nfeeuot8%40group.calendar.google.com/public/basic.ics"},"medicalStudents":{"calname":"Medical Students","caldesc":"Medical Students","timezone":"America/Chicago","color":"#f09113","googleCalendarId":"u5gi8hio0pf2jas1epc21ret98@group.calendar.google.com","url":"https://calendar.google.com/calendar/ical/u5gi8hio0pf2jas1epc21ret98%40group.calendar.google.com/public/basic.ics"},"meetings":{"calname":"Meetings","caldesc":"Meetings","timezone":"America/Chicago","color":"#4bc0c0","googleCalendarId":"tji52cg95b6rqnp7c2e6ea637c@group.calendar.google.com","url":"https://calendar.google.com/calendar/ical/tji52cg95b6rqnp7c2e6ea637c%40group.calendar.google.com/public/basic.ics"},"obFellowship":{"calname":"OB Fellowship","caldesc":"OB Fellowship","timezone":"America/Chicago","color":"#dd2727","googleCalendarId":"ffnqpmbetb5pq87tgr0drsq7vo@group.calendar.google.com","url":"https://calendar.google.com/calendar/ical/ffnqpmbetb5pq87tgr0drsq7vo%40group.calendar.google.com/public/basic.ics"},"residents":{"calname":"Residency","caldesc":"Residency","timezone":"America/Chicago","color":"#1a7829","googleCalendarId":"bq6padl7b3gn95ic74r2u67pr8@group.calendar.google.com","url":"https://calendar.google.com/calendar/ical/bq6padl7b3gn95ic74r2u67pr8%40group.calendar.google.com/public/basic.ics"},"criticalCareMedicineFellowship":{"calname":"Critical Care Medicine Fellowship","caldesc":"Critical Care Medicine Fellowship","timezone":"America/Chicago","color":"#001f3f","subCalendars":[{"calname":"CCM Journal Clubs","caldesc":"Critial Care Medicine Journal Clubs","timezone":"America/Chicago","color":"#7FDBFF","googleCalendarId":"nfood2sjr03msqrg3edtd1tfec@group.calendar.google.com","url":"https://calendar.google.com/calendar/ical/nfood2sjr03msqrg3edtd1tfec%40group.calendar.google.com/public/basic.ics"}]},"pedsFellowship":{"calname":"Pediatric Anesthesia Fellowship","caldesc":"Pediatric Anesthesia Fellowship","timezone":"America/Chicago","color":"#2ECC40","subCalendars":[{"calname":"Journal Clubs","caldesc":"Pediatric Anesthesia Journal Clubs","timezone":"America/Chicago","color":"#3D9970","googleCalendarId":"7svueri79fvaa509tup4ktlne4@group.calendar.google.com","url":"https://calendar.google.com/calendar/ical/7svueri79fvaa509tup4ktlne4%40group.calendar.google.com/public/basic.ics"},{"calname":"Simulation Sessions","caldesc":"Pediatric Anesthesia Simulation Sessions","timezone":"America/Chicago","color":"#01FF70","googleCalendarId":"qnk37qnf9t6p8gno41pn1n9r7g@group.calendar.google.com","url":"https://calendar.google.com/calendar/ical/qnk37qnf9t6p8gno41pn1n9r7g%40group.calendar.google.com/public/basic.ics"},{"calname":"Oral Board Prep Sessions","caldesc":"Preparation Sessions for Oral Boards held at CHW","timezone":"America/Chicago","color":"#568203","googleCalendarId":"cm77mrb9a7droobn8o4m57smso@group.calendar.google.com","url":"https://calendar.google.com/calendar/ical/cm77mrb9a7droobn8o4m57smso%40group.calendar.google.com/public/basic.ics"},{"calname":"Interview Dates","caldesc":"Pediatric anesthesia fellowship interview dates","timezone":"America/Chicago","color":"#0a8000","googleCalendarId":"74204mim5fk7k48ladd5jb34sg@group.calendar.google.com","url":"https://calendar.google.com/calendar/ical/74204mim5fk7k48ladd5jb34sg%40group.calendar.google.com/public/basic.ics"}]},"departmentMeetings":{"calname":"Department meetings","caldesc":"Department meetings","timezone":"America/Chicago","color":"#006f66","private":true,"key":"intranet","googleCalendarId":"ims8ot412ggb9or4uikads329s@group.calendar.google.com","url":"https://calendar.google.com/calendar/ical/ims8ot412ggb9or4uikads329s%40group.calendar.google.com/public/basic.ics"},"research":{"calname":"Research","caldesc":"Research","timezone":"America/Chicago","color":"#624aa8","private":true,"key":"intranet","googleCalendarId":"n4lb1pl97v5atmga646d09dde4@group.calendar.google.com","url":"https://calendar.google.com/calendar/ical/n4lb1pl97v5atmga646d09dde4%40group.calendar.google.com/public/basic.ics"},"deadlines":{"calname":"Deadlines","caldesc":"Deadlines","timezone":"America/Chicago","color":"#f4693e","private":true,"key":"intranet","googleCalendarId":"pfe5dd65qi4com12q9q204tv48@group.calendar.google.com","url":"https://calendar.google.com/calendar/ical/pfe5dd65qi4com12q9q204tv48%40group.calendar.google.com/public/basic.ics"}};
var calendarGroups = {"basic":{"calname":"MCW Anesthesiology","caldesc":"Master departmental calendar.","timezone":"America/Chicago","color":"#36a2eb","calendars":["departmentMeetings","research","deadlines","general","didacticSessions","medicalStudents","meetings","residents","obFellowship","criticalCareMedicineFellowship","pedsFellowship"]},"residency":{"calname":"MCW Anesthesiology Residency","caldesc":"Departmental residency education calendar.","timezone":"America/Chicago","color":"#7eda35","calendars":["general","meetings","residents"]},"fellowships":{"calname":"MCW Anesthesiology Fellowships","caldesc":"Departmental fellowships education calendar.","timezone":"America/Chicago","color":"#e7e9ed","calendars":["general","obFellowship","criticalCareMedicineFellowship","pedsFellowship"]}};
var combine = {};
const config = {
	GOOGLE_CALENDAR_API_KEY: GOOGLE_CALENDAR_API_KEY,
	GOOGLE_ANALYTICS_TRACKING_ID: GOOGLE_ANALYTICS_TRACKING_ID,
	calendars: calendars,
	calendarGroups: calendarGroups,
	combine: combine
};

/* eslint-env node */
const app = express();

app.use(express.static('public'));

app.get('/.env.json', (req, res) => {
	const options = {
		root: './',
		dotfiles: 'allow'
	};

	res.sendFile('calendars.json', options);
});

app.get('/combine.ics', (req, res) => {
	if(!req.query.urls){
		res.sendStatus(400);
		return;
	}

	let icals = getIcalsFromUrls(req.query.urls);

	setHeaders(res);

	let options = {};
	if(config && config.combine)
		options = Object.assign({}, config.combine);
	options = Object.assign({}, options, req.query);

	icals.then(icals => {
		res.send(merge(icals, options));
	})
	.catch(err => {
		console.error(`Error merging: ${err}`);
	});
});

if(config && config.calendars){
	for(let calendarName in config.calendars){
		let calendarConfig = config.calendars[calendarName];

		respondWithCalendar(calendarConfig, calendarName);
	}

	if(config.calendarGroups){
		for(let calendarName in config.calendarGroups){
			let calendarConfig = config.calendarGroups[calendarName];

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
		const isVisible = calendar =>
			isCalendarVisible(calendar, req.query.key);
		
		if(!calendar || !isVisible(calendar)){
			res.sendStatus(501);
			return;
		}

		let urls = [];
		if(calendar.url)
			urls.push(calendar.url);
		if(calendar.calendars)
			for(let calId of calendar.calendars){
				let calendar = config.calendars[calId];
				if(isVisible(calendar)){
					if(calendar.url)
						urls.push(calendar.url);
					if(calendar.subCalendars)
						urls = urls.concat(calendar.subCalendars.filter(isVisible).map(subCal => subCal.url));
				}
			}
		if(calendar.subCalendars)
			urls = urls.concat(calendar.subCalendars.filter(isVisible).map(subCal => subCal.url));

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

const port = app.get('env') === 'production'
	? 80
	: process.env.PORT || 3000;

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
