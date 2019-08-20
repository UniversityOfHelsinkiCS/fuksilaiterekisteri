module.exports = {
  development: {
    database_url: process.env.DATABASE_URL,
    dialect: 'postgres',
    define: {
      underscored: true,
    },
  },
  production: {
    database_url: process.env.DATABASE_URL,
    dialect: 'postgres',
    define: {
      underscored: true,
    },
  },
}
