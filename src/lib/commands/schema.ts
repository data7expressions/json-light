import { JsonLight, helper } from '../index'
module.exports = async (args:any) => {
	const input = args.input || args.i
	const output = args.output || args.o
	if (!input) {
		console.error('input is required!')
		return
	}

	let data = helper.getJson(input)
	if (data === null) {
		const str = await helper.read(input)
		if (str === null) {
			throw new Error(`File ${input} not found`)
		}
		data = JSON.parse(str)
	}

	const schema = JsonLight.schema(data)
	if (output) {
		await helper.write(output, schema)
	} else {
		console.log(schema)
	}
}
