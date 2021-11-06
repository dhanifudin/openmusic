const nodemailer = require('nodemailer')
const transport = nodemailer.createTransport({
  host: process.env.MAIL_SMTP,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD
  }
})
const sender = process.env.MAIL_SENDER

const MailService = {
  send: async (to, subject, text) => {
    const mailOptions = {
      from: sender,
      to,
      subject,
      text
    }

    await transport.sendMail(mailOptions)
  }
}

module.exports = MailService
