export function nl2br(text){
	return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
}

export function ucfirst(str){
	return str.charAt(0).toUpperCase() + str.substring(1);
}

export function camelCaseToWords(str){
	let result = '';
	for(let char of str){
		if(result === ''){
			result += char.toUpperCase();
		}
		else if(char === char.toUpperCase()){
			result += ' ' + char.toLowerCase();
		}
		else {
			result += char;
		}
	}
	return result;
}
