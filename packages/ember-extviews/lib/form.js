var set = Ember.set, get = Ember.get;

Ember.Form = Ember.View.extend({
  classNames: ['ember-form'],

  tagName: 'form',

  /*
   * Call a target action with object, containing all collected
   * data from formular input fields.
   *
   * @param {Ember.Object} Object, which receives call.
   * @param {String} Target action to be called.
   */
  submit: function(target, action) {
    var target = target || get(this, 'target'),
        action = action || get(this, 'action');
    
    ember_assert('target has to be Ember.Object', target instanceof Ember.Object);
    ember_assert('action has to be String', typeof action == 'string');

    var firstView = get(this, 'childViews').get('firstObject'),
        childViews = get(firstView, 'childViews'),
        name, data = {};

    childViews.forEach(function(view, idx) {
      name = get(view, 'name');
      
      if(name) {
        data[name] = get(view, 'value');
      }  
    })

    target[action].call(target, data);
  }
})