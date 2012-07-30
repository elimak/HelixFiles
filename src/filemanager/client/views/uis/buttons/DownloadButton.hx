package filemanager.client.views.uis.buttons;
import filemanager.client.models.Locator;
import filemanager.client.views.base.LabelButton;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class DownloadButton extends LabelButton 
{
	public function new(label: String, SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, "DownloadButton");
		super(label, SLPId);
		rootElement.className = "buttons downloadButton";
		
		enabled = true;
	}
}
