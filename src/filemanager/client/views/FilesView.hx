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
	
	public function setList( data: Array<FileVO>) 
	{
		clear();
		
		for (i in 0...data.length) 
		{
			Log.trace("FilesView - setList() "+data[i]);
			var file : FileUI = new FileUI(data[i], SLPlayerInstanceId);
			rootElement.appendChild(file.rootElement);
		}
	}
} 