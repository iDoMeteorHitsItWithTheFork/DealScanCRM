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
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    sourceType: DataTypes.STRING,
    sourceName: DataTypes.STRING,
    interest: DataTypes.STRING,
    additionalInfo: DataTypes.TEXT,
    status: {
      type:DataTypes.STRING,
      defaultValue: 'new'
    }
  }, {
    /**
     * Virtual Getters
     */
    getterMethods: {
      //Public profile information
      profile: function () {
        return {
          'leadID': this.getDataValue('leadID'),
          'name': this.getDataValue('name'),
          'phone': this.getDataValue('phone'),
          'email': this.getDataValue('email'),
          'address': this.getDataValue('address'),
          'sourceType': this.getDataValue('sourceType'),
          'sourceName': this.getDataValue('sourceName'),
          "interest": this.getDataValue('interest'),
          "additionalInfo": this.getDataValue('additionalInfo'),
          'status': this.getDataValue('status'),
          'createdAt': this.getDataValue('createdAt'),
        }
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'leadID': this.getDataValue('leadID'),
          'name': this.getDataValue('name'),
          'phone': this.getDataValue('phone'),
          'email': this.getDataValue('email'),
          'address': this.getDataValue('address'),
          'sourceType': this.getDataValue('sourceType'),
          'sourceName': this.getDataValue('sourceName'),
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
