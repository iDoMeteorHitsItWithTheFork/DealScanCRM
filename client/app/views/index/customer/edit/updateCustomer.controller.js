/**
 * Created by ludovicagodio on 4/10/16.
 */

angular.module('dealScanCrmApp')
  .controller('UpdateCustomerCtrl', function ($scope, Util, Customer, thisCustomer, $uibModalInstance, toaster) {
    console.log("update customer controller loaded");

    var _updateCustomer = this;
    _updateCustomer.customerInfo = {
      driverLicenseID: thisCustomer.profile.driverLicenseID,
      firstName: thisCustomer.profile.firstName,
      middleInitial: thisCustomer.profile.middleInitial,
      lastName: thisCustomer.profile.lastName,
      phone: thisCustomer.profile.phone,
      dateOfBirth: thisCustomer.profile.dateOfBirth,
      email: thisCustomer.profile.email,
      streetAddress: thisCustomer.profile.streetAddress,
      city: thisCustomer.profile.city,
      state: thisCustomer.profile.state,
      country: thisCustomer.profile.country,
      postalCode: thisCustomer.profile.postalCode,
      source: thisCustomer.profile.source
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
      Customer.update(thisCustomer.profile.customerID, _updateCustomer.customerInfo).then(function (updatedCustomer) {
        console.log(updatedCustomer);
        $uibModalInstance.close(updatedCustomer);
      }).catch(function (err) {
        _updateCustomer.updatingCustomer = false;
        console.log(err);
        toaster.error({title:'Update Error', body:'An error occured whlle attempting to updat'});
      })

    };

    _updateCustomer.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    _updateCustomer.sources = Util.leadSources();
    _updateCustomer.states = Util.usStates();

  });
