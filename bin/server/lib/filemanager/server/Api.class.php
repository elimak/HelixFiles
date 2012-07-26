<?php

class filemanager_server_Api {
	public function __construct() {
		if(!php_Boot::$skip_constructor) {
		$this->_explorer = new filemanager_server_FileExplorer();
	}}
	public function getFileHelper($filepath) {
		$result = _hx_anonymous(array("extension" => "", "filename" => ""));
		$splitted = _hx_explode(".", $filepath);
		$result->extension = $splitted->pop();
		$splitted = _hx_explode("/", $splitted->join("."));
		$result->filename = $splitted->pop();
		return $result;
	}
	public function deleteTempFile($filepath) {
		$response = new filemanager_cross_FileUpdatedVO();
		$file = $this->getFileHelper($filepath);
		$tempFile = "../largefiles/" . $file->filename . "_temp." . $file->extension;
		$response->filepath = $filepath;
		if(file_exists($tempFile)) {
			@unlink($tempFile);
			$response->success = file_exists($tempFile);
		} else {
			$response->success = true;
		}
		if(!$response->success) {
			$response->error = "the file could not be deleted";
		}
		return $response;
	}
	public function backupAsTemporary($filepath) {
		$response = new filemanager_cross_FileUpdatedVO();
		$response->filepath = $filepath;
		$file = $this->getFileHelper($filepath);
		$oldFile = "../largefiles/" . $file->filename . "." . $file->extension;
		$tempFile = "../largefiles/" . $file->filename . "_temp." . $file->extension;
		if(file_exists($oldFile)) {
			rename($oldFile, $tempFile);
			$response->success = true;
		} else {
			$response->success = false;
			$response->error = $oldFile . " was not found";
		}
		return $response;
	}
	public function getFiles($folderpath) {
		return $this->_explorer->getFiles($folderpath);
	}
	public function getTreeFolder($folderpath) {
		return $this->_explorer->getFolders($folderpath);
	}
	public $_explorer;
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
	static $FILES_FOLDER = "../largefiles/";
	function __toString() { return 'filemanager.server.Api'; }
}
