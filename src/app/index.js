'use strict';

import MainCtrl from './main/main.controller';
import GrapthCtrl from './graph/graph.controller.js';
import NavbarCtrl from '../app/components/navbar/navbar.controller';

angular.module('yotodo', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap'])
  .controller('NavbarCtrl', NavbarCtrl)
  .controller('MainCtrl', MainCtrl)
  .controller('GraphCtrl', GrapthCtrl)

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('graph', {
        url: '/graph',
        templateUrl: 'app/graph/graph.html',
        controller: 'GraphCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
;
