'use strict';

export default function (sequelize, DataTypes) {
  var Customer = sequelize.define('Customer', {
    customerID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    dscCustomerID: DataTypes.BIGINT,
    driverLicenseID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    middleInitial: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: ''
    },
    lastName: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        isNumeric: {
          msg: 'Phone number must be numeric'
        }
      }
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    streetAddress: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postalCode: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'walkIn'
    }
  }, {
    /**
     * Virtual Getters
     */
    getterMethods: {
      // Public profile information
      profile: function () {
        var middleInitial = this.getDataValue('middleInitial') ? this.getDataValue('middleInitial') : '';
        if (middleInitial.length > 0) middleInitial += '.';

        return {
          'customerID': this.getDataValue('customerID'),
          'driverLicenseID': this.getDataValue('driverLicenceID'),
          'name': this.getDataValue('firstName') +' '+middleInitial+' ' + this.getDataValue('lastName'),
          'email': this.getDataValue('email'),
          'phone': this.getDataValue('phone'),
          'address': this.getDataValue('streetAddress') + ', ' + this.getDataValue('city') + ', ' + this.getDataValue('state') + ' ' + this.getDataValue('postalCode'),
          'city': this.getDataValue('city'),
          'state': this.getDataValue('state'),
          'zipCode': this.getDataValue('postalCode'),
          'source': this.getDataValue('source')
        };
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'customerID': this.getDataValue('customerID'),
          'driverLicenseID': this.getDataValue('driverLicenceID'),
          'email': this.getDataValue('email'),
          'phone': this.getDataValue('phone'),
          'address': this.getDataValue('streetAddress'),
          'city': this.getDataValue('city'),
          'state': this.getDataValue('state'),
          'zipCode': this.getDataValue('postalCode'),
          'source': this.getDataValue('source')
        };
      }
    },

    classMethods : {

      dscUpsert: function(data){

        var searchOptions = {};
        //Customer Identifiers
        if (data.CustomerId) searchOptions.dscCustomerID = data.CustomerId;
        if (data.FirstName) searchOptions.firstName = data.FirstName;
        if (data.LastName) searchOptions.lastName = data.LastName;
        if (data.MiddleInitial) searchOptions.middleInitial = data.MiddleInitial;
        if (data.PhoneNumber) searchOptions.phone = data.PhoneNumber;
        if (data.EmailAddress) searchOptions.email = data.EmailAddress;


        //console.log(searchOptions);

        //customer values to upsert
        var upsertValues = {
          driverLicenseID: data.DriversLicenseNo,
          dscCustomerID: data.CustomerId,
          firstName: data.FirstName,
          middleInitial: data.MiddleInitial,
          lastName: data.LastName,
          phone:data.PhoneNumber,
          dateOfBirth: data.Birthday,
          email:data.EmailAddress,
          streetAddress:data.AddressLine1 + '' + ((data.AddressLine2 !== null ) ? data.AddressLine2 : '') ,
          city:data.City,
          state:data.StateName,
          country: data.Country,
          postalCode:data.PostalCode,
          createdAt: data.DateCreated
        };

        //find existing customer or create
        return this.findOrCreate({
          where: searchOptions,
          defaults: upsertValues
        }).spread(function(customer, created){
          if (!created){
            //console.log(' *** I am updated the customer data ****');
            return customer.update(upsertValues,
              { fields: [
                'driverLicenseID',
                'firstName',
                'middleInitial',
                'lastName',
                'phone',
                'dateOfBirth',
                'email',
                'streetAddress',
                'city',
                'state',
                'country',
                'postalCode',
              ] })
              .then(function(customer){
                return customer;
              })
          } else return customer;
        }).catch(function(err){
            console.log('*** An error occured while creating '+searchOptions.firstName+' '+searchOptions.lastName);
            console.log(err);
            return err;
        });
      }
    },

    instanceMethods: {

    }

  });

  return Customer;

}
