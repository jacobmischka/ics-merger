import React from 'react';

const CustomGroupSelector = props => {

	const options = Object.keys(props.calendars).map(calendarId => {
		return (
			<li key={`custom-${calendarId}`}>
				<label>					
					<input type="checkbox" value={calendarId}
						checked={props.customCalendarIds.includes(calendarId)}
						onChange={props.handleChangeCustomCalendarIds} />
					{props.calendars[calendarId].calname}
				</label>
			</li>
		);
	});

	return (
		<div className="custom-group-selector">
			<ul>
				{options}
			</ul>
		</div>
	);
};

export default CustomGroupSelector;

CustomGroupSelector.propTypes = {
	calendars: React.PropTypes.object,
	customCalendarIds: React.PropTypes.array,
	handleChangeCustomCalendarIds: React.PropTypes.func
};
