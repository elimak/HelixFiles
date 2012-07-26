package frontend.views.uis;
import cocktail.core.unit.UnitManager;
import dto.FileVO;
import frontend.views.base.View;
import js.Lib;
import cocktail.core.style.StyleData;
import cocktail.core.unit.UnitData;
import frontend.styles.FontPrefinedStyle;
import haxe.Log;
import js.Dom;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 * 
 * Can be File of Folder - All items listed in a folder.
 */

class FileUI extends View
{

	public function new( data: FileVO ) 
	{
		_view = Lib.document.createElement("span");
		var nameFile = Lib.document.createTextNode(data.name);
		_view.appendChild(nameFile);
		
		setStyle(data);
		
		super();
	}
	
	private function setStyle(data:FileVO) 
	{
		_view.style.backgroundPosition = "left center";
		_view.style.backgroundRepeat = "no-repeat";
		_view.style.paddingLeft = "50px";
		_view.style.display = "block";
		_view.style.paddingTop = "2px";
		_view.style.width = "250px";	
		_view.style.cursor = UnitManager.getCSSCursor(Cursor.pointer);
		_view.style.backgroundImage = "url('imgs/icons/"+data.extension+".png')";
		_view.style.height = "25px";
		
		_view.style.marginLeft = "20px";
		
		FontPrefinedStyle.getFontStyle(_view, EFontStyle.BODY);	
	}
	
}