'use strict';

describe('Service: socialMedia', function () {

  // load the service's module
  beforeEach(module('dealScanCrmApp'));

  // instantiate service
  var socialMedia;
  beforeEach(inject(function (_socialMedia_) {
    socialMedia = _socialMedia_;
  }));

  it('should do something', function () {
    expect(!!socialMedia).toBe(true);
  });

});
