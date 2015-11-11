/**
 * Created by Dmitry_Lebedev1 on 10/11/2015.
 */

var IncludesDictionary = {
    ITextArea: "com.epam.jdi.textarea",
    IButton: "com.epam.jdi.IButton",
    IForm: "com.epam.jdi.IForm",
    IPagination: "com.epam.jdi.IPagination",
    ITimePicker: "com.epam.jdi.ITimePicker",
    IDatePicker: "com.epam.jdi.IDatePicker",
    IPage: "com.epam.jdi.IPage",
    IElement: "com.epam.jdi.IElement",
    ITextField: "com.epam.jdi.ITextField",
    RFileInput: "com.epam.jdi.RFileInput",
    IRange: "com.epam.jdi.IRange"
}

function simpleFileld(elem) {
    var fby = FindByTemplates.css(elem.name);
    var field = "\tpublic {0} {1};\n".format(elem.type, elem.name);
    return fby + field;
}

var FieldTemplates = {
    unknown: "\n\t/*{0} {1}*/\n",
    ITextArea: simpleFileld,
    IButton: simpleFileld,
    IForm: simpleFileld,
    IPage: simpleFileld,
    IElement: simpleFileld,
    ITextField: simpleFileld,
    IPagination: function (elem) {
        return "\n\tpublic Pagination {0} = new Pagination({1}, {2}, {3}, {4}, {5});\n".format(
            elem.name, elem.get("template"), elem.get("next"), elem.get("prev"), elem.get("first"), elem.get("last")
        );
    }
}

var Pagination = function (element) {
    this.name = element.name;
    this.elems = new Array;

    this.get = function (key) {
        return (this.elems[key] === undefined) ? "\n\t\tnull" : FindByTemplates.byCss(this.elems[key].name)
    }
    this.print = function () {
        return FieldTemplates.IPagination(this);
    }

    var res = new Array;
    $.each(element.elements, function (index, value) {
        res[value.name] = value;
    });
    this.elems = res;
}

var FindByTemplates = {
    css: function (selector) {
        return "\n\t@FindBy(css = \"jdi-name={0}\")\n".format(selector);
    },
    byCss: function (selector) {
        return "\n\t\tBy.cssSelector(\"[jdi-name={0}]\")".format(selector);
    }
}

var createRecord = function(data){
    return {
        name : data.name,
        data : data.print()
    }
}