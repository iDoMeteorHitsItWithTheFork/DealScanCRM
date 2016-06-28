/**
 * Created by ludovicagodio on 6/23/16.
 */


angular.module('dealScanCrmApp.util')
  .factory('DataSync', function(Auth, User, Util, $q, $filter, $resource, CustomerResource, DealResource){


       var dataToSync;

       function processAndSync(){
         $resource('app/views/index/dashboard/dataExtract.json')
           .query().$promise.then(function(data){
           console.log(' ---- Data Acquired ----');
           dataToSync = data[0];
           console.log(dataToSync);

           //Process Inventory
           if (dataToSync.Inventory) {
             if (dataToSync.Inventory.length > 0){


             }
           }


           //Process Customers
           if (dataToSync.Customers) {
             if (dataToSync.Customers.length > 0){
                  // CustomerResource.sync(dataToSync.Customers).
                  //   $promise.then(function(res){
                  //     console.log(' --- Finised processing customers ---');
                  //      console.log(res);
                  //   }).catch(function(err){
                  //      console.log(err);
                  //      console.log(' --- An unknown Error Occured ---');
                  //   })
             }
           }



           //Process Deals
           if (dataToSync.Deals) {
             if (dataToSync.Deals.length > 0){
               DealResource.sync(dataToSync.Deals).
                  $promise.then(function(res){
                      console.log(' --- Finised processing deals ---');
                      console.log(res);
                  }).catch(function(err){
                      console.log(err);
                      console.log(' --- An unknown Error Occured ---');
               })
             }
           }
           
           
           

         });
       }

        //public api
        return {
           processAndSync: processAndSync,
        }
  });
