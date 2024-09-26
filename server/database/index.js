require('../../environment.js')

const pgp = require('pg-promise')

const db = pgp()

const client = db({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'development' ? false : {
    rejectUnauthorized: false,
  }
})

module.exports = client
