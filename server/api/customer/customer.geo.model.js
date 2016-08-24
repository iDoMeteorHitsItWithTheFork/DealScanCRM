/**
 * Created by ludovicagodio on 8/23/16.
 */
'use strict';


export default function (sequelize, DataTypes) {
  var Geo = sequelize.define('Geo', {
    geoID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,

  }, {
    /**
     * Virtual Getters
     */
    getterMethods: {
      // Public profile information
      profile: function () {
        return {
          'geoID': this.getDataValue('geoID'),
          'latitude': this.getDataValue('latitude'),
          'longitude': this.getDataValue('longitude'),
        };
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'geoID': this.getDataValue('geoID'),
          'latitude': this.getDataValue('latitude'),
          'longitude': this.getDataValue('longitude'),
        };
      }
    },

    classMethods : {

    },

    instanceMethods: {

    }

  });

  return Geo;

}
