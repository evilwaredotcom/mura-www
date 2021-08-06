import { ApiFeed } from "../../api/ApiFeed";
import PdDeals from "./pddeals";

export default class PdDealsFeed extends ApiFeed {
	constructor() {
		super({});
		this.apiconfig = new PdDeals();
		this.configuration = this.apiconfig.getConfiguration();
		this.endpoint = this.apiconfig.getEndpoint();
	}

	getConfiguration = () => {
		return this.configuration;
	}

	getCustomFunction = () => {
	}

	getQuery = (params) => {
		super.getQuery(params);
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
						var returnObj = new Mura.EntityCollection(resp.data,self._requestcontext);
						console.log(returnObj.getAll());
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