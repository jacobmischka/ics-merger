var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import colorString from 'color-string';

export function getEventSources(calendars) {
	var eventSources = [];

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		var _loop = function _loop() {
			var calendar = _step.value;

			if (calendar) {
				(function () {
					var color = calendar.color;
					var googleCalendarId = calendar.googleCalendarId;
					if (googleCalendarId) {
						eventSources.push({
							googleCalendarId: googleCalendarId,
							color: color,
							eventDataTransform: function eventDataTransform(eventData) {
								return Object.assign(eventData, {
									color: color,
									calendar: calendar
								});
							}
						});
					}
					if (calendar.subCalendars) {
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = calendar.subCalendars[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var subCalendar = _step2.value;

								eventSources.push({
									googleCalendarId: subCalendar.googleCalendarId,
									color: color,
									eventDataTransform: function eventDataTransform(eventData) {
										return Object.assign(eventData, {
											color: color,
											calendar: calendar
										});
									}
								});
							}
						} catch (err) {
							_didIteratorError2 = true;
							_iteratorError2 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}
							} finally {
								if (_didIteratorError2) {
									throw _iteratorError2;
								}
							}
						}
					}
				})();
			}
		};

		for (var _iterator = calendars[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			_loop();
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return eventSources;
}

export function nl2br(text) {
	return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
}

export function ucfirst(str) {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

export function camelCaseToWords(str) {
	var result = '';
	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = str[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var char = _step3.value;

			if (result === '') {
				result += char.toUpperCase();
			} else if (char === char.toUpperCase()) {
				result += ' ' + char.toLowerCase();
			} else {
				result += char;
			}
		}
	} catch (err) {
		_didIteratorError3 = true;
		_iteratorError3 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion3 && _iterator3.return) {
				_iterator3.return();
			}
		} finally {
			if (_didIteratorError3) {
				throw _iteratorError3;
			}
		}
	}

	return result;
}

export function rgbaOverRgb(rgba) {
	var rgb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [255, 255, 255];

	rgba = colorToArray(rgba);
	rgb = colorToArray(rgb);

	if (rgba.length < 4 || rgba[rgba.length - 1] === 1) return colorString.to.rgb(rgba);

	var rgbaAlpha = rgba.pop();

	var resultPieces = [];
	for (var i = 0; i < rgb.length; i++) {
		resultPieces.push(rgb[i] + (rgba[i] - rgb[i]) * rgbaAlpha);
	}

	return colorString.to.rgb(resultPieces);
}

function colorToArray(color) {
	if (!Array.isArray(color)) {
		switch (typeof color === 'undefined' ? 'undefined' : _typeof(color)) {
			case 'object':
				return color.array();
			case 'string':
				return colorString.get(color).value;
		}
	}

	return color;
}
