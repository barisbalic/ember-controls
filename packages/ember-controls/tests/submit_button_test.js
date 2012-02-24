var view;

module("Ember.SubmitButton", {

  setup: function() {
    view = Ember.View.create({
      template: Ember.Handlebars.compile("{{view Ember.SubmitButton}}")
    });
  },

  teardown: function() {
    Ember.run(function() {
      view.destroy();
    });
  }
});

test("should have parentView.submit as target", function() {
  var called = false;

  view.reopen({
    submit: function() {
      called = true;
    }
  });
  
  Ember.run(function() {
    view.append();
  })

  var button = view.get('childViews').get('firstObject');

  ok(button.get('target') == view, 'it should have view as target');
  ok(button.get('action') == 'submit', 'it should have submit as action');
});
