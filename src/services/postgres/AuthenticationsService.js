const Boom = require('@hapi/boom');
const { Pool } = require('pg');

class AuthenticationService {
  constructor() {
    this.pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT into authentications VALUES($1)',
      values: [token],
    };

    await this.pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token from authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw Boom.badRequest('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);

    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.pool.query(query);
  }
}

module.exports = AuthenticationService;
