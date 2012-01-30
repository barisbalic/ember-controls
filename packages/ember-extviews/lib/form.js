var set = Ember.set, get = Ember.get;

Ember.Form = Ember.View.extend({
  classNames: ['ember-form'],

  tagName: 'form',

  data: {},

  submit: function(target, action) {
    var target = target || get(this, 'target');
    ember_assert('Target has to be specified', target != undefined);
    var action = action || get(this, 'action'),
        firstView = get(this, 'childViews').get('firstObject'),
        childViews = get(firstView, 'childViews'),
        input, name, data = {};

    childViews.forEach(function(view, idx) {
      name = get(view, 'name');
      
      if(name) {
        data[name] = get(view, 'value');
      }  
    })

    target[action].call(target, data);
  }
})