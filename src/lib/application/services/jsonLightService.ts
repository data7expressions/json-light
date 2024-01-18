import { JsonLightService } from '../../domain'

export class JsonLightServiceImp implements JsonLightService {
	public json (value: any): any {
		if (value === null || value === undefined) {
			return false
		}
		if (typeof value === 'string') {
			if (value.indexOf('{') > -1 || value.indexOf('[') > -1) {
				try {
					return JSON.parse(value)
				} catch {
					return null
				}
			} else {
				return null
			}
		}
		if (typeof value === 'object') {
			return value
		} else {
			return null
		}
	}
}
