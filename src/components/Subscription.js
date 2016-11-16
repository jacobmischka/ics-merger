import React from 'react';
import Clipboard from 'clipboard';

export default class Subscription extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			showSub: false,
			copied: false
		};

		this.handleShowSub = this.handleShowSub.bind(this);
	}

	componentWillUpdate(nextProps, nextState){
		if(this.state.showSub && !nextState.showSub && this.clipboard)
			this.clipboard.destroy();
	}

	render(){
		const calendarIcalUrl =
			`${window.location.origin}/${this.props.calendarId}.ics`;

		return (
			<div>
	{
		this.state.showSub
			? (
				<div className="sub-container">
					<input type="text" className="input" id="sub-url" readOnly
						value={calendarIcalUrl} />
					<button id="copy-button" className="button"
							data-balloon-visible={this.state.copied ? true : null}
							data-balloon={this.state.copied ? 'Copied!' : null}
							data-clipboard-target="#sub-url">
						Copy
					</button>
				</div>
			)
			: (
				<div className="sub-container">
					<a href="#" className="button outline" onClick={this.handleShowSub}>
						Subscribe to this calendar
					</a>
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
}

Subscription.propTypes = {
	calendarId: React.PropTypes.string
};
