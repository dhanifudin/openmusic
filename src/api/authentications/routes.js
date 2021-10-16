const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema
} = require('../../validator/authentications/schema')

const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthenticationHandler,
    options: {
      validate: {
        payload: PostAuthenticationPayloadSchema
      }
    }
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuthenticationHandler,
    options: {
      validate: {
        payload: PutAuthenticationPayloadSchema
      }
    }
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthenticationHandler,
    options: {
      validate: {
        payload: DeleteAuthenticationPayloadSchema
      }
    }
  }
]

module.exports = routes
