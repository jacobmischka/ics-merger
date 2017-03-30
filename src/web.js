import 'babel-polyfill';
import 'es6-promise';
import 'whatwg-fetch';
import 'classlist-polyfill';
import 'element-dataset';
import 'url-search-params-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import 'iframe-resizer/js/iframeResizer.contentWindow.js';
import 'typeface-noto-sans';

import App from './components/App.js';

render((
	<Router history={browserHistory}>
		<Route path="/(:calendarId)" component={props => <App envFile="/.env.json" calendarId={props.params.calendarId} />} />
	</Router>
), document.getElementById('app'));
