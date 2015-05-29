'use strict';

var _ = require('lodash');

/**
 * linear equation solver using gauss method
 *
 * @param matrix
 * @param freeTerm
 * @returns {Array}
 */
var gauss = function (matrix, freeTerm) {
  let n = freeTerm.length,
    resX = new Array(n);

  var swap = function (x, y) {
    let tmp = 0;
    for (let i = 0; i < n; i++) {
      tmp = matrix[x][i];
      matrix[x][i] = matrix[y][i];
      matrix[y][i] = tmp;
    }
    tmp = freeTerm[x];
    freeTerm[x] = freeTerm[y];
    freeTerm[y] = tmp;
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
    resX[i] = (freeTerm[i] - resX[i]) / matrix[i][i];
  }

  return resX;
};

/**
 * Least Squares approximation method
 *
 * @param points points of func to be approx
 * @param degree approx polynomial degree
 *
 * @returns Array coefficients of polynomial
 */
var leastSquaresPolynomial = function (points, degree) {
  let total = points.length,
    tmp = 0;

  let matrix = new Array(degree),
    freeTerm = [];
  for (let j = 1; j <= degree; j++) {
    matrix[j - 1] = [];
    for (let i = 1; i <= degree; i++) {
      tmp = 0;
      for (let l = 1; l < total; l++) {
        tmp += Math.pow(points[l][0], i + j - 2);
      }
      matrix[j - 1].push(tmp);
    }

    tmp = 0;
    for (let l = 1; l < total; l++) {
      tmp += points[l][1] * Math.pow(points[l][0], j - 1);
    }
    freeTerm.push(tmp);
  }

  return gauss(matrix, freeTerm);
};

/**
 * @see leastSquaresPolynomial
 *
 * return function that return result of polynomial in some point
 */
var leastSquaresFunc = function (points, degree) {
  return (function (coef) {
    return function (x) {
      let res = 0;
      for (let i = 0; i < degree; i++) {
        res += coef[i] * (Math.pow(x, i));
      }
      return res;
    };
  })(leastSquaresPolynomial(points, degree));
};

var remezPolynomial = function (points) {
  //todo: add point changing and iterations?
  let total = points.length,
    degree = total - 2,
    freeTerm = points.map(point => point[1]),
    matrix = points.map((point, index) =>
        _.range(degree + 2)
          .map(i =>
            (degree - i >= 0) ? Math.pow(point[0], degree - i) : Math.pow(-1, index)
        ) // x^degree, x^degree-1, ..., x^0, -1^row
    );

  return (gauss(matrix, freeTerm)).slice(0, -1);
};

var remezFunc = function (points) {
  return (function (coef) {
    return function (x) {
      let res = 0,
        total = coef.length;
      for (let i = 0; i < total; i++) {
        res += coef[i] * Math.pow(x, total - i - 1);
      }
      return res;
    };
  })(remezPolynomial(points));
};

export default {
  //gauss,
  //leastSquaresPolynomial,
  remezPolynomial,
  leastSquaresFunc,
  remezFunc
};

