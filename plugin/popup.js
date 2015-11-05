var res;

$(document).ready(function () {
    $("#btn1").on("click", run);
    $('#po code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
});

function run() {
    // chrome.tabs.executeScript({
    // 	code: "document.body.style.backgroundColor='red'; alert('dima')"
    // });

    // chrome.tabs.executeScript({
    // 	file: 'window.js'
    // });

    var isMark = $("#isMark").is(':checked');
    var onlyMark = $("#onlyMark").is(':checked');

    chrome.tabs.executeScript(null, {code: "var isMark = " + isMark + "; onlyMark = " + onlyMark},
        function () {
            chrome.tabs.executeScript(
                null,
                {file: "src/main.js"}
            );
        });
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    var data = changes['value'].oldValue;
    if(data === undefined) return;
    var obj = $.parseJSON(data);
    $('#json').jsonViewer(obj);
    filesArray = new Array;
    process(obj)
    $('#po code').text(filesArray);
    $('#po code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
});