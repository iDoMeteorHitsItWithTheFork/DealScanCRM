'use strict';

describe('Service: lead', function () {

  // load the service's module
  beforeEach(module('dealScanCrmApp'));

  // instantiate service
  var lead;
  beforeEach(inject(function (_lead_) {
    lead = _lead_;
  }));

  it('should do something', function () {
    expect(!!lead).toBe(true);
  });

});
