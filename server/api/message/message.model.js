'use strict';

export default function(sequelize, DataTypes) {
 var Message = sequelize.define('Message', {
    messageID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    message_uuid: DataTypes.STRING,
    from: DataTypes.STRING,
    name: DataTypes.STRING,
    to: DataTypes.TEXT,
    subject: DataTypes.STRING,
    body: DataTypes.TEXT,
    priority: DataTypes.STRING,
    recipient: DataTypes.STRING,
    recipientID: DataTypes.BIGINT,
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
          'name': this.getDataValue('name'),
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
          'name': this.getDataValue('name'),
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

    classMethods: {
      syncMail: function(mail, recipient, t){

        if (!mail.messageId || mail.messageId.toString().trim() == '') throw new Error('MessageIs is required');
        var searchOptions = {};
        //Customer Identifiers
        searchOptions.message_uuid = mail.messageId;

        //customer values to upsert
        var upsertValues = {
          message_uuid: mail.messageId,
          from: mail.from,
          name: mail.name,
          to: JSON.stringify(mail.to),
          subject: mail.subject,
          body: (mail.content.html && mail.content.html.toString().trim() != '') ? mail.content.html : mail.content.plain,
          type: 'mail',
          priority: mail.priority,
          status: 'unseen',
          createdAt: mail.date
        };

        //find existing customer or create
        return this.findOrCreate({
          where: searchOptions,
          defaults: upsertValues,
          transaction: t
        }).spread(function (message, created) {
          return recipient.addMessage(message, {transaction: t}).then(function () {
            return message;
          })
        })
      }
    },
    instanceMethods: {}
  });

  return Message;
}
