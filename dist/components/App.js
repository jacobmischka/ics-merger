var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _JSXStyle from 'styled-jsx/style';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import FullCalendar from './FullCalendar.js';
import ActiveEvent from './ActiveEvent.js';
import CalendarLegend from './CalendarLegend.js';
import CustomGroupSelector from './CustomGroupSelector.js';
import Subscription from './Subscription.js';

import { BREAKPOINTS } from '../constants.js';
import { getEventSources } from '../utils.js';

var App = function (_Component) {
	_inherits(App, _Component);

	function App(props) {
		_classCallCheck(this, App);

		var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

		_this.state = {
			GOOGLE_CALENDAR_API_KEY: '',
			calendars: {},
			calendarGroups: {},
			customCalendar: {
				calname: 'Custom Calendar',
				calendars: []
			},
			activeEvent: null,
			activeEventOriginalElement: null,
			loaded: null
		};

		_this.handleSetActiveEvent = _this.handleSetActiveEvent.bind(_this);
		_this.handleUnsetActiveEvent = _this.handleUnsetActiveEvent.bind(_this);
		_this.handleChangeCustomCalendarIds = _this.handleChangeCustomCalendarIds.bind(_this);
		return _this;
	}

	_createClass(App, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			fetch(this.props.envFile).then(function (response) {
				return response.json();
			}).then(function (dotenv) {
				_this2.setState(Object.assign(dotenv, { loaded: true }));
				if (dotenv.GOOGLE_ANALYTICS_TRACKING_ID && window.ga) {
					window.ga('create', dotenv.GOOGLE_ANALYTICS_TRACKING_ID, 'auto');
					window.ga('send', 'pageview');
				}
			}).catch(function (err) {
				_this2.setState({ loaded: false });
				console.error(err);
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var calendarId = this.props.calendarId || 'basic';

			// FIXME: This doesn't work if a calendar and a group share the same id
			var calendar = calendarId === 'custom' ? this.state.customCalendar : this.state.calendarGroups[calendarId];
			var calendars = void 0;
			if (calendar) {
				calendars = calendar.calendars.map(function (id) {
					return _this3.state.calendars[id];
				});
			} else {
				calendar = this.state.calendars[calendarId];
				calendars = calendar ? calendar.subCalendars || [calendar] : [];
			}

			if (calendar && calendars) {
				var eventSources = getEventSources(calendars);

				var activeEventNode = this.state.activeEvent ? React.createElement(ActiveEvent, { event: this.state.activeEvent,
					originalElement: this.state.activeEventOriginalElement,
					onClose: this.handleUnsetActiveEvent }) : null;

				var groupedCalendarListItems = Object.keys(this.state.calendarGroups).map(function (id) {
					return React.createElement(
						'li',
						{ key: 'grouped-calendar-list-items-' + id },
						React.createElement(
							Link,
							{ to: '/' + id, activeClassName: 'active' },
							_this3.state.calendarGroups[id].calname
						)
					);
				});

				groupedCalendarListItems.push(React.createElement(
					'li',
					{ key: 'custom' },
					React.createElement(
						Link,
						{ to: '/custom', activeClassName: 'active' },
						'Custom Group'
					),
					calendarId === 'custom' && React.createElement(CustomGroupSelector, { calendars: this.state.calendars,
						customCalendarIds: this.state.customCalendar.calendars,
						handleChangeCustomCalendarIds: this.handleChangeCustomCalendarIds })
				));

				var calendarListItems = Object.keys(this.state.calendars).map(function (id) {
					return React.createElement(
						'li',
						{ key: 'calendar-list-items-' + id },
						React.createElement(
							Link,
							{ to: '/' + id, activeClassName: 'active' },
							_this3.state.calendars[id].calname
						)
					);
				});

				var icsFilename = calendarId === 'custom' ? 'combine.ics?' + this.state.customCalendar.calendars.map(function (calId) {
					if (_this3.state.calendars[calId].url) {
						return 'urls[]=' + _this3.state.calendars[calId].url;
					} else {
						return _this3.state.calendars[calId].subCalendars.map(function (subCal) {
							return 'urls[]=' + subCal.url;
						}).join('&');
					}
				}).join('&') : calendarId + '.ics';

				return React.createElement(
					'div',
					{ 'data-iframe-height': true, 'data-jsx': 3197762824
					},
					activeEventNode,
					React.createElement(
						'h1',
						{
							'data-jsx': 3197762824
						},
						calendar.calname
					),
					React.createElement(FullCalendar, { apiKey: this.state.GOOGLE_CALENDAR_API_KEY,
						eventSources: eventSources,
						setActiveEvent: this.handleSetActiveEvent }),
					React.createElement(Subscription, { icsFilename: icsFilename }),
					React.createElement(CalendarLegend, { calendars: calendars, calname: calendar.calname }),
					(groupedCalendarListItems || calendarListItems) && React.createElement(
						'div',
						{ className: 'calendar-nav-container', 'data-jsx': 3197762824
						},
						React.createElement(
							'h2',
							{
								'data-jsx': 3197762824
							},
							'Other calendars'
						),
						React.createElement(
							'nav',
							{ className: 'calendar-nav', 'data-jsx': 3197762824
							},
							groupedCalendarListItems && React.createElement(
								'section',
								{
									'data-jsx': 3197762824
								},
								React.createElement(
									'h3',
									{
										'data-jsx': 3197762824
									},
									'Calendar sets'
								),
								React.createElement(
									'ul',
									{
										'data-jsx': 3197762824
									},
									groupedCalendarListItems
								)
							),
							calendarListItems && React.createElement(
								'section',
								{
									'data-jsx': 3197762824
								},
								React.createElement(
									'h3',
									{
										'data-jsx': 3197762824
									},
									'Calendars'
								),
								React.createElement(
									'ul',
									{
										'data-jsx': 3197762824
									},
									calendarListItems
								)
							)
						)
					),
					React.createElement(_JSXStyle, {
						styleId: 3197762824,
						css: 'h1[data-jsx="3197762824"] {font-size: 2.75em;font-weight: 500;text-align: center;}h2[data-jsx="3197762824"] {font-size: 2em;font-weight: normal;}a.active[data-jsx="3197762824"] {pointer-events: none;text-decoration: none;cursor: auto;color: rgba($text-color, $primary-text);}.calendar-nav-container[data-jsx="3197762824"] {padding: 0 2em;}@media (min-width: ' + BREAKPOINTS.SMALL_DESKTOP + 'px) {.calendar-nav-container[data-jsx="3197762824"] {padding: 0 3em;}}@media (min-width: ' + BREAKPOINTS.LARGE_DESKTOP + 'px) {.calendar-nav-container[data-jsx="3197762824"] {padding: 0 4em;}}.calendar-nav[data-jsx="3197762824"] {display:-webkit-flex; display:flex;-webkit-flex-direction: row;-moz-flex-direction: row;flex-direction: row;-webkit-flex-wrap: wrap;-moz-flex-wrap: wrap;flex-wrap: wrap;justify-content: space-around;}.calendar-nav[data-jsx="3197762824"] section[data-jsx="3197762824"] {-webkit-flex-grow: 0;-moz-flex-grow: 0;flex-grow: 0;-webkit-flex-shrink: 1;-moz-flex-shrink: 1;flex-shrink: 1;min-width: 15em;}'
					})
				);
			} else {
				switch (this.state.loaded) {
					case null:
					default:
						return React.createElement(
							'div',
							{ className: 'loading-container', 'data-jsx': 715160364
							},
							React.createElement('img', { src: '/assets/spinner.gif', alt: 'Loading', 'data-jsx': 715160364
							}),
							React.createElement(_JSXStyle, {
								styleId: 715160364,
								css: '.loading-container[data-jsx="715160364"] {display:-webkit-flex; display:flex;justify-content: center;align-items: center;text-align: center;width: 100%;height: 100%;}'
							})
						);
					case true:
						return React.createElement(
							'p',
							null,
							'No calendar ',
							React.createElement(
								'code',
								null,
								calendarId
							),
							' found.'
						);
					case false:
						return React.createElement(
							'p',
							null,
							'There was a problem loading calendar data.'
						);
				}
			}
		}
	}, {
		key: 'handleSetActiveEvent',
		value: function handleSetActiveEvent(calEvent, element) {
			this.setState({
				activeEvent: calEvent,
				activeEventOriginalElement: element
			});
		}
	}, {
		key: 'handleUnsetActiveEvent',
		value: function handleUnsetActiveEvent() {
			this.setState({
				activeEvent: null,
				activeEventOriginalPosition: null
			});
		}
	}, {
		key: 'handleChangeCustomCalendarIds',
		value: function handleChangeCustomCalendarIds(event) {
			var checkbox = event.target;

			this.setState(function (previousState) {
				var customCalendar = Object.assign({}, previousState.customCalendar);
				customCalendar.calendars = customCalendar.calendars.slice();
				if (checkbox.checked) {
					if (!customCalendar.calendars.includes(checkbox.value)) {
						customCalendar.calendars.push(checkbox.value);
						return {
							customCalendar: customCalendar
						};
					}
				} else {
					if (customCalendar.calendars.includes(checkbox.value)) {
						customCalendar.calendars.splice(customCalendar.calendars.indexOf(checkbox.value), 1);
						return {
							customCalendar: customCalendar
						};
					}
				}
			});
		}
	}]);

	return App;
}(Component);

export default App;


App.propTypes = {
	calendarId: PropTypes.string,
	envFile: PropTypes.string
};