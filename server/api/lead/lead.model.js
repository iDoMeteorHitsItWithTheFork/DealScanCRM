'use strict';

export default function(sequelize, DataTypes) {
  var Lead = sequelize.define('Lead', {
    leadID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    sourceType: DataTypes.STRING,
    sourceName: DataTypes.STRING,
    interest: DataTypes.STRING,
    additionalInfo: DataTypes.TEXT,
    status: DataTypes.STRING
  }, {
    /**
     * Virtual Getters
     */
    getterMethods: {
      //Public profile information
      profile: function () {
        return {
          'leadID': this.getDataValue('dealID'),
          'name': this.getDataValue('retailValue'),
          'sourceType': this.getDataValue('salePrice'),
          'sourceName': this.getDataValue('paymentOption'),
          "interest": this.getDataValue('interest'),
          "additionalInfo": this.getDataValue('additionalInfo'),
          'status': this.getDataValue('status'),
          'createdAt': this.getDataValue('createdAt'),
        }
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'leadID': this.getDataValue('dealID'),
          'name': this.getDataValue('retailValue'),
          'sourceType': this.getDataValue('salePrice'),
          'sourceName': this.getDataValue('paymentOption'),
          "interest": this.getDataValue('interest'),
          "additionalInfo": this.getDataValue('additionalInfo'),
          'status': this.getDataValue('status'),
          'createdAt': this.getDataValue('createdAt'),
        }
      }
    },
  });

  return Lead;
}
