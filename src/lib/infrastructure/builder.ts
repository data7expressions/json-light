import { IJsonLightService } from '../domain'
import { JsonLightService } from '../application'

export class JsonLightBuilder {
	public build ():IJsonLightService {
		return new JsonLightService()
	}
}
