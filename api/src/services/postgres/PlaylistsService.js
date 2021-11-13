const Boom = require('@hapi/boom')

const { Pool } = require('pg')
const { nanoid } = require('nanoid')

class PlaylistsService {
  constructor (collaborationService, cacheService) {
    this.pool = new Pool()
    this.collaborationService = collaborationService
    this.cacheService = cacheService
  }

  async addPlaylist (name, owner) {
    const id = `playlist-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    }

    const result = await this.pool.query(query)

    if (!result.rowCount) {
      throw Boom.badRequest('Playlist gagal ditambahkan')
    }
    return result.rows[0].id
  }

  async getPlaylists (owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username FROM playlists p
      LEFT JOIN collaborations c ON c.playlist_id = p.id
      INNER JOIN users u ON p.owner = u.id
      WHERE u.id = $1 OR c.user_id = $1`,
      values: [owner]
    }
    const result = await this.pool.query(query)
    return result.rows
  }

  async addPlaylistSong (playlistId, songId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId)
    const id = `playlistsongs-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }

    const result = await this.pool.query(query)
    if (!result.rowCount) {
      throw Boom.badRequest('Lagu gagal ditambahkan')
    }
    await this.cacheService.delete(`playlistsongs:${playlistId}`)
    return result.rows[0].id
  }

  async getPlaylistSongs (id, userId) {
    await this.verifyPlaylistAccess(id, userId)
    try {
      const result = await this.cacheService.get(`playlistsongs:${id}`)
      return JSON.parse(result)
    } catch (error) {
      const query = {
        text: `SELECT s.id, s.title, s.performer FROM playlistsongs ps
        INNER JOIN playlists p ON p.id = ps.playlist_id
        LEFT JOIN collaborations c ON c.playlist_id = p.id
        INNER JOIN songs s ON s.id = ps.song_id
        WHERE p.id = $1 AND (p.owner = $2 OR c.user_id = $2)`,
        values: [id, userId]
      }

      const result = await this.pool.query(query)

      await this.cacheService.set(
        `playlistsongs:${id}`,
        JSON.stringify(result.rows)
      )
      return result.rows
    }
  }

  async deletePlaylist (playlistId, userId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING id',
      values: [playlistId, userId]
    }

    const result = await this.pool.query(query)
    if (!result.rowCount) {
      throw Boom.forbidden('Playlist gagal dihapus')
    }
    await this.cacheService.delete(`playlistsongs:${playlistId}`)
  }

  async deletePlaylistSong (playlistId, userId, songId) {
    await this.verifyPlaylistAccess(playlistId, userId)
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId]
    }

    const result = await this.pool.query(query)
    if (!result.rowCount) {
      throw Boom.badRequest('Lagu gagal dihapus dari playlist')
    }
  }

  async verifyPlaylistOwner (id, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id]
    }
    const result = await this.pool.query(query)
    if (!result.rowCount) {
      throw Boom.notFound('Playlist tidak ditemukan')
    }
    const playlist = result.rows[0]
    if (playlist.owner !== owner) {
      throw Boom.forbidden('Anda tidak berhak mengakses resource ini')
    }
  }

  async verifyPlaylistAccess (playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId)
    } catch (error) {
      if (error.output.statusCode === 404) throw error
      try {
        await this.collaborationService.verifyCollaborator(playlistId, userId)
      } catch {
        throw error
      }
    }
  }
}

module.exports = PlaylistsService
