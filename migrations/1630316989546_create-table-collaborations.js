/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true
    },
    user_id: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true
    }
  })
  pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists',
      onDelete: 'CASCADE'
    }
  })

  pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users.id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users',
      onDelete: 'CASCADE'
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('collaborations')
}
