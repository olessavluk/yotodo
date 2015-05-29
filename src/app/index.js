'use strict';

import MainCtrl from './main/main.controller';
import IntegrationCtrl from './integration/integration.controller';
import ApproxCtrl from './approx/approx.controller';
import Rk4Ctrl from './rk4/rk4.controller.js';
import NavbarCtrl from '../app/components/navbar/navbar.controller';

angular.module('yotodo', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap', 'nvd3ChartDirectives', 'ui-rangeSlider'])
  .controller('NavbarCtrl', NavbarCtrl)
  .controller('MainCtrl', MainCtrl)
  .controller('IntegrationCtrl', IntegrationCtrl)
  .controller('ApproxCtrl', ApproxCtrl)
  .controller('Rk4Ctrl', Rk4Ctrl)

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('integration', {
        url: '/integration',
        templateUrl: 'app/integration/integration.html',
        controller: 'IntegrationCtrl'
      })
      .state('approx', {
        url: '/approx',
        templateUrl: 'app/approx/approx.html',
        controller: 'ApproxCtrl'
      })
      .state('rk4', {
        url: '/rk4',
        templateUrl: 'app/rk4/rk4.html',
        controller: 'Rk4Ctrl'
      });

    $urlRouterProvider.otherwise('/');
  })
;
