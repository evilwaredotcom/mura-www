
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Mura from 'mura.js';
import CTAButton from 'src/modules/CTAButton';
import Link from 'next/link';

export function Scaffold( props ) {
	const objectparams = Object.assign({}, props);

	if (!objectparams.dynamicProps) {
		const [objectProperties, setObjectProperties] = useState({});
		const urlParams = Mura.getQueryStringParams();

		useEffect(() => {
			getDynamicProps(objectparams).then((dynamicProps) => {
				setObjectProperties(dynamicProps.objectProperties);
			});
		}, []);

		if (objectProperties.hasOwnProperty('index')) {
			return (
				<Render objectProperties={objectProperties} changeHandler={changeHandler} objectparams={objectparams} props={props} />
			)
		} else {
			return (
				<div>???</div>
			);
		}
	} else {
		return (
			<Render objectProperties={objectparams.dynamicProps.objectProperties} objectparams={objectparams} props={props} />
		)
	}
}

const Render = ({ objectProperties,objectparams,changeHandler,...props }) => {
	console.log("IN RENDER!",objectProperties);

	return (
		<div>
			<form>
			<h1>RENDERING!</h1>
			{
				objectProperties.properties.map((item, index) => {
					// do not render hidden rendertypes
					if(item.fieldtype && item.fieldtype == 'one-to-many') {
						return (<div>R: {item.displayname}</div>)
					}
					if(item.fieldtype && item.fieldtype == 'one-to-one') {
						return (<div>R: {item.displayname}</div>)
					}
					if(item.fieldtype && item.fieldtype == 'many-to-one') {
						return (<div>R: {item.displayname}</div>)
					}					
					else if(!item.rendertype || item.rendertype != 'hidden') {
						if(item.rendertype) {
							return RenderByRenderType(item,changeHandler,props);
						}
						else {
							return RenderByVarType(item,changeHandler,props);
						}
					}
				})
			}
			</form>
		</div>
	)

};

export const RenderByRenderType = ( item,changeHandler,props ) => {
	switch(item.rendertype) {
		case 'textfield':
			return (
				<ScaffoldTextField key={item.name} props={props} changeHandler={changeHandler} item={item} />
			)
		case 'textarea':
			return (
				<ScaffoldTextArea key={item.name} props={props} changeHandler={changeHandler} item={item} />
			)
		case 'dropdown':
			return (
				<ScaffoldDropdown key={item.name} props={props} changeHandler={changeHandler} item={item} />
			)
			break;
		case 'radio':
			return (
				<ScaffoldRadioGroup key={item.name} props={props} changeHandler={changeHandler} item={item} />
			)
			break;
		case 'checkbox':
			return (
				<ScaffoldCheckboxGroup key={item.name} props={props} changeHandler={changeHandler} item={item} />
			)
			break;
		default: 
			return (
				<div key={item.name}>{item.name} unknown</div>
			)
	}
}

export const RenderByVarType = ( item,props ) => {
	console.log("RENDERING",item.datatype);
	switch(item.datatype) {
		case 'varchar':
		case 'char':
		case 'text':
			if(item.length == 35 || item.name.substr(item.name.length,-2) == 'id') {
				return <></>
			}
			else if(item.length && item.length <= 255) {
				return (
					<ScaffoldTextField key={item.name} props={props} item={item} />
				)
			}
			else {
				return (
					<ScaffoldTextArea key={item.name} props={props} item={item} />
				)
			}
			break;
		default: 
				return (
					<div>{item.name}: ???</div>
				)
	}
}




export const getDynamicProps = async props => {
	var objectProperties = [];

	var objectData = await Mura.getBean('scaffoldonetest')
		.invoke(
			'properties',
			{}
	);

	// sort properties, first if by orderno
	if(objectData.properties[0].hasOwnProperty('orderno')) {
		objectProperties = objectData.properties.sort((a,b) => {
			if(a.orderno > b.orderno) {
				return 1
			}
			else if(a.orderno < b.orderno) {
				return -1
			}
			else {
				return 0;
			}
		});	
	}
	// sort properties, next by orderno
	else {
		objectProperties = objectData.properties.sort((a,b) => {
			if(a.name < b.name) {
				return -1;
			}
			else {
				return 1;
			}
		});	
	}

	// extract an index of key positions, useful for manual composition
	var keys = objectProperties.map((item, index) => {
		return {'key': item.name,'index': index}
	});

	renderOptionLists(objectProperties);
	
	console.log("receiving data", props.instanceid, Date.now(), Mura.siteid);
	console.log('data',objectProperties);
	return {
		objectProperties: {
			index: keys,
			properties: objectProperties
		}
	};
}


const renderOptionLists = (objectProperties) => {

	for(var i = 0;i<objectProperties.length;i++) {
		var obj = objectProperties[i];
		
		if(obj.hasOwnProperty('optionlist')) {
			obj.options = [];
			var labels = obj.optionlist.split('^');
			var vals = obj.optionvaluelist.split('^');
			for(var x = 0;x<labels.length;x++) {
				obj.options.push({'label': labels[x],'value':vals[x]});
			}
		}
	}
}



export default Scaffold;
