var __bibtex = new BibTeX();
var __query = new Query();

var WikipediaProvider = (function() {

	var bibtex = new BibTeX();
	var query = new Query();
	
	var callback = function(){console.error("provider callback is not defined");};
	var title = undefined;
	var url = undefined;

	function WikipediaProvider() { 
    this.__bibtex = __bibtex;    
    this.__query = __query; 
	};
	

	WikipediaProvider.prototype.hostname = function() {
		return "wikipedia.org";
	};
		
	WikipediaProvider.prototype.onInfo = function(xhr, obj){
		var pages = obj.query.pages;
		var ids = [];
		for(var pageId in pages) ids.push(pageId);
		if(ids.length<=0) return;
		var entry = "@misc{";
		entry += this.__bibtex.getBibTeX("id", "wiki:", ", \n", ids[0]);
		entry += this.__bibtex.getBibTeX("url", "\t", ", \n", url);
		entry += this.__bibtex.getBibTeX("title", "\t", ", \n", title);
		entry += this.__bibtex.getBibTeX("urldate", "\t", ", \n", bibtex.getUrlDate(localStorage["urldate-format"]));
		entry += this.__bibtex.getBibTeX("language", "\t", "\n", localStorage["language"] === undefined?chrome.i18n.getMessage("default_language"):localStorage["language"] );
		entry += "}";
		callback(entry);
	};
	
	WikipediaProvider.prototype.getBibEntry = function(tab, cb) {
		callback = cb;
		title = tab.title;
		url = tab.url;
		
		var hostname = this.__query.hostname(tab.url);
		var data = {
			format: 'json',
			action: 'query',
			prop: 'revisions',
			titles: decodeURIComponent(tab.url.split('/').pop())
		};
		
		var opts = {
			responseType: 'json',
			timeout: 4000
		};
		
		qwest.get('http://'+hostname+'/w/api.php', data, opts).then(this.onInfo);	
	};

	return WikipediaProvider;

})();

