import { JsonLight } from '../domain'
import { Compress, Decompress, GetType, JsonLightFacade, JsonLightServiceImp } from '../application'

export class JsonLightBuilder {
	public build ():JsonLight {
		const service = new JsonLightServiceImp()
		return new JsonLightFacade(new GetType(), service, new Compress(service), new Decompress(service))
	}
}
