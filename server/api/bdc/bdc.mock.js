var mock = {};
mock.metrics = {
      phone: [
        {cname: 'Job Bloe', cavatar: 'assets/images/a1.jpg', ctype: 'outgoing',
          ctime: 'Today 4:21 pm', comments: 'Follow up with customer regarding service calls'},
        {cname: 'John Cacron', cavatar: 'assets/images/a2.jpg', ctype: 'incoming',
          ctime: 'Today 4:21 pm', comments: 'Customer wanted to know when his car was going to be ready'},
        {cname: 'OJ Simpson', cavatar: 'assets/images/a3.jpg', ctype: 'missed',
          ctime: 'Today 4:21 pm', commments: ''},
        {cname: 'Bob Shapiro', cavatar: 'assets/images/a4.jpg', ctype: 'outgoing',
          ctime: 'Today 4:21 pm', comments: ''},
        {cname: 'Jesus Christ', cavatar: 'assets/images/a5.jpg', ctype: 'missed',
          ctime: 'Today 4:21 pm', comments: ''}
      ],
      correspondence: [
        {crname: 'Luda Agodio', crtype: 'Text',   crsubject:'',  crcontent: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', crtime: '9hours ago'},
        {crname: 'Eric Carper', crtype: 'Text',   crsubject: '', crcontent: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', crtime: '9hours ago'},
        {crname: 'Miles Johnson', crtype: 'Mail', crsubject: 'Attention Required', crcontent: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', crtime: '9hours ago'},
        {crname: 'Ronda Roussey', crtype: 'Mail', crsubject:'Re: Luda is good',  crcontent: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', crtime: '9hours ago'},
        {crname: 'Chris Brown',  crtype: 'Mail',  crsubject:'Progress Report',  crcontent: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', crtime: '9hours ago'},
      ],
      appointments: [
        {
          cname: 'Johnny Bloe',
          comments: 'Sometimes by accident, sometimes on purpose (injected humour and the like).',
          date: '16.11.2015',
          statusClass: 'info',
          tagName: 'Mark',
          appointmentStatusClass: 'made',
        },
        {
          cname: 'Johnny Bloe',
          comments: 'Sometimes by accident, sometimes on purpose (injected humour and the like).',
          date: '16.11.2015',
          statusClass: 'danger',
          tagName: 'Mark',
          appointmentStatusClass: 'missed',
        },
        {
          cname: 'Johnny Bloe',
          comments: 'Sometimes by accident, sometimes on purpose (injected humour and the like).',
          date: '16.11.2015',
          statusClass: 'danger',
          tagName: 'Mark',
          appointmentStatusClass: 'missed',
        },
        {
          cname: 'Johnny Bloe',
          comments: 'Sometimes by accident, sometimes on purpose (injected humour and the like).',
          date: '16.11.2015',
          statusClass: 'success',
          tagName: 'Mark',
          appointmentStatusClass: 'sold',
        },
        {
          cname: 'Johnny Bloe',
          comments: 'Sometimes by accident, sometimes on purpose (injected humour and the like).',
          date: '16.11.2015',
          statusClass: 'success',
          tagName: 'Mark',
          appointmentStatusClass: 'sold',
        }
      ]

}

mock.dealerships = [{
  name: "Hagerstown Ford",
  owner: [{name: 'Rick kelly'}],
  genManger: [{name: 'Eric Carper'}],
  teams: [
    {
      name: "All Teams",
      members: [
        {
          name: 'All Employees',
          role: 'default'
        },
        {
          name: 'Ludovic Agodio',
          role: 'admin'
        },
        {
          name: 'Miles Johnson',
          role: 'admin'
        },
        {
          name: 'Eric Carper',
          role: 'gen_mgr'
        },
        {
          name: 'Rick Kelly',
          role: 'owner'
        },
        {
          name: 'Roger Mason',
          role: 'gen_sale_mgr'
        },
        {
          name: 'Stacy Dash',
          role: 'gen_sale_mgr'
        },
        {
          name: 'Meagan Good',
          role: 'sale_mgr'
        }, {
          name: 'Amber Rose',
          role: 'sale_mgr'
        }, {
          name: 'Kim Kardashian',
          role: 'bdc_mgr'
        },
        {
          name: 'Shenaka Adams',
          role: 'bdc_mgr'
        },
        {
          name: 'Roger Moody',
          role: 'sale_rep'
        }, {
          name: 'Dominique Toretto',
          role: 'sale_rep'
        }, {
          name: 'Romeo Zalch',
          role: 'sale_rep'
        },
        {
          name: 'Johnny Manzel',
          role: 'sale_rep'
        },
        {
          name: 'Michael Jordan',
          role: 'sale_rep'
        }, {
          name: 'Scotty Pippen',
          role: 'sale_rep'
        }, {
          name: 'Dennis Rodman',
          role: 'sale_rep'
        },
        {
          name: 'Magic Johnson',
          role: 'sale_rep'
        },
        {
          name: 'Allen Iverson',
          role: 'sale_rep'
        }, {
          name: 'Stephen Curry',
          role: 'sale_rep'
        }, {
          name: 'LeBron James',
          role: 'sale_rep'
        }, {
          name: 'Carmello Anthony',
          role: 'sale_rep'
        }, {
          name: 'Chris Paul',
          role: 'sale_rep'
        }, {
          name: 'Kyrie Irving',
          role: 'sale_rep'
        }, {
          name: 'Lauren Woods',
          role: 'sale_rep'
        }, {
          name: 'Julianna Rodgers',
          role: 'sale_rep'
        },
        {
          name: 'Chelsea Lynn',
          role: 'sale_rep'
        },
        {
          name: 'Vida Guierra',
          role: 'sale_rep'
        }
      ]
    }
  ]
}];

mock.summary_stats = [
  {
    bgStyle: 'navy-bg',
    title: 'Calls',
    category: 'calls',
    value: 217
  },
  {
    bgStyle: 'navy-bg',
    title: 'Mail',
    category: 'mail',
    value: 400
  },
  {
    bgStyle: 'navy-bg',
    title: 'Texts',
    category: 'text',
    value: 10
  },
  {
    bgStyle: 'lazur-bg',
    title: 'Appointments Made',
    category: 'appointment_made',
    value: 120
  },
  {
    bgStyle: 'navy-bg',
    title: 'Appointments Sold',
    category: 'appointment_sold',
    value: 462
  },
  {
    bgStyle: 'red-bg',
    title: 'Appointments Missed',
    category: 'appointment_missed',
    value: 610
  },

];

mock.stats = [
  { id:'won',
    cars: {units: 3, pvr: 100000},
    trucks: {units: 4, pvr: 30000},
    sources: [
      {
        id: 'Walk-In',
        name: 'Walk In',
        state: true,
      },
      {
        id: 'Internet',
        name: 'Internet',
        state: true,
      },
      {
        id: 'Phone',
        name: 'Phone',
        state: true,
      },
      {
        id: 'HappyTag',
        name: 'Happy Tag',
        state: true,
      },
      {
        id: 'Other',
        name: 'Other',
        state: true,
      }
    ]
  },

  { id:'lost',
    cars: {units: 20, pvr: 100000},
    trucks: {units: 12, pvr: 30000},
    sources: [
      {
        id: 'Walk-In',
        name: 'Walk In',
        state: true,
      },
      {
        id: 'Internet',
        name: 'Internet',
        state: true,
      },
      {
        id: 'Phone',
        name: 'Phone',
        state: true,
      },
      {
        id: 'HappyTag',
        name: 'Happy Tag',
        state: true,
      },
      {
        id: 'Other',
        name: 'Other',
        state: true,
      }
    ]
  },

  { id:'total',
    sources: [
      {
        id: 'Walk-In',
        name: 'Walk In',
        state: true,
      },
      {
        id: 'Internet',
        name: 'Web',
        state: true,
      },
      {
        id: 'Phone',
        name: 'Phone',
        state: true,
      },
      {
        id: 'HappyTag',
        name: 'Happy Tag',
        state: true,
      },
      {
        id: 'Other',
        name: 'Other',
        state: true,
      }
    ]
  },

];

export default mock;