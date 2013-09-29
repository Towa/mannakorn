'use strict';

angular.module('mannakorn')
	.directive('loading', ['$rootScope', function($rootScope) {
		return {
			transclude: true,
			link: function(scope, element, attrs) {
				element.parent().click(function() {
					element.addClass('loading');
				});
				if($rootScope.loadingEventRegistered)
					return;
				
				$rootScope.$on('$routeChangeStart', function() {
					element.addClass('loading');
				});
				$rootScope.$on('$routeChangeSuccess', function() {
					element.removeClass('loading');
				});
				$rootScope.loadingEventRegistered = true;
			}
		};
	}])
	.directive('ngTap', function() {
		return function(scope, element, attrs) {
			var tapping;
			var tappingTime;
			tapping = false;
			element.bind('touchstart', function(e) {
				tapping = true;
			});
			element.bind('touchmove', function(e) {
				tapping = false;
			});
			element.bind('touchend', function(e) {
				if (tapping) {
                    tapping = false;
                    tappingTime = new Date().getTime();
					scope.$apply(attrs['ngTap'], element);
                    e.preventDefault();
				}
			});
			element.bind('click', function(e) {
                var time = new Date().getTime();
                if(!tappingTime || (tappingTime && time - tappingTime > 60)) {
					scope.$apply(attrs['ngTap'], element);
                    e.preventDefault();
                }
			})
		};
	});