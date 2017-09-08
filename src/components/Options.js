import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { camelCaseToWords } from '@jacobmischka/to-words';

export default class Options extends Component {
	constructor() {
		super();

		this.handleOptionChange = this.handleOptionChange.bind(this);
		this.toggleOption = this.toggleOption.bind(this);
	}

	render() {
		const options = [
			'showCalendarNames',
			'showLocations'
		];

		let params = new URLSearchParams(location.search);

		const inputs = options.map(option =>
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
				<style jsx>
				{`
					div {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						justify-content: space-around;
					}
				`}
				</style>
			</div>
		);
	}

	handleOptionChange(event) {
		let option = event.target.value;
		this.toggleOption(option);
	}

	toggleOption(option) {
		const { location, history } = this.props;
		let params = new URLSearchParams(location.search);
		if (params.has(option))
			params.delete(option);
		else
			params.append(option, true);

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
