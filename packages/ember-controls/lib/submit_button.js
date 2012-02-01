var get = Ember.get;

/*
 * Submit button to be used to trigger the formular send action.
 */
Ember.SubmitButton = Ember.Button.extend({
  target: get(this, 'parentView'),
  action: 'submit'
})