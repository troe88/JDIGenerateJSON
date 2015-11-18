/**
 * Created by Dmitry_Lebedev1 on 18/11/2015.
 */
var Log = function (elem) {
    this.elem = elem;
    this.msg = function (data) {
        var contains = this.elem.val().length > 0 ? "\n" + this.elem.val() : "";
        this.elem.val(data + contains);
    };
    this.clear = function () {
        this.elem.val("");
    };
};