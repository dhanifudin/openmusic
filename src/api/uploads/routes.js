const Path = require('path')

const routes = (handler) => [
  {
    method: 'POST',
    path: '/upload/pictures',
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        maxBytes: 500 * 1000,
        multipart: true,
        output: 'stream'
      }
    }
  },
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: './upload'
      }
    }
  }
]

module.exports = routes
