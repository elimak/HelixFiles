package filemanager.client.views;
import filemanager.client.models.Locator;
import filemanager.client.models.FilesModel;
import filemanager.client.views.base.View;
import filemanager.client.views.uis.FileUploadStatus;
import haxe.Log;
import js.Dom;
import js.Lib;
/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class UploadStatus extends View
{

	private var _currentQueue :  Hash<FileToUpload>;
	
	public function new (rootElement:HtmlDom, SLPId:String) {
		
		Locator.registerSLDisplay(SLPId, this, "UploadStatus");
		
		rootElement.className = "uploadStatus smallFont";
		_currentQueue = new Hash<FileToUpload>();
	
		super(rootElement, SLPId);	
	}
	
	public function onUpdate( uploadUpdate : FileToUpload ): Void
	{
		if ( _currentQueue.exists(uploadUpdate.file.name)) {
			updateStatus(uploadUpdate);
		}
		else {
			_currentQueue.set(uploadUpdate.file.name, uploadUpdate);
			var fileUploadStatus : FileUploadStatus = new FileUploadStatus(uploadUpdate, SLPlayerInstanceId);
			rootElement.appendChild(fileUploadStatus.rootElement);
		}
	}
	
	private function updateStatus(uploadUpdate:FileToUpload) 
	{
		Log.trace("UploadStatus - updateStatus() -  update view of "+uploadUpdate.file.name);
	}
}