var cookies = {expires: '', path: '', domain: '', secure: ''};

(function(){
var pair = document.cookie.split( ';' );
for(var i=0; i<pair.length; i+=1){
var nvPair = pair[i].split( '=' );
if(nvPair.length === 2){
var name = nvPair[0].replace(/^\s+|\s+$/g, '');
var value = nvPair[1].replace(/^\s+|\s+$/g, '');
cookies[name] = unescape(value);}}})();