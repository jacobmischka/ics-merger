import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as localforage from 'localforage';

import { camelCaseToWords } from '../utils.js';

export default class Options extends Component {
	constructor() {
		super();

		this.options = [
			'showCalendarNames',
			'showLocations'
		];

		this.handleOptionChange = this.handleOptionChange.bind(this);
		this.getStoredOptions = this.getStoredOptions.bind(this);
		this.toggleOption = this.toggleOption.bind(this);
	}

	componentDidMount() {
		this.getStoredOptions();
	}

	render() {
		let params = new URLSearchParams(location.search);

		const inputs = this.options.map(option =>
			<label key={option}>
				<input type="checkbox" value={option}
					checked={params.has(option)}
					onChange={this.handleOptionChange} />

				{camelCaseToWords(option)}
			</label>
		);

		return (
			<div>
				{inputs}
				<style jsx>{`
					div {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						justify-content: space-around;
					}
				`}</style>
			</div>
		);
	}

	getStoredOptions() {
		const promises = this.options.map(option =>
			localforage.getItem(option).then(val => ([option, val])).catch(err => {
				console.error(`Failed fetching stored option for ${option}`, err);
			})
		);

		Promise.all(promises).then(options => {
			const { location, history } = this.props;
			let params = new URLSearchParams(location.search);

			let paramsChanged = false;
			for (const [option, value] of options) {
				if (value && !params.has(option)) {
					params.set(option, true);
					paramsChanged = true;
				}
			}

			if (paramsChanged) {
				let newLocation = Object.assign({}, location, {search: `?${params.toString()}`});
				history.push(newLocation);
			}
		}).catch(err => {
			console.error(
				"Failed fetching all options somehow? Don't think this should happen",
				err
			);
		});
	}

	handleOptionChange(event) {
		let option = event.target.value;
		this.toggleOption(option);
	}

	toggleOption(option, checked) {
		const { location, history } = this.props;
		let params = new URLSearchParams(location.search);
		const enabled = checked != null
			? checked
			: !params.has(option);
		if (enabled) {
			params.set(option, true);
			localforage.setItem(option, true).catch(err => {
				console.error(`Failed setting stored option ${option}`, err);
			});
		} else {
			params.delete(option);
			localforage.removeItem(option).catch(err => {
				console.error(`Failed removing stored option ${option}`, err);
			});
		}

		let newLocation = Object.assign({}, location, {search: `?${params.toString()}`});
		history.push(newLocation);
	}
}

Options.propTypes = {
	location: PropTypes.shape({
		search: PropTypes.string
	}),
	history: PropTypes.shape({
		push: PropTypes.func.isRequired
	})
};
