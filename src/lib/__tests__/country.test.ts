/* eslint-disable no-template-curly-in-string */
import { JsonLight } from '..'
let data:any
beforeAll(async () => {
	data = {
		name: 'Spain',
		region: 'Europe',
		phoneCode: '34',
		timezones: [
			{ name: 'Madrid', offset: 1, pos: { lat: 40.4165, log: -3.70256 } },
			{ name: 'Ceuta', offset: 1, pos: { lat: 35.8883, log: -5.3162 } },
			{ name: 'Canary', offset: 0, pos: { lat: 28.1248, log: -15.43 } }
		]
	}
})

describe('simple', () => {
	test('resolve', () => {
		const result = JsonLight.schema(data)
		const expected = '{name:string,region:string,phoneCode:string,timezones:[{name:string,offset:integer,pos:{lat:decimal,log:decimal}}]}'
		expect(expected).toStrictEqual(result)
	})
	test('compressed', () => {
		const schema = JsonLight.schema(data)
		const result = JsonLight.compress(data, { schema })
		const expected = '{"_":["Spain","Europe","34"],"timezones":[{"_":["Madrid",1],"pos":[40.4165,-3.70256]},{"_":["Ceuta",1],"pos":[35.8883,-5.3162]},{"_":["Canary",0],"pos":[28.1248,-15.43]}]}'
		expect(expected).toStrictEqual(JSON.stringify(result))
	})
	test('decompress', () => {
		const schema = JsonLight.schema(data)
		const compressed = JsonLight.compress(data, { schema })
		const result = JsonLight.decompress(compressed, { schema })
		const expected = '{"name":"Spain","region":"Europe","phoneCode":"34","timezones":[{"name":"Madrid","offset":1,"pos":{"lat":40.4165,"log":-3.70256}},{"name":"Ceuta","offset":1,"pos":{"lat":35.8883,"log":-5.3162}},{"name":"Canary","offset":0,"pos":{"lat":28.1248,"log":-15.43}}]}'
		expect(expected).toStrictEqual(JSON.stringify(result))
	})
})
describe('mapping', () => {
	test('compressed', () => {
		const schema = JsonLight.schema(data)
		const result = JsonLight.compress(data, { schema, mapping: true })
		const expected = '{"0":[{"1":[40.4165,-3.70256],"_":["Madrid",1]},{"1":[35.8883,-5.3162],"_":["Ceuta",1]},{"1":[28.1248,-15.43],"_":["Canary",0]}],"_":["Spain","Europe","34"],"__map":{"0":"timezones","1":"pos"}}'
		expect(expected).toStrictEqual(JSON.stringify(result))
	})
	test('decompress', () => {
		const schema = JsonLight.schema(data)
		const compressed = JsonLight.compress(data, { schema, mapping: true })
		const result = JsonLight.decompress(compressed, { schema })
		const expected = '{"name":"Spain","region":"Europe","phoneCode":"34","timezones":[{"name":"Madrid","offset":1,"pos":{"lat":40.4165,"log":-3.70256}},{"name":"Ceuta","offset":1,"pos":{"lat":35.8883,"log":-5.3162}},{"name":"Canary","offset":0,"pos":{"lat":28.1248,"log":-15.43}}]}'
		expect(expected).toStrictEqual(JSON.stringify(result))
	})
})
