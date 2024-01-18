/* eslint-disable no-use-before-define */
import { Compressor, CompressorOptions, Decompressor, DecompressorOptions, JsonLight, JsonLightService, TypeSolver } from '../domain'

export class JsonLightFacade implements JsonLight {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly typeSolver:TypeSolver,
		private readonly service:JsonLightService,
		private readonly compressor:Compressor,
		private readonly decompressor: Decompressor) {}

	public type (data:any):string {
		return this.typeSolver.type(data)
	}

	public compress (data:any, options?:CompressorOptions):any {
		return this.compressor.compress(data, options)
	}

	public decompress (data:any, options?:DecompressorOptions):any {
		return this.decompressor.decompress(data, options)
	}

	public json (value: any): any {
		return this.service.json(value)
	}
}
