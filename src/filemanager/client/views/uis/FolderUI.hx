package filemanager.client.views.uis;
import cocktail.core.unit.UnitManager;
import filemanager.client.models.Locator;
import filemanager.client.views.base.View;
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
	
	public function new( isFull: Bool, isDescendant : Int, inTitle : String, SLPId:String ) 
	{
		Locator.registerSLDisplay(SLPId, this, "FolderUI");
		
		var viewDom = Lib.document.createElement("span");
		viewDom.className = "draggable-dropzone";
		
		_title = inTitle;
		_isFull = isFull;
		_isDescendant = isDescendant;
		
		isSelected = false;
		isOpen = false;
		isVisible = true;
		
		subFolders = new Array<FolderUI>();
		
		super(viewDom, SLPId);
		
		setStyle();
	}
	
	private function setStyle() : Void
	{
		// clear the container.
		clear();
		
		// if the folder is not visible, set its height to zero, and apply the same property to its children
		if ( !isVisible ) {
			rootElement.style.height = "0px";	
			isSelected = false;
			for (i in 0...subFolders.length) 
			{
				subFolders[i].isVisible = false;
				subFolders[i].refresh();
			}
			return;
		}
		else {
			// if the folder is visible && isOpen -> show the subFolders
			if ( isOpen) {
				for (i in 0...subFolders.length) 
				{
					subFolders[i].isVisible = true;
					subFolders[i].refresh();
				}
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
		
		// TODO use the css
		
		var title = Lib.document.createTextNode(_title);
		rootElement.appendChild(title);
		
		rootElement.style.backgroundPosition = "left center";
		rootElement.style.backgroundRepeat = "no-repeat";
		rootElement.style.paddingLeft = "50px";
		rootElement.style.display = "block";
		rootElement.style.marginTop = "5px";
		rootElement.style.height = null;	
		rootElement.style.width = "250px";	
		rootElement.style.cursor = UnitManager.getCSSCursor(Cursor.pointer);
		
		rootElement.style.marginLeft = Std.string( _isDescendant * 20 +"px");
	}

	public function refresh () : Void {
		setStyle();
	}
}