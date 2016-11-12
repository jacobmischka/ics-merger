import React from 'react';

import CalendarEvent from './CalendarEvent.js';

export default class ActiveEvent extends CalendarEvent {
	constructor(props){
		super(props);
		this.state = {
			expanded: false
		};

		this.handleOutsideClick = this.handleOutsideClick.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	render(){
		let left = (this.props.originalPosition.left - 1)
			+ this.props.originalScroll.x;
		let top = (this.props.originalPosition.top - 1)
			+ this.props.originalScroll.y;
		let style = {
			boxSizing: 'border-box',
			position: 'absolute',
			left: 0,
			top: 0,
			width: this.props.originalPosition.width * 2,
			height: this.props.originalPosition.height * 2,
			maxWidth: '90vw',
			maxHeight: '90vh',
			transform: `translate(calc(${left}px - 25%), calc(${top}px - 25%)) scale(0.5)`,
			backgroundColor: 'orange',
			border: '1px solid red',
			zIndex: 100,
			transitionDuration: '0.15s',
			transitionProperty: 'left, top, width, height, transform',
			fontSize: '2em',
			overflow: 'hidden',
			cursor: 'auto'
		};

		if(this.state.expanded){
			style.height = null;
			style.position = 'fixed';
			style.transform = 'translate(calc(50vw - 50%), calc(50vh - 50%))';
			style.boxShadow = '0 0 20px 5px rgba(0, 0, 0, 0.5)';
		}

		let eventTime = this.getEventTime();
		let className = this.getClassName();
		className += ' active-event';


		return (
			<div key="active-event" className={className} style={style}
					ref={div => this.container = div}>
				<span className="event-time">
					{eventTime}
				</span>
				<span className="event-title">{this.props.event.title}</span>
				<p className="event-desc">
					{this.props.event.description}
				</p>
			</div>
		);
	}

	componentDidMount(){
		window.requestAnimationFrame(() => {
			window.requestAnimationFrame(() => {
				this.setState({expanded: true});

				document.addEventListener('click', this.handleOutsideClick);
			});
		});
	}

	componentWillUnmount(){
		document.removeEventListener('click', this.handleOutsideClick);
	}

	handleClick(){
		window.requestAnimationFrame(() => {
			this.setState({expanded: false}, () => {
				window.setTimeout(this.props.onClose, 140);
			});
		});
	}

	handleOutsideClick(event){
		if(event.defaultPrevented)
			return;

		window.requestAnimationFrame(() => {
			let rect =  this.container.getBoundingClientRect();
			if(event.clientX < rect.left || event.clientX > rect.right
					|| event.clientY < rect.top || event.clientY > rect.bottom)
				this.handleClick();
		});
	}
}

ActiveEvent.propTypes = {
	event: React.PropTypes.object.isRequired,
	originalPosition: React.PropTypes.object,
	originalScroll: React.PropTypes.object,
	onClose: React.PropTypes.func
};
