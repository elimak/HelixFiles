package filemanager.client.models;
import filemanager.client.services.Api;
import filemanager.cross.FileVO;
import filemanager.cross.FolderVO;
import filemanager.cross.FileUpdatedVO;
import haxe.Json;
import haxe.Log;
import js.Dom;
import js.Worker;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

typedef FileToUpload = {
	var file			: Dynamic;

	var started			: Bool;
	var initialized		: Bool;
	var progressPercent	: Float;
	var completed		: Bool;
}

typedef UploadProgress = {
	var result 	: Dynamic<{filename: String,filesize: Int, percentuploaded: Float, chunksize: Float}>;
	var type	: String;
}
typedef UploadComplete = {
	var result 	: Dynamic<{filename: String,filesize: Int}>;
	var type	: String;
}
typedef UploadStarted = {
	var result 	: Dynamic<{filename: String}>;
	var type	: String;
}
typedef UploadError = {
	var error: String;
}
 
class FilesModel 
{
	private var _api : Api;
	private var _uploadsQueue 	: Hash<FileToUpload>;
	
	public var onUploadUpdate 	: FileToUpload->Void;
	
	public function new() {
		_api = new Api();
		_uploadsQueue = new Hash<FileToUpload>();
	}
	
// ------------------------ // 
// DEFAULT ERROR HANDLERS
// ------------------------ //
/**
 * Default errors handler with the remoting calls - all failures with the Api.hx will be routed here
 * @param	e
 */
	private function handleError( e: Dynamic) {
		Log.trace("FilesModel - handleError() ERROR: Line "+ e.lineno + " in " + e.filename + ": " + e.message);
	}
		
// ------------------------ // 
// READ FOLDERS + FILES
// ------------------------ //

// PUBLIC

/**
 * here the Model is only bridging the access to the server Api to read the files and the Folders
 * @param	folderpath
 * @param	onSuccess
 */
	public function getTreeFolder ( folderpath : String, onSuccess: FolderVO->Void ) : Void {
		_api.getTreeFolder(folderpath, onSuccess);
	}
	
	public function getFiles ( folderpath: String, onSuccess: Array<FileVO>->Void ) : Void {
		_api.getFiles(folderpath, onSuccess);
	}
	
	public function browseFiles( evt: MouseEvent) : Void {
		
	}
	
// ------------------------ // 
// UPLOAD
// ------------------------ //

// PUBLIC

/**
 * We list all the files that were dropped for upload and we start their initialisation.
 * to avoid overriding old files, before we are sure that the new file is completely uploaded, we rename them on 'oldName_temp' file
 * @param	files
 */
	public function uploadSelectedFiles ( files: Array<Dynamic> ) : Void {
		for ( file in files ) 
		{
			var fileToUpload : FileToUpload = { file : file, initialized : false, progressPercent : 0, completed : false, started: false};
			_uploadsQueue.set(file.name, fileToUpload);
		}
		for (key in _uploadsQueue.keys()) 
		{
			var filehelper : FileToUpload = cast _uploadsQueue.get(key);
			if ( !filehelper.initialized ) {
				_api.backupAsTemporary(filehelper.file.name, handleUploadInitialized);
			}
			_uploadsQueue.get(filehelper.file.name).initialized = true;
			onUploadUpdate(_uploadsQueue.get(filehelper.file.name));
		}
	}
	
// PRIVATE

/**
 * Handle the initialization: 
 * The initialization consists on backing up a previous version of the file
 * (if there is one existing) before the upload of the new file.
 * So if the transfer fails, we wont override the initial file.
 * The upload starts right after the completion of this step.
 * @param	response
 */
	private function handleUploadInitialized(response: FileUpdatedVO): Void
	{
		if( _uploadsQueue.exists(response.filepath)) {
			_uploadsQueue.get(response.filepath).initialized = true;
			
			var uploadWorker = new Worker('fileupload.js');
			uploadWorker.onmessage = handleUploadProgress;
			uploadWorker.onerror = handleError;
			uploadWorker.postMessage([_uploadsQueue.get(response.filepath).file]);
		}
	}
	
/**
 * The result received is of type JSON
 * we parse them againt the typedef declared above the class
 * @param	msg
 */
	private function handleUploadProgress( msg: Dynamic ) : Void {
		
		var response: Dynamic = Json.parse(msg.data);
		
		switch (response.type) {
			case "progress"	: 
				_uploadsQueue.get(response.result.filepath).progressPercent = response.result.percentuploaded;
				onUploadUpdate(_uploadsQueue.get(response.filepath));
				
			case "completed": 
				var tempFile : String = response.result.filename;
				_api.deleteFile(response.result.filename, function( file: FileUpdatedVO ) {
									onUploadUpdate (_uploadsQueue.get(response.result.filepath));
								});
				_uploadsQueue.get(response.result.filepath).completed = true;
				onUploadUpdate(_uploadsQueue.get(response.result.filepath));
				_uploadsQueue.remove(response.result.filepath);
				
			case "started"	: 
				_uploadsQueue.get(response.result.filepath).started = true;
				onUploadUpdate(_uploadsQueue.get(response.result.filepath));
				
			case "error"	: 
				Log.trace("FilesModel - handleUploadProgress() - response: error "+response.error);
		}
	}	
	
// ------------------------ // 
// FILE MANAGEMENT
// ------------------------ //

// PUBLIC

	public function deleteFile (){}
	public function moveFile (){}
	public function copyFile (){}
	public function renameFile (){}
}