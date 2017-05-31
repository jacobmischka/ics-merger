import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LinkifyIt from 'linkify-it';

import moment from 'moment';

import { COLORS, OPACITIES } from '../constants.js';

const linkify = new LinkifyIt();

export default class SimpleEvent extends Component {
	constructor(props) {
		super(props);
		
		this.getEventDate = this.getEventDate.bind(this);
		this.getEventTime = this.getEventTime.bind(this);
		this.markupDescription = this.markupDescription.bind(this);
	}
	
	getEventDate() {
		const sameDay = moment(this.props.event.start).isSame(moment(this.props.event.end), 'day');
		const sameDayAllDay = this.props.event.allDay && moment(this.props.event.start)
			.isSame(moment(this.props.event.end).clone().subtract(1, 'day'));
			
		if (sameDay || sameDayAllDay) {
			return moment(this.props.event.start).format('ll');
		} else {
			let startDate, endDate;
			if (moment(this.props.event.start).isSame(moment(this.props.event.end), 'year')) {
				startDate = moment(this.props.event.start).format('MMM D');
				endDate = moment(this.props.event.end).format('ll');

			}
			else {
				const dateFormat = 'll';
				startDate = moment(this.props.event.start).format(dateFormat);
				endDate = moment(this.props.event.end).format(dateFormat);
			}
			
			const style = {
				whiteSpace: 'nowrap'
			};

			return (
				<span>
					<span style={style}>{startDate}</span>
					<span> - </span>
					<span style={style}>{endDate}</span>
				</span>
			);
		}
	}
	
	getEventTime() {
		let eventTime;
		if (this.props.event.allDay){
			eventTime = 'All day';
		}
		else {
			let start = moment(this.props.event.start);
			let end = moment(this.props.event.end);
			let startTime = start.format('h');
			if (start.get('minute') !== 0)
				startTime += `:${start.format('mm')}`;
			if (start.format('A') !== end.format('A'))
				startTime += ` ${start.format('A')}`;
			let endTime = end.get('minute') === 0
				? end.format('h A')
				: end.format('LT');

			eventTime = `${startTime} - ${endTime}`;
		}

		return eventTime;
	}
	
	markupDescription(description) {
		if (description && linkify.test(description)) {
			linkify.match(description).map(match => {
				description = description.replace(match.raw,
					`<a href="${match.url}" target="_blank" rel="noopener noreferrer">${match.text}</a>`);
			});
		}

		return {__html: description};
	}
	
	render() {
		const eventDate = this.getEventDate();
		const eventTime = this.getEventTime();
		
		const eventStyle = {
			border: 'solid 1px grey',
			margin: '0.5em',
			color: `rgba(0, 0, 0, ${OPACITIES.TEXT.PRIMARY})`,
			fontFamily: 'sans-serif'
		};
		
		const headerStyle = {
			width: '40%',
			height: '100%',
			padding: '0.5em',
			boxShadow: `0 0 5px 0 ${COLORS.SHADOW}`,
			borderRight: `solid 5px ${this.props.event.color}`,
			backgroundColor: COLORS.BACKGROUND
		};
		
		const headerColorStyle = {
			
		};
		
		const contentStyle = {
			width: '55%',
			height: '100%',
			padding: '0.5em'
		};
		
		const dateTimeStyle = {
			textAlign: 'center'
		};
		
		const dateStyle = {
			display: 'block'
		};
		
		const timeStyle = {
			display: 'block'
		};	
		
		const detailsStyle = {
			
		};
		
		const calnameStyle = {
			display: 'block',
			fontSize: '0.8em',
			color: `rgba(0, 0, 0, ${OPACITIES.TEXT.SECONDARY})`
		};
		
		const titleStyle = {
			display: 'block'
		};
		
		const locationStyle = {
			display: 'block'
		};
		
		return (
			<div className="simple-event" style={eventStyle}>
				<header style={headerStyle}>
					<div style={dateTimeStyle}>
						<span style={dateStyle}>{eventDate}</span>
						<span style={timeStyle}>{eventTime}</span>
					</div>
					<div style={detailsStyle}>
						<span style={calnameStyle}>
							{this.props.event.calendar.calname}
						</span>
			{
				this.props.eventLink
					? (
						<a href={this.props.eventLink} style={titleStyle}>
							{this.props.event.title}
						</a>
					)
					: (
						<span style={titleStyle}>
							this.props.event.title
						</span>
					)
			}
				{
					this.props.event.location && (
						<span style={locationStyle}>
							{this.props.event.location}
						</span>
					)
				}
					</div>
					<div style={headerColorStyle}></div>
				</header>
				<div style={contentStyle}>
					<p dangerouslySetInnerHTML={this.markupDescription(this.props.event.description)}>
					</p>
				</div>
			</div>
		);
	}
}

SimpleEvent.propTypes = {
	event: PropTypes.object.isRequired,
	eventLink: PropTypes.string
};

