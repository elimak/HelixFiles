package filemanager.client.views.uis.buttons;
import filemanager.client.models.Locator;
import filemanager.client.views.base.LabelButton;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class RefreshButton extends LabelButton
{
	public function new(label: String, SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, "RefreshButton");
		super(label, SLPId);
		rootElement.className = "buttons refreshButton";
		enabled = true;
	}
}
