angular.module('db.init', ['db.config'])

.factory('init', function ($q, database, migration) {
  var self = this;
  self.db = null;

  self.openDB = function () {
    if (window.sqlitePlugin) {
      self.db = window.sqlitePlugin.openDatabase({
        name: database.name
      });
    } else {
      self.db = openDatabase(database.name, '1.0', 'websql deneme', 2 * 1024 * 1024);
    }
  }

  self.db = function () {
    var deferred = $q.defer();
    
    self.openDB();
    createTables().then(function (result) {
      console.log(result);
      self.migration().then(function (result) {
        deferred.resolve(result);
      }, function (err) {
        deferred.reject(err);
      });
    }, function (err) {
      deferred.reject(err);
    });
    
    return deferred.promise;
  }

  function createTables() {
    var deferred = $q.defer();

    table = database.tables[0];
    var columns = [];

    table.columns.forEach(function (column) {
      columns.push(column.name + ' ' + column.type);
    });

    var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
    self.query(query).then(function (result) {
      database.tables.splice(0, 1);

      if (database.tables.length != 0) {
        deferred.resolve(createTables());
      } else {
        deferred.resolve("Tables Complate!");
      }

    }, function (err) {
      console.log(err);
      deferred.reject(err);
    });

    return deferred.promise;
  }

  self.migration = function () {
    var deferred = $q.defer();
    
    var query = 'SELECT * FROM config';
    self.query(query).then(function (result) {
      var result = self.fetch(result);
      if (result.length == 0) {
        // DB First Run
        query = 'INSERT INTO config (key, value) VALUES ("DB Version", "0")';
        self.query(query).then(function (result) {
          checkMigration(0).then(function (result) {
            deferred.resolve(result);
          }, function (err) {
            deferred.reject(err);
          });
        }, function (err) {
          deferred.reject(err);
        });
      } else {
        checkMigration(result[0].value).then(function (result) {
          deferred.resolve(result);
        }, function (err) {
          deferred.reject(err);
        });
      }
    }, function (err) {
      deferred.reject(err);
    });
    
    return deferred.promise;
  }

  checkMigration = function (dbVersion) {
    var deferred = $q.defer();
    
    if (migration.length == 0) deferred.resolve("Migration not exists!");
    var dbMigration = migration.length;
    if (dbVersion != dbMigration) {
      console.log("dbVersion: ", dbVersion);
      console.log("dbMigration: ", dbMigration);
      runMigration(dbVersion, dbMigration).then(function (result) {
        deferred.resolve(result);
      }, function (err) {
        deferred.reject(err);
      });
    } else {
      deferred.resolve("Migration already OK!");
    }
    
    return deferred.promise;
  }

  runMigration = function (dbVersion, dbMigration) {
    var deferred = $q.defer();

    if (migration.length != 0) {
      db = migration[0];
      if (db.migration > dbVersion) {
        console.log("------------");
        tableForEach().then(function (result) {
          console.log("db.migration:", migration[0].migration);
          console.log("------------");
          query = 'UPDATE config SET value=' + db.migration + '';
          self.query(query).then(function (result) {
            migration.splice(0, 1);
            deferred.resolve(runMigration(dbVersion, dbMigration));
          }, function (err) {
            console.log(err);
            deferred.reject(err);
          });
        }, function (err) {
          deferred.reject(err);
        });
      } else {
        migration.splice(0, 1);
        deferred.resolve(runMigration(dbVersion, dbMigration));
      }
    } else {
      deferred.resolve("Migrations Complete!");
    }

    return deferred.promise;
  }

  tableForEach = function() {
    var deferred = $q.defer();

    if (migration[0].tables.length != 0) {
      var table = migration[0].tables[0];
      console.log("table.name:", table.name);

      var columns = [];
      table.columns.forEach(function (column) {
        columns.push(column.name + ' ' + column.type);
      });

      var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
      self.query(query).then(function (result) {
        columnForEach().then(function (result) {
          migration[0].tables.splice(0, 1);
          deferred.resolve(tableForEach());
        }, function (err) {
          deferred.reject(err);
        })
      }, function (err) {
        console.log(err);
        deferred.reject(err);
      });
    } else {
      console.log("Table OK");
      deferred.resolve("Table OK");
    }

    return deferred.promise;
  }

  columnForEach = function() {
    var deferred = $q.defer();

    if (migration[0].tables[0].columns.length != 0) {
      var table = migration[0].tables[0];
      var column = migration[0].tables[0].columns[0];
      query = 'ALTER TABLE ' + table.name + ' ADD COLUMN ' + column.name + ' ' + column.type + '';
      self.query(query).then(function (result) {
        console.log("column.name: " + column.name + " added!");
        migration[0].tables[0].columns.splice(0, 1);
        deferred.resolve(columnForEach());
      }, function (err) {
        if (err.code !== 5) {
          console.log(err);
          deferred.reject(err);
        } else {
          console.log("column.name: " + column.name + " already added!");
          migration[0].tables[0].columns.splice(0, 1);
          deferred.resolve(columnForEach());
        }
      });
    } else {
      console.log("Column OK");
      deferred.resolve("Column OK");
    }

    return deferred.promise;
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
      for (var i = 0; i < field.length; i++) {
        updateQuery.push("" + field[i] + "='" + data[i] + "'");
      }
    } else {
      updateQuery.push('' + field + '="' + data + '"');
    }
    return updateQuery;
  }

  self.UUID = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  };

  return self;
})