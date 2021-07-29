import Mura from "mura.js";
import FirebaseAnimals from "./firebaseanimals";
import KickfireLocale from "./kickfirelocale";
import ScaffoldTestOne from "./ScaffoldTestOne";
const configurations = [];

export default class ScaffoldConfigurations {
	constructor() {
		configurations['scaffoldTestOne'] = new ScaffoldTestOne();
		configurations['kickfirelocale'] = new KickfireLocale();
		configurations['firebaseanimals'] = new FirebaseAnimals();
	}

	getConfigurations = () => {
		return configurations;
	}

	getConfiguration = (name) => {
		if(configurations[name] == undefined) {
			console.log("CONFIG DOES NOT EXIST!");
			return {}
		}
		else {
			const obj = configurations[name];
			return obj;
		}
	}

	addConfiguration = (name,obj) => {
		configurations[name] = new obj();
	}
}