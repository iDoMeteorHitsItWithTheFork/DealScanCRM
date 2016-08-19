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
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postalCode: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Walk In'
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
        var address = ''
        if (this.getDataValue('streetAddress')) address += this.getDataValue('streetAddress');
        if (this.getDataValue('city')) address += ' '+this.getDataValue('city');
        if (this.getDataValue('state')) address += ' '+this.getDataValue('state');
        if (this.getDataValue('postalCode')) address += ' '+this.getDataValue('postalCode');
        return {
          'customerID': this.getDataValue('customerID'),
          'driverLicenseID': this.getDataValue('driverLicenceID'),
          'firstName': this.getDataValue('firstName'),
          'lastName': this.getDataValue('lastName'),
          'middleInitial': this.getDataValue('middleInitial'),
          'dateOfBirth': this.getDataValue('dateOfBirth'),
          'name': this.getDataValue('firstName') +' '+middleInitial+' ' + this.getDataValue('lastName'),
          'email': this.getDataValue('email'),
          'phone': this.getDataValue('phone'),
          'streetAddress': this.getDataValue('streetAddress'),
          'city': this.getDataValue('city'),
          'state': this.getDataValue('state'),
          'zipCode': this.getDataValue('postalCode'),
          'address': address,
          'source': this.getDataValue('source')
        };
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'customerID': this.getDataValue('customerID'),
          'driverLicenseID': this.getDataValue('driverLicenceID'),
          'firstName': this.getDataValue('firstName'),
          'lastName': this.getDataValue('lastName'),
          'middleInitial': this.getDataValue('middleInitial'),
          'dateOfBirth': this.getDataValue('dateOfBirth'),
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
      isScheduledLead: function(customer, t){
        var Lead = sequelize.models.Lead;
        var Participants = sequelize.models.Participants;
        var Event = sequelize.models.Event;
        var moment = require('moment');

        var searchOptions = {};
        if (customer.firstName) searchOptions.firstName = customer.firstName;
        if (customer.lastName) searchOptions.lastName = customer.lastName;

        return Event.findAll({
          where: {
            category: 'appointment',
            status: 'scheduled',
            time: {
              $gte: moment().subtract(2, 'days').startOf('day'),
              $lte: moment().endOf('day')
            }
          },
          include: {
            model: Lead,
            required: true,
            through: Participants,
            where: searchOptions
          },
          transaction: t
        }).then(function(appointments){

          if (appointments.length > 1){

              var idx = -1;
              for (var i = 0; i < appointments.length; i++){
                var lead = appointments[i].Lead;
                if ((lead.phone && lead.phone.toString().trim() != '') && (customer.phone && customer.phone.toString().trim() != '')){
                   if (lead.phone == customer.phone){
                     idx = i;
                     break;
                   }
                } else if ((lead.email && lead.email.toString().trim() != '') && (customer.email && customer.email.toString().trim() != '')){
                   if (lead.email == customer.email){
                     idx = i;
                     break;
                   }
                }
              }
              if (idx != -1) {
                return appointments[idx].update({
                  status: 'kept'
                }, {transaction: t}).then(function(){
                  return customer;
                })
              } else return customer;

           } else if (appointments.length == 1) {
             return appointments[0].update({
               status: 'kept'
             }, {transaction: t}).then(function(){
                return customer;
             });
           } else return customer;

        }).catch(function(err){
          console.log(err);
          return customer;
        })
      },
      isSoldLead: function(customer, t){

        var Lead = sequelize.models.Lead;
        var Participants = sequelize.models.Participants;
        var Event = sequelize.models.Event;
        var moment = require('moment');

        var searchOptions = {};
        if (customer.firstName) searchOptions.firstName = customer.firstName;
        if (customer.lastName) searchOptions.lastName = customer.lastName;

        return Event.findAll({
          where: {
            category: 'appointment',
            status: 'kept',
            time: {
              $gte: moment().subtract(2, 'days').startOf('day'),
              $lte: moment().endOf('day')
            }
          },
          include: {
            model: Lead,
            required: true,
            through: Participants,
            where: searchOptions
          },
          transaction: t
        }).then(function(appointments){

          if (appointments.length > 1){

            var idx = -1;
            for (var i = 0; i < appointments.length; i++){
              var lead = appointments[i].Lead;
              if ((lead.phone && lead.phone.toString().trim() != '') && (customer.phone && customer.phone.toString().trim() != '')){
                if (lead.phone == customer.phone){
                  idx = i;
                  break;
                }
              } else if ((lead.email && lead.email.toString().trim() != '') && (customer.email && customer.email.toString().trim() != '')){
                if (lead.email == customer.email){
                  idx = i;
                  break;
                }
              }
            }
            if (idx != -1) {
              return appointments[idx].update({
                status: 'sold'
              }, {transaction: t}).then(function(){
                return customer;
              })
            } else return customer;

          } else if (appointments.length == 1) {
            return appointments[0].update({
              status: 'sold'
            }, {transaction: t}).then(function(){
              return customer;
            });
          } else return customer;

        }).catch(function(err){
          console.log(err);
          return customer;
        })
      },
      dscUpsert: function(data, t){

        var searchOptions = {};
        //Customer Identifiers
        if (data.CustomerId && data.CustomerId.toString().trim() != '') searchOptions.dscCustomerID = data.CustomerId;
        if (data.FirstName && data.FirstName.toString().trim() != '') searchOptions.firstName = data.FirstName;
        if (data.LastName && data.LastName.toString().trim() != '') searchOptions.lastName = data.LastName;
        if (data.MiddleInitial && data.MiddleInitial.toString().trim() != '') searchOptions.middleInitial = data.MiddleInitial.substr(0,1);

        /*console.log('\n\n\n CUSTOMER SEARCH OPTIONS \n\n\n');
        console.log(searchOptions);
        console.log('\n\n\n\n _______________________\n\n\n');*/

        //customer values to upsert
        var upsertValues = {
          driverLicenseID: data.DriversLicenseNo,
          dscCustomerID: data.CustomerId,
          firstName: data.FirstName,
          middleInitial: (data.MiddleInitial && data.MiddleInitial.trim() != '') ? data.MiddleInitial.substr(0,1) : '',
          lastName: data.LastName,
          phone:data.PhoneNumber,
          dateOfBirth: data.Birthday,
          email:data.EmailAddress,
          streetAddress:data.AddressLine1 + '' + ((data.AddressLine2 !== null ) ? data.AddressLine2 : '') ,
          city:data.City,
          state:data.StateName,
          country: 'USA',
          source: (data.MarketingTypeName && data.MarketingTypeName.trim() != '') ? data.MarketingTypeName : 'Walk In',
          postalCode:data.PostalCode,
          createdAt: data.DateCreated
        };

        //find existing customer or create
        return this.findOrCreate({
          where: searchOptions,
          defaults: upsertValues,
          transaction: t
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
              ] }, {transaction: t})
              .then(function(customer){
                return Customer.isScheduledLead(customer, t);
                //return customer;
              })
          } else {
            return Customer.isScheduledLead(customer, t);
            //return customer;
          }
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
