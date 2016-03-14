'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions
  sequelize: {
    database: 'dealscancrm',
    username: 'dealscancrm',
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
        timestamps: false
      }
    }
  },

  // Seed database on startup
  seedDB: true

};
