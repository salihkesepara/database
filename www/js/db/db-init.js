angular.module('db.init', ['db.config'])

.factory('init', function ($q, database) {
  var self = this;
  self.db = null;

  self.openDB = function () {
    if (window.sqlitePlugin) {
      self.db = window.sqlitePlugin.openDatabase({name: database.name});
    } else {
      self.db = openDatabase(database.name, '1.0', 'websql deneme', 2 * 1024 * 1024);
    }
  }

  self.db = function () {
    self.openDB();
    database.tables.forEach(function (table) {
      var columns = [];

      table.columns.forEach(function (column) {
        columns.push(column.name + ' ' + column.type);
      });

      var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
      self.query(query).then(function (result) {
        console.log(result);
      }, function (err) {
        console.log(err);
      });
    });
  }

  self.query = function (query, params) {
    params = typeof params !== 'undefined' ? params : [];
    var deferred = $q.defer();
    self.db.transaction(function (tx) {
      tx.executeSql(query, params, function (tx, result) {
        deferred.resolve(result);
      }, function (tx, err) {
        deferred.reject(err);
      });
    });

    return deferred.promise;
  }

  self.fetch = function (result) {
    var output = [];
    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));
    }
    return output;
  };
  
  self.questionmark = function (l) {
    var marks = [];
    for (var i = 0; i < l; i++)
      marks.push("?");
    return marks.join(",");
  }
  
  self.generateUpdateQuery = function (field, data) {
    var updateQuery = [];
    if (angular.isArray(field)) {
      for (var i = 0 ; i < field.length ; i++) {
        updateQuery.push("" + field[i] + "='" + data[i] + "'");
      }
    } else {
      updateQuery.push('' + field + '="' + data + '"');
    }
    return updateQuery;
  }
  
  self.UUID = function (){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  };

  return self;
})