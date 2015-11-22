import Ember from 'ember';
import config from 'ember-easy-form/config';

export default Ember.Component.extend({
  classNameBindings: ['property'],
  wrapper: Ember.computed(function() {
    var wrapperView = this.nearestWithProperty('wrapper');
    if (wrapperView) {
      return wrapperView.get('wrapper');
    } else {
      return 'default';
    }
  }),
  wrapperConfig: Ember.computed('wrapper', function() {
    return config.getWrapper(this.get('wrapper'));
  }),
  templateForName: function(name) {
    var template;

    if (this.container) {
      template = this.container.lookup('template:' + name);
    }

    return template || config.getTemplate(name);
  },
  // formForModel: Ember.computed(function(){
  //   var formForModelPath = this._keywords.formForModelPath;
  //   if (formForModelPath === 'context' || formForModelPath === 'controller' || formForModelPath === 'this') {
  //     return this.get('context');
  //   } else if (formForModelPath) {
  //     return this.get('context.' + formForModelPath);
  //   } else {
  //     return this.get('context');
  //   }
  // })
  init: function() {
    this._super(...arguments);
    var pathToProperty = 'model';
    var currentView = this;
    while(currentView && !('model' in currentView)) {
      pathToProperty = 'parentView.' + pathToProperty;
      currentView = Ember.get(currentView, 'parentView');
    }
    if (currentView) {
      Ember.defineProperty(this, 'formForModel', Ember.computed.alias(pathToProperty));
    } else {
      this.set('formForModel', null);
    }
  }
});
