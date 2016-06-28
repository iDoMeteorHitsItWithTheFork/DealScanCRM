'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Rebate', {
    rebateID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
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
          'rebateID': this.getDataValue('rebateID'),
          'amount': this.getDataValue('amount'),
          'dealID': this.getDataValue('dealID'),
        }
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'rebateID': this.getDataValue('rebateID'),
          'amount': this.getDataValue('amount'),
          'dealID': this.getDataValue('dealID')
        }
      }
    },
  });
}
