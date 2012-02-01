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

function append(view) {
  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });
}

test("should have ember-form class", function() {
  append(form);

  ok(form.$().hasClass("ember-form"));
});

test("should have tag name form", function() {
  append(form);

  ok(form.$().is('form'));
});

test('submit should call target action with data', function() {
  var formData = null;

  form.reopen({
    template: Ember.Handlebars.compile('\
        {{view Ember.TextField name="first" value="value1"}}  \
        {{view Ember.TextField name="second" value="value2"}} \
    ')
  })

  var actionObject = Ember.Object.create({
    myAction: function(data) {
      formData = data;
    }
  });

  set(form, 'action', 'myAction');
  set(form, 'target', actionObject);

  append(form);

  form.submit();

  ok(formData.first == "value1", 'it should call target with valid data');
  ok(formData.second == "value2", 'it should call target with valid data');
});

test('submit should evaluate target if String was specified', function() {
  var wasCalled = false;

  Ember.actionObject = Ember.Object.create({
    myAction: function(data) {
      wasCalled = true;
    }
  });

  set(form, 'target', 'Ember.actionObject')
  set(form, 'action', 'myAction')

  append(form);

  form.submit();

  ok(wasCalled, 'it should call target');
});

test('submit should fail if target action is not a function', function() {
  append(form);

  var object = Ember.Object.create({
    foo: 'bar'
  });

  set(form, 'target', object)
  set(form, 'action', 'foo')

  raises(function() {
    form.submit();
  }, Error);
});

test('set date should fill in values to inputs', function() {
  var formData = null;

  form.reopen({
    template: Ember.Handlebars.compile('\
      {{view Ember.TextField name="first"}}  \
    ')
  })

  append(form);

  var first = form.get('childViews').get('firstObject'),
      second = form.get('childViews').get('lastObject');

  form.set('data', {first: 'value1'});

  ok(first.get('value') == 'value1');
});