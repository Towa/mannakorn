'use strict';
function setMannakornScope($scope, bible, resource, book, chapter, verse, numberOfVerses) {

	console.timeStamp('start setMannakornScope');
	var verses = [];
	
	for (var i = 0; i < numberOfVerses; i++) {
		verses.push({
			"number": verse+i,
			"text": bible[book][chapter-1][verse+i-1]
		});
	}
	
	$scope.mannakorn = {
		book: book,
		chapter: chapter,
		verses: verses
	};
	
	var verseDescription = verses[0].number + (verses.length == 1 ? "" : " - " + verses[verses.length-1].number);
	$scope.mannakorn.description = resource[book] + " " + chapter + ", " + verseDescription;
	
	console.timeStamp('end setMannakornScope');
}

function MannakornVerseCtrl($scope, $routeParams, $location, bible, mannakornPicker, resource, $timeout) {
	var language = $routeParams.language
	var book = $routeParams.book;
	var chapter = parseInt($routeParams.chapter);
	var verse = parseInt($routeParams.verse);
	var numberOfVerses = parseInt($routeParams.length || 1);
	
	if (!book || !chapter || !verse) {
		var randomMannakorn = mannakornPicker.random();

		book = randomMannakorn.book;
		chapter = randomMannakorn.chapter;
		verse = randomMannakorn.verse;
		numberOfVerses = randomMannakorn.length;
	}
	
	$scope.resource = resource;
	
	setMannakornScope($scope, bible, resource, book, chapter, verse, numberOfVerses);
	
	$scope.language = language;
	
	$scope.changeLanguageLink = '#/' + (language == "en" ? "de" : "en") + '/mannakorn?'
		+ 'book=' + book
		+ '&chapter=' + chapter
		+ '&verse=' + verse
		+ '&length=' + numberOfVerses;
	
	$scope.changeLanguage = function() {
		$location.path('/' + $scope.language + '/mannakorn?'
				+ 'book=' + book
				+ '&chapter=' + chapter
				+ '&verse=' + verse
				+ '&length=' + numberOfVerses);
		
		$location.path('/' + $scope.language + '/mannakorn')
			.search('book', book)
			.search('chapter', chapter)
			.search('verse', verse)
			.search('length', numberOfVerses);
	}
	
	console.timeStamp('end MannakornVerseCtrl');
	
	$scope.randomVerse = function() {
		console.timeStamp('button pressed');
		var mannakorn = mannakornPicker.random();
		setMannakornScope($scope, bible, resource, 
				mannakorn.book, mannakorn.chapter, mannakorn.verse, mannakorn.length);
		$location.search("book", mannakorn.book)
			.search("chapter", mannakorn.chapter)
			.search("verse", mannakorn.verse)
			.search("length", mannakorn.length);
	}
}