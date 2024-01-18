import { JsonLight } from '../index'
import { helper } from '../helper'
module.exports = async (args:any) => {
	const input = args.input || args.i
	const output = args.output || args.o
	if (!input) {
		console.error('input is required!')
		return
	}

	let data = JsonLight.json(input)
	if (data === null) {
		const str = await helper.read(input)
		if (str === null) {
			throw new Error(`File ${input} not found`)
		}
		data = JSON.parse(str)
	}

	const type = JsonLight.type(data)
	if (output) {
		await helper.write(output, type)
	} else {
		console.log(type)
	}
}
