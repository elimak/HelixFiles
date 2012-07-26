package frontend.model;
import haxe.Json;
import frontend.services.JSONLoader;
import dto.FolderVO;
import dto.FileVO;
import haxe.Log;


/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FilesModel 
{

	
	public function new() {}
	
	public function getTreeFolder ( folderpath : String, callBack: String->Void ) : Void
	{
		var url: String = "server/?service=folders&folderpath=" + folderpath; 
		var treeLoader = new JSONLoader();
		treeLoader.loadJSON(url);
		treeLoader.onLoad = callBack;
	}
	
	public function getFiles (folderpath: String, callBack: String->Void) : Void
	{
		var url: String = "server/?service=files&folderpath=" + folderpath; 
		var filesListLoader = new JSONLoader();
		filesListLoader.loadJSON(url);
		filesListLoader.onLoad = callBack;
	}
}