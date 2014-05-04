// https://developer.mozilla.org/en-US/docs/Web/API/window.getSelection
// http://stackoverflow.com/questions/3597116/insert-html-after-a-selection

var current_selection = "";

function dogeared_document_init(){

    if (typeof(window.ontouchend) != 'object'){

	$(document).bind('selectionchange', dogeared_document_selected_selectionchange);
    }

    else {

	$(document).bind('mouseup', dogeared_document_selected_mouseup);
    }	
}

function dogeared_document_selected_mouseup(e){

    console.log("on mouseup");

    // console.log(e.type);
    var target = e.target;

    if (target.nodeName == 'BUTTON'){
	dogeared_document_add_highlight();
	return;
    }

    $(".highlight").remove();

    var sel = window.getSelection();

    range = window.getSelection().getRangeAt(0);
    expandedSelRange = range.cloneRange();
    range.collapse(false);

    var el = document.createElement("div");
    el.innerHTML = "<span class=\"highlight\"> <button id=\"highlight\" class=\"btn btn-sm\">Highlight</button> </span>";

    var frag = document.createDocumentFragment(), node, lastNode;

    while ((node = el.firstChild)){
        lastNode = frag.appendChild(node);
    }
    
    range.insertNode(frag);

    if (lastNode){
        expandedSelRange.setEndAfter(lastNode.previousSibling);
        sel.removeAllRanges();
        sel.addRange(expandedSelRange);
    }
}

function dogeared_document_selected_selectionchange(e){

    console.log("on selectionchange");

    // console.log(e.type);
    var target = e.target;

    $(".highlight").remove();

    var sel = window.getSelection();
    var txt = sel.toString();

    if (txt == ""){
	return;
    }

    if (txt == current_selection){
	return;
    }

    current_selection = txt;

    range = window.getSelection().getRangeAt(0);
    expandedSelRange = range.cloneRange();
    range.collapse(false);

    var el = document.createElement("div");
    el.innerHTML = "<span class=\"highlight\"> <button id=\"highlight\" class=\"btn btn-sm\">Highlight</button> </span>";

    var frag = document.createDocumentFragment(), node, lastNode;

    while ((node = el.firstChild)){
        lastNode = frag.appendChild(node);
    }
    
    range.insertNode(frag);

    $("#highlight").click(dogeared_document_add_highlight);
}

function dogeared_document_add_highlight(){

    var doc = $("#document");
    var id = doc.attr("data-document-id");

    var s = window.getSelection();
    var t = (current_selection) ? current_selection : s.toString();

    // This requires grabbing 'current_selection' in ios

    var method = 'dogeared.highlights.addHighlight';

    var args = {
	'document_id': id,
	'text': t
    };

    console.log(args);

    // TO DO: something...

    var on_success = function(rsp){
	console.log(rsp);
    };

    dogeared_api_call(method, args, on_success);
}
