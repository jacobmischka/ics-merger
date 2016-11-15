import React from 'react';
import Color from 'color';

import FullCalendar from './FullCalendar.js';
import ActiveEvent from './ActiveEvent.js';

export default class App extends React.Component {
	constructor(){
		super();
		this.state = {
			GOOGLE_CALENDAR_API_KEY: '',
			calendars: [],
			calendarGroups: [],
			calendarId: 'basic',
			activeEvent: null,
			activeEventOriginalElement: null,
		};

		fetch('/.env.json')
			.then(response => {
				return response.json();
			}).then(dotenv => {
				this.setState(dotenv);
			}).catch(err => {
				console.error(err);
			});

		this.handleClickCalendarListItem = this.handleClickCalendarListItem.bind(this);
		this.handleSetActiveEvent = this.handleSetActiveEvent.bind(this);
		this.handleUnsetActiveEvent = this.handleUnsetActiveEvent.bind(this);
	}

	render(){
		// FIXME: This doesn't work if a calendar and a group share the same id
		let calendar = this.state.calendarGroups[this.state.calendarId];
		let calendars;
		if(calendar){
			calendars = calendar.calendars;
		}
		else {
			calendar = this.state.calendars[this.state.calendarId];
			calendars = [this.state.calendarId];
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
					<a href="#" data-id={id}
							onClick={this.handleClickCalendarListItem}>
						{this.state.calendarGroups[id].calname}
					</a>
				</li>
			));

			let calendarListItems = Object.keys(this.state.calendars).map(id => (
				<li key={`calendar-list-items-${id}`}>
					<a href="#" data-id={id}
							onClick={this.handleClickCalendarListItem}>
						{this.state.calendars[id].calname}
					</a>
				</li>
			));

			let calendarsInGroup;
			if(this.state.calendarGroups[this.state.calendarId]){
				calendarsInGroup = calendar.calendars.map(id => (
					<li className="calendar-legend-item" key={`in-group-${id}`}>
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
		{
			calendarsInGroup
				? (
					<div>
						<h2>Calendars in group</h2>
						<ul>
							{calendarsInGroup}
						</ul>
					</div>
				)
				: null
		}
		{
			groupedCalendarListItems || calendarListItems
				? (
					<div>
						<h2>All calendars</h2>
			{
				groupedCalendarListItems
					? (
						<div>
							<h3>Grouped calendars</h3>
							<ul>
								{groupedCalendarListItems}
							</ul>
						</div>
					)
					: null
			}
			{
				calendarListItems
					? (
						<div>
							<h3>Calendars</h3>
							<ul>
								{calendarListItems}
							</ul>
						</div>
					)
					: null
			}
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
					No calendar <code>{this.state.calendarId}</code> found.
				</p>
			);
		}
	}

	handleClickCalendarListItem(event){
		let calendarId = event.target.dataset.id;
		this.setState({calendarId});
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
