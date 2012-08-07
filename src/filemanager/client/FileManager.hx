package filemanager.client;
import filemanager.client.models.FilesModel;
import filemanager.client.models.Locator;
import filemanager.client.views.FileDropper;
import filemanager.client.views.FilesView;
import filemanager.client.views.FolderTreeView;
import filemanager.client.views.ToolBox;
import filemanager.client.views.uis.buttons.CopyButton;
import filemanager.client.views.uis.buttons.CreateFolderButton;
import filemanager.client.views.uis.buttons.DeleteButton;
import filemanager.client.views.uis.buttons.DownloadButton;
import filemanager.client.views.uis.buttons.PasteButton;
import filemanager.client.views.uis.buttons.RefreshButton;
import filemanager.client.views.uis.buttons.RenameButton;
import filemanager.client.views.uis.buttons.UploadButton;
import filemanager.client.views.uis.SimpleDialogPanel;
import filemanager.client.views.UploadStatus;
import filemanager.cross.FileVO;
import filemanager.cross.FolderVO;
import haxe.Log;
import js.Lib;
import org.slplayer.core.Application;
import org.slplayer.component.ui.DisplayObject;
import js.Dom;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FileManager extends DisplayObject
{
	private var _filesModel		: FilesModel;
	private var _folderView		: FolderTreeView;
	private var _uploadStatus	: UploadStatus;
	private var _toolBox		: ToolBox;
	private var _dialogPanel	: SimpleDialogPanel;
	private var _fileDropper	: FileDropper;
	
	private var _filesView		: FilesView;
	private var _foldersView	: FolderTreeView;
	
	private var _application	: Application;
	
	public function new(rootElement:HtmlDom, SLPId:String){
		super(rootElement, SLPId);
		_application = Application.get(SLPId);

	}
	
// ------------------------ // 
// INITIALIZATION
// ------------------------ //

	override public function init() {
		initializeAppModel(); 		// create model
		initializeFileDropper();	// locate and store File Dropper for upload
		initializeUploadStatus();	// Locate and store Upload status - list of ui monitoring each separated upload
		initializeToolBox();		// Locate and initialize ToolBox 
	}
	
	private function initializeToolBox() {
		var toolBoxes : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "ToolBox");
		_toolBox = cast toolBoxes[0];

		_toolBox.onClickedDownload = onClickedToolBox;
		_toolBox.onClickedCopy = onClickedToolBox;
		_toolBox.onClickedCreate = onClickedToolBox;
		_toolBox.onClickedDelete = onClickedToolBox;
		_toolBox.onClickedPaste = onClickedToolBox;
		_toolBox.onClickedUpload = onClickedToolBox;
		_toolBox.onClickedRename = onClickedToolBox;
	}
	
	private function initializeUploadStatus() {
		var uploadStatus : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "UploadStatus");
		_uploadStatus = cast uploadStatus[0];
		_uploadStatus.onCancelUpload = _filesModel.onCancelUpload;
		_filesModel.onUploadUpdate = _uploadStatus.onUpdate;	
	}

	private function initializeAppModel() {
		_filesModel = new FilesModel();
		_filesModel.getTreeFolder("../files", showFolders);
		_filesModel.getFiles("../files", showFiles);
	}
	
	private function initializeFileDropper() {
		var fileDroppers : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "FileDropper");
		_fileDropper = cast fileDroppers[0];
		_fileDropper.onFileDropped = _filesModel.uploadSelectedFiles;
	}	
	
// ------------------------ // 
// MANAGE USER INPUTS
// ------------------------ //

	private function onClickedToolBox( buttonId: String ) {
		switch(buttonId) {
			case CreateFolderButton.VIEW_ID :
				showInputOverlay( true, "Folder's name" );
			case DownloadButton.VIEW_ID	:
			case CopyButton.VIEW_ID		:
			case DeleteButton.VIEW_ID	:
			case PasteButton.VIEW_ID	:
			case UploadButton.VIEW_ID	:
			case RenameButton.VIEW_ID	:
				showInputOverlay( true, "New name:" );
		}
	}
	
	private function updateUserInputsStates() : Void {
		
		/*
		 * create folder 
		 * --> can happen anytime
		 * download 
		 * copy 
		 * move
		 * --> can only happen on a selected file
		 * delete 
		 * rename
		 * --> can happen on a selected file or a selected folder
		 * */
	}
	
// ------------------------ // 
// SHOW/HIDE OVERLAYS
// ------------------------ //

	private function showInputOverlay( b: Bool, title: String) {
		if (_dialogPanel == null) {
			_dialogPanel = new SimpleDialogPanel( SLPlayerInstanceId, Lib.document.body); // Create and store the dialog box
		}
		if( b ){
			_dialogPanel.show(title);
		}else {
			_dialogPanel.hide();
		}
	}
	
	private function showConfirmation ( b: Bool ) {
		
	}
	
// ------------------------------ // 
// MANAGE FILES/FOLDER TREE VIEW
// ------------------------------ //

	private function showFolders( data: FolderVO ) : Void {
		var folderTreeViews : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "FolderTreeView");
		_foldersView = cast folderTreeViews[0];
		_foldersView.onSelectFolder = requestFiles;
		_foldersView.rootElement.addEventListener(FolderTreeView.DROPPED_FILE, handleDropingOfFiles, false); 

		data.open = true;
		_foldersView.initialize(data);
		
		// initialize the filesView
		var filesViews : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "FilesView");
		_filesView = cast filesViews[0];
		_filesView.rootElement.addEventListener(FilesView.DRAGGING_FILE, handleDraggingFile, false); 
		
		// request the files's list contained into the root folder
		requestFiles("../files");
	}	
	
	/**
	 * request the list of file within a given folder's path
	 * and passes the result value to the filesView
	 * @param	folderPath
	 */
	private function requestFiles( folderPath: String ) {
		_filesModel.selectedFolderOrFile = folderPath;
		_filesModel.getFiles(folderPath, function(inData: Array<FileVO>){
											_filesView.setList(inData);
										});
	}
	
	private function handleDraggingFile( evt: Event ) {
		_filesModel.setDraggedFile(_filesView.currentDraggedFile);
	}

	private function showFiles( data: Array<FileVO> ) : Void {
		//Log.trace("FileManager - showFolders() "+data.toString());
	}
	
	private function handleDropingOfFiles( evt: Event ) : Void {
		_filesModel.setFolderOfDroppedFile(_foldersView.currentDroppedInFolder);
	}
}