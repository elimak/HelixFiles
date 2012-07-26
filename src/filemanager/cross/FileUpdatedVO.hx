package filemanager.cross;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FileUpdatedVO 
{

	public function new() { }
	public var filepath : String;
	public var success : Bool;
	public var error : String;
		
	public function toString() :  String {
		var l_result = "SimpleResponseVO {\n";
		l_result += "\t filepath: " + filepath + "\n"; 
		l_result += "\t success: " + success + "\n"; 
		l_result += "\t error: " + error + "\n"; 
		l_result += "}\n"; 
		return l_result;
	}
}