var jdi_type = "jdi-type";
var jdi_name = "jdi-name";
var jdi_parent = "jdi-parent";
var jdi_gen = "jdi-gen"

var filesArray = [];
var ITextField = "ITextField";
var ITextArea = "ITextArea";
var IButton = "IButton";
var IForm = "IForm"
var IPage = "IPage"
var IElement = "IElement"

var templates = {
    ITextArea: "",
    IButton: "",
    IForm: "\nclass {0} extends IForm<{2}> {\n{1}}",
    IPage: "\nclass {0} extends IPage {\n{1}}",
    IElement: "",
    ITextField: "",
    simpleClass: "\nclass {0} {\n{1}\n}",
    cfw: "\tFindBy(css = \"{2}\")\n\t{0} {1};\n\n",
    cf: "\t{0} {1};\n",
    css: "[jdi-type={0}]"
};

var moduleSimple = function(data) {
    return templates.cfw.format(data.type, data.name, templates.css.format(data.name));
}

var modelGenField = {
    ITextArea: moduleSimple,
    IButton: moduleSimple,
    IForm: function (data) {
        process(data);
        return templates.cfw.format(data.name, "form", templates.css.format(data.name));
    },
    IPage: undefined,
    IElement: moduleSimple,
    ITextField: moduleSimple,
};

var modelComposite = {
    IForm: function (data) {
        filesArray.push(templates[data.type].format(data.name, getDataFromElements(data.elements), data.gen));
        filesArray.push(templates.simpleClass.format(data.gen, genGenClassForm(data.elements)));
    },
    IPage: function (data) {
        filesArray.push(templates[data.type].format(data.title, getDataFromElements(data.elements)));
    }
};

var Utils = {
    randColor: function () {
        return "#" + ((1 << 24) * Math.random() | 0).toString(16);
    },
    mark: function (item) {
        item.style.backgroundColor = this.randColor();
        item.style.outline = "2px solid red";
        item.color = "black";
        item.opacity = 0.2;
    },
};

function saveChanges(data) {
    chrome.storage.sync.clear()

    if (!data) {
        console.log('Error: No value specified');
        data = "texzt";
        return;
    }

    chrome.storage.sync.set({'value': JSON.stringify(data)}, function() {
        console.log('Settings saved');
    });
}

//chrome.storage.sync.get(null, function(items) {
//    console.log(items);
//});

(function () {
    var page = {
        name: location.pathname,
        url: document.URL,
        title: document.title,
        type : IPage,
        elements: getPageElements()
    };
    process(page);
    openResultsWindow(page, filesArray);

    saveChanges(page);

}());

function getPageElements() {
    var allElements = getElementsArray(document, "[" + jdi_type + "]");
    var resElArr = [];
    var children = [];

    $.each(allElements, function (index, value) {
        if (isMark) {
            Utils.mark(value);
        }
        resElArr.push(getElementData(value))
    });

    children = removeAllChildren(resElArr);
    proc(resElArr, children);
    return resElArr;
}

function proc(prn, cld) {
    for (var i = 0; i < cld.length; i++) {
        for (var j = 0; j < prn.length; j++) {
            if (prn[j].elements !== undefined)
                if (prn[j].elements.length > 0) {
                    proc(prn[j].elements, cld);
                }
            j = (prn[j] === undefined) ? 0 : j;
            i = (cld[i] === undefined) ? 0 : i;
            if (prn[j].name === cld[i].parent) {
                // console.log(prn[j].name + " contains " + cld[i].name);
                prn[j].elements.push(cld.splice(i, 1)[0]);
                i = j = -1;
                break;
            }
        }
    }
}

function removeAllChildren(arr) {
    var res = [];
    for (var n = 0; n < arr.length;) {
        if (arr[n].parent !== undefined) res.push(arr.splice(n, 1)[0]);
        else n++;
    }
    return res;
}


function getElementData(tmpElem) {
    return temp = {
        type: tmpElem.getAttribute(jdi_type),
        name: tmpElem.getAttribute(jdi_name),
        parent: (tmpElem.hasAttribute(jdi_parent)) ? tmpElem.getAttribute(jdi_parent) : undefined,
        gen : (tmpElem.hasAttribute(jdi_gen)) ? tmpElem.getAttribute(jdi_gen) : undefined,
        elements: [],
        // locator : "[" + jdi_name + "='" + tmpElem.getAttribute(jdi_name) + "']",
        toJSON: function () {
            return {
                name: this.name,
                type: this.type,
                //parent: this.parent,
                gen : this.gen,
                elements: (this.elements !== undefined) ? ((this.elements.length > 0) ? this.elements : undefined) : undefined
            }
        }
    }
}

function getElementsArray(tmpContainer, findRule) {
    return Array.prototype.slice.call(tmpContainer.querySelectorAll(findRule));
}

// NEW
function getDataFromElements(elements) {
    var res = ""
    $.each(elements, function (index, value) {
        try {
            res += modelGenField[value.type](value);
        } catch (e) {
            console.log("qwe")
        }
    });
    return res;
}

function genGenClassForm(elements) {
    var res = ""
    $.each(elements, function (index, value) {
        switch (value.type) {
            default :
                res += "{0} {1};\t\\*for {2}*\\\n".format("Object", value.name, value.type);
                break
        }
    });
    return res;
}

function process(data) {
    modelComposite[data.type](data);
}
// NEW