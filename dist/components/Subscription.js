var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _JSXStyle from 'styled-jsx/style';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import Clipboard from 'clipboard';
import Color from 'color';

import { COLORS, OPACITIES } from '../constants.js';

var buttonHoverBackgroundColor = new Color(COLORS.PRIMARY).alpha(OPACITIES.SECONDARY);
var secondaryText = new Color(COLORS.TEXT).alpha(OPACITIES.TEXT.SECONDARY);

var Subscription = function (_Component) {
	_inherits(Subscription, _Component);

	function Subscription(props) {
		_classCallCheck(this, Subscription);

		var _this = _possibleConstructorReturn(this, (Subscription.__proto__ || Object.getPrototypeOf(Subscription)).call(this, props));

		_this.state = {
			showSub: false,
			copyButtonHovered: false,
			showUrl: false,
			copied: false
		};

		_this.handleShowSub = _this.handleShowSub.bind(_this);
		_this.handleHideSub = _this.handleHideSub.bind(_this);
		_this.toggleShowUrl = _this.toggleShowUrl.bind(_this);
		_this.handleCopyButtonMouseDown = _this.handleCopyButtonMouseDown.bind(_this);
		_this.handleCopyButtonMouseUp = _this.handleCopyButtonMouseUp.bind(_this);
		return _this;
	}

	_createClass(Subscription, [{
		key: 'componentWillUpdate',
		value: function componentWillUpdate(nextProps, nextState) {
			if (this.state.showSub && !nextState.showSub || this.state.showUrl && !nextState.showUrl) this.clipboard.destroy();
		}
	}, {
		key: 'render',
		value: function render() {
			var calendarIcalUrl = window.location.origin + '/' + this.props.icsFilename;

			var webcalUrl = calendarIcalUrl.replace(window.location.protocol, 'webcal:');

			return React.createElement(
				'div',
				{ className: 'subscription-component', 'data-jsx': 3030989675
				},
				this.state.showSub ? React.createElement(
					'div',
					{
						'data-jsx': 3030989675
					},
					React.createElement(
						'div',
						{ className: 'sub-controls', 'data-jsx': 3030989675
						},
						React.createElement(
							'a',
							{ id: 'webcal-button', className: 'button outline',
								href: webcalUrl, 'data-jsx': 3030989675
							},
							'Subscribe with Outlook'
						),
						this.state.showUrl ? React.createElement(
							'section',
							{ className: 'copy-with-url', 'data-jsx': 3030989675
							},
							React.createElement('input', { type: 'text', id: 'sub-url',
								value: calendarIcalUrl, readOnly: true, 'data-jsx': 3030989675
							}),
							React.createElement(
								'button',
								{ id: 'copy-button', className: 'button',
									'data-clipboard-target': '#sub-url',
									title: 'Long press to hide url',
									onMouseDown: this.handleCopyButtonMouseDown,
									onMouseUp: this.handleCopyButtonMouseUp, 'data-jsx': 3030989675
								},
								'Copy subscription address'
							)
						) : React.createElement(
							'button',
							{ id: 'copy-button', className: 'button outline',
								'data-clipboard-text': calendarIcalUrl,
								title: 'Long press to show url',
								onMouseDown: this.handleCopyButtonMouseDown,
								onMouseUp: this.handleCopyButtonMouseUp, 'data-jsx': 3030989675
							},
							'Copy subscription address'
						),
						React.createElement(
							'a',
							{ id: 'download-button', className: 'button outline',
								href: calendarIcalUrl, target: '_blank',
								download: this.props.icsFilename, 'data-jsx': 3030989675
							},
							'Download ICal/.ics file'
						)
					),
					React.createElement(
						'div',
						{ className: 'text-center', 'data-jsx': 3030989675
						},
						React.createElement(
							'a',
							{ href: '#', id: 'hide-sub', onClick: this.handleHideSub, 'data-jsx': 3030989675
							},
							'Hide subscription info'
						)
					)
				) : React.createElement(
					'div',
					{ className: 'sub-controls', 'data-jsx': 3030989675
					},
					React.createElement(
						'button',
						{ className: 'button outline', onClick: this.handleShowSub, 'data-jsx': 3030989675
						},
						'Subscribe to this calendar'
					)
				),
				React.createElement(_JSXStyle, {
					styleId: 3030989675,
					css: '.subscription-component[data-jsx="3030989675"] {margin: 2em;}.sub-controls[data-jsx="3030989675"] {display:-webkit-flex; display:flex;-webkit-flex-wrap: wrap;-moz-flex-wrap: wrap;flex-wrap: wrap;-webkit-flex-direction: row;-moz-flex-direction: row;flex-direction: row;justify-content: space-around;align-items: flex-end;font-size: 1.25em;}.copy-with-url[data-jsx="3030989675"] {display:-webkit-flex; display:flex;-webkit-flex-direction: column;-moz-flex-direction: column;flex-direction: column;align-items: stretch;}#sub-url[data-jsx="3030989675"] {display: block;-webkit-user-select: all;-moz-user-select: all;-ms-user-select: all;user-select: all;color: ' + secondaryText + ';}#hide-sub[data-jsx="3030989675"] {font-size: 0.85em;text-decoration: none;color: ' + secondaryText + ';}#hide-sub[data-jsx="3030989675"]:hover {text-decoration: underline;}input[data-jsx="3030989675"] {font-size: 1.5em;padding: 0.5em;border: 1px solid rgba($grey-color, 0.45);}.button[data-jsx="3030989675"] {margin: 0.5em;border-radius: 5px;padding: 0.5em 1em;cursor: pointer;text-decoration: none;color: white;font-size: 1.25em;line-height: 1.4;border: 2px solid ' + COLORS.PRIMARY + ';background: ' + COLORS.PRIMARY + ';}.button[data-jsx="3030989675"]:hover {background: ' + buttonHoverBackgroundColor + ';}.button.outline[data-jsx="3030989675"] {background: transparent;color: ' + COLORS.PRIMARY + ';}.button.outline[data-jsx="3030989675"]:hover {color: white;background: ' + buttonHoverBackgroundColor + ';}.text-center[data-jsx="3030989675"] {text-align: center;}@media print {.subscription-component[data-jsx="3030989675"] {display: none;}}'
				})
			);
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			var _this2 = this;

			if (this.state.showSub) {
				this.clipboard = new Clipboard('#copy-button');
				this.clipboard.on('success', function () {
					_this2.setState({ copied: true }, function () {
						window.setTimeout(function () {
							_this2.setState({ copied: false });
						}, 2000);
					});
				});
			}
		}
	}, {
		key: 'handleShowSub',
		value: function handleShowSub(event) {
			event.preventDefault();
			this.setState({ showSub: true });
		}
	}, {
		key: 'handleHideSub',
		value: function handleHideSub(event) {
			event.preventDefault();
			this.setState({ showSub: false });
		}
	}, {
		key: 'toggleShowUrl',
		value: function toggleShowUrl() {
			this.setState(function (state) {
				return { showUrl: !state.showUrl };
			});
		}
	}, {
		key: 'handleCopyButtonMouseDown',
		value: function handleCopyButtonMouseDown() {
			var _this3 = this;

			this.copyButtonPressTimeout = window.setTimeout(function () {
				_this3.toggleShowUrl();
			}, 1000);
		}
	}, {
		key: 'handleCopyButtonMouseUp',
		value: function handleCopyButtonMouseUp() {
			if (this.copyButtonPressTimeout) window.clearTimeout(this.copyButtonPressTimeout);
		}
	}]);

	return Subscription;
}(Component);

export default Subscription;


Subscription.propTypes = {
	icsFilename: PropTypes.string
};