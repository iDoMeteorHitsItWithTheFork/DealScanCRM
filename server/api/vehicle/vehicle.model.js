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
      allowNull: true,
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
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    mileage: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    year: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    state: {
      type: DataTypes.ENUM,
      values: ['new', 'used'],
      defaultValue: 'new',
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    bodyStyle: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    classification: {
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
            'retailValue': this.getDataValue('retailvalue'),
            'invoice': this.getDataValue('invoice'),
            'bodyStyle': this.getDataValue('bodyStyle'),
            'classification': this.getDataValue('classification'),
            "trimLevel": this.getDataValue('trimLevel')
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
         dscUpsert: function(data, t){

           var searchOptions = {};
           //Vehicle Identifiers
           if (data.VIN) searchOptions.VIN = data.VIN;
           if (data.StockNumber) searchOptions.stockNumber = data.StockNumber;

           //vehicle values to upsert
           var upsertValues = {
             VIN: data.VIN,
             stockNumber: data.StockNumber,
             invoice: data.Invoice,
             retailValue: data.Retail,
             make: data.Make,
             model: data.Model,
             year: data.Year,
             state: (data.New || data.New == 'true') ? 'new' : 'used', //new or used
             mileage: data.Mileage,
             color: data.Color,
             bodyStyle: data.BodyStyle,
             trimLevel: data.TrimLevel,
             package: data.Package,
             createdAt: data.DateCreated
           };

           var classification = null;
           if (data.BodyStyle && data.BodyStyle.trim() != ''){

             switch(data.BodyStyle){
               case "GT 500":
               case "BULLIT":
               case "E-350":
               case "SLE":
               case "E350":
               case "SPORT TRAC LIMITED":
               case "SED":
               case "4D R SDN":
               case "LX":
               case "KOUP":
               case "EX 2 DR":
               case "CONV COUPE":
               case "4DRSD/LS":
               case "S":
               case "2DCP":
               case "2DR":
               case "LS":
               case "GT":
               case "CR":
               case "GT CONV":
               case "2DR COUPE":
               case "BULLITT":
               case "AWD 4DSN":
               case "2DRS":
               case "CALIBER":
               case "V6 2DR":
               case "GT V8":
               case "4DR SDN":
               case "4DSDN":
               case "4DSN":
               case "CONVERTIBLE":
               case "LS SDN":
               case "4DRSD":
               case "GT500":
               case "E250":
               case "E-250":
               case "CAR":
               case "4 D SEDAN":
               case "SDN":
               case "HARDTOP":
               case "2 DR CONVERT":
               case "GT COUPE":
               case "C":
               case "CONV":
               case "CONV. HD":
               case "COUPE":
               case "CONV.":
               case "CONV V-6":
               case "CONV GT":
               case "SOUL":
               case "2 DR CPE":
               case "SEDAN":
               case "4 DR SDN":
               case "2DCV":
               case "C-CLASS":
               case 'SD':
                  classification = 'car';
                  break;
               case "TRK":
               case "LT CREW":
               case "PICKUP":
               case "KING RANCH":
               case "PU":
               case "T":
               case "BIG HORN":
               case "1500":
               case "SLT":
               case "SILVERADO":
               case "UP":
               case "FWD XLT":
               case "XLT":
               case "F-550":
               case "TRUCK":
               case "XLT SUPERCAB":
               case "LTD 4WD":
               case "2WD XLT":
               case "4 DR XLT":
               case "MEDIUM DUTY":
               case "XLT CREW CAB":
               case "XLT 2WD":
               case "XLT 4WD":
               case "P/U":
               case "PICK UP":
               case "XLT 4X4":
               case "PU EXTENDED CAB":
               case "XLT EXT CAB":
               case "XLT PU":
               case "BOX TRUCK":
               case "TK":
               case "F250":
                  classification = 'truck';
                  break;
               case "SX AWD":
               case "CREW CAB 4X4":
               case "XLS":
               case "4X4 CREW":
               case "H2":
               case "CRE":
               case "DENALI LEATHER":
               case "UV":
               case "PLATINUM  SUPERCRE":
               case "DENALI":
               case "SUV HEAT PKG":
               case "REG CAB 4X4":
               case "AWD SUV":
               case "CUV":
               case "SU":
               case "UTILITY":
               case "4SUV":
               case "EXPLORER":
               case "4X4":
               case "SUV AWD":
               case "SUV":
               case "UT":
                 classification="utility";
                 break;
               case "WAGON EXT":
               case "E250 VAN":
               case "2 WD MINI VAN":
               case "HATCH":
               case "HB SE":
               case "2 DR SES HATCH":
               case "HB":
               case "5 DR SMALL WAGON":
               case "4 DR VAN":
               case "5 DR HB":
               case "WGN":
               case "WAGON":
               case "VAN LTD":
               case "CV":
               case "CARGO VAN":
               case "PASSENGER VAN":
               case "MV":
               case "HATCHBACK":
               case "VAN":
               case "CARGO":
               case "HATCH BACK":
               case "STATION WAGON":
               case "MINI VAN":
               case "WAGON SE":
               case "VN":
               case "CG":
                 classification = "van";
                 break;
               default:
                 classification = 'other';
                 break;
             }

           }
           if (classification) upsertValues.classification = classification;

           //find existing vehicle or create
           return this.findOrCreate({
             where: searchOptions,
             defaults: upsertValues,
             transaction: t
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
                     'package',
                     'classification'
                   ]
                 }, {transaction: t})
                 .then(function () {
                   return vehicle;
                 })
             } else return vehicle;
           }).catch(function (err) {
             console.log(err);
             return err;
           });
         }
      }
  });
}
