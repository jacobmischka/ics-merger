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
			calendarId: 'basic',
			activeEvent: null
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
		let calendar = this.state.calendars[this.state.calendarId];
		if(calendar){
			let googleCalendarIds = calendar.ids;
			let eventSources = googleCalendarIds.map((id, index) => {
				let color = COLORS[index];
				return {
					googleCalendarId: id,
					eventDataTransform(eventData){
						return Object.assign(eventData, {
							color: color
						});
					}
				};
			});

			let activeEventNode = this.state.activeEvent
				? (
					<ActiveEvent event={this.state.activeEvent}
						originalPosition={this.state.activeEventOriginalPosition}
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
					No calendar
					<code>{this.state.calendarId}</code>
					found.
				</p>
			);
		}
	}

	handleSetActiveEvent(calEvent, position){
		this.setState({
			activeEvent: calEvent,
			activeEventOriginalPosition: position
		});
	}

	handleUnsetActiveEvent(){
		this.setState({
			activeEvent: null,
			activeEventOriginalPosition: null
		});
	}
}
