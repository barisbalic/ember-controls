var set = Ember.set, get = Ember.get;

/*
 * Formular view to be used to generate form HTML elements.
 *
 *   {{#view Ember.Form
 *           target="App.object"
 *           action="submit"}}
 *     {{view Ember.TextField name="field"}}
 *     {{view Ember.SubmitButton}}
 *   {{/view}}
 *
 * After click to submit button will result in call to App.statechart.submit
 * with form as the only argument. You can then use the instance to fetch its
 * data from callback:
 *
 *   App.object = Ember.Object.create({
 *     submit: function(form) {
 *       var data = form.get('data');
 *     }
 *   })
 *
 * Where data is pure key/value object with values collected from fields
 * which were present in formular. Every HTML element with attribute 'name'
 * is considered and its value is collected.
 */
Ember.Form = Ember.View.extend(Ember.TargetActionSupport, {
  classNames: ['ember-form'],

  tagName: 'form',

  data: {},

  /*
   * Collect data from inputs and trigger target action.
   */
  submit: function() {
    var childViews = get(this, 'childViews'),
        name, data = {};

    childViews.forEach(function(view, idx) {
      name = get(view, 'name');
      
      if(name) {
        data[name] = get(view, 'value');
      }  
    });

    this.set('data', data);
    this.triggerAction();
  },

  /*
   * Clear the current values in form.
   */
  clear: function() {
    var childViews = this.get('childViews');

    childViews.forEach(function(view) {
      view.set('value', '');
    })
  },

  /*
   * Listen on the data change in order to update the values of the
   * input fields within the form.
   *
   * @private
   */
  _updateValues: Ember.observer(function() {
    var data = this.get('data'),
        childViews = this.get('childViews');

    // Iterate through children and update the values.
    childViews.forEach(function(view, idx) {
      name = get(view, 'name');

      if(data[name]) {
        set(view, 'value', data[name]);
      }  
    })

  }, 'data')
})