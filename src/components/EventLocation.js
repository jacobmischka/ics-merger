import React, { Fragment } from 'react';

const EventLocation = ({ name, location, address, description }) => (
	<Fragment>
		<style jsx>{`
			address {
				font-style: normal;
			}
		`}</style>
		<address className={address}>
			{name}	<br />
			{location} <br />
			{address}
		</address>
		{description && (
			<p>{description}</p>
		)}
	</Fragment>
);

export default EventLocation;
