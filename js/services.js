'use strict';

angular.module('mannakornServices', ['ngResource'])
	.factory('BookNames', function($resource) {
		return $resource('bible/book_names.txt', {}, {
			query: { method: 'GET', isArray: true }
		});
	})
	.factory('ResourceLoader', ['$q', '$http', '$timeout', function($q, $http, $timeout) {
		return function(language) {
			console.timeStamp('start loading resources');
			var delay = $q.defer();
			$http.get('resources/resource-'+language+'.json', { cache: true })
				.success(function(data) {
					console.timeStamp('done loading resources');
					delay.resolve(data);
				});
			return delay.promise;
		};
	}])
	.factory('BookNamesLoader', ['$q', '$http', function($q, $http) {
		return function() {
			console.timeStamp('start loading booknames');
			var delay = $q.defer();
			$http.get('bible/book_names.txt', { cache: true })
				.success(function(data) {
					console.timeStamp('done loading bookNames');
					delay.resolve(data);
				});
			return delay.promise;
		};
	}])
	.factory('MannakornPicker', ['$q', '$http', function($q, $http) {
		return function() {
			var delay = $q.defer();
			$http.get('bible/manna-verses.json', { cache: true })
				.success(function(data) {
					var picker = {
						verseList: data,
						numberOfVerses: data.length
					};
					picker.random = function() {
						var randomNumber = Math.round( Math.random() * (picker.numberOfVerses - 1) );
						var manna = picker.verseList[randomNumber];
						
						var delimiterSpace = manna.lastIndexOf(' ');
						var delimiterDot = manna.lastIndexOf('.');
						var delimiterSemicolon = manna.lastIndexOf(';');
						
						var book = manna.substring(0, delimiterSpace);//$.trim(manna.substring(0, delimiterSpace));
						var chapter = parseInt(manna.substring(delimiterSpace+1, delimiterDot));
						var verse = parseInt(manna.substring(delimiterDot+1, delimiterSemicolon != -1 ? delimiterSemicolon : manna.length));
						var length = parseInt(delimiterSemicolon != -1 ? manna.substring(delimiterSemicolon+1, manna.length) : 1);
						
						return {
							book: book,
							chapter: chapter,
							verse: verse,
							length: length
						};
					};
					delay.resolve(picker);
				});
			return delay.promise;
		};
	}])
	// FileSystemBibleLoader does not work yet
	.factory('FileSystemBibleLoader', ['$q', '$http', function($q, $http) {
		return function(language) {
			if(!window.requestFileSystem) {
				console.log('no fileSystem available');
				return;
			}
			
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
				var filename = "bible-"+language+".json";
				console.log('fs name: '+fileSystem.name+' root name: '+ fileSystem.root.name);
				
				var dirReader = fileSystem.root.createReader();
				dirReader.readEntries(function(entries) {
					for(var i=0, len=entries.length; i<len; i++) {
						console.log(entries[i].fullPath + (entries[i].isFile ? " [F]": " [D]"));
					}
				});
				
				fileSystem.root.getFile(filename, null, function(entry) {
					entry.remove();
				}, function() {
					$http.get('http://mannakorn.kkuepper.de/'+ filename)
						.success(function(data) {
							console.log('downloaded bible from internet');
							fileSystem.root.getFile(filename, { create: true, exclusive: false },
								function(entry) {
									console.log('entry created');
									entry.createWriter(function(writer) {
										writer.write(data);
										console.log('file written to filesystem');
									});
								});
						});
				});
			}, function() {
				console.log('its got no filesystem');
			});
		};
	}])
	.factory('ResourceBibleLoader', ['$q', '$http', function($q, $http) {
		return function(language) {
			console.timeStamp('start loading bible '+language)
			var bible;
				if(language == 'de')
					bible = 'german_luther_1912_utf8.json';
				else if (language == 'no')
					bible = 'norwegian_utf8.json';
				else if (language == 'nl')
					bible = 'dutch_svv_utf8.json';
				else
					bible = 'english_asv_utf8.json';
		
			var delay = $q.defer();
			
			$http.get('bible/'+bible, { cache: true })
				.success(function(data) {
					console.timeStamp('done loading bible');
					delay.resolve(data);
				});
			return delay.promise;
		};
	}]);