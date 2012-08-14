package filemanager.client.views;
import filemanager.client.FileManager;
import filemanager.client.models.FilesModel;
import filemanager.client.models.Locator;
import filemanager.client.views.uis.FolderUI;
import filemanager.client.views.base.View;
import filemanager.cross.FileVO;
import filemanager.cross.FolderVO;
import haxe.Log;
import js.Dom;
import js.Lib;
import org.slplayer.component.interaction.Draggable;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FolderTreeView extends View
{
	private var _rootFolder 	: FolderUI;		// top folder
	private var _data			: FolderVO;		// store the data loaded (full tree in Json/Dynamic)
	private var _folderStatus	: Hash<Bool>;	// stores only the status open/closed of the folders based on their path (path is unique)
	
	private var _currentFolderUISelected : FolderUI;
	
	private var _filesModel		: FilesModel;
	private var _fileManager	: FileManager;
	
	public function new(rootElement:HtmlDom, SLPId:String) {
		Locator.registerSLDisplay(SLPId, this, "FolderTreeView");
		super(rootElement, SLPId);	
		_folderStatus = new Hash<Bool>();
	}
		
// ----------------------------------------- // 
// CREATE & UPDATE FOLDERS + SUB/FOLDERS
// ----------------------------------------- //

// PRIVATE

	/**
	 * Build the entire tree folder. when a folder is closed the
	 * children still exist but their height is set to 0 & their label is removed
	 */
	private function buildView() {

		// create the top folder
		_rootFolder = new FolderUI((_data.children > 0), 0, _data.name, SLPlayerInstanceId);
		_rootFolder.isOpen = false;
		// Store the status (open/closed) based on the unique path
		var folderPath	: String = _data.path;
		_folderStatus.set(folderPath, _rootFolder.isOpen);

		makeInteractive(_rootFolder, _data);
		rootElement.appendChild(_rootFolder.rootElement);
		
		createSubFolders(_data, _rootFolder, 1);
		
		handleOnFolderClick(_rootFolder, _data, null);
	}
	
	/**
	 * Create the subfolders of any folder - recursive.
	 * @param	data
	 * @param	target
	 * @param	inDescendant
	 */
	private function createSubFolders( currentFolder: FolderVO, target: FolderUI , inDescendant: Int) {
		
		for (i in 0...currentFolder.childFolders.length) {
			var child 	: FolderVO 	= currentFolder.childFolders[i];

			// if we already recorded a value, use it, else use the default value set in FolderUI's constructor
			target.isOpen = _folderStatus.exists(currentFolder.path)? _folderStatus.get(currentFolder.path) : target.isOpen;
			
			var folderChild : FolderUI = new FolderUI ((child.children > 0 ), inDescendant, child.name, SLPlayerInstanceId);
			folderChild.path = child.path;
			folderChild.isSelected = (_currentFolderUISelected != null)? (folderChild.path == _currentFolderUISelected.path && _currentFolderUISelected.isSelected) : false;
			target.subFolders.push(folderChild);
			
			rootElement.appendChild(folderChild.rootElement);
			folderChild.isVisible = target.isOpen;
			
			folderChild.isOpen = child.open;
			makeInteractive(folderChild, child);
			createSubFolders(child, folderChild, (inDescendant + 1));
		}
	}

	/**
	 * Add interaction on click
	 * @param	folder
	 * @param	data
	 */
	private function makeInteractive(folder:FolderUI, data: FolderVO) {
		var handelClickCallback = callback(handleOnFolderClick, folder, data);
		folder.rootElement.onclick = handelClickCallback;
		var droppedCallBack = callback(handleFileDropped, data, folder);
		
		folder.rootElement.addEventListener("dragEventDropped", droppedCallBack, false);
	}
		
// ----------------------------------- // 
// HANDLES FOLDER's INTERACTION
// ----------------------------------- //

// PRIVATE

	private function handleOnFolderClick( target: FolderUI, folderData: FolderVO, evt: Event ) : Void {
	
		target.isOpen = !target.isOpen;				// toggles the properties isOpen
		
		// deselects the previous selected folder
		if( _currentFolderUISelected != null && _currentFolderUISelected != target){
			_currentFolderUISelected.isSelected = false;
			_currentFolderUISelected.refresh();
		}
		
		
		target.isSelected = (evt != null)? true : false; // stores the current folder as the one being selected, is false when handleFolderClick is called from buildView () to initialize the rootFolder
		_currentFolderUISelected = target;
		
		var folderPath	: String = folderData.path;		// stores the value isOpen based on the unique path of the folder
		_folderStatus.set(folderPath, target.isOpen);

		folderData.open = target.isOpen;				// updates the full data tree
		target.refresh();
		
		_filesModel.selectedFolder = folderPath;
		_fileManager.getListOfFiles(folderPath);
	}
	
	private function handleFileDropped( folderData: FolderVO, folderUI: FolderUI, evt: Event ) : Void {
		_filesModel.setFolderOfDroppedFile(folderData, update);
		folderUI.clear();
		folderUI.refresh( true );
	}
		
// ------------------------ // 
// INITIALIZE WITH DATA 
// ------------------------ //

// PUBLIC

	public function initialize ( data: FolderVO ) {
		_data = data;
		
		_filesModel.selectedFolder = data.path;
		_fileManager.getListOfFiles(data.path);
		
		buildView();
	}
	
	override public function init() : Void {
	}

	public function update(data:FolderVO) {
		_data = data;
		clear();
		buildView();
	}
	
	public function injectAppModel(filesModel : FilesModel) {
		_filesModel = filesModel;
	}	
	
	public function injectAppManager(fileManager : FileManager) {
		_fileManager = fileManager;
	}
}