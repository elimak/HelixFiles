package filemanager.client.views.uis.buttons;
import filemanager.client.models.Locator;
import filemanager.client.views.base.LabelButton;
import js.Lib;
import js.Dom;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class ConfirmButton extends LabelButton 
{
	public static inline var VIEW_ID : String = "ConfirmButton";
	// public var requestCancelUpload : String->Void;
	
	public function new(label: String, SLPId:String) 
	{
		Locator.registerSLDisplay(SLPId, this, VIEW_ID);
		super(label, SLPId);
		
		rootElement.className = "buttons confirmButton";
	}
	
	private override function handleClick( e: Event) {
		/*if ( requestCancelUpload != null && enabled == true )
			requestCancelUpload(_fileName);*/
	}	
}