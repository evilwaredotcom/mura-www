import { ApiFeed } from "../../api/ApiFeed";
import PdDeals from "./pddeals";
import Mura from "mura.js";
export default class PdDealsFeed extends ApiFeed {
	constructor(siteid, entityname, requestcontext) {
		super(siteid, entityname, requestcontext);
		this.apiconfig = new PdDeals();
		this.configuration = this.apiconfig.getConfiguration();
		this.endpoint = this.apiconfig.getEndpoint();
	}

	getConfiguration = async () => {
		await super.getConfiguration();
	}

	getCustomFunction = () => {
	}

	getRemoteConfiguration = async () => {
		///v1/dealFields
		const remoteconfig = await Mura.get(this.configuration.remoteconfigendpoint)
			.then(function(response) {
				const result = {
					success: false,
					data: [],
					hash: {}
				};

				if(response.success) {
					result.success = true;
					for(var i = 0;i < response.data.length;i++) {
						var key = response.data[i].key;
						result.hash[key]=i;
					}
					result.data = response.data;
					return result;
				}
				else {
					return result;
				}
		});
		return remoteconfig;
	}

	itemsPerPage(itemsPerPage) {
		this.properties.itemsperpage = itemsPerPage;
		this.queryString += '&limit=' + encodeURIComponent(itemsPerPage);
		return this;
	}
	
}