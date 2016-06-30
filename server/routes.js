/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/socialMedias', require('./api/socialMedia'));
  app.use('/api/financings', require('./api/financing'));
  app.use('/api/documents', require('./api/document'));
  app.use('/api/rebates', require('./api/rebate'));
  app.use('/api/trades', require('./api/trade'));
  app.use('/api/deals', require('./api/deal'));
  app.use('/api/vehicles', require('./api/vehicle'));
  app.use('/api/uploads', require('./api/upload'));
  app.use('/api/images', require('./api/image'));
  app.use('/api/notes', require('./api/note'));
  app.use('/api/customers', require('./api/customer'));
  app.use('/api/teams', require('./api/team'));
  app.use('/api/dealerships', require('./api/dealership'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
