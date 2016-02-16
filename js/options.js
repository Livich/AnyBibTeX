function loadOpt() {
	var options = ["use_url", "language", "urldate-format"];
	var defaults = [true, chrome.i18n.getMessage("default_language"), "%YYYY%"];
	options.forEach(function(elm, i, arr) {
		if (localStorage[elm] === undefined) {
			localStorage[elm] = defaults[i];
		}
	});

	var cb_use_url = document.getElementById("cb_use_url");
	var opt_use_url = localStorage[options[0]];

	if (opt_use_url == "true" || opt_use_url === true) {
		cb_use_url.setAttribute("checked", "checked");
		opt_use_url = true;
	} else {
		cb_use_url.removeAttribute("checked");
	}

	var tb_default_language = document.getElementById("tb_default_language");
	tb_default_language.value = localStorage[options[1]] === undefined ? chrome.i18n.getMessage("default_language") : localStorage[options[1]];
	
	var tb_urldate_fmt = document.getElementById("tb_urldate_fmt");
	tb_urldate_fmt.value = localStorage[options[2]] === undefined ? options[2] : localStorage[options[2]];
}

function saveOpt() {
	var cb_use_url = document.getElementById("cb_use_url");
	var tb_default_language = document.getElementById("tb_default_language");
	var tb_urldate_fmt = document.getElementById("tb_urldate_fmt");
	var opt_use_url = cb_use_url.checked;

	localStorage["use_url"] = (opt_use_url === true || opt_use_url == "true");
	localStorage["language"] = tb_default_language.value;
	localStorage["urldate-format"] = tb_urldate_fmt.value;
	location.reload();
}

function restoreOpt() {
	localStorage.removeItem("use_url");
	localStorage.removeItem("language");
	localStorage.removeItem("urldate-format");
	location.reload();
}

//thanks to http://stackoverflow.com/questions/25467009/internationalization-of-html-pages-for-my-google-chrome-extension
function localizeHtmlPage() {
	//Localize by replacing __MSG_***__ meta tags
	var objects = document.getElementsByTagName('html');
	for (var j = 0; j < objects.length; j++) {
		var obj = objects[j];

		var valStrH = obj.innerHTML.toString();
		var valNewH = valStrH.replace(/__MSG_([\w\@]+)__/g, function(match, v1) {
			return v1 ? chrome.i18n.getMessage(v1) : "";
		});

		if (valNewH != valStrH) {
			obj.innerHTML = valNewH;
		}
	}
}

localizeHtmlPage();

document.addEventListener('DOMContentLoaded', loadOpt);
document.getElementById("saveButton").addEventListener("click", saveOpt);
document.getElementById("restoreButton").addEventListener("click", restoreOpt);
