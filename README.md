# CalendarView
#### Very Small Calendar Widget written in JavaScript

Features;
* Fast selection of date using a familar table layout
* Highlight of current and selected date
* Date stored and retrived using UNIX timestamp
* Define the data format shown in the target input (e.g. YYYY-MM-DD)
* Automatic popup and disappearing
* Quick selection of year and month
* Back and forward arrows to select preceeding and succeeding month

## Installation
Easiest way to get started is to clone this repository
`git clone https://github.com/Ionman64/CalendarView`

Otherwise, download the zip and extract the files

## Dependencies
This project requires the [momentJS](https://momentjs.com/) JavaScript library to function

JQuery is **not** required

## Running
This project can be applied to any HTML input[type=text] element.

**Usage**;
 ```
  var calendar = new CalendarView(element);
 
  calendar.init();
 ```

## Modification
Feel free to modify the project as needed, it is covered by the MIT license.


