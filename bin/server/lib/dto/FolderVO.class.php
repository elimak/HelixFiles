<?php

class dto_FolderVO {
	public function __construct() {
		if(!php_Boot::$skip_constructor) {
		$this->open = false;
	}}
	public $name;
	public $path;
	public $open;
	public $children;
	public function toString() {
		$l_result = "FileVO {\x0A";
		$l_result .= "\x09 name: " . $this->name . "\x0A";
		$l_result .= "\x09 path: " . $this->path . "\x0A";
		$l_result .= "\x09 children: " . $this->children->join(",") . "\x0A";
		return $l_result;
	}
	public $�dynamics = array();
	public function __get($n) {
		if(isset($this->�dynamics[$n]))
			return $this->�dynamics[$n];
	}
	public function __set($n, $v) {
		$this->�dynamics[$n] = $v;
	}
	public function __call($n, $a) {
		if(isset($this->�dynamics[$n]) && is_callable($this->�dynamics[$n]))
			return call_user_func_array($this->�dynamics[$n], $a);
		if('toString' == $n)
			return $this->__toString();
		throw new HException("Unable to call �".$n."�");
	}
	function __toString() { return $this->toString(); }
}
