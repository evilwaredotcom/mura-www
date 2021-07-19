import React, {  useEffect } from 'react';

export default function ScaffoldCheckboxGroup( {item,changeHandler,dataObject,...props} ) {
	useEffect(() => {
		if(item.default) {
			changeHandler(item.name,[item.default]);
		}
	}, []);

	return (
		<div>
			{
				item.options.map((opt) => {
					var key = opt.name + '_' + opt.value;
					return (
						<label key={key}>
							{opt.label}
							<input type="radio"
								onChange={(e) => changeHandler(item.name,e.target.value)}
								name={item.name}
								value={opt.value}
								defaultChecked={dataObject.hasOwnProperty(item.name) ? isChecked(dataObject[item.name],opt.value)  : item.default == opt.value}
							/></label>
					
					)
				})
			}				
		</div>
	)
}

const isChecked = (data,value) => {
	if(Array.isArray(data)) {
		if(data.includes(value)) {
			return true;
		}
	}
	else if(data.length && data == value) {
		return true;
	}

	return false;
}