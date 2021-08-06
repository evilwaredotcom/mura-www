import Mura from "mura.js";
import ApiConfig from "../../api/ApiConfig";
import PdDealsEntity from "./pddealsEntity";
import PdDealsFeed from "./pddealsFeed";

export default class PdDeals extends ApiConfig {
	constructor() {
		
		const _config = {
			entityname: 'Pddeals',
			fields: [
					{
						"name": "city",
						"label": "City",
						"datatype": "varchar",
						"rendertype": "textfield",
						"list": true,
						"length": 100,
						"default": null,
					},
					{
						"name": "state",
						"label": "state",
						"datatype": "varchar",
						"rendertype": "textfield",
						"list": true,
						"default": null,
					}
			]
		};

		super({config:_config});

		this.entityname = _config.entityname;

		// custom here
//		this.apikey = 'bbb206de60fd8e5a';
		this.endpoint = 'http://localhost:8888/index.cfm/_api/json/v1/default/proxy/pipedrive/deals';

		// configure object references
		this.EntityObject = this.getApiEntity();
		this.FeedObject = this.getApiFeed();
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
}