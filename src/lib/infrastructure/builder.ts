import { JsonLight } from '../domain'
import { Compress, Decompress, GetSchema, JsonLightFacade, JsonLightServiceImp } from '../application'

export class JsonLightBuilder {
	public build ():JsonLight {
		const service = new JsonLightServiceImp()
		return new JsonLightFacade(new GetSchema(), service, new Compress(service), new Decompress(service))
	}
}
