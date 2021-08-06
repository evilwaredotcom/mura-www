import Mura from "mura.js";
import { ApiEntity } from "./ApiEntity";
import { ApiFeed } from "./ApiFeed";

/*

	Entities/Feeds are registered via Api

*/

export default class ApiConfig {
	constructor({config}) {
		this.config = config;
		this.fields = config.fields;
		this.entityname = config.entityname;
		this.properties = [];
		this.EntityObject = {};
		this.FeedObject = {};

		this.initMuraProperties(this.fields);
		console.log("API",this.properties);
	}

	registerEntity = async() => {
		Mura.entities[this.getEntityName()] = this.getEntityObject();
		Mura.feeds[this.getEntityName()] = this.getFeedObject();
	}

	getEntityObject = () => {
		return this.EntityObject;
	}

	getFeedObject = () => {
		return this.FeedObject;
	}

	initMuraProperties( fields = [] ) {
		fields = fields.length ? fields : this.fields;
//		this.properties.entityname = entityname;
		for(var p = 0; p < fields.length;p++) {
			this.properties.push(fields[p]);
		}
	}

	setProperties( properties ) {
		this.properties = properties;
	}

	getConfiguration = () => {
		return this.getConfig();
	}
	getConfig = () => {
		return this.config;
	}
	setConfig = (config) => {
		this.config = config;
	}
	getScaffoldFields = () => {
		return this.fields;
	}
	getProperties = () => {
		return this.properties;
	}
	getApiEntity() {
		return ApiEntity;
	}
	getApiFeed() {
		return ApiFeed;
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