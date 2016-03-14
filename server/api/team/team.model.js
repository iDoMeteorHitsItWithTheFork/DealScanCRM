'use strict';

export default function (sequelize, DataTypes) {

    var Team = sequelize.define('Team', {
        teamID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        teamName: {
            type: DataTypes.STRING(45),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Team name can\'t be empty'
                }
            }
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    }, {

        /**
         * Virtual Getters
         */
        getterMethods: {
            // Public profile information
            teamInfo: function () {
                return {
                    'teamName': this.getDataValue('teamName')
                };
            },

            // Non-sensitive info we'll be putting in the token
            token: function () {
                return {
                    'teamID': this.getDataValue('teamID'),
                    'teamName': this.getDataValue('teamName')
                };
            }
        },

        /**
         * Instance Methods
         */
        instanceMethods: {}
    });

    return Team;
}
