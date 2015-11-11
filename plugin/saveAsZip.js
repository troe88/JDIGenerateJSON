/**
 * Created by Dmitry_Lebedev1 on 10/11/2015.
 */

function saveAsZip(data, fileName){
    console.log("SAVE")
    var zip = new JSZip();
    $.each(data, function (i, val) {
        zip.file("pageObject/{0}.java".format(val.name), val.data);
    });
    var blob = zip.generate({type:"blob"});
    saveAs(blob, "{0}.zip".format(fileName));
}