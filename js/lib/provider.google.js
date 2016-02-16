var __bibtex = new BibTeX();
var __query = new Query();

var GoogleProvider = (function() {
	
	var callback = function(){console.error("provider callback is not defined");};

	function GoogleProvider() { 
    this.__bibtex = __bibtex;    
    this.__query = __query;     
  };                         

	GoogleProvider.prototype.hostname = function(){
		return "books.google.com";
	};
	
	GoogleProvider.prototype.getBibEntry = function(tab, cb){
		callback = cb;    
		bookId = this.__query.getVar(tab.url,'id');
		if(bookId === false){
			callback(false);
		}
		//calls Google Books JSONP
		var script = document.createElement('script');
		script.src = 'https://www.googleapis.com/books/v1/volumes/'+bookId+'?callback=bProviders[bpIndex].onInfo';
		document.body.appendChild(script);
	};
	
	GoogleProvider.prototype.onInfo = function(info){
		
		var abbr = info.id;

		//extract authors
		var authors = "";
		info.volumeInfo.authors.forEach(function(key, index) {
			authors += "{" + __bibtex.texEscape(info.volumeInfo.authors[index]) + "}";
			if (index < info.volumeInfo.authors.length - 1) {
				authors += ", ";
			}
		});

		//extract isbn
		var isbn = "";
		var _isbnLock = false;
		info.volumeInfo.industryIdentifiers.forEach(function(key, index) {
			if (_isbnLock) {
				return;
			}
			isbn = info.volumeInfo.industryIdentifiers[index].identifier;
			if (info.volumeInfo.industryIdentifiers[index].type == "ISBN 13") {
				_isbnLock = true;
			}
		});

		//create the entry
		var entry = "@book{";
		entry += this.__bibtex.getBibTeX("id", "book:", ", \n", abbr);
		entry += this.__bibtex.getBibTeX("title", "\t", ", \n", info.volumeInfo.title);
		entry += this.__bibtex.getBibTeX("author", "\t", ", \n", authors);
		entry += this.__bibtex.getBibTeX("isbn", "\t", ", \n", isbn);
		entry += this.__bibtex.getBibTeX("pagetotal", "\t", ", \n", info.volumeInfo.printedPageCount);
		entry += this.__bibtex.getBibTeX("publisher", "\t", ", \n", info.volumeInfo.publisher);
		entry += this.__bibtex.getBibTeX("year", "\t", ", \n", info.volumeInfo.publishedDate);
		if (localStorage["use_url"] === true){
			entry += this.__bibtex.getBibTeX("url", "\t", ", \n", info.volumeInfo.canonicalVolumeLink);
		}
		entry += this.__bibtex.getBibTeX("language", "\t", "\n", info.volumeInfo.language);
		entry += "}";

		callback(entry);
		
	};


	return GoogleProvider;

})();

