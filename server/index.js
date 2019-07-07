const {
  pgUser,
  pgHost,
  pgPassword,
  pgDatabase,
  pgPort,
  redisHost,
  redisPort
} = require('./keys');

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

// redis client
const redis = require('redis');
const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// express route handlers
app.get('/', (req, res) => {
  res.send('Hello there :D');
});

app.get('/values/everything', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values');

  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const index = req.body.index;

  if (+index > 40) {
    return res.status(422).send('index too high');
  }

  redisClient.hset('values', index, 'Nothing yet :/');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true });
});

app.listen(5000, () => {
  console.log('listening...');
});
