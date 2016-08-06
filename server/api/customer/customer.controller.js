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
import {Dealership} from '../../sqldb';
import {Deal} from '../../sqldb';
import {Vehicle} from '../../sqldb';
import {Trade} from '../../sqldb';
import {Financing} from '../../sqldb';
import {User} from '../../sqldb';
import {Document} from '../../sqldb';
import config from '../../config/environment';

var moment  = require('moment');
var Promise = require('bluebird');
var fs  = require('fs');
var pdfFiller = require('pdffiller');
var Q = require('q');


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
          model: Dealership,
        },
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
        {
          model: Document,
          attributes: ['title', 'type', 'description', 'path', 'status']
        }
      ]
    }]
  })
    .then(handleEntityNotFound(res))
    .then(function(customer){
      return res.status(200).json(formatCustomer(customer));
    })
    .catch(handleError(res));
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


export function getDocuments(req, res){
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
      where: {
        status: 'won'
      },
      include: [
        {
          model: Dealership,
        },
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
          attributes: ['vehicleID', 'stockNumber', 'VIN', 'make', 'model', 'year', 'invoice', 'trimLevel', 'state', 'classification', 'mileage', 'bodyStyle'],
        },
        {
          model: Trade,
          attributes: ['tradeID', 'VIN','make', 'model', 'year','mileage','actualCashValue', 'payoffAmount', 'tradeAllowance', 'VIN'],
        },
        {
          model: Financing,
          attributes: ['financingID', 'installments', 'interestRate', 'monthlyPayment', 'amountFinanced'],
        },
        {
          model: Document,
          attributes: ['title', 'type', 'description', 'path', 'status', 'createdAt','required']
        }
      ]
    }]
  }).then(function(customer){
    if (!customer) res.status(200).json([]);
    else {
      var deals = customer.Deals;
      var promises = [], docs = [];
      for (var i=0; i < deals.length; i++){
        (deals[i].Documents.length == 0) ?
          promises.push(generateDocSet(customer.profile, deals[i])) :
          docs = docs.concat(deals[i].Documents);
      }
      if (promises.length > 0){
        return Q.all(promises).then(function(documents){
          return res.status(200).json(documents);
        })
      } else return res.status(200).json(docs);
    }
  }).catch(handleError(res));

}


