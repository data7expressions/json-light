/* eslint-disable no-template-curly-in-string */
import { JsonLight } from '..'
let data:any
beforeAll(async () => {
	data = {
		id: 139,
		customerId: 'FAMIA',
		employeeId: 9,
		orderDate: '1996-12-17T23:00:00.000Z',
		requiredDate: '1996-12-31T23:00:00.000Z',
		shippedDate: '1996-12-24T23:00:00.000Z',
		shipViaId: 3,
		freight: 13.99,
		name: 'Familia Arquibaldo',
		address: 'Rua Ors, 92',
		city: 'Sao Paulo',
		region: 'SP',
		postalCode: '05442-030',
		country: 'Brazil',
		details: [
			{
				orderId: 139,
				productId: 24,
				unitPrice: 3.6,
				quantity: 15,
				discount: 0
			},
			{
				orderId: 139,
				productId: 34,
				unitPrice: 11.2,
				quantity: 10,
				discount: 0
			}
		]
	}
})

describe('simple', () => {
	test('resolve', () => {
		const result = JsonLight.type(data)
		const expected = '{id:integer,customerId:string,employeeId:integer,orderDate:string,requiredDate:string,shippedDate:string,shipViaId:integer,freight:decimal,name:string,address:string,city:string,region:string,postalCode:string,country:string,details:[{orderId:integer,productId:integer,unitPrice:decimal,quantity:integer,discount:integer}]}'
		expect(expected).toStrictEqual(result)
	})
	test('compressed', () => {
		const type = JsonLight.type(data)
		const result = JsonLight.compress(data, { type })
		const expected = '{"_":[139,"FAMIA",9,"1996-12-17T23:00:00.000Z","1996-12-31T23:00:00.000Z","1996-12-24T23:00:00.000Z",3,13.99,"Familia Arquibaldo","Rua Ors, 92","Sao Paulo","SP","05442-030","Brazil"],"details":[[139,24,3.6,15,0],[139,34,11.2,10,0]]}'
		expect(expected).toStrictEqual(JSON.stringify(result))
	})
	test('decompress', () => {
		const type = JsonLight.type(data)
		const compressed = JsonLight.compress(data, { type })
		const result = JsonLight.decompress(compressed, { type })
		const expected = '{"id":139,"customerId":"FAMIA","employeeId":9,"orderDate":"1996-12-17T23:00:00.000Z","requiredDate":"1996-12-31T23:00:00.000Z","shippedDate":"1996-12-24T23:00:00.000Z","shipViaId":3,"freight":13.99,"name":"Familia Arquibaldo","address":"Rua Ors, 92","city":"Sao Paulo","region":"SP","postalCode":"05442-030","country":"Brazil","details":[{"orderId":139,"productId":24,"unitPrice":3.6,"quantity":15,"discount":0},{"orderId":139,"productId":34,"unitPrice":11.2,"quantity":10,"discount":0}]}'
		expect(expected).toStrictEqual(JSON.stringify(result))
	})
})
describe('mapping', () => {
	test('compressed', () => {
		const type = JsonLight.type(data)
		const result = JsonLight.compress(data, { type, mapping: true })
		const expected = '{"0":[[139,24,3.6,15,0],[139,34,11.2,10,0]],"_":[139,"FAMIA",9,"1996-12-17T23:00:00.000Z","1996-12-31T23:00:00.000Z","1996-12-24T23:00:00.000Z",3,13.99,"Familia Arquibaldo","Rua Ors, 92","Sao Paulo","SP","05442-030","Brazil"],"__map":{"0":"details"}}'
		expect(expected).toStrictEqual(JSON.stringify(result))
	})
	test('decompress', () => {
		const type = JsonLight.type(data)
		const compressed = JsonLight.compress(data, { type, mapping: true })
		const result = JsonLight.decompress(compressed, { type })
		const expected = '{"id":139,"customerId":"FAMIA","employeeId":9,"orderDate":"1996-12-17T23:00:00.000Z","requiredDate":"1996-12-31T23:00:00.000Z","shippedDate":"1996-12-24T23:00:00.000Z","shipViaId":3,"freight":13.99,"name":"Familia Arquibaldo","address":"Rua Ors, 92","city":"Sao Paulo","region":"SP","postalCode":"05442-030","country":"Brazil","details":[{"orderId":139,"productId":24,"unitPrice":3.6,"quantity":15,"discount":0},{"orderId":139,"productId":34,"unitPrice":11.2,"quantity":10,"discount":0}]}'
		expect(expected).toStrictEqual(JSON.stringify(result))
	})
})
