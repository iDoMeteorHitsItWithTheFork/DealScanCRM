'use strict';

export default function(sequelize, DataTypes) {

  var Deal =  sequelize.define('Deal', {
    dealID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    dscDealID: DataTypes.BIGINT,
    retailValue: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    salePrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    paymentOption: {
      type: DataTypes.ENUM,
      values: ['cash', 'financed'],
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.ENUM,
      values: ['working', 'won', 'pending', 'sold', 'delivered','lost', 'other'],
      defaultValue: 'working',
      allowNull: false,
      validate:{
        notEmpty: true
      }
    }

  }, {
    /**
     * Virtual Getters
     */
    getterMethods: {
      //Public profile information
      profile: function () {
        return {
          'dealID': this.getDataValue('dealID'),
          'retailValue': this.getDataValue('retailValue'),
          'salePrice': this.getDataValue('salePrice'),
          'paymentOption': this.getDataValue('paymentOption'),
          'status': this.getDataValue('status')
        }
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'dealID': this.getDataValue('dealID'),
          'retailValue': this.getDataValue('retailValue'),
          'salePrice': this.getDataValue('salePrice'),
          'paymentOption': this.getDataValue('paymentOption'),
          'status': this.getDataValue('status')
        }
      }
    },

    classMethods: {
      dscUpsert: function (data, customer) {

        console.log('\n\n>> Upserting Deal['+data.DealId+']...');

        //required entities
        if (!data.DealershipId) return new Error('DealershipId is required');
        if (!data.DealershipName) return new Error('Dealership Info is required');
        if (!data.Vehicle) return new Error('Vehicle Info is required');
        if (!data.SalesPersonFirstName) return new Error('SalePerson FirstName is required');
        if (!data.SalesPersonLastName) return new Error('SalePerson LastName is required');
        if (!data.SalesPersonId) return new Error('SalePersonId is required');

        var searchOptions = {};
        if (data.DealId) searchOptions.dscDealID = data.DealId;

        var upsertValues = {
          dscDealID: data.DealId,
          retailValue: data.RetailValue,
          salePrice: data.SalesPrice,
          paymentOption: data.SelectedPaymentOptions ? 'cash' : 'financed',
          status: data.DealStatusTypeName,
        }

        return Deal.sequelize.transaction(function (t) {
          return Deal.findOrCreate({
            where: searchOptions,
            defaults: upsertValues,
            transaction: t
          }).spread(function (deal, created) {
            console.log('\n>> Deal Created...');
            var Dealership = sequelize.models.Dealership;
            var User = sequelize.models.User;
            var Buyer = sequelize.models.Customer;
            var Vehicle = sequelize.models.Vehicle;
            if (created) {
              console.log('\n>> Looking For Dealership...');
              return Dealership.find({
                where: {
                  dealershipName: data.DealershipName
                },
                transaction: t
              }).then(function (dealership) {
                console.log('\n>> Assigning Deal to [' + data.DealershipName + ']...');
                return deal.setDealership(dealership, {transaction: t})
                  .then(function (res) {
                    console.log('\n>> Deal Assigned to [' + data.DealershipName + ']');
                    console.log('\n>> Identifying Sale Person...');
                    return User.find({
                      where: {
                        firstName: data.SalesPersonFirstName,
                        lastName: data.SalesPersonLastName,
                        dscUserID: data.SalesPersonId
                      },
                      transaction: t
                    }).then(function (salesRep) {
                        if (!salesRep) throw new Error('SalePerson Doesn\'t Exit');
                        console.log('\n\n>> Sale Person Indentified.');
                        return deal.setSaleRep(salesRep, {transaction: t})
                          .then(function (res) {
                            console.log('\n>> Sale Rep was assigned to Deal.');
                            console.log('\n>> Identifying Vehicle...');
                            return Vehicle.dscUpsert(data.Vehicle, t)
                              .then(function (vehicle) {
                                console.log('\n>> Vehicle Identified.');
                                console.log('\n>> Assigning Vehicle to Deal...');
                                return deal.setPurchase(vehicle, {transaction: t})
                                  .then(function(purchase){
                                     console.log('\n>> Vehicle Assigned to Deal.');
                                     console.log('\n>> Assigning Buyer to Deal...');
                                     return deal.setBuyer(customer, {transaction: t})
                                       .then(function(buyer){
                                          console.log('\n>> Buyer Assigned to Deal.');
                                        return buyer;
                                     })
                                })
                              })
                          })
                      })
                  });
              })
            } else {

            }
          })
        }).catch(function (err) {
          console.log('An error occurred while trying to upsert Deal['+data.DealId+']!');
          console.log(err);
          return err;
        });
      }

    }

  });

  return Deal;
}
