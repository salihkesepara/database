angular.module('db.config', [])
  .constant('database', {
    name: 'DB',
    tables: [
      {
        name: 'todos',
        columns: [
          {
            name: 'id',
            type: 'text'
          },
          {
            name: 'title',
            type: 'text'
          },
          {
            name: 'des',
            type: 'text'
          },
          {
            name: 'isComplete',
            type: 'text'
          }
        ]
      },
      {
        name: 'list',
        columns: [
          {
            name: 'id',
            type: 'text'
          },
          {
            name: 'todoId',
            type: 'text'
          },
          {
            name: 'title',
            type: 'text'
          },
          {
            name: 'isComplete',
            type: 'text'
          }
        ]
      }
    ]
  });