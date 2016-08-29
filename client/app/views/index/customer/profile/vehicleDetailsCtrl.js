/**
 * Created by ludovicagodio on 8/25/16.
 */
'use strict';

angular.module('dealScanCrmApp')
  .controller('VehicleDetailCtrl', function ($scope, $uibModalInstance, Util, vehicle, customer) {

     var _vehicle = this;
     _vehicle.display = vehicle.display;
     console.log(vehicle.deal);
     console.log(_vehicle.display);


     _vehicle.displayingInfo = {
       name: vehicle.display == 'Purchase' ? vehicle.deal.Purchase.profile.displayName : vehicle.deal.Trades[0].profile.displayName,
       trimLevel: vehicle.display == 'Purchase' ? vehicle.deal.Purchase.profile.trimLevel : vehicle.deal.Trades[0].profile.trimLevel,
       price: vehicle.display == 'Purchase' ? vehicle.deal.salePrice : vehicle.deal.Trades[0].payoffAmount,
       salePerson: vehicle.deal.SaleRep.profile,
       transactionDate: moment(vehicle.deal.createdAt).format('ddd MM.DD.YYYY'),
       details: vehicle.display == 'Purchase' ? vehicle.deal.Purchase.profile :  vehicle.deal.Trades[0].profile,
       buyer: customer,
       deal: vehicle.deal,
       date: moment(vehicle.deal.createdAt).format('MM/DD/YYYY'),
       vehiclePhoto: vehicle.display == 'Purchase' ? vehicle.deal.vehiclePhoto : Util.dummyPhotos(vehicle.deal.Trades[0].model),
       createdAt: moment(vehicle.deal.createdAt).format('DD.MM.YYYY hh:mm a'),
     }

     _vehicle.emailCustomer  = function(){

     }

     _vehicle.textCustomer  = function(){

     }

    _vehicle.ok = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })
