function CalendarView(element, format) {
	this.output = element;
	this.format = format ? format : "YYYY-MM-DD";
	this.selectedDate = "";
	this.holder = null;
	this.visible = false;
	this.el = function(e) {
		return document.createElement(e);
	}
	this.init = function() {
		//Months Down Button
		var month_down_btn = this.el("button");
		month_down_btn.className = "calendar-widget-btn calendar-widget-btn-month-down";
		month_down_btn.appendChild(document.createTextNode("<<"));
		//Months Up Button
		var month_up_btn = this.el("button");
		month_up_btn.className = "calendar-widget-btn calendar-widget-btn-month-up";
		month_up_btn.appendChild(document.createTextNode(">>"));
		month_down_btn.addEventListener("click", function() {
			window[this.parentNode.parentNode.id+"-calendarWidget"].month_down();
		});
		month_up_btn.addEventListener("click", function() {
			window[this.parentNode.parentNode.id+"-calendarWidget"].month_up();
		});
		//Months Select Input
		var months = this.el("select");
		months.className = "calendar-widget-monthname";
		months.dir = "rtl";
		var month_names = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		for (var i=0;i<month_names.length;i++) {
			var option = this.el("option");
			option.value = i;
			option.appendChild(document.createTextNode(month_names[i]));
			months.appendChild(option);
		}
		months.selectedIndex = moment().month();
		months.addEventListener("change", function() {
			window[this.parentNode.parentNode.id+"-calendarWidget"].change_date();
		});
		//Year Number Input
		var year = this.el("input");
		year.type = "number";
		year.max = 2100;
		year.min = 1900;
		year.className = "calendar-widget-year";
		year.value = moment().year();
		year.addEventListener("change", function() {
			window[this.parentNode.parentNode.id+"-calendarWidget"].change_date();
		});
		//Calendar Header
		var header = this.el("section");
		header.className = "calendar-widget-header";
		header.appendChild(month_down_btn);
		header.appendChild(month_up_btn);
		header.appendChild(months);
		header.appendChild(year);
		//Calendar Dates Table
		var table = this.el("table");
		table.className = "calendar-widget-table";		
		this.populate_table(moment().month(), moment().year(), table);
		table.addEventListener("click", function(e) {
			if (e.target !== e.currentTarget) {
				if (!e.target.getAttribute("data-date")) {
					return;
				}
				var calendar = window[this.parentNode.parentNode.id+"-calendarWidget"];
				calendar.output.value = e.target.getAttribute("data-date");
				calendar.selectedDate = e.target.getAttribute("data-date");
				calendar.holder.style.display = "none";
				calendar.change_date();
			}
			e.stopPropagation();
		});
		//Calendar Body
		var body = this.el("section");
		body.className = "calendar-widget-body";
		body.appendChild(table);
		//Parent Node for Calendar
		var section = this.el("section");
		section.className = "calendar-widget calendar-widget-noselect";
		//Setting the id and forming the calendar
		var id = ("calendar-" + Math.random()*moment().unix());
		section.id = id;
		section.appendChild(header);
		section.appendChild(body);
		//Append it to the document body
		this.output.parentNode.appendChild(section);
		//Setup the hooks
		this.holder = section;
		window[id+"-calendarWidget"] = this;
		this.output.setAttribute("data-calendar-widget", id);
		this.output.addEventListener("focus", function() {
			var calendar = window[this.getAttribute("data-calendar-widget")+"-calendarWidget"];
			calendar.holder.style.display = "block";
			calendar.change_date();
			calendar.hideOnClickOutside(calendar);
			calendar.visible = true;
		});
	}
	this.change_date = function() {
		var month = this.holder.getElementsByClassName("calendar-widget-monthname")[0];
		var year = this.holder.getElementsByClassName("calendar-widget-year")[0];
		this.populate_table(parseInt(month.value), parseInt(year.value));
	}
	this.month_down = function() {
		var month = this.holder.getElementsByClassName("calendar-widget-monthname")[0];
		var year = this.holder.getElementsByClassName("calendar-widget-year")[0];
		if (month.value > 0) {
			month.value = parseInt(month.value)-1;
		}
		else {
			month.value = 11;
			year.value = parseInt(year.value)-1;
		}
		this.change_date();
	}
	this.month_up = function() {
		var month = this.holder.getElementsByClassName("calendar-widget-monthname")[0];
		var year = this.holder.getElementsByClassName("calendar-widget-year")[0];
		if (month.value < 11) {
			month.value = parseInt(month.value)+1;
		}
		else {
			month.value = 0;
			year.value = parseInt(year.value)+1;
		}
		this.change_date();
	}
	/*Hiding the Calendar when nessesary
		Taken From: https://stackoverflow.com/questions/152975/how-do-i-detect-a-click-outside-an-element
	 */
	this.hideOnClickOutside = function(calendarObj) {
		const outsideClickListener = event => {
			if ((!calendarObj.holder.contains(event.target)) && (event.target !== calendarObj.output)) { // or use: event.target.closest(selector) === null
				if (calendarObj.visible) {
					calendarObj.holder.style.display = 'none';
					calendarObj.visible = false;
					removeClickListener();
				}
			}
		}
	
		const removeClickListener = () => {
			document.removeEventListener('click', outsideClickListener);
		}
	
		document.addEventListener('click', outsideClickListener);
	}	
	this.populate_table = function(month, year, table) {
		var table = table ? table : this.holder.getElementsByClassName("calendar-widget-table")[0];
		var weeknames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
		while (table.firstChild) {
			table.removeChild(table.firstChild);
		}
		var thead = this.el("thead");
		var tr = this.el("tr");
		for (var i=0;i<weeknames.length;i++) {
			var td = this.el("th");
			td.appendChild(document.createTextNode(weeknames[i]));
			tr.appendChild(td);
		}
		thead.appendChild(tr);
		var tbody = this.el("tbody");
		var date = moment();
		date.set("year", year);
		date.set("month", month);
		date.set("hour", 12);
		date.set("date", 1);
		var currentYear = moment().year();
		var currentDayOfYear = moment().dayOfYear();
		var days = date.daysInMonth();
		if (date.day() > 0) {
			date.subtract(date.day()-1, "days");
		}
		for (var week=0;week<6;week++) {
			var tr = this.el("tr");
			for (var day=0;day<7;day++) {
				var td = this.el("td");
				td.appendChild(document.createTextNode(date.date()));
				td.className = date.month() == month ? "" : "out-of-month";
				td.className = ((date.dayOfYear() == currentDayOfYear) && (date.year() == currentYear)) ? "today" : td.className;
				td.className = ((date.format(this.format) == this.selectedDate) ? "selected" : td.className);
				td.setAttribute("data-date", date.format(this.format));
				tr.appendChild(td);
				date.add(1, "days");
			}
			tbody.appendChild(tr);
			if (date.month() != month) {
				break;
			}
		}
		table.appendChild(thead);
		table.appendChild(tbody);
	}
	return this;
}
