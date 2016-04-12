'use strict';

export default function (sequelize, DataTypes) {
  var Customer = sequelize.define('Customer', {
    customerID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    driverLicenseID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    middleInitial: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: ''
    },
    lastName: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'Phone number must be numeric'
        }
      }
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(45),
      validate: {
        isEmail: true
      }
    },
    streetAddress: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postalCode: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'walkIn'
    }
  }, {
    /**
     * Virtual Getters
     */
    getterMethods: {
      // Public profile information
      profile: function () {
        var middleInitial = this.getDataValue('middleInitial');
        if (middleInitial.length > 0) middleInitial += '.';
        return {
          'customerID': this.getDataValue('customerID'),
          'driverLicenseID': this.getDataValue('driverLicenceID'),
          'name': this.getDataValue('firstName') +' '+middleInitial+' ' + this.getDataValue('lastName'),
          'email': this.getDataValue('email'),
          'phone': this.getDataValue('phone'),
          'address': this.getDataValue('streetAddress') + ', ' + this.getDataValue('city') + ', ' + this.getDataValue('state') + ' ' + this.getDataValue('postalCode'),
          'city': this.getDataValue('city'),
          'state': this.getDataValue('state'),
          'zipCode': this.getDataValue('postalCode'),
          'source': this.getDataValue('source')
        };
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          'customerID': this.getDataValue('customerID'),
          'driverLicenseID': this.getDataValue('driverLicenceID'),
          'email': this.getDataValue('email'),
          'phone': this.getDataValue('phone'),
          'address': this.getDataValue('streetAddress'),
          'city': this.getDataValue('city'),
          'state': this.getDataValue('state'),
          'zipCode': this.getDataValue('postalCode'),
          'source': this.getDataValue('source')
        };
      }
    },

    instanceMethods: {}

  });

  return Customer;

}
