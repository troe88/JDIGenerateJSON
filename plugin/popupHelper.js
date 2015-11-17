/**
 * Created by Dmitry_Lebedev1 on 16/11/2015.
 */

var containerList = function (mainContainer) {
    this.javaArray = undefined;
    this.mainContainer = mainContainer;
    this.elems = [];
    this.active = undefined;
    this.add = function (element) {
        var _on = this.on;
        var _this = this;
        element.tab.on("click", function () {
            _on(element.name, _this);
        });
        this.elems.push(element);
    }
    this.vanish = function () {
        this.mainContainer.css("display", "none");
    };
    this.emerge = function () {
        this.mainContainer.css("display", "block");
    };
    this.on = function (name, container) {
        var local = container === undefined ? this : container;

        if (local.active !== undefined)
            if (local.active.name === name)
                return;
        var localElems = local.elems;
        var active;
        $.each(localElems, function (i, val) {
            if (val.name === name) {
                active = val;
            } else {
                val.off();
            }
        });
        local.active = active;
        local.active.on();
    };
    this.paintJava = function(java){
        var data = translateToJava2($.parseJSON(java))
        this.javaArray = data;
        $.each(this.elems, function (i, val) {
            if (val.name === "java") {
                val.container.children().text(getJavaStr(data));
                val.container.each(function (i, block) {
                    hljs.highlightBlock(block);
                });
            }
        });
    };
    this.paintJSON = function(json){
        var data = $.parseJSON(json)
        console.log("paint JSON")
        $.each(this.elems, function (i, val) {
            if (val.name === "json") {
                val.container.children().jsonViewer(data);
            }
        });
    };
}

getJavaStr = function(data){
    var str = "";
    $.each(data, function (i, val) {
        str += "//{0}\n{1}//!{2}\n\n".format(val.name.toUpperCase(), val.data, val.name.toUpperCase());
    });
    return str;
};

function getCBStatus(id) {
    return $(id).is(':checked');
}

var dataTabContainer = function (name, tab, container) {
    this.name = name;
    this.active = undefined;
    this.tab = tab;
    this.container = container;
    this.on = function () {
        this.active = true;
        this.tab.addClass("active");
        this.container.css("display", "block");
    };
    this.off = function () {
        this.active = false;
        this.tab.removeClass("active");
        this.container.css("display", "none");
    };
}