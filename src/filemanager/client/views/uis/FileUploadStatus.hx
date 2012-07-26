package filemanager.client.views.uis;
import filemanager.client.models.Locator;
import filemanager.client.views.base.LabelButton;
import filemanager.client.views.base.ProgressBar;
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
	
	private var _cancel	: LabelButton;
	private var _status	: String;
	
	public static inline var PENDING 	: String = "Pending";
	public static inline var PROGRESS 	: String = "Progress";
	public static inline var COMPLETE 	: String = "Complete";
	
	public function new( data : FileToUpload , SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, "FileUploadStatus");
		
		var viewDom = Lib.document.createElement("div");
		viewDom.className = "fileUploadStatus smallFont";
		
		_fileName = Lib.document.createTextNode(data.file.name);
		_status = PENDING;
		_statusUpload = Lib.document.createElement("p");
		_statusUpload.className = "noMargin";
		_statusUpload.innerHTML = PENDING;
		
		_progressBar = new ProgressBar(SLPId);
		_cancel = new LabelButton( "Cancel", SLPId);
		
		viewDom.appendChild(_fileName);
		viewDom.appendChild(_progressBar.rootElement);
		viewDom.appendChild(_statusUpload);
		viewDom.appendChild(_cancel.rootElement);
		
		super(viewDom, SLPId);
	}
	
	public function update(uploadUpdate:FileToUpload)
	{
		_progressBar.value = uploadUpdate.progressPercent;
		
		if ( uploadUpdate.initialized == true && uploadUpdate.completed == false ) {
			updateStatus(PROGRESS);
		}
		else if ( uploadUpdate.initialized == false && uploadUpdate.completed == false ) {
			updateStatus(PENDING);
		}
		else if ( uploadUpdate.initialized == true && uploadUpdate.completed == true ) {
			updateStatus(COMPLETE);
		}
	}
	
	private function updateStatus( value :String) 
	{
		if ( value != _status ) {
			_statusUpload.innerHTML = value;
			_status = value;
		}
	}
}