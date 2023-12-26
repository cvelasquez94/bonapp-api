const {
  database: { user: username, password, db: database, host, dialect, dialectOptions }
} = require('./variables')

module.exports = {
  username,
  password,
  database,
  host,
  dialect,
  dialectOptions
}
