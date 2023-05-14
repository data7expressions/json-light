/* eslint-disable no-use-before-define */
import { SchemaSolver } from 'lib/domain'
import { Type } from 'typ3s'

export class GetSchema implements SchemaSolver {
	public schema (data:any):string {
		const type = Type.resolve(data)
		return Type.stringify(type)
	}
}
