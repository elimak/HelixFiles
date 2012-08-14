package filemanager.client.views;
import filemanager.client.models.FilesModel;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import haxe.Log;
import js.Dom;
import js.Lib;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class TitleTopBar extends View {

	private var _filesModel	 : FilesModel;
	
	public function new(rootElement:HtmlDom, SLPId:String) {
		Locator.registerSLDisplay(SLPId, this, "TitleTopBar");
		super(rootElement, SLPId);	
	}
	
	override public function init():Void {
		//rootElement.innerHTML = "Silex Media Center";
		var title = Lib.document.createElement("p");
		title.innerHTML = "Silex Media Center";
		rootElement.appendChild(title);
		Log.trace("TitleTopBar - init() "+title);
		super.init();
	}
}