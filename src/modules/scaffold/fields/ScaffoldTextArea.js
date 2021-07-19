export default function ScaffoldTextArea ( {item,changeHandler,dataObject,...props} ) {
	return (
		<div>
			<label>{item.displayname}</label>
			<textarea name={item.name}  defaultValue={dataObject.hasOwnProperty(item.name) ? dataObject[item.name]  : ''} onChange={(e) => changeHandler(item.name,e.target.value)}></textarea>
		</div>
	)
}