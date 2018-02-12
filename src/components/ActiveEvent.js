import React from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import LinkifyIt from 'linkify-it';

import CalendarEvent from './CalendarEvent.js';
import AddToCalendar from './AddToCalendar.js';

import { BREAKPOINTS, OPACITIES, COLORS } from '../constants.js';
import { rgbaOverRgb } from '../utils.js';

const linkify = new LinkifyIt();

export default class ActiveEvent extends CalendarEvent {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false
		};

		this.getEventDate = this.getEventDate.bind(this);
		this.markupDescription = this.markupDescription.bind(this);
		this.handleOutsideClick = this.handleOutsideClick.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	getEventDate() {
		const { event } = this.props;

		const sameDay = event.start.isSame(event.end, 'day');
		const sameDayAllDay = event.allDay && event.start
			.isSame(event.end.clone().subtract(1, 'day'));
		if (sameDay || sameDayAllDay) {
			return event.start.format('ll');
		}
		else {
			let startDate, endDate;
			if (event.start.isSame(event.end, 'year')) {
				startDate = event.start.format('MMM D');
				endDate = event.end.format('ll');

			}
			else {
				const dateFormat = 'll';
				startDate = event.start.format(dateFormat);
				endDate = event.end.format(dateFormat);
			}

			return (
				<span>
					<span className="start-date">{startDate}</span>
					<span> – </span>
					<span className="end-date">{endDate}</span>
				</span>
			);
		}
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
		const { event, showFooter } = this.props;

		let style;
		if (!this.state.expanded) {
			let rect = this.props.originalElement
				? this.props.originalElement.getBoundingClientRect()
				: {
					top: 1,
					right: 1,
					bottom: 1,
					left: 1,
					width: 0,
					height: 0
				};

			let left = rect.left - 1;
			let top = rect.top - 1;

			let backgroundColor = rgbaOverRgb(Color(event.color).alpha(0.3).array());
			let borderColor = event.color;

			style = {
				width: rect.width * 2,
				height: rect.height * 2,
				transform: `translate(calc(${left}px - 25%), calc(${top}px - 25%)) scale(0.5)`,
				backgroundColor: backgroundColor,
				border: `2px solid ${borderColor}`
			};
		}

		let eventTime = this.getEventTime();
		let eventDate = this.getEventDate();
		let className = this.getClassName();
		className += ' active-event';
		if (this.state.expanded)
			className += ' expanded';

		let headerStyle;
		if (this.state.expanded) {
			headerStyle = {
				borderBottom: `5px solid ${event.color}`
			};
		}

		return (
			<div key="active-event" className={className} style={style}
					ref={div => this.container = div}>
				<header style={headerStyle} ref={header => this.header = header}>
					<span className="event-date-time">
						<span className="event-date">{eventDate}</span>
						<span className="event-time">{eventTime}</span>
					</span>
					<span className="event-title">
						<span className="event-calendar">
							{event.calendar.calname}
						</span>
						{event.title}
					</span>
					<button type="button" className="close" onClick={this.handleClick}
							title="Close active event">
						×
					</button>
				</header>

		{
			(event.description || event.location) && (
				<div className="event-desc">
			{
				event.location && (
					<span className="event-location">
						{event.location}
					</span>
				)
			}
			{
				event.description && (
					<p dangerouslySetInnerHTML={
						this.markupDescription(event.description)
					}></p>
				)
			}
				</div>
			)
		}
		{
			showFooter && (
				<footer>
					<AddToCalendar event={event} />
				</footer>
			)
		}
				<style jsx>{`
					.active-event {
						display: flex;
						flex-direction: column;
						font-family: 'Noto Sans', sans-serif;
						color: rgba(0, 0, 0, ${OPACITIES.TEXT.PRIMARY});
						padding: 0.5em;
						margin: 1px;
						cursor: pointer;
						box-sizing: border-box;
						position: fixed;
						left: 0;
						top: 0;
						width: 90vw;
						height: 90vh;
						font-size: 1.5em;
						overflow: hidden;
						z-index: 100;
						cursor: auto;
						visibility: hidden;
					}

					header, footer {
						flex-grow: 0;
						background-color: transparent;
					}

					.event-calendar {
						display: none;
						font-size: 0.7em;
						color: rgba(0, 0, 0, ${OPACITIES.TEXT.SECONDARY});
					}

					.event-date-time {
						margin: 0;
						text-align: center;
					}

					.event-date {
						display: none;
						text-transform: none;
					}

					.start-date,
					.end-date {
						white-space: nowrap;
					}

					.event-time {
						margin: 0;
						text-transform: uppercase;
					}

					.event-title {
						word-wrap: break-word;
						max-width: 80%;
					}

					.event-location {
						display: none;
						text-align: left;
						color: rgba(0, 0, 0, ${OPACITIES.TEXT.SECONDARY});
					}

					.event-desc {
						flex-grow: 1;
						flex-shrink: 1;
						margin: 0;
						font-size: 0.75em;
						word-wrap: break-word;
						white-space: pre-line;
					}

					.event.all-day .event-time {
						text-align: center;
						background: #bfbfbf;
						border-radius: 2px;
						padding: 0.15em 0.5em;
					}

					header .close {
						position: absolute;
						right: 0;
						top: 0;
						cursor: pointer;
						font-size: 1em;
						background: none;
						border: none;
						outline: none;
						color: rgba(0, 0, 0, ${OPACITIES.TEXT.DISABLED});
						padding: 0.1em;
						margin: 0.1em;
						line-height: 0.65;
					}

					header .close:hover {
						color: rgba(0, 0, 0, ${OPACITIES.TEXT.SECONDARY});
					}

					.active-event.expanded {
						font-size: 1.5em;
						background-color: #fafafa;
						border: 1px solid grey;
						padding: 0;
						transform: translate(50vw, 50vh) translate(-50%, -50%);
						box-shadow: 0 0 20px 0 ${COLORS.SHADOW};
						visibility: visible;
					}

					.expanded header,
					.expanded footer {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						justify-content: space-around;
						box-shadow: 0 0 5px 0 ${COLORS.SHADOW};
						background-color: ${COLORS.BACKGROUND};
						overflow: auto;
					}

					.expanded header {
						align-items: center;
						padding: 0.5em;
					}

					.expanded footer {
						align-items: center;
						text-align: center;
					}

					.expanded .event-title,
					.expanded .event-date-time {
						margin: 0.25em;
					}

					.expanded .event-title {
						order: 1;
						flex-grow: 1;
						max-width: 100%;
					}

					.expanded .event-calendar {
						display: block;
					}

					.expanded .event-date-time {
						order: 2;
						flex-grow: 1;
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						justify-content: space-around;
					}

					.expanded .event-date,
					.expanded .event-time {
						display: block;
						margin: 0.1 0.5em;
						display: inline-block;
						white-space: nowrap;

					}

					.expanded .event-location {
						padding: 0.5em 0;
						display: block;
					}

					.expanded .event-location::before {
						content: 'Location:';
						display: inline-block;
						margin-right: 0.5em;
					}

					.expanded .event-desc {
						padding: 1em 2em 2em;
						overflow-y: auto;
					}

					@media (min-width: ${BREAKPOINTS.SMALL_DESKTOP}px) {

						.active-event {
							transition-duration: 0.15s;
							transition-property: left, top, width, height, transform, background-color, border;
							max-width: 90vw;
							max-height: 90vh;
							width: auto;
							height: auto;
							visibility: visible;
						}

						header, footer {
							transition-duration: 0.15s;
							transition-property: background-color, border;
						}

						.active-event.expanded {
							font-size: 2em;
						}

						.event-date-time {
							text-align: right;
						}

						.expanded header {
							justify-content: space-between;
							flex-wrap: nowrap;
							text-align: left;
						}

						.expanded .event-title {
							margin-right: 1em;
							font-size: 1.25em;
						}

						.expanded .event-date-time {
							flex-direction: column;
							justify-content: flex-end;
						}

						.expanded .event-location {
							flex-direction: row;
							align-items: flex-start;
						}

						.expanded .event-location::before {
							margin: 0 0.75em 0 0;
						}

						.expanded .event-date-time {
							margin-left: 1em;
						}
					}
				`}</style>
			</div>
		);
	}

	componentDidMount() {
		window.requestAnimationFrame(() => {
			window.requestAnimationFrame(() => {
				this.setState({expanded: true});

				if ('parentIFrame' in window) {
					window.parentIFrame.getPageInfo(parentPage => {
						let middleOfParentViewport = parentPage.scrollTop +
							(parentPage.clientHeight / 2) - parentPage.offsetTop;

						let y = middleOfParentViewport > parentPage.clientHeight / 2
							? middleOfParentViewport < window.innerHeight - parentPage.clientHeight / 2
								? `${middleOfParentViewport}px`
								: '100vh - 50% - 10px'
							: '50% + 10px';

						let containerMaxHeight = parentPage.clientHeight * 0.9 - 50;
						this.container.style.maxHeight = `${containerMaxHeight}px`;
						this.container.style.transform =
							`translate(calc(50vw - 50%), calc(${y} - 50%))`;
					});
				}
				document.addEventListener('click', this.handleOutsideClick);
			});
		});
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleOutsideClick);
	}

	handleClick() {
		window.requestAnimationFrame(() => {
			this.setState({expanded: false}, () => {
				if ('parentIFrame' in window) {
					window.parentIFrame.getPageInfo(false);
				}

				let timeout = window.innerWidth >= BREAKPOINTS.SMALL_DESKTOP
					? 140
					: 10;

				window.setTimeout(this.props.onClose, timeout);
			});
		});
	}

	handleOutsideClick(event) {
		if (event.defaultPrevented)
			return;

		window.requestAnimationFrame(() => {
			let rect =  this.container.getBoundingClientRect();
			if (event.clientX < rect.left || event.clientX > rect.right
					|| event.clientY < rect.top || event.clientY > rect.bottom)
				this.handleClick();
		});
	}
}

ActiveEvent.propTypes = {
	event: PropTypes.object.isRequired,
	originalElement: PropTypes.object,
	onClose: PropTypes.func,
	showFooter: PropTypes.bool
};

ActiveEvent.defaultProps = {
	showFooter: false
};
