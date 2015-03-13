angular.module('module.home', [])

.controller('HomeCtrl', ['$scope', '$ionicModal', 'db', function ($scope, $ionicModal, db) {
  $scope.isReorder = false;
  $scope.list = [];
  
  $scope.todo = {
    title: '',
    description: ''
  }
  
  showList();
  
  $scope.onItemDelete = function(item) {
    console.log(item.id);
    $scope.list.splice($scope.list.indexOf(item), 1);
    db.removeById('todos', item.id).then(function (result) {
      console.log(result);
      db.removeBy('list', 'todoId', item.id).then(function (result) {
        console.log(result);
      });
    });
  };

  $scope.moveItem = function (item, fromIndex, toIndex) {
    $scope.list.splice(fromIndex, 1);
    $scope.list.splice(toIndex, 0, item);
  }

  $scope.onReorder = function () {
    $scope.isReorder = !$scope.isReorder;
  }

  $scope.onDone = function () {
    var id = db.UUID();
    db.save('todos', ['id', 'title', 'des'], [id, $scope.todo.title, $scope.todo.description]).then(function (result) {
      $scope.list.push({id: id, title: $scope.todo.title, description: $scope.todo.description});
      $scope.modal.hide();
    });
  }
  
  $scope.onCancel = function () {
    $scope.modal.hide();
  }
  
  function showList() {
    db.get('todos').then(function (result) {
      console.log(JSON.stringify(result));
      $scope.list = [];
      result.forEach(function (item) {
        $scope.list.push({id: item.id, title: item.title, description: item.des});
      });
    });
  }
  
  $scope.showTodoAppModal = function () {
    $scope.modal.show();
  }
  
  $ionicModal.fromTemplateUrl('todo-add.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal
  });
  
  $scope.$on('modal.shown', function () {
    $scope.todo.title = "";
    $scope.todo.description = ""; 
    console.log('modal.shown');
  });
  
  $scope.$on('modal.hidden', function() {
    // Hided modal
  });
}])