// YOUR CODE HERE:

///////////////////////////////////////////////////////////////////////
// backbone-based implementation of chatterbox-client
///////////////////////////////////////////////////////////////////////

var Message = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox',
  
  defaults: {
    username:'',
    roomname:'',
    text:''
  }
});

var Messages = Backbone.Model.extend({
  model: Message,
  url: 'https://api.parse.com/1/classes/chatterbox',

  loadMsgs: function() {
    this.fetch({
      data: {order: '-createdAt'}
    });
  },
  
  parse: function(response, options) {
    var results = [];
    for (var i = response.results.length -1; i >= 0; i--) {
      results.push(response.results[i]);
    }
    return results;
  }

});

var FormView = Backbone.View.extend({

  initialize: function() {
    this.collection.on('sync', this.stopSpinner, this);
  },
  
  events: {
    'submit #send': 'handleSubmit'
  },

  handleSubmit: function(e) {
    e.preventDefault();

    this.startSpinner();

    var $text = this.$('#message');

    var message = {
      username: window.location.search.substr(10),
      text: $text.val()
    };

    $text.val('');

    var message = new Message(message);
    message.save();
  },

  startSpinner: function() {
    this.$('spinner img').show();
    this.$('form input[type=submit]').attr('disabled', "true");
  },

  stopSpinner: function() {
    this.$('.spinner img').fadeOut('fast');
    this.$('form input[type=submit]').attr('disabled', null);
  }

});


var MessageView = Backbone.View.extend({
  
  template: _.template('<div class="chat" data-id="<%- objectId %>"> \
    <div class="user"><%- username %></div> \
    <div class="text"><%- text %></div> \
    </div>'),

  render: function() {
    this.model.username = this.model.username || '';
    this.model.text = this.model.text || '';
    this.$el.html(this.template(this.model))
    return this.$el;
  }

});

var MessagesView = Backbone.View.extend({
  onscreenMessages: {},

  initialize: function() {
    this.collection.on('sync', this.render, this);
  },

  render: function() {
    _.each(this.collection.attributes, this.renderMessage, this);
  },

  renderMessage: function(message) {
    // console.log('message:',message);
    if( !this.onscreenMessages[message.objectId]) {
      var messageView = new MessageView({model: message});
      var $html = messageView.render();
      $('#chats').prepend(messageView.render());
      this.onscreenMessages[message.objectId] = true;
    }
  }
  
});


///////////////////////////////////////////////////////////////////////
// Simplified jQuery-based implementation of chatterbox-client
///////////////////////////////////////////////////////////////////////
// var app = {

//   server: 'https://api.parse.com/1/classes/chatterbox',

//   init: function() {
//     console.log('running chatterbox');

//     // Get username:
//     app.username = window.location.search.substr(10);

//     app.onscreenMessages = {};

//     // cache a dom reference:
//     app.$text = $('#message');

//     app.loadMsgs();
//     setInterval(app.loadMsgs.bind(app),1000);

//     $('#send').on('submit', app.handleSubmit);
//   },

//   handleSubmit: function(e) {
//     e.preventDefault();
//     var message = {
//       username: app.username,
//       text: app.$text.val()
//     };

//     app.$text.val('');

//     app.sendMsg(message);
//   },

//   renderMessage: function(message) {
//     var $user = $("<div>",{class: 'user'}).text(message.username);
//     var $text = $("<div>", {class:'text'}).text(message.text);
//     var $message = $("<div>", {class: 'chat', 'data-id': message.objectId}).append($user, $text);
//     return $message;
//   },

//   displayMessage: function(message) {
//     if( !app.onscreenMessages[message.objectId]) {
//       var $html = app.renderMessage(message);
//       $('#chats').prepend($html);
//       app.onscreenMessages[message.objectId] = true;
//     }
//   }, 

//   displayMessages: function(messages) {
//     for(var i = 0; i < messages.length; i++) {
//       app.displayMessage(messages[i]);
//     }
//   },

