var jdi_type = "jdi-type";
var jdi_name = "jdi-name";
var jdi_parent = "jdi-parent";

var Utils = {
	randColor : function(){ return "#"+((1<<24)*Math.random()|0).toString(16); },
	mark : function(item) {
		item.style.backgroundColor = this.randColor();
		item.style.outline = "2px solid red";
		item.color = "black";
		item.opacity = 0.2;
	},
};

(function (){
	var page = {
        name     : location.pathname,
        url      : document.URL,
        title    : document.title,
        elements : getPageElements()
    }
	openResultsWindow(page);
}())

function getPageElements(){
	var allElements = getElementsArray(document, "["+ jdi_type +"]");
	var resElArr = new Array;
	var children = new Array;

	$.each(allElements, function(index, value) {
		Utils.mark(value);
		resElArr.push(getElementData(value))
	});

    children = removeAllChildren(resElArr);
 	proc(resElArr, children);
    return resElArr;
}

function proc(prn, cld){
	for (var i = 0; i < cld.length; i++) {
		for (var j = 0; j < prn.length; j++) {
			if (prn[j].elements !== undefined)
				if (prn[j].elements.length > 0){
					proc(prn[j].elements, cld);
				}
			j = (prn[j] === undefined) ? 0 : j;
			i = (cld[i] === undefined) ? 0 : i;
			if (prn[j].name === cld[i].parent) {
				// console.log(prn[j].name + " contains " + cld[i].name);
				prn[j].elements.push(cld.splice(i, 1)[0]);
				i = j = -1;
				break;		
			}
		}
	}
}

function removeAllChildren(arr){
	var res = new Array;
   for (var n = 0; n < arr.length; ) {
		if (arr[n].parent !== undefined) {
			res.push(arr.splice(n, 1)[0]);			
		} else {
			n++;
		}
	}
	return res;
}


function getElementData(tmpElem){
	return temp = {
		type : tmpElem.getAttribute(jdi_type),
		name : tmpElem.getAttribute(jdi_name),
		parent : (tmpElem.hasAttribute(jdi_parent)) ? tmpElem.getAttribute(jdi_parent) : undefined,
		elements : new Array,
		// locator : "[" + jdi_name + "='" + tmpElem.getAttribute(jdi_name) + "']",
		toJSON : function () {
			return {
				name : this.name,
				type : this.type,
				elements : (this.elements !== undefined) ? ((this.elements.length > 0) ? this.elements : undefined) : undefined
			}
		}
	}
}

function getElementsArray(tmpContainer, findRule){
	return Array.prototype.slice.call(tmpContainer.querySelectorAll(findRule));
}