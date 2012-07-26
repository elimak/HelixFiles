<?php

class filemanager_server_FileInfoHelper {
	public function __construct($inName, $inFullPath, $inIsDir) {
		if(!php_Boot::$skip_constructor) {
		$this->subList = new _hx_array(array());
		$this->name = $inName;
		$this->path = $inFullPath . "/" . $this->name;
		$this->isDir = $inIsDir;
	}}
	public function toString() {
		$l_result = "- ToString {\x0A";
		$l_result .= "\x09 name: " . $this->name . "\x0A";
		$l_result .= "\x09 path: " . $this->path . "\x0A";
		$l_result .= "\x09 subList: " . $this->subList->join(",") . "\x0A";
		$l_result .= "}\x0A";
		return $l_result;
	}
	public function getFileInfo() {
		$extension = _hx_explode(".", $this->name);
		$info = new filemanager_cross_FileVO();
		$info->name = $this->name;
		$info->path = $this->path;
		$info->extension = $extension[$extension->length - 1];
		$info->size = sys_io_File::getBytes($this->path)->length;
		$info->accessed = "";
		$info->created = "";
		$info->modified = "";
		try {
			$stat = sys_FileSystem::stat($this->path);
			$info->accessed = sys_FileSystem::stat($this->path)->atime->toString();
			$info->created = sys_FileSystem::stat($this->path)->ctime->toString();
			$info->modified = sys_FileSystem::stat($this->path)->mtime->toString();
		}catch(Exception $»e) {
			$_ex_ = ($»e instanceof HException) ? $»e->e : $»e;
			if(is_string($msg = $_ex_)){
			} else throw $»e;;
		}
		return $info;
	}
	public function writeDirectoryObject() {
		$data = new filemanager_cross_FolderVO();
		$data->name = $this->name;
		$data->path = $this->path;
		$data->children = new _hx_array(array());
		return $this->createFolderTree($data, $this->subList);
	}
	public function createFolderTree($data, $inSublist) {
		if($inSublist->length > 0) {
			$_g1 = 0; $_g = $inSublist->length;
			while($_g1 < $_g) {
				$i = $_g1++;
				$subFolder = new filemanager_cross_FolderVO();
				$subFolder->name = _hx_array_get($inSublist, $i)->name;
				$subFolder->path = _hx_array_get($inSublist, $i)->path;
				$subFolder->children = new _hx_array(array());
				$data->children->push($this->createFolderTree($subFolder, _hx_array_get($inSublist, $i)->subList));
				unset($subFolder,$i);
			}
		}
		return $data;
	}
	public $subList;
	public $isDir;
	public $path;
	public $name;
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
	function __toString() { return $this->toString(); }
}
