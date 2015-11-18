/**
 * Created by Dmitry_Lebedev1 on 16/11/2015.
 */
var popup;
$(document).ready(function () {
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
            if (popup.saveButton.hasClass("disabled"))
                return;
            if (!popup.checkArchiveName()) {
                popup.makeRed(popup.archiveName);
                return;
            }
            saveAsZip(popup.cl.javaArray, popup.archiveName.val());
        },
        run: function () {
            popup.clear();
            if (!popup.checkPackageName()) {
                popup.makeRed(popup.packageName);
                return;
            }
            chrome.storage.sync.clear();
            chrome.storage.sync.set({
                "isMark": popup.isMark(),
                "packageName" : popup.packageName.val(),
            }, function () {
                console.log('RUN');
            });
            popup.sbEnabled();
            popup.cl.emerge();
        },
        paint:function(){

        },
        prepCodeBlock: function () {
            $('#myCode').each(function (i, block) {
                hljs.highlightBlock(block);
            });
        },
        collBack: function () {
            //popup.genButton.on("click", popup.run);
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

    chrome.storage.sync.clear();
    popup.init();

    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id, {file: "src/content.js"}, function () {
        });
    });

    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (key in changes) {
            switch (key) {
                case "value":
                    var data = changes[key].newValue;
                    if (data !== undefined) {
                        popup.cl.paintJSON(data);
                        popup.cl.paintJava(data);
                    }
                    break;
            }
        }
    });
});