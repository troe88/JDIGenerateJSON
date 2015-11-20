/**
 * Created by Dmitry_Lebedev1 on 19/11/2015.
 */

Document.prototype.querySelectorAllArray = function (selector) {
    return Array.prototype.slice.call(this.querySelectorAll(selector));
}

Element.prototype.getCAttribute = function (name) {
    return this.hasAttribute(name) ? this.getAttribute(name) : undefined;
}

$.prototype.getCAttribute = function (name) {
    return this.attr(name);
}

var structElement = function (typeOrRawElement, nameOrSpec, parent, gen, locator, elements) {
    if (arguments.length === 2) {
        this.type = typeOrRawElement.getCAttribute(nameOrSpec.jdi_type);
        this.name = typeOrRawElement.getCAttribute(nameOrSpec.jdi_name);
        this.parent = typeOrRawElement.getCAttribute(nameOrSpec.jdi_parent);
        this.gen = typeOrRawElement.getCAttribute(nameOrSpec.jdi_gen);
        this.locator = "[{0}={1}]".format(nameOrSpec.jdi_name, typeOrRawElement.getCAttribute(nameOrSpec.jdi_name));
        this.elements = []
    } else if (arguments.length === 6) {
        this.type = typeOrRawElement;
        this.name = nameOrSpec;
        this.parent = parent;
        this.gen = gen;
        this.locator = locator;
        this.elements = elements;
    } else {
        throw "Wrong input arguments({0}), must be 2 or 6".format(arguments.length);
    }
    this.toJSON = function () {
        return {
            type: this.type,
            name: this.name,
            //parent:this.parent,
            gen: this.gen,
            locator: this.locator,
            elements: this.elements.length === 0 ? undefined : this
                .elements,
        }
    }
}

var structPage = function (packageName) {
    this.name = location.pathname;
    this.url = document.URL;
    this.type = "IPage";
    this.packageName = packageName;
    this.elements = [];
    this.title = document.title;
    this.toJSON = function () {
        return {
            name: this.name,
            url: this.url,
            type: this.type,
            packageName: this.packageName,
            elements: this.elements,
            title: this.title,
        }
    }
}

var jsonPageGenerator = function (attrSpec, options, container) {
    var _container = container instanceof $ ? container.get(0) : container;
    var _attrSpec = attrSpec;
    var _page = undefined;
    var _options = options;

    this.getJDIElements = function () {
        return _container.querySelectorAllArray("[" + _attrSpec.jdi_type + "]");
    }

    this.rawElement2Json = function (rawElement) {
        return new structElement(rawElement, _attrSpec);
    };

    this.filterParent = function (element) {
        if (element.parent !== undefined)
            return element;
    }

    this.filterRoot = function (element) {
        if (element.parent === undefined)
            return element;
    }

    this.process = function (prn, cld) {
        for (var i = 0; i < cld.length; i++) {
            for (var j = 0; j < prn.length; j++) {
                if (prn[j].elements !== undefined)
                    if (prn[j].elements.length > 0) {
                        this.process(prn[j].elements, cld);
                    }
                j = (prn[j] === undefined) ? 0 : j;
                i = (cld[i] === undefined) ? 0 : i;
                if (prn[j].name === cld[i].parent) {
                    prn[j].elements.push(cld.splice(i, 1)[0]);
                    i = j = -1;
                    break;
                }
            }
        }
    }

    this.processPageElements = function (array) {
        try {
            var rawElements = array;
            var allElements = jQuery.map(rawElements, this.rawElement2Json);
            var rootElements = jQuery.map(allElements, this.filterRoot);
            var childElements = jQuery.map(allElements, this.filterParent);
            this.process(rootElements, childElements);
            return rootElements;
        } catch (e){
            console.log(e);
        }
    };

    this.translatePage2Struct = function () {
        var elements = this.getJDIElements();
        _page = new structPage(_options.packageName);
        _page.elements = this.processPageElements(elements);
    };

    this.getPageStruct = function () {
        if (_page === undefined)
            this.translatePage2Struct();
        return _page;
    };

    this.getJSON = function (replacer, space) {
        if (_page === undefined) {
            this.translatePage2Struct();
        }
        return JSON.stringify(_page, replacer, space);
    };
};

//$(document).ready(function () {
//
//    // Defined jdi-attribute specification
//    var spec = {
//        jdi_type: "jdi-type",
//        jdi_name: "jdi-name",
//        jdi_parent: "jdi-parent",
//        jdi_gen: "jdi-gen",
//    };
//
//    // Defined JSON options
//    var opt = {
//        packageName: "com.my.test",
//    }
//
//    // Init json generator
//    var jsonGen = new jsonPageGenerator(spec, opt, document);
//    // Get Object
//    console.log(jsonGen.getPageStruct());
//    // Get JSON string
//    console.log(jsonGen.getJSON(undefined, 2));
//
//    // Generate new element by raw element
//    console.log(new structElement($("[id=login]"), spec));
//});