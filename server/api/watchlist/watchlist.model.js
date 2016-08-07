'use strict';

export default function(sequelize, DataTypes) {
  var Watchlist =  sequelize.define('Watchlist', {
    watchlistID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    watchlistName: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    watchlistInfo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location:{
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
        getterMethods: {
          // Public profile information
          profile: function () {
            return {
              'watchlistID': this.getDataValue('watchlistID'),
              'watchlistName': this.getDataValue('watchlistName'),
              'watchlistInfo': this.getDataValue('watchlistInfo'),
              'location': this.getDataValue('location')
            }
          },

          // Non-sensitive info we'll be putting in the token
          token: function () {
            return {
              'watchlistID': this.getDataValue('watchlistID'),
              'watchlistName': this.getDataValue('watchlistName'),
              'watchlistInfo': this.getDataValue('watchlistInfo'),
              'location': this.getDataValue('location')
            }
          }
        }
  });

  return Watchlist;
}
