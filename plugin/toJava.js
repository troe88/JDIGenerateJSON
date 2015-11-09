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
    IPagination: "public Pagination {0} = new Pagination({1});\n",
    cfw: "\t@FindBy(css = \"[jdi-name={1}]\")\n\tpublic {0} {1};\n\n",
    cf: "\t{0} {1};\n",
    fbcss: "\n\t{0},\n\t{1},\n\t{2},\n\t{3},\n\t{4}",
    css: "By.cssSelector(\"[jdi-name={0}]\")"
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
    IPagination: function (data) {
        var elems = [];
        var get = function (key) {
            return (elems[key] === undefined) ? "null" : templates.css.format(elems[key].name)
        };
        $.each(data.elements, function (index, value) {
            elems[value.name] = value;
        });
        return templates.IPagination.format(data.name, templates.fbcss.format(
            get('template'), get('next'), get('prev'), get('first'), get('last')
        ));
    },
    ITimePicker: moduleSimple,
    IDatePicker: moduleSimple,
    IPage: undefined,
    IElement: moduleSimple,
    ITextField: moduleSimple,
    RFileInput : moduleSimple,
    IRange : moduleSimple,
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

function translateToJava(data) {
    filesArray = new Array;
    modelComposite[data.type](data);
    return filesArray;
}