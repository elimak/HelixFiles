package filemanager.client.views.uis.buttons;
import filemanager.client.models.Locator;
import filemanager.client.views.base.LabelButton;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class CopyButton extends LabelButton 
{
	public function new(label: String, SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, "CopyButton");
		super(label, SLPId);
		rootElement.className = "buttons copyButton";
		
		enabled = true;
	}
}
