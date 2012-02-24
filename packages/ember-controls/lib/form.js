var set = Ember.set, get = Ember.get;

/*
 * Formular view to be used to generate form HTML elements.
 */
Ember.Form = Ember.View.extend(Ember.TargetActionSupport, {
  classNames: ['ember-form'],

  tagName: 'form',

  data: {},

  /*
   * Listen on the data change in order to update the values of the
   * input fields within the form.
   */
  updateValues: Ember.observer(function() {
    var data = this.get('data'),
        childViews = this.get('childViews');

    // Iterate through children and update the values.
    childViews.forEach(function(view, idx) {
      name = get(view, 'name');

      if(data[name]) {
        set(view, 'value', data[name]);
      }  
    })

  }, 'data'),

  /*
   * Call a target action with object, containing all collected
   * data from formular input fields.
   */
  triggerAction: function() {
    var childViews = get(this, 'childViews'),
        name, data = {};

    childViews.forEach(function(view, idx) {
      name = get(view, 'name');
      
      if(name) {
        data[name] = get(view, 'value');
      }  
    });
    
    this.set('data', data);
    this._super();
  },

  submit: function() {
    this.triggerAction();
  }
})