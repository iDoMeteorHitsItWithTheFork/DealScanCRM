'use strict';

var moment = require('moment');

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
      values: ['pending','working','sold','delivered','other'],
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
      /**
       * Add Cobuyer to Deal Set
       * @param Buyer
       * @param data
       * @param deal
       * @param t
         * @returns {*}
         */
      dscSetCoBuyer: function(Buyer, data, deal, t){
        if (data.CoBuyer) {
          /***
           * Debug
           */
          console.log('\n>> Deal['+data.DealId+']  -> Creating Co-Buyer...');
          return Buyer.dscUpsert(data.CoBuyer, t)
            .then(function (coBuyer) {
              /***
               * Debug
               */
              console.log('\n>> Deal['+data.DealId+']  -> Adding Co-Buyer to Deal...');

              return deal.addCoBuyer(coBuyer, {transaction: t})
                .then(function (res) {
                  /***
                   * Debug
                   */
                  console.log('\n>> Deal['+data.DealId+']  -> Are There Trade on this Deal?');

                  return Deal.dscSetTrade(data, deal, t);
                });
            })
        } else {
          /***
           * Debug
           */
          console.log('\n>> Deal['+data.DealId+']  -> There are no CoBuyers.');

          return Deal.dscSetTrade(data, deal, t);
        }
      },

        /***
         * Add Trade details to Deal Set
         * @param data
         * @param deal
         * @param t
         * @returns {*}
         */
      dscSetTrade: function(data, deal, t){
        var Trade = sequelize.models.Trade;
        if (data.Trades) {
          /***
           * Debug
           */
          console.log('\n>> Deal['+data.DealId+']  -> Creating Trade...');

          return Trade.create({
            tradeAllowance: data.Trades.TradeValue,
            actualCashValue: data.Trades.ActualCashValue,
            payOffAmount: data.Trades.BalanceOwed,
            VIN: data.Trades.VIN,
            color: data.Trades.Color,
            createdAt: data.Trades.DateCreated,
            year: data.Trades.Year,
            make: data.Trades.Make,
            model: data.Trades.Model,
            mileage: data.Trades.Mileage,
            bodyStyle: data.Trades.BodyStyle,
          },{transaction: t})
            .then(function (trade) {
              /***
               * Debug
               */
              console.log('\n>> Deal['+data.DealId+']  -> Adding Trade To Deal...');

              return deal.addTrade(trade, {transaction: t})
                .then(function (res) {
                  /***
                   * Debug
                   */
                  console.log('\n>> Deal['+data.DealId+']  -> Trade was added to Deal.');
                  console.log('\n>> Deal['+data.DealId+']  -> Was This Deal Financed?');

                  return Deal.dscSetFinancing(data, deal, t);
                })
            });
        } else {
          /***
           * Debug
           */
          console.log('\n>> Deal['+data.DealId+']  -> There are no Trades.');
          console.log('\n>> Deal['+data.DealId+']  -> Was This Deal Financed?');

          return Deal.dscSetFinancing(data, deal, t);
        }
      },


        /**
         *  Add Financing Details to deal Set
         * @param data
         * @param deal
         * @param t
         * @returns {*}
         */
      dscSetFinancing: function(data, deal, t){
        var Finance = sequelize.models.Financing;
        if (data.SelectedPaymentOption) {
          /**
           * Debug
           */
          console.log('\n>> Deal['+data.DealId+']  -> Creating Financing Details...');
          return Finance.create({
              downPayment: data.SelectedPaymentOption.DownPayment,
              installments: data.SelectedPaymentOption.Term,
              interestRate: data.SelectedPaymentOption.Rate,
              monthlyPayment: data.SelectedPaymentOption.Payment,
            },{transaction: t})
            .then(function (financing) {
              /***
               * Debug
               */
              console.log('\n>> Deal['+data.DealId+']  -> Adding Financing Details to Deal...');

              return deal.setFinancing(financing, {transaction: t})
                .then(function (res) {
                  /***
                   * Debug
                   */
                  console.log('\n>> Deal['+data.DealId+']  -> Financing Details Added to Deal.');
                  console.log('\n\n\n\n\n*******************************************')
                  console.log('*    Deal['+data.DealId+'] Successfully Inserted!   *');
                  console.log('*********************************************');

                  return Deal.dscSetRebate(data, deal, t);
                })
            })
        } else {
          /***
           * Debug
           */
          console.log('\n>> Deal['+data.DealId+']  -> There are no financing on this deal.');
          console.log('\n >> Does this deal have any rebates? ');

          return Deal.dscSetRebate(data, deal, t);
        }
      },

        /**
         * Add Rebate Information to Deal Set
         * @param data
         * @param deal
         * @param t
         * @returns {*}
         */
      dscSetRebate: function(data, deal, t){
        var Rebate = sequelize.models.Rebate;
        if (data.Rebates){
          /**
           * Debug
           */
          console.log('\n>> Deal['+data.DealId+']  -> Creating Rebate...');

          return Rebate.create({
            amount: data.Rebates
          }, {transaction: t}).then(function(rebate){
            /**
             * Debug
             */
            console.log('\n>> Deal['+data.DealId+']  -> Adding Rebate to Deal...');
             return deal.addRebate(rebate, {transaction: t})
               .then(function(res){
                 /***
                  * Debug
                  */
                 console.log('\n>> Deal['+data.DealId+']  -> Rebate was added to Deal');
                 console.log('\n\n\n\n\n******************************************')
                 console.log('*    Deal['+data.DealId+'] Successfully Inserted!   *');
                 console.log('*********************************************');

                 return deal;
             });
          });
        } else {
          /***
           * Debug
           */
          console.log('\n\n\n\n\n*******************************************')
          console.log('*    Deal['+data.DealId+'] Successfully Inserted!   *');
          console.log('*********************************************');

          return deal;
        }
      },

        /**
         * Synchronize Deal From DealScan DB
         * @param data
         * @param customer
         * @returns {*}
         */
      dscUpsert: function (data, customer) {

          /**
           * Debug
           */
        console.log('\n\n>> Upserting Deal[' + data.DealId + ']...');

        //required entities
        if (!data.DealershipId || data.DealershipId.toString().trim() == '') throw new Error('DealershipId is required');
        if (!data.DealershipName || data.DealershipName.toString().trim() == '') throw new Error('Dealership Info is required');
        if (!data.Vehicle) throw new Error('Vehicle Info is required');
        if (!data.SalesPersonFirstName || data.SalesPersonFirstName.toString().trim() == '') throw new Error('SalePerson FirstName is required');
        if (!data.SalesPersonLastName || data.SalesPersonLastName.toString().trim() == '') throw new Error('SalePerson LastName is required');
        if (!data.SalesPersonId || data.SalesPersonId.toString().trim() == '') throw new Error('SalePersonId is required');

        var searchOptions = {};
        if (data.DealId) searchOptions.dscDealID = data.DealId;

        var createdAt = '';
        if (data.DateCreated && data.DateCreated.toString().trim() != '') createdAt = data.DateCreated;



        var upsertValues = {
          dscDealID: data.DealId,
          retailValue: data.RetailValue,
          salePrice: data.SalesPrice,
          paymentOption: (data.SelectedPaymentOption && data.SelectedPaymentOption.Term > 1) ? 'financed' : 'cash',
          status: data.DealStatusTypeName,
          createdAt: (createdAt && createdAt.toString().trim() != '') ? createdAt : moment()
        }

        return Deal.sequelize.transaction(function (t) {
          return Deal.findOrCreate({
            where: searchOptions,
            defaults: upsertValues,
            transaction: t
          }).spread(function (deal, created) {

            /***
             * Debug
             */
            console.log('\n>> Deal['+data.DealId+']  -> Deal Initiated...');

            var Dealership = sequelize.models.Dealership;
            var User = sequelize.models.User;
            var Buyer = sequelize.models.Customer;
            var Vehicle = sequelize.models.Vehicle;

            if (created) {
              /***
               * Debug
               */
              console.log('\n>> Deal['+data.DealId+']  -> Looking For Dealership...');

              return Dealership.find({
                where: {
                  dealershipName: data.DealershipName
                },
                transaction: t
              }).then(function (dealership) {
                /***
                 * Debug
                 */
                console.log('\n>> Deal['+data.DealId+']  -> Assigning Deal to [' + data.DealershipName + ']...');

                return deal.setDealership(dealership, {transaction: t})
                  .then(function (res) {
                    /***
                     * Debug
                     */
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
                      /***
                       * Debug
                       */
                      console.log('\n\n>> Deal['+data.DealId+']  -> Sale Person Indentified.');

                      return deal.setSaleRep(salesRep, {transaction: t})
                        .then(function (res) {
                          /***
                           * Debug
                           */
                          console.log('\n>> Deal['+data.DealId+']  -> Sale Rep was assigned to Deal.');
                          console.log('\n>> Deal['+data.DealId+']  -> Identifying Vehicle...');

                          return Vehicle.dscUpsert(data.Vehicle, t)
                            .then(function (vehicle) {
                              /***
                               * Debug
                               */
                              console.log('\n>> Deal['+data.DealId+']  -> Vehicle Identified.');
                              console.log('\n>> Deal['+data.DealId+']  -> Assigning Vehicle to Deal...');

                              return deal.setPurchase(vehicle, {transaction: t})
                                .then(function (purchase) {
                                  /***
                                   * Debug
                                   */
                                  console.log('\n>> Deal['+data.DealId+']  -> Vehicle Assigned to Deal.');
                                  console.log('\n>> Deal['+data.DealId+']  -> Assigning Buyer to Deal...');

                                  return deal.setBuyer(customer, {transaction: t})
                                    .then(function (buyer) {
                                      /***
                                       * Debug
                                       */
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
              /**
               * Debug
               */
              console.log('\n>> Deal['+data.DealId+']  -> Updating Deal Data...');
              var updatedAt = '';
              if (data.DateStatusChanged && data.DateStatusChanged.toString().trim() != '') updatedAt = data.DateStatusChanged;
              return deal.update(
                {
                  retailValue: upsertValues.retailValue,
                  salePrice: upsertValues.salePrice,
                  paymentOption: upsertValues.paymentOption,
                  status: upsertValues.status,
                  createdAt: (updatedAt && updatedAt.toString().trim() != '') ? updatedAt : moment()

                }, {
                  fields: [
                    'retailValue',
                    'salePrice',
                    'paymentOption',
                    'status',
                    'createdAt'
                  ]
                }, {transaction: t}).then(function(){
                  /**
                   * Debug
                   */
                  console.log('\n>> Deal['+deal.dscDealID+'] -> (RetailValue, SalePrice, PaymentOption, Status) Updated!');
                  console.log('\n>> Deal['+deal.dscDealID+'] -> Retrieving SaleRep Details...');
                  return deal.getSaleRep({transaction: t}).then(function(salesRep){
                    /**
                     * Debug
                     */
                    console.log('\n>> Deal['+deal.dscDealID+'] -> Has SalesRep Changed?');
                    if (salesRep && salesRep.dscUserID != data.SalesPersonId) {
                      /**
                       * Debug
                       */
                      console.log('\n>> Deal[' + deal.dscDealID + '] -> Sales Rep hasn\'t changed...');
                      console.log('\n>> Deal[' + deal.dscDealID + '] -> Has Purchase changed?');
                      return Deal.dscUpdatePurchase(data, deal, customer, t);

                    } else return Deal.dscUpdateSaleRep(data, deal, customer, t);

                  });
              });
            }
          })
        })
          .then(function(deal){
            if (deal.status == 'sold'){
              return Deal.sequelize.transaction(function(t){
                return deal.getBuyer({transaction: t}).then(function(buyer){
                   var Buyer = sequelize.models.Customer;
                   //return Buyer.isSoldLead(buyer, t).then(function(){
                     return deal;
                   //})
                })
              }).then(function(){
                return deal;
              });
            } else return deal;
        })
          .catch(function (err) {
          console.log('An error occurred while trying to upsert Deal[' + data.DealId + ']!');
          console.log(err);
          return err;
        });
      },

      /**
       * Update Sales Rep information
       * @param data
       * @param deal
       * @param t
       */
      dscUpdateSaleRep: function (data, deal, customer, t) {
        var User = sequelize.models.User;
        /**
         * Debug
         * */
        console.log('\n>> Deal[' + deal.dscDealID + '] -> Retrieving New SalesPerson Info...');

        return User.find({
          where: {
            firstName: data.SalesPersonFirstName,
            lastName: data.SalesPersonLastName,
            dscUserID: data.SalesPersonId
          },
          transaction: t
        }).then(function(newSalesRep){
          /**
           * Debug
           */
          console.log('\n>> Deal[' + deal.dscDealID + '] -> New SalesRep Identified...');
          console.log('\n>> Deal[' + deal.dscDealID + '] -> Adding New SalesRep to Deal...');

          return deal.setSaleRep(newSalesRep, {transaction: t}).then(function(res){
            /**
             * Debug
             */
            console.log('\n>> Deal[' + deal.dscDealID + '] -> New SalesRep Added to Deal...');
            console.log('\n>> Deal[' + deal.dscDealID + '] -> Has Purchase changed? ');

            return Deal.dscUpdatePurchase(data, deal, customer, t);
          })
        })

      },

      /**
       * Updating Purchase Info on Deal
       * @param data
       * @param deal
       * @param t
       */
      dscUpdatePurchase: function(data, deal, customer, t){
        /**
         * Debug
         */
        console.log('\n>> Deal[' + deal.dscDealID + '] -> Retrieving Purchase Details...');

        return deal.getPurchase({transaction: t}).then(function(purchase){
          if (purchase && purchase.VIN != data.Vehicle.VIN && purchase.stockNumber != data.Vehicle.StockNumber) {
            var Vehicle = sequelize.models.Vehicle;
            /**
             * Debug
             */
            console.log('\n>> Deal[' + deal.dscDealID + '] -> Creating New Purchase Details...');

            return Vehicle.dscUpsert(data.Vehicle, t).then(function(newPurchase){
              /**
               * Debug
               */
              console.log('\n>> Deal['+data.DealId+']  -> New Vehicle Identified.');
              console.log('\n>> Deal['+data.DealId+']  -> Assigning New Vehicle to Deal...');

              return deal.setPurchase(newPurchase, {transaction: t}).then(function(){
                /**
                 * Debug
                 */
                console.log('\n>> Deal['+data.DealId+']  -> New Vehicle Assigned to Deal.');
                console.log('\n>> Deal['+data.DealId+']  -> Has Buyer changed?');

                return Deal.dscUpdateBuyer(data, deal, customer, t);
              })

            });

          } else {
            /**
             * Debug
             */
            console.log('\n>> Deal[' + deal.dscDealID + '] -> Has Buyer changed? ');

            return Deal.dscUpdateBuyer(data, deal, customer, t);
          }
        })


      },

      /**
       * Update Buyer Information
       * @param data
       * @param deal
       * @param t
       */
      dscUpdateBuyer: function(data, deal, customer, t){
        var Buyer  = sequelize.models.Customer;
        return deal.getBuyer({transaction: t}).then(function(buyer){
          if (buyer && buyer.customerID != customer.customerID && buyer.dscCustomerID != customer.dscCustomerID) {
            /**
             * Debug
             */
            console.log('\n>> Deal['+data.DealId+']  -> Assigning New Buyer to Deal...');

            return deal.setBuyer(customer, {transaction: t}).then(function(){
              /**
               * Debug
               */
              console.log('\n>> Deal['+data.DealId+']  -> New Buyer Assigned to Deal.');
              console.log('\n>> Deal['+data.DealId+']  -> Has CoBuyer changed? ');

              return Deal.dscUpdateCoBuyer(data, deal, t);

            });

          } else {
            /**
             * Debug
             */
            console.log('\n>> Deal[' + deal.dscDealID + '] -> Has CoBuyer changed? ');

            return Deal.dscUpdateCoBuyer(data, deal, t);
          }
        })

      },

      /**
       * Update CoBuyer Information
       * @param data
       * @param deal
       * @param t
       */
      dscUpdateCoBuyer: function(data, deal, t){

        if (data.CoBuyer) {
          var Buyer = sequelize.models.Customer;
          /**
           * Debug
           */
          console.log('\n>> Deal[' + deal.dscDealID + '] -> Upserting CoBuyer Details...');

          return Buyer.dscUpsert(data.CoBuyer, t).then(function (newCoBuyer) {
            /**
             * Debug
             */
            console.log('\n>> Deal[' + deal.dscDealID + '] -> Adding New CoBuyer to Deal...');
            return deal.setCoBuyers([newCoBuyer], {transaction:t}).then(function(){
              /**
               * Debug
               */
              console.log('\n>> Deal[' + deal.dscDealID + '] -> New CoBuyer Added to Deal...');
              console.log('\n>> Deal[' + deal.dscDealID + '] -> Has Trade Info changed? ');

              return Deal.dscUpdateTrade(data, deal, t);
            })

          })


        } else {
          /**
           * Debug
           */
          console.log('\n>> Deal[' + deal.dscDealID + '] -> No CoBuyer!');
          console.log('\n>> Deal[' + deal.dscDealID + '] -> Removing CoBuyer From Deal (if applicable)...');

          return deal.setCoBuyers([], {transaction: t}).then(function () {
            /**
             * Debug
             */
            console.log('\n>> Deal[' + deal.dscDealID + '] -> Removed CoBuyer From Deal.');
            console.log('\n>> Deal[' + deal.dscDealID + '] -> Has Traded Info changed? ');

            return Deal.dscUpdateTrade(data, deal, t);
          })
        }

      },

      /**
       * Update Financing Details
       * @param data
       * @param deal
       * @param t
       */
      dscUpdateTrade: function(data, deal, t){

        if (data.Trades){
          var Trade = sequelize.models.Trade;
          /**
           * Debug
           */
          console.log('\n>> Deal[' + deal.dscDealID + '] -> Creating Trade...');
          return Trade.dscUpsert(data.Trades, t).then(function(newTrade){
            /**
             * Debug
             */
            console.log('\n>> Deal[' + deal.dscDealID + '] -> Setting New Trades for Deal...');
            return deal.setTrades([newTrade], {transaction: t}).then(function(){
              /**
               * Debug
               */
              console.log('\n>> Deal[' + deal.dscDealID + '] -> Trade Added to Deal.');
              console.log('\n>> Deal[' + deal.dscDealID + '] -> Has Financing Info changed? ');

              return Deal.dscUpdateFinancing(data, deal, t);
            })

          })


        } else {

          /**
           * Debug
           */
          console.log('\n>> Deal[' + deal.dscDealID + '] -> No Trades!');
          console.log('\n>> Deal[' + deal.dscDealID + '] -> Removing Trades From Deal (if applicable)...');

          return deal.setTrades([], {transaction: t}).then(function () {
            /**
             * Debug
             */
            console.log('\n>> Deal[' + deal.dscDealID + '] -> Removed Trades From Deal.');
            console.log('\n>> Deal[' + deal.dscDealID + '] -> Has Financing Info changed? ');

            return Deal.dscUpdateFinancing(data, deal, t);
          })

        }

      },

      /**
       * Update Financing Info
       * @param data
       * @param deal
       * @param t
       */
      dscUpdateFinancing: function(data, deal, t){
        /**
         * Debug
         */
        console.log('\n>> Deal[' + deal.dscDealID + '] -> Retrieving Financing info');
        return deal.getFinancing({transaction: t}).then(function(financing){
          /**
           * Debug
           */
          console.log('\n>> Deal[' + deal.dscDealID + '] -> Updating Financing Info (if applicable)...');

          return financing.update({
            downPayment: data.SelectedPaymentOption.DownPayment,
            installments: data.SelectedPaymentOption.Term,
            interestRate: data.SelectedPaymentOption.Rate,
            monthlyPayment: data.SelectedPaymentOption.Payment,
          }, {transaction: t}).then(function(){
            /**
             * Debug
             */
            console.log('\n>> Deal[' + deal.dscDealID + '] -> Financing Info Updated.');
            console.log('\n>> Deal[' + deal.dscDealID + '] -> Has Rebate Info changed? ');

            return Deal.dscUpdateRebates(data, deal, t);

          })

        })

      },

      /**
       * Update Finacning Info
       * @param data
       * @param deal
       * @param t
       */
      dscUpdateRebates: function(data, deal, t){

        if (data.Rebates){
          /**
           * Debug
           */
          console.log('\n>> Deal[' + deal.dscDealID + '] -> Retrieving Deal Rebates..');

          return deal.getRebates({transaction: t}).then(function(rebates){
            /**
             * Debug
             */
            console.log('\n>> Deal[' + deal.dscDealID + '] -> Updating Rebates Info...');

            return rebates[0].update({
              amount: data.Rebates
            }, {transaction: t}).then(function(){
              /**
               * Debug
               */
              console.log('\n>> Deal[' + deal.dscDealID + '] -> Rebates Info Updated.');
              console.log('\n\n\n\n\n*******************************************')
              console.log('*    Deal['+data.DealId+'] Successfully Updated!    *');
              console.log('*********************************************');

              return deal;
            })

          })

        } else {

          /**
           * Debug
           */
          console.log('\n>> Deal[' + deal.dscDealID + '] -> Removing Rebates Info...');

          return deal.setRebates([], {transaction: t}).then(function(){
            /**
             * Debug
             */
            console.log('\n>> Deal[' + deal.dscDealID + '] -> Rebates Removed from Deal.');
            console.log('\n\n\n\n\n*******************************************')
            console.log('*    Deal['+data.DealId+'] Successfully Updated!    *');
            console.log('*********************************************');

            return deal;
          });

        }


      }


    }


  });

  return Deal;
}
