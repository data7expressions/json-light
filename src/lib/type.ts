/* eslint-disable no-use-before-define */
import { h3lp } from 'h3lp'

export enum Kind
{ any = 'any'
, string = 'string'
, integer = 'integer'
, decimal = 'decimal'
, number = 'number'
, boolean = 'boolean'
, date = 'date'
, dateTime = 'dateTime'
, time = 'time'
, void = 'void'
, obj = 'obj'
, list = 'list'
, undefined = 'undefined'
}

export interface PropertyType {
	name:string
	type?: Type
}
export interface ObjType {
	properties: PropertyType[]
}

export interface ListType {
	items:Type
}
export class Type {
	// eslint-disable-next-line no-useless-constructor
	public constructor (public kind:Kind, public obj?: ObjType, public list?:ListType) { }

	public static get any ():Type {
		return new Type(Kind.any)
	}

	public static get string ():Type {
		return new Type(Kind.string)
	}

	public static get integer ():Type {
		return new Type(Kind.integer)
	}

	public static get decimal ():Type {
		return new Type(Kind.decimal)
	}

	public static get number ():Type {
		return new Type(Kind.number)
	}

	public static get boolean ():Type {
		return new Type(Kind.boolean)
	}

	public static get date ():Type {
		return new Type(Kind.date)
	}

	public static get dateTime ():Type {
		return new Type(Kind.dateTime)
	}

	public static get time ():Type {
		return new Type(Kind.time)
	}

	public static get void ():Type {
		return new Type(Kind.void)
	}

	// eslint-disable-next-line no-use-before-define,
	public static Obj (properties: PropertyType[] = []):Type {
		return new Type(Kind.obj, { properties })
	}

	public static List (items:Type):Type {
		return new Type(Kind.list, undefined, { items })
	}

	public static isPrimitive (type:Type | string): boolean {
		let value:string
		if (typeof type === 'string') {
			value = type
		} else if (type !== undefined && type.kind !== undefined) {
			value = type.kind.toString()
		} else {
			return false
		}
		return ['string', 'integer', 'decimal', 'number', 'boolean', 'date', 'dateTime', 'time'].includes(value)
	}

	public static to (kind:Kind | string): Type {
		if (typeof kind === 'string') {
			const kindKey = kind as keyof typeof Kind
			return new Type(Kind[kindKey])
		}
		return new Type(kind)
	}

	public static get (value: any): Type {
		if (value === null || value === undefined) {
			return Type.any
		} else if (Array.isArray(value)) {
			if (value.length > 0) {
				return Type.List(this.get(value[0]))
			}
			return Type.any
		} else if (typeof value === 'object') {
			const properties: PropertyType[] = []
			for (const entry of Object.entries(value)) {
				properties.push({ name: entry[0], type: this.get(entry[1]) })
			}
			return Type.Obj(properties)
		} else if (typeof value === 'string') {
			// TODO determinar si es fecha.
			return Type.string
		} else if (typeof value === 'number') {
			if (Number.isInteger(value)) {
				return Type.integer
			}
			return Type.decimal
		} else if (typeof value === 'boolean') {
			return Type.boolean
		}
		return Type.any
	}

	public static isList (type:Type| string) : boolean {
		if (typeof type === 'string') {
			return type.startsWith('[') && type.endsWith(']')
		}
		return type.kind === Kind.list
	}

	public static isObj (type:Type|string) : boolean {
		if (typeof type === 'string') {
			return type.startsWith('{') && type.endsWith('}')
		}
		return type.kind === Kind.obj
	}

	public static parse (value:string): Type {
		return new TypeParser(value).parse()
	}

	public static stringify (type?: Type): string {
		if (type === undefined) {
			return 'any'
		}
		if (this.isPrimitive(type)) {
			return type.kind.toString()
		}
		if (this.isObj(type)) {
			const properties:string[] = []
			const objectType = type.obj as ObjType
			for (const propertyType of objectType.properties) {
				properties.push(`${propertyType.name}:${this.stringify(propertyType.type)}`)
			}
			return `{${properties.join(',')}}`
		}
		if (this.isList(type)) {
			const arrayType = type.list as ListType
			return `[${this.stringify(arrayType.items)}]`
		}
		return 'any'
	}

	public static serialize (type?: Type):string | undefined {
		if (type === undefined || type === null) {
			return undefined
		}
		return JSON.stringify(type)
	}

	public static deserialize (type?: string):Type | undefined {
		if (type === undefined || type === null || type.trim() === '') {
			return undefined
		}
		return JSON.parse(type) as Type
	}

	public static resolve (value:any):Type {
		const type = new Type(Kind.undefined)
		this._resolve(value, type)
		return type
	}

