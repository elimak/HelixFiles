package filemanager.client.views;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import filemanager.client.views.uis.buttons.CopyButton;
import filemanager.client.views.uis.buttons.CreateFolderButton;
import filemanager.client.views.uis.buttons.DeleteButton;
import filemanager.client.views.uis.buttons.DownloadButton;
import filemanager.client.views.uis.buttons.PasteButton;
import filemanager.client.views.uis.buttons.RenameButton;
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
	private var _onClickedDownload	: String->Void;
	private var _onClickedCopy		: String->Void;
	private var _onClickedPaste	 	: String->Void;
	private var _onClickedDelete	: String->Void;
	private var _onClickedUpload	: String->Void;
	private var _onClickedCreate	: String->Void;
	private var _onClickedRename	: String->Void;
	
	public var onClickedPaste(null, set_onClickedPaste)			: String->Void;
	public var onClickedDownload(null, set_onClickedDownload)	: String->Void;
	public var onClickedCopy(null, set_onClickedCopy)			: String->Void;
	public var onClickedDelete(null, set_onClickedDelete)		: String->Void;
	public var onClickedUpload(null, set_onClickedUpload)		: String->Void;
	public var onClickedCreate(null, set_onClickedCreate)		: String->Void;
	public var onClickedRename(null, set_onClickedRename)		: String->Void;
	
	private var _download		: DownloadButton;
	private var _copy			: CopyButton;
	private var _paste			: PasteButton;
	private var _delete			: DeleteButton;
	private var _upload			: UploadButton;
	private var _createFolder	: CreateFolderButton;
	private var _rename			: RenameButton;
	
	public function new (rootElement:HtmlDom, SLPId:String) {
		
		Locator.registerSLDisplay(SLPId, this, "ToolBox");
		
		_download 		= new DownloadButton( "Download", SLPId);
		_copy 			= new CopyButton( "Copy", SLPId);
		_paste 			= new PasteButton( "Paste", SLPId);
		_delete 		= new DeleteButton( "Delete", SLPId);
		_upload 		= new UploadButton( "Upload", SLPId);
		_createFolder 	= new CreateFolderButton( "Create New Folder", SLPId);
		_rename 		= new RenameButton( "Rename", SLPId);

		rootElement.className = "toolBox smallFont";
		
		rootElement.appendChild(_download.rootElement);
		rootElement.appendChild(_copy.rootElement);
		rootElement.appendChild(_paste.rootElement);
		rootElement.appendChild(_delete.rootElement);
		rootElement.appendChild(_upload.rootElement);
		rootElement.appendChild(_createFolder.rootElement);
		rootElement.appendChild(_rename.rootElement);
		
		super(rootElement, SLPId);
	}
	
	private function set_onClickedDownload(value:String -> Void):String -> Void {
		_download.onButtonClicked = value;
		return _onClickedDownload = value;
	}	
	
	private function set_onClickedCopy(value:String -> Void):String -> Void {
		_copy.onButtonClicked = value;
		return _onClickedCopy = value;
	}
	
	private function set_onClickedPaste(value:String -> Void):String -> Void {
		_paste.onButtonClicked = value;
		return _onClickedPaste = value;
	}
	
	private function set_onClickedDelete(value:String -> Void):String -> Void {
		_delete.onButtonClicked = value;
		return _onClickedDelete = value;
	}
	
	private function set_onClickedUpload(value:String -> Void):String -> Void {
		_upload.onButtonClicked = value;
		return _onClickedUpload = value;
	}
	
	private function set_onClickedCreate(value:String -> Void):String -> Void {
		_createFolder.onButtonClicked = value;
		return _onClickedCreate = value;
	}	
	private function set_onClickedRename(value:String -> Void):String -> Void {
		_rename.onButtonClicked = value;
		return _onClickedRename = value;
	}
}