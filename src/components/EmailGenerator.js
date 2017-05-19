import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import PropTypes from 'prop-types';

import download from 'downloadjs';

import ActiveEvent from './ActiveEvent.js';

import { createEml } from '../utils.js';

export default class EmailGenerator extends Component {
	constructor(props) {
		super(props);
		
		this.handleClick = this.handleClick.bind(this);
	}
	
	render() {
		return (
			<button type="button" className="button"
					onClick={this.handleClick}>
				Click!
			</button>
		);
	}
	
	handleClick() {
		const calendarUrl = window.location.href.replace(window.location.hash, '');
		
		const events = this.props.getEvents();
		
		if (events.length > 0) {
			const activeEvents = events.map(event =>
				<ActiveEvent event={event} eventLink={`${calendarUrl}#${event.id}`} expanded inline />);
			const html = renderToString(<div>{activeEvents}</div>);
				
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			const dataJsx = doc.querySelector('.active-event').getAttribute('data-jsx');
			
			const container = document.createElement('div');
			container.style.display = 'none';
			document.body.appendChild(container);
			
			render(<ActiveEvent event={events[0]} expanded inline />, container);
			
			window.setTimeout(() => {
				const styles = document.getElementsByTagName('style');
				console.log({styles, dataJsx});
				let activeEventStyles = Array.from(styles)
					.filter(style => style.textContent.includes(`data-jsx="${dataJsx}"`))
					.map(style => <style dangerouslySetInnerHTML={{__html: style.textContent}}></style>);
					
				unmountComponentAtNode(container);
				document.body.removeChild(container);
					
					
				const body = '<!DOCTYPE html>' + renderToStaticMarkup(
					<html>
						<head>
							{activeEventStyles}
							<style>
							{`
								div[data-reactroot] {
									display: flex;
									flex-direction: column;
									justify-content: center;
									align-items: stretch;
									font-size: 0.75em;
								}
								
								.active-event {
									margin: 0.5em !important;
								}
							`}
							</style>
						</head>
						<body dangerouslySetInnerHTML={{__html: html}}>
						</body>
					</html>
				);
				
				const eml = createEml(body);
					
				download(eml, 'events.eml', 'message/rfc822');
			}, 500);
		}
	}
}

EmailGenerator.propTypes = {
	getEvents: PropTypes.func.isRequired
};