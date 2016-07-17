'use strict';

export default function(sequelize, DataTypes) {
  var Financing =  sequelize.define('Financing', {
    financingID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    installments: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    interestRate: {
      type:DataTypes.DOUBLE,
      allowNull: true,
    },
    monthlyPayment: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    amountFinanced: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    }
  }, {
    /**
     * Virtual Getters
     */
    getterMethods: {
      // Public profile information
      profile: function () {
        return {
          'financingID': this.getDataValue('financingID'),
          'installments': this.getDataValue('installments'),
          'interestRate': this.getDataValue('interestRate'),
          'monthlyPayment': this.getDataValue('monthlyPayment'),
          'amountFinanced' : this.getDataValue('amountFinanced')
        }
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'financingID': this.getDataValue('financingID'),
          'installments': this.getDataValue('installments'),
          'interestRate': this.getDataValue('interestRate'),
          'monthlyPayment': this.getDataValue('monthlyPayment'),
          'amountFinanced' : this.getDataValue('amountFinanced')
        }
      }
    },

    classMethods: {
      dscUpsert: function (data, dealID, amountFinanced, t) {

        var searchOptions = {};
        //Vehicle Identifiers
        if (dealID) searchOptions.dealID = dealID;
        //vehicle values to upsert
        var upsertValues = {
          installments: data.Term,
          interestRate: data.Rate,
          monthlyPayment: data.Payment,
          amountFinanced: amountFinanced
        };

        //find existing vehicle or create
        return Financing.findOrCreate({
          where: searchOptions,
          defaults: upsertValues,
          transaction: t
        }).spread(function (financing, created) {
          if (!created) {
            return financing.update(upsertValues,
              {
                fields: [
                  'installments',
                  'interestRate',
                  'monthlyPayment',
                  'amountFinanced'
                ]
              }, {transaction: t})
              .then(function () {
                return financing;
              })
          } else return financing;
        }).catch(function (err) {
          console.log('An Error Occurred while recording Financing Info');
          console.log(err);
          return err;
        });
      }

    }

  });

  return Financing;
}
