package;

import php.Lib;
import php.Web;
import server.FileExplorer;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class PhpExplorer 
{

	private var _explorerService : FileExplorer;
	
	static function main() 
	{
		new PhpExplorer();
	}
	
	private function new()
	{
		var params = php.Web.getParams();
		
		// set the root folder
        var folderpath = params.exists('folderpath') ? params.get('folderpath') : '../files';
		
		// service can be: folders, files
        var service = params.exists('service') ? params.get('service') : 'folders';
		
		//
		_explorerService = new FileExplorer();
		
		switch (service)
		{
			case "folders"	: Lib.print(_explorerService.getFolders(folderpath));
			case "files"	: Lib.print(_explorerService.getFiles(folderpath));
		}
		
	}
}