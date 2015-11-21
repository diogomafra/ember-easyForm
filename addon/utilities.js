import Ember from 'ember';

const {underscore, capitalize} = Ember.String;

export function humanize(string) {
  return capitalize(underscore(string).split('_').join(' '));
}

export function eachTranslatedAttribute(object, fn) {
  var isTranslatedAttribute = /(.+)Translation$/,
      isTranslatedAttributeMatch;

  for (var key in object) {
    isTranslatedAttributeMatch = key.match(isTranslatedAttribute);
    if (isTranslatedAttributeMatch) {
      fn.call(object, isTranslatedAttributeMatch[1], Ember.I18n.t(object[key]));
    }
  }
}

export function processOptions(property, options) {
  if (options) {
    if (Ember.I18n) {
      var eachTranslatedAttributeFunction = Ember.I18n.eachTranslatedAttribute || eachTranslatedAttribute;
      eachTranslatedAttributeFunction(options.hash, function (attribute, translation) {
        options.hash[attribute] = translation;
        delete options.hash[attribute + 'Translation'];
      });
    }
    options.hash.property = property;
  } else {
    options = property;
  }

  return options;
}

function getPropertyType(model, key) {
  if (model && model.constructor.proto) {
    var proto = model.constructor.proto();
    var possibleDesc = proto[key];
    var desc = (possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc.isDescriptor) ? possibleDesc : undefined;
    if (desc && desc._meta) {
      return desc._meta.type;
    }
  }
  return null;
}

export function getTypeForValue(forcedType, property, model, value) {
  if (forcedType) {
    return forcedType;
  }

  if (!property) {
    return 'text';
  }

  if (property.match(/password/)) {
    return 'password';
  } else if (property.match(/email/)) {
    return 'email';
  } else if (property.match(/url/)) {
    return 'url';
  } else if (property.match(/color/)) {
    return 'color';
  } else if (property.match(/^tel/)) {
    return 'tel';
  } else if (property.match(/search/)) {
    return 'search';
  } else {
    if (getPropertyType(model, property) === 'number' || typeof(value) === 'number') {
      return 'number';
    } else if (getPropertyType(model, property) === 'date' || (!Ember.isNone(value) && value.constructor === Date)) {
      return 'date';
    } else if (getPropertyType(model, property) === 'boolean' || (!Ember.isNone(value) && value.constructor === Boolean)) {
      return 'checkbox';
    }
  }

  return 'text';
}