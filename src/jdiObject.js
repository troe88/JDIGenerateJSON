/**
 * Created by Dmitry_Lebedev1 on 20/11/2015.
 */

function jdiObject(name, type, gen, elements, locator) {
    return {
        name: name,
        type: type,
        gen: gen,
        elements: elements,
        locator: locator
    };
}

var jdiTags = {
    jdi_type: "jdi-type",
    jdi_name: "jdi-name",
    jdi_parent: "jdi-parent",
    jdi_get: "jdi-gen"
}