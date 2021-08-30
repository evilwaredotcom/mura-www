import { cleanDefaultNulls } from "./ScaffoldFields"

export default function ScaffoldTextField( {item,changeHandler,dataObject,...props} ) {
	return (
		<div>
			<label>{item.displayname}
				<input name={item.name} defaultValue={dataObject.hasOwnProperty(item.name) ? dataObject[item.name]  : cleanDefaultNulls(item.default)} onChange={(e) => changeHandler(item.name,e.target.value)} />
			</label>
		</div>
	)
}