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




db.Team.belongsTo(db.Dealership, {foreignKey:'dealershipID'});

db.User.belongsToMany(db.Dealership, {as:'Organizations', through: 'Employs', foreignKey: 'employeeID'});
db.Dealership.belongsToMany(db.User, {as: 'Employees', through: 'Employs', foreignKey: 'organizationID'});

db.User.belongsToMany(db.Dealership, {through:'Owns', foreignKey:'ownerID'});
db.Dealership.belongsToMany(db.User, {as:'Owners', through:'Owns', foreignKey:'dealershipID'});

db.User.belongsToMany(db.Dealership, {as:'ManagesDealerships', through:'DealershipManagers', foreignKey:'generalManagerID'});
db.Dealership.belongsToMany(db.User, {as: 'GeneralManagers', through:'DealershipManagers', foreignKey:'dealershipID'});

db.User.belongsToMany(db.Team, {as:'MyTeams', through:'TeamMemberships', foreignKey:'memberID'});
db.Team.belongsToMany(db.User, {as:'TeamMembers', through:'TeamMemberships', foreignKey: 'teamID'});

db.Team.belongsToMany(db.User, {as: 'TeamManagers', through: 'Managers', foreignKey:'teamID'});
db.User.belongsToMany(db.Team, {as: 'ManagesTeams', through: 'Managers', foreignKey:'teamManagerID'});



export default db;
