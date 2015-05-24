'use strict';

class NavbarCtrl {
  constructor ($scope) {

    $scope.collapse = 'collapse';

    $scope.toggleCollapse = function () {
      $scope.collapse =  ($scope.collapse === 'collapse') ? '' : 'collapse';
    };

    $scope.date = new Date();
  }
}

NavbarCtrl.$inject = ['$scope'];

export default NavbarCtrl;
