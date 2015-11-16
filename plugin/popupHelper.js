/**
 * Created by Dmitry_Lebedev1 on 16/11/2015.
 */

var containerList = function () {
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
    this.on = function (name, container) {
        var local = container === undefined ? this : container;

        if (local.active !== undefined)
            if (local.active.name === name)
                return;

        console.log(name);
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
    }
}

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