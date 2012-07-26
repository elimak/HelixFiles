package filemanager.client.views;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import haxe.Log;
import js.Dom;
import js.Lib;
/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FileDropper extends View
{
	
	public var onFileDropped : Array<Dynamic>->Void;

	public function new (rootElement:HtmlDom, SLPId:String) {
		
		Locator.registerSLDisplay(SLPId, this, "FileDropper");
		
		// TODO: use the css
		rootElement.style.width = "500px";
		rootElement.style.height = "100px";
		rootElement.style.backgroundColor = "#335577";
		
		rootElement.addEventListener('dragover', handleDragOver, false);
		rootElement.addEventListener('drop', handleFileSelect, false);
		
		super(rootElement, SLPId);	
	}
	
	private function handleDragOver(evt: Dynamic) {
		
		untyped evt.stopPropagation();
		untyped evt.preventDefault();
		untyped evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	}
	
	private function handleFileSelect(evt: Dynamic) {
		
		untyped evt.stopPropagation();
		untyped evt.preventDefault(); 
		
		if ( onFileDropped != null ) {
			onFileDropped( untyped evt.dataTransfer.files );
			evt.dataTransfer.files = null;
		}
		
	}
}