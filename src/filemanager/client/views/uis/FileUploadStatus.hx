package filemanager.client.views.uis;
import filemanager.client.models.Locator;
import filemanager.client.views.base.LabelButton;
import filemanager.client.views.base.ProgressBar;
import filemanager.client.views.base.View;
import filemanager.client.models.FilesModel;
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
	private var _cancel			: LabelButton;
	
	public function new( data : FileToUpload , SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, "FileUploadStatus");
		
		var viewDom = Lib.document.createElement("div");
		viewDom.className = "fileUploadStatus smallFont";
		
		_fileName = Lib.document.createTextNode(data.file.name);
		_statusUpload = Lib.document.createTextNode("Pending");
		
		_progressBar = new ProgressBar(SLPId);
		_cancel = new LabelButton( "Cancel", SLPId);
		
		viewDom.appendChild(_fileName);
		viewDom.appendChild(_progressBar.rootElement);
		viewDom.appendChild(_statusUpload);
		viewDom.appendChild(_cancel.rootElement);
		
		super(viewDom, SLPId);
	}
}