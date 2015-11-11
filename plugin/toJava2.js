/**
 * Created by Dmitry_Lebedev1 on 9/11/2015.
 */
var result = new Array;

var Templates = {
    javaPage: function (package, imports, clazz) {
        return "package {0}\n\n{1}\n{2}\n".format(package, imports, clazz)
    },
    imports: function (package) {
        return "import {0};\n".format(package);
    },
    javaClass: function (name, elements) {
        return "public class {0}  {\n{1}\n}".format(name, elements);
    },
    javaClassExtends: function (name, extendz, elements) {
        return "public class {0} extends {1} {\n{2}\n}".format(name, extendz, elements);
    },
    classField: function (elem) {
        var name = elem.name;
        var type = elem.type;
        try {
            return FieldTemplates[type](elem);
        } catch (e) {
            console.log(e + "\n" + "type: " + type + " name: " + name)
            return FieldTemplates.unknown.format(type, name);
        }
    }
}

var moduleSimple = function (elem) {
    return Templates.classField(elem);
}

var ElemTemplates = {
    ITextArea: moduleSimple,
    IButton: moduleSimple,
    IForm: function (data) {
        filesTemplate.IForm(data);
        return moduleSimple(data);
    },
    IPagination: function (data) {
        return new Pagination(data).print();
    },
    ITimePicker: moduleSimple,
    IDatePicker: moduleSimple,
    IPage: undefined,
    IElement: moduleSimple,
    ITextField: moduleSimple,
    RFileInput: moduleSimple,
    IRange: moduleSimple,
}

var JavaClass = function (src) {
    this.name = src.name;
    this.extendz = src.type;
    this.includes = new Array;
    this.package = "my.package;";
    this.elements = src.elements;


    this.genName = function (name) {
        return src.title === undefined ? src.name : src.title;
    };
    this.genIncludes = function () {
        var inc = new Array;
        $.each(this.elements, function (i, val) {
            var temp = IncludesDictionary[val.type];
            if (inc.indexOf(temp) < 0) {
                inc.push(temp);
            }
        });
        this.includes = inc;
    };
    this.getIncludes = function () {
        this.genIncludes();
        var total = "";
        $.each(this.includes, function (i, val) {
            total += Templates.imports(val);
        });
        return total;
    };
    this.getElements = function () {
        var total = "";
        $.each(this.elements, function (i, val) {
            total += ElemTemplates[val.type](val);
        });
        return total;
    };
    this.genClass = function () {
        return (this.extendz === null) ? Templates.javaClass(this.name, this.getElements()) : Templates.javaClassExtends(this.name, this.extendz, this.getElements());
    };
    this.print = function () {
        return Templates.javaPage(this.package, this.getIncludes(), this.genClass());
    };

    this.name = this.genName(src.name);
};

var createRecord = function(data){
    return {
        name : data.name,
        data : data.print()
    }
}

var filesTemplate = {
    IForm: function (data) {
        var data = new JavaClass(data);
        result.push(createRecord(data));
    },
    IPage: function (data) {
        var data = new JavaClass(data);
        result.push(createRecord(data));
    }
};

var processJSON = function (data) {
    filesTemplate[data.type](data);
}

function translateToJava2(data) {
    result = new Array;
    processJSON(data);
    return result;
}
