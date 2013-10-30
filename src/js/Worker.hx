package js;

/**
 * Mapping Native Worker class
 * Used into the filemanager.client.models.FilesModel.as when the user upload files. (multithreading)
 */


@:native("Worker")
extern class Worker {
	var onmessage 	: Dynamic->Void;
	var onerror 	: Dynamic->Void;
	function new( scriptURL : String ) : Void;
	function terminate() : Void;
	function postMessage( message : Dynamic, ?ports : Array<Dynamic> ) : Void;
}