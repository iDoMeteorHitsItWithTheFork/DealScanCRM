'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Deal', {
    dealID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
      values: ['started', 'pending', 'itemNeeded', 'completed', 'lost'],
      defaultValue: 'started',
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
      // Public profile information
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


  });
}


