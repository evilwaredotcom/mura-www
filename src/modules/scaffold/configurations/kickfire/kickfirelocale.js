import Mura from "mura.js";
import ApiConfig from "../../api/ApiConfig";
import KickfirelocaleEntity from "./kickfirelocaleEntity";
import KickfirelocaleFeed from "./kickfirelocaleFeed";

export default class KickfireLocale extends ApiConfig {
	constructor() {
		/*
			https://api.kickfire.com/v1/postalcode2geo?key=bbb206de60fd8e5a&pc=90210
			{
				"status": "success",
				"results": 1,
				"data": [
					{
						"city": "Beverly Hills",
						"state": "CA",
						"county": "Los Angeles County",
						"countryShort": "US",
						"areaCodes": "310,323",
						"latitude": "34.0900",
						"longitude": "-118.4100"
					}
				]
			}
		*/
		const _config = {
			entityname: 'Kickfirelocale',
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
				},
				{
					"name": "county",
					"label": "County",
					"datatype": "varchar",
					"rendertype": "textfield",
					"list": false,
					"default": null,
				},
				{
					"name": "countryShort",
					"label": "Country",
					"datatype": "varchar",
					"rendertype": "textfield",
					"list": true,
					"default": null,
				},
				{
					"name": "areaCodes",
					"label": "Area Codes",
					"datatype": "varchar",
					"rendertype": "textfield",
					"list": false,
					"default": null,
				},
				{
					"name": "latitude",
					"label": "latitude",
					"datatype": "varchar",
					"rendertype": "textfield",
					"list": false,
					"default": null,
				},
				{
					"name": "longitude",
					"label": "Longitude",
					"datatype": "varchar",
					"rendertype": "textfield",
					"list": false,
					"default": null,
				}
			]
		};

		super({config:_config});

		this.entityname = _config.entityname;

		// custom here
		this.apikey = 'bbb206de60fd8e5a';
		this.endpoint = 'http://localhost:8888/index.cfm/_api/json/v1/default/proxy/KickFireLocale?key=';

		// configure object references
		this.EntityObject = KickfirelocaleEntity;
		this.FeedObject = KickfirelocaleFeed;
	}

	getEntityName = () => {
		return this.entityname;
	}

	getEndpoint = () => {
		return this.endpoint;
	}
}