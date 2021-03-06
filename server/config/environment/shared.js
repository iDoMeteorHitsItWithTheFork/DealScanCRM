'use strict';

exports = module.exports = {
  // List of user roles
  userRoles: ['sale_rep', 'bdc_rep','sale_mgr','nw_car_sale_mgr', 'usd_car_sale_mgr','bdc_mgr', 'gen_sale_mgr','gen_mgr', 'owner', 'admin'],
  pagination: 1000,
  paginationMaxSize: 5,
  paginationItemsPerPage: 20,
  leadThreshold: 48,
  dscUsr: 'dscrm_',
  dscPwd: 'Baiser12!',
  getDisplayRole: function(role){
      if (!role) return;
      switch(role){
          case 'sale_rep':
              return 'Sales Representative';
          case 'bdc_rep':
              return 'BDC Agent';
          case 'nw_car_sale_mgr':
          case 'usd_car_sale_mgr':
          case 'sale_mgr':
              return 'Sales Manager'
          case 'bdc_mgr':
              return 'BDC Manager';
          case 'gen_sale_mgr':
              return 'General Sale Manager';
          case 'gen_mgr':
              return 'General Manager';
          case 'owner':
              return 'Owner';
          case 'admin':
              return 'System Administrator';

      }
  }
};
