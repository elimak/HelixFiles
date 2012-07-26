package frontend.styles;
import cocktail.core.style.adapter.Style;
import cocktail.core.style.CSSConstants;
import cocktail.core.unit.UnitManager;
import haxe.Log;
import js.Dom;
import cocktail.core.style.CoreStyle;
import cocktail.core.style.StyleData;
import cocktail.core.unit.UnitData;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FontPrefinedStyle 
{

	public function new() {}
		
	public static function getFontStyle ( domElement: HtmlDom, type: EFontStyle ) : Void
	{		
		switch(type)
		{
			case EFontStyle.BODY:
				domElement.style.fontSize = UnitManager.getCSSFontSize(FontSize.absoluteSize(FontSizeAbsoluteSize.small));
				domElement.style.fontWeight = UnitManager.getCSSFontWeight(FontWeight.normal);
				
			case EFontStyle.BUTTON: 
				domElement.style.fontSize = UnitManager.getCSSFontSize(FontSize.absoluteSize(FontSizeAbsoluteSize.small));
				domElement.style.fontWeight = UnitManager.getCSSFontWeight(FontWeight.bold);
				
			case EFontStyle.HEADLINE: 
				domElement.style.fontSize = UnitManager.getCSSFontSize(FontSize.absoluteSize(FontSizeAbsoluteSize.medium));
				domElement.style.fontWeight = UnitManager.getCSSFontWeight(FontWeight.bold);
				
			case EFontStyle.SUBHEAD: 
				domElement.style.fontSize = UnitManager.getCSSFontSize(FontSize.absoluteSize(FontSizeAbsoluteSize.medium));
				domElement.style.fontWeight = UnitManager.getCSSFontWeight(FontWeight.normal);
				
			case EFontStyle.SMALLPRINT: 
				domElement.style.fontSize = UnitManager.getCSSFontSize(FontSize.absoluteSize(FontSizeAbsoluteSize.xSmall));
				domElement.style.fontWeight = UnitManager.getCSSFontWeight(FontWeight.normal);
				
			case EFontStyle.OVERSIZED: 
				domElement.style.fontSize = UnitManager.getCSSFontSize(FontSize.absoluteSize(FontSizeAbsoluteSize.large));
				domElement.style.fontWeight = UnitManager.getCSSFontWeight(FontWeight.bold);
		}
	}
}

enum EFontStyle 
{
	BUTTON;
	BODY;
	HEADLINE;
	SUBHEAD;
	SMALLPRINT;
	OVERSIZED;
}
