
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
	const[saveObject,setSaveObject] = useState({});
	const[isLoaded,setIsLoaded] = useState(false);
	var gondor = {};

	const changeHandler = (name,value) => {
		setSaveObject({...saveObject, [name]: value});
	}
	
	const clickHandler = async (e,name) => {
		e.preventDefault();
		
		if(name == 'save') {
			var response = await doSaveObject(objectparams,dataObject,saveObject);

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
						try {
							var inst = JSON.parse(dynamicProps.objectProperties.currentObject.properties[i]);
						}
						catch(e) {
							var inst = dynamicProps.objectProperties.currentObject.properties[i];
						}
						obj[i] = inst;
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
						return (<div>--R: {item.displayname}</div>)
					}
					if(item.fieldtype && item.fieldtype == 'one-to-one') {
						return (<div>--R: {item.displayname}</div>)
					}
					if(item.fieldtype && item.fieldtype == 'many-to-one') {
						return (<div>--R: {item.displayname}</div>)
					}					
					else if(!item.rendertype || item.rendertype != 'hidden') {
						if(item.rendertype) {
//							console.log("RenderByRenderType",item);
							return RenderByRenderType(item,changeHandler,dataObject,props);
						}
						else {
//							console.log("RenderByVarType",item);
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
		case 'hidden':
			return (
				<></>
			)
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
				<div key={item.name}>{item.displayname}: ?? ??</div>
			)
	}
}

export const RenderByVarType = ( item,changeHandler,dataObject,props ) => {
	switch(item.datatype) {
		case 'varchar':
		case 'char':
		case 'text':
			if(item.length == 35 || item.name.substr(item.name.length,-2) == 'id') {
				return <></>
			}
			else if(item.length && item.length <= 255) {
				return (
					<ScaffoldTextField key={item.name} dataObject={dataObject} props={props} changeHandler={changeHandler} item={item} />
				)
			}
			else {
				return (
					<ScaffoldTextArea key={item.name} dataObject={dataObject} props={props} changeHandler={changeHandler} item={item} />
				)
			}
			break;
		default: 
			return (
				<ScaffoldTextField key={item.name} dataObject={dataObject} props={props} changeHandler={changeHandler} item={item} />
			)
	}
}

export const getDynamicProps = async props => {

	var objectProperties = [];
	var currentObject;
	var objectData;

	if(props.currentID) {
		currentObject = await Mura.getEntity(props.scaffoldsource).loadBy('id',props.currentID);
	}
	else {
		currentObject = await Mura.getEntity(props.scaffoldsource);
	}

	if(currentObject._remoteAPIEntity) {
		await currentObject.setRemoteConfiguration();
	}
	
	if(props.scaffoldsource) {
		if(currentObject.configuration) {
			objectData = currentObject.configuration.fields;
		}
		else {
			var bean = await Mura.getEntity(props.scaffoldsource);
			objectData = await bean.invoke(
				'properties',
				{
				}
			);
		}
	}
	else {
		return -1;
	}

	// if is an array, then order is per array
	if(Array.isArray(objectData)) {
		objectProperties = objectData;
	}
	// sort properties, first if by orderno
	else if(objectData.properties && objectData.hasOwnProperty('orderno')) {
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

const setDefaults = (object) => {
	var data = object.getAll();
	for(var i in data) {
		if(data[i] == 'null') {
			data[i] = null;
		}
	}
	object.set(data);
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

export const doSaveObject = async (props,dataObject,saveObject) => {
	//newObject.setsiteid('default');

	const newObject = Mura.extend(dataObject,saveObject);

	for(var value in newObject) {
		if( Array.isArray(newObject[value]) ) {
			newObject[value] = JSON.stringify(newObject[value]);
		}
	}

	var newBean = await Mura.getBean(props.scaffoldsource);

	// API Objects
	if(newBean._remoteAPIEntity) {
		const formfields = newBean.configuration.fields;
		const saveFields = newBean.configuration.savefields ? newBean.configuration.savefields : [];
		const saveData = {};
		for(var i in formfields) {
			saveData[formfields[i].name] = formatSaveData(newObject[formfields[i].name]);
		}
		for(var i in saveFields) {
			saveData[saveFields[i]] = formatSaveData(newObject[saveFields[i]]);
		}

		saveData[newBean.configuration.idfield] = formatSaveData(newObject[newBean.configuration.idfield]);

		await newBean.save(saveData)
		.then(
			handleSave,
			handleSave
		)
	}
	// Mura ORM Objects
	else {
		newBean.set(newObject);
		newBean.set('id',Mura.createUUID());
		await newBean.save()
		.then(
			handleSave,
			handleSave
		)
	}

	return true;
}

function formatSaveData(str) {
	if(str == null) {
		return null;
	}
	else if(typeof str == 'undefined') {
		return null;
	}
	else if(!str.toString().length) {
		return null;
	}
	return str;
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
