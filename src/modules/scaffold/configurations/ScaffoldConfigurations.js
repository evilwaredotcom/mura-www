//import FirebaseAnimals from "./firebaseanimals";
import KickfireLocale from "./kickfire/kickfirelocale";
import ScaffoldTestOne from "./ScaffoldTestOne";
import PdDeals from "./pipedrive/pddeals";


export default class ScaffoldConfigurations {
	constructor() {
		this.configurations = {};
		this.configurations['Pddeals'] = new PdDeals();
//		this.configurations['firebaseanimals'] = FirebaseAnimals;
		this.registerConfigurations();
	}

	registerConfigurations() {
		for(var c in this.configurations) {
			//this.configurations[c].getConfiguration();
			this.configurations[c].registerEntity();
		}
	}

	getConfigurations = () => {
		return configurations;
	}

	getConfiguration = (name) => {
		var caseName = name.charAt(0).toUpperCase() + name.slice(1);
		if(this.configurations[caseName] == undefined) {
			return {}
		}
		else {
			const obj = this.configurations[caseName];
			return obj;
		}
	}

	addConfiguration = (name,obj) => {
		var caseName = name.charAt(0).toUpperCase() + name.slice(1);

		this.configurations[caseName] = new obj();
	}
}