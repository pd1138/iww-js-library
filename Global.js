//<![CDATA[
var model = {};
var signal = {};
var ctls = {};
var evts = {};
var btns = {};
var ux = {};
var rsp = {};

var req = {
buildHttpObj: function(response){
var httpObj = null;
if(window.XMLHttpRequest){httpObj = new XMLHttpRequest();}
else{alert('This web browser is incapable of communicating with our service, try a newer version or different browser.');}	
if(response !== null){
httpObj.onreadystatechange = function(){
if(httpObj.readyState === 4 && httpObj.status === 500){window.alert('Resquest failed');}
else if(httpObj.readyState === 4 && httpObj.status === 200){response(httpObj);}};}
return httpObj;},
serializeForm: function(valSet){
var formString = '';
for(var val in valSet){
if(valSet.hasOwnProperty(val)){
formString += val + '=' + encodeURIComponent(jsn.stringify(valSet[val])) + '&';}}
return formString.slice(0,-1);},		// removes extra '&' from the end of formString
queryString: function(qString){
var questionMark = qString !== ''? '?': '';	
var timeStamp = (function(){
var name = qString === ''? 'timestamp=': '&timestamp=';
var value = (new Date()).getTime();
var timeStamp = name + value;
return timeStamp;})();
var queryString = questionMark + qString + timeStamp;
return queryString;},
getTxt: function(qString, response, url){
var http = this.buildHttpObj(response);
http.open('GET', url + this.queryString(qString), true);
http.send('');},
postTxt: function(valSet, response, url){
var http = this.buildHttpObj(response);
http.open('POST', url, true);
http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//http.setRequestHeader('Content-length', valSet);
//http.setRequestHeader('Connection', 'close');
http.send(this.serializeForm(valSet));}};

var jsn = {
replaceEscapedChars: function(txt, charsToFind, toUnicode){
var string = String(txt);	
charsToFind.lastIndex = 0;
var hasChars = charsToFind.test(string);
if(hasChars){string = string.replace(charsToFind, toUnicode);}
return string;},
jsObj: {
charsToFind: /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
jsonNumber: function(value){
var num = isFinite(value)? value.toString(): 'null';
return num;},
jsonString: function(value){
var str = '"' + jsn.replaceEscapedChars(value, this.charsToFind, this.toUnicode) + '"';
return str;},
jsonBool: function(value){
var bool = value.toString();
return bool;},
jsonDate: function(value){
if(!isFinite){return 'invalid date';}		
var date = '"\/Date(' + value.valueOf() + ')\/"';
return date;},
jsonArray: function(array){
var prpties = [];	
for(var i=0; i<array.length; i+=1){
var prptyString = this.serializeObj(i, array);
if(prptyString !== null){prpties.push(prptyString);}}
var arrayString = '[' + prpties.join(',') + ']';	
return arrayString;},
jsonObj: function(obj){
var prpties = [];
for(var prpty in obj){
if(Object.hasOwnProperty.call(obj, prpty)){
var prptyName = '"' + jsn.replaceEscapedChars(prpty, this.charsToFind, this.toUnicode) + '"';
var prptyValue = this.serializeObj(prpty, obj);
if(prptyValue){
var prptyString = prptyName + ':' + prptyValue;
if(prptyString !== null){prpties.push(prptyString);}}}}
var objString = '{' + prpties.join(',') + '}';	
return objString;},	
toUnicode: function(a){
var meta = {'\b':'\\b', '\t':'\\t', '\n':'\\n', '\f':'\\f', '\r':'\\r', '\"':'\\"', '\\':'\\\\'};
var c = meta[a];
var uString = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
return uString;},		
serializeObj: function(key, holder){
var value = holder[key];
var json = 'null';
var valueType = typeof value;
switch(valueType){
case 'function': json = 'undefined'; break;
case 'string': json = this.jsonString(value); break;
case 'number': json = this.jsonNumber(value); break;
case 'boolean': json = this.jsonBool(value); break;
case 'object': 
if(value === null){return 'null';}
else if(value.constructor == Array){json = this.jsonArray(value.valueOf());}
else if(value.constructor == Date){json = this.jsonDate(value);}
else if(value.constructor == String){json = this.jsonString(value.valueOf());}
else if(value.constructor == Number){json = this.jsonNumber(value.valueOf());}
else if(value.constructor == Boolean){json = this.jsonBool(value.valueOf());}
else{json = this.jsonObj(value);}
break;
default: break;}
return json;}},
jsString: {
toUnicode: function(a){
var uString = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
return uString;},	
toObject: function(string){
var obj = Function('return ' + string)();
return obj;},		
jsonParse: function(txt){
var parsedObj = null;
var charsToFind = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
var bracketsDelims = /^[\],:{}\s]*$/;
var escapedChars = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var keyWords = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var openBrackets = /(?:^|:|,)(?:\s*\[)+/g;
var string =  jsn.replaceEscapedChars(txt, charsToFind , this.toUnicode);
if(bracketsDelims.test(string.replace(escapedChars, '@').replace(keyWords, ']').replace(openBrackets, ''))){parsedObj = this.toObject(string);}
else{parsedObj = string.valueOf();}
return parsedObj;}},
stringify: function(value){
var stringifiedObj = this.jsObj.serializeObj('', {'': value});
return stringifiedObj;},
parse: function(txt){
var parsedObj = this.jsString.jsonParse(txt);
return parsedObj;}};

var loadLibraries = function(path, files){
var $ = this.document;
for(var i=0; i<files.length; i+=1){
var s = $.createElement('script');
s.type = 'text/javascript';
s.src = path + files[i];
$.body.appendChild(s);}};
//]]>