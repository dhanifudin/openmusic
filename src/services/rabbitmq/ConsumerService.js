const amqp = require('amqplib')

const ConsumerService = {
  consume: async (queue, handler) => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER)
    const channel = await connection.createChannel()
    await channel.assertQueue(queue, { durable: true })
    await channel.consume(queue, async (message) => {
      channel.ack(message)
      handler(JSON.parse(message.content.toString()))
    })

    const cleanup = () => {
      setTimeout(() => {
        console.log('Closing mq connection')
        connection.close()
      }, 1000)
    }

    process.on('SIGINT', cleanup)
    process.on('SIGTERM', cleanup)
  }
}

module.exports = ConsumerService
