/*
 <license>
 BibTeX for Google Books - a Google Chrome extension
 Copyright 2015 Sergiy Lilikovych.

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 as published by the Free Software Foundation; either version 2
 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>

 Credits to:
 * Petsios Theofilos, author of "BibTeX entry from URL" extension;
 * Cbenz for his Get-opened-tabs-URLs-Chrome-extension (https://github.com/cbenz);
 * Dang Mai for his LaTeX escaping script (https://github.com/dangmai/escape-latex)
 </license>
 */

/*Google Analitycs*/
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-61572268-2']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();


/*Main code*/

var bProviders = [new GenericProvider(), new GoogleProvider(), new WikipediaProvider(), new IEEEXploreProvider()];
var bpIndex = 0;
var watchdog;

if (localStorage["urldate-format"] == undefined || localStorage["urldate-format"] == "") {
	localStorage["urldate-format"] = "%DD%/%MM%/%YYYY%";
}

function onInfo(entry) {
	clearTimeout(watchdog);
	//copy reference to clipboard
	clipboardholder = document.getElementById("clipboardholder");
	clipboardholder.style.display = "block";
	clipboardholder.value = entry;
	clipboardholder.select();
	document.execCommand("Copy");

	if (result) {
		clipboardholder.style.display = "none";
		document.getElementById("result").innerHTML = '<span>' + chrome.i18n.getMessage("copied_to_clipboard") + '</span>';
	} else {
		document.getElementById("result").innerHTML = '<span class="error">' + chrome.i18n.getMessage("e_copy_to_clipboard") + '</span>';
	};
}

function onError(code) {
	document.getElementById("result").innerHTML = '<span class="error">' + chrome.i18n.getMessage("e_" + code) + '</span>';
}

chrome.tabs.query({
	'active' : true,
	'currentWindow' : true
}, function(tab) {

	if (!tab) {
		return;
	}

	bProviders.forEach(function(key, index) {
		if (tab[0].url.indexOf(bProviders[index].hostname()) >= 0) {
			bpIndex = index;
		}
	});
	watchdog = setTimeout(function() {
		onError(0);
	}, 5000);
	bProviders[bpIndex].getBibEntry(tab[0], onInfo);
});