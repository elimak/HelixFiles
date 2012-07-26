package filemanager.client.views.base;
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

class LabelButton extends View
{

	public var onclicked : Event->Void;
	
	public function new(label: String, SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, "LabelButton");
		
		var viewDom = Lib.document.createElement("div");
		viewDom.onclick = handleClick;
		
		var label = Lib.document.createTextNode( label );
		viewDom.appendChild (label);
		
		super( viewDom, SLPId);
		
		setStyle();
	}
	
	private function handleClick( e: Event) 
	{
		if ( onclicked != null )
			onclicked(e);
	}
	
	private function setStyle() 
	{
		rootElement.style.cursor = UnitManager.getCSSCursor(Cursor.pointer);
	}
}