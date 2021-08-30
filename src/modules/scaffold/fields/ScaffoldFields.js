export default function ScaffoldFields() {
	
}

export const cleanDefaultNulls = ( val ) => {
	if(val == 'null') {
		return null;
	}
	return val;
}