class Listener {
  constructor (mailSender) {
    this.mailSender = mailSender
  }

  async listen (message) {
    try {
      const { playlistId, to, songs } = JSON.parse(message.content.toString())
      const subject = `Openmusic Export ${playlistId}`
      const result = await this.mailSender.sendEmail(
        to,
        subject,
        JSON.stringify(songs)
      )
      if (result) {
        console.log(`Export playlist: ${playlistId} to: ${to} has been sent`)
      }
    } catch (error) {
      console.error(error)
    }
  }
}
