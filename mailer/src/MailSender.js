const nodemailer = require('nodemailer')

class MailSender {
  constructor () {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIl_SMTP || 'smtp.gmail.com',
      port: process.env.MAIL_PORT || 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD
      }
    })
  }

  sendEmail (to, subject, content) {
    const message = {
      from: 'Openmusic',
      to,
      subject,
      text: 'Terlampir hasil dari ekspor playlist',
      attachments: [
        {
          filename: 'songs.json',
          content
        }
      ]
    }

    return this.transporter.sendMail(message)
  }
}

module.exports = MailSender
