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
		this.getCalendarState = this.getCalendarState.bind(this);
		this.receiveMessage = this.receiveMessage.bind(this);
	}

	render() {
		return (
			<div className="fullcalendar-container">
				<div id={this.state.calendarId}></div>
				<style jsx global>{`
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
				`}</style>
			</div>
		);
	}

	shouldComponentUpdate(nextProps){
		const propsToChange = [
			'apiKey',
			'showCalendarNames',
			'showLocations',
			'showDescriptions',
			'showPresenters'
		];
		for (let prop of propsToChange) {
			if (this.props[prop] !== nextProps[prop])
				return true;
		}

		let eventSourcesToAdd = nextProps.eventSources.filter(newEventSource =>
			!this.props.eventSources.some(oldEventSource =>
				oldEventSource.googleCalendarId === newEventSource.googleCalendarId
					&& oldEventSource.source === newEventSource.source
					&& oldEventSource.color === newEventSource.color)
		);

		let eventSourcesToRemove = this.props.eventSources.filter(oldEventSource =>
			!nextProps.eventSources.some(newEventSource =>
				newEventSource.googleCalendarId === oldEventSource.googleCalendarId
					&& oldEventSource.source === newEventSource.source
					&& newEventSource.color === oldEventSource.color)
		);

		const calendar = $(`#${this.state.calendarId}`);

		if (eventSourcesToRemove && eventSourcesToRemove.length > 0)
			calendar.fullCalendar('removeEventSources', eventSourcesToRemove);

		if (eventSourcesToAdd && eventSourcesToAdd.length > 0){
			eventSourcesToAdd.map(eventSourceToAdd => {
				calendar.fullCalendar('addEventSource', eventSourceToAdd);
			});
		}

		if (nextProps.location && nextProps.location.search) {
			let params = new URLSearchParams(nextProps.location.search.slice(1));

			let viewName = params.get('view');
			let viewDate = params.get('date');

			if (
				this.getGenericViewName(viewName) !== this.getGenericViewName(this.viewName)
				|| viewDate !== this.viewDate
			) {
				this.viewName = viewName;
				this.viewDate = viewDate;
				$(`#${this.state.calendarId}`)
					.fullCalendar(
						'changeView',
						this.getSpecificViewName(viewName),
						viewDate
					);
			}
		}

		return false;
	}

	componentDidMount() {
		this.createCalendar();

		if (this.props.trustedOrigins) {
			window.addEventListener('message', this.receiveMessage, false);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { eventId, setActiveEvent } = this.props;

		const calendar = $(`#${this.state.calendarId}`);

		if (nextProps.eventId && nextProps.eventId !== eventId) {
			let events = calendar.fullCalendar('clientEvents', nextProps.eventId);
			if (events.length > 0) {
				setActiveEvent(events[0]);
			}
		}
	}

	UNSAFE_componentWillUpdate() {
		this.destroyCalendar();
	}

	componentDidUpdate() {
		this.createCalendar();
	}

	componentWillUnmount() {
		this.destroyCalendar();
		window.removeEventListener('message', this.receiveMessage);
	}

	receiveMessage(event) {
		// Allow extracting calendar state by posting message from trusted origin,
		// useful when calendar is embedded in iframe.

		if (
			this.props.trustedOrigins
			&& (
				this.props.trustedOrigins.includes('*')
				|| this.props.trustedOrigins.includes(event.origin)
			)
			&& event.data === 'getCalendarState'
		) {
			const {
				customCalendars,
				showCalendarNames,
				showLocations,
				showDescriptions,
				showPresenters
			} = this.props;


			event.source.postMessage({
				action: 'calendarStateResponse',
				calendarName: this.props.location.pathname.slice(1),
				calendarEvent: this.props.location.hash.slice(1),
				calendarView: this.getGenericViewName(this.viewName),
				calendarDate: this.viewDate,
				customCalendars,
				showCalendarNames,
				showLocations,
				showDescriptions,
				showPresenters
			}, event.origin);
		}
	}

	getGenericViewName(viewName) {
		switch (viewName) {
			case 'listWeek':
			case 'basicWeek':
				return 'week';
			default:
				return viewName;
		}
	}

	getSpecificViewName(viewName) {
		switch (viewName) {
			case 'week':
				return window.innerWidth > BREAKPOINTS.SMALL_DESKTOP
					? 'basicWeek'
					: 'listWeek';
			default:
				return viewName;
		}
	}

	getCalendarState(view) {
		if (!this.props.history)
			return;

		let viewDate = view.intervalStart.toISOString();

		if (
			this.getSpecificViewName(this.viewName) !== view.name
			|| this.viewDate !== viewDate
		) {
			let newLocation = Object.assign({}, this.props.location);
			let params = new URLSearchParams(newLocation.search.slice(1));
			params.set('view', view.name);
			params.set('date', viewDate);

			newLocation.search = params.toString();

			this.viewName = view.name;
			this.viewDate = view.intervalStart.toString();
			this.props.history.push(newLocation);
		}
	}

	destroyCalendar() {
		$(`#${this.state.calendarId}`).fullCalendar('destroy');
	}

	createCalendar() {
		const {
			timezone = 'local',
			eventId,
			setActiveEventId,
			setActiveEvent,
			defaultDate,
			showCalendarNames,
			showLocations,
			showDescriptions,
			showPresenters
		} = this.props;

		let { defaultView } = this.props;

		if (defaultView)
			defaultView = this.getSpecificViewName(defaultView);
		else
			defaultView = window.innerWidth > BREAKPOINTS.SMALL_DESKTOP
				? 'month'
				: 'listWeek';

		this.viewName = defaultView;
		this.viewDate = defaultDate;

		const calendar = $(`#${this.state.calendarId}`);
		const getCalendarState = this.getCalendarState;

		calendar.fullCalendar(Object.assign({
			timezone,
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
			defaultDate,
			navLinks: true,
			eventRender(calEvent, element, view){
				if (calEvent.id) {
					const clientEvents = calendar.fullCalendar('clientEvents', otherEvent => {
						return otherEvent.id === calEvent.id
							&& otherEvent.start.valueOf() === calEvent.start.valueOf()
							&& otherEvent.end.valueOf() === calEvent.end.valueOf();
					});

					if (clientEvents.length > 1) {
						const firstEvent = clientEvents[0];

						if (firstEvent._id !== calEvent._id) {
							return false;
						}
					}
				}

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

				const showCalendarName = showCalendarNames
					|| (calEvent.calendar && calEvent.calendar.showCalendarName);

				render(
					<CalendarEvent event={calEvent} view={view}
						setActiveEventId={setActiveEventId}
						setActiveEvent={setActiveEvent}
						containerElement={calEventElement}
						showCalendarName={showCalendarName}
						showLocation={showLocations}
						showDescription={showDescriptions}
						showPresenters={showPresenters}
					/>,
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
			},
			viewRender: getCalendarState
		}, this.props.fullcalendarConfig));
	}
}

FullCalendar.propTypes = {
	trustedOrigins: PropTypes.array,
	apiKey: PropTypes.string.isRequired,
	eventSources: PropTypes.array.isRequired,
	customCalendars: PropTypes.array,
	setActiveEventId: PropTypes.func,
	setActiveEvent: PropTypes.func,
	eventId: PropTypes.string,
	fullcalendarConfig: PropTypes.object,
	defaultView: PropTypes.string,
	defaultDate: PropTypes.string,

	showCalendarNames: PropTypes.bool,
	showLocations: PropTypes.bool,
	showDescriptions: PropTypes.bool,
	showPresenters: PropTypes.bool,

	location: PropTypes.shape({
		pathname: PropTypes.string,
		hash: PropTypes.string,
		search: PropTypes.string
	}),
	history: PropTypes.shape({
		push: PropTypes.func.isRequired,
		listen: PropTypes.func.isRequired
	})
};
