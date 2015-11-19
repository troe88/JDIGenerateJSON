/**
 * Created by Dmitry_Lebedev1 on 18/11/2015.
 */
var Log = function (elem) {
    this.elem = elem;
    this.msg = function (data) {
        var contains = this.elem.val().length > 0 ? this.elem.val() + "\n" : "";
        this.elem.val(contains + data);
    };
    this.clear = function () {
        this.elem.val("");
    };
};