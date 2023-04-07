/* eslint-disable no-use-before-define */
import { Type, Kind } from './type'

export class JsonL {
	public static compress (data:any, type?:Type):any {
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
						others[property.name] = this.compress(data[property.name], property.type)
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
				const value = this.compress(item, _type.list.items)
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
			return { _type: Type.stringify(type), _: result._ }
		}
		return { _type: Type.stringify(type), _data: result }
	}

	public static decompress (data:any, type?:Type):any {
		let _type
		let _data
		let result:any
		if (type !== undefined && type.kind !== Kind.any) {
			_type = type
			_data = data
		} else if (data._type !== undefined) {
			_type = Type.parse(data._type)
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
						result[property.name] = data._ ? data._[index] : data[index]
						index = index + 1
					} else if (_data[property.name] !== null && _data[property.name] !== undefined) {
						result[property.name] = this.decompress(_data[property.name], property.type)
					}
				}
			}
		} else if (_type.kind === Kind.list && _type.list !== undefined) {
			result = []
			for (const item of data) {
				const value = this.decompress(item, _type.list.items)
				result.push(value)
			}
		} else {
			throw new Error(`cannot resolve type for : ${JSON.stringify(data)}`)
		}
		return result
	}
}
