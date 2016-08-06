/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/customers              ->  index
 * POST    /api/customers              ->  create
 * GET     /api/customers/:id          ->  show
 * PUT     /api/customers/:id          ->  update
 * DELETE  /api/customers/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Customer} from '../../sqldb';
import {Deal} from '../../sqldb';
import {Vehicle} from '../../sqldb';
import {Trade} from '../../sqldb';
import {Financing} from '../../sqldb';
import {User} from '../../sqldb';
import config from '../../config/environment';

var moment  = require('moment');


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    console.log(err);
    throw err;
    res.status(statusCode).send(err);
  };
}

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    res.status(statusCode).json(err);
  }
}

// Gets a list of Customers
export function index(req, res) {
   if (!req.user) return validationError(res, 400);
   var customers = (req.query.hasOwnProperty('name') && req.query.name) ?
        Customer.findAndCountAll({
          where: Customer.sequelize.where(Customer.sequelize.fn('concat', Customer.sequelize.col('firstName'), ' ', Customer.sequelize.col('lastName')), {
            like: '%'+ req.query.name + '%'
          }),
          limit: config.pagination,
          order: [['customerID', 'DESC']]
        }): Customer.findAndCountAll({
            limit: config.pagination,
            order: [['customerID', 'DESC']]
        });
   return customers.then(respondWithResult(res)).catch(handleError(res));
}


// Gets a single Customer from the DB
export function show(req, res) {
  Customer.find({
    where: {
      customerID: req.params.id,
    },
    attributes: [
      'customerID',
      'driverLicenseID',
      'firstName',
      'middleInitial',
      'lastName',
      'phone',
      'email',
      'streetAddress',
      'city',
      'state',
      'country',
      'postalCode',
      'source'],
    include: [{
      model: Deal,
      include: [
        {
          model: User,
          as: 'SaleRep',
          attributes: ['userID', 'firstName', 'lastName', 'role'],
        },
        {
          model: Customer,
          as: 'CoBuyers',
          attributes: [
            'customerID',
            'driverLicenseID',
            'firstName',
            'middleInitial',
            'lastName',
            'phone',
            'email',
            'streetAddress',
            'city',
            'state',
            'country',
            'postalCode',
            'source']
        },
        {
          model: Vehicle,
          as: 'Purchase',
          attributes: ['vehicleID', 'make', 'model', 'year', 'invoice', 'trimLevel', 'state', 'classification'],
        },
        {
          model: Trade,
          attributes: ['tradeID', 'make', 'model', 'year', 'actualCashValue', 'payoffAmount', 'tradeAllowance', 'VIN'],
        },
        {
          model: Financing,
          attributes: ['financingID', 'installments', 'interestRate', 'monthlyPayment', 'amountFinanced'],
        },
      ]
    }]
  })
    .then(handleEntityNotFound(res))
    .then(function(customer){
      return res.status(200).json(formatCustomer(customer));
    })
    .catch(handleError(res));
}


