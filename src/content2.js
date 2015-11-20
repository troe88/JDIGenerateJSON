/**
 * Created by Dmitry_Lebedev1 on 19/11/2015.
 */

Document.prototype.querySelectorAllArray = function (selector) {
    return Array.prototype.slice.call(this.querySelectorAll(selector));
}

var jsonGenerator = function (options, container) {
    var _container = container;
    var _options = options;

    this.getJDIElements = function () {
        return _container.querySelectorAllArray(_options.jdi_type);
    }

    this.getJSON = function () {
        console.log("qwe")
    };
};


(function () {
    var myOptions = {
        jdi_type: "jdi-type",
        jdi_name: "jdi-name",
        jdi_parent: "jdi-parent",
        jdi_gen: "jdi-gen"
    }

    var jsonGen = new jsonGenerator(myOptions, document);
    jsonGen.getJSON();
}());