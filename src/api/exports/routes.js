const ExportPlaylistPayloadSchema = require('../../validator/exports/schema')
const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{playlistId}',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'openmusic.jwt',
      validate: {
        payload: ExportPlaylistPayloadSchema
      }
    }
  }
]

module.exports = routes
