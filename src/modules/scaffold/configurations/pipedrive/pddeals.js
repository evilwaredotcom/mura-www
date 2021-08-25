import Mura from "mura.js";
import ApiConfig from "../../api/ApiConfig";
import PdDealsEntity from "./pddealsEntity";
import PdDealsFeed from "./pddealsFeed";

export default class PdDeals extends ApiConfig {
	constructor() {
		const _config = {
			endpoint: Mura.getAPIEndpoint() + '/proxy/pipedrive/deals',
			external: true,
			entityname: 'Pddeals',
			//fields: ['owner_name','title','formatted_weighted_value',"70fa899d40ddfcdadd00c3066dbae7d8621f56b0","e276bfae2df5553307253c06a17119b6573bcf2b"],
			fields: [
				{
					"name": 'owner_name',
					"displayname": 'Owner',
					"datatype": "varchar",
					"rendertype": "textfield",
					"listview": true,
					"default": null
				},
				{
					"name": 'title',
					"displayname": 'Title',
					"datatype": "varchar",
					"rendertype": "textfield",
					"listview": true,
					"default": null
				},
				{
					"name": 'value',
					"displayname": 'Value',
					"datatype": "varchar",
					"rendertype": "textfield",
					"listview": true,
					"default": null
				},
				{
					"name": '70fa899d40ddfcdadd00c3066dbae7d8621f56b0',
					"remote": true,
					"listview": false
				},
				{
					"name": 'e276bfae2df5553307253c06a17119b6573bcf2b',
					"remote": true,
					"listview": false
				}
			],
			savefields: ['id'],
			hasremoteconfig: true,
			remoteconfigendpoint: Mura.getAPIEndpoint() + '/proxy/pipedrive/dealFields'
		};
		
		super({config:_config});
		this.endpoint = _config.endpoint;

		// configure object references
		this.EntityObject = this.getApiEntity();
		this.FeedObject = this.getApiFeed();
	//	
	}

	getConfiguration = () => {
		return this.config;
	}	

	getApiEntity() {
		return PdDealsEntity;
	}
	getApiFeed() {
		return PdDealsFeed;
	}

	getEntityName = () => {
		return this.entityname;
	}

	getEndpoint = () => {
		return this.endpoint;
	}

	properties = () => {
		return this.getConfiguration();
	}

}