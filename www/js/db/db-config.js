angular.module('db.config', [])
.constant('database', {
  name: 'DB',
  tables: [
    {
      name: 'todos',
      columns: [
        {name: 'id', type: 'text'},
        {name: 'title', type: 'text'},
        {name: 'des', type: 'text'},
        {name: 'isComplete', type: 'text'}
      ]
    },
    {
      name: 'list',
      columns: [
        {name: 'id', type: 'text'},
        {name: 'todoId', type: 'text'},
        {name: 'title', type: 'text'},
        {name: 'isComplete', type: 'text'}
      ]
    },
    {
      name: 'config',
      columns: [
        {name: 'id', type: 'integer primary key'},
        {name: 'key', type: 'text'},
        {name: 'value', type: 'text'}
      ]
    }
  ]
})

.constant('migration', [
  {
    migration: 1,
    name: 'DB',
    tables: [
      {
        name: 'todos',
        columns: [
          {name: 'newField11', type: 'text'},
          {name: 'newField12', type: 'text'}
        ]
      },
    ]
  },
  {
    migration: 2,
    name: 'DB',
    tables: [
      {
        name: 'list',
        columns: [
          {name: 'newsField21', type: 'text'}
        ]
      },
      {
        name: 'customer',
        columns: [
          {name: 'id', type: 'text'},
          {name: 'customerName', type: 'text'}
        ]
      }
    ]
  },
  {
    migration: 3,
    name: 'DB',
    tables: [
      {
        name: 'orders',
        columns: [
          {name: 'id', type: 'text'},
          {name: 'name', type: 'text'}
        ]
      },
      {
        name: 'list',
        columns: [
          {name: 'color', type: 'text'}
        ]
      }
    ]
  }
]);