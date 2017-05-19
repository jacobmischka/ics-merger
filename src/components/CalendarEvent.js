import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Color from 'color';

import { OPACITIES } from '../constants.js';

export default class CalendarEvent extends Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
		this.getEventTime = this.getEventTime.bind(this);
		this.getClassName = this.getClassName.bind(this);
	}

	render() {
		let eventTime = this.getEventTime();
		let className = this.getClassName();

		let color = Color(this.props.event.color);

		let style = {
			border: `1px solid ${color.rgb().string()}`,
			backgroundColor: color.alpha(0.3).rgb().string()
		};
		
		const ContainerElement = this.props.containerElement || 'div';

		return (
			<ContainerElement className={className} style={style}
					title={this.props.event.calendar.calname}
					onClick={this.handleClick}
					ref={container => this.container = container}>
				<span className="event-time">{eventTime}</span>
				<span className="event-title">{this.props.event.title}</span>
				<style jsx>
				{`
					:global(.event) {
						font-family: 'Noto Sans', sans-serif;
						color: rgba(0, 0, 0, ${OPACITIES.TEXT.primary});
						padding: 0.5em;
						margin: 1px;
						cursor: pointer;
						font-size: 0.75em;
					}
					
					.event-time {
						margin: 0 0.5em 0 0;
						text-transform: uppercase;
					}
					
					.event-title {
						word-wrap: break-word;
					}
					
					.event-desc {
						font-size: 0.75em;
						word-wrap: break-word;
						white-space: pre-line;
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
				`}
				</style>
			</ContainerElement>
		);
	}

	getEventTime() {
		let eventTime;
		if (this.props.event.allDay){
			eventTime = 'All day';
		}
		else {
			let start = this.props.event.start;
			let end = this.props.event.end;
			let startTime = start.format('h');
			if (start.get('minute') !== 0)
				startTime += `:${start.format('mm')}`;
			if (start.format('A') !== end.format('A'))
				startTime += ` ${start.format('A')}`;
			let endTime = end.get('minute') === 0
				? end.format('h A')
				: end.format('LT');

			eventTime = `${startTime} – ${endTime}`;
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
	containerElement: PropTypes.string
};
