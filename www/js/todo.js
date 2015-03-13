angular.module('module.todo', [])

.controller('TodoCtrl', ['$scope', '$ionicModal', 'db', '$stateParams', function ($scope, $ionicModal, db, $stateParams) {
  $scope.todoList = [];
  
  $scope.list = {
    todo: ''
  };
  
  $scope.viewTitle = $stateParams.todoTitle;
  
  
  
  
  
  showList();
  
  $scope.onDone = function () {
    var id = db.UUID();
    db.save('list', ['id', 'todoId', 'title', 'isComplete'], [id, $stateParams.todoId, $scope.list.todo, 'false']).then(function (result) {
      $scope.todoList.push({id: id, title: $scope.list.todo, isComplete: false});
      $scope.modal.hide();
    });
  };
  
  $scope.onCancel = function () {
    $scope.modal.hide();
  }
  
  $scope.checked = function (id, checked) {
    console.log("id: " + id + " checked: " + checked);
    
    db.updateById('list', 'isComplete', checked, id).then(function (result) {
      console.log(result);
    }, function (err) {
      console.log(err);
    });
  }
  
  function showList () {
    db.getBy('list', 'todoId', $stateParams.todoId).then(function (result) {
      console.log(JSON.stringify(result));
      $scope.todoList = [];
      result.forEach(function (item) {
        $scope.todoList.push({id: item.id, title: item.title, isComplete: item.isComplete == 'true' ? true : false});
      });
    });
  }
  
  
  
  
  
  $ionicModal.fromTemplateUrl('list-add.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  
  $scope.showListAppModal = function () {
    $scope.modal.show();
  }
  
  $scope.$on('modal.shown', function () {
    $scope.list.todo = '';
    console.log('modal.shown');
  });
  
  $scope.$on('modal.hidden', function() {
    // Hided
  });
  
}])