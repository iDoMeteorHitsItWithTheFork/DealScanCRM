/**
 * Created by ludovicagodio on 7/4/16.
 */
'use strict';

export default function (sequelize, DataTypes) {
  var Keyword = sequelize.define('Keyword', {
      keywordID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      keyword: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      getterMethods: {
        // Public profile information
        profile: function () {
          return {
            'keywordID': this.getDataValue('keywordID'),
            'keyword': this.getDataValue('keyword'),
          }
        },

        // Non-sensitive info we'll be putting in the token
        token: function () {
          return {
            'keywordID': this.getDataValue('keywordID'),
            'keyword': this.getDataValue('keyword'),
          }
        }
      }
    });

  return Keyword;
}
