/**
 * Created by ludovicagodio on 8/5/16.
 */
'use strict';
export default function (sequelize, DataTypes) {
  var refreshToken = sequelize.define('RefreshToken', {
    refreshTokenID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING,
      unique: true,
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
          'refreshTokenID': this.getDataValue('refreshTokenID'),
          'token': this.getDataValue('token')
        }
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'refreshTokenID': this.getDataValue('refreshTokenID'),
          'token': this.getDataValue('token')
        }
      }
    },

    classMethods : {


    },

    instanceMethods: {

    }

  });

  return refreshToken;

}
