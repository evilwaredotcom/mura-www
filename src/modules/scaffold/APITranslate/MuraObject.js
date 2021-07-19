export class MuraObject {
	constructor({success,data}) {
		this.success = success;
		this.data = data;
	}

	getMuraData = () => {
		const dataModel = {
			"data": {
				"endindex": 0,
				"startindex": 1,
				"entityname": "",
				"totalpages": 0,
				"totalitems": 0,
				"links": {},
				"itemsperpage": 1000,
				"items": [],
				"pageindex": 1
			},
			"method": "findAll",
			"apiversion": "v1"
		};

		return dataModel;
	}
}