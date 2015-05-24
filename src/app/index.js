'use strict';

import MainCtrl from './main/main.controller';
import GrapthCtrl from './graph/graph.controller.js';
import SqrCtrl from './sqr/sqr.controller.js';
import NavbarCtrl from '../app/components/navbar/navbar.controller';

angular.module('yotodo', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap', 'nvd3ChartDirectives', 'ui-rangeSlider'])
  .controller('NavbarCtrl', NavbarCtrl)
  .controller('MainCtrl', MainCtrl)
  .controller('GraphCtrl', GrapthCtrl)
  .controller('SqrCtrl', SqrCtrl)

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
      })
      .state('sqr', {
        url: '/sqr',
        templateUrl: 'app/sqr/sqr.html',
        controller: 'SqrCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
;
