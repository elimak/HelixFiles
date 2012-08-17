package filemanager.server;
import filemanager.cross.FileVO;
import filemanager.cross.FolderVO;
import filemanager.cross.FileUpdatedVO;
import haxe.Log;
import php.FileSystem;
import php.io.File;

/** 
 * Remoting API server-side to manage the files and folders
 * @author valerie.elimak - blog.elimak.com
 */

typedef FileHelper = {
	var extension	: String;
	var filename	: String;
	var path		: String;
}

class Api {
	
	private var _explorer 	: FileExplorer;
	private static inline var FILES_FOLDER : String = "../files";
	
	public function new() {
		_explorer = new FileExplorer();
	}
	
/**
 * returns an object describing the tree of folder under the root directory
 * @param	folderpath
 * @return
 */
	public function getTreeFolder ( folderpath : String) : Null<FolderVO> {
		return _explorer.getFolders(folderpath);
	}	
	
/**
 * return an object describing the list of file contained into a specific folder
 * @param	folderpath
 * @return
 */
	public function getFiles ( folderpath : String) : Null<Array<FileVO>> {
		return _explorer.getFiles(folderpath);
	}
	
/**
 * Back up files that are already on the server when the user is uploading
 * new files on the same location with the same name and extension
 * @param	filepath
 * @return
 */
	public function backupAsTemporary ( filepath : String ) : FileUpdatedVO {
		var response	: FileUpdatedVO = new FileUpdatedVO();
		response.filepath = filepath;
		
		var file		: FileHelper = getFileHelper (filepath);
		var oldFile 	: String = file.path +"/"+ file.filename + "." + file.extension;
		var tempFile 	: String = file.path +"/"+ file.filename + "_temp." + file.extension;
		
		if ( FileSystem.exists(oldFile) ){
			FileSystem.rename(oldFile, tempFile);
			response.success = FileSystem.exists(tempFile);
			if ( !response.success )
				response.error = "failed to back up " + oldFile;
		}
		else{
			response.success = true; 
		}
		return response;
	}
	
/**
 * When renaming a file, we send back the whole folder tree re-loaded 
 * @param	filePath
 * @param	newName
 * @return
 */
	public function renameFile ( filePath: String, newName: String) : FolderVO  { 
		var response	 : FileUpdatedVO = new FileUpdatedVO();
		var file		 : FileHelper = getFileHelper (filePath);
		
		var newNamedFile : String = file.path +"/" + newName;
		newNamedFile += (file.extension != "")? "." + file.extension : "";
		var validPath = validatePath(newNamedFile);
		FileSystem.rename(filePath, validPath);
		
		var response	 : FolderVO = getTreeFolder(FILES_FOLDER);
		response.success = FileSystem.exists(validPath);

		if ( !response.success ) response.error = "the file " + filePath + " could not be renamed with the new name " + newName;
		return response;
	}
	
/**
 * When uploading files, we create a backup if a file named the same was already on the server on the same location.
 * When the upload is finished, and successful, we delete the temporary backup
 * @param	filepath
 * @return
 */
	public function deleteTempFile ( filepath : String ) : FileUpdatedVO {
		var response	: FileUpdatedVO = new FileUpdatedVO();
		var file		: FileHelper = getFileHelper (filepath);
		var tempFile 	: String = file.path +"/"+ file.filename + "_temp." + file.extension;
		response.filepath = filepath;
		
		if ( FileSystem.exists(tempFile) ){
			FileSystem.deleteFile(tempFile);
			response.success = !FileSystem.exists(tempFile);
		}
		else {
			response.success = true;
		}
		if ( !response.success ) response.error = "the file could not be deleted";
	
		return response;
	}	
	
/**
 * Delete the files contained into a folder recursively
 * @param	path
 */
	private function unlink( path : String ) : Void { 
		if( FileSystem.exists( path ) )  { 
			if( FileSystem.isDirectory( path ) ) { 
				for( entry in FileSystem.readDirectory( path ) ) { 
					unlink( path + "/" + entry ); 
				} 
				FileSystem.deleteDirectory( path ); 
			} 
			else { 
				FileSystem.deleteFile( path ); 
			} 
		} 
	} 
	
/**
 * Delete the folder and returns the whole folder's tree after re-loading it.
 * @param	filepath
 * @return
 */
	public function deleteFile ( filepath : String ) : FolderVO {
		unlink(filepath);
		var response	: FolderVO = getTreeFolder(FILES_FOLDER);
		return response;
	}	
	
/**
 * create a new folder and reload the whole folder's tree.
 * @param	folderpath
 * @return
 */
	public function createFolder ( folderpath : String ) : FolderVO {
		var validFolder = validatePath(folderpath);
		FileSystem.createDirectory(validFolder);
		var response	: FolderVO = getTreeFolder(FILES_FOLDER);
		return response;
	}
	
/**
 * 
 * @param	filePath
 * @param	fileName
 * @param	folderPath
 * @return
 */
	private function moveFileToFolder (filePath: String, fileName: String, folderPath: String ) : Bool {
		// return if the file is dropped where it already belongs
		if ( filePath == (folderPath + "/" + fileName) ) return true;
		
		var newPath = validatePath(folderPath + "/" + fileName);
		File.copy(filePath, newPath);
		// if the copy was successful, delete the initial file
		if ( FileSystem.exists(newPath) && FileSystem.exists(filePath)){
			FileSystem.deleteFile(filePath);
			return true;
		}
		return false;
	}
	
/**
 * validate the filepath as following:
 * if there is already a file named the same,
 * it will add (n) at the end of the folder or just before the extension for a file's name
 * @param	filePath
 * @return
 */
	private function validatePath(filePath:String) : String {
		
		if ( FileSystem.exists(filePath)) {
			if( FileSystem.isDirectory(filePath)){
				for (i in 1...100) {
					if ( !FileSystem.exists(filePath + "(" + i + ")") ) {
						return filePath + "(" + i + ")";
					}
				}
			}
			else {
				var splittedName = filePath.split(".");
				var extension = splittedName.pop();
				var fileName = splittedName.join(".");
				for (i in 1...100) {
					if ( !FileSystem.exists(fileName + "(" + i + ")."+extension) ) {
						return fileName + "(" + i + ")."+extension;
					}
				}
			}
		}
		return filePath;
	}
	
/**
 * split the file's path into filename, extension and path of the parent
 * @param	filepath
 * @return
 */
	private function getFileHelper(filepath:String) : FileHelper {
		var result 	 : FileHelper = { extension: "", filename: "", path:"" };
		var splitted : Array<String> = new Array<String>();
		
		if( FileSystem.isDirectory(filePath)){
			result.extension  = "";
			splitted = filepath.split("/");
			splitted.pop();
		}
		else{
			splitted = filepath.split(".");
			result.extension  = splitted.pop();
			splitted = splitted.join(".").split("/");
		}
		result.filename  = splitted.pop();
		result.path  = splitted.join("/");

		return result;
	}
}