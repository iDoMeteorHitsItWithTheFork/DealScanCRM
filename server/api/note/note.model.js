'use strict';

export default function (sequelize, DataTypes) {
  var Note = sequelize.define('Note', {
      noteID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: ''
      }
    }
    , {
      /**
       * Virtual Getters
       */
      getterMethods: {
        // Public profile information
        profile: function () {
          return {
            'noteID': this.getDataValue('noteID'),
            'content': this.getDataValue('content'),
            'createdAt': this.getDataValue('createdAt'),
          };
        },

        // Non-sensitive info we'll be putting in the token
        token: function () {
          return {
            'noteID': this.getDataValue('noteID'),
            'content': this.getDataValue('content'),
            'createdAt': this.getDataValue('createdAt'),
            'updatedAt': this.getDataValue('updatedAt'),
            'deletedAt': this.getDataValue('deletedAt')
          };
        },
        getSubjects: function(){
          return this['get' + this.getDataValue('notable').substr(0, 1).toUpperCase() + this.getDataValue('notable').substr(1)]();
        }
      },

      instanceMethods: {}


    });


  return Note;
}
