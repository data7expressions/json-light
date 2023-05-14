/* eslint-disable no-use-before-define */
import { Compressor, Decompressor, JsonLight, JsonLightService, SchemaSolver } from '../domain'

export class JsonLightFacade implements JsonLight {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly schemaSolver:SchemaSolver,
		private readonly service:JsonLightService,
		private readonly compressor:Compressor,
		private readonly decompressor: Decompressor) {}

	public schema (data:any):string {
		return this.schemaSolver.schema(data)
	}

	public compress (data:any, schema?:string):any {
		return this.compressor.compress(data, schema)
	}

	public decompress (data:any, schema?:string):any {
		return this.decompressor.decompress(data, schema)
	}

	public getJson (value: any): any {
		return this.service.getJson(value)
	}
}
