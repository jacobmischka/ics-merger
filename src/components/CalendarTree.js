/* @flow */

import React, { Component } from 'react';
import type { Node, ElementType } from 'react';

import type { CalendarLike, CalendarTreeDef } from '../utils.js';

type Props = {
	calendars: {[string]: CalendarLike},
	label?: Node,
	calendarTree?: CalendarTreeDef,
	render: (string, CalendarLike) => Node,
	keyPrefix: string,
	container: ElementType,
	children?: Node
};

export default class CalendarTree extends Component<Props, {}> {
	static defaultProps = {
		container: 'li'
	};

	render() {
		const { calendars, calendarTree, render, keyPrefix, children } = this.props;
		const Container = this.props.container;

		const label = this.props.label
			? this.props.label
			: calendarTree
				? calendarTree.label
				: '';

		const items = calendarTree
			? (
				calendarTree.items.filter(item =>
					typeof item !== 'string' || calendars[item]
				).map((item, i) => {
					if (typeof item === 'string') {
						const calendar: CalendarLike = calendars[item];
						return render(item, calendar);
					} else {
						let key = `${keyPrefix}-${i}`;
						return (
							<CalendarTree key={key}
								keyPrefix={`${key}-`}
								calendars={calendars}
								render={render}
								calendarTree={item} />
						);
					}
				})
			)
			: (
				// $FlowFixMe: https://github.com/facebook/flow/issues/2221
				(Object.entries(calendars): Array<[string, CalendarLike]>)
					.map(([calId, cal]) => render(calId, cal))
			);

		return (
			<Container key={keyPrefix}>
				{label}
				<ul>
					{items}
					{children}
				</ul>
			</Container>
		);
	}
}
