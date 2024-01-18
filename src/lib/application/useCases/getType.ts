/* eslint-disable no-use-before-define */
import { TypeSolver } from 'lib/domain'
import { Type } from 'typ3s'

export class GetType implements TypeSolver {
	public type (data:any):string {
		const type = Type.solve(data)
		return Type.stringify(type)
	}
}
