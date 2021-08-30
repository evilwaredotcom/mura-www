import Mura from "mura.js";

export class ApiEntity extends Mura.Entity  {


	init(properties,requestcontext) {
		super.init(properties,requestcontext);
		this._remoteAPIEntity = true;
	}

	setItems( items ) {
		this.items = items;
	}

	get = (property) => {
		if(this.properties[property]) {
			return this.properties[property];
		}
		return null;
	}

	set = (data) => {
		this.properties = data;
	}

	createCollectionObject = (entityname,data) => {
		const obj = data;

		this.entityname = entityname;
		this._remoteAPIEntity = true;
		this.set(obj);
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

	setRemoteConfiguration = async () => {
		const self = this;
		const remoteconf = await self.getRemoteConfiguration();
		if(remoteconf.success) {
			self.configuration.remotefields = remoteconf.data;
			self.configuration.remotefieldshash = remoteconf.hash;
			for(var i = 0;i < self.configuration.fields.length;i++) {
				const field = self.configuration.fields[i];
				if(field.remote && field.name && self.configuration.remotefieldshash[field.name]) {
					// extract the remote aka API field configuration from the remotefields array via the remotefieldshash
					field = self.extendRemoteField(field,self.configuration.remotefields[self.configuration.remotefieldshash[field.name]]);
				}
			}
		}
	}

	loadBy = async (propertyName, propertyValue, params) => {
		propertyName = propertyName || 'id';
		propertyValue = propertyValue || this.get(propertyName) || 'null';
		var self = this;

		params = Mura.extend({
			entityname: self.get('entityname').toLowerCase(),
			method: 'findQuery',
			siteid: self.get( 'siteid'),
			'_cacheid': Math.random(),
		},
			params
		);
		params[propertyName] = propertyValue;

		return new Promise(function(resolve, reject) {	
			params = Mura.extend({
				entityname: self.get('entityname').toLowerCase()
			},
				params
			);
			params[propertyName] = propertyValue;

			self._requestcontext.request({
				type: 'get',
				url: self.endpoint + self.paramsToQueryString(params),
				async success(resp) {
					if (resp.data != 'undefined'  ) {
						if (resp.data.length) {
							resp.data = resp.data[0];
						}
						else {
							self.set(resp.data);
						}
						
						resp.data._remoteAPIEntity = true;
						
						var dataObj = self.createCollectionObject(self.configuration.entityname,resp.data);
						var returnObj = new Mura.EntityCollection(dataObj,self._requestcontext);
						returnObj.configuration = self.configuration;

						if(returnObj.configuration.hasremoteconfig) {
							await self.setRemoteConfiguration();
						}

						if (typeof resolve == 'function') {
							resolve(self);
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

	extendRemoteField = (field,extended) => {
		if(extended.name) {
			extended._name = extended.displayname = extended.name;
			delete extended.name;
		}
		field = Mura.extend(field,extended);
	}

	paramsToQueryString = (params) => {
		var queryString = '?';
		for(var p in params) {
			queryString += "&" + p + "=" + params[p];
		}

		return queryString;
	}

	getIDField = () => {
		return this.configuration.idfield;
	}

	save = (saveData) => {
		var self = this;
		const idfield = this.getIDField();

		if(saveData[idfield] == null) {
			saveData.isnew = true;
		}

		// NEW
		if(saveData.isnew == true) {
			return new Promise(function(resolve, reject) {
				resolve(self);

				self._requestcontext.request({
					type: 'push',
					url: self.getendpoint(),
					data:	saveData,
					success(resp) {
						if (resp.data != 'undefined') {
							resolve(resp);
						} else {
							self.set('errors',resp.error);
							if (typeof eventHandler.error == 'function') {
								reject(self);
							}
						}
					}
				});
			});
		}
		// UPDATE
		else {
			return new Promise(function(resolve, reject) {
				resolve(self);

				self._requestcontext.request({
					type: 'put',
					url: self.getendpoint(),
					data:	saveData,
					success(resp) {
						if (resp.data != 'undefined') {
							resolve(resp);
						} else {
							self.set('errors',resp.error);
							if (typeof eventHandler.error == 'function') {
								reject(self);
							}
						}
					}
				});
			});
		}
	}


	//save().then, delete().then, loadBy('idprop',value).then, get, set, getAll()


}