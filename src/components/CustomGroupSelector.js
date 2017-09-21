/* @flow */

import React from 'react';
import PropTypes from 'prop-types';

import CalendarTree from './CalendarTree.js';

import type { Calendar, CalendarTreeDef } from '../utils.js';

type Props = {
	calendars: {[string]: Calendar},
	calendarTree?: CalendarTreeDef,
	customCalendarIds: Array<string>,
	handleChangeCustomCalendarIds: Function
};

const CustomGroupSelector = (props: Props) => {
	return (
		<CalendarTree calendars={props.calendars}
			calendarTree={props.calendarTree}
			keyPrefix="custom-group-selector"
			container="div"
			render={calendarId => (
				<li key={`custom-${calendarId}`}>
					<label>
						<input type="checkbox" value={calendarId}
							checked={props.customCalendarIds.includes(calendarId)}
							onChange={props.handleChangeCustomCalendarIds} />
						{props.calendars[calendarId].calname}
					</label>
				</li>
			)} />
	);
};

export default CustomGroupSelector;

CustomGroupSelector.propTypes = {
	calendars: PropTypes.object,
	customCalendarIds: PropTypes.array,
	handleChangeCustomCalendarIds: PropTypes.func
};
