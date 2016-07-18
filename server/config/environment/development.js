'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions
  sequelize: {
    database: 'DealScanCRM',
    username: 'DealScanCRM',
    password: 'Baiser12!',
    options: {
      host:'97.74.31.7',
      dialect: 'mysql',
      pool: {
          max: 5,
          min: 0,
          idle: 10000
      },
      logging: false,
      define: {
        timestamps: true,
      }
    }
  },

  // Seed database on startup
  seedDB: false

};
