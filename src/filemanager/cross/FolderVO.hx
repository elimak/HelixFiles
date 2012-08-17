package filemanager.cross;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FolderVO implements Dynamic {
	
	public var name	: String;
	public var path	: String;
	public var open	: Bool;
	public var childFolders	: Array<FolderVO>;
	public var children	: Int;
	public var success	: Bool;
	public var error	: String;

	public function new(){
		open = false;
	}

	public function toString() :  String {
		var l_result = "FileVO {\n";
		l_result += "\t name: " + name + "\n"; 
		l_result += "\t path: " + path + "\n"; 
		l_result += "\t childFolders: " + childFolders.join(",") + "\n"; 
		l_result += "\t children: " +children + "\n"; 
		l_result += "\t success: " +success + "\n"; 
		l_result += "\t error: " +error + "\n"; 
		return l_result;
	}
}