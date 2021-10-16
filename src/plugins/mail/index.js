const MailHandler = require('./handler')

module.exports = {
  name: 'mail',
  version: '1.0.0',
  register: async (server, { consumerService, mailService }) => {
    const mailHandler = new MailHandler(consumerService, mailService)
  }
}
