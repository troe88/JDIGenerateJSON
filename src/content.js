var spec = {
    jdi_type: "jdi-type",
    jdi_name: "jdi-name",
    jdi_parent: "jdi-parent",
    jdi_gen: "jdi-gen",
};

var opt = {
    packageName: "",
}

var jsonGen;

console.log("START");

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        switch (key) {
            case "val1":
                console.log("val1")
                opt.packageName = changes[key].newValue.packageName;
                chrome.storage.sync.clear();
                jsonGen = new jsonPageGenerator(spec, opt, document);
                chrome.runtime.sendMessage(
                    {name: "p1", data: jsonGen.getJSON()}
                );
                break;
            case "val2":
                //console.log("val2")
                //chrome.runtime.sendMessage(
                //    {name: "p2", data: "p2: " + Math.random()}
                //);
                break;
        }
    }
});