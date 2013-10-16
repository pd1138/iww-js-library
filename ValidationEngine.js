//<![CDATA[
/*global model:true, evts:true, signal:true, ctls:true, req:true, jsn:true */
/*jshint strict:false */
var vCtlsets = {};

var testValue = function(ctl){
ctl.value = ctl.value.replace(/^s+|s+$/g, '');
if(ctl.value === ''){
if (ctl.isRequired === true){ctl.isValid = false;}
else{ctl.isValid = true;}
return;}
var validValue = ctl.vString.test(ctl.value);
if(!validValue){ctl.isValid = false;}
else{ctl.isValid = true;}};

var setMsg = function(ctl){
if(ctl.msg){
ctl.msg.parentNode.removeChild(ctl.msg);
delete ctl.msg;}
if(!ctl.isValid){
ctl.msg = window.document.createElement('div');
ctl.msg.className = 'errMsg';
if(ctl.isRequired && ctl.value === ''){ctl.msg.innerHTML = 'This is a required field';}
else{ctl.msg.innerHTML = ctl.invalidMsg;}
ctl.parentNode.appendChild(ctl.msg);}};

var setBtns = function(vCtlset){
var val = true;
for(var j=0; j<vCtlset.vCtls.length; j+=1){val = val * vCtlset.vCtls[j].isValid;}
for(var i=0; i<vCtlset.btns.length; i+=1){vCtlset.btns[i].disabled = !val;}};

var validate = function(ctl){
var vCtlset = vCtlsets[ctl.setName];
testValue(ctl);
setMsg(ctl);
setBtns(vCtlset);};

var vCtls = {
InputCtl: function(ctl, setName, isRequired){
ctl.isRequired = isRequired;
ctl.isValid = (function(){
var val = true;
if(isRequired){val = false;}
return val;}());
ctl.setName = setName;
ctl.onblur = function(){validate(ctl);};
if(!vCtlsets[setName]){vCtlsets[setName] = {vCtls:[], btns:[]};}
vCtlsets[setName].vCtls.push(ctl);
setBtns(vCtlsets[setName]);},

selectCtl: function(ctl, setName, value){
ctl.isRequired = true;
ctl.isValid = false;
ctl.setName = setName;
ctl.invalidMsg = 'This is a reqired field';
ctl.onchange = function(){
var vCtlset = vCtlsets[ctl.setName];
if(ctl.value === value){ctl.isValid = false;}
else{ctl.isValid = true;}
setMsg(ctl);
setBtns(vCtlset);};
if(!vCtlsets[setName]){vCtlsets[setName] = {vCtls:[], btns:[]};}
vCtlsets[setName].vCtls.push(ctl);
setBtns(vCtlsets[setName]);},

submitBtn: function(btn, setName) {
if(!vCtlsets[setName]){vCtlsets[setName] = {vCtls:[], btns:[]};}
vCtlsets[setName].btns.push(btn);
setBtns(vCtlsets[setName]);},

msg: 'Invalid Format: ',

requiredCtl: function(ctl, setName){
this.InputCtl(ctl, setName, true);
ctl.vString = /\S+/;
ctl.invalidMsg = 'This is a reqired field';},

alphaCtl: function(ctl, setName, isRequired){
this.InputCtl(ctl, setName, isRequired);
ctl.vString = /^[a-zA-Z]+$/;
ctl.invalidMsg = this.msg + 'letters a through z only';},

alphaNumCtl: function(ctl, setName, isRequired){
this.InputCtl(ctl, setName, isRequired);
ctl.vString = /^[a-zA-Z0-9]+$/;
ctl.invalidMsg = this.msg + 'letters &amp; numbers only';},

alphaSpaceCtl: function(ctl, setName, isRequired){
this.InputCtl(ctl, setName, isRequired);
ctl.vString = /^[a-zA-Z\s-']+$/;
ctl.invalidMsg = this.msg + 'letters a through z only';},

addressCtl: function(ctl, setName, isRequired){
this.InputCtl(ctl, setName, isRequired);
ctl.vString = /^[a-zA-Z\s.0-9]+$/;
ctl.invalidMsg = this.msg + 'numbers, letters, &amp; . only';},

emailCtl: function(ctl, setName, isRequired){
this.InputCtl(ctl, setName, isRequired);
ctl.vString = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
ctl.invalidMsg = this.msg + 'email address format is incorrect';},

numCtl: function(ctl, setName, isRequired){
this.InputCtl(ctl, setName, isRequired);
ctl.vString = /^\d+$/;
ctl.invalidMsg = this.msg + 'digits 0 through 9 only';},

dateCtl: function(ctl, setName, isRequired){
this.InputCtl(ctl, setName, isRequired);
ctl.vString = /^([0][1-9]|[1][012])\/([012][0-9]|[3][01])\/[12][0-9]{3}$/;
ctl.invalidMsg = this.msg + 'Use mm/dd/yyyy';
initDateCtl(ctl);},

dollarCtl: function(ctl, setName, isRequired){
this.InputCtl(ctl, setName, isRequired);
ctl.vString = /^\d+\.[\d]{2}$/;
ctl.invalidMsg = this.msg + 'use currency format';},

zipCtl: function(ctl, setName, isRequired){
this.InputCtl(ctl, setName, isRequired);
ctl.vString = /^\d{5}([-]?\d{4})?$/;
ctl.invalidMsg = this.msg + 'Use  ##### or #####-####';},

phoneCtl: function(ctl, setName, isRequired){
this.InputCtl(ctl, setName, isRequired);
ctl.vString = /^\([2-9]\d{2}\)\d{3}-\d{4}$/;
ctl.invalidMsg = this.msg + 'Use (###)###-####';}};
//]]>