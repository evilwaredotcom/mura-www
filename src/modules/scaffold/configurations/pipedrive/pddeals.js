import Mura from "mura.js";
import ApiConfig from "../../api/ApiConfig";
import PdDealsEntity from "./pddealsEntity";
import PdDealsFeed from "./pddealsFeed";

export default class PdDeals extends ApiConfig {
	constructor() {
		
		const _config = {
			endpoint: Mura.getAPIEndpoint() + '/proxy/pipedrive/deals',
			entityname: 'Pddeals',
			fields: [
					{
						"name": "owner_name",
						"label": "Owner Name",
						"datatype": "varchar",
						"rendertype": "textfield",
						"list": true,
						"length": 100,
						"default": null,
					},
					{
						"name": "title",
						"label": "Title",
						"datatype": "varchar",
						"rendertype": "textfield",
						"list": true,
						"default": null,
					}
			]
		};

		super({config:_config});

		this.entityname = _config.entityname;
		this.endpoint = _config.endpoint;

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