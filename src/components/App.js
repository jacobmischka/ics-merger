import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import FullCalendar from './FullCalendar.js';
import ActiveEvent from './ActiveEvent.js';
import CalendarLegend from './CalendarLegend.js';
import CustomGroupSelector from './CustomGroupSelector.js';
import Subscription from './Subscription.js';
import Options from './Options.js';

import { BREAKPOINTS } from '../constants.js';
import {
	getEventSources,
	filterHiddenCalendars,
	replaceCalendarMacros
} from '../utils.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			TRUSTED_ORIGINS: [],
			GOOGLE_CALENDAR_API_KEY: '',
			calendars: {},
			calendarGroups: {},
			customCalendar: {
				calname: 'Custom Calendar',
				calendars: []
			},
			activeEvent: null,
			activeEventOriginalElement: null,
			loaded: null
		};

		this.handleSetActiveEventId = this.handleSetActiveEventId.bind(this);
		this.handleSetActiveEvent = this.handleSetActiveEvent.bind(this);
		this.handleUnsetActiveEvent = this.handleUnsetActiveEvent.bind(this);
		this.handleChangeCustomCalendarIds = this.handleChangeCustomCalendarIds.bind(this);
	}

	componentDidMount() {
		fetch(this.props.envFile)
			.then(response => {
				return response.json();
			}).then(dotenv => {
				const searchParams = new URLSearchParams(this.props.search.slice(1));
				const keys = searchParams.getAll('key');

				dotenv = replaceCalendarMacros(dotenv);
				dotenv = filterHiddenCalendars(dotenv, keys);
				this.setState(Object.assign(dotenv, {loaded: true}));
				if (dotenv.GOOGLE_ANALYTICS_TRACKING_ID && window.ga) {
					window.ga('create', dotenv.GOOGLE_ANALYTICS_TRACKING_ID, 'auto');
					window.ga('send', 'pageview');
				}
			}).catch(err => {
				console.error(err);
				this.setState({loaded: false});
			});
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.eventId && this.state.activeEvent)
			this.handleUnsetActiveEvent(false);
	}

	getCalendars(calendarId) {
		// FIXME: This doesn't work if a calendar and a group share the same id

		let calendar = calendarId === 'custom'
			? this.state.customCalendar
			: this.state.calendarGroups[calendarId];
		let calendars;

		if (calendar) {
			calendars = calendar.calendars.map(id => this.state.calendars[id]);
		} else {
			calendar = this.state.calendars[calendarId];
			calendars = calendar ? calendar.subCalendars || [calendar] : [];
		}

		return { calendar, calendars };
	}

	render() {
		const { calendarId, eventId, search, location, history } = this.props;
		const { calendar, calendars } = this.getCalendars(calendarId);
		const searchParams = new URLSearchParams(this.props.search.slice(1));
		const calendarView = searchParams.get('view');
		const defaultDate = searchParams.get('date');

		if (calendar && calendars) {
			let eventSources = getEventSources(calendars);


			let activeEventNode = this.state.activeEvent
				? (
					<ActiveEvent event={this.state.activeEvent}
						originalElement={this.state.activeEventOriginalElement}
						onClose={this.handleUnsetActiveEvent} />
				)
				: null;

			let groupedCalendarListItems = Object.keys(this.state.calendarGroups).map(id => (
				<li key={`grouped-calendar-list-items-${id}`}>
					<NavLink to={{pathname: `/${id}`, search}}>
						{this.state.calendarGroups[id].calname}
					</NavLink>
				</li>
			));

			groupedCalendarListItems.push(
				<li key="custom">
					<NavLink to={{pathname: '/custom', search}}>
						Custom Group
					</NavLink>
			{
				calendarId === 'custom' && (
					<CustomGroupSelector calendars={this.state.calendars}
						customCalendarIds={this.state.customCalendar.calendars}
						handleChangeCustomCalendarIds={this.handleChangeCustomCalendarIds} />
				)
			}
				</li>
			);

			let calendarListItems = Object.keys(this.state.calendars).map(id => (
				<li key={`calendar-list-items-${id}`}>
					<NavLink to={{pathname: `/${id}`, search}}>
						{this.state.calendars[id].calname}
					</NavLink>
				</li>
			));

			// `${window.location.origin}/${this.props.icsFilename}${window.location.search}`

			let icsUrl;
			if (calendar.url && !calendar.calendars) {
				icsUrl = calendar.url;
			} else {
				let search = window.location.search;
				let filename;

				if (calendarId === 'custom') {
					filename = 'combine.ics';

					if (!search)
						search = '?';

					search += this.state.customCalendar.calendars
						.map(calId => {
							if (this.state.calendars[calId].url) {
								return `urls[]=${this.state.calendars[calId].url}`;
							}
							else {
								return this.state.calendars[calId].subCalendars.map(subCal => {
									return `urls[]=${subCal.url}`;
								}).join('&');
							}
						}).join('&');
				} else {
					filename = `${calendarId}.ics`;
				}

				icsUrl = `${window.location.origin}/${filename}${search}`;
			}

			const showCalendarNames = searchParams.has('showCalendarNames');
			const showLocations = searchParams.has('showLocations');

			return (
				<div data-iframe-height>
					{activeEventNode}
					<h1>{calendar.calname}</h1>
					<FullCalendar trustedOrigins={this.state.TRUSTED_ORIGINS}
						apiKey={this.state.GOOGLE_CALENDAR_API_KEY}
						eventSources={eventSources}
						setActiveEvent={this.handleSetActiveEvent}
						setActiveEventId={this.handleSetActiveEventId}
						defaultView={calendarView}
						defaultDate={defaultDate}
						eventId={eventId}
						location={location}
						history={history}
						showCalendarNames={showCalendarNames}
						showLocations={showLocations} />
					<CalendarLegend calendars={calendars} calname={calendar.calname} />
					<Subscription url={icsUrl} />
			{
				(groupedCalendarListItems || calendarListItems) && (
					<div className="calendar-nav-container">
						<h2>Other calendars</h2>
						<nav className="calendar-nav">
				{
					groupedCalendarListItems && (
						<section>
							<h3>Calendar sets</h3>
							<ul>
								{groupedCalendarListItems}
							</ul>
						</section>
					)
				}
				{
					calendarListItems && (
						<section>
							<h3>Calendars</h3>
							<ul>
								{calendarListItems}
							</ul>
						</section>
					)
				}
						</nav>
					</div>
				)
			}
					<Options location={location} history={history} />

					<style jsx>{`
						h1 {
							font-size: 2.75em;
							font-weight: 500;
							text-align: center;
						}

						h2 {
							font-size: 2em;
							font-weight: normal;
						}

						ul :global(a.active) {
							pointer-events: none;
							text-decoration: none;
							cursor: auto;
							color: black;
						}

						.calendar-nav-container {
							padding: 0 2em;
						}

						@media (min-width: ${BREAKPOINTS.SMALL_DESKTOP}px) {

							.calendar-nav-container {
								padding: 0 3em;
							}
						}

						@media (min-width: ${BREAKPOINTS.LARGE_DESKTOP}px) {

							.calendar-nav-container {
								padding: 0 4em;
							}
						}

						.calendar-nav {
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;
							justify-content: space-around;
						}

						.calendar-nav section {
							flex-grow: 0;
							flex-shrink: 1;
							min-width: 15em;
						}

						@media print {

							h1 {
								margin: 0;
								font-size: 2em;
							}

							h2 {
								font-size: 1.5em;
							}

							.calendar-nav-container {
								display: none;
							}
						}
					`}</style>

				</div>
			);
		}
		else {
			switch(this.state.loaded) {
				case null:
				default:
					return (
						<div className="loading-container">
							<img src="/assets/spinner.gif" alt="Loading" />
							<style jsx>{`
								.loading-container {
									display: flex;
									justify-content: center;
									align-items: center;
									text-align: center;
									width: 100%;
									height: 100%;
								}
							`}</style>
						</div>
					);
				case true:
					return (
						<p>
							No calendar <code>{calendarId}</code> found.
						</p>
					);
				case false:
					return (
						<p>
							There was a problem loading calendar data.
						</p>
					);
			}
		}
	}

	handleSetActiveEventId(id, container) {
		let newLocation = Object.assign({}, this.props.location);
		newLocation.hash = id;

		this.props.history.push(newLocation);

		if (container) {
			this.setState({
				activeEventOriginalElement: container
			});
		}
	}

	handleSetActiveEvent(calEvent) {

		this.setState({
			activeEvent: calEvent
		});
	}

	handleUnsetActiveEvent(shouldPush = true) {
		if (shouldPush) {
			this.handleSetActiveEventId('');
		}

		this.setState({
			activeEvent: null,
			activeEventOriginalPosition: null
		});
	}

	handleChangeCustomCalendarIds(event) {
		const checkbox = event.target;

		this.setState(previousState => {
			let customCalendar = Object.assign({}, previousState.customCalendar);
			customCalendar.calendars = customCalendar.calendars.slice();
			if (checkbox.checked) {
				if (!customCalendar.calendars.includes(checkbox.value)) {
					customCalendar.calendars.push(checkbox.value);
					return {
						customCalendar
					};
				}
			}
			else {
				if (customCalendar.calendars.includes(checkbox.value)) {
					customCalendar.calendars.splice(customCalendar.calendars.indexOf(checkbox.value), 1);
					return {
						customCalendar
					};
				}
			}
		});
	}
}

App.propTypes = {
	envFile: PropTypes.string.isRequired,
	calendarId: PropTypes.string,
	eventId: PropTypes.string,
	search: PropTypes.string,

	location: PropTypes.shape({
		hash: PropTypes.string,
	}),
	history: PropTypes.shape({
		push: PropTypes.func.isRequired,
		listen: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(App);
