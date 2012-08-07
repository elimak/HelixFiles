package filemanager.client.views.uis.buttons;
import filemanager.client.models.Locator;
import filemanager.client.views.base.LabelButton;
import js.Dom; 
/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class RenameButton extends LabelButton
{
	public static inline var VIEW_ID : String = "RenameButton";
	public var onButtonClicked : String->Void;
	
	public function new(label: String, SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, VIEW_ID);
		super(label, SLPId);
		rootElement.className = "buttons renameButton";
		onclicked = handleClicked;
		enabled = true;
	}
	
	private function handleClicked( evt: Event ) {
		if (onButtonClicked != null ) {
			onButtonClicked(VIEW_ID);
		}
	}
}