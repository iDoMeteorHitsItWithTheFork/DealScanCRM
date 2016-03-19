/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';


var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.database,
                           config.sequelize.username,
                           config.sequelize.password,
                           config.sequelize.options)
};


// Insert models below
db.Thing = db.sequelize.import('../api/thing/thing.model');

db.Dealership = db.sequelize.import('../api/dealership/dealership.model');
db.Team = db.sequelize.import('../api/team/team.model');
db.User = db.sequelize.import('../api/user/user.model');

db.Team.belongsTo(db.Dealership);
db.Dealership.hasMany(db.Team);
db.User.belongsToMany(db.Dealership, {through:'Owns'});
db.Dealership.belongsToMany(db.User, {as:'owners', through:'Owns'});
db.User.belongsToMany(db.Team, {as:'userTeams', through:'membership'});
db.Team.belongsToMany(db.User, {as:'teamMembers', through:'membership'});



export default db;
