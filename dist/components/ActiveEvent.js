var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _JSXStyle from 'styled-jsx/style';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { PropTypes } from 'react';
import Color from 'color';
import LinkifyIt from 'linkify-it';

import CalendarEvent from './CalendarEvent.js';

import { BREAKPOINTS, OPACITIES, COLORS } from '../constants.js';
import { rgbaOverRgb } from '../utils.js';

var linkify = new LinkifyIt();

var ActiveEvent = function (_CalendarEvent) {
	_inherits(ActiveEvent, _CalendarEvent);

	function ActiveEvent(props) {
		_classCallCheck(this, ActiveEvent);

		var _this = _possibleConstructorReturn(this, (ActiveEvent.__proto__ || Object.getPrototypeOf(ActiveEvent)).call(this, props));

		_this.state = {
			expanded: false
		};

		_this.getEventDate = _this.getEventDate.bind(_this);
		_this.markupDescription = _this.markupDescription.bind(_this);
		_this.handleOutsideClick = _this.handleOutsideClick.bind(_this);
		_this.handleClick = _this.handleClick.bind(_this);
		return _this;
	}

	_createClass(ActiveEvent, [{
		key: 'getEventDate',
		value: function getEventDate() {
			var sameDay = this.props.event.start.isSame(this.props.event.end, 'day');
			var sameDayAllDay = this.props.event.allDay && this.props.event.start.isSame(this.props.event.end.clone().subtract(1, 'day'));
			if (sameDay || sameDayAllDay) {
				return this.props.event.start.format('ll');
			} else {
				var startDate = void 0,
				    endDate = void 0;
				if (this.props.event.start.isSame(this.props.event.end, 'year')) {
					startDate = this.props.event.start.format('MMM D');
					endDate = this.props.event.end.format('ll');
				} else {
					var dateFormat = 'll';
					startDate = this.props.event.start.format(dateFormat);
					endDate = this.props.event.end.format(dateFormat);
				}

				return React.createElement(
					'span',
					null,
					React.createElement(
						'span',
						{ className: 'start-date' },
						startDate
					),
					React.createElement(
						'span',
						null,
						' \u2013 '
					),
					React.createElement(
						'span',
						{ className: 'end-date' },
						endDate
					)
				);
			}
		}
	}, {
		key: 'markupDescription',
		value: function markupDescription(description) {
			if (description && linkify.test(description)) {
				linkify.match(description).map(function (match) {
					description = description.replace(match.raw, '<a href="' + match.url + '" target="_blank" rel="noopener noreferrer">' + match.text + '</a>');
				});
			}

			return { __html: description };
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var style = void 0;
			if (!this.state.expanded) {
				var rect = this.props.originalElement.getBoundingClientRect();

				var left = rect.left - 1;
				var top = rect.top - 1;

				var backgroundColor = rgbaOverRgb(Color(this.props.event.color).alpha(0.3).array());
				var borderColor = this.props.event.color;

				style = {
					width: rect.width * 2,
					height: rect.height * 2,
					transform: 'translate(calc(' + left + 'px - 25%), calc(' + top + 'px - 25%)) scale(0.5)',
					backgroundColor: backgroundColor,
					border: '2px solid ' + borderColor
				};
			}

			var eventTime = this.getEventTime();
			var eventDate = this.getEventDate();
			var className = this.getClassName();
			className += ' active-event';
			if (this.state.expanded) className += ' expanded';

			var headerStyle = void 0;
			if (this.state.expanded) {
				headerStyle = {
					borderBottom: '5px solid ' + this.props.event.color
				};
			}

			return React.createElement(
				'div',
				{ key: 'active-event', className: className, style: style,
					ref: function ref(div) {
						return _this2.container = div;
					}, 'data-jsx': 3553823148
				},
				React.createElement(
					'header',
					{ style: headerStyle, ref: function ref(header) {
							return _this2.header = header;
						}, 'data-jsx': 3553823148
					},
					React.createElement(
						'span',
						{ className: 'event-date-time', 'data-jsx': 3553823148
						},
						React.createElement(
							'span',
							{ className: 'event-date', 'data-jsx': 3553823148
							},
							eventDate
						),
						React.createElement(
							'span',
							{ className: 'event-time', 'data-jsx': 3553823148
							},
							eventTime
						)
					),
					React.createElement(
						'span',
						{ className: 'event-title', 'data-jsx': 3553823148
						},
						React.createElement(
							'span',
							{ className: 'event-calendar', 'data-jsx': 3553823148
							},
							this.props.event.calendar.calname
						),
						this.props.event.title
					),
					React.createElement(
						'button',
						{ type: 'button', className: 'close', onClick: this.handleClick,
							title: 'Close active event', 'data-jsx': 3553823148
						},
						'\xD7'
					)
				),
				this.props.event.description && React.createElement('p', { className: 'event-desc',
					dangerouslySetInnerHTML: this.markupDescription(this.props.event.description), 'data-jsx': 3553823148
				}),
				React.createElement(_JSXStyle, {
					styleId: 3553823148,
					css: '.active-event[data-jsx="3553823148"] {display:-webkit-flex; display:flex;-webkit-flex-direction: column;-moz-flex-direction: column;flex-direction: column;font-family: \'Noto Sans\', sans-serif;color: rgba(0, 0, 0, ' + OPACITIES.TEXT.primary + ');padding: 0.5em;margin: 1px;cursor: pointer;box-sizing: border-box;position: fixed;left: 0;top: 0;max-width: 90vw;max-height: 90vh;font-size: 1.5em;overflow: hidden;-webkit-transition-duration: 0.15s;-moz-transition-duration: 0.15s;-ms-transition-duration: 0.15s;transition-duration: 0.15s;-webkit-transition-property: left, top, width, height, transform, background-color, border;-moz-transition-property: left, top, width, height, transform, background-color, border;-ms-transition-property: left, top, width, height, transform, background-color, border;transition-property: left, top, width, height, transform, background-color, border;z-index: 100;cursor: auto;}header[data-jsx="3553823148"] {-webkit-flex: 0 0;-moz-flex: 0 0;flex: 0 0;background-color: transparent;-webkit-transition-duration: 0.15s;-moz-transition-duration: 0.15s;-ms-transition-duration: 0.15s;transition-duration: 0.15s;-webkit-transition-property: background-color, border;-moz-transition-property: background-color, border;-ms-transition-property: background-color, border;transition-property: background-color, border;}.event-calendar[data-jsx="3553823148"] {display: none;font-size: 0.7em;color: rgba(0, 0, 0, ' + OPACITIES.TEXT.SECONDARY + ');}.event-date-time[data-jsx="3553823148"] {margin: 0;text-align: center;}.event-date[data-jsx="3553823148"] {display: none;text-transform: none;}.start-date[data-jsx="3553823148"],.end-date[data-jsx="3553823148"] {white-space: nowrap;}.event-time[data-jsx="3553823148"] {margin: 0;text-transform: uppercase;}.event-title[data-jsx="3553823148"] {word-wrap: break-word;}.event-desc[data-jsx="3553823148"] {-webkit-flex: 1 1;-moz-flex: 1 1;flex: 1 1;margin: 0;font-size: 0.75em;word-wrap: break-word;white-space: pre-line;}.event.all-day[data-jsx="3553823148"] .event-time[data-jsx="3553823148"] {text-align: center;background: #bfbfbf;border-radius: 2px;padding: 0.15em 0.5em;}header[data-jsx="3553823148"] .close[data-jsx="3553823148"] {position: absolute;right: 0;top: 0;cursor: pointer;font-size: 1em;background: none;border: none;outline: none;color: rgba(0, 0, 0, ' + OPACITIES.TEXT.DISABLED + ');padding: 0.1em;margin: 0.1em;line-height: 0.8;}header[data-jsx="3553823148"] .close[data-jsx="3553823148"]:hover {color: rgba(0, 0, 0, ' + OPACITIES.TEXT.SECONDARY + ');}.active-event.expanded[data-jsx="3553823148"] {font-size: 2em;background-color: #fafafa;border: 1px solid grey;padding: 0;-webkit-transform: translate(calc(50vw - 50%), calc(50vh - 50%));-moz-transform: translate(calc(50vw - 50%), calc(50vh - 50%));-ms-transform: translate(calc(50vw - 50%), calc(50vh - 50%));transform: translate(calc(50vw - 50%), calc(50vh - 50%));box-shadow: 0 0 20px 0 ' + COLORS.SHADOW + ';}.expanded[data-jsx="3553823148"] header[data-jsx="3553823148"] {display:-webkit-flex; display:flex;-webkit-flex-direction: row;-moz-flex-direction: row;flex-direction: row;-webkit-flex-wrap: wrap;-moz-flex-wrap: wrap;flex-wrap: wrap;justify-content: space-around;align-items: center;padding: 0.5em 1em;text-align: center;box-shadow: 0 0 5px 0 ' + COLORS.SHADOW + ';background-color: ' + COLORS.BACKGROUND + ';}.expanded[data-jsx="3553823148"] .event-title[data-jsx="3553823148"] {-webkit-order: 1;-moz-order: 1;order: 1;font-size: 1.25em;}.expanded[data-jsx="3553823148"] .event-calendar[data-jsx="3553823148"] {display: block;}.expanded[data-jsx="3553823148"] .event-date-time[data-jsx="3553823148"] {-webkit-order: 2;-moz-order: 2;order: 2;}.expanded[data-jsx="3553823148"] .event-date[data-jsx="3553823148"],.expanded[data-jsx="3553823148"] .event-time[data-jsx="3553823148"] {display: block;}.expanded[data-jsx="3553823148"] .event-desc[data-jsx="3553823148"] {padding: 1em 2em 2em;overflow-y: auto;}@media (min-width: ' + BREAKPOINTS.SMALL_DESKTOP + 'px) {.event-date-time[data-jsx="3553823148"] {text-align: right;}.expanded[data-jsx="3553823148"] header[data-jsx="3553823148"] {justify-content: space-between;-webkit-flex-wrap: nowrap;-moz-flex-wrap: nowrap;flex-wrap: nowrap;text-align: left;}.expanded[data-jsx="3553823148"] .event-title[data-jsx="3553823148"] {margin-right: 1em;}.expanded[data-jsx="3553823148"] .event-date-time[data-jsx="3553823148"] {margin-left: 1em;}}'
				})
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this3 = this;

			window.requestAnimationFrame(function () {
				window.requestAnimationFrame(function () {
					_this3.setState({ expanded: true });
					if ('parentIFrame' in window) {
						window.parentIFrame.getPageInfo(function (parentPage) {
							var middleOfParentViewport = parentPage.scrollTop + parentPage.clientHeight / 2 - parentPage.offsetTop;
							var y = middleOfParentViewport > _this3.container.clientHeight / 2 ? middleOfParentViewport < window.innerHeight - _this3.container.clientHeight / 2 ? middleOfParentViewport + 'px' : '100vh - 50% - 10px' : '50% + 10px';
							var containerMaxHeight = parentPage.clientHeight * 0.9 - 50;
							_this3.container.style.maxHeight = containerMaxHeight + 'px';
							_this3.container.style.transform = 'translate(calc(50vw - 50%), calc(' + y + ' - 50%))';
						});
					}
					document.addEventListener('click', _this3.handleOutsideClick);
				});
			});
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			document.removeEventListener('click', this.handleOutsideClick);
		}
	}, {
		key: 'handleClick',
		value: function handleClick() {
			var _this4 = this;

			window.requestAnimationFrame(function () {
				_this4.setState({ expanded: false }, function () {
					if ('parentIFrame' in window) {
						window.parentIFrame.getPageInfo(false);
					}
					window.setTimeout(_this4.props.onClose, 140);
				});
			});
		}
	}, {
		key: 'handleOutsideClick',
		value: function handleOutsideClick(event) {
			var _this5 = this;

			if (event.defaultPrevented) return;

			window.requestAnimationFrame(function () {
				var rect = _this5.container.getBoundingClientRect();
				if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) _this5.handleClick();
			});
		}
	}]);

	return ActiveEvent;
}(CalendarEvent);

export default ActiveEvent;


ActiveEvent.propTypes = {
	event: PropTypes.object.isRequired,
	originalElement: PropTypes.object,
	onClose: PropTypes.func
};