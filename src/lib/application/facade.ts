/* eslint-disable no-use-before-define */
import { Compressor, CompressorOptions, Decompressor, DecompressorOptions, JsonLight, JsonLightService, SchemaSolver } from '../domain'

export class JsonLightFacade implements JsonLight {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly schemaSolver:SchemaSolver,
		private readonly service:JsonLightService,
		private readonly compressor:Compressor,
		private readonly decompressor: Decompressor) {}

	public schema (data:any):string {
		return this.schemaSolver.schema(data)
	}

	public compress (data:any, options?:CompressorOptions):any {
		return this.compressor.compress(data, options)
	}

	public decompress (data:any, options?:DecompressorOptions):any {
		return this.decompressor.decompress(data, options)
	}

	public getJson (value: any): any {
		return this.service.getJson(value)
	}
}
