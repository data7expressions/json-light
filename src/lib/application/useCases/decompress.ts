/* eslint-disable no-use-before-define */
import { Decompressor, DecompressorOptions, JsonLightService } from '../../domain'
import { Type, Primitive } from 'typ3s'

export class Decompress implements Decompressor {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly service:JsonLightService) {}

	public decompress (data:any, options?:DecompressorOptions):any {
		const type = options && options.type ? Type.parse(options.type) : undefined
		const mapping = data.__map ? data.__map : undefined
		return this._decompress(data, type, mapping)
	}

	private getKey (name:string, mapping:any):string {
		if (mapping === undefined) {
			return name
		}
		const entry = Object.entries(mapping).find(p => p[1] === name)
		if (entry !== undefined) {
			return entry[0]
		}
		return name
	}

	private _decompress (data:any, type?:Type, mapping?:any):any {
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
					} else {
						const key = this.getKey(property.name, mapping)
						const value = _data[key]
						if (value === '<N/D>') {
							result[property.name] = undefined
						} else if (_data[property.name] === null || value === undefined) {
							result[property.name] = null
						} else if (property.type.primitive === Primitive.any) {
							result[property.name] = value
						} else {
							result[property.name] = this._decompress(value, property.type, mapping)
						}
					}
				}
			}
		} else if (_type.primitive === Primitive.list && _type.list !== undefined) {
			result = []
			for (const item of _data) {
				if (Type.isPrimitive(_type.list.items) || _type.list.items.primitive === Primitive.any) {
					result.push(item)
				} else {
					const value = this._decompress(item, _type.list.items, mapping)
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
