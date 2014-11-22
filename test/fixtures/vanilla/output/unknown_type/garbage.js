import Ember from "ember";

var GarbageType = Ember.Object.extend({
  someProperty: function(){
    console.log('hello');
  }.property('hello')
});

export default GarbageType;
