package filemanager.server;
import filemanager.cross.FileVO;
import filemanager.cross.FolderVO;
import filemanager.cross.FileUpdatedVO;
import php.FileSystem;
import php.io.File;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

typedef FileHelper = {
	var extension	: String;
	var filename	: String;
}

class Api {
	
	private var _explorer : FileExplorer;
	private static inline var FILES_FOLDER : String = "../largefiles/";
	
	public function new() {
		_explorer = new FileExplorer();
	}
	
	public function getTreeFolder ( folderpath : String) : Null<FolderVO> {
		return _explorer.getFolders(folderpath);
	}	
	
	public function getFiles ( folderpath : String) : Null<Array<FileVO>> {
		return _explorer.getFiles(folderpath);
	}
	
	public function backupAsTemporary ( filepath : String ) : FileUpdatedVO {
		var response	: FileUpdatedVO = new FileUpdatedVO();
		response.filepath = filepath;
		
		var file		: FileHelper = getFileHelper (filepath);
		var oldFile 	: String = FILES_FOLDER + file.filename + "." + file.extension;
		var tempFile 	: String = FILES_FOLDER + file.filename + "_temp." + file.extension;
		
		if ( FileSystem.exists(oldFile) ){
			FileSystem.rename(oldFile, tempFile);
			response.success = true;
		}
		else{
			response.success = false; 
			response.error = oldFile + " was not found";
		}
	
		return response;
	}
	
	public function deleteTempFile ( filepath : String ) : FileUpdatedVO {
		var response	: FileUpdatedVO = new FileUpdatedVO();
		var file		: FileHelper = getFileHelper (filepath);
		var tempFile 	: String = FILES_FOLDER + file.filename + "_temp." + file.extension;
		response.filepath = filepath;
		
		if ( FileSystem.exists(tempFile) ){
			FileSystem.deleteFile(tempFile);
			response.success = FileSystem.exists(tempFile);
		}
		else {
			response.success = true;
		}
		if ( !response.success ) response.error = "the file could not be deleted";
	
		return response;
	}
	
	private function moveFileToFolder (filePath: String, fileName: String, folderPath: String ) : Bool {
		if ( filePath == (folderPath + "/" + fileName) ) return true;
		File.copy(filePath, folderPath + "/" + fileName);
		if ( FileSystem.exists(folderPath + "/" + fileName)) {
			FileSystem.deleteFile(filePath);
			return true;
		}
		return false;
	}
	
	private function getFileHelper(filepath:String) : FileHelper {
		var result 		: FileHelper = {extension: "", filename: ""};
		var splitted 	: Array<String> = filepath.split(".");
		result.extension  	= splitted.pop();
		splitted = splitted.join(".").split("/");
		result.filename  	= splitted.pop();

		return result;
	}
}