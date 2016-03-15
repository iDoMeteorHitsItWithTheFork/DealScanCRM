(function(angular, undefined) {
'use strict';

angular.module('dealScanCrmApp.constants', [])

.constant('appConfig', {userRoles:['sale_rep','bdc_rep','nw_car_sale_mgr','usd_car_sale_mgr','sale_mgr','bdc_mgr','gen_sale_mgr','gen_mgr','owner','admin']})
.constant('APP_MEDIAQUERY', {
    'desktopXL': 1200,
    'desktop': 992,
    'tablet': 768,
    'mobile': 480
})
;
})(angular);