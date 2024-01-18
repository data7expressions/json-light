import { JsonLight } from '../../lib'

(async () => {
	const data = [
		{
			name: 'Spain',
			region: { name: 'Europe', code: 'EU' },
			languages: ['Spanish', 'Catalan', 'Galician', 'Basque'],
			priority: 1,
			phoneCode: 34,
			timezones: [
				{ name: 'Madrid', offset: 1, pos: { lat: 40.4165, log: -3.70256 } },
				{ name: 'Ceuta', pos: { lat: 35.8883, log: -5.3162 } },
				{ name: 'Canary', offset: 0, pos: { lat: 28.1248, log: -15.43 } }
			]
		},
		{
			name: 'France',
			region: { name: 'Europe', code: 'EU' },
			languages: ['French'],
			priority: 1,
			phoneCode: 33,
			timezones: [
				{ name: 'Paris', offset: 1, pos: { lat: 48.8566, log: 2.3522 } },
				{ name: 'Reunion', offset: 4, pos: { lat: -20.8823, log: 55.4504 } },
				{ name: 'Guadeloupe', offset: -4, pos: { lat: 16.265, log: -61.551 } }
			]
		},
		{
			name: 'Germany',
			languages: ['German'],
			region: { name: 'Europe', code: 'EU' },
			priority: 1,
			phoneCode: 49,
			timezones: [
				{ name: 'Berlin', offset: 1, pos: { lat: 52.5200, log: 13.4050 } },
				{ name: 'Busingen', offset: 1, pos: { lat: 47.6963, log: 8.6927 } }
			]
		},
		{
			name: 'Portugal',
			languages: ['Portuguese'],
			region: { name: 'Europe', code: 'EU' },
			priority: 1,
			phoneCode: 351,
			timezones: [
				{ name: 'Lisbon', offset: 0, pos: { lat: 38.7223, log: -9.1393 } },
				{ name: 'Madeira', offset: 0, pos: { lat: 32.7607, log: -16.9595 } },
				{ name: 'Azores', offset: -1, pos: { lat: 37.7412, log: -25.6756 } }
			]
		},
		{
			name: 'United States',
			languages: ['English'],
			region: { name: 'North America', code: 'NA' },
			priority: 1,
			phoneCode: 1,
			timezones: [
				{ name: 'New York', offset: -5, pos: { lat: 40.7128, log: -74.0060 } },
				{ name: 'Los Angeles', offset: -8, pos: { lat: 34.0522, log: -118.2437 } },
				{ name: 'Chicago', offset: -6, pos: { lat: 41.8781, log: -87.6298 } },
				{ name: 'Denver', offset: -7, pos: { lat: 39.7392, log: -104.9903 } },
				{ name: 'Anchorage', offset: -9, pos: { lat: 61.2181, log: -149.9003 } },
				{ name: 'Honolulu', offset: -10, pos: { lat: 21.3069, log: -157.8583 } }
			]
		},
		{
			name: 'Canada',
			languages: ['English', 'French'],
			region: { name: 'North America', code: 'NA' },
			priority: 1,
			phoneCode: 2,
			timezones: [
				{ name: 'Toronto', offset: -5, pos: { lat: 43.6532, log: -79.3832 } },
				{ name: 'Vancouver', offset: -8, pos: { lat: 49.2827, log: -123.1207 } },
				{ name: 'Edmonton', offset: -7, pos: { lat: 53.5461, log: -113.4938 } },
				{ name: 'Winnipeg', offset: -6, pos: { lat: 49.8951, log: -97.1384 } },
				{ name: 'Yellowknife', offset: -7, pos: { lat: 62.4540, log: -114.3718 } },
				{ name: 'Iqaluit', offset: -5, pos: { lat: 63.7467, log: -68.5170 } }
			]
		},
		{
			name: 'Brasil',
			languages: ['Portuguese'],
			region: { name: 'South America', code: 'SA' },
			priority: 1,
			phoneCode: 55,
			timezones: [
				{ name: 'Sao Paulo', offset: -3, pos: { lat: -23.5505, log: -46.6333 } },
				{ name: 'Rio de Janeiro', offset: -3, pos: { lat: -22.9068, log: -43.1729 } },
				{ name: 'Manaus', offset: -4, pos: { lat: -3.1190, log: -60.0217 } },
				{ name: 'Porto Alegre', offset: -3, pos: { lat: -30.0346, log: -51.2177 } },
				{ name: 'Fortaleza', offset: -3, pos: { lat: -3.7319, log: -38.5267 } },
				{ name: 'Belem', offset: -3, pos: { lat: -1.4558, log: -48.4902 } }
			]
		},
		{
			name: 'Argentina',
			languages: ['Spanish'],
			region: { name: 'South America', code: 'SA' },
			priority: 1,
			phoneCode: 54,
			timezones: [{ name: 'Buenos Aires', offset: -3, pos: { lat: -34.6037, log: -58.3816 } }]
		}
	]
	const type = JsonLight.type(data)
	console.log(type)

	const compressed = JsonLight.compress(data, { type, mapping: true })
	console.log(JSON.stringify(compressed))

	const decompressed = JsonLight.decompress(compressed, { type })
	console.log(JSON.stringify(decompressed))
})()
