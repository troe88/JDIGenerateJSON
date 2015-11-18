/**
 * Created by Dmitry_Lebedev1 on 16/11/2015.
 */
var popup;
var log;
$(document).ready(function () {
    log = new Log($("[id=log]"));
    try {
        log.msg("Start!");
        popup = {
            java: [],
            saveButton: $("#save"),
            genButton: $("#generate"),
            packageName: $("#packageName"),
            archiveName: $("#fileName"),
            is_mark: $("#isMark"),
            cl: (function () {
                var cl_temp = new containerList($('[class=contentContainer]'));
                cl_temp.add(new dataTabContainer("java", $("[id=java]"), $("[id=javaStr]")));
                cl_temp.add(new dataTabContainer("json", $("[id=json]"), $("[id=jsonStr]")));
                cl_temp.on("java");
                return cl_temp;
            })(),
            checkPackageName: function () {
                var val = popup.packageName.val();
                if (val.length === 0)
                    return false;
                return true;
            },
            checkArchiveName: function () {
                var val = popup.archiveName.val();
                if (val.length === 0)
                    return false;
                return true;
            },
            makeRed: function (elem) {
                elem.css("background-color", "#FFD1CC");
            },
            makeWhite: function () {
                $(event.target).css("background-color", "white");
            },
            isMark: function () {
                return getCBStatus(popup.is_mark);
            },
            sbDisabled: function () {
                popup.saveButton.addClass("disabled");
            },
            sbEnabled: function () {
                popup.saveButton.removeClass("disabled");
            },
            clear: function () {
                java = [];
                popup.sbDisabled();
            },
            save: function () {
                if (popup.saveButton.hasClass("disabled")) {
                    log.msg("Generate files before.")
                    return;
                }
                if (!popup.checkArchiveName()) {
                    popup.makeRed(popup.archiveName);
                    log.msg("Fill archive name.")
                    return;
                }
                saveAsZip(popup.cl.javaArray, popup.archiveName.val());
            },
            run: function () {
                popup.clear();
                if (!popup.checkPackageName()) {
                    popup.makeRed(popup.packageName);
                    log.msg("Fill package name.")
                    return;
                }
                chrome.runtime.sendMessage(
                    {
                        name: "val1", data: {
                        "isMark": popup.isMark(),
                        "packageName": popup.packageName.val(),
                    }
                    });
                popup.sbEnabled();
                popup.cl.emerge();
            },
            paint: function () {

            },
            prepCodeBlock: function () {
                $('#myCode').each(function (i, block) {
                    hljs.highlightBlock(block);
                });
            },
            testFunc: function () {
                chrome.runtime.sendMessage(
                    {
                        name: "val1", data: {
                        "isMark": popup.isMark(),
                        "packageName": popup.packageName.val(),
                    }
                    }
                );
            },
            collBack: function () {
                popup.genButton.on("click", popup.run);
                popup.saveButton.on("click", popup.save);
                popup.archiveName.focus(popup.makeWhite);
                popup.packageName.focus(popup.makeWhite);
            },
            init: function () {
                popup.collBack();
                popup.prepCodeBlock();
                popup.cl.vanish();
            }
        }

        popup.init();

        //chrome.runtime.sendMessage(
        //    {
        //        name: "exec",
        //        scriptToExecute: "../src/content.js",
        //        tabId: chrome.devtools.inspectedWindow.tabId
        //    },
        //    function () {
        //    });

        chrome.storage.onChanged.addListener(function (changes, namespace) {
            for (key in changes) {
                switch (key) {
                    case "p1":
                        var data = changes[key].newValue;
                        log.msg("Data received");
                        popup.cl.paintJSON(data);
                        popup.cl.paintJava(data);
                        break;
                    case "p2":
                        log.msg.text("p2: " + changes["p2"].newValue);
                        break;
                    default :
                        log.msg("ignore: " + key);
                }
            }
        });

        //chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        //    chrome.tabs.executeScript(tabs[0].id, {file: "src/content.js"}, function () {
        //    });
        //});
        //
        //chrome.storage.onChanged.addListener(function (changes, namespace) {
        //    for (key in changes) {
        //        switch (key) {
        //            case "value":
        //                var data = changes[key].newValue;
        //                if (data !== undefined) {
        //                    popup.cl.paintJSON(data);
        //                    popup.cl.paintJava(data);
        //                }
        //                break;
        //        }
        //    }
        //});
    } catch (e) {
        log.msg(e.toString());
    }
});