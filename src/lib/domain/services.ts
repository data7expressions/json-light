
export interface SchemaSolver {
	schema (data:any):string
}

export interface JsonLightService {
	getJson (value: any): any
}

export interface Compressor {
	compress (data:any, schema?:string):any
}

export interface Decompressor {
	decompress (data:any, schema?:string):any
}

export interface JsonLight extends SchemaSolver, JsonLightService, Compressor, Decompressor {}
