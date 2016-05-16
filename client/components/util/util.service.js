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
          {name: 'ALABAMA', code: 'AL', country: 'United States'},
          {name: 'ALASKA', code: 'AK', country: 'United States'},
          {name: 'AMERICAN SAMOA', code: 'AS', country: 'United States'},
          {name: 'ARIZONA', code: 'AZ', country: 'United States'},
          {name: 'ARKANSAS', code: 'AR', country: 'United States'},
          {name: 'CALIFORNIA', code: 'CA', country: 'United States'},
          {name: 'COLORADO', code: 'CO', country: 'United States'},
          {name: 'CONNECTICUT', code: 'CT', country: 'United States'},
          {name: 'DELAWARE', code: 'DE', country: 'United States'},
          {name: 'DISTRICT OF COLUMBIA', code: 'DC', country: 'United States'},
          {name: 'FEDERATED STATES OF MICRONESIA', code: 'FM', country: 'United States'},
          {name: 'FLORIDA', code: 'FL', country: 'United States'},
          {name: 'GEORGIA', code: 'GA', country: 'United States'},
          {name: 'GUAM', code: 'GU', country: 'United States'},
          {name: 'HAWAII', code: 'HI', country: 'United States'},
          {name: 'IDAHO', code: 'ID', country: 'United States'},
          {name: 'ILLINOIS', code: 'IL', country: 'United States'},
          {name: 'INDIANA', code: 'IN', country: 'United States'},
          {name: 'IOWA', code: 'IA', country: 'United States'},
          {name: 'KANSAS', code: 'KS', country: 'United States'},
          {name: 'KENTUCKY', code: 'KY', country: 'United States'},
          {name: 'LOUISIANA', code: 'LA',country: 'United States'},
          {name: 'MAINE', code: 'ME', country: 'United States'},
          {name: 'MARSHALL ISLANDS', code: 'MH', country: 'United States'},
          {name: 'MARYLAND', code: 'MD', country: 'United States'},
          {name: 'MASSACHUSETTS', code: 'MA', country: 'United States'},
          {name: 'MICHIGAN', code: 'MI',country: 'United States'},
          {name: 'MINNESOTA', code: 'MN',country: 'United States'},
          {name: 'MISSISSIPPI', code: 'MS',country: 'United States'},
          {name: 'MISSOURI', code: 'MO',country: 'United States'},
          {name: 'MONTANA', code: 'MT',country: 'United States'},
          {name: 'NEBRASKA', code: 'NE',country: 'United States'},
          {name: 'NEVADA', code: 'NV',country: 'United States'},
          {name: 'NEW HAMPSHIRE', code: 'NH',country: 'United States'},
          {name: 'NEW JERSEY', code: 'NJ',country: 'United States'},
          {name: 'NEW MEXICO', code: 'NM',country: 'United States'},
          {name: 'NEW YORK', code: 'NY',country: 'United States'},
          {name: 'NORTH CAROLINA', code: 'NC',country: 'United States'},
          {name: 'NORTH DAKOTA', code: 'ND',country: 'United States'},
          {name: 'NORTHERN MARIANA ISLANDS', code: 'MP',country: 'United States'},
          {name: 'OHIO', code: 'OH',country: 'United States'},
          {name: 'OKLAHOMA', code: 'OK',country: 'United States'},
          {name: 'OREGON', code: 'OR',country: 'United States'},
          {name: 'PALAU', code: 'PW',country: 'United States'},
          {name: 'PENNSYLVANIA', code: 'PA',country: 'United States'},
          {name: 'PUERTO RICO', code: 'PR',country: 'United States'},
          {name: 'RHODE ISLAND', code: 'RI',country: 'United States'},
          {name: 'SOUTH CAROLINA', code: 'SC',country: 'United States'},
          {name: 'SOUTH DAKOTA', code: 'SD',country: 'United States'},
          {name: 'TENNESSEE', code: 'TN',country: 'United States'},
          {name: 'TEXAS', code: 'TX', country: 'United States'},
          {name: 'UTAH', code: 'UT',country: 'United States'},
          {name: 'VERMONT', code: 'VT',country: 'United States'},
          {name: 'VIRGIN ISLANDS', code: 'VI',country: 'United States'},
          {name: 'VIRGINIA', code: 'VA',country: 'United States'},
          {name: 'WASHINGTON', code: 'WA',country: 'United States'},
          {name: 'WEST VIRGINIA', code: 'WV',country: 'United States'},
          {name: 'WISCONSIN', code: 'WI',country: 'United States'},
          {name: 'WYOMING', code: 'WY',country: 'United States'}
        ];
      },

      /*** Return the index of the object with proterty value within the array ***/

      indexOfObject(arr, key, value) {
        return arr.map(function (el) {
          return el[key];
        }).indexOf(value);
      },

        /**
         * pie charts colors
         * @returns {string[]}
         */
      pieColors(){
        return ['#315777', '#F5888D', '#8BC33E', '#5B9BD1', '#9A89B5', '#F18636'];
      }

    };

    return Util;
  }

  angular.module('dealScanCrmApp.util')
    .factory('Util', UtilService);

})
();
