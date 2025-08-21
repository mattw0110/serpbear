module.exports = {
  production: {
    username: process.env.USER_NAME ? process.env.USER_NAME : process.env.USER,
    password: process.env.PASSWORD,
    database: 'sequelize',
    host: 'database',
    port: 3306,
    dialect: 'sqlite',
    storage: process.env.DATABASE_PATH || '/app/data/database.sqlite',
    dialectOptions: {
      bigNumberStrings: true,
    },
    logging: false,
  },
};
