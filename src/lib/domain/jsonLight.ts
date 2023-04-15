export interface IJsonLightService {
	schema (data:any):string
	compress (data:any, schema?:string):any
	decompress (data:any, schema?:string):any
}
