import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import PropTypes from 'prop-types';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import download from 'downloadjs';

import ActiveEvent from './ActiveEvent.js';

import { createEml } from '../utils.js';

export default class EmailGenerator extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			
			user: null
		};
		
		this.handleSendClick = this.handleSendClick.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}
	
	componentDidMount() {
		firebase.initializeApp(this.props.firebaseConfig);
		
		firebase.auth().onAuthStateChanged(user => {
			this.setState({user});
		});
	}
	
	render() {
		return this.state.user
			? (
				<button type="button" className="button"
						onClick={this.handleSendClick}>
					Send!
				</button>
			)
			: (
				<form>
					<input type="email" placeholder="Email"
						onInput={event => this.setState({email: event.target.value})} />
					<input type="password" placeholder="Password"
						onInput={event => this.setState({password: event.target.value})} />
					<button type="submit" className="button"
							onClick={this.handleLogin}>
						Login
					</button>					
				</form>
			);
	}
	
	handleLogin(event) {
		event.preventDefault();
		
		if (!this.state.email || !this.state.password)
			return;
			
		firebase.auth().signInWithEmailAndPassword(
			this.state.email, this.state.password
		).catch(err => {
			console.error(err);
		});
	}
	
	handleSendClick() {
		if (!this.state.user)
			return;
			
		firebase.auth().currentUser.getToken(true).then(idToken => {
			
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
					
					fetch('send-reminder', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							idToken,
							body
						})
					}).then(response => {
						if (response.ok)
							return response.text();
						
						throw new Error(response.statusText);
					}).then(responseText => {
						console.log(responseText);
					}).catch(err => {
						console.error(err);
					});
				}, 500);
			}
		}).catch(err => {
			console.error(err);
		});
	}
}

EmailGenerator.propTypes = {
	firebaseConfig: PropTypes.shape({
		apiKey: PropTypes.string,
		authDomain: PropTypes.string,
		databaseURL: PropTypes.string,
		projectId: PropTypes.string,
		storageBucket: PropTypes.string,
		messagingSenderId: PropTypes.string
	}).isRequired,
	getEvents: PropTypes.func.isRequired
};