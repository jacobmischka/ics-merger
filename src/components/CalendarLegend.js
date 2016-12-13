import React from 'react';
import Color from 'color';

const CalendarLegend = (props) => {
	if(!props.calendars || props.calendars.length < 1)
		return null;

	let calendarsInGroup = props.calendars.map(calendar => (
		<li className="legend-list-item" key={`in-group-${calendar.calname}`}>
			<span className="calendar-legend-color" style={{
					backgroundColor: Color(calendar.color).alpha(0.3).rgb().string(),
					border: `1px solid ${calendar.color}`
				}}>
			</span>
			{calendar.calname}
		</li>
	));

	return (
		<div className="calendar-legend-container">
			<div className="calendar-legend">
				<span className="legend-title">
					Calendars in {props.calname}
				</span>
				<ul className="legend-list">
					{calendarsInGroup}
				</ul>
			</div>
		</div>
	);
};

export default CalendarLegend;

CalendarLegend.propTypes = {
	calendars: React.PropTypes.array,
	calname: React.PropTypes.string
};
