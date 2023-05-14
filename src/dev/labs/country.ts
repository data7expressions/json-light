import { JsonLight } from '../../lib'

(async () => {
	const data = {
		name: 'Spain',
		region: 'Europe',
		phoneCode: '34',
		timezones: [
			{ name: 'Madrid', offset: 1, pos: { lat: 40.4165, log: -3.70256 } },
			{ name: 'Ceuta', offset: 1, pos: { lat: 35.8883, log: -5.3162 } },
			{ name: 'Canary', offset: 0, pos: { lat: 28.1248, log: -15.43 } }
		]
	}
	console.log('schema:')
	const schema = JsonLight.schema(data)
	console.log(schema)

	console.log('compress:')
	const compressed = JsonLight.compress(data, { schema, mapping: true })
	console.log(JSON.stringify(compressed, null, 2))

	console.log('decompressed:')
	const decompressed = JsonLight.decompress(compressed, { schema })
	console.log(JSON.stringify(decompressed, null, 2))
})()
