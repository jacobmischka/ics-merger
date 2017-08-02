import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as firebase from 'firebase/app';
import 'firebase/auth';

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
				fetch('send-reminder', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						idToken,
						events,
						calendarUrl
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