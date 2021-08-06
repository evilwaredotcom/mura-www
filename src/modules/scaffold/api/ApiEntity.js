import Mura from "mura.js";

export class ApiEntity extends Mura.Entity  {
	constructor({properties}) {
		super(arguments);
		this.init(properties);
		return this;
	}

	init(properties) {
		super.init(properties);
	}

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

	getAll = () => {
		return params;
	}

	//save().then, delete().then, loadBy('idprop',value).then, get, set, getAll()


}