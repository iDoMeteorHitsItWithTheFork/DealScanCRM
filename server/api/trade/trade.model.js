'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Trade', {
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
      validate: {
        notEmpty: true
      }
    },
    payOffAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
      validate: {
        notEmpty: true
      }
    },
    tradeAllowance: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
      validate: {
        notEmpty: true
      }
    },
    make: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty:true
      }
    },
    model: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty:true
      }
    },
    year: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    color: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    bodyStyle: {
      type: DataTypes.STRING(45),
      allowNull: true,
      validate: {
        notEmpty: true
      }
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
          'displayName': this.getDataValue('color')+' '+this.getDataValue('year')+' '+this.getDataValue('make')+' '+this.getDataValue('model')
        }
      }
    },

    classMethods: {
      dscUpsert:function(data){

        // var searchOptions = {};
        // //Vehicle Identifiers
        // if (data.VIN) searchOptions.VIN = data.VIN;
        //
        // //vehicle values to upsert
        // console.log(data);
        // var upsertValues = {
        //   VIN: data.VehicleUpdate.VIN,
        //   actualCashValue:data.ActualCashValue,
        //   payOffAmount: data.BalanceOwed,
        //   tradeAllowance: '',
        //   make: '',
        //   model: '',
        //   year: '',
        //   color: '',
        //   bodyStyle: '',
        //   createdAt: '',
        // };
        //
        //
        // //find existing vehicle or create
        // return this.findOrCreate({
        //   where: searchOptions,
        //   defaults: upsertValues
        // }).spread(function (vehicle, created) {
        //   if (!created) {
        //     return vehicle.update(upsertValues,
        //       {
        //         fields: [
        //           'VIN',
        //           'stockNumber',
        //           'invoice',
        //           'retailValue',
        //           'make',
        //           'model',
        //           'year',
        //           'state', //new or used
        //           'mileage',
        //           'color',
        //           'bodyStyle',
        //           'trimLevel',
        //           'package'
        //         ]
        //       })
        //       .then(function () {
        //         return vehicle;
        //       })
        //   }
        //   else return vehicle;
        // }).catch(function (err) {
        //   console.log(err);
        //   return err;
        // });

      }

    }

  });
}
