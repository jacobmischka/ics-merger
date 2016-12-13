import React from 'react';
import { Link } from 'react-router';

import FullCalendar from './FullCalendar.js';
import ActiveEvent from './ActiveEvent.js';
import CalendarLegend from './CalendarLegend.js';
import Subscription from './Subscription.js';

export default class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			GOOGLE_CALENDAR_API_KEY: '',
			calendars: [],
			calendarGroups: [],
			customCalendar: {
				calname: 'Custom Calendar',
				calendars: []
			},
			activeEvent: null,
			activeEventOriginalElement: null,
			loaded: null
		};

		fetch('/.env.json')
			.then(response => {
				return response.json();
			}).then(dotenv => {
				this.setState(Object.assign(dotenv, {loaded: true}));
			}).catch(err => {
				this.setState({loaded: false});
				console.error(err);
			});

		this.handleSetActiveEvent = this.handleSetActiveEvent.bind(this);
		this.handleUnsetActiveEvent = this.handleUnsetActiveEvent.bind(this);
	}

	render(){
		const calendarId = this.props.params && this.props.params.calendarId
			? this.props.params.calendarId
			: 'basic';

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
			let eventSources = [];
			for(let calendar of calendars){
				if(calendar){
					let color = calendar.color;
					let googleCalendarId = calendar.googleCalendarId;
					if(googleCalendarId){
						eventSources.push({
							googleCalendarId: googleCalendarId,
							eventDataTransform(eventData){
								return Object.assign(eventData, {
									color: color,
									calendar: calendar
								});
							}
						});
					}
					if(calendar.subCalendars){
						for(let subCalendar of calendar.subCalendars){
							eventSources.push({
								googleCalendarId: subCalendar.googleCalendarId,
								eventDataTransform(eventData){
									return Object.assign(eventData, {
										color: color,
										calendar: calendar
									});
								}
							});
						}
					}
				}
			}

			let activeEventNode = this.state.activeEvent
				? (
					<ActiveEvent event={this.state.activeEvent}
						originalElement={this.state.activeEventOriginalElement}
						onClose={this.handleUnsetActiveEvent}/>
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
					.map(calId => `urls[]=${this.state.calendars[calId].url}`).join('&')}`
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
			groupedCalendarListItems || calendarListItems
				? (
					<div className="calendar-nav-container">
						<h2>Other calendars</h2>
						<nav className="calendar-nav">
				{
					groupedCalendarListItems
						? (
							<section>
								<h3>Calendar sets</h3>
								<ul>
									{groupedCalendarListItems}
								</ul>
							</section>
						)
						: null
				}
				{
					calendarListItems
						? (
							<section>
								<h3>Calendars</h3>
								<ul>
									{calendarListItems}
								</ul>
							</section>
						)
						: null
				}
						</nav>
					</div>
				)
				: null
		}
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
}

App.propTypes = {
	params: React.PropTypes.object
};
