<?php

class server_FileExplorer {
	public function __construct() {
		;
	}
	public $_fileListing;
	public $_dirListing;
	public function getFolders($folderRoot) {
		$this->createTheFolderTree($folderRoot);
		return _hx_array_get($this->_dirListing, 0)->writeDirectoryObject();
	}
	public function getFiles($folderRoot) {
		$this->createTheCurrentFilesList($folderRoot);
		return haxe_Json::stringify($this->_fileListing);
	}
	public function createTheCurrentFilesList($folderRoot) {
		$this->_fileListing = new _hx_array(array());
		$this->listFiles($folderRoot, $this->_fileListing);
		return haxe_Json::stringify($this->_fileListing);
	}
	public function createTheFolderTree($folderRoot) {
		$this->_dirListing = new _hx_array(array());
		$pathSplited = _hx_explode("/", $folderRoot);
		$rootName = $pathSplited[$pathSplited->length - 1];
		$pathSplited->pop();
		$rootFolder = new server_FileInfoHelper($rootName, $pathSplited->join("/"), true);
		$this->_dirListing->push($rootFolder);
		$this->listDirectories($folderRoot, _hx_array_get($this->_dirListing, 0)->subList);
	}
	public function listDirectories($path, $dirListing) {
		$listing = sys_FileSystem::readDirectory($path);
		{
			$_g = 0;
			while($_g < $listing->length) {
				$dir = $listing[$_g];
				++$_g;
				$dirPath = $path . "/" . $dir;
				if(file_exists($dirPath)) {
					$dirPath1 = $path . "/" . $dir;
					if(is_dir($dirPath1)) {
						$fileHelper = new server_FileInfoHelper($dir, $path, is_dir($dirPath1));
						$dirListing->push($fileHelper);
						$this->listDirectories($dirPath1, $fileHelper->subList);
						unset($fileHelper);
					}
					unset($dirPath1);
				}
				unset($dirPath,$dir);
			}
		}
	}
	public function listFiles($dirPath, $fileListing) {
		$listing = sys_FileSystem::readDirectory($dirPath);
		{
			$_g = 0;
			while($_g < $listing->length) {
				$file = $listing[$_g];
				++$_g;
				$filePath = $dirPath . "/" . $file;
				if(file_exists($filePath)) {
					$filePath1 = $dirPath . "/" . $file;
					if(!is_dir($filePath1)) {
						$fileHelper = new server_FileInfoHelper($file, $dirPath, is_dir($filePath1));
						$fileListing->push($fileHelper->getFileInfo());
						unset($fileHelper);
					}
					unset($filePath1);
				}
				unset($filePath,$file);
			}
		}
	}
	public function __call($m, $a) {
		if(isset($this->$m) && is_callable($this->$m))
			return call_user_func_array($this->$m, $a);
		else if(isset($this->»dynamics[$m]) && is_callable($this->»dynamics[$m]))
			return call_user_func_array($this->»dynamics[$m], $a);
		else if('toString' == $m)
			return $this->__toString();
		else
			throw new HException('Unable to call «'.$m.'»');
	}
	function __toString() { return 'server.FileExplorer'; }
}
