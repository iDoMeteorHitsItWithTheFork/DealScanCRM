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
db.Financing = db.sequelize.import('../api/financing/financing.model');
db.Document = db.sequelize.import('../api/document/document.model');
db.Rebate = db.sequelize.import('../api/rebate/rebate.model');
db.Trade = db.sequelize.import('../api/trade/trade.model');
db.Deal = db.sequelize.import('../api/deal/deal.model');
db.Vehicle = db.sequelize.import('../api/vehicle/vehicle.model');
db.Upload = db.sequelize.import('../api/upload/upload.model');
db.Image = db.sequelize.import('../api/image/image.model');
db.Note = db.sequelize.import('../api/note/note.model');


db.Dealership = db.sequelize.import('../api/dealership/dealership.model');
db.Team = db.sequelize.import('../api/team/team.model');
db.User = db.sequelize.import('../api/user/user.model');
db.Customer = db.sequelize.import('../api/customer/customer.model');

db.Note.belongsTo(db.User, { as:'Creator', foreignKey: 'creatorID'});
db.Note.belongsTo(db.Customer, {as: 'CustomerNotes', foreignKey:'customerID'});

db.Image.belongsTo(db.User, {as: 'Uploader', foreignKey:'uploaderID'});
db.Image.belongsTo(db.Customer, {as:'CustomerImages', foreignKey:'customerID'});

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

db.Deal.belongsTo(db.Dealership, {through:'Purchases', foreignKey:'dealershipID'});
db.Deal.belongsTo(db.User, {as:'SaleRep', through: 'Purchases', foreignKey: 'saleRepID'});
db.Deal.belongsTo(db.Customer, {as:'Buyer', through:'Purchases', foreignKey:'buyerID'});
db.Deal.belongsTo(db.Vehicle, {as:'Purchase', through: 'Purchases', foreignKey: 'vehicleID'});

db.Deal.belongsToMany(db.Customer, {as:'CoBuyers', through: 'CoSigners', foreignKey: 'CoBuyerID'});
db.Customer.belongsToMany(db.Deal, {as:'CoSignedDeals' , through:'CoSigners', foreignKey:'dealID'});


db.Financing.belongsTo(db.Deal, {foreignKey:'dealID'});
db.Trade.belongsTo(db.Deal, {foreignKey:'dealID'});
db.Rebate.belongsTo(db.Deal, {foreignKey:'dealID'});
db.Document.belongsTo(db.Deal, {foreignKey:'dealID'});



export default db;
