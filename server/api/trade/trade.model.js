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
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    payOffAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    tradeAllowance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
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
    mileage: {
      type: DataTypes.DOUBLE,
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
      allowNull: false,
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
  });
}
