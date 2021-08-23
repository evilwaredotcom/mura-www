
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Mura from 'mura.js';
import CTAButton from 'src/modules/CTAButton';
import Link from 'next/link';
import ScaffoldTextField from './fields/ScaffoldTextField';
import ScaffoldTextArea from './fields/ScaffoldTextArea';
import ScaffoldRadioGroup from './fields/ScaffoldRadioGroup';
import ScaffoldCheckboxGroup from './fields/ScaffoldCheckboxGroup';
import ScaffoldDropdown from './fields/ScaffoldDropdown';
import ScaffoldActions from './fields/ScaffoldActions';

export function Scaffold( {objectProperties,scaffoldProperties,objectparams,currentID,actionHandler,...props} ) {
	objectparams = objectparams ? objectparams : Object.assign({}, props);
	if(currentID) {
		objectparams.currentID = currentID;
	}

	const[dataObject,setDataObject] = useState({});
	const[isLoaded,setIsLoaded] = useState(false);
	var gondor = {};

	const changeHandler = (name,value) => {
		setDataObject({...dataObject, [name]: value});
	}
	
	const clickHandler = async (e,name) => {
		e.preventDefault();
		
		if(name == 'save') {
			var response = await saveObject(objectparams,dataObject);

			if(actionHandler) {
				actionHandler(e,'saved');
			}
		}
		else if(name == 'cancel') {
			if(actionHandler) {
				actionHandler(e,'cancel');
			}
		}
	}

	return (()=>{
		const [objectProperties, setObjectProperties] = useState({});
		const urlParams = Mura.getQueryStringParams();

		useEffect(() => {
			if(objectparams.hasOwnProperty('scaffoldsource') && objectparams.scaffoldsource.length) {
				getDynamicProps(objectparams).then((dynamicProps) => {
					setObjectProperties(dynamicProps.objectProperties);
					if(dynamicProps.objectProperties.currentObject) {
						setCleanDataObject(dynamicProps);
					}
					setIsLoaded(true);
				});
			}
		}, []);
		
		function setCleanDataObject(dynamicProps) {
			var obj = {};
			var exclude = ['links','isdeleted','isdirty','isnew','entityname'];
			for (var i in dynamicProps.objectProperties.currentObject.properties) {
				if(exclude.includes(i)) {
					//skip
				}
				else {
					if(isJson(dynamicProps.objectProperties.currentObject.properties[i])) {
						obj[i] = JSON.parse(dynamicProps.objectProperties.currentObject.properties[i]);
					}
					else {
						obj[i] = dynamicProps.objectProperties.currentObject.properties[i];
					}
				}
			}
			setDataObject(obj);
		}

		if (isLoaded) {
			return (
				<Render objectProperties={objectProperties} changeHandler={changeHandler} currentID={currentID} dataObject={dataObject} clickHandler={clickHandler} objectparams={objectparams} props={props} />
			)
		} else {
			return (
				<div>...loading</div>
			);
		}

	})()
}

const Render = ({ objectProperties,objectparams,changeHandler,clickHandler,currentID,dataObject,...props }) => {
	return (
		<div>
			<form>
			<h1>Edit</h1>
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
							return RenderByRenderType(item,changeHandler,dataObject,props);
						}
						else {
							return RenderByVarType(item,changeHandler,dataObject,props);
						}
					}
				})
			}
			<ScaffoldActions props={props} clickHandler={clickHandler} currentID={currentID} />
			</form>
		</div>
	)
};

export const RenderByRenderType = ( item,changeHandler,dataObject,props ) => {
	switch(item.rendertype) {
		case 'textfield':
			return (
				<ScaffoldTextField key={item.name} dataObject={dataObject} props={props} changeHandler={changeHandler} item={item} />
			)
		case 'textarea':
			return (
				<ScaffoldTextArea key={item.name} dataObject={dataObject} props={props} changeHandler={changeHandler} item={item} />
			)
		case 'dropdown':
			return (
				<ScaffoldDropdown key={item.name} dataObject={dataObject} props={props} changeHandler={changeHandler} item={item} />
			)
			break;
		case 'radio':
			return (
				<ScaffoldRadioGroup key={item.name} dataObject={dataObject} props={props} changeHandler={changeHandler} item={item} />
			)
			break;
		case 'checkbox':
			return (
				<ScaffoldCheckboxGroup key={item.name} dataObject={dataObject} props={props} changeHandler={changeHandler} item={item} />
			)
			break;
		default: 
			return (
				<div key={item.name}>{item.name} unknown</div>
			)
	}
}

export const RenderByVarType = ( item,props ) => {
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
	var currentObject;

	if(props.scaffoldsource) {
		const objectData = await Mura.getBean(props.scaffoldsource);
	}
	else {
		return objectProperties;
	}

	console.log("props.currentID",props.currentID);

	if(props.currentID) {
		console.log("BEF");
		currentObject = await Mura.getEntity(props.scaffoldsource);
		console.log("AFT",currentObject);
		var fif = await currentObject.loadBy('id',props.currentID);
		console.log("AFTAFT",fif);
	}


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
	
	return {
		objectProperties: {
			index: keys,
			properties: objectProperties,
			currentObject: currentObject
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

const handleSave = (response) => {
	console.log("SAVED!!!!",response);
}

export const saveObject = async (props,object) => {
	//newObject.setsiteid('default');
	for(var value in object) {
		if( Array.isArray(object[value]) ) {
			object[value] = JSON.stringify(object[value]);
		}
	}
  
	var newObject = await Mura.getBean(props.scaffoldsource)
		.set(object);

	newObject.set('id',Mura.createUUID());

	await newObject.save()
		.then(
			handleSave,
			handleSave
		)

	return true;
}

function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}

export default Scaffold;
