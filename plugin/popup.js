var res;

$(document).ready(function () {
    $("#btn1").on("click", run);
});

function run() {
    // chrome.tabs.executeScript({
    // 	code: "document.body.style.backgroundColor='red'; alert('dima')"
    // });

    // chrome.tabs.executeScript({
    // 	file: 'window.js'
    // });

    isMark = $("#isMark").is(':checked');

    chrome.tabs.executeScript(null, {code: "var isMark = " + isMark},
        function () {
            chrome.tabs.executeScript(
                null,
                {file: "src/main.js"}
            );
        });
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    var data = changes['value'].oldValue;
    $('#json-renderer').jsonViewer(JSON.parse(data));
});