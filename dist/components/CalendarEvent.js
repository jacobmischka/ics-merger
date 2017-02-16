var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _JSXStyle from 'styled-jsx/style';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import Color from 'color';

import { OPACITIES } from '../constants.js';

var CalendarEvent = function (_Component) {
	_inherits(CalendarEvent, _Component);

	function CalendarEvent(props) {
		_classCallCheck(this, CalendarEvent);

		var _this = _possibleConstructorReturn(this, (CalendarEvent.__proto__ || Object.getPrototypeOf(CalendarEvent)).call(this, props));

		_this.state = {
			active: false
		};

		_this.getEventTime = _this.getEventTime.bind(_this);
		_this.getClassName = _this.getClassName.bind(_this);
		_this.handleClick = _this.handleClick.bind(_this);
		return _this;
	}

	_createClass(CalendarEvent, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			var eventTime = this.getEventTime();
			var className = this.getClassName();

			var color = Color(this.props.event.color);

			var style = {
				border: '1px solid ' + color.rgb().string(),
				backgroundColor: color.alpha(0.3).rgb().string()
			};

			return React.createElement(
				'div',
				{ className: className, style: style,
					title: this.props.event.calendar.calname,
					onClick: this.handleClick,
					ref: function ref(div) {
						return _this2.container = div;
					}, 'data-jsx': 2587742225
				},
				React.createElement(
					'span',
					{ className: 'event-time', 'data-jsx': 2587742225
					},
					eventTime
				),
				React.createElement(
					'span',
					{ className: 'event-title', 'data-jsx': 2587742225
					},
					this.props.event.title
				),
				React.createElement(_JSXStyle, {
					styleId: 2587742225,
					css: '.event[data-jsx="2587742225"] {font-family: \'Noto Sans\', sans-serif;color: rgba(0, 0, 0, ' + OPACITIES.TEXT.primary + ');padding: 0.5em;margin: 1px;cursor: pointer;font-size: 0.75em;}.event-time[data-jsx="2587742225"] {margin: 0 0.5em 0 0;text-transform: uppercase;}.event-title[data-jsx="2587742225"] {word-wrap: break-word;}.event-desc[data-jsx="2587742225"] {font-size: 0.75em;word-wrap: break-word;white-space: pre-line;}.event.all-day[data-jsx="2587742225"] .event-time[data-jsx="2587742225"] {text-align: center;background: #bfbfbf;border-radius: 2px;padding: 0.15em 0.5em;}'
				})
			);
		}
	}, {
		key: 'getEventTime',
		value: function getEventTime() {
			var eventTime = void 0;
			if (this.props.event.allDay) {
				eventTime = 'All day';
			} else {
				var start = this.props.event.start;
				var end = this.props.event.end;
				var startTime = start.format('h');
				if (start.get('minute') !== 0) startTime += ':' + start.format('mm');
				if (start.format('A') !== end.format('A')) startTime += ' ' + start.format('A');
				var endTime = end.get('minute') === 0 ? end.format('h A') : end.format('LT');

				eventTime = startTime + ' \u2013 ' + endTime;
			}

			return eventTime;
		}
	}, {
		key: 'getClassName',
		value: function getClassName() {
			var className = 'event';
			if (this.props.event.allDay) className += ' all-day';

			return className;
		}
	}, {
		key: 'handleClick',
		value: function handleClick(event) {
			event.preventDefault();

			this.props.setActive(this.props.event, this.container);
			this.setState(function (state) {
				return {
					active: !state.active
				};
			});
		}
	}]);

	return CalendarEvent;
}(Component);

export default CalendarEvent;


CalendarEvent.propTypes = {
	event: PropTypes.object.isRequired,
	view: PropTypes.object,
	setActive: PropTypes.func
};