import { ApiFeed } from "../../api/ApiFeed";
import KickfireLocale from "./kickfirelocale";

export default class KickfirelocaleFeed extends ApiFeed {
	constructor() {
		this.configuration = new KickfireLocale();
	}
	
	
}