<?php

class filemanager_cross_SimpleResponseVO {
	public function __construct() {
		;
	}
	public function toString() {
		$l_result = "SimpleResponseVO {\x0A";
		$l_result .= "\x09 result: " . $this->result . "\x0A";
		$l_result .= "\x09 error: " . $this->error . "\x0A";
		$l_result .= "}\x0A";
		return $l_result;
	}
	public $error;
	public $result;
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
