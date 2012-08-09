package filemanager.client;
import filemanager.client.models.FilesModel;
import filemanager.client.models.Locator;
import filemanager.client.views.FileDropper;
import filemanager.client.views.FilesView;
import filemanager.client.views.FolderTreeView;
import filemanager.client.views.ToolBox;
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
		
		_filesModel = new FilesModel(); // create the model
		
		initializeFileDropper();	// locate and store File Dropper for upload
		initializeUploadStatus();	// Locate and store Upload status - list of ui monitoring each separated upload
		initializeToolBox();		// Locate and initialize ToolBox 
		initializeAppModel(); 		// requests the files/folders list 
	}
	
	private function initializeToolBox() {
		
		var toolBoxes : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "ToolBox");
		_toolBox = cast toolBoxes[0];
		
		_toolBox.injectAppModel(_filesModel);
		_toolBox.injectAppManager(this);
	}
	
	private function initializeUploadStatus() {
		var uploadStatus : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "UploadStatus");
		_uploadStatus = cast uploadStatus[0];
		_uploadStatus.injectAppModel(_filesModel);
	}
	
	private function initializeFileDropper() {
		var fileDroppers : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "FileDropper");
		_fileDropper = cast fileDroppers[0];
		_fileDropper.injectAppModel(_filesModel);
		_fileDropper.onFileDropped = _filesModel.uploadSelectedFiles;
	}	
	
	private function initializeAppModel() {
		_filesModel.getTreeFolder("../files", initializeFolders);
		_filesModel.getFiles("../files", showFiles);
	}
	
// ------------------------ // 
// SHOW/HIDE OVERLAYS
// ------------------------ //

	public function showInputOverlay( b: Bool, title: String) {
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

	private function initializeFolders( data: FolderVO ) : Void {
		
		// initialize the folder's View
		var folderTreeViews : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "FolderTreeView" );
		_foldersView = cast folderTreeViews[0];
		_foldersView.injectAppModel(_filesModel);
		_foldersView.injectAppManager(this);
		
		// initialize the file's View
		var filesViews : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "FilesView" );
		_filesView = cast filesViews[0];
		_filesView.injectAppModel(_filesModel);
		
		data.open = true; // the root folder is set as open, so we can see the folder's list that belongs to it right away 
		_foldersView.initialize(data);
	}	

	private function showFiles( data: Array<FileVO> ) : Void {
		//Log.trace("FileManager - showFolders() "+data.toString());
	}

	public function getListOfFiles(folderPath: String) {
		_filesModel.getFiles(folderPath, function(inData: Array<FileVO>){
											_filesView.setList(inData);
										});
	}
}