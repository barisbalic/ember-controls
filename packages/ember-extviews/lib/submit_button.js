/*
 * Submit button to be used to trigger the formular send action.
 */
Ember.SubmitButton = Ember.Button.extend({
  target: parentView,
  action: 'submit'
})