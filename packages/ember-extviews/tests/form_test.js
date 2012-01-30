var form, application;
var get = Ember.get, set = Ember.set;

module("Ember.Form", {
  setup: function() {
    application = Ember.Application.create();
    form = Ember.Form.create({});
  },

  teardown: function() {
    Ember.run(function() {
      form.destroy();
      application.destroy();
    });
  },
});

function append() {
  Ember.run(function() {
    form.appendTo('#qunit-fixture');
  });
}

test("should have ember-form class", function() {
  append();

  ok(form.$().hasClass("ember-form"));
});

test("should have tag name form", function() {
  append();

  ok(form.$().is('form'));
});

test('submit should call target action with data', function() {
  var formData = null;

  form.reopen({
    template: Ember.Handlebars.compile('\
      {{#view Ember.Form action="login"}}       \
        {{#view Ember.TextField id="foo" name="bar" value="baz"}}      \
        {{/view}}                               \
      {{/view}}                                 \
    ')
  })

  var actionObject = Ember.Object.create({
    myAction: function(data) {
      formData = data;
    }
  });

  set(form, 'action', 'myAction');
  set(form, 'target', actionObject);

  append();

  form.submit();

  ok(formData.bar == "baz", 'it should call target with valid data');
});