export function generateDocSet(){


  dscGenerateDocSet: function(deal){

    if (!Buyer) throw new Error('Buyer Info is required');
    if (!Vehicle) throw new Error('Vehicle Info is required');
    if (!Dealership) throw new Error('Dealership Info is required');
    if (!SaleRep) throw new Error('SaleRep Info is required');



    var Promise = require('bluebird');
    var fs  = require('fs');
    var pdfFiller = require('pdffiller');
    var mkdrip = require('mkdirp');
    var moment = require('moment');

    Promise.promisifyAll(fs);
    Promise.promisifyAll(pdfFiller);
    Promise.promisifyAll(mkdrip);

    var sourcePDF = "server/backgroundTasks/DocSet.pdf";
    if (!Buyer.customerID) throw new Error('CustomerID is required');
    var path = 'server/users/'+Buyer.customerID+'/documents';

    /* Create Directory or use existing user directory */
    mkdirp(path, function (err) {
      if (err) console.error(err)
      else {
        var destinationPDF = path+'/filledDocSet.pdf';
        var prefill = {};

        /* Customer info */
        prefill.customerFullName = Buyer.profile.name;
        if (Buyer.profile.address && Buyer.profile.address.trim() != '') prefill.customerHomeAddress = Buyer.profile.address;
        if (Buyer.profile.email && Buyer.profile.email.trim() != '') prefill.customerEmailAddress = Buyer.profile.email;
        if (Buyer.profile.phone && Buyer.profile.phone.trim() != '') prefill.customerCellPhone = Buyer.profile.phone;

        /* Trade PayOff Authorization*/
        if (Trade) {
          prefill.amount_payOff_authorization = Trade.payOffAmount;
          prefill.make_payOff_authorization = Trade.make;
          prefill.model_payOff_authorization = Trade.model,
            prefill.mileage_payOff_authorization = Trade.mileage;
          prefill.serial_number_payOff_authorization = Trade.VIN;
        }

        /* Odometer Statements */
        prefill.stockNumber = Vehicle.stockNumber;
        prefill.odometer_mileage_odometer_statement = Vehicle.mileage;
        prefill.make_odomoter_statement = Vehicle.make;
        prefill.model_odometer_statement = Vehicle.model;
        prefill.body_type_odometer_statement = Vehicle.bodyStyle;
        prefill.vin_number_odometer_statement = Vehicle.VIN;
        prefill.year_odometer_statement = Vehicle.year;
        prefill.transferror_name_odometer_statement = Dealership.dealerInfo.dealershipName;
        prefill.transferror_address_odometer_statement = Dealership.dealerInfo.address;
        prefill.transferror_state_odometer_statement = Dealership.state,
          prefill.transferror_streetAddress_odometer_statement = Dealership.streetAddress;
        prefill.transferror_zipCode_odometer_statement = Dealership.zipCode,
          prefill.statement_date_odometer_statement = moment(Deal.createdAt).format('DD/MM/YYYY');
        prefill.transferree_name_odometer_statement = Buyer.profile.name;
        prefill.transfferee_streetAddress_odometer_statement = Buyer.profile.streetAddress;
        prefill.transferree_zipCode_odometer_statement = Buyer.profile.zipCode;
        prefill.transferree_state_odometer_statement = Buyer.profile.state;
        prefill.transferree_city_odometer_statement = Buyer.profile.state;

        /* Disclosure of Previous Use */
        prefill.year_disclosure_of_former_use = Vehicle.year;
        prefill.make_disclosure_of_former_use = Vehicle.make;
        prefill.model_disclosure_of_former_use = Vehicle.model;
        prefill.body_type_discloser_of_former_use = Vehicle.bodyStyle;
        prefill.vin_number_disclosure_of_former_use = Vehicle.VIN;

        /* Lemon Law */
        prefill.dealershipName = Dealership.profile.name;
        prefill.vehicel_model_leman_law = Vehicle.model;
        prefill.vehicle_year_lemon_law = Vehicle.year;
        prefill.vehicle_vin_leman_law = Vehicle.VIN;


        /* Finaning Approval */
        if (Deal.paymentOption == 'financed') {
          prefill.financing_approval_signature_date = moment(Deal.createdAt).format('DD/MM/YYYY');
          prefill.vehicle_year_financing_approval = Vehicle.year;
          prefill.vehicle_make_financing_approval = Vehicle.make;
          prefill.vehicle_model_financing_approval = Vehicle.model;
          prefill.vehicle_vin_finaning_approval = Vehicle.VIN;
          prefill.dealer_rep_sign_date = moment(Deal.createdAt).format('DD/MM/YYYY');
        }

        pdfFiller.fillForm(sourcePDF, destinationPDF, prefill, function(err) {
          if (err) throw err;
          console.log('\n\n\n\n\n>> FILLED PDF GENERATED....\n\n\n');
          var Document = sequelize.models.Document;
          return Document.create({
            title: 'New Purchase Documents',
            type: 'pdf',
            path: destinationPDF,
            status: 'pending'
          }).then(function(document){
            return document;
          }).catch(function(err){
            console.log(err);
            return err;
          });
        });
      }
    });
  }

}

function formatCustomer(customer){
  var _customer = {};
  _customer.profile = customer.profile;
  _customer.purchases = [];
  for(var i = 0; i < customer.Deals.length; i++){
    var deal = customer.Deals[i];
    _customer.purchases.push(deal);
  }
  return _customer;
}

// Creates a new Customer in the DB
export function create(req, res) {
  Customer.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}


// Updates an existing Customer in the DB
export function update(req, res) {
  if (req.body.customerID) {
    delete req.body.customerID;
  }
  Customer.find({
    where: {
      customerID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Customer from the DB
export function destroy(req, res) {
  Customer.find({
    where: {
      customerID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
