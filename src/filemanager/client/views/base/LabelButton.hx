package filemanager.client.views.base;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import cocktail.core.unit.UnitManager;
import cocktail.core.style.StyleData;
import haxe.Log;
import js.Lib;
import js.Dom;
/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class LabelButton extends View
{

	public var onclicked : Event->Void;
	private var _enabled : Bool;
	
	public var enabled(get_enabled, set_enabled):Bool;
	
	public function new(label: String, SLPId:String ) {
		
		var viewDom = Lib.document.createElement("div");
		viewDom.onclick = handleClick;
		
		viewDom.onmouseover = handleMouseOver;
		viewDom.onmouseout = handleMouseOut;
		
		var label = Lib.document.createTextNode( label );
		viewDom.appendChild (label);
		
		super( viewDom, SLPId);
	}
	
	public function updateLabel( newLabel: String) {
		rootElement.innerHTML = newLabel;
	}
	
	private function handleClick( e: Event) {
		if ( onclicked != null && _enabled )
			onclicked(e);
	}	
	
	private function handleMouseOver( e: Event) {
		if( _enabled ){
			rootElement.style.border = "1px solid #4bb3db";
			rootElement.style.backgroundColor = "#5fbadd";
		}
	}	
	
	private function handleMouseOut( e: Event) {
		if( _enabled ){
			rootElement.style.border = "1px solid #61c4ea";
			rootElement.style.backgroundColor = "#7cceee";
		}
	}
	
	private function get_enabled(): Bool {
		return _enabled;
	}
	
	private function set_enabled(value:Bool):Bool {
		_enabled = value;
		rootElement.style.border = (_enabled == true)? "1px solid #61c4ea" : "1px solid #888888";
		rootElement.style.backgroundColor = (_enabled == true)? "#7cceee" : "#aaaaaa";
		rootElement.style.cursor = _enabled? UnitManager.getCSSCursor(Cursor.pointer) : null;
		return _enabled = value;
	}
}