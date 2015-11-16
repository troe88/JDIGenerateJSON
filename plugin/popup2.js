/**
 * Created by Dmitry_Lebedev1 on 16/11/2015.
 */

var saveButton;
var java;
var textInput;
var packageName;
var contentContainer;

var initTabs = function() {
    contentContainer = $('[class=contentContainer]');
    contentContainer.css("display", "none");
    var cl = new containerList();
    cl.add(new dataTabContainer("java", $("[id=java]"), $("[id=javaStr]")));
    cl.add(new dataTabContainer("json", $("[id=json]"), $("[id=jsonStr]")));
    cl.on("json")
}

function save() {
    if(saveButton.hasClass("disabled"))
        return;
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
    $('#jsonContainer').jsonViewer(data);
    java = translateToJava2(data, packageName.val());
    $('#myCode').text(displayJava(java));
    $('#myCode').each(function (i, block) {
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

var clear = function() {
    java = [];
    saveButton.addClass("disabled");
    textInput.css("background-color", "white")
}

function run() {
    clear();
    chrome.storage.sync.set({
        "run": "yes",
        "isMark": getCBStatus("#isMark"),
    }, function () {
        console.log('run');
    });
    saveButton.removeClass("disabled");
    contentContainer.css("display", "block");
}

$(document).ready(function () {
    initTabs();
    chrome.storage.sync.clear()
    textInput = $("#fileName");
    textInput.focus(function() {
        textInput.css("background-color", "white");
    });

    packageName = $("#packageName");

    $("#generate").on("click", run);
    saveButton = $("#save");
    saveButton.on("click", save);
    $('#myCode').each(function (i, block) {
        hljs.highlightBlock(block);
    });

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id, {file: "src/main.js"}, function () {
        });
    });
});