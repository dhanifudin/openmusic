class PlaylistsHandler {
  constructor (playlistsService) {
    this.playlistsService = playlistsService

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this)
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this)
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this)
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this)
  }

  async postPlaylistHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { name } = request.payload

    const playlistId = await this.playlistsService.addPlaylist(
      name,
      credentialId
    )

    return h
      .response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId
        }
      })
      .code(201)
  }

  async getPlaylistsHandler (request) {
    const { id } = request.auth.credentials
    const playlists = await this.playlistsService.getPlaylists(id)
    return {
      status: 'success',
      data: {
        playlists
      }
    }
  }

  async postPlaylistSongHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { playlistId } = request.params
    const { songId } = request.payload

    await this.playlistsService.addPlaylistSong(
      playlistId,
      songId,
      credentialId
    )

    return h
      .response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist'
      })
      .code(201)
  }

  async getPlaylistSongsHandler (request) {
    const { id: credentialId } = request.auth.credentials
    const { playlistId } = request.params

    const songs = await this.playlistsService.getPlaylistSongs(
      playlistId,
      credentialId
    )

    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  async deletePlaylistHandler (request) {
    const { playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this.playlistsService.deletePlaylist(playlistId, credentialId)

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    }
  }

  async deletePlaylistSongHandler (request) {
    const { playlistId } = request.params
    const { id: credentialId } = request.auth.credentials
    const { songId } = request.payload

    await this.playlistsService.deletePlaylistSong(
      playlistId,
      credentialId,
      songId
    )

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist'
    }
  }
}

module.exports = PlaylistsHandler
