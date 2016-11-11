import React from 'react';

import CalendarEvent from './CalendarEvent.js';

export default class ActiveEvent extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			expanded: false
		};

		this.handleClick = this.handleClick.bind(this);
	}

	render(){
		let left = (this.props.originalPosition.left - 1)
			- (this.props.originalPosition.width / 2);
		let top = (this.props.originalPosition.top - 1)
			- (this.props.originalPosition.height / 2);
		let style = {
			boxSizing: 'border-box',
			position: 'absolute',
			left: 0,
			top: 0,
			width: this.props.originalPosition.width * 2,
			height: this.props.originalPosition.height * 2,
			transform: `translate(${left}px, ${top}px) scale(0.5)`,
			backgroundColor: 'orange',
			border: '1px solid red',
			zIndex: 100,
			transitionDuration: '0.15s',
			transitionProperty: 'left, top, width, height, transform',
			fontSize: '2em'
		};

		if(this.state.expanded){
			style.transform = `translate(${left}px, ${top}px)`;
		}


		return (
			<CalendarEvent key="active-event" event={this.props.event}
				style={style} onClick={this.handleClick} />
		);
	}

	componentDidMount(){
		window.requestAnimationFrame(() => {
			window.requestAnimationFrame(() => {
				this.setState({expanded: true});
			});
		});
	}

	handleClick(){
		window.requestAnimationFrame(() => {
			this.setState({expanded: false}, () => {
				window.setTimeout(this.props.onClose, 130);
			});
		});
	}
}

ActiveEvent.propTypes = {
	event: React.PropTypes.object.isRequired,
	originalPosition: React.PropTypes.object,
	onClose: React.PropTypes.func
};
