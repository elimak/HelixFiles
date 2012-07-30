package filemanager.client;
import filemanager.client.models.FilesModel;
import filemanager.client.models.Locator;
import filemanager.client.views.FileDropper;
import filemanager.client.views.FilesView;
import filemanager.client.views.FolderTreeView;
import filemanager.client.views.UploadStatus;
import filemanager.cross.FileVO;
import filemanager.cross.FolderVO;
import haxe.Log;
import js.Lib;
import slplayer.core.Application;
import slplayer.ui.DisplayObject;
import js.Dom;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FileManager extends DisplayObject
{
	private var _filesModel		: FilesModel;
	private var _folderView		: FolderTreeView;
	private var _uploadStatus	: UploadStatus;
	private var _fileDropper	: FileDropper;
	private var _application	: Application;
	
	public function new(rootElement:HtmlDom, SLPId:String){
		super(rootElement, SLPId);
		_application = Application.get(SLPId);
	}
	
	override public function init() 
	{
		_filesModel = new FilesModel();
		_filesModel.getTreeFolder("../files", showFolders);
		_filesModel.getFiles("../files", showFiles);
		
		var fileDroppers : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "FileDropper");
		_fileDropper = cast fileDroppers[0];
		_fileDropper.onFileDropped = _filesModel.uploadSelectedFiles;
		
		var uploadStatus : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "UploadStatus");
		_uploadStatus = cast uploadStatus[0];
		_uploadStatus.onCancelUpload = _filesModel.onCancelUpload;
		_filesModel.onUploadUpdate = _uploadStatus.onUpdate;
	}
	
	private function showFolders( data: FolderVO ) : Void
	{
		var folderTreeViews : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "FolderTreeView");
		var folderView 	: FolderTreeView = cast folderTreeViews[0];
		folderView.onSelectFolder = requestFiles;
		
		folderView.initialize(data);
	}	
	
	private function requestFiles( folderPath: String ) 
	{
		_filesModel.getFiles(folderPath, updateFilesList);
	}
	
	private function updateFilesList ( inData: Array<FileVO> ) : Void
	{
		var filesViews : Array<DisplayObject> = Locator.getSLDisplay( SLPlayerInstanceId, "FilesView");
		for (display in filesViews){
			var fileView : FilesView = cast display;
			fileView.setList(inData);
		}
	}

	private function showFiles( data: Array<FileVO> ) :Void
	{
		Log.trace("FileManager - showFolders() "+data.toString());
	}
}