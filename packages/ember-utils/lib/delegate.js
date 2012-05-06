/**
  Mixin contains `_delegate` method allowing simple metaprogramming.
*/
Ember.Delegate = Ember.Mixin.create({

  /**
    Delegate given method call to object attribute, which is evaluated lazily
    just in the time of the method call, thus doesn't have to be ready at a 
    time when delegation was created.

    Usage:
    App.Foo = Em.Object.extend(Em.Delegate, {
      target: {
        method: function() { console.log('Hey!') }
      },

      init: function() {
        this._delegate('method', 'target');
      }
    })

    App.Foo.create().method() // would console.log 'Hey!'
    

    @private
    @param {String} Name of method to delegate.
    @param {String} Key of object to delegate to.
  */
  _delegate: function(action, to) {
    var self = this;

    this[action] = function() {
      var target = self[to];
      ember_assert("Target doesn't exist!", !!target);

      return target[action].apply(target, arguments);
    }
  }
})