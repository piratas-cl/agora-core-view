/*
 * Shows the results of an election. Controls mainly the changing inner states
 * loading config, showing results, showing error if no result is found.
 */
angular.module('avElection').controller('ResultsController',
  function($state, $stateParams, $http, $scope, $i18next, ConfigService) {
    $state.go('election.results.loading');

    // get election config and check if they contain the results
    $http.get(ConfigService.baseUrl + "election/" + $stateParams.id + "/results")
      .success(function(value) {
        $scope.election = value;
        $state.go("election.results.show");
      })
      // on error, like parse error or 404
      .error(function (error) {
        $scope.errorMessage = $i18next("avElection.errorLoadingText");
        $state.go("election.results.error");
      });
  }
);