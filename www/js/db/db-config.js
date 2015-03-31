angular.module('db.config', [])
.constant('database', {
  name: 'DB',
  tables: [
    {
      // This config table is necessary!
      name: 'config',
      columns: [
        {name: 'id', type: 'integer primary key'},
        {name: 'key', type: 'text'},
        {name: 'value', type: 'text'}
      ]
    },
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
      name: 'test',
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
          {name: 'migrate1', type: 'text'}
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
          {name: 'migrate21', type: 'text'}
        ]
      },
      {
        name: 'customer',
        columns: [
          {name: 'migrate22', type: 'text'},
          {name: 'migrate23', type: 'text'}
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
          {name: 'migrate31', type: 'text'},
          {name: 'migrate32', type: 'text'}
        ]
      },
      {
        name: 'list',
        columns: [
          {name: 'migrate33', type: 'text'}
        ]
      }
    ]
  },
  {
    migration: 4,
    name: 'DB',
    tables: [
      {
        name: 'list',
        columns: [
          {name: 'isOk', type: 'text'},
          {name: 'isExist', type: 'text'}
        ]
      },
      {
        name: 'Personel',
        columns: [
          {name: 'name', type: 'text'},
          {name: 'surName', type: 'text'}
        ]
      }
    ]
  },
  {
    migration: 5,
    name: 'DB',
    tables: [
      {
        name: 'list',
        columns: [
          {name: 'cool', type: 'text'},
          {name: 'rowNumber', type: 'text'}
        ]
      }
    ]
  }
]);