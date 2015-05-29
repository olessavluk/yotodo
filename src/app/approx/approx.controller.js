'use strict';

class ApproxCtrl {
  constructor($scope) {
    $scope.ctl = this;

    $scope.minX = -10;
    $scope.maxX = 10;

    $scope.minN = 1;
    $scope.maxN = 150;

    $scope.minM = 1;
    $scope.maxM = 38;

    $scope.func = 'Math.pow(x, 3) + Math.pow(x, 5) + Math.pow(x, 4)';
    $scope.funcError = '';


    $scope.$watch('[minX, maxX, maxN, maxM, func]', function () {
      $scope.build();
    });
    //todo: try realize Remez algorithm https://ru.wikipedia.org/wiki/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC_%D0%A0%D0%B5%D0%BC%D0%B5%D0%B7%D0%B0
    //todo: or other
    $scope.build = function () {
      let f = (x) => (x),
        fromX = $scope.minX,
        toX = $scope.maxX,
        total = $scope.maxN,
        step = (toX - fromX) / total,
        m = $scope.maxM;

      try {
        /* jshint ignore:start */
        f = new Function('x', 'return 0 +' + $scope.func);
        /* jshint ignore:end */

        $scope.funcError = '';
      } catch (e) {
        $scope.funcError = 'has-error';
        return;
      }

      //func
      let func = new Array(total);
      for (let i = 0; i < total; i++) {
        let x = fromX + step * i;
        func[i] = [x, f(x)];
      }

      let matrix = new Array(m),
        freeTerm = [];
      for (let j = 1; j <= m; j++) {
        matrix[j - 1] = [];
        for (let i = 1; i <= m; i++) {
          let coef = 0;
          for (let l = 1; l < total; l++) {
            coef += Math.pow(func[l][0], i + j - 2);
          }
          matrix[j - 1].push(coef);
        }

        let coef = 0;
        for (let l = 1; l < total; l++) {
          coef += func[l][1] * Math.pow(func[l][0], j - 1);
        }
        freeTerm.push(coef);
      }

      var gauss = function (matrix, freeTerm) {
        let n = freeTerm.length,
          resX = new Array(n);

        var swap = function (x, y) {
          let tmp = 0;
          for(let i=0; i<n; i++) {
            tmp = matrix[x][i];
            matrix[x][i] = matrix[y][i];
            matrix[y][i] = tmp;
          }
        };

        // Straight course
        for (let i = 0; i < n - 1; i++) {
          if (matrix[i][i] === 0) {
            for (let j = i + 1; j < n && matrix[i][i] === 0; j++) {
              if (matrix[j][i] !== 0) {
                swap(i, j);
              }
            }
          }
          for (let j = i + 1; j < n; j++) {
            let coef = matrix[j][i] / matrix[i][i];
            for (let k = i; k < n; k++) {
              matrix[j][k] -= matrix[i][k] * coef;
            }
            freeTerm[j] -= freeTerm[i] * coef;
          }
        }

        // Reverse course
        resX[n - 1] = freeTerm[n - 1] / matrix[n - 1][n - 1];
        for (let i = n - 2; i >= 0; i--) {
          resX[i] = 0.0;
          for (let j = i + 1; j < n; j++) {
            resX[i] += matrix[i][j] * resX[j];
          }
          resX[i] = (freeTerm[i] - resX[i])  / matrix[i][i];
        }

        return resX;
      };

      let coef = gauss(matrix, freeTerm);

      let g = (function (coef) {
        return function (x) {
          let res = 0;
          for (let i = 0; i < m; i++) {
            res += coef[i] * (Math.pow(x, i));
          }
          return res;
        };
      })(coef);

      let data =  func.map((f) => ([f[0], g(f[0])]));
      //console.log(data);

      $scope.graphData = [{
        key: 'func',
        values: func
      },{
        key: 'aprox',
        values: data
      }];

    };

    $scope.build();
  }
}

ApproxCtrl.$inject = ['$scope'];

export default ApproxCtrl;
