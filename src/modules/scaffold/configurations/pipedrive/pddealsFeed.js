import { ApiFeed } from "../../api/ApiFeed";
import PdDeals from "./pddeals";
import Mura from "mura.js";
export default class PdDealsFeed extends ApiFeed {
	constructor(siteid, entityname, requestcontext) {
		super(siteid, 'deal', requestcontext);
		this.apiconfig = new PdDeals();
		this.configuration = this.apiconfig.getConfiguration();
		this.endpoint = this.apiconfig.getEndpoint();
	}

	getConfiguration = () => {
		return this.configuration;
	}

	getCustomFunction = () => {
	}

}