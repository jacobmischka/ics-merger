/* @flow */

import React from 'react';

import CalendarTree from './CalendarTree.js';

import type { CalendarLike, CalendarTreeDef } from '../utils.js';

type Props = {
	calendars: {[string]: CalendarLike},
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
			label={<h3>Calendars in Custom Group</h3>}
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
