/**
 * Created by ludovicagodio on 7/4/16.
 */
'use strict';

export default function (sequelize, DataTypes) {
  var Monitoring = sequelize.define('Monitoring', {
    monitoringID: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.ENUM,
      values: ['on', 'off', 'pause'],
      defaultValue: 'off',
      allowNull: false
    }
  });

  return Monitoring;
}
