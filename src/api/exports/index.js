const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { playlistsService, producerService }) => {
    const exportsHandler = new ExportsHandler(
      playlistsService,
      producerService
    );
    server.route(routes(exportsHandler));
  },
};
