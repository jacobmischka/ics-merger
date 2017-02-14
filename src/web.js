import 'babel-polyfill';
import 'es6-promise';
import 'whatwg-fetch';
import 'classlist-polyfill';
import 'element-dataset';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import 'iframe-resizer/js/iframeResizer.contentWindow.js';
import 'typeface-noto-sans';

import App from './components/App.js';

render((
	<Router history={browserHistory}>
		<Route path="/(:calendarId)" component={App} />
	</Router>
), document.getElementById('app'));
