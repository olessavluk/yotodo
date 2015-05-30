'use strict';

import lib from './approx.lib.js';
import _ from 'lodash';


class ApproxCtrl {
  constructor($scope) {
    $scope.ctl = this;

    $scope.minX = -10;
    $scope.maxX = 10;

    $scope.minN = 1;
    $scope.maxN = 150;

    $scope.minM = 1;
    $scope.maxM = 3;

    $scope.func = 'Math.pow(x, 3) + Math.pow(x, 5) + Math.pow(x, 4)';
    $scope.funcError = '';


    $scope.$watch('[minX, maxX, maxN, maxM, func]', function () {
      $scope.build();
    });
    $scope.build = function () {
      let f = (x) => (x),
        fromX = $scope.minX,
        toX = $scope.maxX,
        total = $scope.maxN,
        step = (toX - fromX) / total,
        degree = $scope.maxM;

      try {
        /* jshint ignore:start */
        f = new Function('x', 'return 0 +' + $scope.func);
        /* jshint ignore:end */
        $scope.funcError = '';
      } catch (e) {
        $scope.funcError = 'has-error';
        return;
      }

      //sqr
      let xes = _.range(fromX, toX, step),
        funcPoints = xes.map(x => [x, f(x)]),
        sqr = lib.leastSquaresFunc(funcPoints, degree+1),
        sqrPoints = xes.map(x => [x, sqr(x)]);

      //remez
      let rStep = (toX - fromX) / (degree+1),
        remezPoints = _.range(degree+2).map(i => fromX + rStep*i).map(x => [x, f(x)]),
        remez = lib.remezFunc(remezPoints),
        rp = xes.map(x => [x, remez(x)]);

      $scope.graphData = [{
        key: 'func',
        values: funcPoints
      },{
        key: 'sqr',
        values: sqrPoints
      },{
        key: 'remez',
        values: rp
      },{
        key: 'remezPoints',
        values: remezPoints
      }];
    };

    $scope.build();
  }
}

ApproxCtrl.$inject = ['$scope'];

export default ApproxCtrl;
