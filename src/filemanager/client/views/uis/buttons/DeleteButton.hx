package filemanager.client.views.uis.buttons;
import filemanager.client.models.Locator;
import filemanager.client.views.base.LabelButton;
import haxe.Log;
import js.Dom;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class DeleteButton extends LabelButton
{
	public static inline var VIEW_ID : String = "DeleteButton";
	public var onButtonClicked : String->Void;
	
	public function new(label: String, SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, VIEW_ID);
		super(label, SLPId);
		rootElement.className = "buttons deleteButton";
		onclicked = handleClicked;
		enabled = true;
	}
	
	private function handleClicked( evt: Event ) {
		if (onButtonClicked != null ) {
			onButtonClicked(VIEW_ID);
		}
	}
}
