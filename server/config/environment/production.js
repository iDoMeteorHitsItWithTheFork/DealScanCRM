'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:     process.env.OPENSHIFT_NODEJS_IP ||
          process.env.IP ||
          undefined,

  // Server port
  port:   process.env.OPENSHIFT_NODEJS_PORT ||
          process.env.PORT ||
          8080,

  sequelize: {
  // Sequelize connection opions
  sequelize: {
    database: 'DealScanCRM',
    username: 'DealScanCRM',
    password: 'Baiser12!',
    options: {
      host:'dealscancrm.db.3266541.hostedresource.com',
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
  }
};
