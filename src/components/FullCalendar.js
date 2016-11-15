import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/gcal.js';
import uniqueId from 'lodash/uniqueId';

import CalendarEvent from './CalendarEvent.js';

export default class FullCalendar extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			calendarId: uniqueId()
		};

		this.createCalendar = this.createCalendar.bind(this);
		this.destroyCalendar = this.destroyCalendar.bind(this);
	}

	render(){
		return (
			<div id={this.state.calendarId}></div>
		);
	}

	shouldComponentUpdate(nextProps){
		if(this.props.apiKey !== nextProps.apiKey)
			return true;

		if(this.props.eventSources.length !== nextProps.eventSources.length)
			return true;

		for(let i = 0; i < this.props.eventSources.length; i++){
			if(!this.props.eventSources[i] || !nextProps.eventSources[i]
					|| this.props.eventSources[i].googleCalendarId !==
					nextProps.eventSources[i].googleCalendarId)
				return true;
		}

		return false;
	}

	componentDidMount(){
		this.createCalendar();
	}

	componentWillUpdate(){
		this.destroyCalendar();
	}

	componentDidUpdate(){
		this.createCalendar();
	}

	componentWillUnmount(){
		this.destroyCalendar();
	}

	destroyCalendar(){
		$(`#${this.state.calendarId}`).fullCalendar('destroy');
	}

	createCalendar(){
		const setActive = this.props.setActiveEvent;

		$(`#${this.state.calendarId}`).fullCalendar({
			googleCalendarApiKey: this.props.apiKey,
			eventSources: this.props.eventSources,
			height: 'auto',
			fixedWeekCount: false,
			header: {
				left: 'title',
				center: 'month,agendaWeek,agendaDay',
				right: 'today prev,next'
			},
			navLinks: true,
			eventRender(calEvent, element, view){
				let div = document.createElement('div');
				div.className = 'event-container';
				if(view && view.name && view.name.startsWith('agenda'))
					div.style.position = 'absolute';
				ReactDOM.render(<CalendarEvent event={calEvent} view={view}
					setActive={setActive} />, div);
				return div;
			}
		});
	}
}

FullCalendar.propTypes = {
	apiKey: React.PropTypes.string.isRequired,
	eventSources: React.PropTypes.array.isRequired,
	setActiveEvent: React.PropTypes.func
};
