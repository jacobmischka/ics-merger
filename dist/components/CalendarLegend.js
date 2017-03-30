import _JSXStyle from 'styled-jsx/style';
import React, { PropTypes } from 'react';
import Color from 'color';

import { COLORS } from '../constants.js';

var legendBorderColor = new Color(COLORS.GREY).alpha(0.45);

var CalendarLegend = function CalendarLegend(props) {
	if (!props.calendars || props.calendars.length < 1) return null;

	var calendarsInGroup = props.calendars.map(function (calendar) {
		return React.createElement(
			'li',
			{ className: 'legend-list-item', key: 'in-group-' + calendar.calname, 'data-jsx': 829799383
			},
			React.createElement('span', { className: 'calendar-legend-color', style: {
					backgroundColor: Color(calendar.color).alpha(0.3).rgb().string(),
					border: '1px solid ' + calendar.color
				}, 'data-jsx': 829799383
			}),
			calendar.calname,
			React.createElement(_JSXStyle, {
				styleId: 829799383,
				css: '.legend-list-item[data-jsx="829799383"] {display:-webkit-flex; display:flex;align-items: center;}.calendar-legend-color[data-jsx="829799383"] {display: inline-block;width: 1em;height: 1em;margin: 0 0.5em 0 0;}'
			})
		);
	});

	return React.createElement(
		'div',
		{ className: 'calendar-legend-container', 'data-jsx': 2170029661
		},
		React.createElement(
			'div',
			{ className: 'calendar-legend', 'data-jsx': 2170029661
			},
			React.createElement(
				'span',
				{ className: 'legend-title', 'data-jsx': 2170029661
				},
				'Calendars in ',
				props.calname
			),
			React.createElement(
				'ul',
				{ className: 'legend-list', 'data-jsx': 2170029661
				},
				calendarsInGroup
			)
		),
		React.createElement(_JSXStyle, {
			styleId: 2170029661,
			css: '.calendar-legend-container[data-jsx="2170029661"] {margin: 2em;display:-webkit-flex; display:flex;justify-content: center;}.calendar-legend[data-jsx="2170029661"] {background-color: #fafafa;padding: 1em;border: 1px solid ' + legendBorderColor + ';}.legend-title[data-jsx="2170029661"] {text-align: center;font-size: 1.1em;}@media print {.calendar-legend-container[data-jsx="2170029661"] {display: none;}}'
		})
	);
};

export default CalendarLegend;

CalendarLegend.propTypes = {
	calendars: PropTypes.array,
	calname: PropTypes.string
};