import ScaffoldConfig from "./ScaffoldConfig";

export default class ScaffoldTestOne extends ScaffoldConfig {
	constructor() {

		const _config = [
			{
				"field": "title",
				"label": "Title",
				"datatype": "varchar",
				"rendertype": "textfield",
				"list": true,
				"length": 100
			},
			{
				"field": "description",
				"label": "Description",
				"datatype": "text",
				"rendertype": "textarea",
				"list": false
			},
			{
				"field": "isactive",
				"label": "Active",
				"datatype": "int",
				"rendertype": "dropdown",
				"list": true
			},
			{
				"field": "choicesdropdown",
				"label": "The Radio Choice",
				"datatype": "varchar",
				"rendertype": "dropdown",
				"optionvaluelist": [0,1,2.3],
				"optionlist": ["zero","one","two","three"],
				"default": 1,
				"list": false
			},
			{
				"field": "choicescheckbox",
				"label": "Check'A'Box",
				"datatype": "varchar",
				"rendertype": "checkbox",
				"optionvaluelist": [0,1,2.3],
				"optionlist": ["zero","one","two","three"],
				"default": 2,
				"list": true
			},
			{
				"field": "choicesradio",
				"label": "The Radio Choice",
				"datatype": "varchar",
				"rendertype": "radio",
				"optionvaluelist": [0,1,2.3],
				"optionlist": ["zero","one","two","three"],
				"default": 2,
				"list": false
			}
		];

		super({config:_config});
	}

	get = async (params = {}) => {
		return this.getFeed(params);
	}

	getFeed = async (params = {}) => {

		console.log("I WAS CALLED!");

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