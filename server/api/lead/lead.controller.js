/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/leads              ->  index
 * POST    /api/leads              ->  create
 * GET     /api/leads/:id          ->  show
 * PUT     /api/leads/:id          ->  update
 * DELETE  /api/leads/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Lead} from '../../sqldb';
import {User} from '../../sqldb';
import {Dealership} from '../../sqldb';
import {Event} from '../../sqldb';
import {Note} from '../../sqldb';
import {NoteActivities} from '../../sqldb';
import {Participants} from '../../sqldb';
var moment = require('moment');
var Q = require('q');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.log(err);
    throw err;
    res.status(statusCode).send(err);
  };
}

// Gets a list of Leads
export function index(req, res) {
  if (!req.user) return res.status(500).send('Unable to authenticate request');
  var category = null;

  return User.find({
    where:{
      userID: req.user.userID
    },
    include: [
      {
        model: Dealership,
        as: 'Employer',
        required: true
      }
    ]
  }).then(function(user){


    var searchOptions = {
      dealershipID: user.Employer[0].token.dealerID
    }
    /*if (req.params.hasOwnProperty('category') && req.params.category && req.params.category.trim() != '')
      category = req.params.category;
    if (category) {
      switch (category.toLowerCase()) {
        case 'new':
          searchOptions.createdAt = {
            $gte: moment().startOf('day'),
            $lte: moment().endOf('day')
          };
          searchOptions.status = 'new';
          break;
        case 'working':
          searchOptions.status = 'working';
          break;
        case 'followup':
          searchOptions.createdAt = {
            $gt: moment().endOf('day')
          };
          searchOptions.status = 'new';
          break;
      }
    }
    console.log(searchOptions);*/
      return Lead.findAll({
        where:searchOptions,
        include: [
          {
            model: Note,
            include: [
              {
                model: User,
                as: 'Creator',
                attributes: ['firstName', 'lastName', 'userID', 'email', 'role']
              }
            ],
            through: NoteActivities,
            order: [['noteID', 'DESC']]
          },
          {
            model: Event,
            include: [
              {
                model: User,
                as: 'Host',
                attributes: ['firstName', 'lastName', 'userID', 'email', 'role']
              }
            ],
            through: Participants,
            order: [['eventID', 'DESC']]
          }
        ],
        order: [['leadID', 'DESC']]
      }).then(function(leads){
         if (leads){
           var _leads = [];
           for(var i =0; i < leads.length; i++)
             _leads.push(formatLead(leads[i]));
           return res.status(200).json(_leads);
         }
      })
    }).catch(handleError(res));
}

