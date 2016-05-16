'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Document', {
    documentID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM,
      values: ['media', 'file', 'other'],
      allowNull: false,
      validate: {
        notEmpty:true
      }
    },
    description: DataTypes.TEXT,
    path: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: [ 'optional','required', 'pending', 'approved', 'rejected'],
      defaultValue: 'optional',
      validate: {
        notEmpty: false,
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
          'documentID': this.getDataValue('documentID'),
          'name': this.getDataValue('name'),
          'type': this.getDataValue('type'),
          'description': this.getDataValue('description'),
          'path': this.getDataValue('path'),
          'status' : this.getDataValue('status')
        }
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'documentID': this.getDataValue('documentID'),
          'name': this.getDataValue('name'),
          'type': this.getDataValue('type'),
          'description': this.getDataValue('description'),
          'path': this.getDataValue('path'),
          'status' : this.getDataValue('status')
        }
      }
    },

  });
}
