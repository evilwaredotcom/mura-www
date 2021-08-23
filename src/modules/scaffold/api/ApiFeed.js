import Mura from "mura.js";

export class ApiFeed extends Mura.Feed  {
	constructor(siteid, entityname, requestcontext) {
		super(siteid, entityname, requestcontext);
		this.configuration = {};
		this.endpoint = '';
		this.queryString = '?cacheid=' + Math.random();
		this.properties = this.createMuraFeedObject(entityname,[]);
		return this;
	}

	set = (data) => {
		this.properties.items = data;
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
		this.properties.sortby = property;
		this.properties.sortdir = direction == "ASC" ? "ASC" : "DESC";
		this.queryString += '&sortby=' + encodeURIComponent(property) + '&sortdir=' + encodeURIComponent(direction);
		return this;
	}

	itemsPerPage(itemsPerPage) {
		this.properties.itemsperpage = itemsPerPage;
		this.queryString += '&itemsPerPage=' + encodeURIComponent(itemsPerPage);
		return this;
	}
	
	pageIndex(pageIndex) {
		this.properties.pageindex = pageIndex;
		this.queryString += '&pageindex=' + encodeURIComponent(pageIndex);
		return this;
	}

	maxItems(maxItems) {
		this.properties.maxitems = maxItems;
		this.queryString += '&maxitems=' + encodeURIComponent(maxItems);
	}

	createCollectionObject = (entityname,data) => {
		const obj = {};

		for(var i = 0;i < data.length;i++) {
			data[i].entityname = entityname;
		}
	
		obj.items = data;
		return obj;
	}

	createMuraFeedObject = (entityname,data,indexfield = 'id') => {
		const obj = {
				"endindex": 0,
				"startindex": 0,
				"entityname": entityname,
				"totalpages": 0,
				"totalitems": 0,
				"links": {},
				"itemsperpage": 20,
				"pageindex": 0,
				"indexfield": indexfield,
				"sorton": '',
				"sortdir": 'DESC'
		}

		for(var i = 0;i < data.length;i++) {
			data[i].entityname = entityname;
		}

		obj.items = data;
		obj.totalitems = data.length;
		obj.totalpages = Math.ceil(data.length/obj.itemsperpage);
		obj.endindex = Math.floor(data.length/obj.itemsperpage);

		return obj;
	}

	getRemoteConfiguration = async () => {
		const remoteconfig = await Mura.get(this.configuration.remoteconfigendpoint)
			.then(function(response) {
				const result = {
					success: false,
					data: [],
					hash: {}
				};
				if(response.success) {
					result.success = true;
					for(var i = 0;i < response.data.length;i++) {
						var key = response.data[i].key;
						result.hash[key]=i;
					}
					result.data = response.data;
					return result;
				}
				else {
					return result;
				}
		});
		return remoteconfig;
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
				url: self.endpoint + self.queryString,
				async success(resp) {
					if (resp.data != 'undefined'  ) {
						self.set(resp.data);
						var dataObj = self.createCollectionObject(self.configuration.entityname,resp.data);
						var returnObj = new Mura.EntityCollection(dataObj,self._requestcontext);
						if(self.configuration.hasremoteconfig) {
							const remoteconf = await self.getRemoteConfiguration();
							if(remoteconf.success) {
								self.configuration.remotefields = remoteconf.data;
								self.configuration.remotefieldshash = remoteconf.hash;
							}
						}
						returnObj.configuration = self.configuration;
						console.log("RETURNOBJ",returnObj);
						
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

