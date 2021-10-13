const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { playlistsService, cacheService }) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService,
      cacheService
    );
    server.route(routes(playlistsHandler));
  },
};
