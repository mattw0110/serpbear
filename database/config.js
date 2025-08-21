module.exports = {
  production: {
    dialect: 'sqlite',
    storage: process.env.RAILWAY_VOLUME_MOUNT_PATH
      ? `${process.env.RAILWAY_VOLUME_MOUNT_PATH}/database.sqlite`
      : '/app/data/database.sqlite',
    logging: false,
  },
};
