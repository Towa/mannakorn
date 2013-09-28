'use strict';

angular.module('mannakornFilters', [])
	.filter('verseDescription', function() {
		return function(verses) {
			if(!verses || verses.length < 1)
				return '';
			return verses[0].number + (verses.length == 1 ? "" : " - " + verses[verses.length-1].number);
		};
	});