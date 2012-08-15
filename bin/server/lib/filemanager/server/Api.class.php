<?php

class filemanager_server_Api {
	public function __construct() {
		if(!php_Boot::$skip_constructor) {
		$this->_explorer = new filemanager_server_FileExplorer();
	}}
	public function getFileHelper($filepath) {
		$result = _hx_anonymous(array("extension" => "", "filename" => "", "path" => ""));
		$splitted = _hx_explode(".", $filepath);
		$result->extension = $splitted->pop();
		$splitted = _hx_explode("/", $splitted->join("."));
		$result->filename = $splitted->pop();
		$result->path = $splitted->join("/");
		return $result;
	}
	public function validatePath($filePath) {
		if(file_exists($filePath)) {
			$_g = 1;
			while($_g < 100) {
				$i = $_g++;
				if(!file_exists($filePath . "(" . _hx_string_rec($i, "") . ")")) {
					return $filePath . "(" . _hx_string_rec($i, "") . ")";
				}
				unset($i);
			}
		}
		return $filePath;
	}
	public function moveFileToFolder($filePath, $fileName, $folderPath) {
		if($filePath === $folderPath . "/" . $fileName) {
			return true;
		}
		$newPath = $this->validatePath($folderPath . "/" . $fileName);
		sys_io_File::copy($filePath, $newPath);
		if(file_exists($folderPath . "/" . $fileName)) {
			@unlink($filePath);
			return true;
		}
		return false;
	}
	public function createFolder($folderpath) {
		$validFolder = $this->validatePath($folderpath);
		@mkdir($validFolder, 493);
		$response = $this->getTreeFolder("../files");
		return $response;
	}
	public function deleteFile($folderpath) {
		$validFolder = $this->validatePath($folderpath);
		if(file_exists($folderpath)) {
			haxe_Log::trace("Api - deleteFile() " . $folderpath . " - exists", _hx_anonymous(array("fileName" => "Api.hx", "lineNumber" => 80, "className" => "filemanager.server.Api", "methodName" => "deleteFile")));
		}
		$response = $this->getTreeFolder("../files");
		return $response;
	}
	public function deleteTempFile($filepath) {
		$response = new filemanager_cross_FileUpdatedVO();
		$file = $this->getFileHelper($filepath);
		$tempFile = $file->path . "/" . $file->filename . "_temp." . $file->extension;
		$response->filepath = $filepath;
		if(file_exists($tempFile)) {
			@unlink($tempFile);
			$response->success = !file_exists($tempFile);
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
		$oldFile = $file->path . "/" . $file->filename . "." . $file->extension;
		$tempFile = $file->path . "/" . $file->filename . "_temp." . $file->extension;
		if(file_exists($oldFile)) {
			rename($oldFile, $tempFile);
			$response->success = file_exists($tempFile);
			if(!$response->success) {
				$response->error = "failed to back up " . $oldFile;
			}
		} else {
			$response->success = true;
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
	static $FILES_FOLDER = "../files";
	function __toString() { return 'filemanager.server.Api'; }
}
