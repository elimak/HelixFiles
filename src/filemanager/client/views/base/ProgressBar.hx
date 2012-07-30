package filemanager.client.views.base;
import cocktail.core.event.MouseEvent;
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

class ProgressBar extends View
{
	private var _bar	: HtmlDom;
	private var _value	: Float;
	
	private var _fullBarWidth : Int;
	
	public function new(SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, "ProgressBar");
		
		var viewDom = Lib.document.createElement("div");
		viewDom.className = "progressBar noMargin";
		
		_bar = Lib.document.createElement("div");
		_bar.className = "bar";
		viewDom.appendChild (_bar);
		
		super( viewDom, SLPId);
	}
	
	private function get_value():Float {
		return _value;
	}
	
	private function set_value( percent: Float): Float {
		
		if (_fullBarWidth == null ) {
			_fullBarWidth = getFullBarWidth();
		}
		_value = percent;
		_bar.style.width = (_value*_fullBarWidth)+"px";
		return value;
	}
	
	private function getFullBarWidth() : Int{
		return rootElement.clientWidth;
	}
	
	public var value(get_value, set_value):Float;
}