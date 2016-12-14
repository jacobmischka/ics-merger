import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/gcal.js';
import uniqueId from 'lodash/uniqueId';

import CalendarEvent from './CalendarEvent.js';
import { BREAKPOINTS } from '../constants.js';

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

		let prevCalendarIds = this.props.eventSources.map(eventSource => eventSource.googleCalendarId);
		let nextCalendarIds = nextProps.eventSources.map(eventSource => eventSource.googleCalendarId);

		let eventSourcesToAdd = nextProps.eventSources.filter(eventSource => {
			return !prevCalendarIds.includes(eventSource.googleCalendarId);
		});

		let eventSourcesToRemove = this.props.eventSources.filter(eventSource => {
			return !nextCalendarIds.includes(eventSource.googleCalendarId);
		});

		const calendar = $(`#${this.state.calendarId}`);

		console.log(eventSourcesToAdd, eventSourcesToRemove);

		if(eventSourcesToRemove)
			calendar.fullCalendar('removeEventSources', eventSourcesToRemove);

		if(eventSourcesToAdd){
			eventSourcesToAdd.map(eventSourceToAdd => {
				calendar.fullCalendar('addEventSource', eventSourceToAdd);
			});
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

		const defaultView = window.innerWidth > BREAKPOINTS.SMALL_DESKTOP
			? 'month'
			: 'listWeek';

		$(`#${this.state.calendarId}`).fullCalendar({
			googleCalendarApiKey: this.props.apiKey,
			eventSources: this.props.eventSources,
			height: 'auto',
			fixedWeekCount: false,
			header: {
				left: 'title',
				center: 'month,listWeek,agendaDay',
				right: 'today prev,next'
			},
			defaultView,
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
