package frontend;
import cocktail.core.unit.UnitManager;
import dto.FileVO;
import dto.FolderVO;
import frontend.views.FilesView;
import haxe.Json;
import haxe.Log;
import js.Dom;
import frontend.model.FilesModel;
import frontend.views.FolderTreeView;
import js.Lib;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */

class FileManager 
{
	private var _body			: Body;
	private var _mainContainer	: HtmlDom;
	
	private var _filesModel		: FilesModel;
	private var _filesList		: FilesView;
	
	public function new() 
	{		
		_filesModel = new FilesModel();
		_filesModel.getTreeFolder("../files", updateDataTree);
		
		_body = Lib.document.body;
		setBodyStyle(_body);

		_mainContainer = Lib.document.createElement("div");
		setMainContainerStyle(_mainContainer);
		
		_body.appendChild(_mainContainer);
	}
	
	private function updateFilesList( inDataString: String ) : Void
	{
		Log.trace("FileManager - updateFilesList() "+inDataString);
		var data: Array<FileVO> = cast Json.parse(inDataString);
		_filesList.setList(data);
	}
	
	private function updateDataTree( inDataString: String ) : Void
	{
		var data: FolderVO = cast Json.parse(inDataString);
		var folderTree = new FolderTreeView();
		folderTree.onSelectFolder = requestFiles;
		_mainContainer.appendChild(folderTree.view);	
		
		_filesList = new FilesView();
		_mainContainer.appendChild(_filesList.view);
		
		folderTree.initialize(data);
	}
	
	private function requestFiles( folderPath: String ) 
	{
		_filesModel.getFiles(folderPath, updateFilesList);
	}
	
	private function setMainContainerStyle(domElement:HtmlDom) 
	{
		domElement.style.display = "block";
		domElement.style.overflowY = "hidden";
		domElement.style.width = "800px";
		
		domElement.style.marginLeft = "0";
		domElement.style.marginRight = "0";

		domElement.style.top = "30px";
	}
	
	private function setBodyStyle(domElement:HtmlDom) 
	{
		domElement.style.fontFamily = "HelveticaNeue, Sans-Serif, Arial";
	}
}