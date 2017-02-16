var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _JSXStyle from 'styled-jsx/style';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import Color from 'color';

import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/gcal.js';
import 'fullcalendar/dist/fullcalendar.css';
import uniqueId from 'lodash/uniqueId';

import CalendarEvent from './CalendarEvent.js';

import { BREAKPOINTS, COLORS, OPACITIES } from '../constants.js';

var fcButtonHoverBackgroundColor = new Color(COLORS.ACCENT).alpha(OPACITIES.SECONDARY);

var FullCalendar = function (_Component) {
	_inherits(FullCalendar, _Component);

	function FullCalendar(props) {
		_classCallCheck(this, FullCalendar);

		var _this = _possibleConstructorReturn(this, (FullCalendar.__proto__ || Object.getPrototypeOf(FullCalendar)).call(this, props));

		_this.state = {
			calendarId: uniqueId()
		};

		_this.createCalendar = _this.createCalendar.bind(_this);
		_this.destroyCalendar = _this.destroyCalendar.bind(_this);
		return _this;
	}

	_createClass(FullCalendar, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ id: this.state.calendarId, 'data-jsx': 614734700
				},
				React.createElement(_JSXStyle, {
					styleId: 614734700,
					css: '\n\t\t\t\t\th2 {\n\t\t\t\t\t\tfont-size: 2em;\n\t\t\t\t\t\tfont-weight: normal;\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t.event-container {\n\t\t\t\t\t\tbackground-color: ' + COLORS.BACKGROUND + ';\n\t\t\t\t\t\toverflow: hidden;\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t.fc .fc-toolbar {\n\t\t\t\t\t\tdisplay: flex;\n\t\t\t\t\t\tjustify-content: space-between;\n\t\t\t\t\t\tflex-wrap: wrap;\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t.fc .fc-toolbar .fc-left {\n\t\t\t\t\t\torder: 1;\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t.fc .fc-toolbar .fc-center {\n\t\t\t\t\t\torder: 2;\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t.fc .fc-toolbar .fc-right {\n\t\t\t\t\t\torder: 3;\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t.fc button {\n\t\t\t\t\t\theight: auto;\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t.fc .fc-button {\n\t\t\t\t\t\tfont-size: 1.1em;\n\t\t\t\t\t\tpadding: 0.5em;\n\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t.fc .fc-button.fc-state-default {\n\t\t\t\t\t\tbackground: transparent;\n\t\t\t\t\t\ttext-shadow: none;\n\t\t\t\t\t\tbox-shadow: none;\n\t\t\t\t\t\tborder: 2px solid ' + COLORS.ACCENT + ';\n\t\t\t\t\t\tcolor: ' + COLORS.ACCENT + ';\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t.fc .fc-button.fc-state-active {\n\t\t\t\t\t\tcolor: white;\n\t\t\t\t\t\tbackground: ' + COLORS.ACCENT + ';\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t.fc .fc-button:hover,\n\t\t\t\t\t.fc .fc-button:focus {\n\t\t\t\t\t\toutline: none;\n\t\t\t\t\t\tcolor: white;\n\t\t\t\t\t\tbackground: ' + fcButtonHoverBackgroundColor + '\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t.fc .fc-button.fc-state-disabled {\n\t\t\t\t\t\tcursor: not-allowed;\n\t\t\t\t\t\tbackground: none;\n\t\t\t\t\t\tcolor: ' + COLORS.ACCENT + ';\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t.fc-clear {\n\t\t\t\t\t\tdisplay: none;\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t.fc-list-view .fc-scroller {\n\t\t\t\t\t\t/* HACK: Workaround for https://github.com/fullcalendar/fullcalendar/issues/3346 */\n\t\t\t\t\t\theight: auto !important;\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t@media (max-width: ' + BREAKPOINTS.SMALL_DESKTOP + 'px) {\n\t\t\t\t\t\t.fc .fc-toolbar {\n\t\t\t\t\t\t\tjustify-content: space-around;\n\t\t\t\t\t\t}\n\t\t\t\t\t\t\n\t\t\t\t\t\t.fc .fc-toolbar .fc-left {\n\t\t\t\t\t\t\ttext-align: center;\n\t\t\t\t\t\t\twidth: 100%;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t'
				})
			);
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps) {
			var _this2 = this;

			if (this.props.apiKey !== nextProps.apiKey) return true;

			var eventSourcesToAdd = nextProps.eventSources.filter(function (newEventSource) {
				return !_this2.props.eventSources.some(function (oldEventSource) {
					return oldEventSource.googleCalendarId === newEventSource.googleCalendarId && oldEventSource.color === newEventSource.color;
				});
			});

			var eventSourcesToRemove = this.props.eventSources.filter(function (oldEventSource) {
				return !nextProps.eventSources.some(function (newEventSource) {
					return newEventSource.googleCalendarId === oldEventSource.googleCalendarId && newEventSource.color === oldEventSource.color;
				});
			});

			var calendar = $('#' + this.state.calendarId);

			if (eventSourcesToRemove && eventSourcesToRemove.length > 0) calendar.fullCalendar('removeEventSources', eventSourcesToRemove);

			if (eventSourcesToAdd && eventSourcesToAdd.length > 0) {
				eventSourcesToAdd.map(function (eventSourceToAdd) {
					calendar.fullCalendar('addEventSource', eventSourceToAdd);
				});
			}

			return false;
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.createCalendar();
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate() {
			this.destroyCalendar();
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			this.createCalendar();
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.destroyCalendar();
		}
	}, {
		key: 'destroyCalendar',
		value: function destroyCalendar() {
			$('#' + this.state.calendarId).fullCalendar('destroy');
		}
	}, {
		key: 'createCalendar',
		value: function createCalendar() {
			var setActive = this.props.setActiveEvent;

			var defaultView = window.innerWidth > BREAKPOINTS.SMALL_DESKTOP ? 'month' : 'listWeek';

			$('#' + this.state.calendarId).fullCalendar(Object.assign({
				googleCalendarApiKey: this.props.apiKey,
				eventSources: this.props.eventSources,
				height: 'auto',
				fixedWeekCount: false,
				header: {
					left: 'title',
					center: 'month,listWeek,agendaDay',
					right: 'today prev,next'
				},
				defaultView: defaultView,
				navLinks: true,
				eventRender: function eventRender(calEvent, element, view) {
					var div = document.createElement('div');
					div.className = 'event-container';
					if (view && view.name && view.name.startsWith('agenda')) div.style.position = 'absolute';
					render(React.createElement(CalendarEvent, { event: calEvent, view: view,
						setActive: setActive }), div);
					return div;
				}
			}, this.props.fullcalendarConfig));
		}
	}]);

	return FullCalendar;
}(Component);

export default FullCalendar;


FullCalendar.propTypes = {
	apiKey: PropTypes.string.isRequired,
	eventSources: PropTypes.array.isRequired,
	setActiveEvent: PropTypes.func,
	fullcalendarConfig: PropTypes.object
};