'use strict';

export default function (sequelize, DataTypes) {


    var Dealership = sequelize.define('Dealership', {

        dealershipID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        dealershipName: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        streetAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        state: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        zipCode: {
            type: DataTypes.STRING(12),
            allowNull: false
        }

    }, {

        /**
         * Virtual Getters
         */
        getterMethods: {
            // Public profile information
            dealerInfo: function () {
                return {
                    'name': this.getDataValue('dealershipName'),
                    'address': this.getDataValue('streetAddress') + ' , ' + this.getDataValue('city') + ' , ' + this.getDataValue('state') + ' ' + this.getDataValue('zipCode')
                };
            },

            // Non-sensitive info we'll be putting in the token
            token: function () {
                return {
                    'dealerID': this.getDataValue('dealershipID'),
                };
            }
        },

        /**
         * Instance Methods
         */
        instanceMethods: {}
    });

    return Dealership;
}
