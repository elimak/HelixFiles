<?php

class dto_FileVO {
	public function __construct() {
		;
	}
	public $name;
	public $path;
	public $extension;
	public $size;
	public $accessed;
	public $created;
	public $modified;
	public function toString() {
		$l_result = "FileVO {\x0A";
		$l_result .= "\x09 name: " . $this->name . "\x0A";
		$l_result .= "\x09 path: " . $this->path . "\x0A";
		$l_result .= "\x09 extension: " . $this->extension . "\x0A";
		$l_result .= "\x09 size: " . $this->size . "\x0A";
		$l_result .= "\x09 accessed: " . $this->accessed . "\x0A";
		$l_result .= "\x09 created: " . $this->created . "\x0A";
		$l_result .= "\x09 modified: " . $this->modified . "\x0A";
		$l_result .= "}\x0A";
		return $l_result;
	}
	public $»dynamics = array();
	public function __get($n) {
		if(isset($this->»dynamics[$n]))
			return $this->»dynamics[$n];
	}
	public function __set($n, $v) {
		$this->»dynamics[$n] = $v;
	}
	public function __call($n, $a) {
		if(isset($this->»dynamics[$n]) && is_callable($this->»dynamics[$n]))
			return call_user_func_array($this->»dynamics[$n], $a);
		if('toString' == $n)
			return $this->__toString();
		throw new HException("Unable to call «".$n."»");
	}
	function __toString() { return $this->toString(); }
}
