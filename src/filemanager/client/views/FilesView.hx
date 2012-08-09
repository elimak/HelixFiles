package filemanager.client.views;
import filemanager.client.models.FilesModel;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import filemanager.client.views.uis.FileUI;
import filemanager.cross.FileVO;
import filemanager.cross.FolderVO;
import haxe.Log;
import js.Dom;
import js.Lib;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FilesView extends View
{

	//public static inline var DRAGGING_FILE : String = "startedToDragFile";
	//public var currentDraggedFile	: FileVO;
	private var _filesModel			: FilesModel;
	
	public function new(rootElement:HtmlDom, SLPId:String) {
		Locator.registerSLDisplay(SLPId, this, "FilesView");
		super(rootElement, SLPId);
	}
	
/**
 * Show a list of files contained into the current selected folder.
 * @param	data
 */
	public function setList( data: Array<FileVO>) {
		clear(); // remove all children
		// and recreate the list 
		for (i in 0...data.length) {
			var file : FileUI = new FileUI(data[i], SLPlayerInstanceId);
			rootElement.appendChild(file.rootElement);
			var draggedCallBack = callback(handleFileDragged, data[i]);
			file.rootElement.addEventListener("dragEventDrag", draggedCallBack, false);
		}
	}
	
	private function handleFileDragged( file: FileVO, evt: Event ) : Void {
		/*currentDraggedFile = file;
		var event : CustomEvent = cast Lib.document.createEvent("CustomEvent");
		event.initCustomEvent(DRAGGING_FILE, false, false, rootElement);
		rootElement.dispatchEvent(event);*/
		Log.trace("FilesView - handleFileDragged() "+file);
		Log.trace("FilesView - handleFileDragged() "+_filesModel);
		_filesModel.setDraggedFile(file);
	}
	
	public function injectAppModel( filesModel:FilesModel) {
		_filesModel = filesModel;
	}
} 