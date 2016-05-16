'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Financing', {
    financingID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    installments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    interestRate: {
      type:DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    monthlyPayment: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    amountFinanced: {
      type: DataTypes.DOUBLE,
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
  });
}
