import { Type, JsonL } from '../lib'

(async () => {
	// const strType = '{name:string,lastname:string,age:number,amount:number,properties:[{name:string,value:any}],address:{type:string,calle:string,nro:number}}'
	// const parsedType = Type.parse(strType)
	// console.log(Type.serialize(parsedType))

	const order = {
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
	const orderType = Type.resolve(order)
	console.log(Type.serialize(orderType))
	console.log(Type.stringify(orderType))

	const compressed = JsonL.compress(order, orderType)
	console.log(JSON.stringify(compressed, null, 2))

	const decompressed = JsonL.decompress(compressed, orderType)
	console.log(JSON.stringify(decompressed, null, 2))
})()
