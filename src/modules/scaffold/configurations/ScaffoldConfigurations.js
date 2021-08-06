import Mura from "mura.js";
import FirebaseAnimals from "./firebaseanimals";
import KickfireLocale from "./kickfire/kickfirelocale";
import ScaffoldTestOne from "./ScaffoldTestOne";
import PdDeals from "./pipedrive/pddeals";


export default class ScaffoldConfigurations {
	constructor() {
		this.configurations = {};
//		this.configurations['scaffoldTestOne'] = ScaffoldTestOne;
		this.configurations['Kickfirelocale'] = new KickfireLocale();
		this.configurations['Pddeals'] = new PdDeals();
//		this.configurations['firebaseanimals'] = FirebaseAnimals;
		//Mura.feeds[this.entityname]= new ApiFeed();
		this.registerConfigurations();
	}

	registerConfigurations() {
		for(var c in this.configurations) {
			console.log("CONF",this.configurations[c]);
			this.configurations[c].registerEntity();
		}
	}

	getConfigurations = () => {
		return configurations;
	}

	getConfiguration = (name) => {
		var caseName = name.charAt(0).toUpperCase() + name.slice(1);
		if(this.configurations[caseName] == undefined) {
			console.log("CONFIG DOES NOT EXIST",caseName);
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