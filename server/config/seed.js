/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';




var Dealership = sqldb.Dealership;
var User = sqldb.User;
var Team = sqldb.Team;
var Customer = sqldb.Customer;
var Deal = sqldb.Deal;
var Source = sqldb.Source;
var Lead = sqldb.Lead;





/*Source.sync()
  .then(() => Source.destroy({where: {}}))
  .then(() => {
    Source.bulkCreate([{
      source: 'facebook',
      sourceInfo: 'Facebook Social Media Platform'
    },
      {
        source: 'twitter',
        sourceInfo: 'Twitter Social Media Platform'
      },
      {
        source: 'Instagram',
        sourceInfo: 'Instagram Social Media Platform'
      },
    ]).then(() => {
      console.log('>> Finished creating Social Media Sources...');
    });
  });*/


/*    Dealership.sync()
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
      });*/

/*
    Team.sync()
      .then(() => Team.destroy({where: {}}))
      .then(() => {
        Team.create({
          teamName: 'HagerstownFord',
        }).then((team) => {
          console.log('>> Finished creating "HagerstownFord" Team...');
          Dealership.find({
            where: {
              'dealershipName': 'Hagerstown Ford'
            }
          }).then(function (dealership) {
            if (!dealership) return null;
            team.setDealership(dealership);
            console.log('>> Finished setting "HagerstwonFord" Team Dealership....');
          })
        });
      });
*/



  /* User.sync()
     .then(() => User.destroy({where: {}}))
      .then(() => {
        User.bulkCreate([
          {
            firstName: 'Luda',
            lastName: 'Agodio',
            email: 'lagodio@alvsoftwarellc.com',
            phone: '2029971908',
            password: 'Baiser12!',
            role: 'admin',
            provider: 'local',
          },
          {
            firstName: 'Cary-Lee',
            lastName: 'Gaskell',
            email: 'carylgaskell@gmail.com',
            phone: '5713289692',
            password: 'a',
            role: 'admin',
            provider: 'local',
          },
          {
            firstName: 'EMAIL',
            lastName: 'SYSTEM',
            email: 'email_system@dealscancrm.com',
            phone: '8009631100',
            password: 'xsd345sftre212@acxcvc12$&1',
            role: 'admin',
            provider: 'local',
          },
          {
            firstName: 'DealScan',
            lastName: 'CRM',
            email: 'dealscanCRM@dealscancrm.com',
            phone: '8009631100',
            password: 'xsd345sftre212@acxcvc12$&1',
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
          },
          {
            firstName: 'Rick',
            lastName: 'Kelly',
            email: 'rkelly@hagerstownford.com',
            phone: '3018025738',
            password: 'Carp3050',
            role: 'owner',
            provider: 'local',
          },
          {
            firstName: "Megan",
            lastName: "Walter",
            phone: '4106691642',
            email: "mwalter@hagerstownford.com",
            password: 'mwalter',
            role: "admin",
            provider: "local",
            dscUserID: 1014
          },
          {
            firstName: "Jody",
            lastName: "Layman",
            phone: '4106691642',
            email: "jlayman@hagerstownford.com",
            password: 'jlayman',
            role: "admin",
            provider: "local",
            dscUserID: 1028
          },
          {
            firstName: "Chris",
            lastName: "Mason",
            phone: '',
            email: "cmason@hagerstownford.com",
            password: 'cmason',
            role: "sale_mgr",
            provider: "local",
            dscUserID: 1012
          },
          {
            firstName: "Chris",
            lastName: "Edwards",
            phone: '4109609006',
            email: "cedwards@hagerstownford.com",
            password: 'cedwards',
            role: "sale_mgr",
            provider: "local",
            dscUserID: 2165
          },
          {
            firstName: "Chris",
            lastName: "Black",
            phone: '4109609006',
            email: "cblack@hagerstownford.com",
            password: 'cblack',
            role: "sale_mgr",
            provider: "local",
            dscUserID: 12
          },
          {
            firstName: "Christian",
            lastName: "Walter",
            phone: '',
            email: "cwalter@hagerstownford.com",
            password: 'cwalter',
            role: "sale_mgr",
            provider: "local",
            dscUserID: 1034,
          },
          {
            firstName: "Chuck",
            lastName: "Wade",
            phone: '',
            email: "cwade@hagerstownford.com",
            password: 'cwade',
            role: "sale_mgr",
            provider: "local",
            dscUserID: 1029
          },
          {
            firstName: "DealScan",
            lastName: "CRM",
            phone: '8009631100',
            email: "dscrm_@hagerstownford.com",
            password: 'dscrm_',
            role: "sale_mgr",
            provider: "local",
            dscUserID: 2167,
          },
          {
            firstName: "John",
            lastName: "Smith",
            phone: '',
            email: "jsmith@hagerstownford.com",
            password: 'jsmith',
            role: "sale_mgr",
            provider: "local",
            dscUserID: 1015
          },
          {
            firstName: "Kelly",
            lastName: "Tress",
            phone: '',
            email: "ktress@hagerstownford.com",
            password: 'ktress',
            role: "sale_mgr",
            provider: "local",
            dscUserID: 1007
          },
          {
            firstName: "Micheal",
            lastName: "Branson",
            phone: '',
            email: "mbranson@hagerstownford.com",
            password: 'mbranson',
            role: "sale_mgr",
            provider: "local",
            dscUserID: 1033
          },
          {
            firstName: "Mike",
            lastName: "Reid",
            phone: '',
            email: "mreid@hagerstownford.com",
            password: 'mreid',
            role: "sale_mgr",
            provider: "local",
            dscUserID: 1025
          },
          {
            firstName: "Mike",
            lastName: "Rogers",
            phone: '',
            email: "mrogers@hagerstownford.com",
            password: 'mrogers',
            role: "sale_mgr",
            provider: "local",
            dscUserID: 2171
          },
          {
            firstName: "Rob",
            lastName: "Scofield",
            phone: '',
            email: "rscofield@hagerstownford.com",
            password: 'rscofield',
            role: "sale_mgr",
            provider: "local",
            dscUserID: 2139
          },
          {
            firstName: "Rick",
            lastName: "Kelly",
            phone: '',
            email: "happyTag@hagerstownford.com",
            password: 'rkelly',
            role: "sale_rep",
            provider: "local"
          },
          {
            firstName: "Andy",
            lastName: "Brewer",
            phone: '',
            email: "abrewer@hagerstownford.com",
            password: 'abrewer',
            role: "sale_rep",
            provider: "local",
            dscUserID: 2170
          },
          {
            firstName: "Charlie",
            lastName: "Gesford",
            phone: '',
            email: "cgesford@hagerstownford.com",
            password: 'cgesford',
            role: "sale_rep",
            provider: "local",
            dscUserID: 2148
          },
          {
            firstName: "Doug",
            lastName: "Taylor",
            phone: '',
            email: "dtaylor@hagerstownford.com",
            password: 'dtaylor',
            role: "sale_rep",
            provider: "local",
            dscUserID: 2057
          },
          {
            firstName: "Gregory",
            lastName: "Dash",
            phone: '',
            email: "gdash@hagerstownford.com",
            password: 'gdash',
            role: "sale_rep",
            provider: "local",
            dscUserID: 2161
          },
          {
            firstName: "Ian",
            lastName: "Miller",
            phone: '',
            email: "imiller@hagerstownford.com",
            password: 'imiller',
            role: "sale_rep",
            provider: "local",
            dscUserID: 2156
          },
          {
            firstName: "James",
            lastName: "Thomas",
            phone: '',
            email: "jthomas@hagerstownford.com",
            password: 'jthomas',
            role: "sale_rep",
            provider: "local",
            dscUserID: 2169
          },
          {
            firstName: "Janet",
            lastName: "Asbury",
            phone: '',
            email: "jasbury@hagerstownford.com",
            password: 'jasbury',
            role: "sale_rep",
            provider: "local",
            dscUserID: 2108
          },
          {
            firstName: "Jared",
            lastName: "Breakall",
            phone: '',
            email: "jared@hagerstownford.com",
            password: 'jared',
            role: "sale_rep",
            provider: "local",
            dscUserID: 2174
          },
          {
            firstName: "Josh",
            lastName: "Williams-Theodore",
            phone: '',
            email: "joshwt@hagerstownford.com",
            password: 'joshwt',
            role: "sale_rep",
            provider: "local",
            dscUserID: 2175
          },
          {
            firstName: "Josh",
            lastName: "O'neal",
            phone: '',
            email: "josho@hagerstownford.com",
            password: 'josho',
            role: "sale_rep",
            provider: "local",
            dscUserID: 2173
          },
          {
            firstName: "Richard",
            lastName: "Johnson",
            phone: '',
            email: "rjohnson@hagerstownford.com",
            password: 'rjohnson',
            role: "sale_rep",
            provider: "local",
            dscUserID: 2158
          },
          {
            firstName: "Ryan",
            lastName: "Harbaugh",
            phone: '',
            email: "rharbaugh@hagerstownford.com",
            password: 'rharbaugh',
            role: "sale_rep",
            provider: "local",
            dscUserID: 2111
          },
          {
            firstName: "Santiago",
            lastName: "Velazquez-Marcano",
            phone: '',
            email: "svelazquez@hagerstownford.com",
            password: 'svelazquez',
            role: "sale_rep",
            provider: "local",
            dscUserID: 2088
          },
        ])
          .then(function () {
            console.log('>> Finished setting up users...');
            return Dealership.find({
              where: {
                dealershipName: 'Hagerstown Ford'
              }
            }).then(function (dealership) {
              return User.findAll().then(function (users) {
                return dealership.setEmployees(users).then(function () {
                  console.log('>> Finished setting up dealership employees...');
                  return User.findAll({
                    where: {
                      role: 'owner'
                    }
                  }).then(function (owners) {
                    return dealership.setOwners(owners).then(function () {
                      console.log('>> Finished setting up dealership owners...');
                      User.findAll({
                        where: {
                          role: 'gen_mgr'
                        }
                      }).then(function (generalManagers) {
                        dealership.setGeneralManagers(generalManagers).then(function () {
                          console.log('>> Finished setting up dealership general managers...');
                        })
                        return User.findAll({
                          where: {
                            role: 'sale_mgr'
                          }
                        });
                      }).then(function (managers) {
                        Team.find({
                          where: {
                            teamName: 'HagerstownFord'
                          }
                        }).then(function (team) {
                          if (!team) return null;
                          team.setTeamManagers(managers).then(function(){
                            console.log('>> Finished setting up team managers...');
                            User.findAll({
                              where:{
                                role: 'sale_rep'
                              }
                            }).then(function(users){
                              team.setTeamMembers(users).then(function () {
                                console.log('>> Finished setting up teammates...');
                              });
                            })
                          })
                        })
                      }).catch(function (err) {
                        console.log(err);
                      })
                    }).catch(function (err) {
                      console.log(err);
                    })
                  }).catch(function (err) {
                    console.log(err);
                  })
                })
              })
            }).catch(function (err) {
              console.log(err);
            })
          })
      });*/



