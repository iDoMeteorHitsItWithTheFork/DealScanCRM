'use strict';

export default function(sequelize, DataTypes) {
  var Trade = sequelize.define('Trade', {
    tradeID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    VIN: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    actualCashValue: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    payOffAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    tradeAllowance: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    make: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    year: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    mileage: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    color: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    bodyStyle: {
      type: DataTypes.STRING(45),
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
          'tradeID': this.getDataValue('tradeID'),
          'VIN': this.getDataValue('VIN'),
          'actualCashValue': this.getDataValue('actualCashValue'),
          'payOffAmount': this.getDataValue('payOffAmount'),
          'tradeAllowance': this.getDataValue('tradeAllowance'),
          'make': this.getDataValue('make'),
          'model': this.getDataValue('model'),
          'year': this.getDataValue('year'),
          'mileage': this.getDataValue('mileage'),
          'color': this.getDataValue('color'),
          'bodyStyle': this.getDataValue('bodyStyle'),
          'displayName': this.getDataValue('color')+' '+this.getDataValue('year')+' '+this.getDataValue('make')+' '+this.getDataValue('model')
        }
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'tradeID': this.getDataValue('tradeID'),
          'VIN': this.getDataValue('VIN'),
          'actualCashValue': this.getDataValue('actualCashValue'),
          'payOffAmount': this.getDataValue('payOffAmount'),
          'tradeAllowance': this.getDataValue('tradeAllowance'),
          'mileage': this.getDataValue('mileage'),
          'displayName': this.getDataValue('color')+' '+this.getDataValue('year')+' '+this.getDataValue('make')+' '+this.getDataValue('model')
        }
      }
    },

    classMethods: {
      dscUpsert:function(data, tradeValue, t){

        var searchOptions = {};
        //Vehicle Identifiers
        if (data.Vehicle.VIN) searchOptions.VIN = data.Vehicle.VIN;
        //vehicle values to upsert
        var upsertValues = {
          VIN: data.Vehicle.VIN,
          actualCashValue:data.ActualCashValue,
          payOffAmount: data.BalanceOwed,
          tradeAllowance: tradeValue,
          make: data.Vehicle.Make,
          model: data.Vehicle.Model,
          year: data.Vehicle.Year,
          mileage: data.Vehicle.Mileage,
          color: data.Vehicle.Color,
          bodyStyle: data.Vehicle.BodyStyle,
          createdAt: data.ScanDate,
        };


        //find existing vehicle or create
        return Trade.findOrCreate({
          where: searchOptions,
          defaults: upsertValues,
          transaction: t
        }).spread(function (trade, created) {
          if (!created) {
            return trade.update(upsertValues,
              {
                fields: [
                  'VIN',
                  'actualCashValue',
                  'payOffAmount',
                  'tradeAllowance',
                  'make',
                  'model',
                  'year', //new or used
                  'mileage',
                  'color',
                  'bodyStyle',
                  'createdAt'
                ]
              }, {transaction: t})
              .then(function () {
                return trade;
              })
          } else return trade;
        }).catch(function (err) {
          console.log('An Error Occurred while attempting to create Trade Info');
          console.log(err);
          return err;
        });
      }
    }
  });

  return Trade;
}
