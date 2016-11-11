import React from 'react';
import Color from 'color';

import FullCalendar from './FullCalendar.js';

import { COLORS } from '../constants.js';

export default class App extends React.Component {
	constructor(){
		super();
		this.state = {
			GOOGLE_CALENDAR_API_KEY: '',
			calendars: [],
			calendarId: 'basic'
		};

		fetch('/.env.json')
			.then(response => {
				return response.json();
			}).then(dotenv => {
				this.setState(dotenv);
			}).catch(err => {
				console.error(err);
			});
	}

	render(){
		let calendar = this.state.calendars[this.state.calendarId];
		if(calendar){
			let googleCalendarIds = calendar.ids;
			let eventSources = googleCalendarIds.map((id, index) => {
				let color = Color(COLORS[index]);
				let backgroundColor = color.clone().alpha(0.34);
				let activeColor = color.clone().lighten(0.1);
				return {
					googleCalendarId: id,
					color: color.rgbString(),
					backgroundColor: backgroundColor.rgbString(),
					eventDataTransform(eventData){
						return Object.assign(eventData, {
							activeColor: activeColor.rgbString()
						});
					}
				};
			});

			return (
				<FullCalendar apiKey={this.state.GOOGLE_CALENDAR_API_KEY}
					eventSources={eventSources} />
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
}
