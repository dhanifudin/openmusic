require('dotenv').config()

const amqp = require('amqplib')
const MailSender = require('./MailSender')
const Listener = require('./listener')

const QUEUE = 'export:playlists'

const init = async () => {
  const mailSender = new MailSender()
  const listener = new Listener(mailSender)

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER)
  const channel = await connection.createChannel()

  await channel.assertQueue(QUEUE, {
    durable: true
  })

  channel.consume(QUEUE, listener.listen)
}

init()
