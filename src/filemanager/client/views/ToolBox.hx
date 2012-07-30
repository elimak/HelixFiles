package filemanager.client.views;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import filemanager.client.views.uis.buttons.CopyButton;
import filemanager.client.views.uis.buttons.DeleteButton;
import filemanager.client.views.uis.buttons.DownloadButton;
import filemanager.client.views.uis.buttons.PasteButton;
import filemanager.client.views.uis.buttons.UploadButton;
import js.Lib;
import js.Dom;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 * 
 */

class ToolBox extends View
{
	private var _download	: DownloadButton;
	private var _copy		: CopyButton;
	private var _paste		: PasteButton;
	private var _delete		: DeleteButton;
	private var _upload		: UploadButton;
	
	public function new (rootElement:HtmlDom, SLPId:String) {
		
		Locator.registerSLDisplay(SLPId, this, "ToolBox");
		
		_download 	= new DownloadButton( "Download", SLPId);
		_copy 		= new CopyButton( "Copy", SLPId);
		_paste 		= new PasteButton( "Paste", SLPId);
		_delete 	= new DeleteButton( "Delete", SLPId);
		_upload 	= new UploadButton( "Upload", SLPId);
		
	//	var viewDom = Lib.document.createElement("div");
		rootElement.className = "toolBox smallFont";
		
		rootElement.appendChild(_download.rootElement);
		rootElement.appendChild(_copy.rootElement);
		rootElement.appendChild(_paste.rootElement);
		rootElement.appendChild(_delete.rootElement);
		rootElement.appendChild(_upload.rootElement);
		
		super(rootElement, SLPId);
	}
}