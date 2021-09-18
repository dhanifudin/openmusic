/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('authentications', {
    token: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.createIndex('authentications', 'token');
};

exports.down = (pgm) => {
  pgm.dropTable('authentications');
};
