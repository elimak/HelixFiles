package filemanager.client.views;
import filemanager.client.models.FilesModel;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import haxe.Log;
import js.Dom;
import js.Lib;
/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FileDropper extends View {

	private var _filesModel	 : FilesModel;
	
	public function new (rootElement:HtmlDom, SLPId:String) {
		
		Locator.registerSLDisplay(SLPId, this, "FileDropper");
		rootElement.className = "fileDropper noMargin";
		
		var instruction = Lib.document.createElement("p");
		instruction.className = "dropText mediumFont";
		var txtInstruc = Lib.document.createTextNode("Drop your files here");
		rootElement.appendChild(instruction);
		instruction.appendChild(txtInstruc);
		
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
		
		_filesModel.uploadSelectedFiles( untyped evt.dataTransfer.files );
	}
	
	public function injectAppModel( filesModel:FilesModel) {
		_filesModel = filesModel;
	}
}