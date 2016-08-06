/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/documents              ->  index
 * POST    /api/documents              ->  create
 * GET     /api/documents/:id          ->  show
 * PUT     /api/documents/:id          ->  update
 * DELETE  /api/documents/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Document} from '../../sqldb';
import {Deal} from '../../sqldb';
import {Customer} from '../../sqldb';
import {Trade} from '../../sqldb';
import {Vehicle} from '../../sqldb';
import {Dealership} from '../../sqldb';

var fs = require('fs');

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
    res.status(statusCode).send(err);
  };
}

// Gets a list of Documents
export function index(req, res) {
  Document.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Document from the DB
export function show(req, res) {
  console.log('\n\n\n\n HERE \n\n\n');
  Document.find({
    where: {
      documentID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(function(document){
        if (document){
          var path = document.path;
          console.log(path);
          fs.readFile(path, function (err, data) {
            if (err) {res.writeHead(400); res.end("" + err); return;}
            res.writeHead(200,
              {
                "content-type" : "application/pdf",
                "Content-Disposition": "attachment; filename=filledDocSet.pdf "
              }
            );
            res.end(data);
          });
        }
    })
    .catch(handleError(res));
}

// Creates a new Document in the DB
export function create(req, res) {
  Document.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}


export function generateCompletedDoc(req, res){
  var body = [], buffer = [];
  req.on('data', function(chunk){
    body.push(chunk);
  })
  req.on('end', function(){
    console.log('\n\n>> FDF Stream Ended!\n\n');
    buffer  = buffer.concat(body);
    res.write('%FDF-1.2 1 0 obj << /FDF << /Status (Data Received) >> >> endobj trailer << /Root 1 0 R >> %%EOF');
    return res.end();
  });
}

// Updates an existing Document in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Document.find({
    where: {
      documentID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Document from the DB
export function destroy(req, res) {
  Document.find({
    where: {
      documentID: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
