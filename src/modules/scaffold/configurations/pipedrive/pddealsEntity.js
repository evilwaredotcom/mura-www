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

		// no id, post, else put

		return new Promise(function(resolve, reject) {
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