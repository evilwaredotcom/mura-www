import { ApiEntity } from "../../api/ApiEntity";
import PdDeals from "./pddeals";

export default class PdDealsEntity extends ApiEntity {
	constructor() {
		super({});
		this.apiconfig = new PdDeals();
		this.configuration = this.apiconfig.getConfiguration();
		this.endpoint = this.apiconfig.getEndpoint();
	}

	getConfiguration = () => {
		return this.configuration;
	}

	loadBy = async (propertyName,propertyValue,params = {}) => {
		var params = super.loadBy(propertyName,propertyValue, params);
		var self = this;

		return new Promise(function(resolve, reject) {
			Mura.get(self.endpoint + '?' + '&' + propertyName + '=' + propertyValue)
				.then(function(resp) {	
					console.log("RESPONSE",resp);
					if(resp.success && resp.success == true) {
						for(var i in resp.data) {
							self.properties[i] = resp.data[i];
						}
						resolve(self);
					}
					else {
						reject(resp);
					}
			});	
		});		
	}

	/*
	save = async (eventHandler) => {
		eventHandler=eventHandler || {};

		Mura.normalizeRequestHandler(eventHandler);

		var self = this;

		return new Promise(function(resolve, reject) {
			var temp = Mura.deepExtend({},self.getAll());

			self._requestcontext.request({
				type: 'post',
				url: this.endpoint,
				data:	self.getAll(),
				success(resp) {
					if (resp.data != 'undefined') {
						self.set(resp.data)
						self.set('isdirty',false );
						if (self.get('saveerrors') ||
							Mura.isEmptyObject(self.getErrors())
						) {
							if (typeof eventHandler.success ==	'function') {
									eventHandler.success(self);
							}
						} else {
							if (typeof eventHandler.error == 'function') {
									eventHandler.error(self);
							}
						}
					} else {
						self.set('errors',resp.error);
						if (typeof eventHandler.error == 'function') {
							eventHandler.error(self);
						}
					}
				},
				progress:eventHandler.progress,
				abort: eventHandler.abort
			});
		});
	}
	*/

}