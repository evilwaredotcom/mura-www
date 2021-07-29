//const firebase = require("firebase");
// Required for side-effects
//require("firebase/firestore");
import ApiConfig from "../api/ApiConfig";

export default class FirebaseAnimals extends ApiConfig {
	constructor() {

		/*
			https://firestore.googleapis.com/v1/projects/animals-deb2a/databases/(default)/documents/animals/
			<script src="https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js"></script>
			<script src="https://www.gstatic.com/firebasejs/8.8.0/firebase-firestore.js"></script>

			legs": {
			"integerValue": "4"
			},
			"hasfur": {
			"booleanValue": true
			},
			"iscarnivore": {
			"booleanValue": true
			},
			"name": {
			"stringValue": "kitty"
			},
			"type": {
			"stringValue": "cat"
			}

		*/


		
		const _config = [
			{
				"field": "name",
				"label": "Name",
				"datatype": "varchar",
				"rendertype": "textfield",
				"list": true,
				"length": 100
			},
			{
				"field": "type",
				"label": "Type",
				"datatype": "varchar",
				"rendertype": "textfield",
				"list": true
			},
			{
				"field": "isactive",
				"label": "Active",
				"datatype": "int",
				"rendertype": "dropdown",
				"list": true
			},
			{
				"field": "hasfur",
				"label": "Has Fur",
				"datatype": "int",
				"rendertype": "dropdown",
				"optionvaluelist": [0,1],
				"optionlist": ["no","yes"],
				"default": 1,
				"list": false
			},
			{
				"field": "iscarnivore",
				"label": "Is Carnivore",
				"datatype": "int",
				"rendertype": "dropdown",
				"optionvaluelist": [0,1],
				"optionlist": ["no","yes"],
				"default": 1,
				"list": false
			},
			{
				"field": "legs",
				"label": "Number of Legs",
				"datatype": "varchar",
				"rendertype": "dropdown",
				"optionvaluelist": [0,1,2.3,4,6,8],
				"optionlist": [0,1,2.3,4,6,8],
				"default": 4,
				"list": false
			}
		];

		super({config:_config});
	}

	get = async (params = {}) => {
		// https://firestore.googleapis.com/v1/projects/animals-deb2a/databases/(default)/documents/animals/
				
	}

	getFeed = async (params = {}) => {

		console.log("FIREBASE SAYS: I WAS CALLED!");

//		const response = await Mura.getEntity('proxyDecoratorBean');	
//		console.log(response);
		const muraObj = Mura.getBean('muraObject');


		const response = await Mura.getFeed('ScaffoldTestOne');
		const rs = await response.getQuery();

		const items = [
			{
				title: 'starting',
				description: 'a description',
				isActive: 1,
				choicesdropdown: 0,
				choicescheckbox: 1,
				choicesradio: 3
			},
			{
				title: 'going here',
				description: 'a description',
				isActive: 1,
				choicesdropdown: 0,
				choicescheckbox: 2,
				choicesradio: 3
			},
			{
				title: 'went there',
				description: 'a description',
				isActive: 1,
				choicesdropdown: 0,
				choicescheckbox: 3,
				choicesradio: 3
			},
			{
				title: 'all done',
				description: 'a description',
				isActive: 1,
				choicesdropdown: 0,
				choicescheckbox: 4,
				choicesradio: 3
			}			
		]

		rs.properties = this.setItems(rs.properties,items);

		console.log("QUERY");
		console.log(rs.getAll());

		return response;
		/*
		const response = await Mura.getBean('ScaffoldTestOne')
		.invoke(
			'properties',
			params
		);

		return response;
		*/
	}
}