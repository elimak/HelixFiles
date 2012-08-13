package filemanager.client.views.uis;
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

class SimpleDialogPanel extends View
{
	private var _title	 	: HtmlDom;
	private var _input 		: HtmlDom;
	private var _cancel 	: CancelButton;
	private var _confirm 	: ConfirmButton;
	
	private var _background 	: HtmlDom;
	private var _panel		 	: HtmlDom;
	
	private var _filesModel : FilesModel;
	
	private var _parent 	: HtmlDom;
	
	public function new(SLPId:String, parent: HtmlDom) {
		
		_parent = parent;
		
		Locator.registerSLDisplay(SLPId, this, "SimpleDialogPanel");
		var root = Lib.document.createElement("div");
		root.className = "simpleDialogPanel smallFont";
		
		_background = Lib.document.createElement("div");
		_background.className = "overlayBackground";		
		
		_panel = Lib.document.createElement("div");
		_panel.className = "panel";

		_title = Lib.document.createElement("span");
		_panel.appendChild (_title);
		
		_input = Lib.document.createElement("input");
		_input.addEventListener("keydown", handleKeyboardEvent, false );
		_panel.appendChild (_input);
		
		_cancel = new CancelButton( "Cancel", SLPId);
		_panel.appendChild(_cancel.rootElement);		
		_cancel.enabled = true;
		_cancel.onclicked = hide;
		
		_confirm = new ConfirmButton( "Confirm", SLPId);
		_panel.appendChild(_confirm.rootElement);
		_confirm.onclicked = handleUserConfirmation;
		
		root.appendChild(_background);
		root.appendChild(_panel);
		
		super(root, SLPId);	
	}
	
	private function handleKeyboardEvent(e:Event):Void {
		var value: String = untyped _input.value;
		_confirm.enabled = value.length > 1;
	}
	
	private function handleUserConfirmation( evt: Event ) {
		var selectedIsFile = ( _filesModel.selectedFile != null )? true : false; 
		var selectedPath = ( _filesModel.selectedFile != null )? _filesModel.selectedFile.path : _filesModel.selectedFolder;
		var value: String = untyped _input.value;
		
		_filesModel.renameFile(selectedPath, value );
		hide();
	}
	
	public function show( title: String ) {
		_title.innerHTML = title;
		_parent.appendChild(rootElement);
		_confirm.enabled = false;
		_input.innerHTML = "";
	}
	
	public function hide ( ?evt: Event ) {
		_parent.removeChild(rootElement);
	}
	
	public function injectAppModel( filesModel:FilesModel) {
		_filesModel = filesModel;
	}
}