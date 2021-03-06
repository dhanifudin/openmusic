const { UserPayloadSchema } = require('../../validator/users/schema')

const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
    options: {
      validate: {
        payload: UserPayloadSchema
      }
    }
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler
  }
]

module.exports = routes
