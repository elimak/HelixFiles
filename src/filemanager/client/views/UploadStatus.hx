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
	private var _currentQueueUIs 	:  Hash<FileUploadStatus>;
	
	public function new (rootElement:HtmlDom, SLPId:String) {
		
		Locator.registerSLDisplay(SLPId, this, "UploadStatus");
		
		rootElement.className = "uploadStatus smallFont";
		_currentQueueUIs = new Hash<FileUploadStatus>();
	
		super(rootElement, SLPId);	
	}

// ----------------------------------- // 
// HANDLES ALL UPDATE of the UPLOADS
// ----------------------------------- //
/**
 * When a queue of files is uploaded, the updates for each files can be "started, progress, complete, error"
 * all updates are handled here and routed to their specific uis in order to be visually monitored.
 * @param	uploadUpdate
 */

	public function onUpdate( uploadUpdate : FileToUpload ): Void
	{
		if ( !_currentQueueUIs.exists(uploadUpdate.file.name)) {
			var fileUploadStatus : FileUploadStatus = new FileUploadStatus(uploadUpdate, SLPlayerInstanceId);
			_currentQueueUIs.set(uploadUpdate.file.name, fileUploadStatus);
			rootElement.appendChild(fileUploadStatus.rootElement);
		}
		var fileName : String = cast uploadUpdate.file.name;
		_currentQueueUIs.get(fileName).update (uploadUpdate);
	}
}