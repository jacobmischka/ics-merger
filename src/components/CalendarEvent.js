import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import striptags from 'striptags';
import LinkifyIt from 'linkify-it';
import moment from 'moment-timezone';

import MapPin from 'react-feather/dist/icons/map-pin.js';
import User from 'react-feather/dist/icons/user.js';
import Users from 'react-feather/dist/icons/users.js';

import { OPACITIES } from '../constants.js';

const linkify = new LinkifyIt();

export default class CalendarEvent extends Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
		this.getEventTime = this.getEventTime.bind(this);
		this.getClassName = this.getClassName.bind(this);
	}

	markupDescription(description) {
		description = striptags(description, [
				'a',
				'i',
				'b',
				'br',
				'p'
			]);

		if (description && linkify.test(description)) {
			linkify.match(description).map(match => {
				description = description.replace(match.raw,
					`<a href="${match.url}" target="_blank" rel="noopener noreferrer">${match.text}</a>`);
			});
		}

		return {__html: description};
	}

	renderEventLocation(location) {
		if (!location)
			return;

		if (typeof location === 'string')
			return location;
		if (location.name)
			return location.name;
	}

	render() {
		const {
			event,
			showLocation,
			showCalendarName,
			showDescription,
			showPresenters
		} = this.props;

		let eventTime = this.getEventTime();
		let className = this.getClassName();

		let color = Color(event.color);

		let style = {
			border: `1px solid ${color.rgb().string()}`,
			backgroundColor: color.alpha(0.3).rgb().string()
		};

		const ContainerElement = this.props.containerElement || 'div';

		return (
			<ContainerElement className={className} style={style}
					title={event.calendar.calname}
					onClick={this.handleClick}
					ref={container => this.container = container}>

				<span className="event-time">{eventTime}</span>
				<span className="event-title">
					{showCalendarName && (
						<span className="event-calendar">{event.calendar.calname}</span>
					)}
					{event.title}
				</span>
				{showLocation && event.location && (
					<span className="event-location">
						<MapPin />
						{this.renderEventLocation(event.location)}
					</span>
				)}
				{showPresenters && event.presenters && event.presenters.length > 0 && (
					<span className="event-presenters">
						{event.presenters.length === 1
							? (<User />)
							: ( <Users />)
						}
						{event.presenters.map(presenter => presenter.name).join(', ')}
					</span>
				)}
				{showDescription && event.description && (
					<div className="event-desc"
						dangerouslySetInnerHTML={this.markupDescription(event.description)}>
					</div>
				)}
				<style jsx>{`
					:global(.event) {
						font-family: 'Noto Sans', sans-serif;
						color: rgba(0, 0, 0, ${OPACITIES.TEXT.PRIMARY});
						padding: 0.5em;
						margin: 1px;
						cursor: pointer;
						font-size: 0.75em;
					}

					.event-calendar {
						margin: 0 0.5em 0 0;
						color: rgba(0, 0, 0, ${OPACITIES.TEXT.SECONDARY});
					}

					.event-location {
						display: block;
						margin: 0.5em 0 0;
						color: rgba(0, 0, 0, ${OPACITIES.TEXT.SECONDARY});
					}

					.event-presenters {
						display: block;
						margin: 0.5em 0 0;
						color: rgba(0, 0, 0, ${OPACITIES.TEXT.SECONDARY});
					}

					:global(.event) :global(svg) {
						width: 1em;
						height: 1em;
						overflow: visible;
						margin-right: 0.25em;
					}

					.event-time {
						margin: 0 0.5em 0 0;
						text-transform: uppercase;
					}

					.event-title {
						word-wrap: break-word;
					}

					.event-desc {
						font-size: 0.9em;
						word-wrap: break-word;
						white-space: pre-line;
						color: rgba(0, 0, 0, ${OPACITIES.TEXT.SECONDARY});
					}

					.event-desc,
					.event-desc p {
						margin-top: 1em;
						margin-bottom: 1em;
					}

					:global(.event.all-day) .event-time {
						display: inline-block;
						text-align: center;
						background: #bfbfbf;
						border-radius: 2px;
						padding: 0.15em 0.5em;
						white-space: nowrap;
					}

					@media print {

						:global(.event) {
							font-size: 0.6em;
						}
					}
				`}</style>
			</ContainerElement>
		);
	}

	getEventTime() {
		let eventTime;

		try {
			const { event } = this.props;
			if (event.allDay) {
				eventTime = (
					<span>All day</span>
				);
			} else {
				let start = moment(event.start).tz(moment.tz.guess());
				let end = moment(event.end).tz(moment.tz.guess());
				let startTime = start.format('h');
				if (start.get('minute') !== 0)
					startTime += `:${start.format('mm')}`;
				if (start.format('A') !== end.format('A'))
					startTime += ` ${start.format('A')}`;
				let endTime = end.get('minute') === 0
					? end.format('h A')
					: end.format('LT');

				eventTime = (
					<span>
						<time className="event-time-start"
							dateTime={start.toISOString()}
						>
							{startTime}
						</time>
						{` – `}
						<time className="event-time-end"
							dateTime={end.toISOString()}
						>
							{endTime}
						</time>
					</span>
				);
			}
		} catch (err) {
			console.error(err);
		}

		return eventTime;
	}

	getClassName() {
		let className = 'event';
		if (this.props.event.allDay)
			className += ' all-day';

		return className;
	}

	handleClick(clickEvent) {
		clickEvent.preventDefault();

		const { event, setActiveEvent, setActiveEventId } = this.props;

		setActiveEventId(event.id, this.container);
		setActiveEvent(event);
	}
}

CalendarEvent.propTypes = {
	setActiveEvent: PropTypes.func.isRequired,
	setActiveEventId: PropTypes.func.isRequired,
	event: PropTypes.object.isRequired,
	view: PropTypes.object,
	containerElement: PropTypes.string,
	showLocation: PropTypes.bool,
	showCalendarName: PropTypes.bool,
	showDescription: PropTypes.bool,
	showPresenters: PropTypes.bool
};

CalendarEvent.defaultProps = {
	showLocation: false,
	showCalendarName: false,
	showDescription: false,
	showPresenters: false
};
