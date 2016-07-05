'use strict';

export default function (sequelize, DataTypes) {
  var Source = sequelize.define('Source', {
      sourceID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      source: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      sourceInfo: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    },
    {
      getterMethods: {
        // Public profile information
        profile: function () {
          return {
            'sourceID': this.getDataValue('sourceID'),
            'source': this.getDataValue('source'),
            'sourceInfo': this.getDataValue('sourceInfo'),
          }
        },

        // Non-sensitive info we'll be putting in the token
        token: function () {
          return {
            'sourceID': this.getDataValue('sourceID'),
            'source': this.getDataValue('source'),
            'sourceInfo': this.getDataValue('sourceInfo'),
          }
        }
      }
    });

  return Source;
}
