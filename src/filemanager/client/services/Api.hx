package filemanager.client.services;
import filemanager.cross.FileUpdatedVO;
import filemanager.cross.FileVO;
import filemanager.cross.FolderVO;
import haxe.Log;
import haxe.remoting.HttpAsyncConnection;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 * 
 * Gateway to communicate with the server side.
 * The main advantage of using remoting services is to have a clean casting of the data transfered
 * The data are casted against the VO stored in the folder 'cross' - Both Server side classes and front end side use them
 */

class Api 
{
	public static inline var GATEWAY_URL:String = "server/index.php";
	
	public function new() {}
	
/**
 * Remoting call to server to retrieve the whole folder's tree 
 * @param	folderpath
 * @param	onSuccess
 * @param	?onError
 */
	public function getTreeFolder ( folderpath : String, onSuccess: FolderVO->Void, ?onError: Dynamic->Void ) : Void {
		
		Log.trace("Api - getTreeFolder() "+folderpath);
		var cnx = HttpAsyncConnection.urlConnect(GATEWAY_URL);
		if (onError != null) cnx.setErrorHandler( onError );
		else cnx.setErrorHandler( defaultOnError );
			
		cnx.api.getTreeFolder.call([folderpath], onSuccess);
	}

/**
 * Remoting call to server to retrieve the list of files in the current folder's path
 * @param	folderpath
 * @param	onSuccess
 * @param	?onError
 */
	public function getFiles (folderpath: String, onSuccess: Array<FileVO>->Void, ?onError: Dynamic->Void) : Void {
		
		var cnx = HttpAsyncConnection.urlConnect(GATEWAY_URL);
		if (onError != null) cnx.setErrorHandler( onError );
		else cnx.setErrorHandler( defaultOnError );
			
		cnx.api.getFiles.call([folderpath], onSuccess);
	}
	
/**
 * Remoting call to server to backup as temporary a file
 * @param	fullpath
 * @param	onSuccess
 * @param	?onError
 */
	public function backupAsTemporary (fullpath: String, onSuccess: FileUpdatedVO->Void, ?onError: Dynamic->Void) : Void {
		
		var cnx = HttpAsyncConnection.urlConnect(GATEWAY_URL);
		if (onError != null) cnx.setErrorHandler( onError );
		else cnx.setErrorHandler( defaultOnError );
			
		cnx.api.backupAsTemporary.call([fullpath], onSuccess);
	}	
	 
/**
 * Remoting call to server to delete a file
 * @param	fullpath
 * @param	onSuccess
 * @param	?onError
 */
	public function deleteTempFile (fullpath: String, onSuccess: FileUpdatedVO->Void, ?onError: Dynamic->Void) : Void {
		
		var cnx = HttpAsyncConnection.urlConnect(GATEWAY_URL);
		if (onError != null) cnx.setErrorHandler( onError );
		else cnx.setErrorHandler( defaultOnError );
			
		cnx.api.deleteTempFile.call([fullpath], onSuccess);
	}
	
/**
 * Remoting call to server to move the location of a file
 * @param	path
 * @param	path1
 */
	public function moveFileToFolder( filePath:String, fileName: String, folderPath:String, onSuccess: Bool->Void, ?onError: Dynamic->Void ) : Void {
		var cnx = HttpAsyncConnection.urlConnect(GATEWAY_URL);
		if (onError != null) cnx.setErrorHandler( onError );
		else cnx.setErrorHandler( defaultOnError );
			
		cnx.api.moveFileToFolder.call([filePath, fileName, folderPath], onSuccess);
	}
	
/**
 * Error callback 
 * @param	err
 */
	private function defaultOnError(err) : Void {
		trace("Error (API default error handler) : "+Std.string(err));
	}
}