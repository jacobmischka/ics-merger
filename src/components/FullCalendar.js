import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import Color from 'color';

import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/gcal.js';
import 'fullcalendar/dist/fullcalendar.css';
import uniqueId from 'lodash/uniqueId';

import CalendarEvent from './CalendarEvent.js';

import { BREAKPOINTS, COLORS, OPACITIES } from '../constants.js';

const fcButtonHoverBackgroundColor = new Color(COLORS.ACCENT).alpha(OPACITIES.SECONDARY);

export default class FullCalendar extends Component {
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
			<div id={this.state.calendarId}>
				<style jsx global>
				{`
					h2 {
						font-size: 2em;
						font-weight: normal;
					}
					
					.event-container {
						background-color: ${COLORS.BACKGROUND};
						overflow: hidden;
					}
					
					.fc .fc-toolbar {
						display: flex;
						justify-content: space-between;
						flex-wrap: wrap;
					}
					
					.fc .fc-toolbar .fc-left {
						order: 1;
					}
					
					.fc .fc-toolbar .fc-center {
						order: 2;
					}
					
					.fc .fc-toolbar .fc-right {
						order: 3;
					}
					
					.fc button {
						height: auto;
					}
					
					.fc .fc-button {
						font-size: 1.1em;
						padding: 0.5em;
					}
										
					.fc .fc-button.fc-state-default {
						background: transparent;
						text-shadow: none;
						box-shadow: none;
						border: 2px solid ${COLORS.ACCENT};
						color: ${COLORS.ACCENT};
					}
					
					.fc .fc-button.fc-state-active {
						color: white;
						background: ${COLORS.ACCENT};
					}
					
					.fc .fc-button:hover,
					.fc .fc-button:focus {
						outline: none;
						color: white;
						background: ${fcButtonHoverBackgroundColor}
					}
					
					.fc .fc-button.fc-state-disabled {
						cursor: not-allowed;
						background: none;
						color: ${COLORS.ACCENT};
					}
					
					.fc-clear {
						display: none;
					}
					
					.fc-list-view .fc-scroller {
						/* HACK: Workaround for https://github.com/fullcalendar/fullcalendar/issues/3346 */
						height: auto !important;
					}
					
					@media (max-width: ${BREAKPOINTS.SMALL_DESKTOP}px) {
						.fc .fc-toolbar {
							justify-content: space-around;
						}
						
						.fc .fc-toolbar .fc-left {
							text-align: center;
							width: 100%;
						}
					}
				`}
				</style>
			</div>
		);
	}

	shouldComponentUpdate(nextProps){
		if(this.props.apiKey !== nextProps.apiKey)
			return true;

		let eventSourcesToAdd = nextProps.eventSources.filter(newEventSource =>
			!this.props.eventSources.some(oldEventSource =>
				oldEventSource.googleCalendarId === newEventSource.googleCalendarId
					&& oldEventSource.color === newEventSource.color)
		);

		let eventSourcesToRemove = this.props.eventSources.filter(oldEventSource =>
			!nextProps.eventSources.some(newEventSource =>
				newEventSource.googleCalendarId === oldEventSource.googleCalendarId
					&& newEventSource.color === oldEventSource.color)
		);

		const calendar = $(`#${this.state.calendarId}`);

		if(eventSourcesToRemove && eventSourcesToRemove.length > 0)
			calendar.fullCalendar('removeEventSources', eventSourcesToRemove);

		if(eventSourcesToAdd && eventSourcesToAdd.length > 0){
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

		$(`#${this.state.calendarId}`).fullCalendar(Object.assign({
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
				render(<CalendarEvent event={calEvent} view={view}
					setActive={setActive} />, div);
				return div;
			}
		}, this.props.fullcalendarConfig));
	}
}

FullCalendar.propTypes = {
	apiKey: PropTypes.string.isRequired,
	eventSources: PropTypes.array.isRequired,
	setActiveEvent: PropTypes.func,
	fullcalendarConfig: PropTypes.object
};
