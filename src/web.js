import 'babel-polyfill';
import 'es6-promise';
import 'whatwg-fetch';
import 'classlist-polyfill';
import 'element-dataset';
import 'url-search-params-polyfill';
import 'raf/polyfill';
import '../assets/spinner.gif';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import 'iframe-resizer/js/iframeResizer.contentWindow.js';
import 'typeface-noto-sans';

import App from './components/App.js';

render((
	<Router>
		<div>
			<Route exact path="/" render={({location}) => <Redirect to={{
					pathname: '/basic',
					search: location.search
				}} />} />
			<Route path="/:calendarId" render={({match, location}) =>
				<App envFile="/.env.json"
					search={location.search}
					calendarId={match.params.calendarId}
					eventId={location.hash.substring(1)} />} />
		</div>
	</Router>
), document.getElementById('app'));
