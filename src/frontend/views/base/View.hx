package frontend.views.base;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

import js.Dom;

class View 
{
	private var _view 	: HtmlDom;
	
	public function new() 
	{
	}
		
	private function get_view()	: HtmlDom 
	{
		return _view;
	}
	
	public var view(get_view, null):HtmlDom;
	
	private function clear() 
	{
		var childNodes = _view.childNodes.length;
		
		while (_view.hasChildNodes()) {
			var child: HtmlDom = _view.childNodes[0];
			_view.removeChild(child);
		}
	}
}