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
      {{#view Ember.Form}}                                    \
        {{view Ember.TextField name="first" value="value1"}}  \
        {{view Ember.TextField name="second" value="value2"}} \
      {{/view}}                                               \
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

  ok(formData.first == "value1", 'it should call target with valid data');
  ok(formData.second == "value2", 'it should call target with valid data');
});

test('submit should call target action with data from submit arguments', function() {
  var wasCalled = false;

  form.reopen({
    template: Ember.Handlebars.compile('\
      {{#view Ember.Form}}                                    \
        {{view Ember.TextField name="first" value="value1"}}  \
      {{/view}}                                               \
    ')
  })

  var actionObject = Ember.Object.create({
    myAction: function(data) {
      wasCalled = true;
    }
  });

  append();

  form.submit(actionObject, 'myAction');

  ok(wasCalled, 'it should call target');
});

test('submit should fail if target was not specified', function() {
  append();

  raises(function() {
    form.submit();
  }, Error);
});