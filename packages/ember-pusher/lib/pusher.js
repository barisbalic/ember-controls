require('ember-utils/delegate');

/**
  @class

  `Em.Pusher` is wrapper for Pusher client library, allowing to
  communicate with pusherapp.com. It encapsulates all the Pusher
  library and none of its parts is intended to be used directly
  outside this class.

  ## Connection
  By default library would try to connect to pusher imediatelly in
  case key was already given. If you dont wanna connect right away,
  leave a constructor without a key and use the `.connect(key)` call
  later whenever you are ready. The following call is the simpliest
  connect:

      var pusher = Em.Pusher.create({key: 'your api key'});

  ## Channels
  In order to bind to events you would have to first subscribe to
  channels. In order to do so you are given two methods:

      pusher.subscribe('channel name');
      pusher.unsubscribe('channel name');

  After subscribe, you are instantly able to use `.on` call to bind
  to events. In case of `.unsubscribe` call, all your event bindings
  would be destroyed, so you dont have to take care about that.

  ## Events
  Event callbacks are created for a given event on given channel. The
  callback is specified by `target` and `action` pair. To bind and
  unbind the given event handler use:

      pusher.on('channel name', 'event name', target, 'action');
      pusher.off('channel name', 'event name', target, 'action');

  @extends Ember.Object
*/
Em.Pusher = Em.Object.extend(Em.Delegate, {

  /**
    Pusher connection API key.

    @private
    @type String
    @default null
  */
  key: null,

  /**
     Current Pusher connection state.
   
     @type String
     @default uninitialized
  */
  state: 'uninitialized',

  connected: function() {
    return this.get('state') == 'connected';
  }.property('state').cacheable(),
  
  /**
    List of channels.

    @public
    @type Ember.Map
  */
  channels: Ember.Map.create(),

  /**
    Pusher library instance.

    @private
    @type Pusher
    @default null
  */
  _server: null,

  /*
   * Initialize Pusher component, if the key was already given, we
   * would connect right away.
   */
  init: function() {
    var self = this,
        key = this.get('key');

    if(key) {
      this.connect(key);
    }

    // Delegate disconnect to native library.
    self._delegate('disconnect', '_server');
  },

  /**
    Subscribe to the given channel to start receiving events from server.
    In order to handle events, you have to continue with attaching the
    event listener for events with appropriate name you are intereste in.
    Until the channel is connected, no event handlers can be created.

    @public
    @param {String} Channel name.
  */
  subscribe: function(channelName) {
    if(this.channels.has(channelName)) return;

    var channel = Em.PusherChannel.create({
      name: channelName,
      transport: this._assertServer().subscribe(channelName)
    });

    this.channels.set(channelName, channel);
  },

  /**
    Unsubscribe previously subscribed channel from server. After its done
    all its event handlers are destroyed along, thus no more events
    are going to be received.

    @public
    @param {String} Channel name.
  */
  unsubscribe: function(channelName) {
    if(!this.channels.has(channelName)) return;

    this._assertServer().unsubscribe(channelName);
    this.channels.get(channelName).destroy();
    this.channels.remove(channelName);
  },

  /*
   * Pusher connection API key.
   *
   * @public
   * @param {String} Application key.
   */
  connect: function(key) {

    // If the server is already created we just call its .connect()
    // method.
    if(this._server) {
      this._server.connect();
      return;
    }

    ember_assert('Pusher API key has to be given!', !!key);

    var self = this,
        server = new Pusher(key);
    
    server.connection.bind('state_change', function(states) {
      self.set('state', states.current);
    });

    this._server = server;
  },

  /**
    Register callback for a given event on channel. Callback is always
    specified by target / action pair. To register for `new-message` event
    on `messages` channel you can do:

        pusher.on('messages', 'new-message', App.messagesController, 'newMessage');

    Given function would be called with event payload and name (you can use one 
    callback to handle multiple different events and distinguish them by name argument).
    The callback could look like this:

        App.messagesController = Em.Object.create({
          ...

          newMessage: function(data, name) {
            console.log("You've received event '%@': '%@'!".fmt(name, data));
          }
        })

    `Console.log` output might look like 
    "You've received event 'new-message': 'Hey whats up?'!".

    @public
    @param {String} Channel name.
    @param {String} Event name.
    @param {Object} Target object.
    @param {String} Action to be triggered on target.
  */
  on: function(channelName, event, target, action) {
    this._assertChannel(channelName).on(event, target, action);
  },  

  /**
    Remove previously registered event callback. 

    @public
    @param {String} Channel name.
    @param {String} Event name.
    @param {Object} Target object.
    @param {String} Action to be triggered on target.
  */
  off: function(channelName, event, target, action) {
    this._assertChannel(channelName).off(event, target, action);
  },

  /**
    Fetch channel by name and throw exception if it doesn't exist.

    @private
    @params {String} Channel name.
  */
  _assertChannel: function(name) {
    ember_assert('Channel doesnt exist!', this.get('channels').has(name));
    return this.get('channels').get(name);
  },

  /**
    Fetch server connection and throw exception if it doesn't exist.

    @private
  */
  _assertServer: function() {
    ember_assert('Server instance doesn\'t exist!', !!this._server);    
    return this._server;
  }
})

/**
  @class

  `Em.PusherChannel` is internal class to the `Em.Pusher` responsible to
  hold attributes and handle actions for specific channel.

  @extends Ember.Object
*/
Em.PusherChannel = Em.Object.extend({

  name: '',

  transport: null,

  /**
    List of currently active event handlers. Its purpose is to store
    list of callback functions, which are mapped by target / action keys
    used by Ember.

    @private
    @type Object
    @default {}
  */
  _callbacks: {},

  /**
    See `Em.Pusher.on`.

    @param {String} Event name.
    @param {Object} Target object.
    @param {String} Action to be triggered on target.
  */
  on: function(event, target, action) {
    var key = [event, target, action].join('_'),

    callback = function(data) {
      target[action].call(target, data, event);
    };

    this.transport.bind(event, callback);

    this._callbacks[key] = callback;
  },

  /**
    See `Em.Pusher.off`.
    
    @param {String} Event name.
    @param {Object} Target object.
    @param {String} Action to be triggered on target.
  */
  off: function(event, target, action) {
    var key = [event, target, action].join('_'),
        callback = this._callbacks[key];

    this.transport.unbind(event, callback);

    this._callbacks[key] = null;
  }
})