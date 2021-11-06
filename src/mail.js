require('dotenv').config()

const consumerService = require('./services/rabbitmq/ConsumerService')
const mailService = require('./services/mail/MailService')

consumerService.consume('export:playlist', (message) => {
  const { to, playlistId, songs } = message
  console.log(`Send email to ${to} with playlist ${playlistId}`)
  mailService.send(to, `OpenMusic Export ${playlistId}`, JSON.stringify(songs))
})
