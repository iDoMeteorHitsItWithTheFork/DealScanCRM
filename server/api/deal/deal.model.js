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
                  console.log('*****************************************************');

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
                 console.log('*****************************************************');

                 return deal;
             });
          });
        } else {
          /***
           * Debug
           */
          console.log('\n\n\n\n\n*******************************************')
          console.log('*    Deal['+data.DealId+'] Successfully Inserted!   *');
          console.log('*****************************************************');

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

        var upsertValues = {
          dscDealID: data.DealId,
          retailValue: data.RetailValue,
          salePrice: data.SalesPrice,
          paymentOption: (data.SelectedPaymentOption && data.SelectedPaymentOption.Term > 1) ? 'financed' : 'cash',
          status: data.DealStatusTypeName,
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

              return deal.update(
                {
                  retailValue: upsertValues.retailValue,
                  salePrice: upsertValues.salePrice,
                  paymentOption: upsertValues.paymentOption,
                  status: upsertValues.status
                }, {
                  fields: [
                    'retailValue',
                    'salePrice',
                    'paymentOption',
                    'status'
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
          return deal;
        })
          .catch(function (err) {
          console.log('An error occurred while trying to upsert Deal[' + data.DealId + ']!');
          console.log(err);
          return err;
        });
      }

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

           } else return Deal.dscUpdateBuyer(data, deal, customer, t);
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
          console.log('\n>> Deal['+data.DealId+']  -> Assigned New Buyer to Deal...');

          return deal.setBuyer(customer, {transaction: t}).then(function(){
            /**
             * Debug
             */
            console.log('\n>> Deal['+data.DealId+']  -> New Buyer Assigned to Deal.');
            console.log('\n>> Deal['+data.DealId+']  -> Has CoBuyer changed? ');

            return Deal.dscUpdateCoBuyer(data, deal, t);

          });

        } else return Deal.dscUpdateCoBuyer(data, deal, t);
      })

    },

      /**
       * Update CoBuyer Information
       * @param data
       * @param deal
       * @param t
       */
    dscUpdateCoBuyer: function(data, deal, t){


    }




  });

  return Deal;
}
