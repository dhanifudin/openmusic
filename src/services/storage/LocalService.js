const fs = require('fs')

class LocalService {
  constructor () {
    this.folder = process.env.UPLOAD_PATH

    if (!fs.existsSync(this.folder)) {
      fs.mkdirSync(this.folder, { recursive: true })
    }
  }

  writeFile (file, meta) {
    const filename = +new Date() + meta.filename
    const path = `${this.folder}/${filename}`

    const fileStream = fs.createWriteStream(path)

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error))
      file.pipe(fileStream)
      file.on('end', () => resolve(filename))
    })
  }
}

module.exports = LocalService
