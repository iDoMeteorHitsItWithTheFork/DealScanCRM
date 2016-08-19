'use strict';

export default function(sequelize, DataTypes) {
  var Lead = sequelize.define('Lead', {
    leadID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    middleInitial: DataTypes.STRING(1),
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    sourceType: DataTypes.STRING,
    sourceName: DataTypes.STRING,
    interest: DataTypes.TEXT,
    additionalInfo: DataTypes.TEXT,
    status: {
      type:DataTypes.STRING,
      defaultValue: 'new'
    }
  }, {
    /**
     * Virtual Getters
     */
    getterMethods: {
      //Public profile information
      profile: function () {
        var middleInitial = this.getDataValue('middleInitial') ? this.getDataValue('middleInitial') : '';
        if (middleInitial.length > 0) middleInitial += '.';
        return {
          'leadID': this.getDataValue('leadID'),
          'firstName': this.getDataValue('firstName'),
          'lastName': this.getDataValue('lastName'),
          'middleInitial': this.getDataValue('middleInitial'),
          'name': this.getDataValue('firstName') +' '+middleInitial+' ' +this.getDataValue('lastName'),
          'phone': this.getDataValue('phone'),
          'email': this.getDataValue('email'),
          'address': this.getDataValue('address'),
          'sourceType': this.getDataValue('sourceType'),
          'sourceName': this.getDataValue('sourceName'),
          "interest": this.getDataValue('interest'),
          "additionalInfo": this.getDataValue('additionalInfo'),
          'status': this.getDataValue('status'),
          'createdAt': this.getDataValue('createdAt'),
        }
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        var middleInitial = this.getDataValue('middleInitial') ? this.getDataValue('middleInitial') : '';
        if (middleInitial.length > 0) middleInitial += '.';
        return {
          'leadID': this.getDataValue('leadID'),
          'firstName': this.getDataValue('firstName'),
          'lastName': this.getDataValue('lastName'),
          'middleInitial': this.getDataValue('middleInitial'),
          'name': this.getDataValue('firstName') +' '+middleInitial+' ' +this.getDataValue('lastName'),
          'phone': this.getDataValue('phone'),
          'email': this.getDataValue('email'),
          'address': this.getDataValue('address'),
          'sourceType': this.getDataValue('sourceType'),
          'sourceName': this.getDataValue('sourceName'),
          "interest": this.getDataValue('interest'),
          "additionalInfo": this.getDataValue('additionalInfo'),
          'status': this.getDataValue('status'),
          'createdAt': this.getDataValue('createdAt'),
        }
      }
    },

    classMethods : {

      dscUpsert: function(data, t){

        var searchOptions = {};
        //Customer Identifiers

        if (data.firstName && data.firstName.toString().trim() != '') searchOptions.firstName = data.firstName;
        if (data.lastName && data.lastName.toString().trim() != '') searchOptions.lastName = data.lastName;
        if (data.phone && data.phone.toString().trim() != '') searchOptions.phone = data.phone;
        if (data.email && data.email.toString().trim() != '') searchOptions.email = data.email;
        if (data.interest && data.interest.toString().trim() != '') searchOptions.interest = JSON.stringify(data.interest);

        //customer values to upsert
        var upsertValues = {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          address: data.address,
          sourceType: 'Internet',
          sourceName: data.sourceName,
          interest: JSON.stringify(data.interest),
          additionalInfo: data.additionalInfo,
          createdAt: data.createdAt
        };

        //find existing customer or create
        return this.findOrCreate({
          where: searchOptions,
          defaults: upsertValues,
          transaction: t
        }).spread(function(lead, created){
          if (!lead){
            //console.log(' *** I am updated the lead data ****');
            return lead.update(upsertValues,
              { fields: [
               'firstName',
               'lastName',
               'phone',
               'email',
               'address',
               'sourceType',
               'sourceName',
               'interest',
               'additionalInfo',
              ] }, {transaction: t})
              .then(function(lead){
                return lead;
              })
          } else return lead;
        }).catch(function(err){
          console.log('*** An error occured while creating '+searchOptions.firstName+' '+searchOptions.lastName);
          console.log(err);
          return err;
        });
      }
    },

  });

  return Lead;
}
