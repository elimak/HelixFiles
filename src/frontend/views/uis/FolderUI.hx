package frontend.views.uis;
import cocktail.core.unit.UnitManager;
import haxe.Log;
import js.Lib;
import js.Dom;
import frontend.styles.FontPrefinedStyle;
import frontend.views.base.View;
import cocktail.core.style.StyleData;
import cocktail.core.unit.UnitData;
//import frontend.views.uis.FolderUI;

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
	
	public function new( isFull: Bool, isDescendant : Int, inTitle : String )
	{
		_view = Lib.document.createElement("span");
		_title = inTitle;
		_isFull = isFull;
		_isDescendant = isDescendant;
		isSelected = false;
		isOpen = false;
		isVisible = true;
		
		subFolders = new Array<FolderUI>();
		
		setStyle();
		
		super();
	}
	
	private function setStyle() : Void
	{
		// clear the container.
		clear();
		
		// if the folder is not visible, set its height to zero, and apply the same property to its children
		if ( !isVisible ) {
			_view.style.height = "0px";	
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
			case (isSelected == true && _isFull == true && isOpen == true ) 	: _view.style.backgroundImage = "url('imgs/selected_open_full.png')";
			case (isSelected == true && _isFull == false && isOpen == true ) 	: _view.style.backgroundImage = "url('imgs/selected_open_empty.png')";
			case (isSelected == true && _isFull == false && isOpen == false) 	: _view.style.backgroundImage = "url('imgs/selected_closed_empty.png')";
			case (isSelected == true && _isFull == true && isOpen == false) 	: _view.style.backgroundImage = "url('imgs/selected_closed_full.png')";
				
			case (isSelected == false && _isFull == true && isOpen == true) 	: _view.style.backgroundImage = "url('imgs/notselected_open_full.png')";
			case (isSelected == false && _isFull == true && isOpen == false) 	: _view.style.backgroundImage = "url('imgs/notselected_closed_full.png')";
			case (isSelected == false && _isFull == false && isOpen == false) 	: _view.style.backgroundImage = "url('imgs/notselected_closed_empty.png')";
			case (isSelected == false && _isFull == false && isOpen == true) 	: _view.style.backgroundImage = "url('imgs/notselected_open_empty.png')";
		}
		
		var title = Lib.document.createTextNode(_title);
		_view.appendChild(title);
		
		_view.style.backgroundPosition = "left center";
		_view.style.backgroundRepeat = "no-repeat";
		_view.style.paddingLeft = "50px";
		_view.style.display = "block";
		_view.style.marginTop = "5px";
		_view.style.height = null;	
		_view.style.width = "250px";	
		_view.style.cursor = UnitManager.getCSSCursor(Cursor.pointer);
		
		_view.style.marginLeft = Std.string( _isDescendant * 20 +"px");
		
		FontPrefinedStyle.getFontStyle(_view, EFontStyle.BODY);
	}

	public function refresh () : Void {
		setStyle();
	}
}