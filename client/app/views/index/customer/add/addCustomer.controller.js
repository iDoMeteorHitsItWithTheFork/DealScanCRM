/**
 * Created by milesjohnson on 4/4/16.
 */
angular.module('dealScanCrmApp')
  .controller('AddCustomerCtrl', function ($scope, Util, Customer,$uibModalInstance) {
    console.log("add customer controller loaded");

    var _newCustomer = this;
    _newCustomer.sources = [{name:'WalkIn'},{name:'Web'},{name:'Phone'}, {name:'HappyTag'}, {name:'Other'}];
    _newCustomer.states = Util.usStates();
    _newCustomer.state = {};
    _newCustomer.source = {};
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
      _newCustomer.customerInfo.state = _newCustomer.state.name;
      _newCustomer.customerInfo.country = _newCustomer.state.country;
      _newCustomer.customerInfo.source = _newCustomer.source.name;
      Customer.add(_newCustomer.customerInfo).then(function(newCustomer){
        console.log(newCustomer);
        $uibModalInstance.close(newCustomer);
      }).catch(function(err){
        _newCustomer.addCustomer = false;
        console.log(err);
        //SweetAlert.swal('Customer Error!', 'Sorry, an error ocurred while attempting to add customer. Please try again later.', 'error');
      })

    };

    _newCustomer.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };


  });
