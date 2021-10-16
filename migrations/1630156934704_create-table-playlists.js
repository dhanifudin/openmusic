/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    name: {
      type: 'TEXT',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)'
    }
  })
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', {
    foreignKeys: { columns: 'owner', references: 'users', onDelete: 'CASCADE' }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('playlists')
}
