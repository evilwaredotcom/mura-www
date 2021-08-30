import { ApiEntity } from "../../api/ApiEntity";
import PdDeals from "./pddeals";

export default class PdDealsEntity extends ApiEntity {
	constructor(properties,requestcontext) {
		super(properties,requestcontext);
		this.apiconfig = new PdDeals();
		this.configuration = this.apiconfig.getConfiguration();
		this.endpoint = this.apiconfig.getEndpoint();
	}

	getConfiguration = () => {
		return this.configuration;
	}


	paramsToQueryString = (params) => {
		var queryString = '?';
		for(var p in params) {
			if(p == 'id') {
				queryString = "/" + params[p];
				break;
			}
		}
		return queryString;
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
				console.log("SAVING DATA: ",saveData);
				self._requestcontext.request({
					type: 'push',
					url: self.endpoint,
					data:	saveData,
					success(resp) {
						if (resp.success) {
							resolve(resp);
						} else {
							self.set('errors',resp.error);
							reject(resp);
						}
					}
				});
			});
		}
		// UPDATE
		else {
			return new Promise(function(resolve, reject) {
				console.log("UPDATING DATA: ",saveData);
				self._requestcontext.request({
					type: 'put',
					url: self.endpoint + "/" + saveData.id,
					data:	saveData,
					success(resp) {
						if (resp.success) {
							resolve(resp);
						} else {
							self.set('errors',resp.error);
							reject(resp);
						}
					}
				});
			});
		}
	}

}