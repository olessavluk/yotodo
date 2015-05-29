'use strict';

class IntegrationCtrl {
  constructor($scope) {
    $scope.ctl = this;

    $scope.minX = -10;
    $scope.maxX = 10;

    $scope.minN = 1;
    $scope.maxN = 150;

    $scope.func = 'Math.sin(x) * x';
    $scope.funcError = '';


    $scope.$watch('[minX, maxX, maxN, func]', function () {
      $scope.integrate();
    });

    $scope.integrate = function () {
      var funcPack = {
        func: function (func, a) {
          return func(a);
        },
        rectangle: function (func, a, b) {
          var w = b - a;
          return w * func(a + w / 2);
        },
        //leftRectangle : function (func, a, b) {
        //  var w = b - a;
        //  return w * func(a);
        //},
        //rightRectangle : function (func, a, b) {
        //  var w = b - a;
        //  return w * func(b);
        //},
        trapeze: function (func, a, b) {
          var w = b - a;
          return w * (func(a) + func(b)) / 2;
        },
        simpson: function (func, a, b) {
          var w = (b - a) / 2;
          return w / 3 * (func(a) + 4 * func(a + w) + func(a + 2 * w));
        },
        simpson3by8: function (func, a, b) {
          let h = (b - a) / 3;
          return 3 * h / 8 * (f(a) + 3 * f(a + h) + 3 * f(a + 2 * h) + f(a + 3 * h));
        },
        bool: function (func, a, b) {
          let h = (b - a) / 4;
          return 2 * h / 45 * (7 * f(a) + 32 * f(a + h) + 12 * f(a + 2 * h) + 32 * f(a + 3 * h) + 7 * f(a + 4 * h));
        },
        gauss: function (func, a, b) {
          let h = (b - a) / 2;
          return h * (f((a + b) / 2 - (b - a) / (2 * Math.sqrt(3))) + f((a + b) / 2 + (b - a) / (2 * Math.sqrt(3))));
        }
      };

      var f = (x) => (x),
        fromX = $scope.minX,
        toX = $scope.maxX,
        total = $scope.maxN,
        step = (toX - fromX) / total;

      let graphData = [];
      try {
        /* jshint ignore:start */
        f = new Function('x', 'return 0 +' + $scope.func);
        /* jshint ignore:end */
        //let tmp;
        //
        //for(let i = 0; i < total; i++) {
        //  tmp = f(fromX + i*step);
        //  if (Number.isNaN(tmp) || !Number.isFinite(tmp)) {
        //    throw new Error('function isn\'t finite in all range');
        //  }
        //}
        $scope.funcError = '';
      } catch (e) {
        $scope.funcError = 'has-error';
        return;
      }


      for (let funcName in funcPack) {
        if (funcPack.hasOwnProperty(funcName)) {
          let func = funcPack[funcName],
            left = [], right = [];

          //left part
          if (fromX < 0) {
            let n = -fromX / step,
              sum = 0,
              inc = 0,
              x0, x1;
            for (let i = 0; i < n; i++) {
              x0 = -step * i;
              x1 = -step * (i + 1);
              inc = funcName === 'func' ? 0 : sum;
              sum = func(f, x0, x1) + inc;

              if (x1 < toX) {
                left.unshift([x0, sum]);
              }
            }
          }

          if (toX > 0) {
            let n = toX / step,
              sum = 0, inc = 0,
              x0, x1;

            for (let i = 0; i < n; i++) {
              x0 = step * i;
              x1 = step * (i + 1);
              inc = funcName === 'func' ? 0 : sum;
              sum = func(f, x0, x1) + inc;

              if (x1 > fromX) {
                right.push([x0, sum]);
              }
            }
          }

          graphData.push({
            key: funcName,
            values: left.concat(right)
          });
        }
      }
      $scope.graphData = graphData;

    };

    $scope.integrate();
  }
}

IntegrationCtrl.$inject = ['$scope'];

export default IntegrationCtrl;
