/**
 * Created by ludovicagodio on 8/5/16.
 */
'use strict';

export default function (sequelize, DataTypes) {
  var Client = sequelize.define('Client', {
    appID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      required: true
    },
    clientId: {
      type: DataTypes.STRING,
      unique: true,
      required: true
    },
    clientSecret: {
      type: DataTypes.STRING,
      required: true
    }

  }, {
    /**
     * Virtual Getters
     */
    getterMethods: {
      // Public profile information
      profile: function () {
        return {
          'appID': this.getDataValue('appID'),
          'clientId': this.getDataValue('clientId'),
          'clientSecret': this.getDataValue('clientSecret'),
          'name': this.getDataValue('name')
        }
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'clientId': this.getDataValue('clientId'),
          'clientSecret': this.getDataValue('clientSecret'),
          'name': this.getDataValue('name')
        }
      }
    },

    classMethods : {

    },

    instanceMethods: {

    }

  });

  return Client;

}
