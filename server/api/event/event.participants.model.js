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
    },
    attentable: {
      type: DataTypes.STRING,
    },
    participantID: {
      type: DataTypes.INTEGER,
      references: null
    }
  });

  return Participants;
}
