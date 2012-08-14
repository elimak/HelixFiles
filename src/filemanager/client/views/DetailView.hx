package filemanager.client.views;
import filemanager.client.models.FilesModel;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import haxe.Log;
import js.Dom;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class DetailView extends View {

	private var _filesModel	 : FilesModel;
	
	public function new(rootElement:HtmlDom, SLPId:String) {
		Locator.registerSLDisplay(SLPId, this, "DetailView");
		super(rootElement, SLPId);	
	}
	
	override public function init():Void {
		rootElement.innerHTML = "Detail View";
		super.init();
	}
}