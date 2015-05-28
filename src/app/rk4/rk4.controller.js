'use strict';

class Rk4Ctrl {
  constructor($scope) {
    $scope.ctl = this;

    $scope.minN = 1;
    $scope.maxN = 95;

    $scope.a =  0.2;
    $scope.b =  0.005;
    $scope.c = -0.5;
    $scope.d = -0.01;

    $scope.u0 = 70;
    $scope.v0 = 40;

    $scope.h = 0.05;
    $scope.n = 2;

    //$scope.$watch('h', function () {
    //  $scope.maxN = 100 - Number($scope.h) * 100;
    //});

    $scope.$watch('[a, b, c, d, u0, v0, h, maxN]', function () {
      //$scope.h = (100 - $scope.maxN)/100;
      $scope.build();
    });

    $scope.build = function () {

      let x0 = 0, u0 = Number($scope.u0), v0 = Number($scope.v0),
        a = Number($scope.a), b = Number($scope.b), c = Number($scope.c), d = Number($scope.d),
        maxN = $scope.maxN,
        h = Number($scope.h),
        uRK = [], vRK = [], xRK = [], xE = [], uE = [], vE = [];

      let f1 = (x, u, v) => (a * u - b * v * u);
      let f2 = (x, u, v) => (c * v - d * u * v);

      let euler = function () {
        let ucur, vcur, i = 0.0;
        while (i < maxN) {
          ucur = uE[uE.length - 1] + h * f1(xE[xE.length - 1], uE[uE.length - 1], vE[vE.length - 1]);
          vcur = vE[vE.length - 1] + h * f2(xE[xE.length - 1], uE[uE.length - 1], vE[vE.length - 1]);
          xE.push(xE[xE.length - 1] + h);
          uE.push(ucur);
          vE.push(vcur);
          i = xE[xE.length - 1];
        }
      };
      let rungeKutta = function () {
        let uprev, xprev, vprev, ku1, ku2, ku3, ku4, kv1, kv2, kv3, kv4, i = 0.0;
        while (i < maxN) {
          uprev = uRK[uRK.length - 1];
          xprev = xRK[xRK.length - 1];
          vprev = vRK[vRK.length - 1];
          ku1 = h * f1(xprev, uprev, vprev);
          kv1 = h * f2(xprev, uprev, vprev);
          ku2 = h * f1(xprev + h / 2.0, uprev + ku1 / 2.0, vprev + kv1 / 2.0);
          kv2 = h * f2(xprev + h / 2.0, uprev + ku1 / 2.0, vprev + kv1 / 2.0);
          ku3 = h * f1(xprev + h / 2.0, uprev + ku2 / 2.0, vprev + kv2 / 2.0);
          kv3 = h * f2(xprev + h / 2.0, uprev + ku2 / 2.0, vprev + kv2 / 2.0);
          ku4 = h * f1(xprev + h, uprev + ku3, vprev + kv3);
          kv4 = h * f2(xprev + h, uprev + ku3, vprev + kv3);
          uRK.push(uprev + (1 / 6.0) * (ku1 + 2 * ku2 + 2 * ku3 + ku4));
          vRK.push(vprev + (1 / 6.0) * (kv1 + 2 * kv2 + 2 * kv3 + kv4));
          xRK.push(xprev + h);
          i = xRK[xRK.length - 1];
        }
      };

      xRK.push(x0);
      uRK.push(u0);
      vRK.push(v0);
      xE.push(x0);
      uE.push(u0);
      vE.push(v0);
      rungeKutta();
      euler();

      let zip = (arrays) => arrays[0].map(
        (_, i) => arrays.map(
            array => array[i])
      );

      $scope.graphData = [{
        key: 'euler victim',
        values: zip([xE, uE])
      },{
        key: 'euler predator',
        values: zip([xE, vE])
      },{
        key: 'eungeKutta victim',
        values: zip([xRK, uRK])
      },{
        key: 'eungeKutta predator',
        values: zip([xRK, vRK])
      }];

    };

    $scope.build();
  }
}

Rk4Ctrl.$inject = ['$scope'];

export default Rk4Ctrl;
