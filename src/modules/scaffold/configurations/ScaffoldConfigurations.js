import ScaffoldTestOne from "./ScaffoldTestOne";
const configurations = [];

export default class ScaffoldConfigurations {
	constructor() {
		configurations['scaffoldTestOne'] = new ScaffoldTestOne();
	}

	getConfiguration = (name) => {
		if(configurations[name] == undefined) {
			console.log("CONFIG DOES NOT EXIST!");
			return {}
		}
		else {
			const obj = configurations[name];
			console.log("NAMED",obj.getConfig());
			return obj;
		}
	}
}