var Query = (function() {

	function Query() {
	};

/*
http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
by Madbreaks
*/
Query.prototype.getVar = function(query, varName){
	// Grab and unescape the query string - appending an '&' keeps the RegExp simple
	// for the sake of this example.
	var queryStr = unescape(query) + '&';
	
	// Dynamic replacement RegExp
	var regex = new RegExp('.*?[&\\?]' + varName + '=(.*?)&.*');
	
	// Apply RegExp to the query string
	val = queryStr.replace(regex, "$1");
	
	// If the string is the same, we didn't find a match - return false
	return val == queryStr ? false : val;
};

Query.prototype.hostname = function(q){
	return q.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
};

	return Query;

})();

