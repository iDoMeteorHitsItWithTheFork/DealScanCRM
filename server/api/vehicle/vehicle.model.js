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
      allowNull: true, //false
      defaultValue: 0,
      validate: {
        notEmpty: true
      }
    },
    retailValue: {
      type: DataTypes.DOUBLE,
      allowNull: true, //false
      defaultValue: 0,
      validate: {
        notEmpty: true
      }
    },
    make: {
      type: DataTypes.STRING(45),
      allowNull: false, //false
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
    color: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    bodyStyle: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    trimLevel: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    package: {
      type: DataTypes.STRING(45),
      allowNull: true
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

      classMethods: {
         dscUpsert: function(data){
           var searchOptions = {};
           //Vehicle Identifiers
           if (data.VIN) searchOptions.VIN = data.VIN;
           if (data.StockNumber) searchOptions.stockNumber = data.StockNumber;

           //vehicle values to upsert
           console.log(data);
           var upsertValues = {
             VIN: data.VIN,
             stockNumber: data.StockNumber,
             invoice: data.Invoice,
             retailValue: data.Retail,
             make: data.Make,
             model: data.Model,
             year: data.Year,
             state: (data.New || data.New == 'true') ? 'new' : 'used', //new or used
             mileage: data,
             color: data.Color,
             bodyStyle: data.BodyStyle,
             trimLevel: data.TrimLevel,
             package: data.Package,
             createdAt: data.DateCreated
           };


           //find existing vehicle or create
           return this.findOrCreate({
             where: searchOptions,
             defaults: upsertValues
           }).spread(function (vehicle, created) {
             if (!created) {
               return vehicle.update(upsertValues,
                 {
                   fields: [
                     'VIN',
                     'stockNumber',
                     'invoice',
                     'retailValue',
                     'make',
                     'model',
                     'year',
                     'state', //new or used
                     'mileage',
                     'color',
                     'bodyStyle',
                     'trimLevel',
                     'package'
                   ]
                 })
                 .then(function () {
                   return vehicle;
                 })
             }
             else return vehicle;
           }).catch(function (err) {
             console.log(err);
             return err;
           });

         }
      }
  });
}