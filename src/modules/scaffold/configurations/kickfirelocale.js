import ApiConfig from "../api/ApiConfig";

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
		
		const _config = [
			{
				"field": "city",
				"label": "City",
				"datatype": "varchar",
				"rendertype": "textfield",
				"list": true,
				"length": 100
			},
			{
				"field": "state",
				"label": "state",
				"datatype": "varchar",
				"rendertype": "textfield",
				"list": true
			},			{
				"field": "county",
				"label": "County",
				"datatype": "varchar",
				"rendertype": "textfield",
				"list": false
			},
			{
				"field": "countryShort",
				"label": "Country",
				"datatype": "varchar",
				"rendertype": "textfield",
				"list": true
			},
			{
				"field": "areaCodes",
				"label": "Area Codes",
				"datatype": "varchar",
				"rendertype": "textfield",
				"list": false
			},
			{
				"field": "latitude",
				"label": "latitude",
				"datatype": "varchar",
				"rendertype": "textfield",
				"list": false
			},
			{
				"field": "longitude",
				"label": "Longitude",
				"datatype": "varchar",
				"rendertype": "textfield",
				"list": false
			}
		];

		super({config:_config,entityname:'kickfilelocale'});
		this.apikey = 'bbb206de60fd8e5a';
		this.endpoint = 'https://api.kickfire.com/v1/postalcode2geo?key=';

	}

	loadBy = async (propertyName,propertyValue,params = {}) => {
		var params = super.loadBy(propertyName,propertyValue, params);
		var self = this;

		return new Promise(function(resolve, reject) {

			Mura.get(this.endpoint + this.apikey + '&pc=' + propertyValue)
				.then(function(resp) {
				if(resp.status && resp.status == 'success') {
					for(var i in resp.data) {
						params[i] = resp.data[i];
					}
					this.set(params);					
					resolve(self);
				}
				else {
					reject(resp);
				}
			});	
		});		
	}

	/*
	save = async (eventHandler) => {
		eventHandler=eventHandler || {};

		Mura.normalizeRequestHandler(eventHandler);

		var self = this;

		return new Promise(function(resolve, reject) {
			var temp = Mura.deepExtend({},self.getAll());

			self._requestcontext.request({
				type: 'post',
				url: this.endpoint,
				data:	self.getAll(),
				success(resp) {
					if (resp.data != 'undefined') {
						self.set(resp.data)
						self.set('isdirty',false );
						if (self.get('saveerrors') ||
							Mura.isEmptyObject(self.getErrors())
						) {
							if (typeof eventHandler.success ==	'function') {
									eventHandler.success(self);
							}
						} else {
							if (typeof eventHandler.error == 'function') {
									eventHandler.error(self);
							}
						}
					} else {
						self.set('errors',resp.error);
						if (typeof eventHandler.error == 'function') {
							eventHandler.error(self);
						}
					}
				},
				progress:eventHandler.progress,
				abort: eventHandler.abort
			});
		});
	}
	*/
}