package filemanager.client.views.uis.buttons;
import filemanager.client.models.Locator;
import filemanager.client.views.base.LabelButton;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class UploadButton extends LabelButton
{
	public function new(label: String, SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, "UploadButton");
		super(label, SLPId);
		rootElement.className = "buttons uploadButton";
		enabled = true;
	}
}