// https://developer.mozilla.org/en-US/docs/Web/API/window.getSelection
// http://stackoverflow.com/questions/3597116/insert-html-after-a-selection

var current_selection = "";

function dogeared_document_init(){
    console.log("document init");
}

function dogeared_document_init_doc(id){
    console.log("document init (doc) " + id);

    dogeared_document_init_highlight_controls();

    window.onscroll = dogeared_document_on_scroll;

    var pos = dogeared_whosonfirst_get(id);

    if (pos){
	window.scrollTo(0, pos);
    }

}

function dogeared_document_on_scroll(e){

    var doc = $("#document");
    var id = doc.attr("data-document-id");

    if (! id){
	return;
    }

    var pos = window.scrollY;
    dogeared_whosonfirst_set(id, pos);
}

function dogeared_document_init_highlight_controls(){

    if (typeof(window.ontouchend) == 'object'){
	console.log("init touch based highlight controls");
	$(document).bind('selectionchange', dogeared_document_selected_selectionchange);
    }

    else {
	console.log("init mouse based highlight controls");
	$(document).bind('mouseup', dogeared_document_selected_mouseup);
    }	

}

function dogeared_document_selected_mouseup(e){
    console.log("document: on mouseup");

    var target = e.target;

    if (target.nodeName == 'BUTTON'){

	var el = $(target);

	if (el.attr("data-button-action") == "delete"){
	    console.log("mouse up: ignore delete button");
	    return;
	}
    
	dogeared_document_add_highlight();
	return;
    }

    $(".highlight").remove();

    var sel = window.getSelection();
    var txt = sel.toString();

    if (txt == ""){
	return;
    }

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

    $(".highlight").remove();

    var sel = window.getSelection();
    var txt = sel.toString();

    if (txt == ""){
	return;
    }

    /*
    if (txt == current_selection){
	console.log("selection is same same");
	return;
    }
    */

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

// move this in to dogeared.highlights.js ? 

function dogeared_document_add_highlight(){

    var doc = $("#document");
    var id = doc.attr("data-document-id");

    if (! id){
	dogeared_feedback_error("Unable to determine what document I am looking at!");
	return false;
    }

    var s = window.getSelection();
    var t = (current_selection) ? current_selection : s.toString();

    var method = 'dogeared.highlights.addHighlight';

    var args = {
	'document_id': id,
	'text': t
    };

    if (! dogeared_network_is_online()){

	if (dogeared_cache_highlights_store(args)){
	    dogeared_feedback_modal("Your highlight has been cached.");
	    dogeared_cache_highlights_status();
	}

	return;
    }
    
    var on_success = function(rsp){

	if (rsp['stat'] != 'ok'){
	    dogeared_feedback_api_error(rsp);
	    return;
	}

	dogeared_feedback_modal('Your highlight has been added.');	
    };

    var on_error = function(){
	dogeared_feedback();
    };
    
    dogeared_api_call(method, args, on_success);
}
