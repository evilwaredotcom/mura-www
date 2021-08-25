export default function ScaffoldTextField( {item,changeHandler,dataObject,...props} ) {
	return (
		<div key={item.name}>
			<label>{item.displayname}
				<input name={item.name} defaultValue={dataObject.hasOwnProperty(item.name) ? dataObject[item.name]  : item.default} onChange={(e) => changeHandler(item.name,e.target.value)} />
			</label>
		</div>
	)
}