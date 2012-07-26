package filemanager.client.views.base;
import cocktail.core.event.MouseEvent;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import cocktail.core.unit.UnitManager;
import cocktail.core.style.StyleData;
import js.Lib;
import js.Dom;
/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class ProgressBar extends View
{
	private var _bar	 	: HtmlDom;
	
	public function new(SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, "ProgressBar");
		
		var viewDom = Lib.document.createElement("div");
		viewDom.className = "progressBar noMargin";
		
		_bar =  Lib.document.createElement("div");
		viewDom.className = "progressBar.bar noMargin";
		
		viewDom.appendChild (_bar);
		super( viewDom, SLPId);
	}
	
	private function setStyle() 
	{
		rootElement.style.cursor = UnitManager.getCSSCursor(Cursor.pointer);
	}
}