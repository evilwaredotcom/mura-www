import { MuraObject } from "../APITranslate/MuraObject";

export default class ScaffoldConfig {
	constructor({config}) {
		this.config = config;
	}

	getConfig = () => {
		return this.config;
	}
	setConfig = (config) => {
		this.config = config;
	}

	get = (req,params) => {
		const response = new MuraObject;
		return response;
	}

	resetProperties = (properties) => {
		var newProperties = properties;
		newProperties.endindex = newProperties.totalitems = 0;
		newProperties.totalpages = 1;
		newProperties.items = [];
		newProperties.links = [];
		return newProperties;
	}

	setItems = (properties,items) => {
		var newProperties = this.resetProperties(properties);

		for(var i = 0;i < items.length;i++) {
			var muraObj = Mura.getBean('muraObject');
			this.addItemProperties(muraObj,this.duplicateItem(items[i]));
			properties.items[i] = muraObj;
		}

		newProperties.endindex = newProperties.totalitems = items.length;
		newProperties.totalpages = Math.ceil(newProperties.totalitems/newProperties.itemsperpage);

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
}