import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './components/App.js';

ReactDOM.render((
	<Router history={browserHistory}>
		<Route path="/(:calendarId)" component={App} />
	</Router>
), document.getElementById('app'));