/*

var data = [
  {"name": "Clark Parsons", "phone": "(681) 299-6486", "email": "Aenean@imperdietdictum.com", "address": "Ap #390-2060 Tellus Street", "interest": "sodales at, velit.", "additionalInfo": "ullamcorper magna. Sed", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Garrison Wilkinson", "phone": "(717) 104-9402", "email": "mi.lorem.vehicula@Loremipsumdolor.com", "address": "P.O. Box 961, 6699 Mauris Rd.", "interest": "Sed", "additionalInfo": "ante bibendum ullamcorper. Duis cursus, diam at", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Cairo Marks", "phone": "(983) 933-6248", "email": "Nullam.enim@libero.org", "address": "P.O. Box 150, 4099 Phasellus Road", "interest": "dolor, tempus non, lacinia at, iaculis quis, pede. Praesent", "additionalInfo": "eget lacus. Mauris non dui nec urna suscipit nonummy.", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Emery Beck", "phone": "(616) 611-9872", "email": "eu@massalobortisultrices.ca", "address": "P.O. Box 922, 5311 In Street", "interest": "ac tellus. Suspendisse sed dolor.", "additionalInfo": "Aliquam erat volutpat. Nulla facilisis. Suspendisse commodo tincidunt nibh. Phasellus", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Elijah Frederick", "phone": "(975) 855-8210", "email": "blandit.enim.consequat@sitametultricies.ca", "address": "752-8905 Orci. St.", "interest": "fringilla cursus purus. Nullam scelerisque neque sed sem egestas", "additionalInfo": "sagittis. Duis gravida. Praesent eu nulla", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Upton White", "phone": "(781) 186-3704", "email": "enim.nisl.elementum@dolorQuisquetincidunt.org", "address": "770-764 Et, Avenue", "interest": "sed dui. Fusce aliquam, enim nec tempus", "additionalInfo": "tincidunt orci quis lectus.", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Tad Rose", "phone": "(574) 998-7567", "email": "dignissim.pharetra.Nam@ascelerisque.org", "address": "P.O. Box 233, 6771 Nisi Rd.", "interest": "egestas. Fusce aliquet magna a neque.", "additionalInfo": "at arcu. Vestibulum ante ipsum", "sourceName": "Website", "sourceType": "Internet"},
  {"name": "Jackson Drake", "phone": "(713) 896-2720", "email": "et.euismod@Cras.edu", "address": "P.O. Box 724, 5307 Integer Avenue", "interest": "Quisque libero lacus, varius et, euismod", "additionalInfo": "magnis", "sourceName": "Website", "sourceType": "Internet"},
  {"name": "Brandon Burch", "phone": "(453) 955-0922", "email": "blandit.mattis.Cras@ascelerisquesed.edu", "address": "863-3931 Metus. Avenue", "interest": "sodales", "additionalInfo": "Donec tincidunt. Donec vitae erat vel pede blandit congue. In", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Hamilton Meyer", "phone": "(370) 668-2853", "email": "quam.dignissim.pharetra@posuerevulputatelacus.com", "address": "318-5606 Luctus Rd.", "interest": "aliquam arcu. Aliquam ultrices iaculis odio. Nam", "additionalInfo": "dignissim. Maecenas ornare", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Mufutau Carson", "phone": "(159) 389-8006", "email": "eros.non.enim@rutrumeu.com", "address": "Ap #970-4025 Nunc Road", "interest": "ante ipsum primis", "additionalInfo": "nisl. Quisque fringilla euismod enim. Etiam gravida molestie", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Akeem Harmon", "phone": "(185) 316-8800", "email": "Cras.dolor@ornare.org", "address": "750-2864 Ullamcorper Av.", "interest": "Sed malesuada augue ut lacus. Nulla", "additionalInfo": "lorem", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Callum Harrell", "phone": "(521) 183-1756", "email": "est.congue@arcuVestibulumante.net", "address": "Ap #827-9073 Non, Road", "interest": "sociis natoque penatibus et magnis dis parturient montes,", "additionalInfo": "pede. Cras vulputate", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Thane Farmer", "phone": "(942) 179-0493", "email": "et.magna.Praesent@dignissim.net", "address": "P.O. Box 462, 6870 Quis Road", "interest": "blandit.", "additionalInfo": "Duis gravida. Praesent eu nulla at sem molestie sodales. Mauris", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Luke Hogan", "phone": "(772) 671-1343", "email": "Suspendisse.aliquet.sem@vulputatelacus.ca", "address": "649-1329 Enim, Rd.", "interest": "Integer vitae nibh. Donec", "additionalInfo": "hendrerit a, arcu. Sed et libero. Proin mi. Aliquam", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Armando Leon", "phone": "(124) 224-7974", "email": "nulla.In@dolorquamelementum.com", "address": "725-5205 Magna. Avenue", "interest": "at arcu. Vestibulum ante ipsum primis in faucibus orci", "additionalInfo": "et malesuada fames ac turpis egestas. Fusce aliquet magna", "sourceName": "Website", "sourceType": "Internet"},
  {"name": "Travis Chapman", "phone": "(482) 240-6925", "email": "Phasellus@Donec.co.uk", "address": "195-7383 Sit Street", "interest": "sit amet luctus vulputate, nisi sem", "additionalInfo": "lorem,", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Stephen Owen", "phone": "(910) 178-5446", "email": "amet.dapibus@augueSed.co.uk", "address": "6643 Fringilla Rd.", "interest": "consequat nec, mollis vitae,", "additionalInfo": "cursus et, eros. Proin ultrices. Duis volutpat nunc", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Mannix Tran", "phone": "(287) 271-6996", "email": "semper.rutrum@iaculis.net", "address": "540-3515 Orci St.", "interest": "Praesent", "additionalInfo": "lacus vestibulum lorem, sit", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Tad Monroe", "phone": "(790) 295-8728", "email": "Phasellus.nulla.Integer@tempor.org", "address": "Ap #299-2923 Velit. St.", "interest": "lacus pede sagittis augue, eu tempor erat neque non", "additionalInfo": "iaculis aliquet diam. Sed diam lorem, auctor", "sourceName": "Website", "sourceType": "Internet"},
  {"name": "Edward Reese", "phone": "(999) 552-4726", "email": "turpis.In@Integer.ca", "address": "440-5364 Sit Av.", "interest": "vel, vulputate eu, odio. Phasellus at", "additionalInfo": "elementum purus, accumsan interdum libero dui", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Leonard Lloyd", "phone": "(534) 112-6178", "email": "tempor.bibendum@doloregestasrhoncus.co.uk", "address": "7076 Nulla. St.", "interest": "nisi. Aenean eget metus. In", "additionalInfo": "lacus, varius et, euismod", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Guy Byers", "phone": "(873) 529-6806", "email": "sociosqu@Namconsequatdolor.net", "address": "1769 Sit Avenue", "interest": "tempor arcu. Vestibulum ut", "additionalInfo": "dignissim. Maecenas ornare egestas ligula.", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Zachery Holloway", "phone": "(948) 702-4673", "email": "dui@nislarcu.com", "address": "527-2839 Neque Rd.", "interest": "aptent taciti sociosqu ad litora", "additionalInfo": "tincidunt pede ac urna. Ut tincidunt vehicula", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Buckminster Howell", "phone": "(192) 218-7072", "email": "eleifend.nunc.risus@congueIn.com", "address": "3353 Orci, St.", "interest": "Fusce", "additionalInfo": "Nunc", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Dieter Barrera", "phone": "(616) 811-3693", "email": "ut.ipsum.ac@facilisismagnatellus.org", "address": "668-2330 Integer Avenue", "interest": "Sed nulla ante, iaculis nec, eleifend non,", "additionalInfo": "malesuada ut, sem. Nulla", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Hilel Bauer", "phone": "(962) 974-2321", "email": "risus@nonenimMauris.net", "address": "P.O. Box 319, 9214 Amet, St.", "interest": "ut odio vel", "additionalInfo": "est arcu", "sourceName": "Website", "sourceType": "Internet"},
  {"name": "Nolan Valenzuela", "phone": "(725) 569-6579", "email": "odio@arcu.edu", "address": "4526 A Rd.", "interest": "felis orci, adipiscing non,", "additionalInfo": "lorem", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Blake Herman", "phone": "(937) 893-2970", "email": "magna.Nam@milacinia.net", "address": "933-4352 Tempor Road", "interest": "Mauris magna. Duis dignissim tempor arcu.", "additionalInfo": "hendrerit consectetuer, cursus et,", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Arthur Morrow", "phone": "(306) 127-2011", "email": "Mauris@elitpretium.net", "address": "499 Mollis. Road", "interest": "Donec egestas.", "additionalInfo": "eget,", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Jonas Williams", "phone": "(426) 693-1468", "email": "Lorem.ipsum@purusaccumsaninterdum.org", "address": "P.O. Box 418, 5764 Sollicitudin Ave", "interest": "Nulla tempor", "additionalInfo": "Aenean massa. Integer vitae nibh. Donec est", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Kenneth Nielsen", "phone": "(792) 966-3613", "email": "odio.auctor@ridiculusmusProin.net", "address": "Ap #427-4397 Tincidunt Street", "interest": "fringilla cursus purus. Nullam scelerisque", "additionalInfo": "semper cursus. Integer", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Theodore Hancock", "phone": "(183) 997-6787", "email": "Nunc.sed.orci@Curabiturutodio.co.uk", "address": "605-8139 Curabitur Street", "interest": "vel arcu eu odio tristique pharetra. Quisque", "additionalInfo": "mattis. Integer eu lacus. Quisque imperdiet, erat", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Damian Patton", "phone": "(871) 436-1034", "email": "pede@natoquepenatibuset.edu", "address": "797-1512 Nunc Street", "interest": "mollis. Phasellus libero", "additionalInfo": "ut cursus luctus, ipsum", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Herrod Thompson", "phone": "(548) 959-0561", "email": "enim.Sed.nulla@ligulaconsectetuerrhoncus.co.uk", "address": "176-9763 Non, Rd.", "interest": "vel, vulputate eu, odio. Phasellus at augue id ante dictum", "additionalInfo": "Lorem ipsum dolor sit", "sourceName": "Website", "sourceType": "Internet"},
  {"name": "Abdul Bishop", "phone": "(937) 275-1892", "email": "ligula@anteNuncmauris.edu", "address": "594-8487 Dolor St.", "interest": "amet, consectetuer adipiscing elit.", "additionalInfo": "at, velit. Cras lorem lorem, luctus ut, pellentesque", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Buckminster Frank", "phone": "(202) 697-0725", "email": "sit.amet@Maurisblandit.net", "address": "8036 Faucibus Rd.", "interest": "quis diam. Pellentesque habitant morbi tristique", "additionalInfo": "at fringilla purus mauris a nunc. In at", "sourceName": "Website", "sourceType": "Internet"},
  {"name": "Grant Stanley", "phone": "(715) 163-8643", "email": "nulla.In.tincidunt@aliquamerosturpis.org", "address": "Ap #947-9125 Ac Av.", "interest": "aliquet. Phasellus fermentum convallis ligula. Donec luctus aliquet odio.", "additionalInfo": "mi pede, nonummy ut, molestie in, tempus eu, ligula. Aenean", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Galvin Montoya", "phone": "(813) 144-2530", "email": "ornare@liberoDonec.com", "address": "Ap #835-3132 Velit. Avenue", "interest": "dui. Cum sociis natoque penatibus et magnis dis", "additionalInfo": "feugiat tellus lorem eu", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Gavin Petty", "phone": "(204) 183-2930", "email": "Morbi.vehicula.Pellentesque@imperdieterat.com", "address": "Ap #697-9751 Dui. St.", "interest": "Integer tincidunt aliquam arcu. Aliquam", "additionalInfo": "ultrices posuere cubilia Curae; Phasellus ornare. Fusce mollis. Duis", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Evan Carey", "phone": "(275) 620-5306", "email": "et@dictumsapienAenean.edu", "address": "6072 Morbi Rd.", "interest": "nec,", "additionalInfo": "tempor bibendum. Donec", "sourceName": "Website", "sourceType": "Internet"},
  {"name": "Elliott Mcclure", "phone": "(665) 695-5810", "email": "gravida@nunc.com", "address": "P.O. Box 975, 381 Et, Road", "interest": "Nullam velit dui, semper et, lacinia", "additionalInfo": "pharetra, felis eget varius ultrices, mauris ipsum porta", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Scott Steele", "phone": "(812) 726-7067", "email": "est@sapienNunc.net", "address": "363-1341 Diam St.", "interest": "mauris,", "additionalInfo": "purus, accumsan interdum libero dui", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Wade Warner", "phone": "(619) 373-8061", "email": "Duis.risus.odio@eros.org", "address": "759 Sed Street", "interest": "metus sit amet", "additionalInfo": "Sed nunc est, mollis non, cursus non, egestas", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Brennan Berger", "phone": "(752) 213-1074", "email": "vel.quam@neque.co.uk", "address": "P.O. Box 825, 3640 Laoreet Road", "interest": "fermentum arcu.", "additionalInfo": "in lobortis tellus justo sit amet nulla. Donec non", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Keegan Holcomb", "phone": "(889) 531-2916", "email": "tellus@montesnasceturridiculus.org", "address": "Ap #143-5095 Lectus. Rd.", "interest": "malesuada fames ac turpis egestas. Fusce", "additionalInfo": "eu nibh vulputate mauris sagittis placerat. Cras", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Allistair Carney", "phone": "(510) 764-3410", "email": "quis.lectus@elementumpurus.edu", "address": "179-3918 Pretium Rd.", "interest": "Proin eget odio. Aliquam vulputate ullamcorper magna.", "additionalInfo": "sit amet, consectetuer adipiscing elit. Aliquam auctor,", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Rahim Rowe", "phone": "(159) 670-5217", "email": "nulla.Cras@montesnascetur.co.uk", "address": "1422 Varius Ave", "interest": "a nunc. In at pede. Cras vulputate velit eu", "additionalInfo": "sed,", "sourceName": "Website", "sourceType": "Internet"},
  {"name": "Uriah Morse", "phone": "(373) 223-8639", "email": "urna.nec@Aliquam.ca", "address": "P.O. Box 919, 1748 Mauris St.", "interest": "sem. Pellentesque ut ipsum ac mi eleifend", "additionalInfo": "Morbi accumsan laoreet ipsum. Curabitur consequat, lectus sit amet luctus", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Jasper Garrett", "phone": "(535) 845-6144", "email": "mauris.elit.dictum@Sed.org", "address": "Ap #571-2134 Pellentesque. Av.", "interest": "auctor vitae,", "additionalInfo": "eros. Nam consequat dolor vitae dolor.", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Geoffrey Lowery", "phone": "(899) 307-7250", "email": "amet.consectetuer@Fuscealiquam.co.uk", "address": "879-6147 Malesuada Rd.", "interest": "mauris a nunc. In", "additionalInfo": "at risus. Nunc ac sem", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Isaac Houston", "phone": "(384) 805-6831", "email": "metus.facilisis@ad.ca", "address": "Ap #372-4915 Sed St.", "interest": "enim. Sed", "additionalInfo": "purus mauris a nunc. In", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Cruz Holcomb", "phone": "(474) 741-8064", "email": "non@urna.net", "address": "P.O. Box 599, 3438 Enim. Rd.", "interest": "diam nunc, ullamcorper eu, euismod ac, fermentum vel, mauris. Integer", "additionalInfo": "ut, pellentesque eget, dictum placerat, augue. Sed molestie.", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Dean Spence", "phone": "(666) 261-7563", "email": "Cras.interdum.Nunc@DonecfringillaDonec.edu", "address": "642-5899 Placerat. Ave", "interest": "Vestibulum ut eros non enim", "additionalInfo": "diam. Sed diam lorem, auctor quis, tristique ac, eleifend", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Kaseem Watson", "phone": "(605) 396-2766", "email": "elementum.at@Mauris.org", "address": "539 Curabitur Avenue", "interest": "sapien. Nunc pulvinar arcu et pede. Nunc sed", "additionalInfo": "eu tempor erat neque non quam. Pellentesque habitant", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Keefe Wright", "phone": "(610) 384-7403", "email": "Donec.vitae.erat@nibh.ca", "address": "179-3925 Ultrices. Av.", "interest": "Duis a mi fringilla mi lacinia mattis.", "additionalInfo": "elit, pellentesque a, facilisis non, bibendum sed, est.", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Joseph Sparks", "phone": "(979) 816-8429", "email": "arcu.eu.odio@nibhAliquamornare.ca", "address": "8768 Purus, Rd.", "interest": "velit eget laoreet posuere, enim nisl elementum purus,", "additionalInfo": "ac orci. Ut semper pretium neque.", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Rogan Williams", "phone": "(337) 576-8725", "email": "ac.turpis@loremeu.ca", "address": "P.O. Box 119, 8702 Et, Street", "interest": "Curae; Phasellus ornare. Fusce mollis. Duis sit amet diam eu", "additionalInfo": "vel arcu eu odio tristique pharetra.", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Joshua Lott", "phone": "(702) 947-6629", "email": "mollis@perconubianostra.co.uk", "address": "Ap #647-7051 Ac St.", "interest": "orci sem", "additionalInfo": "non quam. Pellentesque habitant morbi", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Orson Daugherty", "phone": "(486) 394-1749", "email": "parturient.montes@Nullamfeugiat.edu", "address": "669-2214 Ac Rd.", "interest": "ultrices. Vivamus rhoncus. Donec est. Nunc ullamcorper, velit", "additionalInfo": "Sed eget lacus. Mauris non dui nec urna suscipit", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Colton Bolton", "phone": "(305) 914-2954", "email": "velit.dui.semper@nequeIn.com", "address": "Ap #501-2642 Eleifend St.", "interest": "hendrerit a, arcu. Sed et libero. Proin mi.", "additionalInfo": "Morbi", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Brett Vazquez", "phone": "(469) 386-6945", "email": "Phasellus@fermentum.ca", "address": "3547 Risus. Street", "interest": "dignissim pharetra. Nam", "additionalInfo": "at augue id ante dictum cursus.", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Peter Glass", "phone": "(592) 978-5162", "email": "Phasellus@hendreritDonecporttitor.net", "address": "608-4844 Tempor Avenue", "interest": "sem ut cursus luctus, ipsum", "additionalInfo": "nulla magna, malesuada vel, convallis in, cursus et, eros.", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Russell Molina", "phone": "(262) 786-8052", "email": "Aliquam@mollisIntegertincidunt.org", "address": "Ap #939-1657 Non St.", "interest": "mi lorem, vehicula", "additionalInfo": "nec tempus mauris erat", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Beck Bradley", "phone": "(693) 170-8252", "email": "placerat.Cras.dictum@Vivamussit.org", "address": "648-2767 Mauris Street", "interest": "libero dui nec", "additionalInfo": "Vestibulum accumsan", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Keane Lindsey", "phone": "(137) 953-9201", "email": "metus@interdum.co.uk", "address": "5938 Aliquet Rd.", "interest": "risus. Donec egestas. Aliquam nec enim. Nunc ut erat.", "additionalInfo": "nisi a odio semper cursus. Integer mollis. Integer", "sourceName": "Website", "sourceType": "Internet"},
  {"name": "George Richards", "phone": "(632) 331-5252", "email": "ultricies.adipiscing.enim@morbitristique.org", "address": "Ap #555-5449 Massa. Ave", "interest": "est mauris, rhoncus id, mollis", "additionalInfo": "Nunc ut erat. Sed nunc est,", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Jack Oliver", "phone": "(904) 999-3634", "email": "at.risus.Nunc@enimSuspendisse.co.uk", "address": "2216 Mattis. St.", "interest": "et", "additionalInfo": "elementum at, egestas a, scelerisque sed, sapien.", "sourceName": "Website", "sourceType": "Internet"},
  {"name": "Hakeem Benjamin", "phone": "(449) 902-8987", "email": "lobortis.risus@non.net", "address": "P.O. Box 174, 7783 Semper. Rd.", "interest": "pede, nonummy ut, molestie in, tempus eu, ligula. Aenean euismod", "additionalInfo": "Morbi accumsan laoreet ipsum. Curabitur consequat, lectus", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Lewis Shaffer", "phone": "(670) 259-5340", "email": "dui@feugiatnon.ca", "address": "Ap #347-1039 Mauris St.", "interest": "Donec egestas.", "additionalInfo": "eget massa. Suspendisse eleifend.", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Peter Nash", "phone": "(725) 316-9451", "email": "diam.Proin.dolor@a.ca", "address": "5441 Dolor. St.", "interest": "Integer", "additionalInfo": "molestie sodales. Mauris blandit enim consequat purus. Maecenas libero est,", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Cade Waller", "phone": "(330) 816-3810", "email": "faucibus.Morbi.vehicula@a.co.uk", "address": "Ap #981-4222 Dui Road", "interest": "arcu. Nunc mauris. Morbi non sapien molestie orci tincidunt adipiscing.", "additionalInfo": "vel, vulputate eu, odio.", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Stephen Lawson", "phone": "(992) 663-5016", "email": "euismod.mauris.eu@Nunc.co.uk", "address": "P.O. Box 853, 6648 Volutpat St.", "interest": "ultrices", "additionalInfo": "Nullam lobortis quam a felis ullamcorper viverra. Maecenas iaculis aliquet", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Flynn Richards", "phone": "(338) 681-5382", "email": "rhoncus.id.mollis@liberoDonec.ca", "address": "Ap #450-9900 In Road", "interest": "parturient montes, nascetur ridiculus mus. Proin", "additionalInfo": "semper tellus id nunc", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Stuart Pollard", "phone": "(797) 235-0159", "email": "urna@sodalesMaurisblandit.ca", "address": "P.O. Box 937, 6952 Non Road", "interest": "egestas. Duis ac", "additionalInfo": "sit amet diam eu dolor egestas rhoncus. Proin nisl", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Nigel Dyer", "phone": "(201) 485-4156", "email": "enim.Mauris.quis@mollisInteger.co.uk", "address": "670 Feugiat St.", "interest": "rhoncus.", "additionalInfo": "pede ac urna. Ut tincidunt vehicula risus. Nulla", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Flynn Atkins", "phone": "(245) 138-9009", "email": "mi@dapibus.co.uk", "address": "P.O. Box 942, 6035 Convallis Av.", "interest": "quam", "additionalInfo": "auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Paul Rutledge", "phone": "(424) 272-9295", "email": "eget@dapibus.org", "address": "Ap #121-6370 Mollis Road", "interest": "elit erat", "additionalInfo": "convallis est, vitae sodales nisi magna", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Kadeem Alexander", "phone": "(101) 964-0214", "email": "sem@risusDonec.org", "address": "329-7270 Risus. Ave", "interest": "sed dictum eleifend, nunc risus varius orci, in consequat enim", "additionalInfo": "dui. Cum sociis natoque penatibus", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Drake Sanford", "phone": "(485) 364-0193", "email": "Aliquam@rhoncusProinnisl.edu", "address": "Ap #119-3016 Dui St.", "interest": "elementum at, egestas a, scelerisque", "additionalInfo": "porttitor interdum. Sed auctor odio a", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Amir Wolf", "phone": "(299) 227-9001", "email": "bibendum@eratvitaerisus.ca", "address": "P.O. Box 140, 3686 Dictum Rd.", "interest": "lectus convallis est, vitae sodales nisi magna sed", "additionalInfo": "pharetra", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Ryder Hopkins", "phone": "(647) 376-6981", "email": "molestie.tortor.nibh@Suspendisseacmetus.com", "address": "6872 Cras St.", "interest": "dictum ultricies ligula.", "additionalInfo": "nascetur ridiculus", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Benjamin Wyatt", "phone": "(235) 755-7037", "email": "neque@Suspendisse.ca", "address": "P.O. Box 387, 123 Mauris Av.", "interest": "augue malesuada malesuada. Integer id magna", "additionalInfo": "velit dui, semper et, lacinia vitae,", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Jesse Sears", "phone": "(544) 668-9693", "email": "Nulla.interdum.Curabitur@Morbi.com", "address": "616-7356 Vel Road", "interest": "aliquet, metus urna convallis erat, eget tincidunt dui", "additionalInfo": "quam quis diam. Pellentesque habitant morbi tristique senectus et", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Joshua Blackwell", "phone": "(916) 745-3140", "email": "tincidunt.nunc@Vivamussitamet.co.uk", "address": "582 Id, Street", "interest": "scelerisque", "additionalInfo": "semper pretium neque. Morbi quis", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Gavin Rios", "phone": "(121) 515-4975", "email": "elit@ipsum.co.uk", "address": "P.O. Box 973, 3627 Libero Street", "interest": "id, blandit at, nisi. Cum sociis natoque penatibus et", "additionalInfo": "In nec", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Hamish Ballard", "phone": "(508) 602-8504", "email": "mollis.Integer@semsemper.co.uk", "address": "1020 Velit Road", "interest": "nisi", "additionalInfo": "iaculis odio. Nam interdum", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Callum Long", "phone": "(453) 922-1112", "email": "a.aliquet.vel@hymenaeosMaurisut.com", "address": "759-6041 Sed Rd.", "interest": "Curabitur vel", "additionalInfo": "ipsum primis in faucibus orci luctus et", "sourceName": "Website", "sourceType": "Internet"},
  {"name": "Clayton Spence", "phone": "(350) 117-7152", "email": "Vivamus@Suspendissealiquet.org", "address": "Ap #298-1271 Proin St.", "interest": "dictum sapien. Aenean massa.", "additionalInfo": "ornare,", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Arden Garrison", "phone": "(251) 694-1423", "email": "tortor@ornareelit.co.uk", "address": "961-3275 Tristique Rd.", "interest": "Nulla tincidunt, neque vitae semper egestas, urna justo faucibus", "additionalInfo": "suscipit nonummy. Fusce fermentum fermentum arcu.", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Fitzgerald Vasquez", "phone": "(252) 660-0263", "email": "eu@Pellentesqueut.edu", "address": "Ap #475-7223 Vel, Street", "interest": "feugiat", "additionalInfo": "Sed nunc est, mollis non, cursus", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Ignatius Hendrix", "phone": "(448) 833-6559", "email": "luctus@justoeu.edu", "address": "Ap #429-9013 Fermentum Road", "interest": "Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed", "additionalInfo": "vitae risus. Duis a mi fringilla mi", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Gage Davis", "phone": "(453) 352-7688", "email": "Donec.nibh.Quisque@purus.com", "address": "5757 Mauris St.", "interest": "Phasellus", "additionalInfo": "Aliquam tincidunt, nunc ac mattis ornare,", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Steel Avery", "phone": "(931) 499-1220", "email": "Curae.Phasellus.ornare@Etiam.org", "address": "6066 Pretium Road", "interest": "elementum, lorem ut", "additionalInfo": "ultrices posuere cubilia Curae; Phasellus ornare. Fusce mollis. Duis", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Austin Stokes", "phone": "(427) 310-0481", "email": "nec@diam.com", "address": "P.O. Box 337, 5229 Gravida. Rd.", "interest": "senectus et netus et malesuada fames ac turpis egestas. Fusce", "additionalInfo": "in, tempus eu, ligula.", "sourceName": "Social Media", "sourceType": "Internet"},
  {"name": "Malik Mcfadden", "phone": "(747) 131-7584", "email": "Suspendisse.aliquet@tristique.org", "address": "164 Nulla Road", "interest": "laoreet posuere,", "additionalInfo": "libero est, congue a, aliquet vel,", "sourceName": "Phone", "sourceType": "Phone"},
  {"name": "Randall Levine", "phone": "(195) 387-2442", "email": "natoque.penatibus@rutrumlorem.net", "address": "4287 Cursus. Av.", "interest": "Cras sed leo. Cras vehicula aliquet libero. Integer", "additionalInfo": "a mi fringilla mi lacinia mattis. Integer eu lacus.", "sourceName": "Third Party", "sourceType": "Internet"},
  {"name": "Hilel Park", "phone": "(311) 344-7289", "email": "nibh@consectetuer.com", "address": "P.O. Box 508, 5486 Proin Street", "interest": "sapien. Cras dolor dolor, tempus non, lacinia at,", "additionalInfo": "tincidunt orci quis lectus. Nullam suscipit, est ac facilisis", "sourceName": "Website", "sourceType": "Internet"},
  {"name": "Galvin Ramos", "phone": "(109) 245-5556", "email": "Lorem.ipsum.dolor@massaVestibulumaccumsan.edu", "address": "Ap #504-7771 Sagittis Rd.", "interest": "torquent per conubia", "additionalInfo": "dictum. Phasellus in felis. Nulla", "sourceName": "Other", "sourceType": "Internet"},
  {"name": "Zephania Patrick", "phone": "(312) 494-6606", "email": "semper@acfermentumvel.com", "address": "6366 Nec, Road", "interest": "eget mollis lectus", "additionalInfo": "arcu. Sed eu nibh vulputate mauris sagittis placerat. Cras dictum", "sourceName": "Third Party", "sourceType": "Internet"}
];

User.find({
  where: {
    firstName: 'System',
    lastName: 'Automaton'
  }
}).then(function(sys){
  if (sys){
    console.log('\n>> Seeding Leads...');
    return Lead.bulkCreate(data).then(function(res){
       console.log('\n>> Setting creator for all seeded Leads...');
       return Lead.findAll().then(function(leads){
         var Q = require('q');
         var promises = [];
         for(var i = 0; i < leads.length; i++)
            promises.push(leads[i].setCreator(sys));
         return Q.all(promises).then(function(){
            promises.length = 0;
            console.log('>> Finished setting creators for seeded leads...');
            Dealership.find({
              where: {
                dealershipName: 'Hagerstown Ford'
              }
            }).then(function(dealership){
              for(var i = 0; i < leads.length; i++)
                promises.push(leads[i].setDealership(dealership));
              return Q.all(promises).then(function(){
                console.log('>> Finished setting Dealership for seeded leads...');
              });
            });
         })
       })
    });
  }
}).catch(function(err){
   console.log(err);
})
*/





