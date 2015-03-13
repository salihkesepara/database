angular.module('db.resource', ['db.init'])

.factory('db', function (init) {
  var self = this;
  self.get = function (table) {
    var query = 'SELECT * FROM ' + table + '';
    return init.query(query).then(function (result) {
      return init.fetch(result);
    }, function (err) {
      console.log(err);
      return err;
    });
  }

  self.getBy = function (table, prop, value) {
    var query = 'SELECT * FROM ' + table + ' WHERE ' + prop + ' = ?',
      params = [value];
    return init.query(query, params).then(function (result) {
      return init.fetch(result);
    }, function (err) {
      console.log(err);
      return err;
    });
  }

  self.getById = function (table, id) {
    var query = 'SELECT * FROM ' + table + ' WHERE id = ?',
      params = [id];
    return init.query(query, params).then(function (result) {
      return init.fetch(result);
    }, function (err) {
      console.log(err);
      return err;
    });
  }

  self.save = function (table, fields, values) {
    var query = 'INSERT INTO ' + table + ' (' + fields.join(',') + ') values(' + init.questionmark(values.length) + ')',
      params = values;
    return init.query(query, params).then(function (result) {
      return result;
    }, function (err) {
      console.log(err);
      return err;
    });
  }

  self.remove = function (table) {
    var query = 'DELETE FROM ' + table + '';
    return init.query(query).then(function (result) {
      return result;
    }, function (err) {
      console.log(err);
      return err;
    });
  }

  self.removeBy = function (table, prop, value) {
    var query = 'DELETE FROM ' + table + ' WHERE ' + prop + ' = ?',
      params = [value];
    return init.query(query, params).then(function (result) {
      return result;
    }, function (err) {
      console.log(err);
      return err;
    });
  }

  self.removeById = function (table, value) {
    var query = 'DELETE FROM ' + table + ' WHERE id = ?',
      params = [value];
    return init.query(query, params).then(function (result) {
      return result;
    }, function (err) {
      console.log(err);
      return err;
    });
  }
  
  self.update = function (table, field, data) {
    var query = 'UPDATE ' + table + ' SET ' + init.generateUpdateQuery(field, data).join(',') + '';
    return init.query(query).then(function (result) {
      return result;
    }, function (err) {
      console.log(err);
      return err;
    });
  }
  
  self.updateBy = function (table, field, data, prop, value) {
    var query = 'UPDATE ' + table + ' SET ' + init.generateUpdateQuery(field, data) +' where ' + prop + ' = ?',
        params = [value];
    return init.query(query, params).then(function (result) {
      return result;
    }, function (err) {
      console.log(err);
      return err;
    });
  }
  
  self.updateById = function (table, field, data, id) {
    var query = 'UPDATE ' + table + ' SET ' + init.generateUpdateQuery(field, data).join(',') + ' where id = ?',
        params = [id];
    return init.query(query, params).then(function (result) {
      return result;
    }, function (err) {
      console.log(err);
      return err;
    });
  }
  
  self.UUID = function() {
    return init.UUID();
  };

  return self;
});