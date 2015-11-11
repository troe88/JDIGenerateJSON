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
    String: moduleSimple,
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

var filesTemplate = {
    IForm: function (data) {
        data.name = data.name.capitalizeFirstLetter();
        var genClass = JSON.parse(JSON.stringify(data));
        genClass.name = data.gen;
        genClass.type = undefined;
        genClass.extendz = undefined;
        $.each(genClass.elements, function (i, val) {
            if (ConvertToJavaType[val.type] !== undefined) {
                val.type = ConvertToJavaType[val.type];
            } else {
                val.type += " ";
            }
        });
        result.push(createRecord(new JavaClass(genClass)));
        //
        data.extendz = "{0}<{1}>".format(data.type, data.gen);
        data.type = data.name;
        FieldTemplates[data.type] = function (elem) {
            return "\n\tpublic {0} {1};\n".format(elem.type, elem.name.downFirstLetter());
        };
        //IncludesDictionary[data.type] = "my.package.{0}".format(data.type);
        result.push(createRecord(new JavaClass(data)));
    },
    IPage: function (data) {
        data.extendz = "IPage";
        result.push(createRecord(new JavaClass(data)));
    }
};

var JavaClass = function (src) {
    this.name = src.name;
    this.extendz = src.extendz;
    this.includes = new Array;
    this.package = "my.package;";
    this.elements = src.elements;

    this.genName = function (name) {
        return src.title === undefined ? src.name : src.title;
    };
    this.genIncludes = function () {
        var inc = new Array;
        $.each(this.elements, function (i, val) {
            var temp = (IncludesDictionary[val.type] !== undefined) ? IncludesDictionary[val.type] : "";
            if (inc.indexOf(temp) < 0) {
                inc.push(temp);
            }
        });
        this.includes = inc;
    };
    this.getIncludes = function () {
        var total = "";
        $.each(this.includes, function (i, val) {
            total += val.length > 0 ? Templates.imports(val) : "";
        });
        return total;
    };
    this.getElements = function () {
        var total = "";
        $.each(this.elements, function (i, val) {
            try {
                total += ElemTemplates[val.type](val);
            } catch (e) {
                total += "\t/*{0} {1}*/\n".format(val.type, val.name);
            }
        });
        return total;
    };
    this.genClass = function () {
        var elements = this.getElements();
        this.genIncludes();
        return (this.extendz === null || this.extendz === undefined) ? Templates.javaClass(this.name, elements) : Templates.javaClassExtends(this.name, this.extendz, elements);
    };
    this.print = function () {
        var clazz = this.genClass();
        return Templates.javaPage(this.package, this.getIncludes(), clazz);
    };

    this.name = this.genName(src.name);
};

var processJSON = function (data) {
    filesTemplate[data.type](data);
}

function translateToJava2(data) {
    result = new Array;
    processJSON(data);
    return result;
}
