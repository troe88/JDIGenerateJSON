var filesArray = [];

function removeSpaces(str) {
    return str.replace(/\s+/g, '_');
}

var templates = {
    ITextArea: "",
    IButton: "",
    IForm: "\nclass {0} extends IForm<{2}> {\n{1}}",
    IPage: "\nclass {0} extends IPage {\n{1}}",
    IElement: "",
    ITextField: "",
    simpleClass: "\nclass {0} {\n{1}\n}",
    cfw: "\t@FindBy(css = \"[jdi-name={1}]\")\n\tpublic {0} {1};\n\n",
    cf: "\t{0} {1};\n",
};

var genFieldFormClass = {
    ITextArea: function (data) {
        return templates.cf.format("String", data.name)
    },
    IButton: "",
    IForm: "",
    IPage: "",
    IElement: "",
    ITextField: function (data) {
        return templates.cf.format("String", data.name)
    },
}

var moduleSimple = function (data) {
    return templates.cfw.format(data.type, data.name);
}

var modelGenField = {
    ITextArea: moduleSimple,
    IButton: moduleSimple,
    IForm: function (data) {
        process(data);
        return templates.cfw.format(data.name, "form");
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
        filesArray.push(templates[data.type].format(removeSpaces(data.title), getDataFromElements(data.elements)));
    }
};

function getDataFromElements(elements) {
    var res = ""
    $.each(elements, function (index, value) {
        try {
            res += modelGenField[value.type](value);
        } catch (e) {
            console.log(e)
        }
    });
    return res;
}

function genGenClassForm(elements) {
    var res = ""
    $.each(elements, function (index, value) {
        try {
            res += genFieldFormClass[value.type](value);
        } catch (e) {
            console.log(e)
        }
    });
    console.log(res)
    return res;
}

function process(data) {
    modelComposite[data.type](data);
}