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


	createMuraDataObject = (entityname,data) => {
		const obj = {};

		for(var i = 0;i < data.length;i++) {
			data[i].entityname = entityname;
		}
	
		obj.items = data;
		console.log("createMuraDataObject",obj);
		return obj;
	}

	createMuraFeedObject = (entityname,data,indexfield = 'id') => {
		const obj = {
			"data": {
				"endindex": 0,
				"startindex": 0,
				"entityname": entityname,
				"totalpages": 0,
				"totalitems": 0,
				"links": {},
				"itemsperpage": 20,
				"items": [],
				"pageindex": 0
			},
			"method": "findAll",
			"apiversion": "v1"
		}

		for(var i = 0;i < data.length;i++) {
			data[i].entityname = entityname;
		}

		obj.data.items = data;
		obj.data.totalitems = data.length;
		obj.data.totalpages = Math.ceil(data.length/obj.data.itemsperpage);

		return obj;
	}
}

