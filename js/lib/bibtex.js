var BibTeX = (function() {

	function BibTeX() {
	};

	// Escape code from https://github.com/dangmai/escape-latex
	// Map the characters to escape to their escaped values. The list is derived
	// from http://www.cespedes.org/blog/85/how-to-escape-latex-special-characters

	var escapes = {
		'{' : '\\{',
		'}' : '\\}',
		'\\' : '\\textbackslash{}',
		'#' : '\\#',
		'$' : '\\$',
		'%' : '\\%',
		'&' : '\\&',
		'^' : '\\textasciicircum{}',
		'_' : '\\_',
		'~' : '\\textasciitilde{}'
	};

	var escapeRegExp = function(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	};
	var escapeKeys = Object.keys(escapes); // as it is reused later on
	var escapeKeyRegExps = escapeKeys.map(function(key) {
		return escapeRegExp(key);
	});

	/**
	 * Escape a string to be used in JS regular expression.
	 * Code from http://stackoverflow.com/a/6969486
	 * @param str the string to be used in a RegExp
	 * @return the escaped string, ready to be used for RegExp
	 */
	BibTeX.prototype.texEscape = function(str) {
		try {
		var pos,
		    match,
		    regExpFound = false,
		    result =
		    str;
		// Find the character(s) to escape, then break the string up at
		// that/those character(s) and repeat the process recursively.
		// We can't just sequentially replace each character(s), because the result
		// of an earlier step might be escaped again by a later step.
		escapeKeys.forEach(function(key, index) {
			if (regExpFound) {
				// This is here to avoid breaking up strings unnecessarily: In every
				// repetition step, we only need to find ONE special character(s) to
				// break up the string; after it is done, there is no need to look
				// further.
				return;
			}
			pos = str.search(escapeKeyRegExps[index]);
			match = str.match(escapeKeyRegExps[index]);
			if (pos !== -1) {
				result = this.texEscape(str.slice(0, pos)) + escapes[escapeKeys[index]];
				result += this.texEscape(str.slice(pos + match.length));
				regExpFound = true;
			}
		});
		// Found nothing else to escape
		return result;
		} catch(e) {
			return str;
		}
	};

	/*Tools*/

	//adds lescaped format method
	if (!String.format) {
		String.format = function(format) {
			var args = Array.prototype.slice.call(arguments, 1);
			return format.replace(/{(\d+)}/g, function(match, number) {
				return typeof args[number] != undefined ? args[number] : match;
			});
		};
	}

	//adds substitute method
	if (!String.substitute) {
		String.substitute = function(str, replacements) {
			str = str.replace(/%\w+%/g, function(all) {
				return replacements[all] || all;
			});
			return str;
		};
	}

	BibTeX.prototype.getBibTeX = function(type, prefix, postfix) {
		var infoTypes = {
			"id" : "{0}",
			"author" : "author = {{0}}",
			"title" : "title = {{0}}",
			"year" : "year = {{0}}",
			"publisher" : "publisher = {{0}}",
			"isbn" : "isbn = {{0}}",
			"language" : "language = {{0}}",
			"pagetotal" : "pagetotal = {{0}}",
			"url" : "url = {{0}}",
			"urldate" : "urldate = {{0}}"
		};
		if (infoTypes[type] === undefined || typeof val === undefined) {
			return '';
		}
		return prefix + String.format(infoTypes[type], this.texEscape(Array.prototype.slice.call(arguments, 3))) + postfix;
	};

	BibTeX.prototype.getUrlDate = function(format) {
		var today = function() {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1;
			//January is 0!
			var yyyy = today.getFullYear();

			if (dd < 10) {
				dd = '0' + dd
			}

			if (mm < 10) {
				mm = '0' + mm
			}

			return {
				"%DD%" : dd,
				"%MM%" : mm,
				"%YYYY%" : yyyy
			};
		};

		return this.texEscape(String.substitute(format, today()));
	};

	return BibTeX;

})();
