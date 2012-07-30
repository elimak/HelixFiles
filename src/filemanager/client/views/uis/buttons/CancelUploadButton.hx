package filemanager.client.views.uis.buttons;
import filemanager.client.models.Locator;
import filemanager.client.views.base.LabelButton;
import js.Lib;
import js.Dom;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class CancelUploadButton extends LabelButton 
{
	public var requestCancelUpload : String->Void;
	private var _fileName : String;
	
	public function new(label: String, SLPId:String, fileName: String ) 
	{
		_fileName = fileName;
		Locator.registerSLDisplay(SLPId, this, "CancelUploadButton");
		super(label, SLPId);
		
		rootElement.className = "buttons cancelButton";
	}
	
	private override function handleClick( e: Event) {
		if ( requestCancelUpload != null && enabled == true )
			requestCancelUpload(_fileName);
	}	
}