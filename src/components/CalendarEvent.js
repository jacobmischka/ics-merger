import React from 'react';
import Color from 'color';

export default class CalendarEvent extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			active: false
		};

		this.handleClick = this.handleClick.bind(this);
	}

	render(){
		let eventTime;
		if(this.props.event.allDay){
			eventTime = 'All day';
		}
		else {
			let start = this.props.event.start;
			let end = this.props.event.end;
			let startTime = start.format('h');
			if(start.get('minute') !== 0)
				startTime += `:${start.format('mm')}`;
			if(start.format('A') !== end.format('A'))
				startTime += ` ${start.format('A')}`;
			let endTime = end.get('minute') === 0
				? end.format('h A')
				: end.format('LT');

			eventTime = `${startTime} – ${endTime}`;
		}

		let className = 'event';
		if(this.props.event.allDay)
			className += ' all-day';
		if(this.state.active)
			className += ' active';

		let color = Color(this.props.event.color);

		let style = {
			border: `1px solid ${color.rgbString()}`,
			backgroundColor: color.alpha(0.3).rgbString()
		};

		style = Object.assign(style, this.props.style);

		return (
			<div className={className} style={style}
					onClick={this.props.onClick || this.handleClick}
					ref={div => this.container = div}>
				<span className="event-time">
					{eventTime}
				</span>
				<span className="event-title">{this.props.event.title}</span>
				<p className="event-desc">
					{this.props.event.description}
				</p>
			</div>
		);
	}

	handleClick(){
		// Work around ClientRect not resolving immediately
		const {
			top,
			right,
			bottom,
			left,
			width,
			height
		} = this.container.getBoundingClientRect();
		const size = {
			top,
			right,
			bottom,
			left,
			width,
			height
		};

		this.props.setActive(this.props.event, size);
		this.setState(state => {
			return {
				active: !state.active
			};
		});
	}
}

CalendarEvent.propTypes = {
	event: React.PropTypes.object.isRequired,
	view: React.PropTypes.object,
	setActive: React.PropTypes.func,
	onClick: React.PropTypes.func,
	style: React.PropTypes.object
};
