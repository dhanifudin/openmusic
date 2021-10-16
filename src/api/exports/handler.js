class ExportsHandler {
  constructor (playlistsService, producerService) {
    this.playlistsService = playlistsService
    this.producerService = producerService

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this)
  }

  async postExportPlaylistHandler (request, h) {
    const { id: userId } = request.auth.credentials
    const { playlistId } = request.params
    const { targetEmail } = request.payload
    const songs = await this.playlistsService.getPlaylistSongs(
      playlistId,
      userId
    )
    const message = { userId, to: targetEmail, songs }

    await this.producerService.sendMessage(
      'export:playlist',
      JSON.stringify(message)
    )

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses'
    })
    response.code(201)
    return response
  }
}

module.exports = ExportsHandler
