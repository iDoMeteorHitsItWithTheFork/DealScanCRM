/**
 * Created by ludovicagodio on 4/10/16.
 */
/**
 * Created by milesjohnson on 4/4/16.
 */
angular.module('dealScanCrmApp')
  .controller('UpdateCustomerCtrl', function ($scope, Util, Customer, selectedCustomer, $uibModalInstance) {
    console.log("update customer controller loaded");

    var _updateCustomer = this;
    _updateCustomer.customerInfo = {
      driverLicenseID: selectedCustomer.driverLicenseID,
      firstName: selectedCustomer.firstName,
      middleInitial: selectedCustomer.middleInitial,
      lastName: selectedCustomer.lastName,
      phone: selectedCustomer.phone,
      dateOfBirth: selectedCustomer.dateOfBirth,
      email: selectedCustomer.email,
      streetAddress: selectedCustomer.streetAddress,
      city: selectedCustomer.city,
      state: selectedCustomer.state,
      country: selectedCustomer.country,
      postalCode: selectedCustomer.postalCode,
      source: selectedCustomer.source
    };


    var st = $scope.$watch(function () {
      return _updateCustomer.customerInfo.state;
    }, function (newValue, oldValue) {
      if (newValue) {
        for (var i = 0; i < _updateCustomer.states.length; i++) {
          if (Util.slimTrim(newValue).toLowerCase() == Util.slimTrim(_updateCustomer.states[i].name).toLowerCase()) {
            _updateCustomer.stateCode = _updateCustomer.states[i].code
            break;
          }
        }
      }
    })

    /*
     * Destory watch on exit
     *
     * */
    $scope.$on('destroy', function () {
      st();
    });

    _updateCustomer.updatingCustomer = false;

    _updateCustomer.ok = function () {
      if (_updateCustomer.updatingCustomer) return;
      _updateCustomer.updatingCustomer = true;
      Customer.update(selectedCustomer.customerID, _updateCustomer.customerInfo).then(function (updatedCustomer) {
        console.log(updatedCustomer);
        $uibModalInstance.close(updatedCustomer);
      }).catch(function (err) {
        _updateCustomer.updatingCustomer = false;
        console.log(err);
        //SweetAlert.swal('Customer Error!', 'Sorry, an error ocurred while attempting to update customer. Please try again later.', 'error');
      })

    };

    _updateCustomer.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    _updateCustomer.sources = [{name: 'WalkIn'}, {name: 'Internet'}, {name: 'Phone'}];
    _updateCustomer.states = Util.usStates();

  });
