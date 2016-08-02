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
      values: ['won','lost','other'],
      defaultValue: 'lost',
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
      dscSetCoBuyer: function(Buyer, data, deal, t){
        if (data.CoBuyer) {
          return Buyer.dscUpsert(data.CoBuyer, t)
            .then(function (coBuyer) {
              console.log('\n>> Deal['+data.DealId+']  -> Adding Co-Buyer to Deal...');
              return deal.setCoBuyers(coBuyer, {transaction: t})
                .then(function (res) {
                  console.log('\n>> Deal['+data.DealId+']  -> Are There Trade on this Deal?');
                  return Deal.dscSetTrade(data, deal, t);
                });
            })
        } else {
          console.log('\n>> Deal['+data.DealId+']  -> There are no CoBuyers.');
          return Deal.dscSetTrade(data, deal, t);
        }
      },
      dscSetTrade: function(data, deal, t){
        var Trade = sequelize.models.Trade;
        if (data.Trade) {
          console.log('\n>> Deal['+data.DealId+']  -> Upserting Trade Data');
          return Trade.dscUpsert(data.Trade, data.TradeValue, t)
            .then(function (trade) {
              console.log('\n>> Deal['+data.DealId+']  -> Assigning Trade To Deal...');
              return trade.setDeal(deal, {transaction: t})
                .then(function (res) {
                  console.log('\n>> Deal['+data.DealId+']  -> Trade was added to Deal.');
                  console.log('\n>> Deal['+data.DealId+']  -> Was This Deal Financed?');
                  return Deal.dscSetFinancing(data, deal, t);
                })
            });
        } else {
          console.log('\n>> Deal['+data.DealId+']  -> There are no Trades.');
          console.log('\n>> Deal['+data.DealId+']  -> Was This Deal Financed?');
          return Deal.dscSetFinancing(data, deal, t);
        }
      },
      dscSetFinancing: function(data, deal, t){
        var Finance = sequelize.models.Financing;
        if (data.SelectedPaymentOptions &&
          data.SelectedPaymentOptions[0] &&
          data.SelectedPaymentOptions[0].Term > 1) {
          return Finance.dscUpsert(data.SelectedPaymentOptions[0],
            deal.dealID, data.RemainingBalance, t)
            .then(function (financing) {
              console.log('\n>> Deal['+data.DealId+']  -> Adding Financing Details to Deal...');
              return financing.setDeal(deal, {transaction: t})
                .then(function (res) {
                  console.log('\n>> Deal['+data.DealId+']  -> Financing Details Added to Deal.');
                  console.log('\n\n\n\n\n*********************************')
                  console.log('*    Deal['+data.DealId+'] Successfully Inserted!   *');
                  console.log('*************************************');
                  return deal;
                })
            })
        } else {
          console.log('\n>> Deal['+data.DealId+']  -> There are no financing on this deal.');
          console.log('\n\n\n\n\n*********************************')
          console.log('*    Deal['+data.DealId+'] Successfully Inserted!   *');
          console.log('*************************************');
          return deal;
        }
      },
      dscSetRebate: function(){

      },
      dscUpsert: function (data, customer) {

        console.log('\n\n>> Upserting Deal[' + data.DealId + ']...');

        //required entities
        if (!data.DealershipId) throw new Error('DealershipId is required');
        if (!data.DealershipName) throw new Error('Dealership Info is required');
        if (!data.Vehicle) throw new Error('Vehicle Info is required');
        if (!data.SalesPersonFirstName) throw new Error('SalePerson FirstName is required');
        if (!data.SalesPersonLastName) throw new Error('SalePerson LastName is required');
        if (!data.SalesPersonId) throw new Error('SalePersonId is required');

        var searchOptions = {};
        if (data.DealId) searchOptions.dscDealID = data.DealId;
        var dealStatus  = '';
        switch(data.DealStatusTypeName){
          case 'working':
          case 'pending':
              dealStatus = 'lost';
              break;
          case 'sold':
          case 'delivered':
             dealStatus = 'won';
             break;
          default:
            dealStatus = 'lost';
            break;
        }
        var upsertValues = {
          dscDealID: data.DealId,
          retailValue: data.RetailValue,
          salePrice: data.SalesPrice,
          paymentOption: (data.SelectedPaymentOptions && data.SelectedPaymentOptions[0] && data.SelectedPaymentOptions[0].Term > 1) ? 'financed' : 'cash',
          status: dealStatus,
        }

        return Deal.sequelize.transaction(function (t) {
          return Deal.findOrCreate({
            where: searchOptions,
            defaults: upsertValues,
            transaction: t
          }).spread(function (deal, created) {
            console.log('\n>> Deal['+data.DealId+']  -> Deal Created...');
            var Dealership = sequelize.models.Dealership;
            var User = sequelize.models.User;
            var Buyer = sequelize.models.Customer;
            var Vehicle = sequelize.models.Vehicle;

            if (created) {
              console.log('\n>> Deal['+data.DealId+']  -> Looking For Dealership...');
              return Dealership.find({
                where: {
                  dealershipName: data.DealershipName
                },
                transaction: t
              }).then(function (dealership) {
                console.log('\n>> Deal['+data.DealId+']  -> Assigning Deal to [' + data.DealershipName + ']...');
                return deal.setDealership(dealership, {transaction: t})
                  .then(function (res) {
                    console.log('\n>> Deal['+data.DealId+']  -> Deal Assigned to [' + data.DealershipName + ']');
                    console.log('\n>> Deal['+data.DealId+']  -> Identifying Sale Person...');
                    return User.find({
                      where: {
                        firstName: data.SalesPersonFirstName,
                        lastName: data.SalesPersonLastName,
                        dscUserID: data.SalesPersonId
                      },
                      transaction: t
                    }).then(function (salesRep) {
                      if (!salesRep) throw new Error('SalePerson Doesn\'t Exit');
                      console.log('\n\n>> Deal['+data.DealId+']  -> Sale Person Indentified.');
                      return deal.setSaleRep(salesRep, {transaction: t})
                        .then(function (res) {
                          console.log('\n>> Deal['+data.DealId+']  -> Sale Rep was assigned to Deal.');
                          console.log('\n>> Deal['+data.DealId+']  -> Identifying Vehicle...');
                          return Vehicle.dscUpsert(data.Vehicle, t)
                            .then(function (vehicle) {
                              console.log('\n>> Deal['+data.DealId+']  -> Vehicle Identified.');
                              console.log('\n>> Deal['+data.DealId+']  -> Assigning Vehicle to Deal...');
                              return deal.setPurchase(vehicle, {transaction: t})
                                .then(function (purchase) {
                                  console.log('\n>> Deal['+data.DealId+']  -> Vehicle Assigned to Deal.');
                                  console.log('\n>> Deal['+data.DealId+']  -> Assigning Buyer to Deal...');
                                  return deal.setBuyer(customer, {transaction: t})
                                    .then(function (buyer) {
                                      console.log('\n>> Deal['+data.DealId+']  -> Buyer Assigned to Deal.');
                                      console.log('\n>> Deal['+data.DealId+']  -> Is there a Co-Buyer?');
                                      return Deal.dscSetCoBuyer(Buyer, data, deal, t);
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
          console.log('An error occurred while trying to upsert Deal[' + data.DealId + ']!');
          console.log(err);
          return err;
        });
      }

    }

  });

  return Deal;
}
