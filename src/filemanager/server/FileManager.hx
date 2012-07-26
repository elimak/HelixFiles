package filemanager.server;
import php.Lib;
import haxe.remoting.HttpConnection;
import haxe.remoting.Context;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FileManager 
{
	public function new() {

		var api:Api;
		try{
			api = new Api();
		}catch(e:Dynamic)
		{
 			Lib.print("fail");
			return;
		}
		
		var context = new Context(); 
		context.addObject("api",api); 
		try{
			if (HttpConnection.handleRequest(context)) {
			    return;
			}
		}catch(e:Dynamic)
		{
			trace( "error: "+e);
		}
	}
		
	public static function main() {
		new FileManager();
	}
}