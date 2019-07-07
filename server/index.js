const { pgUser, pgHost, pgPassword, pgDatabase, pgPort } = require('./keys');

// express
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// postgres Client
const { Pool } = require('pg');
const pgClient = new Pool({
  user: pgUser,
  host: pgHost,
  database: pgDatabase,
  password: pgPassword,
  port: pgPort
});
pgClient.on('error', () => console.log('PG connection lost!'));

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err));
