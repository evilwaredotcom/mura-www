export default function ScaffoldActions( {item,clickHandler,currentID,...props} ) {
	return (
		<div>
			<button name="post" type="button" onClick={(e) => clickHandler(e,'save')}>Save</button>
			<button name="post" type="button" onClick={(e) => clickHandler(e,'cancel')}>Cancel</button>
		</div>
	)
}