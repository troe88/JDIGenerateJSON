var saveButton;
var java;
var textInput;
var packageName;
$(document).ready(function () {
    chrome.storage.sync.clear()
    textInput = $("#fileName");
    textInput.focus(function() {
        textInput.css("background-color", "white");
    });

    packageName = $("#packageName");

    $("#btn1").on("click", run);
    saveButton = $("#btn2");
    saveButton.on("click", save);

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

var clear = function() {
    java = [];
    saveButton.prop("disabled", true);
    textInput.css("background-color", "white")
    chrome.storage.sync.clear();
}

function run() {
    clear();
    chrome.storage.sync.set({
        "run": "yes",
        "isMark": getCBStatus("#isMark"),
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

function save() {
    saveResults();
}

var saveResults = function () {
    var text = textInput.val();

    if(text.length === 0){
        textInput.css("background-color", "#FFD1CC")
    } else {
        saveAsZip(java, text);
    }
}

var displayJava = function(data) {
    var str = "";
    $.each(data, function (i, val) {
       str += "//{0}\n{1}//!{2}\n\n".format(val.name.toUpperCase(), val.data, val.name.toUpperCase());
    });
    return str;
}

function paint(data) {
    $('#json').jsonViewer(data);
    java = translateToJava2(data, packageName.val());
    $('#po code').text(displayJava(java));
    $('#po code').each(function (i, block) {
        hljs.highlightBlock(block);
    });
    saveButton.prop("disabled", false);
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