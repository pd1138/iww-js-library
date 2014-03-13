//<![CDATA[
var Tbl = function(node, fuct){
	this.tbody = node;
	this.buildRows = fuct;

	this.clearTable = function( ){
		while(this.tbody.rows.length > 0){
			this.tbody.deleteRow(0);
		}
	};

	this.buildEmptyTable = function(){
		var row = this.tbody.insertRow(-1);
		row.className = 'emptyTable';
		var cell = document.createElement('td');
		cell.colSpan = 4;
		cell.innerHTML = 'no records found';
		row.appendChild(cell);
	};

	this.colorRows = function(){
		var rowLength = this.tbody.rows.length;
	
		for(var i=0; i<rowLength; i+=1){
			if(i%2 === 0){this.tbody.rows[i].className = 'dark';}
			else{this.tbody.rows[i].className ='light';}
		}
	};

	this.insertRows = function(list){
		if(this.tbody.rows.length > 0){
			this.clearTable();
		}
	
		if(list.length === 0){
			this.buildEmptyTable();
			return;
		}
	
		for(var i=0; i<list.length; i+=1){
			this.buildRows(list[i]);
		}
	
		this.colorRows(this.tbody);
	};
};
//]]>

['tr'
	['td', {class:'', id:''}, 'txt']
	['td', {class:'', id:''}, 'txt'],
	['td', {class:'', id:''}, 'txt'],
	['td', {class:'', id:''}, 'txt']
]