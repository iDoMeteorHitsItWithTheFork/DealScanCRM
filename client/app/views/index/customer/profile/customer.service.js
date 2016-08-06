'use strict';

angular.module('dealScanCrmApp')
  .factory('Customer', function (Auth, Util, $q, $filter, CustomerResource) {
    // Service logic
    // ...

    var _customers = [];
    var _searchResults = []
    var _customersInfo = [];
    var _searchResultsInfo = [];
    var _pageSize = 1000;

    /*
     * Returns a list of customers
     * */
    function getCustomers() {
      _customers.length = 0;
      return CustomerResource.get()
        .$promise.then(function (customers) {
          _customers = customers || [];
          _customersInfo = customers ? customers.rows : [];
          _customersInfo = (_customersInfo.length > _pageSize) ? _customersInfo.slice(0, _pageSize) : _customersInfo;
          console.log(_customersInfo);
          return _customersInfo;
        }).catch(function (err) {
          console.log(err);
          return err;
        })
    }


    /*
     * Returns customer with specified customerId
     * */
    function getCustomer(customerID) {
      console.log(customerID);
      return CustomerResource.get({id: customerID})
        .$promise.then(function (customer) {
          return customer;
        }).catch(function (err) {
          console.log(err);
          return err;
        })
    }

    /*
     * Search customer array for customer match
     *
     * */
    function filterCustomers(find, customers) {
      return $filter('filter')(customers, find);
    }

    /*
     * Sort customer array
     *
     * */
    function sortCustomers(customers, criteria, reverse) {
      return $filter('orderBy')(customers, criteria, reverse);
    }

    /*
     * Returns a list of customers with the associated name
     *
     * */
    function findCustomer(customerName) {
      _customers.length = 0;
      customerName = Util.slimTrim(customerName);
      return CustomerResource.get({name: customerName}).
        $promise.then(function (searchResults) {
          _searchResults = searchResults || [];
          _searchResultsInfo = searchResults ? searchResults.rows : [];
          _searchResultsInfo = (_searchResultsInfo.length > _pageSize) ? _searchResultsInfo.slice(0, _pageSize) : _searchResultsInfo;
          return _searchResultsInfo;
        }).catch(function (err) {
          console.log(err);
          return err;
        })
    }


    function updateCustomers(newCustomer) {
      var idx = _customers.rows.indexOf(newCustomer);
      if (idx != -1) return false;
      _customers.rows.unshift(newCustomer);
      _customers.count++;
      return true;
    }

    /*
     *  Create a new customer
     *
     *
     * */

    function addCustomer(customer) {
      var newCustomer = new CustomerResource(customer);
      return newCustomer.$save().then(function (newCustomer) {
        console.log(newCustomer);
        updateCustomers(newCustomer);
        return newCustomer;
      }).catch(function (err) {
        console.log(err);
        return err;
      })
    }

    function updateCustomer(id, customer) {
      console.log(customer);
      return CustomerResource.update({id:id}, customer).
        $promise.then(function (updatedCustomer) {
          console.log(updatedCustomer);
          if (Util.indexOfObject(_customers.rows, 'customerID', id) != -1) {
            var idx = Util.indexOfObject(_customers.rows, 'customerID', id);
            _customers.rows.splice(idx, 1, updatedCustomer);
          }
          return updatedCustomer;
        }).catch(function (err) {
          console.log(err);
          return err;
        })
    }


    function removeCustomer(id) {
      return CustomerResource.delete({id:id}).
        $promise.then(function(deletedCustomer){
          if (_customers.rows){
            var idx = Util.indexOfObject(_customers.rows, 'customerID', id);
            if (idx != -1) _customers.rows.splice(idx,1);
          }
          if (_searchResults.rows) {
            var idx_ = Util.indexOfObject(_searchResults.rows, 'customerID', id);
            if (idx_ != -1) _searchResults.rows.splice(idx_,1);
          }
          return _customersInfo;
      }).catch(function(err){
          console.log(err);
          return err;
        })
    }

    function docAttributes(type){
      var d = {};
      switch(type.toLowerCase()){
        case 'pdf':
          d.img = "http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/pdf-doc-48.png";
          d.icon = 'fa-file-pdf-o';
          break;
        case 'doc':
          d.img = "http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/word-doc-48.png";
          d.icon = 'fa-file';
          break;
        case 'img':
          d.img = "https://www.cstatic-images.com/stock/1680x1680/28/img-1773720671-1468609294128.jpg";
          d.icon = null;
          break;
        case 'xls':
          d.img = "http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/excel-doc-48.png";
          d.icon = 'fa-bar-chart-o';
          break;
        case 'ppt':
          d.img = "http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/ppt-doc-48.png";
          d.icon = 'fa-file-powerpoint-o';
          break;
      }
      return d;
    }

      /**
       * Get Customer documents
       * @param customerID
       * @returns {*}
       */
    function getDocuments(customerID){
      console.log(customerID);
      return CustomerResource.getDocuments({id:customerID}).$promise
        .then(function(documents){
          console.log(documents);
          if (documents){
            var docs = [];
            for(var i = 0; i < documents.length; i++){
              console.log(documents[i]);
              var d = {
                name: documents[i].title,
                ext: documents[i].type,
                added: moment(documents[i].createdAt).format('MMMM DD, YYYY'),
                url: documents[i].path,
                status: documents[i].status,
                requested: documents[i].required
              }
              console.log(d);
              var _i = docAttributes(documents[i].type);
              if (_i.img) d.img = _i.img;
              if (_i.icon) d.icon = _i.icon;
              docs.push(d);
            }
            return docs;
          }
      }).catch(function(err){
        console.log(err);
        return err;
      })
    }

    // Public API here
    return {
      get: getCustomer,
      find: findCustomer,
      getCustomers: getCustomers,
      documents: getDocuments,
      filterCustomers: filterCustomers,
      sortCustomers: sortCustomers,
      add: addCustomer,
      update: updateCustomer,
      remove: removeCustomer,
      customers: function () {
        return _customersInfo;
      },
      searchResults: function () {
        return _searchResults;
      },
      getRows: function () {
        return _customers.rows;
      },
      getCount: function () {
        return _customers.count;
      },
      getResultsCount: function () {
        return _searchResults.count;
      }
    };


  });
