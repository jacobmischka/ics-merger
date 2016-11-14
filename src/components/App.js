import React from 'react';

import FullCalendar from './FullCalendar.js';
import ActiveEvent from './ActiveEvent.js';

import { COLORS } from '../constants.js';

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

		this.handleSetActiveEvent = this.handleSetActiveEvent.bind(this);
		this.handleUnsetActiveEvent = this.handleUnsetActiveEvent.bind(this);
	}

	render(){
		let calendar = this.state.calendarGroups[this.state.calendarId];
		if(calendar){
			let calendars = calendar.calendars;
			let eventSources = calendars.map((id, index) => {
				let calendar = this.state.calendars[id];
				let googleCalendarId = calendar.googleCalendarId;
				let color = COLORS[index];
				if(calendar && googleCalendarId && color){
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
			});

			let activeEventNode = this.state.activeEvent
				? (
					<ActiveEvent event={this.state.activeEvent}
						originalElement={this.state.activeEventOriginalElement}
						onClose={this.handleUnsetActiveEvent}/>
				)
				: null;

			return (
				<div>
					{activeEventNode}
					<FullCalendar apiKey={this.state.GOOGLE_CALENDAR_API_KEY}
						eventSources={eventSources}
						setActiveEvent={this.handleSetActiveEvent} />
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
