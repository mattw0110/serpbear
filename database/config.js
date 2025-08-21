module.exports = {
  production: {
    dialect: 'sqlite',
    storage: process.env.RAILWAY_VOLUME_MOUNT_PATH 
      ? `${process.env.RAILWAY_VOLUME_MOUNT_PATH}/database.sqlite`
      : process.env.DATABASE_PATH || './data/database.sqlite',
    logging: false,
  },
};
