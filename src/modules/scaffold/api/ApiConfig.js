import Mura from "mura.js";
import { ApiEntity } from "./ApiEntity";
import { ApiFeed } from "./ApiFeed";

export default class ApiConfig {
	constructor({config,entityname}) {
		this.config = config;

		this.initProperties(config,entityname);

		Mura.entities[entityname]= ApiEntity;
		Mura.feeds[entityname]= ApiFeed;
	}

	initProperties( config ) {
		this.properties.entityname = entityname;
		for(var p in config) {
			this.properties[p.field] = p.default ? p.default : '';
		}
	}
	setProperties( properties ) {
		this.properties = properties;
	}

	getConfig = () => {
		return this.config;
	}
	setConfig = (config) => {
		this.config = config;
	}

	getEntity(entityname) {
		const entity = Mura.getEntity(entityname).init(this.properties);//,self._requestcontext);
		return entity;
	}

	getFeed(entityname) {
		const entity = Mura.getEntity(entityname).init(Mura.get('siteid'),entityname);//,self._requestcontext);
		console.log("Feed",feed);
		return feed;
	}

	resetProperties = (properties) => {
		var newProperties = properties;
		newProperties.endindex = newProperties.totalitems = 0;
		newProperties.totalpages = 1;
		newProperties.items = [];
		newProperties.links = [];
		return newProperties;
	}

	addItemProperties(muraObj,item) {
		for(var i in item) {
			muraObj.properties[i] = item[i];
		}
	}

	duplicateItem = (item) => {
		return JSON.parse(JSON.stringify(item));
	}
	
	loadBy = async (params = {}) => {
		// return new Promise(...			
	}
}