$(document).ready(function () {
    chrome.storage.sync.clear()

    $("#btn1").on("click", run);
    $('#po code').each(function (i, block) {
        hljs.highlightBlock(block);
    });

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id, {file: "src/main.js"}, function () {
        });
    });
});

function getCBStatus(id) {
    return $(id).is(':checked');
}

function run() {
    chrome.storage.sync.clear();

    chrome.storage.sync.set({
        "run": "yes",
        "onlyMark": getCBStatus("#onlyMark"),
        "isMark": getCBStatus("#isMark")
    }, function () {
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

function paint(data) {
    $('#json').jsonViewer(data);
    $('#po code').text(translateToJava(data));
    $('#po code').each(function (i, block) {
        hljs.highlightBlock(block);
    });
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        switch (key) {
            case "value":
                var data = changes[key].newValue;
                if (data !== undefined) {
                    paint($.parseJSON(data));
                }
                break;
        }
    }
});