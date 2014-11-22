App.GarbageType = Ember.Object.extend({
  someProperty: function(){
    console.log('hello');
  }.property('hello')
});
