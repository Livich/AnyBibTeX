var __bibtex = new BibTeX();
var __query = new Query();

var IEEEXploreProvider = (function() {

    var callback = function(){console.error("provider callback is not defined");};

    function IEEEXploreProvider() {
        this.__bibtex = __bibtex;
        this.__query = __query;
    }

    IEEEXploreProvider.prototype.hostname = function(){
        return "ieeexplore.ieee.org/xpl/articleDetails.jsp";
    };

    IEEEXploreProvider.prototype.getBibEntry = function(tab, cb){
        callback = cb;
        articleId = this.__query.getVar(tab.url,'arnumber');
        if(articleId === false){
            callback(false);
        }
        //call IEEExplore API
        var fd = {'recordIds':articleId,
            'citations-format':'citation-only',
            'download-format':'download-bibtex'};

        qwest.post('http://ieeexplore.ieee.org/xpl/downloadCitations', fd).then(this.onInfo);

    };

    IEEEXploreProvider.prototype.onInfo = function(xhr, info){
        entry = info.replace(/<(?:.|\n)*?>/gm, '').replace(/(\n\n|\r\r|\r\n\r\n)/gm, "\n");//removes HTML tags and empty lines
        callback(entry);
    };


    return IEEEXploreProvider;

})();