'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Vehicle', {
    vehicleID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    VIN : {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
    },
    stockNumber: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'StockNo cannot be empty'
        }
      }
    },
    invoice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    retailValue: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    make: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    model: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    year: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    state: {
      type: DataTypes.ENUM,
      values: ['new', 'used'],
      defaultValue: 'new',
      allowNull: false,
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    color: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    bodyStyle: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    trimLevel: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate:{
        notEmpty: true
      }
    },
    package: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
      /**
       * Virtual Getters
       */
      getterMethods: {
        // Public profile information
        profile: function () {
          return {
            'stockNumber': this.getDataValue('stockNumber'),
            'vehicleID': this.getDataValue('vehicleID'),
            'VIN': this.getDataValue('VIN'),
            'make': this.getDataValue('make'),
            'model' : this.getDataValue('model'),
            'year' : this.getDataValue('year'),
            'color': this.getDataValue('color'),
            'mileage': this.getDataValue('mileage'),
            'state': this.getDataValue('state'),
            'msrp': this.getDataValue('msrp'),
            'invoice': this.getDataValue('invoice'),
            'bodyStyle': this.getDataValue('bodyStyle')
          }
        },

        // Non-sensitive info we'll be putting in the token
        token: function () {
          return {
            'stockNumber': this.getDataValue('stockNumber'),
            'vehicleID': this.getDataValue('vehicleID'),
            'VIN': this.getDataValue('VIN')
          }
        }
      },

  });
}
