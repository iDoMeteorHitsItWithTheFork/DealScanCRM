/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';


var Thing = sqldb.Thing;
var Dealership = sqldb.Dealership;
var User = sqldb.User;
var Team = sqldb.Team;

Thing.sync()
  .then(() => {
    return Thing.destroy({where: {}});
  })
  .then(() => {
    Thing.bulkCreate([{
      name: 'Development Tools',
      info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
      'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
      'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
      'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep ' +
      'tests alongside code. Automatic injection of scripts and ' +
      'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more ' +
      'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript ' +
      'payload, minifies your scripts/css/images, and rewrites asset ' +
      'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
      'and openshift subgenerators'
    }]);
  });

Dealership.sync()
  .then(() => Dealership.destroy({where: {}}))
  .then(() => {
    Dealership.create({
      dealershipName: 'Hagerstown Ford',
      streetAddress: '1714 Massey Blvd',
      city: 'Hagerstown',
      state: 'Maryland',
      zipCode: 20740,
    }).then(() => {
      console.log('>> Finished creating "Hagerstown Ford" Dealership...');
    });
  });

Team.sync()
  .then(() => Team.destroy({where: {}}))
  .then(() => {
    Team.create({
      teamName: 'HagerstownFord',
    }).then((team) => {
      console.log('>> Finished creating "HagerstownFord" Team...');
      Dealership.find({
        where: {
          'dealershipName':'Hagerstown Ford'
        }
      }).then(function(dealership){
        if (!dealership) return null;
        team.setDealership(dealership);
        console.log('>> Finished setting "HagerstwonFord" Team Dealership....');
      })
    });
  });

