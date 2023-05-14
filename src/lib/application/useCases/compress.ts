/* eslint-disable no-use-before-define */
import { Compressor, JsonLightService } from '../../domain'
import { Type, Primitive } from 'typ3s'

export class Compress implements Compressor {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly service:JsonLightService) {}

	public compress (data:any, schema?:string):any {
		const type = schema ? Type.parse(schema) : undefined
		return this._compress(data, type)
	}

	private _compress (data:any, type?:Type):any {
		let result:any
		const _type = type !== undefined && type.primitive !== Primitive.any ? type : Type.resolve(data)
		if (Type.isPrimitive(_type)) {
			result = data
		}
		if (_type.primitive === Primitive.obj && _type.obj !== undefined) {
			const primitives:any[] = []
			const others:any = {}
			for (const property of _type.obj.properties) {
				if (property.type !== undefined) {
					if (data[property.name] === undefined) {
						if (Type.isPrimitive(property.type)) {
							primitives.push('<N/D>')
						} else {
							others[property.name] = '<N/D>'
						}
					} else {
						// const value = data[property.name] !== undefined ? data[property.name] : null
						const value = data[property.name]
						if (Type.isPrimitive(property.type)) {
							primitives.push(value)
						} else if (property.type.primitive === Primitive.any) {
							others[property.name] = data[property.name]
						} else if (value !== null) {
							others[property.name] = this._compress(data[property.name], property.type)
						}
					}
				}
			}
			if (Object.entries(others).length === 0) {
				result = primitives
			} else {
				result = { ...{ _: primitives }, ...others }
			}
		} else if (_type.primitive === Primitive.list && _type.list !== undefined) {
			const list:any[] = []
			for (const item of data) {
				if (Type.isPrimitive(_type.list.items) || _type.list.items.primitive === Primitive.any) {
					list.push(item)
				} else {
					const value = this._compress(item, _type.list.items)
					if (value !== null && value !== undefined && value !== '<N/D>') {
						list.push(value)
					}
				}
			}
			result = list
		} else {
			const input = this.service.getJson(data)
			if (input) {
				throw new Error(`cannot resolve type ${_type.primitive} for : ${JSON.stringify(input)}`)
			} else {
				throw new Error(`cannot resolve type ${_type.primitive} for : ${data}`)
			}
		}
		// If the type was not passed or it was any, the type must be added in the json
		if (type !== undefined && type.primitive !== Primitive.any) {
			return result
		}
		if (Object.entries(result).length === 1 && result._ !== undefined) {
			return { _schema: Type.stringify(_type), _: result._ }
		}
		return { _schema: Type.stringify(_type), _data: result }
	}
}
