/* eslint-disable no-use-before-define */
import { Type, Kind } from './type'

export class JsonLight {
	public static schema (data:any):string {
		const type = Type.resolve(data)
		return Type.stringify(type)
	}

	public static compress (data:any, schema?:string):any {
		const type = schema ? Type.parse(schema) : undefined
		return this._compress(data, type)
	}

	private static _compress (data:any, type?:Type):any {
		let result:any
		const _type = type !== undefined && type.kind !== Kind.any ? type : Type.resolve(data)
		if (Type.isPrimitive(_type)) {
			result = data
		}
		if (_type.kind === Kind.obj && _type.obj !== undefined) {
			const primitives:any[] = []
			const others:any = {}
			for (const property of _type.obj.properties) {
				if (property.type !== undefined) {
					const value = data[property.name] !== undefined ? data[property.name] : null
					if (Type.isPrimitive(property.type)) {
						primitives.push(value)
					} else if (value !== null) {
						others[property.name] = this._compress(data[property.name], property.type)
					}
				}
			}
			if (Object.entries(others).length === 0) {
				result = primitives
			} else {
				result = { ...{ _: primitives }, ...others }
			}
		} else if (_type.kind === Kind.list && _type.list !== undefined) {
			const list:any[] = []
			for (const item of data) {
				const value = this._compress(item, _type.list.items)
				if (value !== null && value !== undefined) {
					list.push(value)
				}
			}
			result = list
		} else {
			throw new Error(`cannot resolve type for : ${JSON.stringify(data)}`)
		}
		// If the type was not passed or it was any, the type must be added in the json
		if (type !== undefined && type.kind !== Kind.any) {
			return result
		}
		if (Object.entries(result).length === 1 && result._ !== undefined) {
			return { _schema: Type.stringify(_type), _: result._ }
		}
		return { _schema: Type.stringify(_type), _data: result }
	}

	public static decompress (data:any, schema?:string):any {
		const type = schema ? Type.parse(schema) : undefined
		return this._decompress(data, type)
	}

	private static _decompress (data:any, type?:Type):any {
		let _type
		let _data
		let result:any
		if (type !== undefined && type.kind !== Kind.any) {
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
		if (_type.kind === Kind.obj && _type.obj !== undefined) {
			result = {}
			let index = 0
			for (const property of _type.obj.properties) {
				if (property.type !== undefined) {
					if (Type.isPrimitive(property.type)) {
						result[property.name] = _data._ ? _data._[index] : _data[index]
						index = index + 1
					} else if (_data[property.name] !== null && _data[property.name] !== undefined) {
						result[property.name] = this._decompress(_data[property.name], property.type)
					}
				}
			}
		} else if (_type.kind === Kind.list && _type.list !== undefined) {
			result = []
			for (const item of _data) {
				const value = this._decompress(item, _type.list.items)
				result.push(value)
			}
		} else {
			throw new Error(`cannot resolve type for : ${JSON.stringify(data)}`)
		}
		return result
	}
}
