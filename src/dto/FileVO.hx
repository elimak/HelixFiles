package dto;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FileVO implements Dynamic
{
	public function new() {}
	
	public var name: String;
	public var path: String;
	public var extension: String;
	public var size: Int;
	public var accessed: String;
	public var created: String;
	public var modified: String;
	
	public function toString() :  String {
		var l_result = "FileVO {\n";
		l_result += "\t name: " + name + "\n"; 
		l_result += "\t path: " + path + "\n"; 
		l_result += "\t extension: " + extension + "\n"; 
		l_result += "\t size: " + size + "\n"; 
		l_result += "\t accessed: " + accessed + "\n"; 
		l_result += "\t created: " + created + "\n"; 
		l_result += "\t modified: " + modified + "\n"; 
		l_result += "}\n"; 
		return l_result;
	}
}