package filemanager.client.views.uis;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import cocktail.core.unit.UnitManager;
import filemanager.cross.FileVO;
import cocktail.core.style.StyleData;
import slplayer.ui.interaction.Draggable;

import js.Dom;
import js.Lib;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 * 
 * Can be File of Folder - All items listed in a folder.
 */

class FileUI extends View
{

	public function new( data: FileVO, SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, "FileUI");
		
		var viewDom = Lib.document.createElement("div");
		var nameFile = Lib.document.createTextNode(data.name);
		
		viewDom.appendChild(nameFile);
		viewDom.className = "fileUI smallFont";

		super(viewDom, SLPId);
		
		setStyle(data);
		makeDraggable();
	}
	
	private function makeDraggable() 
	{
		var draggable : Draggable = new Draggable(this.rootElement, SLPlayerInstanceId);
		draggable.init();
	}
	
	private function setStyle(data:FileVO) 
	{
		rootElement.style.cursor = UnitManager.getCSSCursor(Cursor.pointer);
		rootElement.style.backgroundImage = "url('imgs/icons/" + data.extension + ".png')";
	}
}