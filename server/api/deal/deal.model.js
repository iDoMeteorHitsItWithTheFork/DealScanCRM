'use strict';

export default function(sequelize, DataTypes) {

  var Deal =  sequelize.define('Deal', {
    dealID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    dscDealID: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
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
      values: ['working', 'pending', 'sold', 'delivered','lost', 'other'],
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
          'status' : this.getDataValue('status')
        }
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'dealID': this.getDataValue('dealID'),
          'retailValue': this.getDataValue('retailValue'),
          'salePrice': this.getDataValue('salePrice'),
          'paymentOption': this.getDataValue('paymentOption'),
          'status' : this.getDataValue('status')
        }
      }
    },

    classMethods: {
      dscUpsert:function(data){

        //required entities
        if (!data.DealershipName) return new Error('Dealership Info is required');
        if (!data.VehicleUpdate) return new Error('Vehicle Info is required');
        if (!data.CustomerUpdate) return new Error('Customer Info is required');

        var searchOptions = {};
        if (data.DealId) searchOptions.dscDealID = data.DealId;

        var upsertValues = {
          dscDealID: data.DealId,
          retailValue: data.RetailValue,
          salePrice: data.SalesPrice,
          paymentOption: data.PaymentOptions.IsCashOption ? 'cash' : 'financed',
          status: data.DealStatusTypeName,
        }
        //look for deal or create it
        return this.findOrCreate({
          where: searchOptions,
          defaults: upsertValues
        }).spread(function (deal, created) {
          var Dealership = sequelize.models.Dealership;
          var User = sequelize.models.User;
          var Buyer = sequelize.models.Customer;
          var Vehicle = sequelize.models.Vehicle;
          //Deal was created
          if (created) {
            return Dealership.find({
              where: {
                dealershipName: data.DealershipName
              }
            }).then(function (dealership) {
              //set Deal DealershipID
              if (dealership) {
                deal.setDealership(dealership);
                return dealership.getEmployees({
                  where: {
                    role: 'sale_rep',
                  }
                }).then(function (salesPeople) {
                  console.log('** Sales Poeple ***');
                  // Test Purposes Only

                  //Set Sales Person
                  if (salesPeople && salesPeople.length > 0) {
                    var rdx = Math.floor(Math.random() * salesPeople.length);
                    deal.setSaleRep(salesPeople[rdx]);
                    console.log('Deal was assigned to: \n');
                    console.log(salesPeople[rdx].get({plain: true}));
                    console.log('\n======================\n');
                  }

                  //Rebates Info
                  if (data.Rebates > 0){
                    var Rebate = sequelize.models.Rebate;
                    return Rebate.create({
                      amount: data.Rebates
                    }).then(function(rebate){
                      rebate.setDeal(deal);
                    }).catch(function(err){
                        return err;
                    })
                  }

                  //Financing Details
                  if (!data.PaymentOptions.IsCashOption){
                    //add financing info
                    // var Financing = sequelize.models.Financing;
                    // Financing.create({
                    //   installments: '',
                    //   interestRate: '',
                    //   monthlyPayment: '',
                    //   amountFinanced: ''
                    // }).then(function(financing){
                    //     if (financing) financing.setDeal(deal);
                    // }).catch(function(err){
                    //     console.log(err);
                    //     return err;
                    // })

                  }

                  //Trade Information
                  if (data.TradeUpdate && data.TradeUpdate.VehicleUpdate) {
                    //Add Trade to Deals

                  }

                  //set buyer (find or create buyer)
                  return Buyer.dscUpsert(data.CustomerUpdate)
                    .then(function (buyer) {
                      if (buyer) {
                        console.log('**** Setting Buyer ****\n');
                        console.log(buyer.get({plain: true}));
                        console.log('\n*********************\n');
                        deal.setBuyer(buyer);

                        //CoBuyer Logic

                        //set vehicle
                        return Vehicle.dscUpsert(data.VehicleUpdate)
                          .then(function(vehicle){
                            if (vehicle){
                              console.log('**** Setting Vehicle ****\n');
                              console.log(vehicle.get({plain: true}));
                              console.log('\n*********************\n');
                              deal.setPurchase(vehicle);
                              

                              //Generate Document Set [GENERATE DOCS SET]



                              return vehicle;
                            } else return new Error('Unable To Locate Vehicle');
                          })

                      } else return new Error('Unable To Locate Buyer');
                    })
                })
              } else {
                console.log(' I could not find the dealership ');
                return new Error('Unable To find Dealership');
              }
            }).catch(function (err) {
              console.log('Printing Error\n');
              console.log(err);
              console.log('\n\n=====================\n');
              return err;
            })
          } else {
            console.log('**** I am updating The Deal ****');
            return Deal.update(upsertValues, {
              fields: [
                'retailValue',
                'salePrice',
                'paymentOption',
                'status'
              ]
            }).then(function (updatedDeal) {


            }).catch(function (err) {
              console.log(err);
              return err;
            })
          }
        })

      }
    }

  } , {
    indexes: [
      {
        // name: 'dscDeal_index',
        fields: ['dscDealID']
      }
    ]
  });

  return Deal;
}


