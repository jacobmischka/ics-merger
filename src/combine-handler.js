/** @format */
/* eslint-env node */

const { parse } = require('url');

const merge = require("./index.js");
const { getIcalsFromUrls, setHeaders } = require("./server-utils.js");
const dotenv = require("../.env.json");

const URL_PROPS = [
	'url',
	'urls',
	'urls[]'
];

module.exports = (req, res) => {
	const { query } = parse(req.url, true);

	let urls = [];
	for (const prop of URL_PROPS) {
		if (query[prop]) {
			urls = urls.concat(query[prop]);
		}
	}

	if (!urls) {
		res.writeHead(400);
		res.end();
		return;
	}

	let icals = getIcalsFromUrls(urls);

	setHeaders(res);

	let options = {};
	if (dotenv && dotenv.combine) options = Object.assign({}, dotenv.combine);
	options = Object.assign({}, options, query);

	icals
		.then(icals => {
			res.writeHead(200);
			res.end(merge(icals, options));
		})
		.catch(err => {
			console.error(`Error merging: ${err}`);
			res.writeHead(500);
			res.end();
		});
};
