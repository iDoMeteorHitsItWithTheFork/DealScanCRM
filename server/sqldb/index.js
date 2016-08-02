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



// db.SocialMedia = db.sequelize.import('../api/socialMedia/socialMedia.model');
db.Dealership = db.sequelize.import('../api/dealership/dealership.model');
db.Team = db.sequelize.import('../api/team/team.model');
db.User = db.sequelize.import('../api/user/user.model');
db.Customer = db.sequelize.import('../api/customer/customer.model');
db.Vehicle = db.sequelize.import('../api/vehicle/vehicle.model');
db.Trade = db.sequelize.import('../api/trade/trade.model');
db.Document = db.sequelize.import('../api/document/document.model');
db.Rebate = db.sequelize.import('../api/rebate/rebate.model');
db.Financing = db.sequelize.import('../api/financing/financing.model');
db.Upload = db.sequelize.import('../api/upload/upload.model');
db.Image = db.sequelize.import('../api/image/image.model');
db.Note = db.sequelize.import('../api/note/note.model');
db.Deal = db.sequelize.import('../api/deal/deal.model');
db.Watchlist = db.sequelize.import('../api/watchlist/watchlist.model');
db.Keyword = db.sequelize.import('../api/watchlist/watchlist.keyword.model');
db.Source = db.sequelize.import('../api/watchlist/watchlist.source.model');
db.Monitoring = db.sequelize.import('../api/socialMedia/socialMedia.monitoring.model');
db.Lead = db.sequelize.import('../api/lead/lead.model');
db.Event = db.sequelize.import('../api/event/event.model');
db.Participants = db.sequelize.import('../api/event/event.participants.model');
db.NoteActivities = db.sequelize.import('../api/note/note.activity.model');





db.Note.belongsTo(db.User, { as:'Creator', foreignKey: 'creatorID'});
db.User.hasMany(db.Note, {foreignKey: 'creatorID'});
db.Image.belongsTo(db.User, {as: 'Uploader', foreignKey:'uploaderID'});
db.Image.belongsTo(db.Customer, {as:'CustomerImages', foreignKey:'customerID'});

db.Customer.belongsToMany(db.Note, {
  through: {
    model: db.NoteActivities,
    unique: false,
    scope: {
      notable: 'customer'
    }
  },
  foreignKey: 'subjectID',
  constraints: false
});

db.Note.belongsToMany(db.Customer, {
  through: {
    model: db.NoteActivities,
    unique: false
  },
  foreignKey: 'noteID',
  constraints: false
});

db.Lead.belongsToMany(db.Note, {
  through: {
    model: db.NoteActivities,
    unique: false,
    scope: {
      notable: 'lead'
    }
  },
  foreignKey: 'subjectID',
  constraints: false
});

db.Note.belongsToMany(db.Lead, {
  through: {
    model: db.NoteActivities,
    unique: false
  },
  foreignKey: 'noteID',
  constraints: false
});


db.Team.belongsTo(db.Dealership, {foreignKey:'dealershipID'});
db.Dealership.hasMany(db.Team, {foreignKey:'dealershipID'});

db.User.belongsToMany(db.Dealership, {through:'Owns', foreignKey:'ownerID'});
db.Dealership.belongsToMany(db.User, {as:'Owners', through:'Owns', foreignKey:'dealershipID'});

db.User.belongsToMany(db.Dealership, {as:'ManagesDealerships', through:'DealershipManagers', foreignKey:'generalManagerID'});
db.Dealership.belongsToMany(db.User, {as: 'GeneralManagers', through:'DealershipManagers', foreignKey:'dealershipID'});

db.Dealership.belongsToMany(db.User, {as: 'Employees', through: 'Employment', foreignKey: 'employerID'});
db.User.belongsToMany(db.Dealership, {as:'Employer', through: 'Employment', foreignKey: 'employeeID'});

db.User.belongsToMany(db.Team, {as:'MyTeams', through:'TeamMemberships', foreignKey:'memberID'});
db.Team.belongsToMany(db.User, {as:'TeamMembers', through:'TeamMemberships', foreignKey: 'teamID'});

db.Team.belongsToMany(db.User, {as: 'TeamManagers', through: 'Managers', foreignKey:'teamID'});
db.User.belongsToMany(db.Team, {as: 'ManagesTeams', through: 'Managers', foreignKey:'teamManagerID'});