function generateDocSet(customer, deal){

  if (!customer) throw new Error('Customer Profile is required');
  if (!deal) throw new Error('Deal details are required');

  var sourcePDF = "server/api/deal/DocSet.pdf";
  if (!customer.customerID) throw new Error('CustomerID is required');
  var path = 'server/users/'+customer.customerID+'/documents';

  var df = Q.defer();
  /* Create Directory or use existing user directory */
  var mkdirp = require('mkdirp');
  mkdirp(path, function (err) {
    if (err){
      console.error(err);
      df.reject(err);
    }
    else {
      var destinationPDF = path+'/filledDocSet.pdf';
      var prefill = {};

      /* Customer info */
      prefill.customerFullName = customer.name;
      if (customer.address && customer.address.trim() != '') prefill.customerHomeAddress = customer.address;
      if (customer.email && customer.email.trim() != '') prefill.customerEmailAddress = customer.email;
      if (customer.phone && customer.phone.trim() != '') prefill.customerCellPhone = customer.phone;
      prefill.customerSignatureDate = moment(deal.createdAt).format('DD/MM/YYYY') || '';

      /* Trade PayOff Authorization*/
      if (deal.Trades && deal.Trades.length > 0) {
        prefill.amount_payOff_authorization = deal.Trades[0].payOffAmount || 0;
        prefill.make_payOff_authorization = deal.Trades[0].make || '';
        prefill.model_payOff_authorization = deal.Trades[0].model || '',
        prefill.mileage_payOff_authorization = deal.Trades[0].mileage || 0;
        prefill.serial_number_payOff_authorization = deal.Trades[0].VIN || '';
      }

      /* Odometer Statements */
      prefill.stockNumber = deal.Purchase.profile.stockNumber || '';
      prefill.odometer_mileage_odometer_statement = deal.Purchase.profile.mileage || 0;
      prefill.make_odomoter_statement = deal.Purchase.profile.make || '';
      prefill.model_odometer_statement = deal.Purchase.profile.model || '';
      prefill.body_type_odometer_statement = deal.Purchase.profile.bodyStyle || '';
      prefill.vin_number_odometer_statement = deal.Purchase.profile.VIN || '';
      prefill.year_odometer_statement = deal.Purchase.profile.year || '';
      prefill.transferror_name_odometer_statement = deal.Dealership.dealerInfo.name || '';
      prefill.transferror_address_odometer_statement = deal.Dealership.dealerInfo.address || '';
      prefill.transferror_state_odometer_statement = deal.Dealership.state || '',
      prefill.transferror_streetAddress_odometer_statement = deal.Dealership.streetAddress || '';
      prefill.transferror_zipCode_odometer_statement = deal.Dealership.zipCode || '',
      prefill.statement_date_odometer_statement = moment(deal.createdAt).format('DD/MM/YYYY') || '';
      prefill.transferree_name_odometer_statement = customer.name || '';
      prefill.transfferee_streetAddress_odometer_statement = customer.streetAddress || '';
      prefill.transferree_zipCode_odometer_statement = customer.zipCode || '';
      prefill.transferree_state_odometer_statement = customer.state || '';
      prefill.transferree_city_odometer_statement = customer.city || '';

      /* Disclosure of Previous Use */
      prefill.year_disclosure_of_former_use = deal.Purchase.profile.year || '';
      prefill.make_disclosure_of_former_use = deal.Purchase.profile.make || '';
      prefill.model_disclosure_of_former_use = deal.Purchase.profile.model || '';
      prefill.body_type_discloser_of_former_use = deal.Purchase.profile.bodyStyle || '';
      prefill.vin_number_disclosure_of_former_use = deal.Purchase.profile.VIN || '';

      /* Lemon Law */
      prefill.dealershipName = deal.Dealership.dealerInfo.name || '';
      prefill.vehicel_model_leman_law = deal.Purchase.profile.model || '';
      prefill.vehicle_year_lemon_law = deal.Purchase.profile.year || '';
      prefill.vehicle_vin_leman_law = deal.Purchase.profile.VIN || '';


      /* Finaning Approval */
      if (deal.paymentOption == 'financed') {
        prefill.financing_approval_signature_date = moment(deal.createdAt).format('DD/MM/YYYY') || '';
        prefill.vehicle_year_financing_approval = deal.Purchase.profile.year || '';
        prefill.vehicle_make_financing_approval = deal.Purchase.profile.make || '';
        prefill.vehicle_model_financing_approval = deal.Purchase.profile.model || '';
        prefill.vehicle_vin_finaning_approval = deal.Purchase.profile.VIN || '';
        prefill.dealer_rep_sign_date = moment(deal.createdAt).format('DD/MM/YYYY') || '';
      }

     /* console.log('\n\n\n>> Data To Prefill....\n\n\n');
      console.log(prefill);
      console.log('\n\n\n ________________________\n\n\n\n');
*/

      pdfFiller.fillForm(sourcePDF, destinationPDF, prefill, function(err) {
        if (err) {
           console.error(err);
           df.reject(err);
        }
        console.log('\n\n\n\n\n>> FILLED PDF GENERATED....\n\n\n');
        return Document.create({
          title: 'New Purchase Documents',
          type: 'pdf',
          path: destinationPDF,
          status: 'pending',
          createdAt: moment(deal.createdAt).format('DD/MM/YYYY'),
          required: true
        }).then(function(document){
          return document.setDeal(deal)
            .then(function(document){
               if (!document)  return df.reject(null);
               return df.resolve(document);
          })
        }).catch(function(err){
          console.log(err);
          df.reject(err);
        });
      });
    }
  });
  return df.promise;
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
