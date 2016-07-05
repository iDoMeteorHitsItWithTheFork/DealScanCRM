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
      host:'DealScanCRM.db.3266541.hostedresource.com', //DealScanCRM.db.3266541.hostedresource.com
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
