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

class FilesView extends View {
	
	private var _filesModel	: FilesModel;
	private var _fileUIS	: Array<FileUI>;
	
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
		_fileUIS = new Array<FileUI>();
		// and recreate the list 
		for (i in 0...data.length) {
			var file : FileUI = new FileUI(data[i], SLPlayerInstanceId);
			_fileUIS.push(file);
			rootElement.appendChild(file.rootElement);
			var draggedCallBack = callback(handleFileDragged, data[i], file);
			file.rootElement.addEventListener("dragEventDrag", draggedCallBack, false);
		}
	}
	
	private function handleFileDragged( fileData: FileVO, fileUi:FileUI, evt: Event ) : Void {
		for ( fileUI in _fileUIS) {
			fileUI.setSelected(false);
		}
		fileUi.setSelected(true);
		_filesModel.setDraggedFile(fileData);
	}
	
	public function injectAppModel( filesModel:FilesModel) {
		_filesModel = filesModel;
	}
} 