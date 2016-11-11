import React from 'react';

export default class CalendarEvent extends React.Component {
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

		return (
			<div className={`event ${this.props.event.allDay ? 'all-day' : ''}`}>
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
}

CalendarEvent.propTypes = {
	event: React.PropTypes.object
};
