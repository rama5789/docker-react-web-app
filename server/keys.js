module.exports = {
  redisHost: process.env.REDIS_HOST, // localhost
  redisPort: process.env.REDIS_PORT, // 6379
  pgHost: process.env.POSTGRES_HOST, // localhost
  pgPort: process.env.POSTGRES_PORT, // 5432
  pgDatabase: process.env.POSTGRES_DB, // postgres_db
  pgUser: process.env.POSTGRES_USER, // postgres_user
  pgPassword: process.env.POSTGRES_PASSWORD, // postgres_password
};
