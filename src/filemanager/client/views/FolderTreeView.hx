package filemanager.client.views;
import filemanager.client.models.Locator;
import filemanager.client.views.uis.FolderUI;
import filemanager.client.views.base.View;
import filemanager.cross.FolderVO;
import haxe.Log;
import js.Dom;
import js.Lib;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FolderTreeView extends View
{
	private var _rootFolder 	: FolderUI;		// top folder
	private var _data			: FolderVO;		// store the data loaded (full tree in Json/Dynamic)
	private var _folderStatus	: Hash<Bool>;	// stores only the status open/closed of the folders based on their path
	
	public var onSelectFolder 	: String->Void;
	
	private var _currentFolderUISelected : FolderUI;
	
	public function new(rootElement:HtmlDom, SLPId:String) {
		Locator.registerSLDisplay(SLPId, this, "FolderTreeView");
		super(rootElement, SLPId);	
		_folderStatus = new Hash<Bool>();
	}
	
	public function initialize ( data: FolderVO )
	{
		_data = data;
		buildView();
	}
	
	/**
	 * Build the entire tree folder. when a folder is closed the
	 * children still exist but their height is set to 0 & their label is removed
	 */
	private function buildView() 
	{
		// create the top folder
		_rootFolder = new FolderUI((_data.children.length > 0), 0, _data.name, SLPlayerInstanceId);
		_rootFolder.isOpen = _data.open;
		
		// Store the status (open/closed) based on the unique path
		var folderPath	: String = _data.path + "/" + _data.name;
		_folderStatus.set(folderPath, _data.open);

		makeInteractive(_rootFolder, _data);
		rootElement.appendChild(_rootFolder.rootElement);
		
		createSubFolders(_data, _rootFolder, 1);		
	}
	
	/**
	 * Create the subfolders of any folder - recursive.
	 * @param	data
	 * @param	target
	 * @param	inDescendant
	 */
	private function createSubFolders( currentFolder: FolderVO, target: FolderUI , inDescendant: Int) 
	{
		for (i in 0...currentFolder.children.length) 
		{
			var child 		: FolderVO 	= currentFolder.children[i];
			var childPath	: String 	= child.path + "/" + child.name;
			
			// if we already recorded a value, use it, else use the default value set in FolderUI's constructor
			target.isOpen = _folderStatus.exists(childPath)? _folderStatus.get(childPath) : target.isOpen;
			
			var folderChild : FolderUI = new FolderUI ((child.children.length > 0 ), inDescendant, child.name, SLPlayerInstanceId);
			target.subFolders.push(folderChild);
			
			rootElement.appendChild(folderChild.rootElement);
			folderChild.isVisible = target.isOpen;
			
			folderChild.refresh();
			
			folderChild.isOpen = child.open;
			makeInteractive(folderChild, child);
			
			createSubFolders(child, folderChild, (inDescendant + 1));
		}
	}
	
	private function updateSubFolders( target: FolderUI ) 
	{
		for (i in 0...target.subFolders.length) 
		{
			var folderChild : FolderUI = target.subFolders[i];
			folderChild.isVisible = target.isOpen;
			folderChild.refresh();
		}
	}
	
	private function makeInteractive(folder:FolderUI, data: FolderVO) 
	{
		var handelClickCallback = callback(handleOnFolderClick, folder, data);
		folder.rootElement.onclick = handelClickCallback;
	}
	
	private function handleOnFolderClick( target: FolderUI, folderData: FolderVO, evt: Event ) : Void
	{
		// toggles the properties isOpen
		target.isOpen = !target.isOpen;
		
		// deselects the previous selected folder
		if( _currentFolderUISelected != null && _currentFolderUISelected != target){
			_currentFolderUISelected.isSelected = false;
			_currentFolderUISelected.refresh();
		}
		
		// stores the current folder as the one being selected
		target.isSelected = true;
		_currentFolderUISelected = target;
		
		// stores the value isOpen based on the unique path of the folder
		var folderPath	: String = folderData.path;
		_folderStatus.set(folderPath, target.isOpen);

		// updates the full data tree
		folderData.open = target.isOpen;
		
		// updates the visuals
		updateSubFolders(target);
		
		target.refresh();
		
		// requests the list of files from the selected folder
		onSelectFolder(folderPath);
	}
}