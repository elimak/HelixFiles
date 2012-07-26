package js;

@:native("Worker")
extern class Worker {
	var onmessage 	: Dynamic->Void;
	var onerror 	: Dynamic->Void;
	function new( scriptURL : String ) : Void;
	function terminate() : Void;
	function postMessage( message : Dynamic, ?ports : Array<Dynamic> ) : Void;
}