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

	/*var duoshuoModule = angular.module("duoshuo", []);

	duoshuoModule.provider("$duoshuo", function() {
		this.$get = ["$location",
			function($location) {
				function reset() {
					var el = document.createElement('div'),
						ds = document.getElementById('ds-thread');
					el.setAttribute('data-thread-key', id);
					el.setAttribute('data-url', url);
					DUOSHUO.EmbedThread(el);
					ds.appendChild(el);
				}
				return {
					reset: reset
				};
			}
		];
	});

	duoshuoModule.directive("duoshuo", ['$duoshuo',
		function($duoshuo) {
			return {
				restrict: 'AC',
				replace: false,
				scope: {
					id: '=duoshuo'
				},
				template: '<div id="ds-thread"></div>',
				link: function link(scope) {
					scope.$watch('id', function(id) {
						if (angular.isDefined(id)) {
							$duoshuo.commit(id);
						}
					});
				}
			};
		}
	]);*/
}(angular, window));