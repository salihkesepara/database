angular.module('starter', ['ionic', 'module.home', 'module.about', 'module.todo', 'module.todoAdd', 'db.init', 'db.resource'])

.run(function ($ionicPlatform,init) {
  $ionicPlatform.ready(function () {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    init.db();
  });
})

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "views/tabs.html"
    })

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.about', {
    url: '/about',
    views: {
      'tab-about': {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      }
    }
  })

  .state('tab.todo', {
    url: '/home/:todoId/:todoTitle',
    views: {
      'tab-home': {
        templateUrl: 'views/todo.html',
        controller: 'TodoCtrl'
      }
    }
  })

  $urlRouterProvider.otherwise('/tab/home');
})