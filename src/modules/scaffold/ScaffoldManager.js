import React, { useEffect, useState } from 'react';
import Mura from 'mura.js';
import { getMuraConfig } from '@murasoftware/next-core';
import Scaffold from './Scaffold';
import ScaffoldConfigurations from './configurations/ScaffoldConfigurations';
import ApiConfig from './api/ApiConfig';

export function ScaffoldManager( props ) {
	const objectparams = Object.assign({}, props);
	const DynamicCollectionLayout = getLayout(objectparams.layout).component;
	const [currentID,setCurrentID] = useState();
	const [appState,setAppState] = useState('list');
	const [collection,setCollection]=useState({});
	const [scaffoldProperties,setScaffoldProperties]=useState([]);
	const [objectProperties,setObjectProperties]=useState([]);
	const [renderSettings,setRenderSettings]=useState({'sortdirection':'asc','itemsperpage':10});

	objectparams.fields=objectparams.fields || getDefaultQueryPropsFromLayout(DynamicCollectionLayout,objectparams).fields || 'Image,Date,Title,Summary,Credits,Tags';
	objectparams.sortby = renderSettings.sortby ? renderSettings.sortby : '';
	objectparams.sortdirection = renderSettings.sortdirection;
	objectparams.itemsperpage = renderSettings.itemsperpage;
	objectparams.pageindex = renderSettings.pageindex ? renderSettings.pageindex : 1;

	const sortHandler = (name) => {
		objectparams.sortby = name;
		renderSettings.sortdirection = renderSettings.sortdirection == 'asc' ? 'desc' : 'asc';
		objectparams.sortdirection = renderSettings.sortdirection;
		setRenderSettings({...renderSettings, 'sortdirection': objectparams.sortdirection});
		setRenderSettings({...renderSettings,'sortby': objectparams.sortby});
		getObjectData(objectparams, scaffoldProperties, objectProperties, setCollection, setScaffoldProperties, setObjectProperties);
	}

	const actionHandler = (e,name,id) => {
		e.preventDefault();
		setCurrentID(null);

		if(name == 'edit') {
			setCurrentID(id);
			setAppState('edit');
		}
		if(name == 'itemsper') {
			setRenderSettings({...renderSettings,'itemsperpage': e.target.value});
			setAppState('refresh');	
		}
		if(name == 'next') {
			setRenderSettings({...renderSettings,'pageindex': renderSettings.pageindex+1});
			setAppState('refresh');	
		}
		if(name == 'prev') {
			setRenderSettings({...renderSettings,'pageindex': renderSettings.pageindex-1});
			setAppState('refresh');	
		}
		else if(name == 'new') {

			setAppState('new');
		}
		else if(name == 'saved') {
			setAppState('refresh');
		}
		else if(name == 'cancel') {
			setAppState('refresh');
		}
	}

	useEffect(() => {
		if(appState == 'refresh') {
			getObjectData(objectparams, scaffoldProperties, objectProperties, setCollection, setScaffoldProperties, setObjectProperties);
			setAppState('');
		}
	}, [appState]);

	if (!objectparams.dynamicProps) {
		const urlParams = Mura.getQueryStringParams();

		useEffect(() => {
			if(objectparams.hasOwnProperty('scaffoldsource') && objectparams.scaffoldsource.length) {
				setRenderSettings({...renderSettings,'pageindex': 1});
				objectparams.pageindex = 1;
				getObjectData(objectparams, scaffoldProperties, objectProperties, setCollection, setScaffoldProperties, setObjectProperties);
			}
		}, []);

		console.log('scaffoldProperties',scaffoldProperties);

		if(scaffoldProperties && scaffoldProperties.length) {
			switch(appState) {
				case "new":
				case "edit":
					return (
						<Scaffold currentID={currentID} actionHandler={actionHandler} objectProperties={objectProperties} scaffoldProperties={scaffoldProperties} objectparams={objectparams} props={props} />
					)
					break;
				default: 
					return (
						<RenderScaffoldManager renderSettings={renderSettings} sortHandler={sortHandler} actionHandler={actionHandler} objectProperties={objectProperties} scaffoldProperties={scaffoldProperties} collection={collection}  objectparams={objectparams} props={props} />
					)
			}
		  }
		  else {
			return (
			 <div>Please choose an endpoint to render.</div>
			)
		  }
	} else {
		return (
			<div>...loading</div>
		)
	}
}