// Gets a single Lead from the DB
export function show(req, res) {
  Lead.find({
    where: {
      leadID: req.params.id
    },
    include: [
      {
        model: Note,
        include: [
          {
            model: User,
            as: 'Creator',
            attributes: ['firstName', 'lastName', 'userID', 'email', 'role']
          }
        ],
        through: NoteActivities,
        order: [['noteID', 'DESC']]
      },
      {
        model: Event,
        include: [
          {
            model: User,
            as: 'Host',
            attributes: ['firstName', 'lastName', 'userID', 'email', 'role']
          }
        ],
        through: Participants,
        order: [['eventID', 'DESC']]
      }
    ]
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(formatLead(res)))
    .catch(handleError(res));
}


function formatLead(lead){
  if (!lead) return;
  var formattedLead = {};
  formattedLead = lead.profile;
  formattedLead.timeAgo =  moment(formattedLead.createdAt).fromNow();
  if (lead.Notes) {
    formattedLead.notes = [];
    for (var i = 0; i < lead.Notes.length; i++) {
      var noteProfile = lead.Notes[i].profile;
      noteProfile.timeAgo = moment(lead.Notes[i].profile.createdAt).fromNow();
      noteProfile.creator = lead.Notes[i].Creator.profile;
      formattedLead.notes.push(noteProfile);
    }
  }

  if (lead.Events){
    formattedLead.appointments = [];
    for(var j = 0; j < lead.Events.length; j++){
      var appointmentProfile = lead.Events[j].profile;
      appointmentProfile.host = lead.Events[j].Host.profile;
      appointmentProfile.sourceName = lead.sourceName;
      appointmentProfile.sourceType = lead.sourceType;
      formattedLead.appointments.push(appointmentProfile);
    }
  }
  return formattedLead;
}

// Creates a new Lead in the DB
export function create(req, res) {
   if (!req.body) return res.status(500).send('Lead Details are required!');
   if (!req.user) return res.status(500).send('Unable to authenticate request');
   if (!req.body.name) return res.status(500).send('Lead Name is required');
   if (!req.body.phone) return res.status(500).send('Lead Phone is required');
   if (!req.body.source) return res.status(500).send('Lead Source is required');

  var details = {};
  details.name = req.body.name;
  details.phone = req.body.phone;
  details.email = req.body.email;
  details.address = req.body.address;
  details.interest = req.body.interest;
  details.additionalInfo = req.body.additionalInfo;
  details.sourceName = req.body.source.name;
  details.sourceType = req.body.source.type;

  console.log(details);

  var appointment;
  if (req.body.hasOwnProperty('appointment') && req.body.appointment && req.body.appointment.Date && req.body.appointment.Time)
    appointment = req.body.appointment;

  return User.find({
    where:{
      userID: req.user.userID
    },
    include: [
      {
        model: Dealership,
        as: 'Employer',
        required: true
      }
    ]
  }).then(function(user){
    return Lead.findOrCreate({
      where: {
        name: details.name,
        phone: details.phone
      },
      defaults:details
    })
      .spread(function(lead, created){
        console.log("Created: "+created);
        return (created) ?
          lead.setCreator(user).then(function(result){
             return lead.setDealership(user.Employer[0])
               .then(function(){
                  return res.status(200).json(formatLead(lead));
             })
          }) : res.status(200).json({error: {msg: 'Sorry, this lead already exist', code:''}});
      })
  }).catch(handleError(res));
}


export function scheduleAppointment(req, res) {
  if (!req.user) return res.status(500).send('Unable to Authenticate your request');
  if (!req.body) return res.status(500).send('Appointment Details are required');
  if (!req.body.leadID) return res.status(500).send('leadID is required');
  if (!req.body.appointment) return res.status(500).send('Appointment is required');
  return Lead.sequelize.transaction(function (t) {
    return User.find({
      where: {
        userID: req.user.userID
      },
      include: [
        {
          model: Dealership,
          as: 'Employer',
          required: true
        }
      ],
      transaction: t
    }).then(function (user) {
      var user = user;
      return Lead.find({
        where: {
          leadID: req.body.leadID
        },
        transaction: t
      }).then(function (lead) {
        var details = {
          name: lead.name,
          description: req.description,
          location: user.Employer[0].dealerInfo.address,
          time: req.body.appointment,
          category: 'appointment',
          status: 'scheduled',
        };
        return lead.createEvent(details, {transaction: t})
          .then(function (event) {
            console.log('>> Appointment Event Added to Lead');
            return event.setHost(user, {transaction: t})
              .then(function(){
              console.log('>> Added Event Host');
              return Event.find({
                where: {
                  eventID: event.eventID
                },
                include: [
                  {
                    model: User,
                    as: 'Host',
                    attributes: ['firstName', 'lastName', 'userID', 'email', 'role']
                  }
                ],
                transaction: t
              }).then(function(newEvent){
                 var appointment = newEvent.profile;
                 appointment.host = newEvent.Host.profile;
                 return lead.update({status: 'working'}, {transaction: t})
                   .then(function(){
                      return appointment;
                 });
              });
            });
          })
      })

    }).then(function (event) {
      return res.status(200).json(event);
    }).catch(handleError(res));
  });
}


export function addNote(req,res) {
  if (!req.user) return res.status(500).send('Unable to Authenticate your request');
  if (!req.body) return res.status(500).send('Note Details are required');
  if (!req.body.leadID) return res.status(500).send('leadID is required');
  if (!req.body.note) return res.status(500).send('Note is required');
  return Lead.sequelize.transaction(function (t) {
    return User.find({
      where: {
        userID: req.user.userID
      },
      include: [
        {
          model: Dealership,
          as: 'Employer',
          required: true
        }
      ],
      transaction: t
    }).then(function (user) {
      var user = user;
      return Lead.find({
        where: {
          leadID: req.body.leadID
        },
        transaction: t
      }).then(function (lead) {
        var details = {
          content: req.body.note,
        };
        return lead.createNote(details, {transaction: t})
          .then(function (note) {
            console.log('>> Note added to Lead');
            return note.setCreator(user, {transaction: t})
              .then(function(){
              return Note.find({
                where: {
                  noteID: note.noteID,
                },
                include: [
                  {
                    model: User,
                    as: 'Creator',
                    attributes: ['firstName', 'lastName', 'userID', 'email', 'role']
                  }
                ],
                transaction: t
              }).then(function(newNote){
                var noteProfile = newNote.profile;
                noteProfile.timeAgo = moment(newNote.profile.createdAt).fromNow();
                noteProfile.creator = newNote.Creator.profile;
                return lead.update({status: 'working'}, {transaction: t})
                  .then(function(){
                  return noteProfile;
                });
              })
            });
          })
      })

    }).then(function (event) {
      return res.status(200).json(event);
    }).catch(handleError(res));
  });

}

// Updates an existing Lead in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Lead.find({
    where: {
      leadID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(function(result){
      return Lead.find({
        where: {
          leadID: req.params.id
        },
        include: [
          {
            model: Note,
            include: [
              {
                model: User,
                as: 'Creator',
                attributes: ['firstName', 'lastName', 'userID', 'email', 'role']
              }
            ],
            through: NoteActivities,
            order: [['noteID', 'DESC']]
          },
          {
            model: Event,
            include: [
              {
                model: User,
                as: 'Host',
                attributes: ['firstName', 'lastName', 'userID', 'email', 'role']
              }
            ],
            through: Participants,
            order: [['eventID', 'DESC']]
          }
        ]
      }).then(function(lead){
         return res.status(200).json(formatLead(lead));
      })
    })
    .catch(handleError(res));
}




export function totalLeads(req, res){

  return User.find({
    where: {
      userID: req.user.userID
    },
    include: [
      {
        model: Dealership,
        as: 'Employer',
        required: true
      }
    ]
  }).then(function(user){
    if (user){
      var dealershipID = user.Employer[0].token.dealerID;
      var saleRep = '';
      var promises = [];
      /*var from = moment().startOf('month').startOf('day').format('YYYY-MM-DD HH:MM:ss');
      var to = moment().endOf('day').format('YYYY-MM-DD HH:MM:ss');
      if (req.user.role == 'sale_rep') saleRep = ' AND saleRepID = '+req.user.userID+' ';
      console.log(from);
      console.log(to);*/

      /* Get totalLeads Stats */
      promises.push(Lead.sequelize
        .query('SELECT lds.sourceName AS Source, lds.sourceType AS Type,' +
          '  COUNT(1) AS Leads, COUNT(1) / t.cnt * 100 AS Percentage FROM Leads lds' +
          ' CROSS JOIN (SELECT COUNT(1) AS cnt FROM Leads) t GROUP BY lds.sourceName ORDER BY Percentage DESC',
          {type: Lead.sequelize.QueryTypes.SELECT}));

      /* Get table Data */
      promises.push(Lead.findAll({
        where:{
          dealershipID: dealershipID
        },
        include: [
          {
            model: Note,
            include: [
              {
                model: User,
                as: 'Creator',
                attributes: ['firstName', 'lastName', 'userID', 'email', 'role']
              }
            ],
            through: NoteActivities,
            order: [['noteID', 'DESC']]
          },
          {
            model: Event,
            include: [
              {
                model: User,
                as: 'Host',
                attributes: ['firstName', 'lastName', 'userID', 'email', 'role']
              }
            ],
            through: Participants,
            order: [['eventID', 'DESC']]
          }
        ],
        order: [['leadID', 'DESC']]
      }));

      /* Return Query results */
      return Q.all(promises).then(function(leads){
        var _leads = [];
        for(var i = 0; i < leads[1].length; i++) _leads.push(formatLead(leads[1][i]));
        return res.status(200).json({stats: leads[0], data: _leads});
      });

    } else return res.status(200).json([]);

  }).catch(handleError(res));

}



export function totalAppointments(req, res){

  return User.find({
    where: {
      userID: req.user.userID
    },
    include: [
      {
        model: Dealership,
        as: 'Employer',
        required: true
      }
    ]
  }).then(function(user){

     if (user){

         var promises = [];
         /* Get Appointments Stats */
         promises.push(Lead.sequelize
         .query('SELECT sourceName AS Source, sourceType AS Type,' +
           '  COUNT(1) AS Appointments, COUNT(1) / t.cnt * 100 AS Percentage FROM Events' +
           ' JOIN Participants ON Events.eventID = Participants.eventID ' +
           'JOIN Leads ON Participants.participantID = Leads.leadID ' +
           'CROSS JOIN (SELECT COUNT(1) AS cnt FROM Events ' +
           'JOIN Participants ON Events.eventID = Participants.eventID ' +
           'WHERE category="appointment" AND attendable="lead") t GROUP BY sourceName ORDER BY Percentage DESC',
           {type: Lead.sequelize.QueryTypes.SELECT}));

         /* Get All Appointments */
         promises.push(Lead.findAll({
           include: {
              model: Event,
              include: [
               {
                 model: User,
                 as: 'Host',
                 attributes: ['firstName', 'lastName', 'userID', 'email', 'role']
               }
             ],
           },
           through: Participants
         }));

         return Q.all(promises).then(function(appointments){
           var _leads = [];
           for(var i = 0; i < appointments[1].length; i++) _leads.push(formatLead(appointments[1][i]));
           return res.status(200).json({stats:appointments[0], data:_leads});
         });

     } else return res.status(200).json([]);

  }).catch(handleError(res));

}

export function keptAppointments(req, res){

  return User.find({
    where: {
      userID: req.user.userID
    },
    include: [
      {
        model: Dealership,
        as: 'Employer',
        required: true
      }
    ]
  }).then(function(user){

    if (user){

      var promises = [];
      /* Get Appointments Stats */
      promises.push(Lead.sequelize
        .query('SELECT sourceName AS Source, sourceType AS Type,' +
          '  COUNT(1) AS Appointments, COUNT(1) / t.cnt * 100 AS Percentage FROM Events' +
          ' JOIN Participants ON Events.eventID = Participants.eventID ' +
          'JOIN Leads ON Participants.participantID = Leads.leadID ' +
          'CROSS JOIN (SELECT COUNT(1) AS cnt FROM Events ' +
          'JOIN Participants ON Events.eventID = Participants.eventID ' +
          'WHERE category="appointment" AND attendable="lead" AND Events.status="kept") t ' +
          'WHERE Events.status="kept" GROUP BY sourceName ORDER BY Percentage DESC',
          {type: Lead.sequelize.QueryTypes.SELECT}));

      /* Get All Appointments */
      promises.push(Lead.findAll({
        include: {
          model: Event,
          where: {
            status: 'kept'
          },
          include: [
            {
              model: User,
              as: 'Host',
              attributes: ['firstName', 'lastName', 'userID', 'email', 'role']
            }
          ],
        },
        through: Participants
      }));

      return Q.all(promises).then(function(appointments){
        var _leads = [];
        for(var i = 0; i < appointments[1].length; i++) _leads.push(formatLead(appointments[1][i]));
        return res.status(200).json({stats:appointments[0], data:_leads});
      });

    } else return res.status(200).json([]);

  }).catch(handleError(res));
}

export function missedAppointments(req, res){

  return User.find({
    where: {
      userID: req.user.userID
    },
    include: [
      {
        model: Dealership,
        as: 'Employer',
        required: true
      }
    ]
  }).then(function(user){

    if (user){

      var promises = [];
      /* Get Appointments Stats */
      promises.push(Lead.sequelize
        .query('SELECT sourceName AS Source, sourceType AS Type,' +
          '  COUNT(1) AS Appointments, COUNT(1) / t.cnt * 100 AS Percentage FROM Events' +
          ' JOIN Participants ON Events.eventID = Participants.eventID ' +
          'JOIN Leads ON Participants.participantID = Leads.leadID ' +
          'CROSS JOIN (SELECT COUNT(1) AS cnt FROM Events ' +
          'JOIN Participants ON Events.eventID = Participants.eventID ' +
          'WHERE category="appointment" AND attendable="lead" AND Events.status="missed") t ' +
          'WHERE Events.status="missed" GROUP BY sourceName ORDER BY Percentage DESC',
          {type: Lead.sequelize.QueryTypes.SELECT}));

      /* Get All Appointments */
      promises.push(Lead.findAll({
        include: {
          model: Event,
          where: {
            status: 'missed'
          },
          include: [
            {
              model: User,
              as: 'Host',
              attributes: ['firstName', 'lastName', 'userID', 'email', 'role']
            }
          ],
        },
        through: Participants
      }));

      return Q.all(promises).then(function(appointments){
        var _leads = [];
        for(var i = 0; i < appointments[1].length; i++) _leads.push(formatLead(appointments[1][i]));
        return res.status(200).json({stats:appointments[0], data:_leads});
      });

    } else return res.status(200).json([]);

  }).catch(handleError(res));
}

export function soldAppointments(req, res){

  return User.find({
    where: {
      userID: req.user.userID
    },
    include: [
      {
        model: Dealership,
        as: 'Employer',
        required: true
      }
    ]
  }).then(function(user){

    if (user){

      var promises = [];
      /* Get Appointments Stats */
      promises.push(Lead.sequelize
        .query('SELECT sourceName AS Source, sourceType AS Type,' +
          '  COUNT(1) AS Appointments, COUNT(1) / t.cnt * 100 AS Percentage FROM Events' +
          ' JOIN Participants ON Events.eventID = Participants.eventID ' +
          'JOIN Leads ON Participants.participantID = Leads.leadID ' +
          'CROSS JOIN (SELECT COUNT(1) AS cnt FROM Events ' +
          'JOIN Participants ON Events.eventID = Participants.eventID ' +
          'WHERE category="appointment" AND attendable="lead" AND Events.status="sold") t ' +
          'WHERE Events.status="sold" GROUP BY sourceName ORDER BY Percentage DESC',
          {type: Lead.sequelize.QueryTypes.SELECT}));

      /* Get All Appointments */
      promises.push(Lead.findAll({
        include: {
          model: Event,
          where: {
            status: 'sold'
          },
          include: [
            {
              model: User,
              as: 'Host',
              attributes: ['firstName', 'lastName', 'userID', 'email', 'role']
            }
          ],
        },
        through: Participants
      }));

      return Q.all(promises).then(function(appointments){
        var _leads = [];
        for(var i = 0; i < appointments[1].length; i++) _leads.push(formatLead(appointments[1][i]));
        return res.status(200).json({stats:appointments[0], data:_leads});
      });

    } else return res.status(200).json([]);

  }).catch(handleError(res));
}


// Deletes a Lead from the DB
export function destroy(req, res) {
  Lead.find({
    where: {
      leadID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
