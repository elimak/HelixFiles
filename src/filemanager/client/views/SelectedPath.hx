package filemanager.client.views;
import filemanager.client.models.FilesModel;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import haxe.Log;
import js.Dom;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class SelectedPath extends View {

	private var _filesModel	 : FilesModel;
	
	public function new(rootElement:HtmlDom, SLPId:String) {
		Locator.registerSLDisplay(SLPId, this, "SelectedPath");
		super(rootElement, SLPId);	
	}
	
	public function injectAppModel( filesModel:FilesModel) {
		_filesModel = filesModel;
		_filesModel.appDispatcher.addEventListener( FilesModel.PATH_UPDTATE, handleSelectedPathUpdated, false);
	}
	
	private function handleSelectedPathUpdated(e:Event):Void {
		rootElement.innerHTML = ( _filesModel.selectedFile != null )? _filesModel.selectedFile.path : _filesModel.selectedFolder;
	}
}