const pg = require('pg')
const dotenv = require('dotenv');

dotenv.config()

const postgresClient = new pg.Pool({
    connectionString: process.env.DB_CONNECTION_STRING
})

exports.postgresClient = postgresClient