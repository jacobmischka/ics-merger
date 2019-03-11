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

	const { name, location: subLocation, address, description } = location;

	return (
		<div>
			<style jsx>{`
				address {
					font-style: normal;
				}
			`}</style>
			<address>
				{name}	<br />
				{subLocation} <br />
				{address}
			</address>
			{description && (
				<p>{description}</p>
			)}
		</div>
	);

};

export default EventLocation;
