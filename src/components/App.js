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
import CalendarTree from './CalendarTree.js';

import { BREAKPOINTS } from '../constants.js';
import {
	getCalendars,
	filterHiddenCalendars,
	replaceCalendarMacros,
	getAliases
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
			calendarTree: null,
			calendarGroupTree: null,
			aliases: null,
			activeEvent: null,
			activeEventOriginalElement: null,
			loaded: null
		};

		this.redirectAlias = this.redirectAlias.bind(this);
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
				const aliases = getAliases(dotenv);
				this.setState(Object.assign(dotenv, {loaded: true, aliases}), () => {
					this.redirectAlias();
				});

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
		this.redirectAlias();
	}

	render() {
		const { calendarId, eventId, search, location, history } = this.props;
		const { calendar, calendars, calendarMap, eventSources } = getCalendars(
			calendarId,
			this.state.calendars,
			this.state.calendarGroups,
			this.state.customCalendar
		);
		const allCalendarLikes = Object.assign(
			{},
			this.state.calendars,
			this.state.calendarGroups
		);
		const searchParams = new URLSearchParams(this.props.search.slice(1));
		const calendarView = searchParams.get('view');
		const defaultDate = searchParams.get('date');

		// console.log({ calendar, calendars, eventSources });

		if (calendar && calendars && eventSources) {
			let activeEventNode = this.state.activeEvent
				? (
					<ActiveEvent event={this.state.activeEvent}
						originalElement={this.state.activeEventOriginalElement}
						onClose={this.handleUnsetActiveEvent} />
				)
				: null;

			const groupedCalendarListItems = (
				<CalendarTree calendars={allCalendarLikes}
						calendarTree={this.state.calendarGroupTree}
						container="section"
						label={<h3>Calendar groups</h3>}
						keyPrefix="calendar-group-list-tree"
						render={(id, cal) => (
							<li key={`grouped-calendar-list-items-${id}`}>
								<NavLink to={{pathname: `/${id}`, search}}>
									{cal.calname}
								</NavLink>
							</li>
						)}>
					<li key="custom">
						<NavLink to={{pathname: '/custom', search}}>
							Custom Group
						</NavLink>
					</li>
				</CalendarTree>
			);

			const calendarListTree = calendarId === 'custom'
				? (
					<CustomGroupSelector calendars={this.state.calendars}
						calendarTree={this.state.calendarTree}
						customCalendarIds={this.state.customCalendar.calendars}
						handleChangeCustomCalendarIds={this.handleChangeCustomCalendarIds} />
				)
				: (
					<CalendarTree calendars={calendarMap}
						container="section"
						label={<h3>Calendars in {calendar.calname}</h3>}
						keyPrefix="calendar-list-tree"
						render={(id, cal) => (
							<li key={`calendar-list-items-${id}`}>
								<NavLink to={{pathname: `/${id}`, search}}>
									{cal.calname}
								</NavLink>
							</li>
						)} />
				);

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
				(groupedCalendarListItems || calendarListTree) && (
					<div className="calendar-nav-container">
						<h2>Other calendars</h2>
						<nav className="calendar-nav">
							{ groupedCalendarListItems }
							{ calendarListTree }
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

						:global(a.active) {
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

	redirectAlias() {
		const { aliases } = this.state;
		const { calendarId, history, location } = this.props;

		if (aliases && aliases.has(calendarId)) {
			let newLocation = Object.assign({}, location, {
				pathname: `/${aliases.get(calendarId)}`
			});

			history.push(newLocation);
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
