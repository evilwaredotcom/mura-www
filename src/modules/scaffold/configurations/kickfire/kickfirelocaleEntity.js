import { ApiEntity } from "../../api/ApiEntity";
import KickfireLocale from "./kickfirelocale";

export default class KickfirelocaleEntity extends ApiEntity {
	constructor() {
		super({});
		this.configuration = new KickfireLocale();
		this.endpoint = this.configuration.endpoint;
		this.apikey = this.configuration.apikey;
	}

	getConfiguration = () => {
		return this.configuration;
	}

	loadBy = async (propertyName,propertyValue,params = {}) => {
		var params = super.loadBy(propertyName,propertyValue, params);
		var self = this;


		console.log("LOADBY",self);
		console.log("LOADBY",self.endpoint + self.apikey + '&' + propertyName + 'c=' + propertyValue);


		return new Promise(function(resolve, reject) {
			Mura.get(self.endpoint + self.apikey + '&' + propertyName + '=' + propertyValue)
				.then(function(resp) {
					console.log("RESPONSE",resp);
					if(resp.status && resp.status == 'success') {

						for(var i in resp.data) {
							params[i] = resp.data[i];
						}
						this.set(params);					
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