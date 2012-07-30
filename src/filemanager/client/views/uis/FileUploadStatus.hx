package filemanager.client.views.uis;
import filemanager.client.models.Locator;
import filemanager.client.views.base.LabelButton;
import filemanager.client.views.uis.buttons.CancelButton;
import filemanager.client.views.uis.buttons.CancelUploadButton;
import filemanager.client.views.uis.ProgressBar;
import filemanager.client.views.base.View;
import filemanager.client.models.FilesModel;
import haxe.Log;
import js.Lib;
import js.Dom;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FileUploadStatus extends View
{
	private var _progressBar 	: ProgressBar;
	private var _fileName 		: HtmlDom;
	private var _statusUpload	: HtmlDom;
	
	private var _cancel	: CancelUploadButton;
	private var _status	: String;
	
	public static inline var PENDING 	: String = "Pending";
	public static inline var PROGRESS 	: String = "Progress";
	public static inline var COMPLETE 	: String = "Complete";
	
	private var _onCancelUpload : String->Void;
	
	public function new( data : FileToUpload , SLPId:String ) {
		
		Locator.registerSLDisplay(SLPId, this, "FileUploadStatus");
		
		var viewDom = Lib.document.createElement("div");
		viewDom.className = "fileUploadStatus smallFont";
		
		_fileName = Lib.document.createElement("div");
		_fileName.className = "titleTrack";
		_fileName.appendChild (Lib.document.createTextNode(data.file.name));
		_status = PENDING;
		_statusUpload = Lib.document.createElement("div");
		_statusUpload.className = "noMargin statusTxt";
		_statusUpload.innerHTML = PENDING;
		
		_progressBar = new ProgressBar(SLPId);
		_cancel = new CancelUploadButton( "Cancel", SLPId, data.validateFileName);
		
		viewDom.appendChild(_fileName);
		viewDom.appendChild(_progressBar.rootElement);
		viewDom.appendChild(_statusUpload);
		viewDom.appendChild(_cancel.rootElement);
		
		super(viewDom, SLPId);
	}
	
	public function update(uploadUpdate:FileToUpload) {
		
		_progressBar.value = uploadUpdate.progressPercent;
		
		if ( uploadUpdate.initialized == true && uploadUpdate.completed == false ) {
			updateStatus(PROGRESS);
			_cancel.enabled = true;
		}
		else if ( uploadUpdate.initialized == false && uploadUpdate.completed == false ) {
			updateStatus(PENDING);
			_cancel.enabled = true;
		}
		else if ( uploadUpdate.initialized == true && uploadUpdate.completed == true ) {
			updateStatus(COMPLETE);
			_cancel.enabled = false;
		}
	}
	
	private function updateStatus( value :String) {
		if ( value != _status ) {
			_statusUpload.innerHTML = value;
			_status = value;
		}
	}
	
	private function set_onCancelUpload(value:String -> Void):String -> Void {
		_onCancelUpload = value;
		if ( _cancel != null ) {
			_cancel.requestCancelUpload = value;
		}
		return _onCancelUpload;
	}
	
	public var onCancelUpload(null, set_onCancelUpload):String -> Void;
}