package dto;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FolderVO implements Dynamic
{
	public var name: String;
	public var path: String;
	public var open: Bool;
	public var children:Array<FolderVO>;
	
	public function new( /*dataString : Object */)
	{
		open = false;
		/*name = Reflect.field(dataString, "name");
		path = Reflect.field(dataString, "path");
		children = Reflect.field(dataString, "path");*/
	}

	public function toString() :  String {
		var l_result = "FileVO {\n";
		l_result += "\t name: " + name + "\n"; 
		l_result += "\t path: " + path + "\n"; 
		l_result += "\t children: " + children.join(",") + "\n"; 
		return l_result;
	}
}