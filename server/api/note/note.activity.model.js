/**
 * Created by ludovicagodio on 7/23/16.
 */
'use strict';

export default function (sequelize, DataTypes) {
  var noteActivities = sequelize.define('Participants', {
    activityID: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    noteID: {
      type: DataTypes.INTEGER,
    },
    notable: {
      type: DataTypes.STRING,
    },
    subjectID: {
      type: DataTypes.INTEGER,
      references: null
    }
  });

  return noteActivities;
}
