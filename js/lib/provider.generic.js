var __bibtex = new BibTeX();
var __query = new Query();

var GenericProvider = (function() {

	var bibtex = new BibTeX();
	var query = new Query();

	function GenericProvider() { 
    this.__bibtex = __bibtex;    
    this.__query = __query; 
	};

	GenericProvider.prototype.hostname = function() {
		return "*";
	};

	GenericProvider.prototype.getBibEntry = function(tab, callback) {
		var entry = "@online{";
		var abbr = this.__query.hostname(tab.url);
		entry += this.__bibtex.getBibTeX("id", "www:", ", \n", abbr);
		entry += this.__bibtex.getBibTeX("url", "\t", ", \n", tab.url);
		entry += this.__bibtex.getBibTeX("title", "\t", ", \n", tab.title);
		entry += this.__bibtex.getBibTeX("urldate", "\t", ", \n", bibtex.getUrlDate(localStorage["urldate-format"]));
		entry += this.__bibtex.getBibTeX("language", "\t", "\n", localStorage["language"] === undefined?chrome.i18n.getMessage("default_language"):localStorage["language"] );
		entry += "}";

		callback(entry);
	};

	return GenericProvider;

})();

