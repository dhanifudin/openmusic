require('dotenv').config();

const Boom = require('@hapi/boom');
const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');

const init = async () => {
  const songsService = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.ext('onPreResponse', (request) => {
    const { response } = request;

    if (Boom.isBoom(response)) {
      response.output.payload.status = 'fail';
    }

    return response.continue || response;
  });

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
