import Mura from "mura.js";

export default class ScaffoldConfig {
	constructor({config}) {
		this.config = config;
	}

	getConfig = () => {
		return this.config;
	}
	setConfig = (config) => {
		this.config = config;
	}

}