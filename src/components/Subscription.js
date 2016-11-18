import React from 'react';
import Clipboard from 'clipboard';

export default class Subscription extends React.Component {
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
			`${window.location.origin}/${this.props.calendarId}.ics`;

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
							<input type="text" className="input" id="sub-url"
								value={calendarIcalUrl} readOnly />
							<button id="copy-button" className="button"
									data-balloon-visible={this.state.copied || null}
									data-balloon={this.state.copied ? 'Copied!' : null}
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
								data-balloon-visible={this.state.copied || null}
								data-balloon={this.state.copied ? 'Copied!' : null}
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
								download={`${this.props.calendarId}.ics`}>
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
	calendarId: React.PropTypes.string
};
