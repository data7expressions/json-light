
export interface TypeSolver {
	type (data:any):string
}

export interface JsonLightService {
	getJson (value: any): any
}

export interface CompressorOptions {
	type?:string
	mapping?:boolean
}
export interface Compressor {
	compress (data:any, options?:CompressorOptions):any
}

export interface DecompressorOptions {
	type?:string
}

export interface Decompressor {
	decompress (data:any, options?:DecompressorOptions):any
}

export interface JsonLight extends TypeSolver, JsonLightService, Compressor, Decompressor {}
