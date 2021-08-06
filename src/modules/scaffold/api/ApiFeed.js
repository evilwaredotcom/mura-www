import Mura from "mura.js";

export class ApiFeed extends Mura.Feed  {
	constructor({siteid, entityname}) {
		super(arguments);
		this.init(siteid, entityname);
		this.configuration = {};
		this.endpoint = '';

		return this;
	}

	init = (siteid, entityname) => {
		super.init(siteid, entityname);
	}
	
}

