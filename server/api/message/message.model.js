'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Message', {
    messageID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    message_uuid: DataTypes.STRING,
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    subject: DataTypes.STRING,
    body: DataTypes.TEXT,
    priority: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM,
      values: ['mail', 'text'],
      default: 'mail'
    },
    status: DataTypes.STRING
  }, {
    /**
     * Virtual Getters
     */
    getterMethods: {
      //Public profile information
      profile: function () {
        return {
          'messageID': this.getDataValue('messageID'),
          'message_uuid': this.getDataValue('message_uuid'),
          'from': this.getDataValue('from'),
          'to': this.getDataValue('to'),
          'subject': this.getDataValue('subject'),
          'body': this.getDataValue('body'),
          'type': this.getDataValue('type'),
          'priority': this.getDataValue('priority'),
          'status': this.getDataValue('status'),
          'createdAt': this.getDataValue('createdAt'),
        }
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'messageID': this.getDataValue('messageID'),
          'message_uuid': this.getDataValue('message_uuid'),
          'from': this.getDataValue('from'),
          'to': this.getDataValue('to'),
          'subject': this.getDataValue('subject'),
          'body': this.getDataValue('body'),
          'type': this.getDataValue('type'),
          'priority': this.getDataValue('priority'),
          'status': this.getDataValue('status'),
          'createdAt': this.getDataValue('createdAt'),
        }
      }
    },

    classMethods: {},
    instanceMethods: {}
  });
}
