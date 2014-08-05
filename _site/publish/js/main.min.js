var duoshuoQuery = {
	short_name: "skyinlayer"
};
var BlogModule = angular.module("Blog", ['ngRoute', 'ngSanitize']);

BlogModule.directive("blogLoading", ['$rootScope',
	function($rootScope) {
		return {
			link: function(scope, element, attrs) {
				element.addClass("u-loading-hide");
				$rootScope.$on('$routeChangeStart', function() {
					element.removeClass("u-loading-hide");
				});
				$rootScope.$on('$routeChangeSuccess', function() {
					element.addClass("u-loading-hide");
				});
			}
		};
	}
]);

BlogModule.config(function($routeProvider) {
	$routeProvider.when("/home", {
		controller: "HomeController",
		templateUrl: "home.html"
	}).when('/cat/:category', {
		controller: "CategoryController",
		templateUrl: "category.html"
	}).when('/tag/:tag', {
		controller: "TagController",
		templateUrl: "tag.html"
	}).when('/art/blog/:year/:month/:day/:title', {
		controller: "ArtController",
		templateUrl: function(params) {
			return "blog/" + params.year + "/" + params.month + "/" + params.day + "/" + params.title + "/index.html";
		}
	}).when('/item', {
		templateUrl: "item.html"
	}).otherwise({
		redirectTo: '/home'
	});
});

BlogModule.filter('offset', function() {
	return function(input, start, limit) {
		return input.slice(start, start + limit);
	};
});

BlogModule.filter('hasCategory', function() {
	return function(input, category) {
		var result = [];
		var i, len;
		var cur;
		for (i = 0, len = input.length; i < len; i++) {
			cur = input[i];
			if (cur.categories.indexOf(category) !== -1) {
				result.push(cur);
			}
		}
		return result;
	};
});

BlogModule.filter('hasTag', function() {
	return function(input, tag) {
		var result = [];
		var i, len;
		var cur;
		for (i = 0, len = input.length; i < len; i++) {
			cur = input[i];
			if (cur.tags.indexOf(tag) !== -1) {
				result.push(cur);
			}
		}
		return result;
	};
});

BlogModule.filter('hasKeyword', function() {
	return function(input, keyword) {
		if (!keyword) {
			return input;
		}
		var result = [];
		var i, len;
		var archieve;
		for (i = 0, len = input.length; i < len; i++) {
			archieve = input[i];
			if (archieve.title.search(new RegExp(keyword, "i")) !== -1) {
				result.push(archieve);
			} else if (archieve.tags.indexOf(keyword) !== -1) {
				result.push(archieve);
			} else if (archieve.categories.indexOf(keyword) !== -1) {
				result.push(archieve);
			}
		}
		return result;
	};
});

BlogModule.controller("BlogController", function($scope, $http, $filter, $location, $sce, $q) {
	$scope.archieves = [];
	$scope.loaded = false;
	var deferred = $q.defer();
	var fetchArchieves = function() {
		var deferred = $q.defer();
		$http.get("archieves.json").success(function(data) {
			$scope.loaded = true;
			$scope.archieves = data;
			deferred.resolve(data);
		}).error(function() {
			deferred.reject("获取文章列表失败");
		});
		return deferred.promise;
	};
	var fetchDsInfo = function(archieves) {
		var deferred = $q.defer();
		var artIds = [];
		var i, len, tmp;
		for (i = 0, len = archieves.length; i < len; i++) {
			artIds.push(archieves[i].id);
		}
		$http.jsonp('http://api.duoshuo.com/threads/counts.jsonp', {
			params: {
				threads: artIds.join(','),
				short_name: 'skyinlayer',
				callback: 'JSON_CALLBACK'
			}
		}).success(function(data) {
			deferred.resolve({
				archieves: archieves,
				dsInfos: data.response
			});
		}).error(function() {
			deferred.reject("从多说获取评论失败");
		});
		return deferred.promise;
	};
	var bindDsInfo = function(data) {
		var archieves = data.archieves;
		var dsInfos = data.dsInfos;
		var id, artInfo, archieve, i, len;
		for (i = 0, len = archieves.length; i < len; i++) {
			archieve = archieves[i];
			artInfo = dsInfos[archieve.id];
			archieve.comment = artInfo.comments;
			archieve.like = artInfo.likes;
			archieve.weibo = artInfo.weibo_reposts;
			archieve.desc = $sce.trustAsHtml(archieve.desc);
		}
		$scope.archieves = archieves;
	};
	deferred.promise.then(fetchArchieves).then(fetchDsInfo).then(bindDsInfo, function(errorReason) {
		console.log(errorReason);
	});
	deferred.resolve();

	$http.get("categories.json").success(function(data) {
		$scope.categories = data;
	});
	$http.get("tags.json").success(function(data) {
		$scope.tags = data;
	});

	$scope.curPage = 0;
	$scope.perPage = 5;
	$scope.filteredArray = [];
	$scope.curUrl = "";
	$scope.searching = false;
	$scope.searchStr = "";
	$scope.toggleSearch = function() {
		$scope.searching = !$scope.searching;
	};
	$scope.$watch("searchStr", function(newValue, oldValue) {
		$scope.curPage = 0;
	});

	$scope.nextPage = function() {
		$scope.curPage++;
	};
	$scope.prePage = function() {
		$scope.curPage--;
	};
	$scope.resetPage = function() {
		$scope.curPage = 0;
	};
	$scope.toHome = function() {
		$location.path('#/home');
	};

	$scope.highlightAndDuoshuo = function() {
		$('pre code').each(function(i, e) {
			hljs.highlightBlock(e);
		});
		var el = $(".ds-thread");
		DUOSHUO.EmbedThread(el);

	};

	$scope.$watch(function() {
		return $location.path();
	}, function(value) {
		$scope.curUrl = value;
		$scope.searchStr = "";
		$scope.curPage = 0;
		window.scrollTo(0, 0);
	});

});

BlogModule.controller("HomeController", function($scope) {

});

BlogModule.controller("CategoryController", function($scope, $routeParams) {
	$scope.category = $routeParams.category;
});
BlogModule.controller("TagController", function($scope, $routeParams) {
	$scope.tag = $routeParams.tag;
});
BlogModule.controller("ArtController", function($scope, $routeParams) {});