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
      country: 'USA',
      zipCode: thisCustomer.profile.zipCode,
    };

    /*
     * Destory watch on exit
     *
     * */

    _updateCustomer.sources = Util.leadSources();
    _updateCustomer.states = Util.usStates();

    _updateCustomer.updatingCustomer = false;
    var idx = Util.indexOfObject(_updateCustomer.sources, 'name', thisCustomer.profile.source);
    if (idx != -1) _updateCustomer.customerInfo.source = _updateCustomer.sources[idx];

    var idx_ = Util.indexOfObject(_updateCustomer.states, 'name', thisCustomer.profile.state);
    if (idx_ != -1) _updateCustomer.customerInfo.state = _updateCustomer.states[idx_];

    _updateCustomer.ok = function () {
      if (_updateCustomer.updatingCustomer) return;
      _updateCustomer.updatingCustomer = true;
      _updateCustomer.customerInfo.state = _updateCustomer.customerInfo.state.name;
      _updateCustomer.customerInfo.source = _updateCustomer.customerInfo.source.name;
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



  });
