$(document).ready(function() {
    $("#btn1").on("click", run);
})

function run() {
	// chrome.tabs.executeScript({
	// 	code: "document.body.style.backgroundColor='red'; alert('dima')"
	// });

  	// chrome.tabs.executeScript({
	// 	file: 'window.js'
	// });

	host = document.getElementById("host").value;
	page1 = document.getElementById("page1").value;
	page2 = document.getElementById("page2").value;

	chrome.tabs.executeScript(null, { code: "var base = '" + host + "'; var pages = ['" + page1 + "','" + page2 + "'];"},
	function() {
		chrome.tabs.executeScript(
			null,
			{ file: "src/scr3.js" }
		);
	});

 }