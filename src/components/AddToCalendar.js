import React from 'react';
import PropTypes from 'prop-types';
import Color from 'color';

import { COLORS, OPACITIES } from '../constants.js';
import { fullCalendarToIcsUrl, fullCalendarToGoogleUrl } from '../utils.js';

const buttonHoverBackgroundColor = new Color(COLORS.ACCENT).alpha(OPACITIES.SECONDARY);

const AddToCalendar = ({event}) => (
	<div className="add-to-calendar">
		Add event to calendar
		<div className="buttons-container">
			<a href={fullCalendarToGoogleUrl(event)}
					target="_blank" rel="noopener noreferrer">
				Google Calendar
			</a>
			<a href={fullCalendarToIcsUrl(event)}>
				Outlook / Other
			</a>
		</div>
		<style jsx>{`
			.add-to-calendar {
				flex-grow: 1;
				font-size: 0.75em;
			}

			.buttons-container {
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
			}

			a {
				text-decoration: none;
				border-radius: 4px;
				padding: 0.25em 0.5em;
				margin: 0.25em;
				border: 2px solid ${COLORS.ACCENT};
				color: ${COLORS.ACCENT};
			}

			a:hover {
				color: white;
				background-color: ${buttonHoverBackgroundColor};
			}
		`}</style>
	</div>
);

AddToCalendar.propTypes = {
	event: PropTypes.shape({
		start: PropTypes.object,
		end: PropTypes.object,
		title: PropTypes.string,
		description: PropTypes.string,
		location: PropTypes.string,
		url: PropTypes.string,
	})
};

export default AddToCalendar;
