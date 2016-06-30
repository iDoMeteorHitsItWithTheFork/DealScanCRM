(function(angular, undefined) {
'use strict';

angular.module('dealScanCrmApp.constants', [])

.constant('appConfig', {userRoles:['sale_rep','bdc_rep','sale_mgr','nw_car_sale_mgr','usd_car_sale_mgr','bdc_mgr','gen_sale_mgr','gen_mgr','owner','admin'],pagination:1000,paginationMaxSize:5,paginationItemsPerPage:20,dscUsr:'dscrm_',dscPwd:'Baiser12!',TwitterAPIToken:'4873289201-g32RVWdcapVPBbLugJGqZKuUHGfTLKi8lI2Ht6x'})

;
})(angular);