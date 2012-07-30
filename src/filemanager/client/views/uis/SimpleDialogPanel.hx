package filemanager.client.views.uis;
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
	
	private var _parent 	: HtmlDom;
	
	public function new(SLPId:String, parent: HtmlDom) {
		
		_parent = parent;
		
		Locator.registerSLDisplay(SLPId, this, "SimpleDialogPanel");
		var root = Lib.document.createElement("div");
		root.className = "simpleDialogPanel";

		_title = Lib.document.createElement("span");
		root.appendChild (_title);
		
		_input = Lib.document.createElement("input");
		root.appendChild (_input);
		
		_cancel = new CancelButton( "Cancel", SLPId);
		root.appendChild(_cancel.rootElement);		
		
		_confirm = new ConfirmButton( "Confirm", SLPId);
		root.appendChild(_confirm.rootElement);
		
		super(root, SLPId);	
	}
	
	public function show( title: String ) {

		_title.innerHTML = title;
		_parent.appendChild(rootElement);
		
		Log.trace("SimpleDialogPanel - show() "+title);
	}
	
	public function hide () {
		_parent.removeChild(rootElement);
		Log.trace("SimpleDialogPanel - hide() ");
	}
}