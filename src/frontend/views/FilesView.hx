package frontend.views;
import dto.FileVO;
import dto.FolderVO;
import frontend.views.uis.FileUI;
import haxe.Log;
import frontend.model.FilesModel;
import frontend.views.uis.FolderUI;
import frontend.views.base.View;
import js.Dom;
import js.Lib;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FilesView extends View
{
	
	public function new()
	{
		_view = Lib.document.createElement("div");
		_view.style.cssFloat = "left";	
		
		super();
	}
	
	public function setList( data: Array<FileVO>) 
	{
		clear();
		
		for (i in 0...data.length) 
		{
			var file : FileUI = new FileUI(data[i]);
			_view.appendChild(file.view);
		}
	}
}