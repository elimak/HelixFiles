package filemanager.client.views.uis;
import cocktail.core.unit.UnitManager;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
import haxe.Log;
import js.Lib;
import cocktail.core.style.StyleData;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FolderUI extends View
{
	private var _title	 		: String;
	private var _isFull 		: Bool;
	private var _isDescendant 	: Int; // children's generation from the root folder
	
	public var isOpen 			: Bool;
	public var isSelected		: Bool;
	public var isVisible		: Bool;
	
	public var subFolders 	: Array<FolderUI>;
	
	public function new( isFull: Bool, isDescendant : Int, inTitle : String, SLPId:String ) {
		
		Locator.registerSLDisplay(SLPId, this, "FolderUI");
		
		var viewDom = Lib.document.createElement("div");
		
		_title = inTitle;
		_isFull = isFull;
		_isDescendant = isDescendant;
		
		isSelected = isOpen = false;
		isVisible = true;
		
		subFolders = new Array<FolderUI>();
		
		super(viewDom, SLPId);
	}
	
	private function setStyle() : Void {
		
		// clear the container.
		clear();
		
		// if the folder is not visible, set its height to zero, and apply the same property to its children
		if ( !isVisible ) {
			rootElement.style.height = "0px";	
			isSelected = false;
			for (i in 0...subFolders.length) {
				subFolders[i].isVisible = false;
				subFolders[i].refresh();
			}
			return;
		}
		else {
			for (i in 0...subFolders.length) {
				subFolders[i].isVisible = isOpen;
				subFolders[i].refresh();
			}
		}
		// if the folder is visible, show the right icon
		switch( true )
		{
			case (isSelected == true && _isFull == true && isOpen == true ) 	: rootElement.style.backgroundImage = "url('imgs/selected_open_full.png')";
			case (isSelected == true && _isFull == false && isOpen == true ) 	: rootElement.style.backgroundImage = "url('imgs/selected_open_empty.png')";
			case (isSelected == true && _isFull == false && isOpen == false) 	: rootElement.style.backgroundImage = "url('imgs/selected_closed_empty.png')";
			case (isSelected == true && _isFull == true && isOpen == false) 	: rootElement.style.backgroundImage = "url('imgs/selected_closed_full.png')";
				
			case (isSelected == false && _isFull == true && isOpen == true) 	: rootElement.style.backgroundImage = "url('imgs/notselected_open_full.png')";
			case (isSelected == false && _isFull == true && isOpen == false) 	: rootElement.style.backgroundImage = "url('imgs/notselected_closed_full.png')";
			case (isSelected == false && _isFull == false && isOpen == false) 	: rootElement.style.backgroundImage = "url('imgs/notselected_closed_empty.png')";
			case (isSelected == false && _isFull == false && isOpen == true) 	: rootElement.style.backgroundImage = "url('imgs/notselected_open_empty.png')";
		}

		var title = Lib.document.createTextNode(_title);
		rootElement.appendChild(title);
		rootElement.className = "draggable-dropzone folderUI";
		
		rootElement.style.cursor = UnitManager.getCSSCursor(Cursor.pointer);
		rootElement.style.height = null;
		rootElement.style.marginLeft = Std.string( 5 + _isDescendant * 20 +"px");
	}

	public function refresh ( ?isFull : Bool) : Void {
		if (isFull != null) 
			_isFull = isFull;
		setStyle();
	}
}