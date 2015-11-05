var res;
var isMark;
var onlyMark;

$(document).ready(function () {
    chrome.storage.sync.clear()

    $("#btn1").on("click", run);
    $('#po code').each(function (i, block) {
        hljs.highlightBlock(block);
    });

    chrome.tabs.executeScript(null, {file: "src/main.js"}, function () {
    });

});

function run() {
    chrome.storage.sync.clear();

    isMark = $("#isMark").is(':checked');
    onlyMark = $("#onlyMark").is(':checked');

    chrome.storage.sync.set({"run": "yes", "onlyMark": onlyMark, "isMark": isMark}, function () {
        console.log('run');
    });

    // chrome.tabs.executeScript({
    // 	file: 'window.js'
    // });

    //chrome.tabs.executeScript({
    //    code: "var isMark = " + isMark + ";var onlyMark = " + onlyMark
    //});
    //

    //chrome.tabs.executeScript(null, null,
    //    function () {
    //        chrome.tabs.executeScript(
    //            null,
    //            {file: "src/main.js"}
    //        );
    //    });
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        switch (key) {
            case "value":
                if (changes['value'].newValue !== undefined) {
                    var data = changes['value'].newValue;
                    if (data === undefined) return;
                    var obj = $.parseJSON(data);
                    $('#json').jsonViewer(obj);
                    filesArray = new Array;
                    process(obj)
                    $('#po code').text(filesArray);
                    $('#po code').each(function (i, block) {
                        hljs.highlightBlock(block);
                    });
                }
                break;
        }
    }
});