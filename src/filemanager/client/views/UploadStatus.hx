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

	//private var _currentQueueData 	:  Hash<FileToUpload>;
	private var _currentQueueUIs 	:  Hash<FileUploadStatus>;
	
	public function new (rootElement:HtmlDom, SLPId:String) {
		
		Locator.registerSLDisplay(SLPId, this, "UploadStatus");
		
		rootElement.className = "uploadStatus smallFont";
		//_currentQueueData = new Hash<FileToUpload>();
		_currentQueueUIs = new Hash<FileUploadStatus>();
	
		super(rootElement, SLPId);	
	}
	
	public function onUpdate( uploadUpdate : FileToUpload ): Void
	{
		if ( _currentQueueUIs.exists(uploadUpdate.file.name)) {
			updateStatus(uploadUpdate);
		}
		else {
			//_currentQueueData.set(uploadUpdate.file.name, uploadUpdate);
			var fileUploadStatus : FileUploadStatus = new FileUploadStatus(uploadUpdate, SLPlayerInstanceId);
			_currentQueueUIs.set(uploadUpdate.file.name, fileUploadStatus);
			rootElement.appendChild(fileUploadStatus.rootElement);
			
			updateStatus(uploadUpdate);
		}
	}
	
	private function updateStatus(uploadUpdate:FileToUpload) 
	{
		var fileName : String = cast uploadUpdate.file.name;
		_currentQueueUIs.get(fileName).update (uploadUpdate);
	}
}