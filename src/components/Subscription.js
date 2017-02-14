import React, { Component, PropTypes } from 'react';
import Clipboard from 'clipboard';
import Color from 'color';

import { COLORS, OPACITIES } from '../constants.js';

const buttonHoverBackgroundColor = new Color(COLORS.PRIMARY).alpha(OPACITIES.SECONDARY);
const secondaryText = new Color(COLORS.TEXT).alpha(OPACITIES.TEXT.SECONDARY);

export default class Subscription extends Component {
	constructor(props){
		super(props);
		this.state = {
			showSub: false,
			copyButtonHovered: false,
			showUrl: false,
			copied: false
		};

		this.handleShowSub = this.handleShowSub.bind(this);
		this.handleHideSub = this.handleHideSub.bind(this);
		this.toggleShowUrl = this.toggleShowUrl.bind(this);
		this.handleCopyButtonMouseDown = this.handleCopyButtonMouseDown.bind(this);
		this.handleCopyButtonMouseUp = this.handleCopyButtonMouseUp.bind(this);
	}

	componentWillUpdate(nextProps, nextState){
		if((this.state.showSub && !nextState.showSub)
				|| (this.state.showUrl && !nextState.showUrl))
			this.clipboard.destroy();
	}

	render(){
		const calendarIcalUrl =
			`${window.location.origin}/${this.props.icsFilename}`;

		const webcalUrl = calendarIcalUrl
			.replace(window.location.protocol, 'webcal:');




		return (
			<div className="subscription-component">
	{
		this.state.showSub
			? (
				<div>
					<div className="sub-controls">
						<a id="webcal-button" className="button outline"
								href={webcalUrl}>
							Subscribe with Outlook
						</a>
				{
					this.state.showUrl
					? (
						<section className="copy-with-url">
							<input type="text" id="sub-url"
								value={calendarIcalUrl} readOnly />
							<button id="copy-button" className="button"
									data-clipboard-target="#sub-url"
									title="Long press to hide url"
									onMouseDown={this.handleCopyButtonMouseDown}
									onMouseUp={this.handleCopyButtonMouseUp}>
								Copy subscription address
							</button>
						</section>
					)
					: (
						<button id="copy-button" className="button outline"
								data-clipboard-text={calendarIcalUrl}
								title="Long press to show url"
								onMouseDown={this.handleCopyButtonMouseDown}
								onMouseUp={this.handleCopyButtonMouseUp}>
							Copy subscription address
						</button>
					)
				}
						<a id="download-button" className="button outline"
								href={calendarIcalUrl} target="_blank"
								download={this.props.icsFilename}>
							Download ICal/.ics file
						</a>
					</div>
					<div className="text-center">
						<a href="#" id="hide-sub" onClick={this.handleHideSub}>
							Hide subscription info
						</a>
					</div>
				</div>
			)
			: (
				<div className="sub-controls">
					<button className="button outline" onClick={this.handleShowSub}>
						Subscribe to this calendar
					</button>
				</div>
			)
	}
	
				<style jsx>
				{`
					.subscription-component {
						margin: 2em;
					}
					
					.sub-controls {
						display: flex;
						flex-wrap: wrap;
						flex-direction: row;
						justify-content: space-around;
						align-items: flex-end;
						font-size: 1.25em;
					}
					
					.copy-with-url {
						display: flex;
						flex-direction: column;
						align-items: stretch;
					}
					
					#sub-url {
						display: block;
						user-select: all;
						color: ${secondaryText};
					}
					
					#hide-sub {
						font-size: 0.85em;
						text-decoration: none;
						color: ${secondaryText};
					}
					
					#hide-sub:hover {
						text-decoration: underline;
					}
					
					input {
						font-size: 1.5em;
						padding: 0.5em;
						border: 1px solid rgba($grey-color, 0.45);
					}
					
					.button {
						margin: 0.5em;
						border-radius: 5px;
						padding: 0.5em 1em;
						cursor: pointer;
						text-decoration: none;
						color: white;
						font-size: 1.25em;
						line-height: 1.4;
						border: 2px solid ${COLORS.PRIMARY};
						background: ${COLORS.PRIMARY};
					}
					
					.button:hover {
						background: ${buttonHoverBackgroundColor};
					}
					
					.button.outline {
						background: transparent;
						color: ${COLORS.PRIMARY};
					}
					
					.button.outline:hover {
						color: white;
						background: ${buttonHoverBackgroundColor};
					}
				
					.text-center {
						text-align: center;
					}
				`}
				</style>
			</div>
		);
	}

	componentDidUpdate(){
		if(this.state.showSub){
			this.clipboard = new Clipboard('#copy-button');
			this.clipboard.on('success', () => {
				this.setState({copied: true}, () => {
					window.setTimeout(() => {
						this.setState({copied: false});
					}, 2000);
				});
			});
		}
	}

	handleShowSub(event){
		event.preventDefault();
		this.setState({showSub: true});
	}

	handleHideSub(event){
		event.preventDefault();
		this.setState({showSub: false});
	}

	toggleShowUrl(){
		this.setState(state => {
			return {showUrl: !state.showUrl};
		});
	}

	handleCopyButtonMouseDown(){
		this.copyButtonPressTimeout = window.setTimeout(() => {
			this.toggleShowUrl();
		}, 1000);
	}

	handleCopyButtonMouseUp(){
		if(this.copyButtonPressTimeout)
			window.clearTimeout(this.copyButtonPressTimeout);
	}
}

Subscription.propTypes = {
	icsFilename: PropTypes.string
};
