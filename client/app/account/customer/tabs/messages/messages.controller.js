'use strict';

angular.module('dealScanCrmApp')
  .controller('MessagesCtrl', function ($scope, selectedCustomer, $filter) {

    var _messages = this;
    _messages.thisCustomer  = selectedCustomer;
    _messages.composeNew = {status: true, type:'Text'};
    _messages.viewOptions = 'All';


    _messages.filterMessages = function(val, idx, arr){
      return function(val, idx, arr) {
        console.log(val);
        if (_messages.viewOptions == 'All') return true;
        else return _messages.viewOptions == val.type;
      };
    }


    _messages.compose = function(msg){
      console.log(msg);
      _messages.activeCorrespondence = {};
      switch(msg){
        case 'Text':
          _messages.composeNew.status = true;
          _messages.composeNew.type = 'Text';
           break;
        case 'Email':
          _messages.composeNew.status = true;
          _messages.composeNew.type = 'Email';
          break;
      }
    }




    _messages.activeCorrespondence = {};
    _messages.chatView = function(msg){
      if (!msg) return;
      _messages.composeNew.status = false;
      _messages.activeCorrespondence = msg;
      _messages.composeNew.type = msg.type;
      console.log(_messages.activeCorrespondence);
    }


    _messages.correspondences = [
      {
        correspondenceID: 1,
        sender: 'Luda Agodio',
        timestamp: 'April 11th, 2016',
        subject: null,
        chatHistory: [
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 11th, 2016 4:00PM',
            status: 'received'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 11th, 2016 3:45PM',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 10th, 2016 10:00AM',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 10th, 2016 9:45AM',
            status: 'received'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 9th, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 8th, 2016',
            status: 'received'
          },
        ],
        type: 'Text',
      },
      {
        correspondenceID: 2,
        sender: 'Eric Carper',
        timestamp: 'April 9th, 2016',
        subject: 'Customer Module',
        chatHistory: [
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 9th, 2016',
            status: 'received'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 8th, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 8th, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 7th, 2016',
            status: 'received'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 6th, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 6th, 2016',
            status: 'received'
          },
        ],
        type: 'Email',
      },
      {
        correspondenceID: 3,
        sender: 'Rick Kelly',
        timestamp: 'April 5th, 2016',
        subject: 'Fwd: Customer Module',
        chatHistory: [{
          content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
          "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
          "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
          timestamp: 'April 4th, 2016',
          status: 'received'
        },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 4th, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 4th, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 4th, 2016',
            status: 'received'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 4th, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 3th, 2016',
            status: 'received'
          }],
        type: 'Email',
      },
      {
        correspondenceID: 4,
        sender: 'Miles Johnson',
        timestamp: 'April 1st, 2016',
        subject: null,
        chatHistory: [{
          content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
          "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
          "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
          timestamp: 'April 1st, 2016',
          status: 'received'
        },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 1st, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'March 31st, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'March 30th, 2016',
            status: 'received'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'March 20th, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'March 28th, 2016',
            status: 'received'
          }],
        type: 'Text',
      },
      {
        correspondenceID: 5,
        sender: 'Marcus Finley',
        timestamp: 'April 1st, 2016',
        subject: null,
        chatHistory: [{
          content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
          "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
          "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
          timestamp: 'April 1st, 2016',
          status: 'received'
        },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'April 1st, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'March 28th, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'March 28th, 2016',
            status: 'received'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'March 27th, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'March 27th, 2016',
            status: 'received'
          },],
        type: 'Text',
      },
      {
        correspondenceID: 6,
        sender: 'Cary-Lee Gaskell',
        timestamp: 'March 25th, 2016',
        subject: 'DealScan CRM - Front End Development',
        chatHistory: [{
          content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
          "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
          "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
          timestamp: 'March 25th, 2016',
          status: 'received'
        },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'March 20th, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'March 20th, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'March 19th, 2016',
            status: 'received'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'March 18th, 2016',
            status: 'sent'
          },
          {
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
            "when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
            timestamp: 'March 18th, 2016',
            status: 'received'
          },],
        type: 'Email',
      },
    ];


  });
