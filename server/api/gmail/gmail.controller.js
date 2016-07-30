'use strict';

import _ from 'lodash';
import {User} from  '../../sqldb';
import {Dealership} from '../../sqldb';
import {Watchlist} from '../../sqldb';
import {Source} from '../../sqldb';
import {Keyword} from '../../sqldb';

var Gmail = require('node-gmail-api');

export function index(req, res) {
  var data = [];
  return res.status(200).json('Gmail test');
}
