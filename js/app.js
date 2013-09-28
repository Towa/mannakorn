'use strict';

// ToDo:
// - dutch and norwegian bible translation
//   - select instead of switch
//   - nice select

angular.module('mannakorn', ['mannakornFilters', 'mannakornServices', 'ngMobile'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/:language/mannakorn',
				{ templateUrl: 'partials/mannakorn-verse.html', 
				  controller: MannakornVerseCtrl,
				  resolve: {
					  bible: function(ResourceBibleLoader, $route) {
						  // instead of using the FileSystemBibleLoader the bibles are delivered with the app
						  var language = $route.current.params.language;
						  return ResourceBibleLoader(language);
					  },
					  bookNames: function(BookNamesLoader) {
						  return BookNamesLoader();
					  },
					  resource: function(ResourceLoader, $route, $timeout) {
						  return ResourceLoader($route.current.params.language);
					  },
					  mannakornPicker: function(MannakornPicker) {
						  return MannakornPicker();
					  }
				  } })
			.otherwise({ redirectTo: '/de/mannakorn' });
	}]);
	
// Empty verses: Psalms 19, 15