package filemanager.server;
import filemanager.cross.FileVO;
import filemanager.cross.FolderVO;
import haxe.Json;
import php.FileSystem;
import sys.FileStat;
import sys.io.File;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 * 
 * Is used in association with FileExplorer to create an object describing the files and folders tree into 
 * The object are casted into: FileVO and FolderVO before being sent to the client side.
 */
 
class FileInfoHelper
{
	public var name : String;
	public var path : String;
	
	public var isDir : Bool;
	public var subList : Array<FileInfoHelper>;
	
	public function new( inName: String, inFullPath:String, inIsDir: Bool ) {
		subList = new Array<FileInfoHelper>();
		name = inName;
		path = inFullPath + "/" + name;
		isDir = inIsDir;
	}

	private function createFolderTree(data: FolderVO, inFolderSublist : Array<FileInfoHelper>) : FolderVO {
		if ( inFolderSublist.length > 0 ) {
			for ( i in 0...inFolderSublist.length) {
				var subFolder : FolderVO = new FolderVO();
				subFolder.name = inFolderSublist[i].name;
				subFolder.path = inFolderSublist[i].path;
				subFolder.childFolders = new Array<FolderVO>();
				subFolder.children = FileSystem.readDirectory( subFolder.path ).length;
				data.childFolders.push(createFolderTree(subFolder, inFolderSublist[i].subList));
			}
		}
		return data;
	}
	
	public function writeDirectoryObject() : FolderVO{
		var data : FolderVO = new FolderVO();
		data.name = this.name;
		data.path = this.path;
		data.childFolders = new Array<FolderVO>();
		data.children = FileSystem.readDirectory( this.path ).length;
		return createFolderTree(data, subList);
	}
	
	public function getFileInfo() : FileVO {
		var extension = name.split(".");
		var info : FileVO = new FileVO();
		info.name = this.name;
		info.path = this.path;
		info.extension = extension[extension.length - 1];
		info.size = File.getBytes(path).length;
		info.accessed = "";
		info.created = "";
		info.modified = "";

		try {
			var stat : FileStat = FileSystem.stat(path);
			info.accessed = FileSystem.stat(path).atime.toString();
			info.created = FileSystem.stat(path).ctime.toString();
			info.modified = FileSystem.stat(path).mtime.toString();
		}
		catch( msg : String ) {
			//trace("Error occurred: " + msg);
		}
		return info;
	}
	
	public function toString() :  String {
		var l_result = "- ToString {\n";
		l_result += "\t name: " + name + "\n"; 
		l_result += "\t path: " + path + "\n"; 
		l_result += "\t subList: " + subList.join(",") + "\n"; 
		l_result += "}\n"; 
		return l_result;
	}
}