/**
 * Created by ludovicagodio on 7/21/16.
 */
/**
* Created by ludovicagodio on 7/4/16.
*/
'use strict';

export default function (sequelize, DataTypes) {
  var Participants = sequelize.define('Participants', {
    participationID: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    eventID: {
      type: DataTypes.INTEGER,
      unique: 'participant_attentable'
    },
    attendable: {
      type: DataTypes.STRING,
      unique: 'participant_attentable'
    },
    participantID: {
      type: DataTypes.INTEGER,
      unique: 'participant_attentable',
      references: null
    }
  }, {
    /**
     * Virtual Getters
     */
    getterMethods: {
      //Public profile information
      profile: function () {
        return {
          'participationID': this.getDataValue('participationID'),
          'eventID': this.getDataValue('eventID'),
          'attendable': this.getDataValue('attendable'),
          'participantID': this.getDataValue('participantID'),
        }
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'participationID': this.getDataValue('participationID'),
          'eventID': this.getDataValue('eventID'),
          'attendable': this.getDataValue('attendable'),
          'participantID': this.getDataValue('participantID'),
        }
      }
    },
  });

  return Participants;
}