db.Deal.belongsTo(db.Dealership, {through:'Purchases', foreignKey:'dealershipID'});
db.Dealership.hasMany(db.Deal, {foreignKey:'dealershipID'});
db.Deal.belongsTo(db.User, {as:'SaleRep', through: 'Purchases', foreignKey: 'saleRepID'});
db.User.hasMany(db.Deal, {foreignKey: 'saleRepID'});
db.Deal.belongsTo(db.Customer, {as:'Buyer', through:'Purchases', foreignKey:'buyerID'});
db.Customer.hasMany(db.Deal, {foreignKey: 'buyerID'});
db.Deal.belongsTo(db.Vehicle, {as:'Purchase', through: 'Purchases', foreignKey: 'vehicleID'});
db.Deal.belongsToMany(db.Customer, {as:'CoBuyers', through: 'CoSigners', foreignKey: 'coBuyerID'});
db.Customer.belongsToMany(db.Deal, {as:'CoSignedDeals' , through:'CoSigners', foreignKey:'dealID'});

db.Financing.belongsTo(db.Deal, {foreignKey:'dealID'});
db.Deal.hasOne(db.Financing, {foreignKey:'dealID'});

db.Trade.belongsTo(db.Deal, {foreignKey:'dealID'});
db.Deal.hasMany(db.Trade, {foreignKey:'dealID'});

db.Rebate.belongsTo(db.Deal, {foreignKey:'dealID'});
db.Deal.hasMany(db.Rebate, {foreignKey:'dealID'});

db.Document.belongsTo(db.Deal, {foreignKey:'dealID'});
db.Deal.hasMany(db.Document, {foreignKey:'dealID'});

db.Watchlist.belongsTo(db.Dealership, {foreignKey: 'dealershipID'});
db.Watchlist.belongsTo(db.User, {as:'ListOwner', foreignKey: 'ownerID'});

db.Dealership.hasMany(db.Watchlist,{foreignKey:'dealershipID'});
db.User.hasMany(db.Watchlist, {as:'UserWatchlists', foreignKey:'ownerID'});

db.Keyword.belongsTo(db.Watchlist, {foreignKey: 'watchlistID'});
db.Watchlist.hasMany(db.Keyword, {foreignKey:'watchlistID'});

db.Source.belongsToMany(db.Watchlist, {as:'MonitoringWatchlists', through:db.Monitoring, foreignKey:'sourceID'});
db.Watchlist.belongsToMany(db.Source, {as:'MonitoringSources', through:db.Monitoring, foreignKey:'watchlistID'});

db.Lead.belongsTo(db.Dealership, {foreignKey:'dealershipID'});
db.Dealership.hasMany(db.Lead, {foreignKey:'dealershipID'});

db.Lead.belongsTo(db.User, {as:'Creator', foreignKey:'creatorID'});
db.User.hasMany(db.Lead, {foreignKey: 'creatorID'});

db.Event.belongsTo(db.User, {as: 'Host', foreignKey:'hostID'});
db.User.hasMany(db.Event, {foreignKey: 'hostID'});

db.User.belongsToMany(db.Event, {
  through: {
    model: db.Participants,
    unique: false,
    scope: {
      attendable: 'user'
    }
  },
  foreignKey: 'participantID',
  constraints: false
});

db.Event.belongsToMany(db.User, {
  through: {
    model: db.Participants,
    unique: false
  },
  foreignKey: 'eventID',
  constraints: false
});

db.Customer.belongsToMany(db.Event, {
  through: {
    model: db.Participants,
    unique: false,
    scope: {
      attendable: 'customer'
    }
  },
  foreignKey: 'participantID',
  constraints: false
});

db.Event.belongsToMany(db.Customer, {
  through: {
    model: db.Participants,
    unique: false
  },
  foreignKey: 'eventID',
  constraints: false
});

db.Lead.belongsToMany(db.Event, {
  through: {
    model: db.Participants,
    unique: false,
    scope: {
      attendable: 'lead'
    }
  },
  foreignKey: 'participantID',
  constraints: false
});

db.Event.belongsToMany(db.Lead, {
  through: {
    model: db.Participants,
    unique: false
  },
  foreignKey: 'eventID',
  constraints: false
});

export default db;
