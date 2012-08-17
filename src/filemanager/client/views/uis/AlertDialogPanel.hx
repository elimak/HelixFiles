package filemanager.client.views.uis;
import filemanager.client.FileManager;
import filemanager.client.models.FilesModel;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import filemanager.client.views.uis.buttons.CancelButton;
import filemanager.client.views.uis.buttons.ConfirmButton;
import haxe.Log;
import js.Dom;
import js.Lib;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class AlertDialogPanel extends View {
	
	private var _title	 		: HtmlDom;
	private var _instruction	: HtmlDom;
	private var _cancel 		: CancelButton;
	private var _confirm 		: ConfirmButton;
	
	private var _background 	: HtmlDom;
	private var _panel		 	: HtmlDom;
	
	private var _filesModel 	: FilesModel;
	private var _fileManager 	: FileManager;
	
	private var _parent 	: HtmlDom;
	private var _type 		: Int;
	
	public static inline var DELETE : Int = 1;

	public function new(SLPId:String, parent: HtmlDom) {
		
		_parent = parent;
		
		Locator.registerSLDisplay(SLPId, this, "AlertDialogPanel");
		var root = Lib.document.createElement("div");
		root.className = "dialogPanel smallFont";
		
		_background = Lib.document.createElement("div");
		_background.className = "overlayBackground";		
		
		_panel = Lib.document.createElement("div");
		_panel.className = "panel";
		
		_title = Lib.document.createElement("p");
		_title.className = "title";
		_panel.appendChild (_title);		
		
		var separator = Lib.document.createElement("hr");
		_panel.appendChild (separator);
		
		_instruction = Lib.document.createElement("div");
		_instruction.className = "alert";
		_panel.appendChild (_instruction);

		separator = Lib.document.createElement("hr");
		_panel.appendChild (separator);
		
		_confirm = new ConfirmButton( "Confirm", SLPId);
		_panel.appendChild(_confirm.rootElement);
		_confirm.onclicked = handleUserConfirmation;
		_confirm.enabled = true;
		
		_cancel = new CancelButton( "Cancel", SLPId);
		_panel.appendChild(_cancel.rootElement);		
		_cancel.enabled = true;
		_cancel.onclicked = hide;
		
		root.appendChild(_background);
		root.appendChild(_panel);
		
		super(root, SLPId);	
	}

	private function handleUserConfirmation( evt: Event ) {
		var selectedPath = ( _filesModel.selectedFile != null )? _filesModel.selectedFile.path : _filesModel.selectedFolder;
		_filesModel.deleteFile(selectedPath, _fileManager.updateFolders);
		hide();
	}
	
	public function show( title: String, instruction: String, type: Int ) {
		_type = type;
		_title.innerHTML = title;
		_instruction.innerHTML = instruction;
		_parent.appendChild(rootElement);
	}
	
	public function hide ( ?evt: Event ) {
		_parent.removeChild(rootElement);
	}
	
	public function injectAppModel( filesModel:FilesModel) {
		_filesModel = filesModel;
	}	
	public function injectAppManager( fileManager:FileManager) {
		_fileManager = fileManager;
	}
}