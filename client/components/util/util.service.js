'use strict';

(function () {

  /**
   * The Util service is for thin, globally reusable, utility functions
   */
  function UtilService($window) {
    var Util = {
      /**
       * Return a callback or noop function
       *
       * @param  {Function|*} cb - a 'potential' function
       * @return {Function}
       */
        safeCb(cb) {
        return (angular.isFunction(cb)) ? cb : angular.noop;
      },

      /**
       * Parse a given url with the use of an anchor element
       *
       * @param  {String} url - the url to parse
       * @return {Object}     - the parsed url, anchor element
       */
        urlParse(url) {
        var a = document.createElement('a');
        a.href = url;

        // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
        if (a.host === '') {
          a.href = a.href;
        }

        return a;
      },

      /**
       * Test whether or not a given url is same origin
       *
       * @param  {String}           url       - url to test
       * @param  {String|String[]}  [origins] - additional origins to test against
       * @return {Boolean}                    - true if url is same origin
       */
        isSameOrigin(url, origins) {
        url = Util.urlParse(url);
        origins = (origins && [].concat(origins)) || [];
        origins = origins.map(Util.urlParse);
        origins.push($window.location);
        origins = origins.filter(function (o) {
          return url.hostname === o.hostname &&
            url.port === o.port &&
            url.protocol === o.protocol;
        });
        return (origins.length >= 1);
      },

      /**
       * Trim all whitespace from a string
       *
       * @param  {String}           string       - string to trm
       * @param  {String|String[]}  [origins] - additional origins to test against
       * @return {String}                    - trimmed string
       */
        slimTrim(string) {
        return string.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ") || string;
      },

      usStates(){
        return [
          {name: 'ALABAMA', code: 'AL'},
          {name: 'ALASKA', code: 'AK'},
          {name: 'AMERICAN SAMOA', code: 'AS'},
          {name: 'ARIZONA', code: 'AZ'},
          {name: 'ARKANSAS', code: 'AR'},
          {name: 'CALIFORNIA', code: 'CA'},
          {name: 'COLORADO', code: 'CO'},
          {name: 'CONNECTICUT', code: 'CT'},
          {name: 'DELAWARE', code: 'DE'},
          {name: 'DISTRICT OF COLUMBIA', code: 'DC'},
          {name: 'FEDERATED STATES OF MICRONESIA', code: 'FM'},
          {name: 'FLORIDA', code: 'FL'},
          {name: 'GEORGIA', code: 'GA'},
          {name: 'GUAM', code: 'GU'},
          {name: 'HAWAII', code: 'HI'},
          {name: 'IDAHO', code: 'ID'},
          {name: 'ILLINOIS', code: 'IL'},
          {name: 'INDIANA', code: 'IN'},
          {name: 'IOWA', code: 'IA'},
          {name: 'KANSAS', code: 'KS'},
          {name: 'KENTUCKY', code: 'KY'},
          {name: 'LOUISIANA', code: 'LA'},
          {name: 'MAINE', code: 'ME'},
          {name: 'MARSHALL ISLANDS', code: 'MH'},
          {name: 'MARYLAND', code: 'MD'},
          {name: 'MASSACHUSETTS', code: 'MA'},
          {name: 'MICHIGAN', code: 'MI'},
          {name: 'MINNESOTA', code: 'MN'},
          {name: 'MISSISSIPPI', code: 'MS'},
          {name: 'MISSOURI', code: 'MO'},
          {name: 'MONTANA', code: 'MT'},
          {name: 'NEBRASKA', code: 'NE'},
          {name: 'NEVADA', code: 'NV'},
          {name: 'NEW HAMPSHIRE', code: 'NH'},
          {name: 'NEW JERSEY', code: 'NJ'},
          {name: 'NEW MEXICO', code: 'NM'},
          {name: 'NEW YORK', code: 'NY'},
          {name: 'NORTH CAROLINA', code: 'NC'},
          {name: 'NORTH DAKOTA', code: 'ND'},
          {name: 'NORTHERN MARIANA ISLANDS', code: 'MP'},
          {name: 'OHIO', code: 'OH'},
          {name: 'OKLAHOMA', code: 'OK'},
          {name: 'OREGON', code: 'OR'},
          {name: 'PALAU', code: 'PW'},
          {name: 'PENNSYLVANIA', code: 'PA'},
          {name: 'PUERTO RICO', code: 'PR'},
          {name: 'RHODE ISLAND', code: 'RI'},
          {name: 'SOUTH CAROLINA', code: 'SC'},
          {name: 'SOUTH DAKOTA', code: 'SD'},
          {name: 'TENNESSEE', code: 'TN'},
          {name: 'TEXAS', code: 'TX'},
          {name: 'UTAH', code: 'UT'},
          {name: 'VERMONT', code: 'VT'},
          {name: 'VIRGIN ISLANDS', code: 'VI'},
          {name: 'VIRGINIA', code: 'VA'},
          {name: 'WASHINGTON', code: 'WA'},
          {name: 'WEST VIRGINIA', code: 'WV'},
          {name: 'WISCONSIN', code: 'WI'},
          {name: 'WYOMING', code: 'WY'}
        ];
      },

      /*** Return the index of the object with proterty value within the array ***/

        indexOfObject(arr, key, value) {
        return arr.map(function (el) {
          return el[key];
        }).indexOf(value);
      }

    };

    return Util;
  }

  angular.module('dealScanCrmApp.util')
    .factory('Util', UtilService);

})
();
