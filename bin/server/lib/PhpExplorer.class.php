<?php

class PhpExplorer {
	public function __construct() {
		if(!php_Boot::$skip_constructor) {
		$params = php_Web::getParams();
		$folderpath = (($params->exists("folderpath")) ? $params->get("folderpath") : "../files");
		$service = (($params->exists("service")) ? $params->get("service") : "folders");
		$this->_explorerService = new server_FileExplorer();
		switch($service) {
		case "folders":{
			php_Lib::hprint($this->_explorerService->getFolders($folderpath));
		}break;
		case "files":{
			php_Lib::hprint($this->_explorerService->getFiles($folderpath));
		}break;
		}
	}}
	public $_explorerService;
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
	static function main() {
		new PhpExplorer();
	}
	function __toString() { return 'PhpExplorer'; }
}
