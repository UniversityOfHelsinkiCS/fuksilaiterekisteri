module.exports = {
  development: {
    database_url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    define: {
      underscored: true,
    },
  },
  production: {
    database_url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    define: {
      underscored: true,
    },
  },
}
