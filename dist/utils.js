var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import colorString from 'color-string';

export function nl2br(text) {
	return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
}

export function ucfirst(str) {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

export function camelCaseToWords(str) {
	var result = '';
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = str[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var char = _step.value;

			if (result === '') {
				result += char.toUpperCase();
			} else if (char === char.toUpperCase()) {
				result += ' ' + char.toLowerCase();
			} else {
				result += char;
			}
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
