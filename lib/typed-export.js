var path = require('path');
var string = require('underscore.string');

// TODO(Tony) bring this into prototype
function TypedExport(options) {
  this.type = 'unknown';
  this.outputDirectory = options.outputDirectory;
}

TypedExport.prototype = Object.create(null);

TypedExport.prototype.knownTypes = ['model', 'serializer', 'controller', 'view', 'mixin'];

TypedExport.prototype.pluralizeType = function(type) {
  return type + 's';
}

TypedExport.prototype.determineType = function(filePath, className) {
  // First check to see if any class matches
  var type = 'unkown';
  this.knownTypes.forEach(function(testType) {
    var r = new RegExp(string.titleize(testType));
    if (r.test(className)) {
      type = testType;
    }
  }, this);

  // Check to see if filename provides type, if we did not find it from classname
  if (type === 'unkown') {
    this.knownTypes.forEach(function(testType) {
      var r = new RegExp(this.pluralizeType(testType));
      if (r.test(filePath)) {
        type = testType;
      }
    }, this);
  }
  return type
}

// TODO(Tony) handle path and name
TypedExport.prototype.filePathForType = function(type, appName, filePath) {
  var fileName = path.basename(filePath);
  var foundTypes = this.knownTypes.filter(function(knownType) {
    return knownType === type
  });
  if (foundTypes.length > 0) {
    return '/' +  appName + '/' + this.pluralizeType(type) + '/' + fileName;
  } else {
    return '/' +  appName + '/' + filePath;
  }
}

TypedExport.prototype.outputFolderPathForType = function(type){
  return path.join(this.outputDirectory, 'app/' + this.pluralizeType(type));
};

TypedExport.prototype.outputFilePath = function(fileName, type) {
  var folderPath = this.outputFolderPathForType(type);
  return path.join(folderPath, string.dasherize(fileName));
};

TypedExport.prototype.convertToOutputFilename = function(stringInput) {
    var filename = [];
    var chars = string.chars(stringInput);
    function isUpperCase(str) { return (str === str.toUpperCase() && !isLowerCase(str)); }
    function isLowerCase(str) { return (str === str.toLowerCase()); }
    chars.forEach(function(c, i) {
      if (i>0 && isLowerCase(chars[i-1]) && isUpperCase(c)) {
        filename.push('-');
      }
      filename.push(c);
    });
    return filename.join('').toLowerCase();
}

TypedExport.prototype.filePathForClassname = function(className, type, filePath) {
  if (type === 'unknown') {
    return filePath;
  }

  var filename = this.convertToOutputFilename(className);

  var fileParts = filename.split('-');
  var shouldPop = false;
  this.knownTypes.forEach(function(testType) {
    var r = new RegExp(testType);
    // If we are a known type and the type is on the last part of the filename remove it
    if (type === testType && r.test(fileParts[fileParts.length-1])) {
      shouldPop = true;
    }
  });
  if (shouldPop) {
    fileParts.pop();
  }
  filename = fileParts.join('-');
  return this.pluralizeType(type) + "/" + filename + ".js";
}

module.exports = TypedExport;