User.sync()
  .then(() => User.destroy({where: {}}))
  .then(() => {
    User.bulkCreate([{
      firstName: 'Luda',
      lastName: 'Agodio',
      email: 'lagodio@alvsoftwarellc.com',
      phone: '2029971908',
      password: 'Baiser12!',
      role: 'admin',
      provider: 'local',
    }, {
      firstName: 'Miles',
      lastName: 'Johnson',
      email: 'mjohnson@alvsoftwarellc.com',
      phone: '2039270110',
      password: 'Apple',
      role: 'admin',
      provider: 'local',
    },
      {
        firstName: 'Cary-Lee',
        lastName: 'Gaskell',
        email: 'carylgaskell@gmail.com',
        phone: '5713289662',
        password: 'Baiser12!',
        role: 'admin',
        provider: 'local',
      },
      {
        firstName: 'Eric',
        lastName: 'Carper',
        email: 'ecarper@hagerstownford.com',
        phone: '3042837954',
        password: 'Carp3050',
        role: 'gen_mgr',
        provider: 'local',
      }, {
        firstName: 'Rick',
        lastName: 'Kelly',
        email: 'rkelly@hagerstownford.com',
        phone: '3042837954',
        password: 'Carp3050',
        role: 'owner',
        provider: 'local',
      },
      {
        firstName: "James",
        lastName: "Butt",
        phone: '5046218927',
        email: "jbutt@gmail.com",
        password: 'a',
        role: "gen_sale_mgr",
        provider: "local"
      },
      {
        firstName: "Josephine",
        lastName: "Darakjy",
        phone: "8102929388",
        email: "josephine_darakjy@darakjy.org",
        password: 'a',
        role: "gen_sale_mgr",
        provider: "local"
      },
      {
        firstName: "Art",
        lastName: "Venere",
        phone: '8566368749',
        email: "art@venere.org",
        password: 'a',
        role: "gen_sale_mgr",
        provider: "local"
      },
      {
        firstName: "Lenna",
        lastName: "Paprocki",
        phone: '9073854412',
        email: "lpaprocki@hotmail.com",
        password: 'a',
        role: "sale_mgr",
        provider: "local"
      },
      {
        firstName: "Donette",
        lastName: "Foller",
        phone: '5135701893',
        email: "donette.foller@cox.net",
        password: 'a',
        role: "sale_mgr",
        provider: "local"
      },
      {
        firstName: "Simona",
        lastName: "Morasca",
        phone: '4195032484',
        email: "simona@morasca.com",
        password: 'a',
        role: "sale_mgr",
        provider: "local"
      },
      {
        firstName: "Mitsue",
        lastName: "Tollner",
        phone: '7735736914',
        email: "mitsue_tollner@yahoo.com",
        password: 'a',
        role: "nw_car_sale_mgr",
        provider: "local"
      },
      {
        firstName: "Leota",
        lastName: "Dilliard",
        phone: '4087523500',
        email: "leota@hotmail.com",
        password: 'a',
        role: "nw_car_sale_mgr",
        provider: "local"
      },
      {
        firstName: "Sage",
        lastName: "Wieser",
        phone: '6054142147',
        email: "sage_wieser@cox.net",
        password: 'a',
        role: "nw_car_sale_mgr",
        provider: "local"
      },
      {
        firstName: "Kris",
        lastName: "Marrier",
        phone: '4106558723',
        email: "kris@gmail.com",
        password: 'a',
        role: "usd_car_sale_mgr",
        provider: "local"
      },
      {
        firstName: "Minna",
        lastName: "Amigon",
        phone: '2158741229',
        email: "minna_amigon@yahoo.com",
        password: 'a',
        role: "usd_car_sale_mgr",
        provider: "local"
      },
      {
        firstName: "Abel",
        lastName: "Maclead",
        phone: '6313353414',
        email: "amaclead@gmail.com",
        password: 'a',
        role: "usd_car_sale_mgr",
        provider: "local"
      },
      {
        firstName: "Graciela",
        lastName: "Ruta",
        phone: '4407808425',
        email: "gruta@cox.net",
        password: 'a',
        role: "sale_rep",
        provider: "local"
      },
      {
        firstName: "Cammy",
        lastName: "Albares",
        phone: '9565376195',
        email: "calbares@gmail.com",
        password: 'a',
        role: "sale_rep",
        provider: "local"
      },
      {
        firstName: "Mattie",
        lastName: "Poquette",
        phone: '6022774385',
        email: "mattie@aol.com",
        password: 'a',
        role: "sale_rep",
        provider: "local"
      },
      {
        firstName: "Meaghan",
        lastName: "Garufi",
        phone: '9313139635',
        email: "meaghan@hotmail.com",
        password: 'a',
        role: "sale_rep",
        provider: "local"
      },
      {
        firstName: "Gladys",
        lastName: "Rim",
        phone: '4146619598',
        email: "gladys.rim@rim.org",
        password: 'a',
        role: "sale_rep",
        provider: "local"
      },
      {
        firstName: "Yuki",
        lastName: "Whobrey",
        phone: '3132887937',
        email: "yuki_whobrey@aol.com",
        password: 'a',
        role: "sale_rep",
        provider: "local"
      },
      {
        firstName: "Fletcher",
        lastName: "Flosi",
        phone: '8158282147',
        email: "fletcher.flosi@yahoo.com",
        password: 'a',
        role: "sale_rep",
        provider: "local"
      },
      {
        firstName: "Bette",
        lastName: "Nicka",
        phone: '6105453615',
        email: "bette_nicka@cox.net",
        password: 'a',
        role: "sale_rep",
        provider: "local"
      },
      {
        firstName: "Veronika",
        lastName: "Inouye",
        phone: '4085401785',
        email: "vinouye@aol.com",
        password: 'a',
        role: "sale_rep",
        provider: "local"
      },
      {
        firstName: "Willard",
        lastName: "Kolmetz",
        phone: '9723039197',
        email: "willard@hotmail.com",
        password: 'a',
        role: "sale_rep",
        provider: "local"
      },
      {
        firstName: "Maryann",
        lastName: "Royster",
        phone: '5189667987',
        email: "mroyster@royster.com",
        password: 'a',
        role: "sale_rep",
        provider: "local"
      },
      {
        firstName: "Alisha",
        lastName: "Slusarski",
        phone: '7326583154',
        email: "alisha@slusarski.com",
        password: 'a',
        role: "bdc_mgr",
        provider: "local"
      },
      {
        firstName: "Allene",
        lastName: "Iturbide",
        phone: '7156626764',
        email: "allene_iturbide@cox.net",
        password: 'a',
        role: "bdc_mgr",
        provider: "local"
      },
      {
        firstName: "Chanel",
        lastName: "Caudy",
        phone: '9133882079',
        email: "chanel.caudy@caudy.org",
        password: 'a',
        role: "bdc_rep",
        provider: "local"
      },
      {
        firstName: "Ezekiel",
        lastName: "Chui",
        phone: '4106691642',
        email: "ezekiel@chui.com",
        password: 'a',
        role: "bdc_rep",
        provider: "local"
      },
      {
        firstName: "Willow",
        lastName: "Kusko",
        phone: '2125824976',
        email: "wkusko@yahoo.com",
        password: 'a',
        role: "bdc_rep",
        provider: "local"
      },
      {
        firstName: "Bernardo",
        lastName: "Figeroa",
        phone: '9363363951',
        email: "bfigeroa@aol.com",
        password: 'a',
        role: "bdc_rep",
        provider: "local"
      },
      {
        firstName: "Ammie",
        lastName: "Corrio",
        phone: '6148019788',
        email: "ammie@corrio.com",
        role: "bdc_rep",
        provider: "local"
      }

    ])
      .then(function () {
        console.log('>> Finished setting up users...');
        Dealership.find({
          where:{
            dealershipName: 'Hagerstown Ford'
          }
        }).then(function(dealership){
           return User.findAll({
             where:{
               role: 'owner'
             }
           }).then(function(owners){
              return dealership.setOwners(owners).then(function(){
                console.log('>> Finished setting up owners...');
              })
           })
        }).catch(function(err){
          console.log(err);
        })
        return User.findAll();
      }).then(function (users) {
           return Team.find({
             where: {
               teamName: 'HagerstownFord'
             }
           }).then(function(team){
              if (!team) return null;
              return team.setTeamMembers(users).then(function(){
                console.log('>> Finished setting up teamMates...');
              }).catch(function(err){
                console.log(err.data);
              });
           })
      })

  });



