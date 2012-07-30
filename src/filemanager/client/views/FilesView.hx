package filemanager.client.views;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import filemanager.client.views.uis.FileUI;
import filemanager.cross.FileVO;
import filemanager.cross.FolderVO;
import haxe.Log;
import js.Dom;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FilesView extends View
{
	
	public function new(rootElement:HtmlDom, SLPId:String) {
		Locator.registerSLDisplay(SLPId, this, "FilesView");
		super(rootElement, SLPId);
	}
	
/**
 * Show a list of files contained into the current selected folder.
 * @param	data
 */
	public function setList( data: Array<FileVO>) {
		
		// remove all children
		clear(); 
		
		// and recreate the list 
		for (i in 0...data.length) {
			var file : FileUI = new FileUI(data[i], SLPlayerInstanceId);
			rootElement.appendChild(file.rootElement);
		}
	}
} 