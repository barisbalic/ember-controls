var set = Ember.set, get = Ember.get;

/*
 * Formular view to be used to generate form HTML elements. It can have multiple
 * child views and the ones with the name attribute would be collected to the
 * data object once the form is submited.
 *
 * Usage:
 * {{#view Ember.Form action="myAction" target="App.statechart"}}
 *   {{view Ember.TextField name="title"}}
 *   {{view Ember.SubmitButton value="Send"}}
 * {{/view}}
 *
 * myAction: function(data) {
 *   console.log(data); //= {title: 'foo'} 
 * }
 */
Ember.Form = Ember.View.extend({
  classNames: ['ember-form'],

  tagName: 'form',

  action: '',

  target: null,

  /*
   * Call a target action with object, containing all collected
   * data from formular input fields.
   */
  submit: function() {
    var target = get(this, 'target'),
        action = get(this, 'action'),
        childViews = get(this, 'childViews'),
        name, data = {};

    if(typeof target == 'string') {
      target = Ember.getPath(target);
    }
    
    ember_assert('target has to be Ember.Object', target instanceof Ember.Object);
    ember_assert('action has to be String', typeof action == 'string');

    childViews.forEach(function(view, idx) {
      name = get(view, 'name');
      
      if(name) {
        data[name] = get(view, 'value');
      }  
    })

    target[action].call(target, data);
  }
})