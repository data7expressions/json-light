/* eslint-disable no-use-before-define */
import { Decompressor, JsonLightService } from '../../domain'
import { Type, Primitive } from 'typ3s'

export class Decompress implements Decompressor {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly service:JsonLightService) {}

	public decompress (data:any, schema?:string):any {
		const type = schema ? Type.parse(schema) : undefined
		return this._decompress(data, type)
	}

	private _decompress (data:any, type?:Type):any {
		let _type
		let _data
		let result:any
		if (type !== undefined && type.primitive !== Primitive.any) {
			_type = type
			_data = data
		} else if (data._schema !== undefined) {
			_type = Type.parse(data._schema)
			_data = data._data
		} else {
			throw new Error('cannot resolve type')
		}
		if (Type.isPrimitive(_type)) {
			result = data
		}
		if (_type.primitive === Primitive.obj && _type.obj !== undefined) {
			result = {}
			let index = 0
			for (const property of _type.obj.properties) {
				if (property.type !== undefined) {
					if (Type.isPrimitive(property.type)) {
						const value = _data._ ? _data._[index] : _data[index]
						if (value === '<N/D>') {
							result[property.name] = undefined
						} else {
							result[property.name] = value
						}
						index = index + 1
					} else if (_data[property.name] === '<N/D>') {
						result[property.name] = undefined
					} else if (_data[property.name] === null || _data[property.name] === undefined) {
						result[property.name] = null
					} else if (property.type.primitive === Primitive.any) {
						result[property.name] = _data[property.name]
					} else {
						result[property.name] = this._decompress(_data[property.name], property.type)
					}
				}
			}
		} else if (_type.primitive === Primitive.list && _type.list !== undefined) {
			result = []
			for (const item of _data) {
				if (Type.isPrimitive(_type.list.items) || _type.list.items.primitive === Primitive.any) {
					result.push(item)
				} else {
					const value = this._decompress(item, _type.list.items)
					result.push(value)
				}
			}
		} else {
			const input = this.service.getJson(_data)
			if (input) {
				throw new Error(`cannot resolve type ${_type.primitive} for : ${JSON.stringify(input)}`)
			} else {
				throw new Error(`cannot resolve type ${_type.primitive} for : ${_data}`)
			}
		}
		return result
	}
}
