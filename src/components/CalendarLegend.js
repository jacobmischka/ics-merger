import React, { PropTypes } from 'react';
import Color from 'color';

import { COLORS } from '../constants.js';

const legendBorderColor = new Color(COLORS.GREY).alpha(0.45);

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
			<style jsx>
			{`
				.legend-list-item {
					display: flex;
					align-items: center;
				}
				
				.calendar-legend-color {
					display: inline-block;
					width: 1em;
					height: 1em;
					margin: 0 0.5em 0 0;
				}
			`}
			</style>
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
			<style jsx>
			{`
				.calendar-legend-container {
					margin: 2em;
					display: flex;
					justify-content: center;
				}
				
				.calendar-legend {
					background-color: #fafafa;
					padding: 1em;
					border: 1px solid ${legendBorderColor};
				}
				
				.legend-title {
					text-align: center;
					font-size: 1.1em;
				}
				
				@media print {
					.calendar-legend-container {
						display: none;
					}
				}
			`}
			</style>
		</div>
	);
};

export default CalendarLegend;

CalendarLegend.propTypes = {
	calendars: PropTypes.array,
	calname: PropTypes.string
};
