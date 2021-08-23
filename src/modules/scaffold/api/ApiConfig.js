import Mura from "mura.js";
import { ApiEntity } from "./ApiEntity";
import { ApiFeed } from "./ApiFeed";

/*

	Entities/Feeds are registered via Api

*/

export default class ApiConfig {
	constructor({config}) {
		this.config = Mura.extend(this.baseConfig(),config);
		this.fields = config.fields;
		this.entityname = config.entityname;
		this.properties = [];
		this.EntityObject = {};
		this.FeedObject = {};

		this.initMuraProperties(this.fields);
	}


	baseConfig = () => {
		const _config = {
			endpoint: Mura.getAPIEndpoint(),
			external: true,
			entityname: 'unkownn',
			/* 
				fields: fields to be rendered in scaffold form, either:
					- an array of field names, which will render fields as textfields
					- an array of objects, which will contain scaffolding information
			*/
			fields: ['id'],
			list: ['title'],
			/*
			 fields: [
				{
					"field": 'name',
					"label": 'Name',
					"datatype": "varchar",
					"rendertype": "textfield",
					"list": true,
					"default": null,
					//  NOT YET IMPLEMENTED
					"required": false,
					"required-message": '',
					"regex":  '',
					"regex-hint": '',
					"regex-message": '',					
					"grid-column": '',
					"grid-row": '',
				},
				{
					"field": 'fruits',
					"label": 'Fruits',
					"datatype": "varchar",
					"rendertype": "dropdown",
					"optionlist": [{'apple':'Apple','orange':'Orange'}] // name/label pairs for dropdown
					"list": false,
					"default": null
				},
				...
			]
			*/
			// ignorefields: inverse of "fields", where all fields but below will be rendered
			ignorefields: [],
			// postfields: fields to be included in any remote post
			hiddenfields: [],
			// remotefields: feilds pulled from remote config
			remotefields: [],
			// remotefieldshash: a hash pointer of name/arraypos for remotefields
			remotefieldshash: {},
			// hasremoteconfig: for remote API's that have remote/custom field/data configurations for the endpoint, this will auto-fetch and populate remotefields as array of objects
			hasremoteconfig: false,
			remoteconfigendpoint: Mura.getAPIEndpoint(),
		};		

		return _config;
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