//   loadMsgs: function() {
//     $.ajax({
//       url: app.server,
//       data: { order: '-createdAt'},
//       contentType: 'application/json',
//       success: function(json) {
//         app.displayMessages(json.results);
//       },
//       complete: function() {
//         app.stopSpinner();
//       }
//     })
//   },

//   sendMsg: function(message) {
//     app.startSpinner();
//     $.ajax({
//       type: 'POST',
//       url: app.server,
//       data: JSON.stringify(message),
//       contentType: 'application/json',
//       success: function(json) {
//         message.objectId = json.objectId;
//         app.displayMessage(message)
//       },
//       complete: function() {
//         app.stopSpinner();
//       }
//     });
//   },

//   startSpinner: function() {
//     $('spinner img').show();
//     $('form input[type=submit]').attr('disabled', "true");
//   },

//   stopSpinner: function() {
//     $('.spinner img').fadeOut('fast');
//     $('form input[type=submit]').attr('disabled', null);
//   }

// };




///////////////////////////////////////////////////////////////////////
// FULL jQuery-based implementation of chatterbox-client
///////////////////////////////////////////////////////////////////////


// var app;
// $(function() {
//   app = {
// //TODO: The current 'addFriend' function just adds the class 'friend'
// //to all messages sent by the user
//     server: 'https://api.parse.com/1/classes/chatterbox/',
//     username: 'anonymous',
//     roomname: 'lobby',
//     lastMessageId: 0,
//     friends: {},

//     init: function() {
//       // Get username
//       app.username = window.location.search.substr(10);

//       // Cache jQuery selectors
//       app.$main = $('#main');
//       app.$message = $('#message');
//       app.$chats = $('#chats');
//       app.$roomSelect = $('#roomSelect');
//       app.$send = $('#send');

//       // Add listeners
//       app.$main.on('click', '.username', app.addFriend);
//       app.$send.on('submit', app.handleSubmit);
//       app.$roomSelect.on('change', app.saveRoom);

//       // Fetch previous messages
//       app.startSpinner();
//       app.fetch(false);

//       // Poll for new messages
//       setInterval(app.fetch, 3000);
//     },
//     send: function(data) {
//       app.startSpinner();
//       // Clear messages input
//       app.$message.val('');

//       // POST the message to the server
//       $.ajax({
//         url: app.server,
//         type: 'POST',
//         data: JSON.stringify(data),
//         contentType: 'application/json',
//         success: function (data) {
//           console.log('chatterbox: Message sent');
//           // Trigger a fetch to update the messages, pass true to animate
//           app.fetch();
//         },
//         error: function (data) {
//           console.error('chatterbox: Failed to send message');
//         }
//       });
//     },
//     fetch: function(animate) {
//       $.ajax({
//         url: app.server,
//         type: 'GET',
//         contentType: 'application/json',
//         data: { order: '-createdAt'},
//         success: function(data) {
//           console.log('chatterbox: Messages fetched');

//           // Don't bother if we have nothing to work with
//           if (!data.results || !data.results.length) { return; }

//           // Get the last message
//           var mostRecentMessage = data.results[data.results.length-1];
//           var displayedRoom = $('.chat span').first().data('roomname');
//           app.stopSpinner();
//           // Only bother updating the DOM if we have a new message
//           if (mostRecentMessage.objectId !== app.lastMessageId || app.roomname !== displayedRoom) {
//             // Update the UI with the fetched rooms
//             app.populateRooms(data.results);

//             // Update the UI with the fetched messages
//             app.populateMessages(data.results, animate);

//             // Store the ID of the most recent message
//             app.lastMessageId = mostRecentMessage.objectId;
//           }
//         },
//         error: function(data) {
//           console.error('chatterbox: Failed to fetch messages');
//         }
//       });
//     },
//     clearMessages: function() {
//       app.$chats.html('');
//     },
//     populateMessages: function(results, animate) {
//       // Clear existing messages

