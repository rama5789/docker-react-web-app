const keys = require('./keys');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const redis = require('redis');

// Postgres Client Setup --->
const pgClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  database: keys.pgDatabase,
  user: keys.pgUser,
  password: keys.pgPassword,
});
pgClient.on('error', () => console.log('Lost PG connection'));
pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch((err) => console.log(err));

// Redis Client Setup --->
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000, // every 1 sec
});
const redisPublisher = redisClient.duplicate();

// Express Server Setup --->
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Express route handlers
app.get('/', (_, res) => {
  res.send('Hi, Server');
});

app.get('/values/all', async (_, res) => {
  // fetch all "fibIndexes" from PG
  const values = await pgClient.query('SELECT * from values');

  res.send(values.rows);
});

app.get('/values/current', async (_, res) => {
  // fetch all "fibIndexes along with fibValues" from Redis
  redisClient.hgetall('values', (err, values) => {
    if (err) return res.status(500).send(err);

    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const fibIndex = req.body.index;

  if (parseInt(fibIndex) > 40) {
    return res.status(422).send('Index too high');
  }

  // add "fibIndex with dummy fibValue" to Redis
  redisClient.hset('values', fibIndex, 'Nothing yet!');
  redisPublisher.publish('FIB_IDX_INSERT', fibIndex);
  // add "fibIndex" to PG
  pgClient.query('INSERT INTO values(number) VALUES($1)', [fibIndex]);

  res.send({ working: true });
});

app.listen(5000, () => {
  console.log('Listening on port 5000!');
});