const RenderScaffoldManager = ({ actionHandler,sortHandler,renderSettings,objectProperties,scaffoldProperties,collection,objectparams,...props }) => {
	const items = collection.get('items');
	const colCount = countScaffoldProps(scaffoldProperties);

	return (
		<div className={`scaffold-table scaffold-table-careers props-${colCount}-up`}>
			<div className={`scaffold-table--cell scaffold-table--cell--action scaffold-table--column-0 scaffold-table--row-top`}>
			<div className="scaffold-table--content"></div>
			</div>
			{
				scaffoldProperties.map((scaffoldProperty,index) => {
					if(scaffoldProperty.hasOwnProperty('list') && scaffoldProperty.list == true) {
						return (
							<div key={'header'+index} className={`scaffold-table--cell scaffold-table--cell--content scaffold-table--column-${index+1} scaffold-table--row-top`}>
								<div className={`scaffold-table--content scaffold-sort ${renderSettings.sortby == scaffoldProperty.field ? 'scaffold-sort-current' : ''}	`} onClick={(e) => sortHandler(scaffoldProperty.field)}>
									{scaffoldProperty.label}
								</div>
							</div>
						)
					}
				})
			}
			{
				items.map((item,index) => {
					return (
						<RenderScaffoldManagerItem actionHandler={actionHandler} key={'itemrow'+index} row={index} item={item} objectProperties={objectProperties} scaffoldProperties={scaffoldProperties} />
					)
				})
			}
			<div className={`scaffold-table--cell scaffold-table--cell--action scaffold-table--column-0 scaffold-table--row-bottom`}>
				<div className="scaffold-table--content">
					<button name="new" type="button" onClick={(e) => actionHandler(e,'new')}>New</button>
					{renderSettings.pageindex > 1 && <button name="prev" type="button" onClick={(e) => actionHandler(e,'prev')}>Prev</button>}
					{renderSettings.pageindex < collection.get('totalpages') && <button name="prev" type="button" onClick={(e) => actionHandler(e,'next')}>Next</button>}
					<select name="itemsper"  onChange={(e) => actionHandler(e,'itemsper')} defaultValue={renderSettings.itemsperpage}>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="20">20</option>
						<option value="50">50</option>
					</select>
				</div>
			</div>
		</div>
	)
};

const RenderScaffoldManagerItem = ({ item,objectProperties,scaffoldProperties,row,actionHandler,...props }) => {
	return (
	<>
	<div className={`scaffold-table--cell scaffold-table--cell--action scaffold-table--column-0 scaffold-table--row-${row}`}>
		<div className="scaffold-table--content">
			<button name="edit" type="button" onClick={(e) => actionHandler(e,'edit',item.get('id'))}>Edit</button>		
		</div>
	</div>
	{
		scaffoldProperties.map((scaffoldProperty,index) => {
			if(scaffoldProperty.hasOwnProperty('list') && scaffoldProperty.list == true) {
				return (
				<div key={'cell'+row+'_'+index} className={`scaffold-table--cell scaffold-table--cell--content scaffold-table--column-${index+1} scaffold-table--row-${row}`}>
					<div className="scaffold-table--content">
						{renderValue(item.get(scaffoldProperty.field))}
					</div>
				</div>
				)
			}
		})
	}
	</>
	)
};

const countScaffoldProps = (scaffoldProperties) => {
	var ct = 1;
	for(var i = 0;i < scaffoldProperties.length;i++) {
		ct = scaffoldProperties[i].hasOwnProperty('list') && scaffoldProperties[i].list == true ? ct+1 : ct;
	}

	return ct;
}

export const renderValue = (val) => {
	if(isJson(val)) {
		const arr = JSON.parse(val);
		return arr.join(', ');
	}
	else {
		return val;
	}
}

export const getDynamicProps = async (objectparams,scaffoldProperties,objectProperties,appState) => {
	const scaffoldConfigurations = new ScaffoldConfigurations();
	const apiEndpoint = scaffoldConfigurations.getConfiguration(objectparams.scaffoldsource);

	if(apiEndpoint instanceof ApiConfig) {
		scaffoldProperties = apiEndpoint.getConfig(objectparams.scaffoldsource);
	}
	else {
		console.log("CONFIGURATION NOT FOUND IN ScaffoldConfigurations");
	}

	console.log("DATAPROPS",scaffoldProperties);

	const apiEntity = apiEndpoint.getEntity(objectparams.scaffoldsource,apiEndpoint);

	console.log("ENTITY",apiEndpoint);
	
	if (!objectProperties.length) {
		objectProperties = apiEndpoint.get(objectparams,{});
	}


	
	const feed = apiEndpoint.getFeed(objectparams,{});
	//const feed = await Mura.getFeed(objectparams.scaffoldsource);

	return feed;

	if(objectparams.maxitems) {
		feed.maxItems(objectparams.maxitems);
	}
	if(objectparams.itemsperpage) {
		feed.itemsPerPage(objectparams.itemsperpage);
	}
	if(objectparams.pageindex) {
		feed.pageIndex(objectparams.pageindex);
	}
	// if(objectparams.fields) {
	// 	feed.fields(objectparams.fields);
	// }
	if(objectparams.sortby) {
		feed.sort(objectparams.sortby,objectparams.sortdirection );
	}

	const query = await feed.getQuery();
	
	return {
			scaffoldProperties: scaffoldProperties,
			objectProperties: objectProperties,
			feed: query.getAll()
	};
}

export const getLayout=function(layout) {
	const muraConfig =getMuraConfig();
	const { ComponentRegistry } = muraConfig;
	const uselayout = (!layout || layout == 'default') ? "List" : layout;
  
	if(typeof ComponentRegistry[uselayout] != 'undefined') {
		return ComponentRegistry[uselayout];
	} else {
		return ComponentRegistry['List'];
	}
}

function getObjectData(objectparams, scaffoldProperties, objectProperties, setCollection, setScaffoldProperties, setObjectProperties) {
	getDynamicProps(objectparams, scaffoldProperties, objectProperties, 'list').then((dynamicProps) => {
		const coll = new Mura.EntityCollection(dynamicProps.feed, Mura._requestcontext);
		setCollection(coll);
		setScaffoldProperties(dynamicProps.scaffoldProperties);
		setObjectProperties(dynamicProps.objectProperties);
	});
}

function getDefaultQueryPropsFromLayout(layout,item){
	if(layout){
		return layout.getQueryProps ? layout.getQueryProps(item) : {fields:''};
	} else {
		return  {fields:''};
	}
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

export default ScaffoldManager;
