import React, {  useEffect,useState } from 'react';

export default function ScaffoldCheckboxGroup( {item,changeHandler,...props} ) {
	const [checkedItems,setCheckedItems] = useState({});

	useEffect(() => {
		if(item.default) {
			setCheckedItems({[item.default]:true});
			changeHandler(item.name,[item.default]);
		}
	}, []);

	const handleToggle = (e,name) => {
		var isChecked = e.target.checked;
		var checked = {...checkedItems};

		if(isChecked) {
			checked[e.target.value] = true;
		}
		else {
			console.log("NOT!");
			delete checked[e.target.value];
		}
		setCheckedItems(checked);
		changeHandler(name,Object.keys(checked));
	}

	return (
		<div>
			{
				item.options.map((opt) => {
					var key = opt.name + '_' + opt.value;
					return (
						<label key={key}>
							{opt.label}<input type="checkbox" onChange={(e) => handleToggle(e,item.name)} name={item.name}  value={opt.value}  defaultChecked={item.default == opt.value} /></label>
					)
				})
			}				
		</div>
	)
}