package filemanager.client.views.uis.buttons;
import filemanager.client.models.Locator;
import filemanager.client.views.base.LabelButton;
import haxe.Log;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class DeleteButton extends LabelButton
{
	public function new(label: String, SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, "DeleteButton");
		super(label, SLPId);
		rootElement.className = "buttons deleteButton";
		
		enabled = true;
	}
}
