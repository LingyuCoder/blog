(function(angular, global) {
	var githubModule = angular.module("skyGit", []);

	githubModule.provider("$skyGit", function() {
		this.$get = ['$http',
			function($http) {
				function getRepos(url) {

				}
				return {
					getRepos: getRepos
				};
			}
		];
	});

	githubModule.directive("skyGit", ['$skyGit',
		function($skyGit) {
			return {
				restrict: 'AE',
				replace: false,
				scope: {
					id: '=gitUrl'
				},
				template: '<div></div>',
				link: function link(scope, element, attrs) {
					scope.$watch('gitUrl', function(url) {
						if (angular.isDefined(url)) {
							console.log(url);
						}
					});
				}
			};
		}
	]);

}(angular, window));