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
	var file				: Dynamic;
	var validateFileName	: Dynamic;

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
		
		for ( file in files ) {
			var fileToUpload : FileToUpload = { file : file, validateFileName:validateFileName(file.name), initialized : false, progressPercent : 0, completed : false, started: false };
			Log.trace("FilesModel - uploadSelectedFiles() "+validateFileName(file.name));
			_uploadsQueue.set(validateFileName(file.name), fileToUpload);
		}
		for (key in _uploadsQueue.keys()) 
		{
			var filehelper : FileToUpload = cast _uploadsQueue.get(key);
			if ( !filehelper.initialized ) {
				_api.backupAsTemporary(filehelper.validateFileName, handleUploadInitialized);
				_uploadsQueue.get(filehelper.validateFileName).initialized = true;
				onUploadUpdate(_uploadsQueue.get(filehelper.validateFileName));
			}
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
	private function handleUploadInitialized(response: FileUpdatedVO): Void {
		
		if( _uploadsQueue.exists(response.filepath)) {
			
			var uploadWorker = new Worker('fileupload.js');
			uploadWorker.onmessage = handleUploadProgress;
			uploadWorker.onerror = handleError;
			var dataMsg = { file: _uploadsQueue.get(response.filepath).file, validName:  validateFileName(_uploadsQueue.get(response.filepath).file.name) };
			uploadWorker.postMessage( dataMsg);
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
				_uploadsQueue.get(response.result.filename).progressPercent = response.result.percentuploaded;
				onUploadUpdate(_uploadsQueue.get(response.result.filename));
				
			case "completed": 
				var tempFile : String = response.result.filename;
				_api.deleteTempFile(response.result.filename, function( file: FileUpdatedVO ) {
									onUploadUpdate (_uploadsQueue.get(response.result.filename));
								});
				_uploadsQueue.get(response.result.filename).completed = true;
				onUploadUpdate(_uploadsQueue.get(response.result.filename));
				//_uploadsQueue.remove(response.result.filename);
				
			case "started"	: 
				_uploadsQueue.get(response.result.filename).started = true;
				onUploadUpdate(_uploadsQueue.get(response.result.filename));
				
			case "error"	: 
				Log.trace("FilesModel - handleUploadProgress() - response: error "+response.error);
		}
	}	
	
	private function validateFileName ( filename: String ) : String {
		// TODO: to complete
		filename = StringTools.replace(filename, " ", "");
		filename = StringTools.replace(filename, "$", "");
		filename = StringTools.replace(filename, "+", "");
		return filename;
	}
	
// ------------------------ // 
// FILE MANAGEMENT
// ------------------------ //

// PUBLIC

	// clicking button delete when folder or file is selected -> actually move the files into the garbage
	// Todo: keep track of the initial path is we need to restaure the file or folder
	public function deleteFile ( filePath: String ) { }
	
	// using drag and drop
	public function moveFile ( filePath: String, newPath: String ) { }
	
	// keep data for pasting later
	public function copyFile ( filePath: String ) { }
	
	// only available when a file was first copied
	public function pasteFile ( newPath: String ) { }
	
	// TODO: we need a dialog panel to implement this
	public function renameFile ( filePath: String, newName: String) { }
	
// ------------------------ // 
// UPLOAD MANAGEMENT
// ------------------------ //

	public function onCancelUpload ( trackID: String ) : Void {
		// find the ref in the queue and remove it
		// find the worker and stop it?
		// restaure the temp file if there is one
		// update the uis when the upload was cancelled
		
		Log.trace("FilesModel - onCancelUpload() "+trackID);
	}
}