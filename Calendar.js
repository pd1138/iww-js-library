//<![CDATA[
var dateTime = {
	month: {
		names: ['January','February','March','April','May','June','July','August','September','October','November','December'],
	
		getIndex: function(month){
		for(var i=0; i<this.names.length; i+=1){
		if(this.names[i] === month){return i;}}},
	
		getName: function(idx){return this.names[idx];},
	
		getDaysInMonth: function(year, month){
		var isLeapYear = function(year){return( ((year%4===0) && (year%100!==0))||(year%400===0) );};
		return[31, (isLeapYear(year)? 29: 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];},

		getFirstDay: function(y,m){
		var tDate = new Date(y,m,1);
		return tDate.getDay();},

		getPreviousMonth: function(month, year){
		var m = (month - 1)%12;
		var y = year;
		if(m === -1){y -= 1; m = 11;}
		return {month:m, year:y};},

		getNextMonth: function(month, year){
		var m = (month + 1)%12;
		var y = year;
		if(month > m){y += 1;}
		return {month:m, year:y};}
	},

	stringToDate: function(txt){
	var parsedTxt = txt.split('/', 3);
	var m = parseInt(parsedTxt[0],10) - 1;
	var d = parseInt(parsedTxt[1],10);
	var y = parseInt(parsedTxt[2],10);
	var date = new Date(y, m, d);
	return date;}	
};

var currentDateCtl = null;

var calendar = {
	calControls: {
		mName: function(){
		var node = document.createElement('span');
		node.id = 'mName';
		return node;}(),

		yName: function(){
		var node = document.createElement('span');
		node.id = 'yName';
		return node;}(),
	
		year: function(){return parseInt(this.yName.innerHTML, 10);	},
	
		month: function(){return  dateTime.month.getIndex(this.mName.innerHTML);},

		prevY: function(){
		var node = document.createElement('span');
		node.id = 'prevY';
		node.innerHTML = '&lt;&lt;';
		node.onclick = function(){
		var m = calendar.calControls.month(), y = calendar.calControls.year();
		
		var prevYear = y - 1;
		
		return calendar.insertDates(m, prevYear, 0);};	
		return node;}(),
	
		nxtY: function(){
		var node = document.createElement('span');
		node.id = 'nxtY';
		node.innerHTML = '&gt;&gt;';
		node.onclick = function(){
		var m = calendar.calControls.month(), y = calendar.calControls.year();
		
		var nxtYear = y + 1;
		
		return calendar.insertDates(m, nxtYear, 0);};
		return node;}(),

		prevM: function(){
		var node = document.createElement('span');
		node.id = 'prevM';
		node.innerHTML = '&lt;';
		node.onclick = function(){
		var m = calendar.calControls.month(), y = calendar.calControls.year();
		
		var prevMonth = dateTime.month.getPreviousMonth(m, y);
		
		calendar.insertDates(prevMonth.month, prevMonth.year, 0);};
		return node;}(),
	
		nxtM: function(){
		var node = document.createElement('span');
		node.id = 'nxtM';
		node.innerHTML = '&gt;';
		node.onclick = function(){
		var m = calendar.calControls.month(), y = calendar.calControls.year();
		var nxtMonth = dateTime.month.getNextMonth(m, y);
		calendar.insertDates(nxtMonth.month, nxtMonth.year, 0);};
		return node;}(),
	
		build: function(){
		var calCtls = document.createElement('div');
		calCtls.id = 'calCtls';
		calCtls.appendChild(this.prevY);
		calCtls.appendChild(this.prevM);
		calCtls.appendChild(this.nxtY);
		calCtls.appendChild(this.nxtM);
		calCtls.appendChild(this.mName);
		calCtls.appendChild(this.yName);
		return calCtls;}
	},

	calTable: {	
		calBody: function(tbl){
		var tBody = document.createElement('tbody');
		tBody.id = 'dates';
		tBody.onclick = function(e){
		e = e || window.event;
		var target = e.target || e.srcElement;
		if(target.tagName === 'TD'){calendar.setDate(target.innerHTML);}};
		tbl.appendChild(tBody);},
	
		calHead: function(tbl){
		var header = tbl.createTHead();
		var tr = header.insertRow(0);
		var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];	
		for(var i=0; i<dayNames.length; i+=1){
		var td = tr.insertCell(i);
		td.innerHTML = dayNames[i];}},
	
		calFoot: function(tbl){
		var footer = tbl.createTFoot();
		var tr = footer.insertRow(0);
		var cancelBtn = tr.insertCell(0);	
		cancelBtn.colSpan = 7;
		cancelBtn.className = 'linkCtl';
		cancelBtn.style.textAlign = 'right';
		cancelBtn.innerHTML = 'close';
		cancelBtn.onclick = function(){
		var cal = document.getElementById('calendar');
		cal.removeChild(cal);};},
	
		tblColumns: function(tbl){
		var col1 = document.createElement('col');
		var col2thru6 = document.createElement('col');
		var col7 = document.createElement('col');
		col1.style.backgroundColor = '#FBFBFB';
		col2thru6.span = 5;
		col2thru6.style.backgroundColor = '#FFFFFF';
		col7.style.backgroundColor = '#FBFBFB';
		tbl.appendChild(col1);
		tbl.appendChild(col2thru6);
		tbl.appendChild(col7);},
	
		build: function(){
		var tbl = document.createElement('table');
		tbl.id = 'calTbl';
		tbl.cellSpacing = 0;
		this.tblColumns(tbl);
		this.calHead(tbl);
		this.calFoot(tbl);
		this.calBody(tbl);
		return tbl;}
	},

	buildCalendar: function(month, year){	
	var calDiv = document.createElement('div');
	var calCtls = this.calControls.build();
	var calTbl = this.calTable.build();	
	calDiv.id = 'calendar';
	calDiv.appendChild(calCtls);
	calDiv.appendChild(calTbl);
	document.body.appendChild(calDiv);},
	
	setDate: function(tDate) {
	var input_date = currentDateCtl;
	var calCtl = document.getElementById('calendar');
	var y = calendar.calControls.year();
	var m = calendar.calControls.month() + 1;
	if(m < 10){m = '0' + m;}
	if(tDate.length === 1){tDate = '0' + tDate;}
	input_date.value = m + '/' + tDate + '/' + y;
	calCtl.parentNode.removeChild(calCtl);
	input_date.onkeyup();},

	insertDates: function(m, y, d) {
	var tBody = document.getElementById('dates');
	var dayCount = 1;
	var daysInMonth = dateTime.month.getDaysInMonth(y, m);
	var firstDay = dateTime.month.getFirstDay(y, m);
	while(tBody.rows.length > 0){tBody.deleteRow(-1);}	
	this.calControls.mName.innerHTML = dateTime.month.getName(m);
	this.calControls.yName.innerHTML = y;
	for(var i=0; i<6; i+=1) {
	var cRow = tBody.insertRow(i);
	for (var j=0; j<7; j+=1){
	if((cRow.rowIndex === 1 && j < firstDay) || dayCount > daysInMonth){cRow.insertCell(j);}
	else{
	var dCell = cRow.insertCell(j);
	dCell.style.cursor = 'pointer';
	var tDate = document.createTextNode(dayCount);		
	if(dayCount === d){
	dCell.style.fontWeight = 'bold';
	dCell.style.color = 'red';}
	dCell.appendChild(tDate);
	dayCount += 1;}}}},

	getMdy: function(){
	var txt = currentDateCtl.value;
	var date;
	var isValidDate = function(){
		var isValid = currentDateCtl.vString.test(currentDateCtl.value);
		return isValid;
	};
	
	if(txt === '' || !isValidDate()){date = new Date();}
	else {date = dateTime.stringToDate(txt);}
	return {m: date.getMonth(), d: date.getDate(), y: date.getFullYear()};}
};

var initDateCtl = function(ctl){
var imgSpan = document.createElement('span');
imgSpan.style.paddingLeft = '5px';
var img = document.createElement('img');
img.src = '../Content/calendar.gif';
img.alt = 'calendar icon';
img.style.verticalAlign = 'bottom';
img.onclick = function(){
currentDateCtl = ctl;
var mdy = calendar.getMdy();
calendar.buildCalendar(mdy.m, mdy.y);
calendar.insertDates(mdy.m, mdy.y, mdy.d);
var calCtl = document.getElementById('calendar');
calCtl.style.top = img.offsetTop + 'px';
calCtl.style.left = img.offsetLeft + 'px';};
imgSpan.appendChild(img);
ctl.parentNode.appendChild(imgSpan);};
//]]>