const nodemailer = require('nodemailer')

class MailService {
  constructor () {
    this.transport = nodemailer.createTransport({
      host: process.env.MAIL_SMTP,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD
      }
    })
    this.sender = process.env.MAIL_SENDER
  }

  async send (to, subject, text) {
    const mailOptions = {
      from: this.sender,
      to,
      subject,
      text
    }

    await this.transport.sendMail(mailOptions)
  }
}

module.exports = MailService
