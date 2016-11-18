import React from 'react';
import { Link } from 'react-router';
import Color from 'color';

import FullCalendar from './FullCalendar.js';
import ActiveEvent from './ActiveEvent.js';
import Subscription from './Subscription.js';

export default class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			GOOGLE_CALENDAR_API_KEY: '',
			calendars: [],
			calendarGroups: [],
			activeEvent: null,
			activeEventOriginalElement: null
		};

		fetch('/.env.json')
			.then(response => {
				return response.json();
			}).then(dotenv => {
				this.setState(dotenv);
			}).catch(err => {
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
		let calendar = this.state.calendarGroups[calendarId];
		let calendars;
		if(calendar){
			calendars = calendar.calendars;
		}
		else {
			calendar = this.state.calendars[calendarId];
			calendars = [calendarId];
		}

		if(calendar && calendars){
			let eventSources = calendars.map(id => {
				let calendar = this.state.calendars[id];
				if(calendar){
					let color = calendar.color;
					let googleCalendarId = calendar.googleCalendarId;
					if(googleCalendarId){
						return {
							googleCalendarId: googleCalendarId,
							eventDataTransform(eventData){
								return Object.assign(eventData, {
									color: color,
									calendar: calendar
								});
							}
						};
					}
				}
			});

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

			let calendarListItems = Object.keys(this.state.calendars).map(id => (
				<li key={`calendar-list-items-${id}`}>
					<Link to={`/${id}`} activeClassName="active">
						{this.state.calendars[id].calname}
					</Link>
				</li>
			));

			let calendarsInGroup;
			if(this.state.calendarGroups[calendarId]){
				calendarsInGroup = calendar.calendars.map(id => (
					<li className="legend-list-item" key={`in-group-${id}`}>
						<span className="calendar-legend-color" style={{
								backgroundColor: Color(this.state.calendars[id].color).alpha(0.3).rgbString(),
								border: `1px solid ${this.state.calendars[id].color}`
							}}>
						</span>
						{this.state.calendars[id].calname}
					</li>
				));
			}

			return (
				<div>
					{activeEventNode}
					<h1>{calendar.calname}</h1>
					<FullCalendar apiKey={this.state.GOOGLE_CALENDAR_API_KEY}
						eventSources={eventSources}
						setActiveEvent={this.handleSetActiveEvent} />
					<Subscription calendarId={calendarId} />
		{
			calendarsInGroup
				? (
					<div className="calendar-legend-container">
						<div className="calendar-legend">
							<span className="legend-title">
								Calendars in {calendar.calname}
							</span>
							<ul className="legend-list">
								{calendarsInGroup}
							</ul>
						</div>
					</div>
				)
				: null
		}
		{
			groupedCalendarListItems || calendarListItems
				? (
					<div className="calendar-nav-container">
						<h2>All calendars</h2>
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
			return (
				<p>
					No calendar <code>{calendarId}</code> found.
				</p>
			);
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
