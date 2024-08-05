export function formatDate(input) {
	// console.log(input)
	const options = { day: "2-digit", month: "2-digit", year: "numeric" };
	const date = new Date(input).toUTCString().substring(0,16);
	
	return date;
}
