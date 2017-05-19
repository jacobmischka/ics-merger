import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import Color from 'color';

import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/gcal.js';
import 'fullcalendar/dist/fullcalendar.css';
import uniqueId from 'lodash/uniqueId';

import CalendarEvent from './CalendarEvent.js';
import EmailGenerator from './EmailGenerator.js';

import { BREAKPOINTS, COLORS, OPACITIES } from '../constants.js';

const fcButtonHoverBackgroundColor = new Color(COLORS.ACCENT).alpha(OPACITIES.SECONDARY);

export default class FullCalendar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			calendarId: uniqueId()
		};

		this.createCalendar = this.createCalendar.bind(this);
		this.destroyCalendar = this.destroyCalendar.bind(this);
		this.fetchCurrentEvents = this.fetchCurrentEvents.bind(this);
	}

	render() {
		return (
			<div>
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
						
						.fc .fc-list-table .fc-list-heading,
						.fc .fc-list-table .fc-list-heading .fc-widget-header {
							width: 100%;
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
						
						@media print {
							
							h2 {
								font-size: 1.25em;
							}
							
							.fc .fc-body .fc-day-number {
								font-size: 0.75em;
							}
							
							.fc .fc-head-container.fc-widget-header,
							.fc .fc-list-table .fc-widget-header {
								font-size: 0.7em;
							}
							
							.fc .fc-list-table .fc-widget-header {
								padding: 0.2em 0.75em;
							}

							.fc .fc-toolbar .fc-center,
							.fc .fc-toolbar .fc-right {
								display: none;
							}
							
							.fc-today {
								background: none !important;
							}
						}
					`}
					</style>
				</div>
		{
			this.props.admin && (
				<EmailGenerator getEvents={this.fetchCurrentEvents} />
			)
		}
			</div>
		);
	}
	
	shouldComponentUpdate(nextProps) {
		if (this.props.apiKey !== nextProps.apiKey)
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

		if (eventSourcesToRemove && eventSourcesToRemove.length > 0)
			calendar.fullCalendar('removeEventSources', eventSourcesToRemove);

		if (eventSourcesToAdd && eventSourcesToAdd.length > 0) {
			eventSourcesToAdd.map(eventSourceToAdd => {
				calendar.fullCalendar('addEventSource', eventSourceToAdd);
			});
		}

		return false;
	}

	componentDidMount() {
		this.createCalendar();
	}
	
	componentWillReceiveProps(nextProps) {
		const { eventId, setActiveEvent } = this.props;
		
		const calendar = $(`#${this.state.calendarId}`);
		
		if (nextProps.eventId && nextProps.eventId !== eventId) {
			let events = calendar.fullCalendar('clientEvents', nextProps.eventId);
			if (events.length > 0) {
				setActiveEvent(events[0]);
			}
		}
	}

	componentWillUpdate() {
		this.destroyCalendar();
	}

	componentDidUpdate() {
		this.createCalendar();
	}

	componentWillUnmount() {
		this.destroyCalendar();
	}

	destroyCalendar() {
		$(`#${this.state.calendarId}`).fullCalendar('destroy');
	}

	createCalendar() {
		const { eventId, setActiveEventId, setActiveEvent } = this.props;
		let { defaultView } = this.props;

		if (!defaultView)
			defaultView = window.innerWidth > BREAKPOINTS.SMALL_DESKTOP
				? 'month'
				: 'listWeek';
		
		const calendar = $(`#${this.state.calendarId}`);

		calendar.fullCalendar(Object.assign({
			googleCalendarApiKey: this.props.apiKey,
			eventSources: this.props.eventSources,
			height: 'auto',
			fixedWeekCount: false,
			header: {
				left: 'title',
				center: 'month,listWeek,basicWeek,agendaDay',
				right: 'today prev,next'
			},
			defaultView,
			navLinks: true,
			eventRender(calEvent, element, view) {
				let container, calEventElement;
				if (view && view.name && view.name.startsWith('list')) {
					container = document.createElement('tr');
					calEventElement = 'td';
				} else {
					container = document.createElement('div');
					calEventElement = 'div';
				}
				
				container.className = 'event-container';
				
				if (view && view.name && view.name.startsWith('agenda'))
					container.style.position = 'absolute';
					
				render(<CalendarEvent event={calEvent} view={view}
					setActiveEventId={setActiveEventId}
					setActiveEvent={setActiveEvent}
					containerElement={calEventElement} />,
					container);
				return container;
			},
			loading(isLoading) {
				if (!isLoading) {
					if (eventId) {
						let events = calendar.fullCalendar('clientEvents', eventId);
						if (events.length > 0) {
							setActiveEvent(events[0]);
						}
					}
				}
			}
		}, this.props.fullcalendarConfig));
	}
	
	fetchCurrentEvents() {
		const calendar = $(`#${this.state.calendarId}`);
		const events = calendar.fullCalendar('clientEvents');
		const view = calendar.fullCalendar('getView');
		
		const viewEvents = events.filter(event => (
			event.end >= view.start
			&& event.start <= view.end
		));
		
		viewEvents.sort((a, b) => a.start.valueOf() - b.start.valueOf());
		
		return viewEvents;
	}
}

FullCalendar.propTypes = {
	apiKey: PropTypes.string.isRequired,
	eventSources: PropTypes.array.isRequired,
	setActiveEventId: PropTypes.func,
	setActiveEvent: PropTypes.func,
	eventId: PropTypes.string,
	fullcalendarConfig: PropTypes.object,
	defaultView: PropTypes.string,
	admin: PropTypes.bool
};
