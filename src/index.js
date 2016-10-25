import ICAL from 'ical.js';

export default function merge(inputs){
	if(!Array.isArray(inputs))
		inputs = [...arguments];

	let calendar;
	for(let input of inputs){
		let jcal = ICAL.parse(input);
		let cal = new ICAL.Component(jcal);

		if(!calendar) {
			calendar = cal;
		}
		else {
			for(let vevent of cal.getAllSubcomponents('vevent')){
				calendar.addSubcomponent(vevent);
			}
		}
	}

	if(!calendar){
		console.error('No icals parsed successfully');
		return;
	}

	return calendar.toString();
}
