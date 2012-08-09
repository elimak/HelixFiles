package filemanager.server;
import filemanager.cross.FileVO;
import filemanager.cross.FolderVO;
import haxe.Json;
import php.FileSystem;


/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 * 
 * This classe provides an API to explore the folder's tree and the files contained into each folder.
 * It retrieves the folders's list and files's list for a requested location.
 */

class FileExplorer 
{
	private var _fileListing 	: Array<FileVO>;
	private var _dirListing 	: Array<FileInfoHelper>;

	public function new() { }
	
// ----------------------------------------- // 
// CREATE AND RETURN FOLDERS / FILES LISTS
// ----------------------------------------- //

// PRIVATE

	/**
	 * Lists the files within the selected folder
	 */
	private function createTheCurrentFilesList(folderRoot : String) {
		_fileListing = new Array<FileVO>();
		listFiles(folderRoot, _fileListing);
		return Json.stringify(_fileListing);
	}

	/**
	 * Create the listing of all the folder's tree starting by the root folder.
	 * The data is encoded in JSON
	 */
	private function createTheFolderTree(folderRoot : String) {
		_dirListing = new Array<FileInfoHelper>();
		
		// find the name of the root folder
		var pathSplited : Array<String> = folderRoot.split("/");
		var rootName 	: String = pathSplited[(pathSplited.length - 1)];
		// remove the folder's name from the full path (because path+name are already concatenated in the FileInfoHelper)
		pathSplited.pop();
		
		// create the root file's helper
		var rootFolder : FileInfoHelper = new FileInfoHelper(rootName, pathSplited.join("/"), true);
		_dirListing.push(rootFolder);
		
		// list the children's folders 
		listDirectories(folderRoot, _dirListing[0].subList);
	}
	
// ----------------------------------------- // 
// READ PHYSICAL FOLDERS / FILES
// ----------------------------------------- //

	/**
	 * Loops through the folder's descendants and
	 * create a new FileInfoFolder to be pushed in the folder's listing
	 * @param	path
	 * @param	dirListing
	 */
	private function listDirectories ( path: String, dirListing: Array<FileInfoHelper> ) {
		var listing: Array<String> = FileSystem.readDirectory( path );
		
		for (dir in listing){
			var dirPath = path + "/" + dir;

			if ( FileSystem.exists( dirPath )) {
				var dirPath = path + "/" + dir;

				if ( FileSystem.isDirectory( dirPath )) {
					var fileHelper = new FileInfoHelper(dir, path, FileSystem.isDirectory( dirPath ));
					dirListing.push(fileHelper);
					listDirectories(dirPath, fileHelper.subList);
				}
			}
		}
	}
	
	/**
	 * Loops through selected folder and lists only the files
	 * @param	path
	 * @param	dirListing
	 */
	private function listFiles( dirPath: String, fileListing: Array<FileVO>) {
		var listing: Array<String> = FileSystem.readDirectory( dirPath );

		for (file in listing) {
			
			var filePath = dirPath + "/" + file;

			if ( FileSystem.exists( filePath )) {
				var filePath = dirPath + "/" + file;
				
				if ( !FileSystem.isDirectory( filePath )) {
					var fileHelper = new FileInfoHelper(file, dirPath, FileSystem.isDirectory( filePath ));
					fileListing.push(fileHelper.getFileInfo());
				}
			}
		}
	}
	
// ------------------------------- // 
// GET FOLDER / GET FILES 
// ------------------------------- //

// PUBLIC API

	public function getFolders(folderRoot : String) : FolderVO{
		createTheFolderTree(folderRoot);
		return _dirListing[0].writeDirectoryObject();
	}
	
	public function getFiles(folderRoot : String) : Array<FileVO> {
		createTheCurrentFilesList(folderRoot);
		return _fileListing;
	}
}