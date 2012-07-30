package filemanager.client.views.uis.buttons;
import filemanager.client.models.Locator;
import filemanager.client.views.base.LabelButton;
import js.Lib;
import js.Dom;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class CancelButton extends LabelButton 
{
	
	public function new(label: String, SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, "CancelButton");
		super(label, SLPId);
		
		rootElement.className = "buttons cancelButton";
	}
	
}