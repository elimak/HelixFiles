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

class InputDialogPanel extends View {
	
	private var _title	 		: HtmlDom;
	private var _instruction	: HtmlDom;
	private var _input 			: FormElement;
	private var _cancel 		: CancelButton;
	private var _confirm 		: ConfirmButton;
	
	private var _background 	: HtmlDom;
	private var _panel		 	: HtmlDom;
	
	private var _filesModel 	: FilesModel;
	private var _fileManager 	: FileManager;
	
	private var _parent 	: HtmlDom;
	private var _type 		: Int;
	
	public static inline var RENAME : Int = 1;
	public static inline var CREATE : Int = 2;

	
	public function new(SLPId:String, parent: HtmlDom) {
		
		_parent = parent;
		
		Locator.registerSLDisplay(SLPId, this, "InputDialogPanel");
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
		
		var inputDiv = Lib.document.createElement("div");
		_panel.appendChild (inputDiv);
		
		_instruction = Lib.document.createElement("p");
		_instruction.className = "instruction";
		inputDiv.appendChild (_instruction);
		
		_input = cast Lib.document.createElement("input");
		_input.addEventListener("keydown", handleKeyboardEvent, false );
		inputDiv.appendChild (_input);
		
		separator = Lib.document.createElement("hr");
		_panel.appendChild (separator);
		
		_confirm = new ConfirmButton( "Confirm", SLPId);
		_panel.appendChild(_confirm.rootElement);
		_confirm.onclicked = handleUserConfirmation;
		
		_cancel = new CancelButton( "Cancel", SLPId);
		_panel.appendChild(_cancel.rootElement);		
		_cancel.enabled = true;
		_cancel.onclicked = hide;
		
		root.appendChild(_background);
		root.appendChild(_panel);
		
		super(root, SLPId);	
	}
	
	private function handleKeyboardEvent(e:Event):Void {
		var value: String = untyped _input.value;
		_confirm.enabled = value.length > 1;
		
		if ( untyped e.keyCode == 13 && _confirm.enabled) {
			handleUserConfirmation(e);
		}
	}
	
	private function handleUserConfirmation( evt: Event ) {
		var selectedIsFile = ( _filesModel.selectedFile != null )? true : false; 
		var selectedPath = ( _filesModel.selectedFile != null )? _filesModel.selectedFile.path : _filesModel.selectedFolder;
		var value: String = untyped _input.value;
		
		if( _type == RENAME ){
			_filesModel.renameFile(selectedPath, value );
		}
		else if ( _type == CREATE ) {
			_filesModel.createNewFolder( _filesModel.selectedFolder+value, _fileManager.updateFolders );
		}
		hide();
	}
	
	public function show( title: String, instruction: String, type: Int ) {
		_type = type;
		_title.innerHTML = title;
		_instruction.innerHTML = instruction;
		_parent.appendChild(rootElement);
		_confirm.enabled = false;
		_input.value = "";
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