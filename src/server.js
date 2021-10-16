require('dotenv').config()

const Path = require('path')

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const Inert = require('@hapi/inert')
const Boom = require('@hapi/boom')

const songs = require('./api/songs')
const SongsService = require('./services/postgres/SongsService')

const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService')

const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/AuthenticationsService')
const TokenManager = require('./tokenize/TokenManager')

const playlists = require('./api/playlists')
const PlaylistsService = require('./services/postgres/PlaylistsService')

const collaborations = require('./api/collaborations')
const CollaborationsService = require('./services/postgres/CollaborationsService')

const _exports = require('./api/exports')
const ProducerService = require('./services/rabbitmq/ProducerService')
const MailService = require('./services/mail/MailService')

const uploads = require('./api/uploads')
const LocalService = require('./services/storage/LocalService')
const UploadsValidator = require('./validator/uploads')

const CacheService = require('./services/redis/CacheService')

const mail = require('./plugins/mail')
const ConsumerService = require('./services/rabbitmq/ConsumerService')

const init = async () => {
  const mailService = new MailService()
  const cacheService = new CacheService()
  const songsService = new SongsService()
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()
  const collaborationsService = new CollaborationsService()
  const playlistsService = new PlaylistsService(
    collaborationsService,
    cacheService
  )
  const storageService = new LocalService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      files: {
        relativeTo: Path.join(__dirname, '../public')
      },
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: Jwt
    },
    {
      plugin: Inert
    }
  ])

  server.auth.strategy('openmusic.jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService
      }
    },
    {
      plugin: users,
      options: {
        service: usersService
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager
      }
    },
    {
      plugin: playlists,
      options: {
        playlistsService
      }
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService
      }
    },
    {
      plugin: _exports,
      options: {
        playlistsService,
        producerService: ProducerService
      }
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator
      }
    },
    {
      plugin: mail,
      options: {
        consumerService: ConsumerService,
        mailService
      }
    }
  ])

  server.ext('onPreResponse', (request) => {
    const { response } = request

    if (Boom.isBoom(response)) {
      response.output.payload.status = 'fail'
    }

    return response.continue || response
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
