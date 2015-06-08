'use strict';

import _ from 'lodash';


//https://en.wikipedia.org/wiki/Finite_difference_method#Example:_The_heat_equation
class DiffusionCtrl {
  constructor($scope) {
    $scope.ctl = this;

    $scope.minT = 0;
    $scope.maxT = 50;

    $scope.minNx = 1;
    $scope.maxNx = 101;

    $scope.minNt = 1;
    $scope.maxNt = 101;

    $scope.minX = 1;
    $scope.maxX = 101;

    $scope.minK = 1;
    $scope.maxK = 1;

    $scope.u0 = '1';
    $scope.u0Error = '';

    $scope.mu1 = '1 + 5 * t';
    $scope.mu1Error = '';

    $scope.mu2 = '1 - 5 * t';
    $scope.mu2Error = '';

    $scope.funcError = '';


    $scope.buildGrid = function () {
      /**
       * Linear equation with triagonal matrix solver - http://en.wikipedia.org/wiki/Tridiagonal_matrix_algorithm
       * @param A coeffs
       * @param B free term
       * @returns Array polynomial
       */
      var thomas = function(A, B) {
        let c = _.range(B.length).map(() => 0);
        c[0] = A[0][0];
        for (let i = 1; i < B.length; ++i) {
          c[i] = A[i][i] - A[i][i - 1] * A[i - 1][i] / c[i - 1];
        }

        let f = _.range(B.length).map(() => 0);
        f[0] = B[0];
        for (let i = 1; i < B.length; ++i) {
          f[i] = B[i] - A[i][i - 1] * f[i - 1] / c[i - 1];
        }

        let r = _.range(B.length).map(() => 0);
        r[r.length - 1] = f[f.length - 1] / c[c.length - 1];
        for (let i = r.length - 2; i >= 0; --i) {
          r[i] = (f[i] - A[i][i + 1] * r[i + 1]) / c[i];
        }

        return r;
      };

      let funcs = {
        u0: $scope.u0,
        mu1: $scope.mu1,
        mu2: $scope.mu2
      },
        k = $scope.maxK/$scope.maxX,
        Nx = $scope.maxNx,
        dx = 1/Nx,
        Nt = $scope.maxNt,
        dt = 1/Nt;

      for (let funcName in funcs) {
        if (funcs.hasOwnProperty(funcName)) {
          try {
            /* jshint ignore:start */
            funcs[funcName] = new Function(funcName == 'u0' ? 'x' : 't', 'return 0 +' + funcs[funcName]);
            /* jshint ignore:end */
            $scope[funcName + 'Error'] = '';
          } catch (e) {
            $scope[funcName + 'Error'] = 'has-error';
            return;
          }
        }
      }

      if (Math.abs(funcs.u0(0) - funcs.mu1(0)) + Math.abs(funcs.u0(Nx) - funcs.mu2(0)) > 0.01) {
        $scope.funcError = 'Start points conflict, consider that u0(0) = mu1(0) = mu2(0), where (u0(x) = u(0, x), mu1(t) = u(t, 0), mu2(t) = u(1, t)';
        return;
      } else {
        $scope.funcError = '';
      }

      let grid = _.range(Nt+1).map(() => _.range(Nx+1).map(() => 0));

      for (let i = 0; i <= Nt; i++) {
        grid[i][0]  = funcs.mu1(i*dt);
        grid[i][Nx] = funcs.mu2(i*dt);
      }

      for (let i = 0; i <= Nx; i++) {
        grid[0][i] = funcs.u0(i*dx);
      }

      for (let t = 0; t < Nt; t++) {
        let A = _.range(Nx-1).map(() => _.range(Nx - 1).map(() => 0));
        let B = _.range(Nx-1).map(() => 0);

        let x = 1;

        A[x - 1][x] = dt * k;
        A[x - 1][x - 1] = -(2 * k * dt + dx * dx);

        B[x - 1] = -dx * dx * grid[t][x]  - dt * k * grid[t + 1][x - 1] - dx * dx * dt * funcs.mu1((t+1)*dt);

        x = Nx - 1;

        A[x - 1][x - 2] = dt * k;
        A[x - 1][x - 1] = -(2 * k * dt + dx * dx);

        B[x - 1] = -dx * dx * grid[t][x]  - dt * k * grid[t + 1][x + 1] - dx * dx * dt * funcs.mu2((t+1)*dt);

        for (x = 2; x <= Nx - 2; x++) {
          A[x - 1][x - 2] = dt * k;
          A[x - 1][x - 1] = -(2 * k * dt + dx * dx);
          A[x - 1][x] = dt * k;

          B[x - 1] = -dx * dx * grid[t][x] - dx * dx * dt * funcs.mu2((t+1)*dt);
        }

        let r = thomas(A, B);
        for(let i = 1; i < Nx; i++) {
          grid[t+1][i] = r[i-1];
        }
      }

      $scope.grid = grid;
    };

    $scope.refreshTime = function () {
      if ($scope.funcError !== '') {
        return;
      }

      let t = $scope.maxT,
        maxX = $scope.maxX,
        Nx = $scope.maxNx,
        dx = 1/Nx,
        grid = $scope.grid,
        points = grid[t].map((y, i) => ([i*dx*maxX, y]));
      $scope.graphData = [
        {
          key: 'heating',
          values: points
        }
      ];
    };

    $scope.buildGrid();
    $scope.refreshTime();

    $scope.$watch('[u0, mu1, mu2, maxK]', function () {
      $scope.buildGrid();
      $scope.refreshTime();
    });
    $scope.$watch('[maxT, maxK]', function () {
      $scope.refreshTime();
    });
  }
}

DiffusionCtrl.$inject = ['$scope'];

export default DiffusionCtrl;
