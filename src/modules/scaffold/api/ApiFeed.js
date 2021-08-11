import Mura from "mura.js";

export class ApiFeed extends Mura.Feed  {
	constructor(siteid, entityname, requestcontext) {
		super(siteid, entityname, requestcontext);
		this.init(siteid, entityname);
		this.configuration = {};
		this.endpoint = '';
		this.queryString = '?cacheid=' + Math.random();
		return this;
	}

	where(property) {
		if (property) {
			return this.andProp(property);
		}
		return this;
	}

	prop(property) {
		return this.andProp(property);
	}

	andProp(property) {
		this.queryString += '&' + encodeURIComponent(property) +
			'=';
		this.propIndex++;
		return this;
	}

	isEQ(criteria) {
		if (typeof criteria== 'undefined' || criteria === '' || criteria ==	null) {
			criteria = 'null';
		}
		this.queryString += encodeURIComponent(criteria);
		return this;
	}

	sort(property, direction) {
		throw 'Method NOT Implemented';
	}

	itemsPerPage(itemsPerPage) {
		throw 'Method NOT Implemented';
	}
	
	pageIndex(pageIndex) {
		throw 'Method NOT Implemented';
	}

	maxItems(maxItems) {
		throw 'Method NOT Implemented';
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

	getQuery = (params) => {
		var self = this;

		if(typeof params != 'undefined'){
			for(var p in params){
				if(params.hasOwnProperty(p)){
					if(typeof self[p] == 'function'){
						self[p](params[p]);
					} else {
						self.andProp(p).isEQ(params[p]);
					}
				}
			}
		}

		return new Promise(function(resolve, reject) {	
			self._requestcontext.request({
				type: 'get',
				url: self.endpoint,
				success(resp) {
					if (resp.data != 'undefined'  ) {
						
						var dataObj = self.createMuraDataObject(self.configuration.entityname,resp.data);
						//console.log("dataObj",dataObj);
						var returnObj = new Mura.EntityCollection(dataObj,self._requestcontext);
						console.log("returnObj",returnObj.getAll().items);
						if (typeof resolve == 'function') {
							resolve(returnObj);
						}
					} else if (typeof reject == 'function') {
						reject(resp);
					}
				},
				error(resp) {
					resp=Mura.parseString(resp.response);
					if (typeof reject == 'function'){
						reject(resp);
					}
				}
			});
		});
	}
}

