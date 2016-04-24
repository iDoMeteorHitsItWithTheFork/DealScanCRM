'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Image', {
    imageID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type:DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty:true,
        msg: 'Title can not be empty'
      }
    },
    source:{
      type:DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty:true
      }
    },
    active: DataTypes.BOOLEAN
  }, {

    /**
     * Virtual Getters
     */
    getterMethods: {
      // Public profile information
      profile: function () {
        return {
          'imageID': this.getDataValue('imageID'),
          'title': this.getDataValue('title'),
          'source': this.getDataValue('source')
        };
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'imageID': this.getDataValue('imageID'),
          'title': this.getDataValue('title'),
          'source': this.getDataValue('source')
        };
      }
    },

    instanceMethods: {}

  });
}
