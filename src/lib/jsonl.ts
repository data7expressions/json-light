/* eslint-disable no-use-before-define */
import { Type } from './type'

export class JsonL {
	public static getType (value:string): Type {
		return Type.parse(value)
	}

	// public static compress (json:any):any {
	// }
	// public static decompress (jsonl:any):any {
	// }
	// private _compress (source:any, target:any):void {
	// for (const entry of source) {
	// if (typeof entry[1] === 'object') {
	// } else {
	// target.push(entry[1])
	// }
	// }
	// }
}
