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
        if (!string || string.length == 0) return '';
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

      leadSources(){
        return [
          {
            id: 'walkIn',
            name: 'Walk In',
            type: 'WalkIn'
          },
          {
            id: 'phone',
            name: 'Phone',
            type: 'Phone'
          },
          {
            id: 'true_car',
            name: 'TrueCar',
            type: 'Internet'
          },
          {
            id: 'car_dot_com',
            name: 'Cars.com',
            type: 'Internet'
          },
          {
            id: 'autoTrader',
            name: 'AutoTrader',
            type: 'Internet'
          },
          {
            id: 'edmunds',
            name: 'Edmunds',
            type: 'Internet'
          },{
            id: 'carCode',
            name: 'Edmunds CarCode',
            type: 'Internet'
          },{
            id: 'website',
            name: 'hagerstownford.com',
            type: 'Internet'
          },
          {
            id:'carfax',
            name: 'Carfax',
            type: 'Internet'
          },{
            id: 'fatwin',
            name: 'FATWIN',
            type: 'Internet'
          }
        ];
      },

      /**
       *  Return the index of the object with proterty value within the array
       *  */
      indexOfObject(arr, key, value) {
        return arr.map(function (el) {
          return el[key];
        }).indexOf(value);
      },

      /**
       * Determine if a point is within  a geospacial polygon
       * */
      pointInPoly(lat, lng, poly){
        return poly ? google.maps.geometry.poly.containsLocation(new google.maps.LatLng(lat, lng), poly) : null;
      },

    /**
     *  Determines if a point is within a geospacial circle
     *  */
    pointInCircle(p1, p2, r) {
      return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) <= r);
    },

    /**
     * Replace All occurences of 'find' within 'str'
     */
    replaceAll(find, replace, str){
      return str.replace(new RegExp(find, 'g'), replace);
    },


      /* Validate Link as Img Url */
      parseUrlLink(url){
        var validExt = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
        var valid = false, ext = '';
        if (url) {
          for (var i = 0; i < validExt.length; i++) {
            if (url.toLowerCase().indexOf(validExt[i]) != -1) {
              valid = true;
              ext = validExt[i];
              break;
            }
          }
        }
        return {ext: ext, valid: valid};
      },

      /*** Normalize Url ***/
      trimImgUrl(url){
        if (url) {
          var validExt = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
          var lk = this.parseUrlLink(url);
          if (lk.valid) {
            var idx = url.toLowerCase().indexOf(lk.ext);
            // console.log('__befr___: ' + url);
            url = url.substring(0, idx + (lk.ext.length));
            // console.log('___after___: ' + url);
          }
          return url;
        }
      },

        /**
         * pie charts colors
         * @returns {string[]}
         */
      pieColors(){
        return ['#315777', '#F5888D', '#8BC33E', '#5B9BD1', '#9A89B5', '#F18636'];
      },

      pieColorsBySource(source){
        var color = '';
        switch(source.toLowerCase()){
          case 'phone':
            color = '#1c84c6'
            break;
          case 'truecar':
            color = '#23c6c8';
            break;
          case 'fatwin':
            color = '#f8ac59';
            break;
          case 'edmunds':
            color= '#ed5565';
            break;
          case 'cars.com':
            color = '#1ab394';
            break;
          case 'other':
            color = '#9a89b5';
            break;
          case 'facebook':
            color = '#315777';
            break;
          case 'twitter':
            color = '#00aced';
            break;
          case 'website':
            color = '#8bc33e';
            break;
          case 'edmunds carcode':
            color = '#f5888d';
            break;
        }
        return color;
      },

      /**
       * Dummy Data for Sales
       * @returns {*[]}
         */
      dummyData(){
        var data  = [
          {"model": "Police Interceptor Sedan", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Amos Edwards", "email": "lacus.pede@Vestibulumuteros.net", "phone": "(734) 794-6954", "date": "01/09/2016", "salesman": "Chandler Herrera", "source": "Phone", "price": "39691.14", "status": "lost"},
          {"model": "C-Max", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Curran Vazquez", "email": "magnis@Sedeunibh.net", "phone": "(499) 158-6943", "date": "12/19/2015", "salesman": "Gary Reynolds", "source": "Walk-In", "price": "39760.63", "status": "won"},
          {"model": "Fusion", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Zachery Moon", "email": "urna@loremDonecelementum.edu", "phone": "(704) 874-3894", "date": "01/31/2016", "salesman": "Murphy Sanders", "source": "Phone", "price": "19178.07", "status": "lost"},
          {"model": "Expedition", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Mufutau Arnold", "email": "facilisis@eu.net", "phone": "(435) 968-2444", "date": "03/30/2016", "salesman": "Nigel Dudley", "source": "Walk-In", "price": "38451.15", "status": "lost"},
          {"model": "Edge", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Wang Hensley", "email": "posuere@convallis.com", "phone": "(403) 267-0390", "date": "12/14/2015", "salesman": "Callum Christian", "source": "Phone", "price": "24205.01", "status": "lost"},
          {"model": "Escape", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Bert Sexton", "email": "ultrices.mauris.ipsum@metussit.edu", "phone": "(110) 842-8877", "date": "01/23/2016", "salesman": "Herman Graves", "source": "Phone", "price": "38279.09", "status": "won"},
          {"model": "Taurus", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Gareth Collier", "email": "dui.Fusce.diam@tincidunt.net", "phone": "(856) 708-6515", "date": "12/27/2015", "salesman": "Derek Floyd", "source": "HappyTag", "price": "57259.95", "status": "won"},
          {"model": "Escape", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Rooney Fry", "email": "nonummy@liberoduinec.net", "phone": "(343) 319-9375", "date": "03/25/2016", "salesman": "Valentine Bishop", "source": "Internet", "price": "49433.51", "status": "lost"},
          {"model": "Police Interceptor Sedan", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Ulysses Clark", "email": "consequat.purus@bibendumfermentum.edu", "phone": "(367) 256-9708", "date": "09/26/2015", "salesman": "Kennan Mcpherson", "source": "HappyTag", "price": "19171.38", "status": "lost"},
          {"model": "E-Series", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Richard Rollins", "email": "ridiculus@erosNam.com", "phone": "(809) 525-7513", "date": "09/02/2015", "salesman": "Nigel Compton", "source": "Internet", "price": "47737.58", "status": "lost"},
          {"model": "Expedition", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Calvin Drake", "email": "primis.in@etipsum.ca", "phone": "(836) 958-2509", "date": "07/21/2015", "salesman": "Myles Nunez", "source": "Internet", "price": "48436.54", "status": "lost"},
          {"model": "Police Interceptor Sedan", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Dante Compton", "email": "Phasellus@velfaucibus.com", "phone": "(866) 164-1421", "date": "07/13/2015", "salesman": "Timothy Castillo", "source": "Walk-In", "price": "35677.42", "status": "lost"},
          {"model": "Explorer", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Leo Phelps", "email": "a.arcu@morbitristique.edu", "phone": "(817) 109-9461", "date": "01/17/2016", "salesman": "Orson Osborn", "source": "HappyTag", "price": "28591.05", "status": "won"},
          {"model": "C-Max", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Geoffrey Delgado", "email": "posuere@lacuspedesagittis.com", "phone": "(682) 141-9133", "date": "06/24/2015", "salesman": "Cairo Baird", "source": "Internet", "price": "34667.23", "status": "won"},
          {"model": "C-Max", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Gavin Carrillo", "email": "Donec.sollicitudin.adipiscing@dolorsitamet.org", "phone": "(954) 148-6426", "date": "08/08/2015", "salesman": "Plato Gallagher", "source": "Other", "price": "44624.73", "status": "lost"},
          {"model": "Escape", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Jesse Whitney", "email": "Sed@ametornare.com", "phone": "(499) 600-0948", "date": "08/13/2015", "salesman": "Henry Hudson", "source": "HappyTag", "price": "58418.49", "status": "lost"},
          {"model": "F-Series", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Demetrius Mathews", "email": "Aliquam@utsemNulla.co.uk", "phone": "(974) 665-4706", "date": "08/17/2015", "salesman": "Mannix Payne", "source": "Walk-In", "price": "24229.20", "status": "lost"},
          {"model": "Police Interceptor Sedan", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Akeem Heath", "email": "quis@eu.co.uk", "phone": "(415) 771-7010", "date": "06/20/2015", "salesman": "Ashton Vinson", "source": "Internet", "price": "30514.80", "status": "lost"},
          {"model": "C-Max", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Marshall Kidd", "email": "fermentum@tempusscelerisquelorem.net", "phone": "(521) 144-6184", "date": "02/22/2016", "salesman": "Rooney Hunter", "source": "Internet", "price": "39710.92", "status": "won"},
          {"model": "Police Interceptor Sedan", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Jerome Rogers", "email": "fringilla.ornare.placerat@posuereenimnisl.co.uk", "phone": "(773) 673-6190", "date": "11/06/2015", "salesman": "Marvin Blackwell", "source": "Other", "price": "47413.61", "status": "lost"},
          {"model": "Transit", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Kaseem Macdonald", "email": "quis.lectus@conubianostraper.ca", "phone": "(521) 569-1057", "date": "04/11/2016", "salesman": "Daniel Parsons", "source": "HappyTag", "price": "40863.94", "status": "lost"},
          {"model": "C-Max", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Martin Salinas", "email": "felis.orci.adipiscing@Nullam.edu", "phone": "(444) 815-2259", "date": "11/25/2015", "salesman": "Linus Mcdaniel", "source": "Other", "price": "29193.19", "status": "lost"},
          {"model": "Transit Connect", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Chandler Watson", "email": "gravida@leoelementum.org", "phone": "(368) 487-2865", "date": "08/03/2015", "salesman": "Louis Dillard", "source": "Other", "price": "20491.03", "status": "won"},
          {"model": "Fusion", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Denton Francis", "email": "venenatis@velvulputate.edu", "phone": "(851) 227-5352", "date": "11/20/2015", "salesman": "Brent Davis", "source": "HappyTag", "price": "26464.89", "status": "lost"},
          {"model": "Mustang", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Dorian Morrison", "email": "id.erat@Nullamfeugiat.net", "phone": "(257) 859-1975", "date": "09/06/2015", "salesman": "Alec Shelton", "source": "Internet", "price": "38965.88", "status": "won"},
          {"model": "Edge", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Callum Sampson", "email": "lorem.auctor.quis@sapienCras.co.uk", "phone": "(582) 809-5861", "date": "02/08/2016", "salesman": "Garrison Peterson", "source": "Phone", "price": "57334.30", "status": "lost"},
          {"model": "Mustang", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Lamar Gordon", "email": "sollicitudin.a@AliquamnislNulla.edu", "phone": "(340) 455-7844", "date": "01/19/2016", "salesman": "Yoshio Russo", "source": "Internet", "price": "37320.20", "status": "won"},
          {"model": "Explorer", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Tanek Henson", "email": "eleifend@velit.org", "phone": "(979) 596-6264", "date": "10/16/2015", "salesman": "Flynn Delgado", "source": "HappyTag", "price": "34199.06", "status": "lost"},
          {"model": "Fiesta", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Avram Patton", "email": "rutrum.justo@neque.org", "phone": "(970) 174-0231", "date": "08/07/2015", "salesman": "Grady Marks", "source": "Internet", "price": "54536.89", "status": "lost"},
          {"model": "Expedition", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Kenyon Avery", "email": "tincidunt.nibh@nasceturridiculusmus.ca", "phone": "(299) 279-4741", "date": "07/21/2015", "salesman": "Mannix Lester", "source": "Phone", "price": "55791.52", "status": "lost"},
          {"model": "Explorer", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Kieran Mckinney", "email": "posuere.enim.nisl@metusVivamuseuismod.ca", "phone": "(677) 770-3064", "date": "09/06/2015", "salesman": "Patrick Franks", "source": "HappyTag", "price": "15170.49", "status": "lost"},
          {"model": "Transit Connect", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Kieran Herrera", "email": "mauris.a@necante.co.uk", "phone": "(681) 712-2001", "date": "03/12/2016", "salesman": "Michael Quinn", "source": "Internet", "price": "33260.30", "status": "lost"},
          {"model": "Focus", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Octavius Riggs", "email": "mi.tempor.lorem@urnaconvallis.co.uk", "phone": "(802) 244-7893", "date": "04/28/2016", "salesman": "Dane Galloway", "source": "Walk-In", "price": "24825.24", "status": "won"},
          {"model": "Transit", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Josiah Dorsey", "email": "dictum.cursus@acmi.org", "phone": "(812) 658-7271", "date": "08/14/2015", "salesman": "Preston Snider", "source": "Internet", "price": "54986.51", "status": "lost"},
          {"model": "Edge", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Baxter Nelson", "email": "eu@nonummyFusce.edu", "phone": "(511) 176-7307", "date": "07/17/2015", "salesman": "Brody Whitehead", "source": "Phone", "price": "59230.78", "status": "lost"},
          {"model": "Taurus", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Blaze Stephenson", "email": "dictum.eu@nisi.co.uk", "phone": "(771) 898-5030", "date": "09/04/2015", "salesman": "Kenneth Horn", "source": "HappyTag", "price": "24599.06", "status": "lost"},
          {"model": "Escape", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Coby Bender", "email": "Ut@seddictumeleifend.ca", "phone": "(155) 741-3298", "date": "06/01/2015", "salesman": "Octavius Garner", "source": "Internet", "price": "56931.71", "status": "lost"},
          {"model": "E-Series", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Griffith Rutledge", "email": "ac@placeratCrasdictum.co.uk", "phone": "(414) 280-3371", "date": "02/07/2016", "salesman": "Devin Mcclain", "source": "Other", "price": "41297.76", "status": "won"},
          {"model": "Expedition", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Vladimir Emerson", "email": "adipiscing@Nunclaoreetlectus.ca", "phone": "(392) 603-4265", "date": "11/13/2015", "salesman": "Hu Dawson", "source": "Walk-In", "price": "57909.70", "status": "lost"},
          {"model": "Flex", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Malik Sawyer", "email": "Sed.diam.lorem@est.co.uk", "phone": "(895) 961-2292", "date": "04/06/2016", "salesman": "Jarrod Castillo", "source": "HappyTag", "price": "27156.58", "status": "lost"},
          {"model": "Fiesta", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Chase Dudley", "email": "euismod.est.arcu@Uttincidunt.org", "phone": "(324) 987-6498", "date": "04/08/2016", "salesman": "Nathan Mckee", "source": "Other", "price": "50314.91", "status": "lost"},
          {"model": "Police Interceptor Sedan", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Shad Gonzales", "email": "pharetra.felis@cursusvestibulum.co.uk", "phone": "(600) 648-3423", "date": "01/02/2016", "salesman": "Beau Beck", "source": "Other", "price": "51063.09", "status": "won"},
          {"model": "Fiesta", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Kirk Moran", "email": "Duis.ac.arcu@magnanecquam.edu", "phone": "(410) 262-1075", "date": "11/12/2015", "salesman": "Slade Vincent", "source": "Phone", "price": "17431.86", "status": "lost"},
          {"model": "Flex", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Joseph Quinn", "email": "mauris@adipiscingelitAliquam.ca", "phone": "(581) 475-7766", "date": "08/12/2015", "salesman": "Donovan Winters", "source": "Other", "price": "19866.83", "status": "won"},
          {"model": "Transit", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Amir Burks", "email": "non@nec.com", "phone": "(420) 747-7198", "date": "12/23/2015", "salesman": "Cyrus Avila", "source": "Internet", "price": "28843.41", "status": "lost"},
          {"model": "Fusion", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Martin Wheeler", "email": "quam.a@cursusnon.co.uk", "phone": "(499) 959-0729", "date": "05/13/2016", "salesman": "Dillon Hanson", "source": "Walk-In", "price": "34157.29", "status": "won"},
          {"model": "C-Max", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Garrett Maddox", "email": "lobortis@lobortis.co.uk", "phone": "(884) 576-8232", "date": "06/06/2015", "salesman": "Hoyt Orr", "source": "Internet", "price": "34903.82", "status": "lost"},
          {"model": "Heavy Trucks", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Adam Skinner", "email": "penatibus.et@urnasuscipitnonummy.edu", "phone": "(820) 987-7592", "date": "12/16/2015", "salesman": "Raja Morgan", "source": "Other", "price": "40455.35", "status": "won"},
          {"model": "C-Max", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Zane Zimmerman", "email": "dolor.Fusce@ligulaDonecluctus.net", "phone": "(933) 256-3571", "date": "12/13/2015", "salesman": "Jacob Burnett", "source": "Other", "price": "22848.21", "status": "won"},
          {"model": "E-Series", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Uriah Hatfield", "email": "mattis.Integer@ante.org", "phone": "(293) 189-5634", "date": "12/19/2015", "salesman": "Paul Torres", "source": "HappyTag", "price": "42766.45", "status": "lost"},
          {"model": "Expedition", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Devin Brown", "email": "Nullam.enim@vitaevelitegestas.net", "phone": "(785) 558-8852", "date": "01/10/2016", "salesman": "Luke Sanchez", "source": "HappyTag", "price": "36641.62", "status": "won"},
          {"model": "Mustang", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Jordan Hawkins", "email": "In@tellus.org", "phone": "(700) 810-3798", "date": "04/24/2016", "salesman": "Thane Knight", "source": "Walk-In", "price": "20122.53", "status": "won"},
          {"model": "Transit Connect", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Quentin Noble", "email": "nunc.id@posuerecubilia.edu", "phone": "(988) 382-6294", "date": "09/07/2015", "salesman": "Hector Reeves", "source": "HappyTag", "price": "53421.71", "status": "lost"},
          {"model": "Police Interceptor Sedan", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Darius Dean", "email": "turpis.vitae.purus@hendreritneque.com", "phone": "(225) 103-7382", "date": "12/27/2015", "salesman": "Vaughan Knight", "source": "Walk-In", "price": "40329.61", "status": "lost"},
          {"model": "Fusion", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Malik Roberts", "email": "risus@neceleifendnon.ca", "phone": "(108) 139-5210", "date": "03/05/2016", "salesman": "Davis King", "source": "HappyTag", "price": "18706.58", "status": "won"},
          {"model": "Mustang", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Drew Hines", "email": "consequat.dolor@porttitor.ca", "phone": "(251) 726-0492", "date": "11/25/2015", "salesman": "Dolan Carter", "source": "Other", "price": "25831.77", "status": "won"},
          {"model": "C-Max", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Raja Watts", "email": "fringilla@nullaanteiaculis.co.uk", "phone": "(506) 640-5073", "date": "01/04/2016", "salesman": "Porter Copeland", "source": "Internet", "price": "28832.25", "status": "lost"},
          {"model": "Escape", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Hasad Bush", "email": "inceptos@Loremipsum.org", "phone": "(364) 819-4166", "date": "03/08/2016", "salesman": "Rooney Chan", "source": "Internet", "price": "37286.21", "status": "won"},
          {"model": "Mustang", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Dieter Sellers", "email": "ipsum@velitegestaslacinia.ca", "phone": "(991) 212-3681", "date": "05/14/2016", "salesman": "Kibo Morales", "source": "HappyTag", "price": "33665.60", "status": "lost"},
          {"model": "Escape", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Chester Wolf", "email": "purus.Duis.elementum@Nulla.org", "phone": "(823) 418-5335", "date": "07/05/2015", "salesman": "Dane Harrington", "source": "HappyTag", "price": "30366.33", "status": "won"},
          {"model": "Transit", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Timon Mcleod", "email": "urna@nullamagnamalesuada.org", "phone": "(469) 259-0846", "date": "05/02/2016", "salesman": "Boris Wolf", "source": "Other", "price": "58525.99", "status": "won"},
          {"model": "Flex", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Daquan Good", "email": "erat.vel@Etiamvestibulum.org", "phone": "(127) 819-1214", "date": "09/20/2015", "salesman": "Gareth Andrews", "source": "Phone", "price": "15648.35", "status": "won"},
          {"model": "Expedition", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Erasmus Nieves", "email": "gravida.Praesent.eu@felisNullatempor.com", "phone": "(131) 727-8880", "date": "06/17/2015", "salesman": "Holmes Donaldson", "source": "Phone", "price": "52559.77", "status": "lost"},
          {"model": "Mustang", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Berk Weber", "email": "gravida.Praesent@Curabituregestasnunc.org", "phone": "(305) 237-7795", "date": "08/10/2015", "salesman": "Ferdinand Buchanan", "source": "Walk-In", "price": "49952.72", "status": "lost"},
          {"model": "Flex", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Demetrius Becker", "email": "urna.suscipit.nonummy@tortordictumeu.ca", "phone": "(240) 928-7848", "date": "09/11/2015", "salesman": "Hamish Harris", "source": "HappyTag", "price": "57392.89", "status": "lost"},
          {"model": "C-Max", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Nathan Vazquez", "email": "quis.turpis@ornarefacilisiseget.net", "phone": "(483) 434-2226", "date": "07/30/2015", "salesman": "Owen Henderson", "source": "HappyTag", "price": "40431.92", "status": "lost"},
          {"model": "Expedition", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Alden Case", "email": "volutpat.nunc.sit@Vestibulumaccumsan.edu", "phone": "(412) 277-6028", "date": "02/17/2016", "salesman": "Kennedy Bray", "source": "Other", "price": "29739.66", "status": "lost"},
          {"model": "F-Series", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Norman Austin", "email": "dolor.Fusce@elementumloremut.ca", "phone": "(473) 551-5865", "date": "03/05/2016", "salesman": "Colton Gardner", "source": "Phone", "price": "54944.65", "status": "won"},
          {"model": "C-Max", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Seth Morrow", "email": "Nulla.eu.neque@Vestibulum.com", "phone": "(467) 597-0022", "date": "03/25/2016", "salesman": "Lionel Hudson", "source": "Phone", "price": "53312.90", "status": "lost"},
          {"model": "Expedition", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Jonas Barron", "email": "Morbi.sit@Nullasemper.net", "phone": "(261) 456-2760", "date": "08/30/2015", "salesman": "Ethan Strong", "source": "Other", "price": "44608.16", "status": "won"},
          {"model": "Flex", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Adrian Booth", "email": "Nam.porttitor.scelerisque@feugiat.edu", "phone": "(235) 638-0589", "date": "09/02/2015", "salesman": "Neville Foley", "source": "Phone", "price": "25520.82", "status": "won"},
          {"model": "Heavy Trucks", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Emmanuel Jones", "email": "posuere@Cumsociis.co.uk", "phone": "(416) 748-8956", "date": "07/12/2015", "salesman": "Lyle Goodwin", "source": "Internet", "price": "47598.01", "status": "lost"},
          {"model": "Transit", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Caldwell Fuller", "email": "sit@adipiscing.net", "phone": "(722) 940-6834", "date": "10/02/2015", "salesman": "Damon Beck", "source": "Phone", "price": "46368.03", "status": "lost"},
          {"model": "F-Series", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Arsenio Rosales", "email": "velit@metussit.com", "phone": "(804) 802-6502", "date": "03/20/2016", "salesman": "Kenyon Munoz", "source": "Internet", "price": "41082.29", "status": "won"},
          {"model": "Expedition", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Lamar Hester", "email": "montes.nascetur@risusDonecegestas.edu", "phone": "(423) 922-5683", "date": "10/09/2015", "salesman": "Ivan Mejia", "source": "Walk-In", "price": "53643.76", "status": "won"},
          {"model": "C-Max", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Tobias Mcdaniel", "email": "consequat.enim@dui.edu", "phone": "(223) 144-2396", "date": "02/10/2016", "salesman": "Ishmael Stewart", "source": "Walk-In", "price": "55071.31", "status": "lost"},
          {"model": "Expedition", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Otto Whitney", "email": "Proin@etultrices.net", "phone": "(183) 340-5548", "date": "02/02/2016", "salesman": "Quinn Wade", "source": "Phone", "price": "42407.98", "status": "won"},
          {"model": "Expedition", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Otto Fry", "email": "nec.diam@Proinvel.edu", "phone": "(793) 351-1773", "date": "01/09/2016", "salesman": "Emmanuel Townsend", "source": "Phone", "price": "44192.80", "status": "won"},
          {"model": "C-Max", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Kennedy Spears", "email": "ullamcorper.nisl.arcu@Phasellusin.net", "phone": "(554) 270-0865", "date": "01/29/2016", "salesman": "Chaney Cain", "source": "Walk-In", "price": "54832.94", "status": "won"},
          {"model": "Expedition", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Tarik Galloway", "email": "egestas.lacinia.Sed@sagittis.net", "phone": "(833) 456-5267", "date": "04/11/2016", "salesman": "Francis Avery", "source": "Phone", "price": "44423.62", "status": "lost"},
          {"model": "F-Series", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Ulric Macdonald", "email": "non@antedictumcursus.co.uk", "phone": "(439) 898-9800", "date": "03/08/2016", "salesman": "Shad Herrera", "source": "Other", "price": "47388.22", "status": "lost"},
          {"model": "Transit Connect", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Raja Sullivan", "email": "in.lobortis@vellectusCum.net", "phone": "(938) 938-8651", "date": "06/11/2015", "salesman": "Xenos Vaughn", "source": "Walk-In", "price": "43987.18", "status": "won"},
          {"model": "Fusion", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Wyatt Burris", "email": "a.ultricies@neceuismod.net", "phone": "(536) 391-7304", "date": "03/18/2016", "salesman": "Dorian Rogers", "source": "Internet", "price": "50041.45", "status": "lost"},
          {"model": "C-Max", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Stuart Rogers", "email": "accumsan.sed@Ut.org", "phone": "(590) 249-1641", "date": "07/17/2015", "salesman": "Abel Duffy", "source": "HappyTag", "price": "24368.57", "status": "won"},
          {"model": "Focus", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Mark Charles", "email": "tristique@sem.edu", "phone": "(171) 158-5188", "date": "01/17/2016", "salesman": "Gil Tate", "source": "Internet", "price": "46438.28", "status": "won"},
          {"model": "Edge", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Jerry Mccoy", "email": "montes.nascetur@Phasellus.co.uk", "phone": "(269) 246-6154", "date": "12/13/2015", "salesman": "Lucian Barry", "source": "Phone", "price": "21845.21", "status": "won"},
          {"model": "C-Max", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Drake Morin", "email": "eu.dui.Cum@Integer.com", "phone": "(355) 294-5140", "date": "07/09/2015", "salesman": "Murphy Bender", "source": "HappyTag", "price": "25032.44", "status": "won"},
          {"model": "Escape", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Nigel Pruitt", "email": "in.magna@auctornuncnulla.ca", "phone": "(988) 272-7315", "date": "11/11/2015", "salesman": "Elliott Goodwin", "source": "Other", "price": "56414.20", "status": "won"},
          {"model": "Flex", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Bradley Stuart", "email": "posuere.enim.nisl@idrisus.edu", "phone": "(661) 309-0970", "date": "08/31/2015", "salesman": "Wang Morse", "source": "Internet", "price": "31074.86", "status": "won"},
          {"model": "Escape", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Wayne Knowles", "email": "Vestibulum@facilisiseget.edu", "phone": "(375) 428-8621", "date": "01/08/2016", "salesman": "Cade Goodwin", "source": "Other", "price": "47907.30", "status": "won"},
          {"model": "Flex", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Dale Goff", "email": "ornare@risus.com", "phone": "(637) 762-2170", "date": "09/13/2015", "salesman": "Nash Delacruz", "source": "Phone", "price": "41495.14", "status": "won"},
          {"model": "Expedition", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Harding Alvarado", "email": "enim.Curabitur@magnamalesuadavel.org", "phone": "(364) 663-1934", "date": "05/24/2015", "salesman": "Benedict William", "source": "Internet", "price": "37018.40", "status": "won"},
          {"model": "Flex", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Wylie Chase", "email": "leo@porttitorscelerisque.co.uk", "phone": "(892) 434-0806", "date": "12/07/2015", "salesman": "Jonah Lynch", "source": "Internet", "price": "29158.29", "status": "lost"},
          {"model": "C-Max", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Stone Wilkins", "email": "accumsan.sed@eleifendegestasSed.net", "phone": "(785) 580-2245", "date": "07/29/2015", "salesman": "Cade Hall", "source": "Walk-In", "price": "33920.13", "status": "won"},
          {"model": "Police Interceptor Sedan", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Zephania Yates", "email": "at.egestas@Curabitur.co.uk", "phone": "(436) 981-9195", "date": "09/22/2015", "salesman": "Todd Vargas", "source": "Other", "price": "48339.38", "status": "won"},
          {"model": "Fusion", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Thor Villarreal", "email": "adipiscing.fringilla.porttitor@erosturpis.net", "phone": "(423) 911-3081", "date": "04/30/2016", "salesman": "Kareem Lane", "source": "Walk-In", "price": "41117.58", "status": "lost"},
          {"model": "Flex", "make": "Ford", "year": "2017", "trimLevel": "None", "name": "Deacon Vaughn", "email": "feugiat.Lorem.ipsum@mollisInteger.ca", "phone": "(881) 428-9562", "date": "08/27/2015", "salesman": "Xanthus Horn", "source": "Walk-In", "price": "29945.59", "status": "won"},
          {"model": "Escape", "make": "Ford", "year": "2015", "trimLevel": "None", "name": "Uriel Spears", "email": "metus.In.nec@asollicitudin.co.uk", "phone": "(368) 810-4591", "date": "07/01/2015", "salesman": "Kamal Johnson", "source": "Internet", "price": "51476.56", "status": "won"},
          {"model": "Mustang", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Solomon Mcclain", "email": "Vestibulum.ut.eros@cubiliaCuraeDonec.org", "phone": "(537) 424-2393", "date": "10/29/2015", "salesman": "Ray Robertson", "source": "Phone", "price": "45985.03", "status": "lost"},
          {"model": "Fusion", "make": "Ford", "year": "2016", "trimLevel": "None", "name": "Plato Lara", "email": "commodo@amet.org", "phone": "(282) 114-6543", "date": "06/20/2015", "salesman": "Avram Perry", "source": "Other", "price": "55894.22", "status": "lost"}
        ];
        angular.forEach(data, function(value, key){
          switch(value.model.toLowerCase()){
            case 'fiesta':
            case 'focus':
            case 'c-max':
            case 'fusion':
            case 'taurus':
            case 'police interceptor sedan':
            case'mustang':
                  value.category = 'Cars';
                  break;
            case 'f-series':
            case 'e-series':
            case 'transit':
            case 'transit connect':
            case 'heavy trucks':
                 value.category = 'Trucks';
                  break;
            case 'escape':
            case 'edge':
            case 'flex':
            case 'explorer':
            case 'expedition':
                  value.category = 'Utilities';
                  break;
            default:
                  value.category = 'Other';
                  break;
          }
        });
        return data;
      },

      getDayNumber(day){
        var n;
        switch(day.toLowerCase()){
          case 'sunday':
          case 'sun':
          case 'su':
            n = 0;
            break;
          case 'monday':
          case 'mon':
          case 'm':
            n = 1;
            break;
          case 'tuesday':
          case 'tues':
          case 'tue':
          case 't':
            n = 2;
            break;
          case 'wednesday':
          case 'wed':
          case 'w':
            n = 3;
            break;
          case 'thursday':
          case 'thurs':
          case  'tr':
            n = 4;
            break;
          case 'friday':
          case 'fri':
          case 'fr':
          case 'f':
            n = 5;
            break;
          case 'saturday':
          case 'sat':
          case 'sa':
            n = 6;
            break;
        }
        return n;
      },

      searchPath(searchOptions){

        var term = (searchOptions.term && searchOptions.term.trim().length > 0) ? searchOptions.term : null; //search term
        var location = (searchOptions.location) ? searchOptions.location : null; //location filter
        var locationBounds = location && searchOptions.bounds ? searchOptions.bounds : null;  //boundary type [circle, polygon]

        var path = null;
        if (term && location) path = 'TermAndLocation';
        else {
          if (term) path = 'Term';
          else if (location) path = 'Location';
        }
        return path;
      },

      dummyPhotos(model){
        var p = '';
        var i = 0;
        var models = ['cmax', 'c-max', 'edge', 'escape', 'expedition', 'explorer', 'f150', 'f-150',
        'f250', 'f-250', 'flex', 'focus', 'ranger', 'taurus'];
        var m ='';
        for(var i =0; i < models.length; i++){
          if (model.toLowerCase().indexOf(models[i]) != -1) {
            m = models[i];
            break;
          }
        }

        switch(m){
          case 'cmax':
          case 'c-max':
            i = Math.floor((Math.random() * 5) + 1);
            p = 'assets/vehicle_images/cmax-'+i+'.jpg';
            break;
          case 'edge':
            i = Math.floor((Math.random() * 5) + 1);
            p = 'assets/vehicle_images/edge-'+i+'.jpg';
            break;
          case 'escape':
            i = Math.floor((Math.random() * 5) + 1);
            p = 'assets/vehicle_images/escape-'+i+'.jpg';
            break;
          case 'expedition':
            i = Math.floor((Math.random() * 5) + 1);
            p = 'assets/vehicle_images/expedition-'+i+'.jpg';
            break;
          case 'explorer':
            i = Math.floor((Math.random() * 5) + 1);
            p = 'assets/vehicle_images/explorer-'+i+'.jpg';
            break;
          case 'f150':
          case 'f-150':
            i = Math.floor((Math.random() * 5) + 1);
            p = 'assets/vehicle_images/f150-'+i+'.jpg';
            break;
          case 'f250':
          case 'f-250':
            i = Math.floor((Math.random() * 5) + 1);
            p = 'assets/vehicle_images/f250-'+i+'.jpg';
            break;
          case 'flex':
            i = Math.floor((Math.random() * 5) + 1);
            p = 'assets/vehicle_images/flex-'+i+'.jpg';
            break;
          case 'focus':
            i = Math.floor((Math.random() * 5) + 1);
            p = 'assets/vehicle_images/focus-'+i+'.jpg';
            break;
          case 'ranger':
            i = Math.floor((Math.random() * 5) + 1);
            p = 'assets/vehicle_images/ranger-'+i+'.jpg';
            break;
          case 'taurus':
            i = Math.floor((Math.random() * 5) + 1);
            p = 'assets/vehicle_images/taurus-'+i+'.jpg';
            break;
          default:
            p = 'assets/images/upload-placeholder.jpg';
            break;
        }
        return p;
      }

    }

    return Util;
  }

  angular.module('dealScanCrmApp.util')
    .factory('Util', UtilService);

})
();
