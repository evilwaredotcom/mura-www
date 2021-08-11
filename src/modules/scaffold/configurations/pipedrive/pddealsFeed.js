import { ApiFeed } from "../../api/ApiFeed";
import PdDeals from "./pddeals";
import Mura from "mura.js";

export class LocalEntityCollection extends Mura.EntityCollection {
	init(properties,requestcontext){
		properties=properties || {};
		this.set(properties);
		this._requestcontext=requestcontext || Mura._requestcontext;
		var self=this;
		if(Array.isArray(self.get('items'))){
			self.set('items',self.get('items').map(function(obj){
				var entityname=obj.entityname.substr(0, 1).toUpperCase() + obj.entityname.substr(1);
				
				console.log("THIS obj",Object.assign({},obj));
				if(Mura.entities[entityname]){
					let bob = new Mura.entities[entityname](obj,self._requestcontext);
					console.log("BOB",bob.get('entityname'));
					return bob;
				} else {
					return new Mura.Entity(obj,self._requestcontext);
				}
			}));
		}

		return this;
	}

}

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
						
						var dataObj = self.createMuraDataObject(self.configuration.entityname,resp.data);
						console.log("dataObj",dataObj);
						var returnObj = new LocalEntityCollection(dataObj,self._requestcontext);
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