
export interface SchemaSolver {
	schema (data:any):string
}

export interface JsonLightService {
	getJson (value: any): any
}

export interface CompressorOptions {
	schema?:string
	mapping?:boolean
}
export interface Compressor {
	compress (data:any, options?:CompressorOptions):any
}

export interface DecompressorOptions {
	schema?:string
}

export interface Decompressor {
	decompress (data:any, options?:DecompressorOptions):any
}

export interface JsonLight extends SchemaSolver, JsonLightService, Compressor, Decompressor {}
