<?php

class filemanager_server_FileManager {
	public function __construct() { if(!php_Boot::$skip_constructor) {
		$api = null;
		try {
			$api = new filemanager_server_Api();
		}catch(Exception $»e) {
			$_ex_ = ($»e instanceof HException) ? $»e->e : $»e;
			$e = $_ex_;
			{
				php_Lib::hprint("fail");
				return;
			}
		}
		$context = new haxe_remoting_Context();
		$context->addObject("api", $api, null);
		try {
			if(haxe_remoting_HttpConnection::handleRequest($context)) {
				return;
			}
		}catch(Exception $»e) {
			$_ex_ = ($»e instanceof HException) ? $»e->e : $»e;
			$e2 = $_ex_;
			{
				haxe_Log::trace("error: " . Std::string($e2), _hx_anonymous(array("fileName" => "FileManager.hx", "lineNumber" => 32, "className" => "filemanager.server.FileManager", "methodName" => "new")));
			}
		}
	}}
	static function main() {
		new filemanager_server_FileManager();
	}
	function __toString() { return 'filemanager.server.FileManager'; }
}
