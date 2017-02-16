import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import FullCalendar from './FullCalendar.js';
import ActiveEvent from './ActiveEvent.js';
import CalendarLegend from './CalendarLegend.js';
import CustomGroupSelector from './CustomGroupSelector.js';
import Subscription from './Subscription.js';

import { BREAKPOINTS } from '../constants.js';
import { getEventSources } from '../utils.js';

export default class App extends Component {
	constructor(props){
		super(props);
		this.state = {
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

		this.handleSetActiveEvent = this.handleSetActiveEvent.bind(this);
		this.handleUnsetActiveEvent = this.handleUnsetActiveEvent.bind(this);
		this.handleChangeCustomCalendarIds = this.handleChangeCustomCalendarIds.bind(this);
	}
	
	componentDidMount(){
		fetch(this.props.envFile)
			.then(response => {
				return response.json();
			}).then(dotenv => {
				this.setState(Object.assign(dotenv, {loaded: true}));
				if(dotenv.GOOGLE_ANALYTICS_TRACKING_ID && window.ga){
					window.ga('create', dotenv.GOOGLE_ANALYTICS_TRACKING_ID, 'auto');
					window.ga('send', 'pageview');
				}
			}).catch(err => {
				this.setState({loaded: false});
				console.error(err);
			});
	}

	render(){
		const calendarId = this.props.calendarId || 'basic';

		// FIXME: This doesn't work if a calendar and a group share the same id
		let calendar = calendarId === 'custom'
			? this.state.customCalendar
			: this.state.calendarGroups[calendarId];
		let calendars;
		if(calendar){
			calendars = calendar.calendars.map(id => this.state.calendars[id]);
		}
		else {
			calendar = this.state.calendars[calendarId];
			calendars = calendar ? calendar.subCalendars || [calendar] : [];
		}

		if(calendar && calendars){
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
					<Link to={`/${id}`} activeClassName="active">
						{this.state.calendarGroups[id].calname}
					</Link>
				</li>
			));

			groupedCalendarListItems.push(
				<li key="custom">
					<Link to="/custom" activeClassName="active">
						Custom Group
					</Link>
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
					<Link to={`/${id}`} activeClassName="active">
						{this.state.calendars[id].calname}
					</Link>
				</li>
			));


			const icsFilename = calendarId === 'custom'
				? `combine.ics?${this.state.customCalendar.calendars
					.map(calId => {
						if(this.state.calendars[calId].url){
							return `urls[]=${this.state.calendars[calId].url}`;
						}
						else {
							return this.state.calendars[calId].subCalendars.map(subCal => {
								return `urls[]=${subCal.url}`;
							}).join('&');
						}
					}).join('&')}`
				: `${calendarId}.ics`;

			return (
				<div data-iframe-height>
					{activeEventNode}
					<h1>{calendar.calname}</h1>
					<FullCalendar apiKey={this.state.GOOGLE_CALENDAR_API_KEY}
						eventSources={eventSources}
						setActiveEvent={this.handleSetActiveEvent} />
					<Subscription icsFilename={icsFilename} />
					<CalendarLegend calendars={calendars} calname={calendar.calname} />
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
					<style jsx>
					{`
						h1 {
							font-size: 2.75em;
							font-weight: 500;
							text-align: center;
						}
						
						h2 {
							font-size: 2em;
							font-weight: normal;
						}
						
						a.active {
							pointer-events: none;
							text-decoration: none;
							cursor: auto;
							color: rgba($text-color, $primary-text);
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
					`}
					</style>
					
				</div>
			);
		}
		else {
			switch(this.state.loaded){
				case null:
				default:
					return (
						<div className="loading-container">
							<img src="/assets/spinner.gif" alt="Loading" />
							<style jsx>
							{`
								.loading-container {
									display: flex;
									justify-content: center;
									align-items: center;
									text-align: center;
									width: 100%;
									height: 100%;
								}
							`}
							</style>
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

	handleSetActiveEvent(calEvent, element){
		this.setState({
			activeEvent: calEvent,
			activeEventOriginalElement: element
		});
	}

	handleUnsetActiveEvent(){
		this.setState({
			activeEvent: null,
			activeEventOriginalPosition: null
		});
	}

	handleChangeCustomCalendarIds(event){
		const checkbox = event.target;

		this.setState(previousState => {
			let customCalendar = Object.assign({}, previousState.customCalendar);
			customCalendar.calendars = customCalendar.calendars.slice();
			if(checkbox.checked){
				if(!customCalendar.calendars.includes(checkbox.value)){
					customCalendar.calendars.push(checkbox.value);
					return {
						customCalendar
					};
				}
			}
			else {
				if(customCalendar.calendars.includes(checkbox.value)){
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
	calendarId: PropTypes.string,
	envFile: PropTypes.string
};
