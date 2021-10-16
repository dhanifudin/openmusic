const {
  CollaborationPayloadSchema
} = require('../../validator/collaborations/schema')

const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationHandler,
    options: {
      auth: 'openmusic.jwt',
      validate: {
        payload: CollaborationPayloadSchema
      }
    }
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: 'openmusic.jwt',
      validate: {
        payload: CollaborationPayloadSchema
      }
    }
  }
]

module.exports = routes
