/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlistsongs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'playlistsongs',
    'fk_playlistsongs.playlist_id_playlists.id',
    {
      foreignKeys: {
        columns: 'playlist_id',
        references: 'playlists',
        onDelete: 'CASCADE',
      },
    },
  );
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.song_id_songs.id', {
    foreignKeys: {
      columns: 'song_id',
      references: 'songs',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlistsongs');
};
