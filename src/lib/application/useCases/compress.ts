/* eslint-disable no-use-before-define */
import { Compressor, CompressorOptions, JsonLightService } from '../../domain'
import { Type, Primitive } from 'typ3s'

export class Compress implements Compressor {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly service:JsonLightService) {}

	public compress (data:any, options?:CompressorOptions):any {
		const type = options && options.schema ? Type.parse(options.schema) : undefined
		const mapping = options && options.mapping ? {} : undefined
		const result = this._compress(data, type, mapping)
		result.__map = mapping
		return result
	}

	private getKey (name:string, mapping:any):string {
		if (mapping === undefined) {
			return name
		}
		const entry = Object.entries(mapping).find(p => p[1] === name)
		if (entry !== undefined) {
			return entry[0]
		}
		const keys = Object.keys(mapping).map(p => parseInt(p))
		const key = (keys.length === 0 ? 0 : Math.max(...keys) + 1).toString()
		mapping[key] = name
		return key
	}

	private _compress (data:any, type?:Type, mapping?:any):any {
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
							others[this.getKey(property.name, mapping)] = '<N/D>'
						}
					} else {
						// const value = data[property.name] !== undefined ? data[property.name] : null
						const value = data[property.name]
						if (Type.isPrimitive(property.type)) {
							primitives.push(value)
						} else if (property.type.primitive === Primitive.any) {
							others[this.getKey(property.name, mapping)] = data[property.name]
						} else if (value !== null) {
							others[this.getKey(property.name, mapping)] = this._compress(data[property.name], property.type, mapping)
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
					const value = this._compress(item, _type.list.items, mapping)
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
