package filemanager.client.views;
import filemanager.client.FileManager;
import filemanager.client.models.FilesModel;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import filemanager.client.views.uis.buttons.CopyButton;
import filemanager.client.views.uis.buttons.CreateFolderButton;
import filemanager.client.views.uis.buttons.DeleteButton;
import filemanager.client.views.uis.buttons.DownloadButton;
import filemanager.client.views.uis.buttons.PasteButton;
import filemanager.client.views.uis.buttons.RenameButton;
import js.Lib;
import js.Dom;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 * 
 */

class ToolBox extends View {

	private var _download		: DownloadButton;
	private var _copy			: CopyButton;
	private var _paste			: PasteButton;
	private var _delete			: DeleteButton;
	private var _createFolder	: CreateFolderButton;
	private var _rename			: RenameButton;
	
	private var _filesModel		: FilesModel; 	// Data Model
	private var _filesManager	: FileManager; 	// Controller
	
	public function new (rootElement:HtmlDom, SLPId:String) {
		Locator.registerSLDisplay(SLPId, this, "ToolBox");
		rootElement.className = "toolBox smallFont";
		
		super(rootElement, SLPId);
	}

// ------------------------ // 
// INITIALIZE
// ------------------------ //

	override public function init() : Void {
		_download 	= new DownloadButton( "Download", SLPlayerInstanceId);
		_copy 		= new CopyButton( "Copy", SLPlayerInstanceId);
		_paste 		= new PasteButton( "Paste", SLPlayerInstanceId);
		_delete 	= new DeleteButton( "Delete", SLPlayerInstanceId);
		_rename 	= new RenameButton( "Rename", SLPlayerInstanceId);
		_createFolder 	= new CreateFolderButton( "Create New Folder", SLPlayerInstanceId);
		
		rootElement.appendChild(_download.rootElement);
		rootElement.appendChild(_copy.rootElement);
		rootElement.appendChild(_paste.rootElement);
		rootElement.appendChild(_delete.rootElement);
		rootElement.appendChild(_createFolder.rootElement);
		rootElement.appendChild(_rename.rootElement);
		
		_download.onButtonClicked = onClickedToolBox;
		_copy.onButtonClicked = onClickedToolBox;
		_paste.onButtonClicked = onClickedToolBox;
		_delete.onButtonClicked = onClickedToolBox;
		_createFolder.onButtonClicked = onClickedToolBox;
		_rename.onButtonClicked = onClickedToolBox;
	}

// ------------------------ // 
// MANAGE USER INPUTS
// ------------------------ //

	private function onClickedToolBox( buttonId: String ) : Void {
		switch(buttonId) {
			case CreateFolderButton.VIEW_ID :
				_filesManager.showInputOverlay( true, "Folder's name" );
			case DownloadButton.VIEW_ID	:
			case CopyButton.VIEW_ID		:
			case DeleteButton.VIEW_ID	:
			case PasteButton.VIEW_ID	:
			case RenameButton.VIEW_ID	:
				var title = ( _filesModel.selectedFile != null )? "New file's name: " : "New directory's name";
				_filesManager.showInputOverlay( true, title);
		}
	}

// ------------------------------ // 
// INJECTION MODEL / MANAGER
// ------------------------------ //

	public function injectAppModel( filesModel:FilesModel) : Void {
		_filesModel = filesModel;
		_filesModel.appDispatcher.addEventListener( FilesModel.PATH_UPDTATE, handleSelectedPathUpdated, false);
	}
	
	public function injectAppManager( filesManager:FileManager) : Void {
		_filesManager = filesManager;
	}
	
/**
 * Check wether the current selection is a file or a folder
 * @param	e
 */
	private function handleSelectedPathUpdated(e:Event):Void {
		var selectedPathIsFile = ( _filesModel.selectedFile != null )? true : false;
		_download.enabled = selectedPathIsFile; // only enabled for files
	}
}