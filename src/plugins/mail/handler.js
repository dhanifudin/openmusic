class MailHandler {
  constructor (consumerService, mailService) {
    this.consumerService = consumerService
    this.mailService = mailService

    this.consume()
  }

  async consume () {
    console.log('function consume was called')
    this.consumerService.consume('export:playlist', (message) => {
      console.log(message)
      this.mailService.send(message.to, 'OpenMusic Export', JSON.stringify(message.songs))
    })
  }
}

module.exports = MailHandler
