import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/gcal.js';
import uniqueId from 'lodash/uniqueId';

import CalendarEvent from './CalendarEvent.js';

export default class FullCalendar extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			calendarId: uniqueId()
		};

		this.createCalendar = this.createCalendar.bind(this);
		this.destroyCalendar = this.destroyCalendar.bind(this);
	}

	render(){
		return (
			<div id={this.state.calendarId}></div>
		);
	}

	componentDidMount(){
		this.createCalendar();
	}

	componentWillUpdate(){
		this.destroyCalendar();
	}

	componentDidUpdate(){
		this.createCalendar();
	}

	componentWillUnmount(){
		this.destroyCalendar();
	}

	destroyCalendar(){
		$(`#${this.state.calendarId}`).fullCalendar('destroy');
	}

	createCalendar(){
		$(`#${this.state.calendarId}`).fullCalendar({
			googleCalendarApiKey: this.props.apiKey,
			eventSources: this.props.eventSources,
			header: {
				left: 'title',
				center: 'month,agendaWeek,agendaDay',
				right: 'today prev,next'
			},
			navLinks: true,
			eventRender(calEvent, element){
				ReactDOM.render(<CalendarEvent event={calEvent} />, element[0]);
			},
			eventClick(){
				$('.fc-event.active').each(element => {
					if(this !== element)
						$(element).removeClass('active');
				});
				$(this).toggleClass('active');

				return false;
			}
		});
	}
}

FullCalendar.propTypes = {
	apiKey: React.PropTypes.string.isRequired,
	eventSources: React.PropTypes.array.isRequired
};
