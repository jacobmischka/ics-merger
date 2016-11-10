import React from 'react';

export default class CalendarEvent extends React.Component {
	constructor(){
		super();
		this.state = {
			active: false
		};
	}

	render(){
		return (
			<div className="event">
				<span className="event-time">
					{this.props.event.start.get('hour')}
					–
					{this.props.event.end.get('hour')}
				</span>
				<span className="event-title">{this.props.event.title}</span>
				<p className="event-desc">
					{this.props.event.description}
				</p>
			</div>
		);
	}
}

CalendarEvent.propTypes = {
	event: React.PropTypes.object
};
