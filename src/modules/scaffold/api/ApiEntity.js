import Mura from "mura.js";

export class ApiEntity extends Mura.Entity  {

	loadBy = async (propertyName, propertyValue, params) => {
		self = this;
		params = Mura.extend({
			entityname: self.get('entityname').toLowerCase(),
			method: 'findQuery',
			siteid: self.get( 'siteid'),
			'_cacheid': Math.random(),
		},
			params
		);
		params[propertyName] = propertyValue;

		return params;
	}

	setItems( items ) {
		this.items = items;
	}

	save = async ({context,data}) => {
		
	}

	get = (property) => {
		if(this.properties[property]) {
			return this.properties[property];
		}
		return null;
	}

	set = (property,val) => {
		if(property.length) {
			this.properties[property] = val;
		}
		return this;
	}

	loadBy(propertyName, propertyValue, params) {
		propertyName = propertyName || 'id';

		console.log("BOING");
		return "shubert";
		
	}
	
	//save().then, delete().then, loadBy('idprop',value).then, get, set, getAll()


}