//       app.clearMessages();
//       app.stopSpinner();
//       if (Array.isArray(results)) {
//         // Add all fetched messages
//         results.forEach(app.addMessage);
//       }

//       // Make it scroll to the bottom
//       var scrollTop = app.$chats.prop('scrollHeight');
//       if (animate) {
//         app.$chats.animate({
//           scrollTop: scrollTop
//         });
//       }
//       else {
//         app.$chats.scrollTop(scrollTop);
//       }
//     },
//     populateRooms: function(results) {
//       app.$roomSelect.html('<option value="__newRoom">New room...</option><option value="" selected>Lobby</option></select>');

//       if (results) {
//         var rooms = {};
//         results.forEach(function(data) {
//           var roomname = data.roomname;
//           if (roomname && !rooms[roomname]) {
//             // Add the room to the select menu
//             app.addRoom(roomname);

//             // Store that we've added this room already
//             rooms[roomname] = true;
//           }
//         });
//       }

//       // Select the menu option
//       app.$roomSelect.val(app.roomname);
//     },
//     addRoom: function(roomname) {
//       // Prevent XSS by escaping with DOM methods
//       var $option = $('<option/>').val(roomname).text(roomname);

//       // Add to select
//       app.$roomSelect.append($option);
//     },
//     addMessage: function(data) {
//       if (!data.roomname)
//         data.roomname = 'lobby';

//       // Only add messages that are in our current room
//       if (data.roomname === app.roomname) {
//         // Create a div to hold the chats
//         var $chat = $('<div class="chat"/>');

//         // Add in the message data using DOM methods to avoid XSS
//         // Store the username in the element's data
//         var $username = $('<span class="username"/>');
//         $username.text(data.username+': ').attr('data-username', data.username).attr('data-roomname',data.roomname).appendTo($chat);

//         // Add the friend class
//         if (app.friends[data.username] === true)
//           $username.addClass('friend');

//         var $message = $('<br><span/>');
//         $message.text(data.text).appendTo($chat);

//         // Add the message to the UI
//         app.$chats.append($chat);
//       }
//     },
//     addFriend: function(evt) {
//       var username = $(evt.currentTarget).attr('data-username');

//       if (username !== undefined) {
//         console.log('chatterbox: Adding %s as a friend', username);

//         // Store as a friend
//         app.friends[username] = true;

//         // Bold all previous messages
//         // Escape the username in case it contains a quote
//         var selector = '[data-username="'+username.replace(/"/g, '\\\"')+'"]';
//         var $usernames = $(selector).addClass('friend');
//       }
//     },
//     saveRoom: function(evt) {

//       var selectIndex = app.$roomSelect.prop('selectedIndex');
//       // New room is always the first option
//       if (selectIndex === 0) {
//         var roomname = prompt('Enter room name');
//         if (roomname) {
//           // Set as the current room
//           app.roomname = roomname;

//           // Add the room to the menu
//           app.addRoom(roomname);

//           // Select the menu option
//           app.$roomSelect.val(roomname);

//           // Fetch messages again
//           app.fetch();
//         }
//       }
//       else {
//         app.startSpinner();
//         // Store as undefined for empty names
//         app.roomname = app.$roomSelect.val();

//         // Fetch messages again
//         app.fetch();
//       }
//     },
//     handleSubmit: function(evt) {
//       var message = {
//         username: app.username,
//         text: app.$message.val(),
//         roomname: app.roomname || 'lobby'
//       };

//       app.send(message);

//       // Stop the form from submitting
//       evt.preventDefault();
//     },
//     startSpinner: function(){
//       $('.spinner img').show();
//       $('form input[type=submit]').attr('disabled', "true");
//     },

//     stopSpinner: function(){
//       $('.spinner img').fadeOut('fast');
//       $('form input[type=submit]').attr('disabled', null);
//     }
//   };
// }());