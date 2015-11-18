/**
 * Created by Dmitry_Lebedev1 on 18/11/2015.
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.name) {
            case "exec":
                executeContextScript(request);
                break;
            case "val1":
                chrome.storage.local.set({'val1': request.data});
                break;
            case "val2":
                chrome.storage.local.set({'val2': request.data});
                break;
            case "p1":
                chrome.storage.local.set({'p1': request.data});
                break;
            case "p2":
                chrome.storage.local.set({'p2': request.data});
                break;
            default :
                alert("error");
        }
    });

function executeContextScript(data) {
    alert(JSON.stringify(data));
    chrome.tabs.executeScript(data.tabId, {file: data.scriptToExecute});
}