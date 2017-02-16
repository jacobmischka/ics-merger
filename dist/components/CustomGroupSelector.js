import React, { PropTypes } from 'react';

var CustomGroupSelector = function CustomGroupSelector(props) {

	var options = Object.keys(props.calendars).map(function (calendarId) {
		return React.createElement(
			"li",
			{ key: "custom-" + calendarId },
			React.createElement(
				"label",
				null,
				React.createElement("input", { type: "checkbox", value: calendarId,
					checked: props.customCalendarIds.includes(calendarId),
					onChange: props.handleChangeCustomCalendarIds }),
				props.calendars[calendarId].calname
			)
		);
	});

	return React.createElement(
		"div",
		{ className: "custom-group-selector" },
		React.createElement(
			"ul",
			null,
			options
		)
	);
};

export default CustomGroupSelector;

CustomGroupSelector.propTypes = {
	calendars: PropTypes.object,
	customCalendarIds: PropTypes.array,
	handleChangeCustomCalendarIds: PropTypes.func
};