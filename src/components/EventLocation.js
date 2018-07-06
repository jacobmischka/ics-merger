import React from 'react';

const EventLocation = ({ location }) => {
	if (!location)
		return;

	if (typeof location === 'string')
		return (
			<div>
				<style jsx>{`
					address {
						font-style: normal;
					}
				`}</style>
				<address>
					{location}
				</address>
			</div>
		);

	try {
		const { name, location, address, description } = location;

		return (
			<div>
				<style jsx>{`
					address {
						font-style: normal;
					}
				`}</style>
				<address>
					{name}	<br />
					{location} <br />
					{address}
				</address>
				{description && (
					<p>{description}</p>
				)}
			</div>
		);
	} catch (err) {
		console.error(err);
	}

};

export default EventLocation;
