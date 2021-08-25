export default function ScaffoldDropdown( {item,changeHandler,dataObject,...props} ) {
	return (
		<div key={item.name}>
			<label>{item.displayname}</label>
			<select name={item.name}
			defaultValue={dataObject.hasOwnProperty(item.name) ? dataObject[item.name]  : item.default}
			onChange={(e) => changeHandler(item.name,e.target.value)}>
				{
					item.options.map((opt) => {
						var key = opt.name + '_' + opt.value;
						return (<option  key={key} value={opt.value}>{opt.label}</option>)
					})
				}				
			</select>
		</div>
	)
}
