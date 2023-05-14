import fs from 'fs'
import path from 'path'

class Helper {
// public getJson (value: any): any {
// if (value === null || value === undefined) {
// return false
// }
// if (typeof value === 'string') {
// if (value.indexOf('{') > -1 || value.indexOf('[') > -1) {
// try {
// return JSON.parse(value)
// } catch {
// return null
// }
// } else {
// return null
// }
// }
// if (typeof value === 'object') {
// return value
// } else {
// return null
// }
// }

	public async exists (sourcePath:string):Promise<boolean> {
		const fullPath = this.resolve(sourcePath)
		return new Promise<boolean>((resolve) => {
			fs.access(fullPath, (err) => {
				if (err) {
					resolve(false)
				} else {
					resolve(true)
				}
			})
		})
	}

	public resolve (source:string):string {
		const _source = source.trim()
		if (_source.startsWith('.')) {
			return path.join(process.cwd(), source)
		}
		if (_source.startsWith('~')) {
			return _source.replace('~', process.env.HOME as string)
		}
		return source
	}

	public async read (filePath: string): Promise<string|null> {
		const fullPath = this.resolve(filePath)
		if (!await this.exists(fullPath)) {
			return null
		}
		return new Promise<string>((resolve, reject) => {
			fs.readFile(fullPath, (err, data) => err ? reject(err) : resolve(data.toString('utf8')))
		})
	}

	public async create (sourcePath:string):Promise<void> {
		const fullPath = this.resolve(sourcePath)
		if (await this.exists(fullPath)) { return }
		return new Promise<void>((resolve, reject) => {
			fs.mkdir(fullPath, { recursive: true }, err => err ? reject(err) : resolve())
		})
	}

	public async write (sourcePath: string, content: string): Promise<void> {
		const filePath = this.resolve(sourcePath)
		const dir = path.dirname(filePath)
		if (!await this.exists(dir)) {
			await this.create(dir)
		}
		return new Promise<void>((resolve, reject) => {
			fs.writeFile(filePath, content, { encoding: 'utf8' }, err => err ? reject(err) : resolve())
		})
	}

	public async isDirectory (sourcePath:string) {
		if (await this.exists(sourcePath)) {
			return fs.lstatSync(sourcePath).isDirectory()
		}
		return path.parse(sourcePath).ext.toLocaleLowerCase() === ''
	}
}
export const helper = new Helper()