	private static _resolve (value:any, type:Type):void {
		if (value === undefined || value === null) {
			return
		}
		if (Array.isArray(value)) {
			if (type.kind === Kind.undefined) {
				type.kind = Kind.list
				type.list = { items: new Type(Kind.undefined) }
			} else if (type.kind !== Kind.list && type.kind !== Kind.any) {
				type.kind = Kind.any
			}
			if (type.list === undefined || type.list.items === undefined) {
				type.list = { items: new Type(Kind.undefined) }
			}
			for (const item of value) {
				this._resolve(item, type.list.items)
			}
		} else if (typeof value === 'object') {
			if (type.kind === Kind.undefined) {
				type.kind = Kind.obj
				type.obj = { properties: [] }
			} else if (type.kind !== Kind.obj && type.kind !== Kind.any) {
				type.kind = Kind.any
			}
			if (type.obj === undefined || type.obj.properties === undefined) {
				type.obj = { properties: [] }
			}
			for (const entry of Object.entries(value)) {
				let property = type.obj.properties.find(p => p.name === entry[0])
				if (property === undefined) {
					property = { name: entry[0], type: new Type(Kind.undefined) }
					type.obj.properties.push(property)
				} else if (property.type === undefined) {
					property.type = new Type(Kind.undefined)
				}
				this._resolve(entry[1], property.type as Type)
			}
		} else if (typeof value === 'string') {
			if (type.kind === Kind.undefined) {
				type.kind = Kind.string
			} else if (type.kind !== Kind.string && type.kind !== Kind.any) {
				type.kind = Kind.any
			}
			// TODO determinar si es fecha.
		} else if (typeof value === 'number') {
			if (type.kind === Kind.undefined) {
				if (Number.isInteger(value)) {
					type.kind = Kind.integer
				}
				type.kind = Kind.decimal
			} else if (type.kind === Kind.integer && !Number.isInteger(value)) {
				type.kind = Kind.decimal
			} else if (type.kind !== Kind.integer && type.kind !== Kind.number && type.kind !== Kind.any) {
				type.kind = Kind.any
			}
		} else if (typeof value === 'boolean') {
			if (type.kind === Kind.undefined) {
				type.kind = Kind.boolean
			} else if (type.kind !== Kind.boolean && type.kind !== Kind.any) {
				type.kind = Kind.any
			}
		}
	}
}

class TypeParser {
	private buffer: string[]
	private length: number
	private index: number
	constructor (source: string) {
		this.buffer = source.split('')
		this.length = this.buffer.length
		this.index = 0
	}

	private get end ():boolean {
		return this.index >= this.length
	}

	private get current (): any {
		return this.buffer[this.index]
	}

	public parse (): Type {
		return this.getType()
	}

	private getType () : Type {
		const char = this.current
		if (h3lp.val.isAlphanumeric(char)) {
			const value: any = this.getValue()
			if (Type.isPrimitive(value) || value === Kind.any) {
				return Type.to(value)
			} else {
				throw new Error(`Cannot solve ${value}`)
			}
		} else if (char === '{') {
			this.index += 1
			this.forwardSpaces()
			const objectType = this.getObject()
			return new Type(Kind.obj, objectType)
		} else if (char === '[') {
			this.index += 1
			this.forwardSpaces()
			const listType = this.getList()
			return new Type(Kind.list, undefined, listType)
		} else {
			throw new Error('Cannot solve type')
		}
	}

	private getValue (increment = true): string {
		const buff = []
		if (increment) {
			while (!this.end && h3lp.val.isAlphanumeric(this.current)) {
				buff.push(this.current)
				this.index += 1
			}
		} else {
			let index = this.index
			while (!this.end && h3lp.val.isAlphanumeric(this.buffer[index])) {
				buff.push(this.buffer[index])
				index += 1
			}
		}
		return buff.join('')
	}

	private getObject (): ObjType {
		const properties:PropertyType[] = []
		while (true) {
			const name = this.getValue()
			this.forwardSpaces()
			if (this.current === ':') this.index += 1
			else throw new Error(`attribute ${name} without value`)
			const type = this.getType()
			properties.push({ name, type })
			this.forwardSpaces()
			if (this.current === ',') {
				this.index += 1
			} else if (this.current === '}') {
				this.index += 1
				break
			} else {
				throw new Error('Object without end')
			}
		}
		return { properties }
	}

	private getList ():ListType {
		const type = this.getType()
		this.forwardSpaces()
		if (this.current === ']') this.index += 1
		else throw new Error('List without end')
		return { items: type }
	}

	private forwardSpaces () {
		while (!this.end && this.buffer[this.index] === ' ') {
			this.index += 1
		}
	}
}
