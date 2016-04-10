/**
 * Created by milesjohnson on 4/4/16.
 */
angular.module('dealScanCrmApp')
  .controller('AddCustomerCtrl', function ($scope, Util, Customer,$uibModalInstance, SweetAlert) {
    console.log("add customer controller loaded");

    var _newCustomer = this;
    _newCustomer.customerInfo = {
      driverLicenseID: '',
      firstName: '',
      middleInitial: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      email: '',
      streetAddress: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      source: ''
    };



    var st = $scope.$watch(function(){
      return _newCustomer.customerInfo.state;
    }, function(newValue, oldValue){
        if (newValue) {
          for(var i= 0; i < _newCustomer.states.length; i++){
            if (Util.slimTrim(newValue).toLowerCase() == Util.slimTrim(_newCustomer.states[i].name).toLowerCase()) {
              _newCustomer.stateCode =  _newCustomer.states[i].code
              break;
            };
          }
        }
    })

   /*
   * Destory watch on exit
   *
   * */
    $scope.$on('destroy', function(){
      st();
    });

    _newCustomer.addingCustomer = false;

    _newCustomer.today = function () {
      _newCustomer.dt = new Date();
    };
    _newCustomer.today();

    _newCustomer.clear = function () {
      _newCustomer.dt = null;
    };

    _newCustomer.ok = function () {
      if (_newCustomer.addingCustomer) return;
      _newCustomer.addingCustomer = true;
      Customer.add(_newCustomer.customerInfo).then(function(newCustomer){
        console.log(newCustomer);
        $uibModalInstance.close(newCustomer);
      }).catch(function(err){
        _newCustomer.addCustomer = false;
        console.log(err);
        SweetAlert.swal('Customer Error!', 'Sorry, an error ocurred while attempting to add customer. Please try again later.', 'error');
      })

    };

    _newCustomer.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    _newCustomer.sources = [{name: 'WalkIn'}, {name: 'Internet'}, {name: 'Phone'}];
    _newCustomer.states = Util.usStates();

  });
