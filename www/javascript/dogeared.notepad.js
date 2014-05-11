var notepad_interval = null;
var notepad_pending_sync = new Array();

function dogeared_notepad_init(){

    window.addEventListener("online", dogeared_notepad_on_online);

    dogeared_notepad_build_list();	 
}

function dogeared_notepad_on_online(){

    if (notepad_pending_sync.length){
	dogeared_notepad_sync_notes(notepad_pending_sync);
    }
}

function dogeared_notepad_add_note(){

    var id = Math.uuid();
    var now = dogeared_now();
    
    var note = {
	'id': id,
	'created': now,
	'lastmodified': 0,
	'deleted': 0,
	'title': 'Untitled Note #' + id,
	'body': 'This note left intentionally blank.'
    };

    var key = dogeared_notepad_key(note);    

    store.set(key, note);
    dogeared_notepad_load_note(key);
}

function dogeared_notepad_load_note(key){

    var note = store.get(key);
    
    var list = $("#notes-list");
    var editor = $("#note-editor");
    var close = $("#note-editor-close");
    var del = $("#note-editor-delete");
    
    editor.attr("data-note-id", key);
    
    var title = $("#note-title");
    title.html(note['title']);
    
    var body = $("#note-body");
    body.html(note['body']);
    
    close.click(function(){
	dogeared_notepad_close_note();
	return false;
    });

    del.click(function(){

	if (! confirm("Are you sure you want to delete this note?")){
	    return false;
	}

	dogeared_notepad_delete_note();

	dogeared_notepad_build_list();
	return false;
    });
    
    list.hide();
    editor.show();
    
    notepad_interval = setInterval(function(){
	dogeared_notepad_save_note();
    }, 5000);
    
    // console.log("set interval " + notepad_interval);
}

function dogeared_notepad_save_note(){
    
    note = dogeared_notepad_get_current_note();

    if (! note){
	return;
    }

    var key = dogeared_notepad_key(note);
    var update = false;

    var title = $("#note-title");
    title = title.html();
    
    var body = $("#note-body");
    body = body.html();
    
    if (note['title'] != title){
	note['title'] = title;
	update = true;
    }

    if (note['body'] != body){
	note['body'] = body;
	update = true;
    }

    if (! update){
	return;
    }

    var now = dogeared_now();
    note['lastmodified' ] = now;

    console.log("update " + key);
    store.set(key, note);

    dogeared_notepad_sync_note(note);
}

function dogeared_notepad_delete_note(){

    note = dogeared_notepad_get_current_note();

    if (! note){
	return;
    }

    clearInterval(notepad_interval);

    var key = dogeared_notepad_key(note);
    var now = dogeared_now();

    note['title'] = '[redacted]';
    note['body'] = '';
    note['deleted' ] = now;
    note['lastmodified' ] = now;

    console.log("delete " + key);
    store.set(key, note);

    dogeared_feedback_modal("This note has been deleted");

    dogeared_notepad_sync_note(note);
}

function dogeared_notepad_close_note(){

    if (notepad_interval){
	clearInterval(notepad_interval);
    }
    
    dogeared_notepad_save_note();
    
    var editor = $("#note-editor");
    editor.hide();
    
    dogeared_notepad_build_list();	 
}

function dogeared_notepad_build_list(){

    var editor = $("#note-editor");
    var list = $("#notes-list");

    var items = '';
    
    items += '<li><a href="#" id="note-add">Add a note</a></li>';
    
    store.forEach(function(key, note){
	
	var parts = key.split("_");
	var ima = parts[0];
	
	if (ima != "notepad"){
	   return;
	}

	if (note['deleted']){
	    return;
	}

	var title = note['title'];
	var created = note['created'];

	items += '<li>';
	items += '<a href="#" class="note-item" data-note-key="' + key + '">' + title + '</a> ';
	items += '<small>' + created + '</small>';
	items += '</li>';
    });

    list.html(items);

    $("#note-add").click(function(){
	dogeared_notepad_add_note();
	return false;
    });
    
    $(".note-item").click(function(){
	
	var el = $(this);
	var key = el.attr("data-note-key");

	dogeared_notepad_load_note(key);
	return false;
    });

    editor.hide();
    list.show();
}

function dogeared_notepad_sync_list(){

    var notepad = new Array();

    store.forEach(function(key, note){
	
	var parts = key.split("_");
	var ima = parts[0];
	
	if (ima != "notepad"){
	   return;
	}

	dogeared_notepad_sync_note(note);
    });
}

function dogeared_notepad_sync_pending_notes(pending){

    for (id in pending){
	var key = dogeared_notepad_key({ 'id': id });
	var note = store.get(key);
	dogeared_notepad_sync_note(note);
    }
}

function dogeared_notepad_sync_note(note){

    // still not sure how this will work
    // (20140511/straup)

    if (! dogeared_network_is_online()){
	notepad_pending_sync[note['id']] = true;
	return false;
    }

    // TO DO: check if sync is in process...

    delete(notepad_pending_sync[note['id']]);

    var method = 'dogeared.notepad.syncNote';
    var args = note;

    var on_success = function(rsp){
	console.log("sync ok");
	console.log(rsp);
    };

    var on_error = function(rsp){
	console.log("sync NOT ok");
	console.log(rsp);
    };

    dogeared_api_call(method, args, on_success, on_error);
    console.log(method);
    console.log(args);
}

function dogeared_notepad_get_current_note(){

    var editor = $("#note-editor");
    var key = editor.attr("data-note-id");
    
    if (! key){
	clearInterval(notepad_interval);
	return;
    }
    
    var note = store.get(key);

    if (! note){
	dogeared_feedback_error("Failed to load " + key + " which is weird because I am trying to save it...");
	clearInterval(notepad_interval);
	return;
    }

    return note;
}

function dogeared_notepad_key(note){
    var key = "notepad_" + note['id'];
    return key;
}
