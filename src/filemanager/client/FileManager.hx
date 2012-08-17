package filemanager.client;
import filemanager.client.models.FilesModel;
import filemanager.client.models.Locator;
import filemanager.client.views.FileDropper;
import filemanager.client.views.FilesView;
import filemanager.client.views.FolderTreeView;
import filemanager.client.views.SelectedPath;
import filemanager.client.views.ToolBox;
import filemanager.client.views.uis.InputDialogPanel;
import filemanager.client.views.uis.AlertDialogPanel;
import filemanager.client.views.UploadStatus;
import filemanager.cross.FileVO;
import filemanager.cross.FolderVO;
import haxe.Log;
import js.Lib;
import org.slplayer.core.Application;
import org.slplayer.component.ui.DisplayObject;
import js.Dom;

/**
 * Main Class:
 * -> instanciate the Model and retrieve the Views (created at run-time with SLPLayer )
 * -> behave as a Front controller when some action requiere to hook up together several views  
 * @author valerie.elimak - blog.elimak.com
 */

class FileManager extends DisplayObject
{
	private var _filesModel			: FilesModel;
	private var _folderView			: FolderTreeView;
	private var _uploadStatus		: UploadStatus;
	private var _toolBox			: ToolBox;
	private var _inputDialogPanel	: InputDialogPanel;
	private var _alertDialogPanel	: AlertDialogPanel;
	private var _fileDropper		: FileDropper;
	
	private var _filesView			: FilesView;
	private var _foldersView		: FolderTreeView;
	
	private var _application		: Application;

	public function new(rootElement:HtmlDom, SLPId:String){
		super(rootElement, SLPId);
		_application = Application.get(SLPId);
	}
	
// ------------------------ // 
// INITIALIZATION
// ------------------------ //

	override public function init() {
		
		_filesModel = new FilesModel( rootElement ); // create the model
		
		initializeViewFileDropper();	// locate and store File Dropper for upload
		initializeViewUploadStatus();	// Locate and store Upload status - list of ui monitoring each separated upload
		initializeViewToolBox();		// Locate and initialize ToolBox 
		initializeViewSelectedPath();	// Locate and initialize the selected Path bar (with either the folder or the path of the file currently selected)
		
		_filesModel.getTreeFolder("../files", initializeViewFolders);	// requests the files/folders list and initialize the ViewFolders + ViewFiles
	}
	
	private function initializeViewSelectedPath() {
		var selectedPaths : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "SelectedPath");
		var selectedPath : SelectedPath = cast selectedPaths[0];
		
		selectedPath.injectAppModel(_filesModel);
	}
	
	private function initializeViewToolBox() {
		var toolBoxes : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "ToolBox");
		_toolBox = cast toolBoxes[0];
		
		_toolBox.injectAppModel(_filesModel);
		_toolBox.injectAppManager(this);
	}
	
	private function initializeViewUploadStatus() {
		var uploadStatus : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "UploadStatus");
		_uploadStatus = cast uploadStatus[0];
		_uploadStatus.injectAppModel(_filesModel);
		_uploadStatus.injectAppManager(this);
	}
	
	private function initializeViewFileDropper() {
		var fileDroppers : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "FileDropper");
		_fileDropper = cast fileDroppers[0];
		_fileDropper.injectAppModel(_filesModel);
	}	

	private function initializeViewFolders( data: FolderVO ) : Void {
		
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
	
// ------------------------ // 
// SHOW/HIDE OVERLAYS
// ------------------------ //

/**
 * Panel with input to rename file or folder and to create a new folder
 * @param	b
 * @param	title
 * @param	instruction
 * @param	type
 */
	public function showInputOverlay( b: Bool, title: String, instruction: String, type: Int) {
		if (_inputDialogPanel == null) {
			_inputDialogPanel = new InputDialogPanel( SLPlayerInstanceId, Lib.document.body); // Create and store the dialog box
			_inputDialogPanel.injectAppModel(_filesModel);
			_inputDialogPanel.injectAppManager(this);
		}
		if( b ){
			_inputDialogPanel.show(title,instruction, type);
		}else {
			_inputDialogPanel.hide();
		}
	}
	
/**
 * Panel with a warning message when a user wants to delete a file
 * @param	b
 * @param	title
 * @param	instruction
 * @param	type
 */	
	public function showAlertOverlay( b: Bool, title: String, instruction: String, type: Int) {
		if (_alertDialogPanel == null) {
			_alertDialogPanel = new AlertDialogPanel( SLPlayerInstanceId, Lib.document.body); // Create and store the dialog box
			_alertDialogPanel.injectAppModel(_filesModel);
			_alertDialogPanel.injectAppManager(this);
		}
		if( b ){
			_alertDialogPanel.show(title,instruction, type);
		}else {
			_alertDialogPanel.hide();
		}
	}

// ------------------------------ // 
// MANAGE FILES/FOLDER TREE VIEW
// ------------------------------ //	

/**
 * public API called by the views to refresh the folder / files when necessary
 * after an action was performed on a file or folder 
 */

	public function updateFolders( data: FolderVO ) : Void {
		_foldersView.update(data);
	}

	public function getListOfFiles(folderPath: String) {
		_filesModel.getFiles(folderPath, function(inData: Array<FileVO>) {
											_filesView.setList(inData);
										});
	}
}