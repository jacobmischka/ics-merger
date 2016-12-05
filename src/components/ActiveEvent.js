import React from 'react';
import Color from 'color';

import CalendarEvent from './CalendarEvent.js';

export default class ActiveEvent extends CalendarEvent {
	constructor(props){
		super(props);
		this.state = {
			expanded: false
		};

		this.getEventDate = this.getEventDate.bind(this);
		this.handleOutsideClick = this.handleOutsideClick.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	render(){
		let style;
		if(!this.state.expanded){
			let rect = this.props.originalElement.getBoundingClientRect();

			let left = rect.left - 1;
			let top = rect.top - 1;

			let backgroundColor = Color(this.props.event.color).lighten(0.6).rgbString();
			let borderColor = this.props.event.color;

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
		if(this.state.expanded)
			className += ' expanded';

		let headerStyle;
		if(this.state.expanded){
			headerStyle = {
				borderBottom: `5px solid ${this.props.event.color}`
			};
		}

		return (
			<div key="active-event" className={className} style={style}
					ref={div => this.container = div}>
				<header style={headerStyle}>
					<span className="event-date-time">
						<span className="event-date">{eventDate}</span>
						<span className="event-time">{eventTime}</span>
					</span>
					<span className="event-title">
						<span className="event-calendar">
							{this.props.event.calendar.calname}
						</span>
						{this.props.event.title}
					</span>
				</header>
				<p className="event-desc">
					{this.props.event.description}
				</p>
			</div>
		);
	}

	getEventDate(){
		const sameDay = this.props.event.start.isSame(this.props.event.end, 'day');
		const sameDayAllDay = this.props.event.allDay && this.props.event.start
			.isSame(this.props.event.end.clone().subtract(1, 'day'));
		if(sameDay || sameDayAllDay){
			return this.props.event.start.format('ll');
		}
		else {
			let startDate, endDate;
			if(this.props.event.start.isSame(this.props.event.end, 'year')){
				startDate = this.props.event.start.format('MMM D');
				endDate = this.props.event.end.format('ll');

			}
			else {
				const dateFormat = 'll';
				startDate = this.props.event.start.format(dateFormat);
				endDate = this.props.event.end.format(dateFormat);
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

	componentDidMount(){
		window.requestAnimationFrame(() => {
			window.requestAnimationFrame(() => {
				this.setState({expanded: true});
				if('parentIFrame' in window){
					window.parentIFrame.getPageInfo(parentPage => {
						let y = parentPage.scrollTop >= 0
							? `${parentPage.scrollTop + (parentPage.clientHeight / 2) - parentPage.offsetTop}px`
							: '50%';
						this.container.style.transform =
							`translate(calc(50vw - 50%), calc(${y} - 50%))`;
					});
				}
				document.addEventListener('click', this.handleOutsideClick);
			});
		});
	}

	componentWillUnmount(){
		document.removeEventListener('click', this.handleOutsideClick);
	}

	handleClick(){
		window.requestAnimationFrame(() => {
			this.setState({expanded: false}, () => {
				if('parentIFrame' in window){
					window.parentIFrame.getPageInfo(false);
				}
				window.setTimeout(this.props.onClose, 140);
			});
		});
	}

	handleOutsideClick(event){
		if(event.defaultPrevented)
			return;

		window.requestAnimationFrame(() => {
			let rect =  this.container.getBoundingClientRect();
			if(event.clientX < rect.left || event.clientX > rect.right
					|| event.clientY < rect.top || event.clientY > rect.bottom)
				this.handleClick();
		});
	}
}

ActiveEvent.propTypes = {
	event: React.PropTypes.object.isRequired,
	originalElement: React.PropTypes.object,
	onClose: React.PropTypes.func
};
