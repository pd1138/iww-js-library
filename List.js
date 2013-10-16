//<![CDATA[
var List = function(node, fuct){
	this.list = node;
	this.addItems = fuct;

	this.clearList = function(){
	while(this.list.childNodes.length > 0){this.list.removeChild(this.list.childNodes[0]);}
	};

	this.buildEmptyList = function() {
	var itm = document.createElement('li');
	itm.innerHTML = 'no records found';
	this.list.appendChild(itm);};

	this.insertItems = function(itms){
		if(this.list.getElementsByTagName('LI').length > 0){this.clearList();}
		if(itms.length === 0){this.buildEmptyList(); return;}
		for(var i=0; i<itms.length; i+=1){
		var newItm = this.addItems(itms[i]);
		this.list.appendChild(newItm);}
	};
};
//]]>