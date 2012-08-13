(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = function() {
	this.h = { };
};
$hxClasses["Hash"] = Hash;
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntHash = function() {
	this.h = { };
};
$hxClasses["IntHash"] = IntHash;
IntHash.__name__ = ["IntHash"];
IntHash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,h: null
	,__class__: IntHash
}
var IntIter = function(min,max) {
	this.min = min;
	this.max = max;
};
$hxClasses["IntIter"] = IntIter;
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Lambda = function() { }
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var Xml = function() {
};
$hxClasses["Xml"] = Xml;
Xml.__name__ = ["Xml"];
Xml.Element = null;
Xml.PCData = null;
Xml.CData = null;
Xml.Comment = null;
Xml.DocType = null;
Xml.Prolog = null;
Xml.Document = null;
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
}
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new Hash();
	r.setNodeName(name);
	return r;
}
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.setNodeValue(data);
	return r;
}
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.setNodeValue(data);
	return r;
}
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.setNodeValue(data);
	return r;
}
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.setNodeValue(data);
	return r;
}
Xml.createProlog = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Prolog;
	r.setNodeValue(data);
	return r;
}
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
}
Xml.prototype = {
	toString: function() {
		if(this.nodeType == Xml.PCData) return this._nodeValue;
		if(this.nodeType == Xml.CData) return "<![CDATA[" + this._nodeValue + "]]>";
		if(this.nodeType == Xml.Comment) return "<!--" + this._nodeValue + "-->";
		if(this.nodeType == Xml.DocType) return "<!DOCTYPE " + this._nodeValue + ">";
		if(this.nodeType == Xml.Prolog) return "<?" + this._nodeValue + "?>";
		var s = new StringBuf();
		if(this.nodeType == Xml.Element) {
			s.b += Std.string("<");
			s.b += Std.string(this._nodeName);
			var $it0 = this._attributes.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				s.b += Std.string(" ");
				s.b += Std.string(k);
				s.b += Std.string("=\"");
				s.b += Std.string(this._attributes.get(k));
				s.b += Std.string("\"");
			}
			if(this._children.length == 0) {
				s.b += Std.string("/>");
				return s.b;
			}
			s.b += Std.string(">");
		}
		var $it1 = this.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			s.b += Std.string(x.toString());
		}
		if(this.nodeType == Xml.Element) {
			s.b += Std.string("</");
			s.b += Std.string(this._nodeName);
			s.b += Std.string(">");
		}
		return s.b;
	}
	,insertChild: function(x,pos) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.splice(pos,0,x);
	}
	,removeChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		var b = HxOverrides.remove(this._children,x);
		if(b) x._parent = null;
		return b;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,firstChild: function() {
		if(this._children == null) throw "bad nodetype";
		return this._children[0];
	}
	,elementsNamed: function(name) {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				if(n.nodeType == Xml.Element && n._nodeName == name) break;
				k++;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k++;
				if(n.nodeType == Xml.Element && n._nodeName == name) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,iterator: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			return this.cur < this.x.length;
		}, next : function() {
			return this.x[this.cur++];
		}};
	}
	,attributes: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.keys();
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,remove: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.remove(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,getParent: function() {
		return this._parent;
	}
	,setNodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,getNodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,setNodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,getNodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,_parent: null
	,_children: null
	,_attributes: null
	,_nodeValue: null
	,_nodeName: null
	,parent: null
	,nodeValue: null
	,nodeName: null
	,nodeType: null
	,__class__: Xml
	,__properties__: {set_nodeName:"setNodeName",get_nodeName:"getNodeName",set_nodeValue:"setNodeValue",get_nodeValue:"getNodeValue",get_parent:"getParent"}
}
var cocktail = {}
cocktail.Lib = function() {
};
$hxClasses["cocktail.Lib"] = cocktail.Lib;
cocktail.Lib.__name__ = ["cocktail","Lib"];
cocktail.Lib.__properties__ = {get_window:"get_window",get_document:"get_document"}
cocktail.Lib.document = null;
cocktail.Lib.window = null;
cocktail.Lib.init = function() {
	cocktail.Lib.window = new cocktail.core.window.Window();
	cocktail.Lib.document = cocktail.Lib.get_window().document;
}
cocktail.Lib.get_document = function() {
	if(cocktail.Lib.document == null) cocktail.Lib.init();
	return cocktail.Lib.document;
}
cocktail.Lib.get_window = function() {
	if(cocktail.Lib.window == null) cocktail.Lib.init();
	return cocktail.Lib.window;
}
cocktail.Lib.prototype = {
	__class__: cocktail.Lib
}
cocktail.core = {}
cocktail.core.drawing = {}
cocktail.core.drawing.AbstractDrawingManager = function(width,height) {
	this._width = width;
	this._height = height;
};
$hxClasses["cocktail.core.drawing.AbstractDrawingManager"] = cocktail.core.drawing.AbstractDrawingManager;
cocktail.core.drawing.AbstractDrawingManager.__name__ = ["cocktail","core","drawing","AbstractDrawingManager"];
cocktail.core.drawing.AbstractDrawingManager.prototype = {
	toNativeJointStyle: function(genericJointStyle) {
		return null;
	}
	,toNativeCapStyle: function(genericCapStyle) {
		return null;
	}
	,toNativeRatio: function(genericRatio) {
		return null;
	}
	,toNativeColor: function(genericColor) {
		return null;
	}
	,toNativeAlpha: function(genericAlpa) {
		return null;
	}
	,curveTo: function(controlX,controlY,x,y) {
	}
	,moveTo: function(x,y) {
	}
	,lineTo: function(x,y) {
	}
	,fillRect: function(rect,color) {
	}
	,copyPixels: function(bitmapData,sourceRect,destPoint) {
	}
	,drawImage: function(source,matrix,sourceRect) {
	}
	,drawEllipse: function(x,y,width,height) {
		var xRadius = width / 2;
		var yRadius = height / 2;
		var xCenter = width / 2 + x;
		var yCenter = height / 2 + y;
		var angleDelta = Math.PI / 4;
		var xCtrlDist = xRadius / Math.cos(angleDelta / 2);
		var yCtrlDist = yRadius / Math.cos(angleDelta / 2);
		this.moveTo(xCenter + xRadius,yCenter);
		var angle = 0;
		var rx, ry, ax, ay;
		var _g = 0;
		while(_g < 8) {
			var i = _g++;
			angle += angleDelta;
			rx = xCenter + Math.cos(angle - angleDelta / 2) * xCtrlDist;
			ry = yCenter + Math.sin(angle - angleDelta / 2) * yCtrlDist;
			ax = xCenter + Math.cos(angle) * xRadius;
			ay = yCenter + Math.sin(angle) * yRadius;
			this.curveTo(rx,ry,ax,ay);
		}
	}
	,drawRect: function(x,y,width,height,cornerRadiuses) {
		if(cornerRadiuses == null) cornerRadiuses = { tlCornerRadius : 0, trCornerRadius : 0, blCornerRadius : 0, brCornerRadius : 0};
		this.moveTo(cornerRadiuses.tlCornerRadius + x,y);
		this.lineTo(width - cornerRadiuses.trCornerRadius + x,y);
		this.curveTo(width + x,y,width + x,cornerRadiuses.trCornerRadius + y);
		this.lineTo(width + x,cornerRadiuses.trCornerRadius + y);
		this.lineTo(width + x,height - cornerRadiuses.brCornerRadius + y);
		this.curveTo(width + x,height + y,width - cornerRadiuses.brCornerRadius + x,height + y);
		this.lineTo(width - cornerRadiuses.brCornerRadius + x,height + y);
		this.lineTo(cornerRadiuses.blCornerRadius + x,height + y);
		this.curveTo(x,height + y,x,height - cornerRadiuses.blCornerRadius + y);
		this.lineTo(x,height - cornerRadiuses.blCornerRadius + y);
		this.lineTo(x,cornerRadiuses.tlCornerRadius + y);
		this.curveTo(x,y,cornerRadiuses.tlCornerRadius + x,y);
		this.lineTo(cornerRadiuses.tlCornerRadius + x,y);
	}
	,setFillStyle: function(fillStyle) {
	}
	,setLineStyle: function(lineStyle) {
	}
	,clear: function() {
	}
	,endFill: function() {
	}
	,beginFill: function(fillStyle,lineStyle) {
		if(fillStyle == null) fillStyle = cocktail.core.drawing.FillStyleValue.none;
		if(lineStyle == null) lineStyle = cocktail.core.drawing.LineStyleValue.none;
		this.setFillStyle(fillStyle);
		this.setLineStyle(lineStyle);
	}
	,_height: null
	,_width: null
	,nativeElement: null
	,__class__: cocktail.core.drawing.AbstractDrawingManager
}
cocktail.port = {}
cocktail.port.server = {}
cocktail.port.server.DrawingManager = function(width,height) {
	cocktail.core.drawing.AbstractDrawingManager.call(this,width,height);
};
$hxClasses["cocktail.port.server.DrawingManager"] = cocktail.port.server.DrawingManager;
cocktail.port.server.DrawingManager.__name__ = ["cocktail","port","server","DrawingManager"];
cocktail.port.server.DrawingManager.__super__ = cocktail.core.drawing.AbstractDrawingManager;
cocktail.port.server.DrawingManager.prototype = $extend(cocktail.core.drawing.AbstractDrawingManager.prototype,{
	__class__: cocktail.port.server.DrawingManager
});
cocktail.core.background = {}
cocktail.core.background.BackgroundDrawingManager = function(backgroundBox) {
	cocktail.port.server.DrawingManager.call(this,Math.round(backgroundBox.width),Math.round(backgroundBox.height));
};
$hxClasses["cocktail.core.background.BackgroundDrawingManager"] = cocktail.core.background.BackgroundDrawingManager;
cocktail.core.background.BackgroundDrawingManager.__name__ = ["cocktail","core","background","BackgroundDrawingManager"];
cocktail.core.background.BackgroundDrawingManager.__super__ = cocktail.port.server.DrawingManager;
cocktail.core.background.BackgroundDrawingManager.prototype = $extend(cocktail.port.server.DrawingManager.prototype,{
	getRotation: function(value) {
		var rotation;
		var $e = (value);
		switch( $e[1] ) {
		case 0:
			var value1 = $e[2];
			rotation = Math.round(cocktail.core.unit.UnitManager.getDegreeFromAngle(value1));
			break;
		case 1:
			var value1 = $e[2];
			switch( (value1)[1] ) {
			case 0:
				rotation = 0;
				break;
			case 3:
				rotation = 90;
				break;
			case 2:
				rotation = 180;
				break;
			case 1:
				rotation = 270;
				break;
			}
			break;
		case 2:
			var value1 = $e[2];
			switch( (value1)[1] ) {
			case 0:
				rotation = 45;
				break;
			case 1:
				rotation = 135;
				break;
			case 2:
				rotation = 225;
				break;
			case 3:
				rotation = 315;
				break;
			}
			break;
		}
		return rotation;
	}
	,getGradientStops: function(value) {
		var gradientStopsData = new Array();
		var _g1 = 0, _g = value.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ratio;
			var $e = (value[i].stop);
			switch( $e[1] ) {
			case 0:
				var value1 = $e[2];
				ratio = 0;
				break;
			case 1:
				var value1 = $e[2];
				ratio = value1;
				break;
			}
			var color = cocktail.core.unit.UnitManager.getColorDataFromCSSColor(value[i].color);
			gradientStopsData.push({ colorStop : color, ratio : ratio});
		}
		return gradientStopsData;
	}
	,drawBackgroundGradient: function(gradient,backgroundPositioningBox,backgroundPaintingBox,computedBackgroundSize,computedBackgroundPosition,backgroundRepeat) {
		var gradientSurface = new cocktail.port.server.DrawingManager(Math.round(computedBackgroundSize.width),Math.round(computedBackgroundSize.height));
		var fillStyle;
		var lineStyle = cocktail.core.drawing.LineStyleValue.none;
		var $e = (gradient);
		switch( $e[1] ) {
		case 0:
			var value = $e[2];
			var gradientStyle = { gradientType : cocktail.core.drawing.GradientTypeValue.linear, gradientStops : this.getGradientStops(value.colorStops), rotation : this.getRotation(value.angle)};
			fillStyle = cocktail.core.drawing.FillStyleValue.gradient(gradientStyle);
			break;
		}
		gradientSurface.beginFill(fillStyle,lineStyle);
		gradientSurface.drawRect(0,0,Math.round(computedBackgroundSize.width),Math.round(computedBackgroundSize.height));
		gradientSurface.endFill();
		this.drawBackgroundImage(gradientSurface.nativeElement,null,backgroundPositioningBox,backgroundPaintingBox,Math.round(computedBackgroundSize.width),Math.round(computedBackgroundSize.height),computedBackgroundSize.width / computedBackgroundSize.height,computedBackgroundSize,computedBackgroundPosition,backgroundRepeat);
	}
	,drawBackgroundColor: function(color,backgroundPaintingBox) {
		this.fillRect(backgroundPaintingBox,color);
	}
	,drawBackgroundImage: function(nativeImage,resource,backgroundPositioningBox,backgroundPaintingBox,intrinsicWidth,intrinsicHeight,intrinsicRatio,computedBackgroundSize,computedBackgroundPosition,backgroundRepeat) {
		var totalWidth = computedBackgroundPosition.x + backgroundPositioningBox.x;
		var maxWidth = backgroundPaintingBox.x + backgroundPaintingBox.width;
		var imageWidth = computedBackgroundSize.width;
		switch( (backgroundRepeat.x)[1] ) {
		case 3:
			maxWidth = totalWidth + imageWidth;
			break;
		case 0:
			while(totalWidth > backgroundPaintingBox.x) totalWidth -= imageWidth;
			break;
		case 1:
			imageWidth = Math.round(backgroundPositioningBox.width / computedBackgroundSize.width);
			while(totalWidth > backgroundPaintingBox.x) totalWidth -= imageWidth;
			break;
		case 2:
			while(totalWidth > backgroundPaintingBox.x) totalWidth -= imageWidth;
			break;
		}
		var initialWidth = totalWidth;
		var totalHeight = computedBackgroundPosition.y + Math.round(backgroundPositioningBox.y);
		var maxHeight = backgroundPaintingBox.y + backgroundPaintingBox.height;
		var imageHeight = computedBackgroundSize.height;
		switch( (backgroundRepeat.y)[1] ) {
		case 3:
			maxHeight = totalHeight + imageHeight;
			break;
		case 0:
			while(totalHeight > backgroundPaintingBox.y) totalHeight -= imageHeight;
			break;
		case 1:
			imageHeight = backgroundPositioningBox.height / computedBackgroundSize.height;
			while(totalHeight > backgroundPaintingBox.y) totalHeight -= imageHeight;
			break;
		case 2:
			while(totalHeight > backgroundPaintingBox.y) totalHeight -= imageHeight;
			break;
		}
		var initialHeight = totalHeight;
		if(imageWidth / intrinsicWidth == 1 && imageHeight / intrinsicHeight == 1) {
			var destinationPoint = { x : totalWidth, y : totalHeight};
			var intWidth = intrinsicWidth;
			var intHeight = intrinsicHeight;
			var box = { x : 0.0, y : 0.0, width : intWidth, height : intHeight};
			while(totalHeight < maxHeight) {
				this.copyPixels(resource.nativeResource,box,destinationPoint);
				totalWidth += imageWidth;
				if(totalWidth >= maxWidth) {
					totalWidth = initialWidth;
					totalHeight += imageHeight;
				}
				destinationPoint.x = totalWidth;
				destinationPoint.y = totalHeight;
			}
		} else {
			var matrix = new cocktail.core.geom.Matrix();
			while(totalHeight < maxHeight) {
				matrix.identity();
				matrix.translate(totalWidth,totalHeight);
				matrix.scale(imageWidth / intrinsicWidth,imageHeight / intrinsicHeight);
				this.drawImage(nativeImage,matrix,backgroundPaintingBox);
				totalWidth += imageWidth;
				if(totalWidth >= maxWidth) {
					totalWidth = initialWidth;
					totalHeight += imageHeight;
				}
			}
		}
	}
	,__class__: cocktail.core.background.BackgroundDrawingManager
});
cocktail.core.background.BackgroundManager = function() {
};
$hxClasses["cocktail.core.background.BackgroundManager"] = cocktail.core.background.BackgroundManager;
cocktail.core.background.BackgroundManager.__name__ = ["cocktail","core","background","BackgroundManager"];
cocktail.core.background.BackgroundManager.render = function(backgroundBox,style,elementRenderer) {
	var nativeElements = new Array();
	if(Math.round(backgroundBox.width) <= 0 || Math.round(backgroundBox.height) <= 0) return nativeElements;
	var length = style.backgroundImage.length;
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		var $e = (style.backgroundImage[i]);
		switch( $e[1] ) {
		case 0:
			break;
		case 1:
			var value = $e[2];
			var $e = (value);
			switch( $e[1] ) {
			case 0:
				var value1 = $e[2];
				var imageDeclaration = { urls : [value1], fallbackColor : cocktail.core.unit.CSSColor.transparent};
				var imageNativeElement = cocktail.core.background.BackgroundManager.drawBackgroundImage(imageDeclaration,style,backgroundBox,style.backgroundPosition[i],style.backgroundSize[i],style.backgroundOrigin[i],style.backgroundClip[i],style.backgroundRepeat[i],style.backgroundImage[i],elementRenderer);
				nativeElements.push(imageNativeElement);
				break;
			case 1:
				var value1 = $e[2];
				var imageNativeElement = cocktail.core.background.BackgroundManager.drawBackgroundImage(value1,style,backgroundBox,style.backgroundPosition[i],style.backgroundSize[i],style.backgroundOrigin[i],style.backgroundClip[i],style.backgroundRepeat[i],style.backgroundImage[i],elementRenderer);
				nativeElements.push(imageNativeElement);
				break;
			case 2:
				var value1 = $e[2];
				var gradientNativeElement = cocktail.core.background.BackgroundManager.drawBackgroundGradient(style,value1,backgroundBox,style.backgroundPosition[i],style.backgroundSize[i],style.backgroundOrigin[i],style.backgroundClip[i],style.backgroundRepeat[i],style.backgroundImage[i]);
				nativeElements.push(gradientNativeElement);
				break;
			}
			break;
		}
		if(i == length - 1) {
			if(style.backgroundColor != cocktail.core.unit.CSSColor.transparent) {
				var backgroundColorNativeElement = cocktail.core.background.BackgroundManager.drawBackgroundColor(style,style.computedStyle.backgroundColor,backgroundBox,style.backgroundPosition[i],style.backgroundSize[i],style.backgroundOrigin[i],style.backgroundClip[i],style.backgroundRepeat[i],style.backgroundImage[i]);
				nativeElements.reverse();
				nativeElements.unshift(backgroundColorNativeElement);
			}
		}
	}
	return nativeElements;
}
cocktail.core.background.BackgroundManager.drawBackgroundImage = function(imageDeclaration,style,backgroundBox,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage,elementRenderer) {
	var backgroundImageDrawingManager = new cocktail.core.background.BackgroundDrawingManager(backgroundBox);
	var backgroundImageNativeElement = backgroundImageDrawingManager.nativeElement;
	var foundResource = false;
	var _g1 = 0, _g = imageDeclaration.urls.length;
	while(_g1 < _g) {
		var i = _g1++;
		var resource = cocktail.core.resource.ResourceManager.getResource(imageDeclaration.urls[i]);
		if(resource.loaded == true) {
			var computedGradientStyles = cocktail.core.style.computer.BackgroundStylesComputer.computeIndividualBackground(style,backgroundBox,resource.intrinsicWidth,resource.intrinsicHeight,resource.intrinsicRatio,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage);
			foundResource = true;
			break;
		} else if(resource.loadedWithError == false) {
			resource.addEventListener("load",function(e) {
				elementRenderer.invalidate(cocktail.core.renderer.InvalidationReason.backgroundImageLoaded);
			});
			resource.addEventListener("error",function(e) {
				elementRenderer.invalidate(cocktail.core.renderer.InvalidationReason.backgroundImageLoaded);
			});
			foundResource = true;
			break;
		}
	}
	if(foundResource == false) {
		var computedBackgroundStyles = cocktail.core.style.computer.BackgroundStylesComputer.computeIndividualBackground(style,backgroundBox,null,null,null,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage);
		var backgroundColor = cocktail.core.unit.UnitManager.getColorDataFromCSSColor(imageDeclaration.fallbackColor);
		var backgroundColorDrawingManager = new cocktail.core.background.BackgroundDrawingManager(backgroundBox);
		backgroundColorDrawingManager.drawBackgroundColor(backgroundColor,computedBackgroundStyles.backgroundClip);
		backgroundImageNativeElement = backgroundColorDrawingManager.nativeElement;
	}
	return backgroundImageNativeElement;
}
cocktail.core.background.BackgroundManager.drawBackgroundColor = function(style,backgroundColor,backgroundBox,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage) {
	var computedBackgroundStyles = cocktail.core.style.computer.BackgroundStylesComputer.computeIndividualBackground(style,backgroundBox,null,null,null,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage);
	var backgroundColorDrawingManager = new cocktail.core.background.BackgroundDrawingManager(backgroundBox);
	backgroundColorDrawingManager.drawBackgroundColor(backgroundColor,computedBackgroundStyles.backgroundClip);
	return backgroundColorDrawingManager.nativeElement;
}
cocktail.core.background.BackgroundManager.drawBackgroundGradient = function(style,gradientValue,backgroundBox,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage) {
	var computedGradientStyles = cocktail.core.style.computer.BackgroundStylesComputer.computeIndividualBackground(style,backgroundBox,null,null,null,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage);
	var backgroundGradientDrawingManager = new cocktail.core.background.BackgroundDrawingManager(backgroundBox);
	backgroundGradientDrawingManager.drawBackgroundGradient(gradientValue,computedGradientStyles.backgroundOrigin,computedGradientStyles.backgroundClip,computedGradientStyles.backgroundSize,computedGradientStyles.backgroundPosition,computedGradientStyles.backgroundRepeat);
	return backgroundGradientDrawingManager.nativeElement;
}
cocktail.core.background.BackgroundManager.prototype = {
	__class__: cocktail.core.background.BackgroundManager
}
cocktail.core.event = {}
cocktail.core.event.EventTarget = function() {
	this._registeredEventListeners = new Hash();
};
$hxClasses["cocktail.core.event.EventTarget"] = cocktail.core.event.EventTarget;
cocktail.core.event.EventTarget.__name__ = ["cocktail","core","event","EventTarget"];
cocktail.core.event.EventTarget.prototype = {
	executeDefaultActionIfNeeded: function(defaultPrevented,event) {
	}
	,getTargetAncestors: function() {
		return [];
	}
	,endEventDispatching: function(evt) {
		var defaultPrevented = evt.defaultPrevented;
		this.executeDefaultActionIfNeeded(defaultPrevented,evt);
		evt.reset();
		return defaultPrevented;
	}
	,shouldStopEventPropagation: function(evt) {
		return evt.propagationStopped == true || evt.immediatePropagationStopped == true;
	}
	,doDispatchEvent: function(eventListeners,evt) {
		var length = eventListeners.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var eventListener = eventListeners[i];
			if(evt.eventPhase == 1) {
				if(eventListener.useCapture == true) eventListener.handleEvent(evt);
			} else if(evt.eventPhase == 3) {
				if(eventListener.useCapture == false) eventListener.handleEvent(evt);
			} else if(evt.eventPhase == 2) eventListener.handleEvent(evt);
			if(evt.immediatePropagationStopped == true) return;
		}
	}
	,removeEventListener: function(type,listener,useCapture) {
		if(useCapture == null) useCapture = false;
		if(this._registeredEventListeners.exists(type) == true) {
			var registeredListeners = this._registeredEventListeners.get(type);
			var newEventListeners = new Array();
			var _g1 = 0, _g = registeredListeners.length;
			while(_g1 < _g) {
				var i = _g1++;
				var eventListener = registeredListeners[i];
				if(eventListener.eventType == type && eventListener.useCapture == useCapture && eventListener.listener == listener) eventListener.dispose(); else newEventListeners.push(eventListener);
			}
			this._registeredEventListeners.set(type,newEventListeners);
		}
	}
	,addEventListener: function(type,listener,useCapture) {
		if(useCapture == null) useCapture = false;
		if(this._registeredEventListeners.exists(type) == false) this._registeredEventListeners.set(type,new Array());
		this.removeEventListener(type,listener,useCapture);
		var eventListener = new cocktail.core.event.EventListener(type,listener,useCapture);
		this._registeredEventListeners.get(type).push(eventListener);
	}
	,dispatchEvent: function(evt) {
		evt.currentTarget = this;
		if(evt.dispatched == false) {
			evt.target = this;
			evt.dispatched = true;
			var targetAncestors = this.getTargetAncestors();
			evt.eventPhase = 1;
			targetAncestors.reverse();
			var _g1 = 0, _g = targetAncestors.length;
			while(_g1 < _g) {
				var i = _g1++;
				targetAncestors[i].dispatchEvent(evt);
				if(this.shouldStopEventPropagation(evt) == true) return this.endEventDispatching(evt);
			}
			evt.eventPhase = 2;
			this.dispatchEvent(evt);
			if(this.shouldStopEventPropagation(evt) == true) return this.endEventDispatching(evt);
			if(evt.bubbles == true) {
				evt.eventPhase = 3;
				targetAncestors.reverse();
				var _g1 = 0, _g = targetAncestors.length;
				while(_g1 < _g) {
					var i = _g1++;
					targetAncestors[i].dispatchEvent(evt);
					if(this.shouldStopEventPropagation(evt) == true) return this.endEventDispatching(evt);
				}
				return this.endEventDispatching(evt);
			}
		} else if(this._registeredEventListeners.exists(evt.type) == true) this.doDispatchEvent(this._registeredEventListeners.get(evt.type),evt);
		return evt.defaultPrevented;
	}
	,_registeredEventListeners: null
	,__class__: cocktail.core.event.EventTarget
}
cocktail.core.event.EventCallback = function() {
	cocktail.core.event.EventTarget.call(this);
};
$hxClasses["cocktail.core.event.EventCallback"] = cocktail.core.event.EventCallback;
cocktail.core.event.EventCallback.__name__ = ["cocktail","core","event","EventCallback"];
cocktail.core.event.EventCallback.__super__ = cocktail.core.event.EventTarget;
cocktail.core.event.EventCallback.prototype = $extend(cocktail.core.event.EventTarget.prototype,{
	set_onTransitionEnd: function(value) {
		this.updateCallbackListener("transitionend",value,this.ontransitionend);
		return this.ontransitionend = value;
	}
	,set_onVolumeChange: function(value) {
		this.updateCallbackListener("volumechange",value,this.onvolumechange);
		return this.onvolumechange = value;
	}
	,set_onPause: function(value) {
		this.updateCallbackListener("pause",value,this.onpause);
		return this.onpause = value;
	}
	,set_onPlay: function(value) {
		this.updateCallbackListener("play",value,this.onplay);
		return this.onplay = value;
	}
	,set_onTimeUpdate: function(value) {
		this.updateCallbackListener("timeupdate",value,this.ontimeupdate);
		return this.ontimeupdate = value;
	}
	,set_onDurationChanged: function(value) {
		this.updateCallbackListener("durationchange",value,this.ondurationchange);
		return this.ondurationchange = value;
	}
	,set_onEnded: function(value) {
		this.updateCallbackListener("ended",value,this.onended);
		return this.onended = value;
	}
	,set_onSeeked: function(value) {
		this.updateCallbackListener("seeked",value,this.onseeked);
		return this.onseeked = value;
	}
	,set_onSeeking: function(value) {
		this.updateCallbackListener("seeking",value,this.onseeking);
		return this.set_onWaiting(value);
	}
	,set_onWaiting: function(value) {
		this.updateCallbackListener("waiting",value,this.onwaiting);
		return this.onwaiting = value;
	}
	,set_onPlaying: function(value) {
		this.updateCallbackListener("playing",value,this.onplaying);
		return this.onplaying = value;
	}
	,set_onCanPlayThrough: function(value) {
		this.updateCallbackListener("canplaythrough",value,this.oncanplaythrough);
		return this.oncanplaythrough = value;
	}
	,set_onCanPlay: function(value) {
		this.updateCallbackListener("canplay",value,this.oncanplay);
		return this.oncanplay = value;
	}
	,set_onLoadedData: function(value) {
		this.updateCallbackListener("loadeddata",value,this.onloadeddata);
		return this.onloadeddata = value;
	}
	,set_onLoadedMetadata: function(value) {
		this.updateCallbackListener("loadedmetadata",value,this.onloadedmetadata);
		return this.onloadedmetadata = value;
	}
	,set_onStalled: function(value) {
		this.updateCallbackListener("stalled",value,this.onstalled);
		return this.onstalled = value;
	}
	,set_onEmptied: function(value) {
		this.updateCallbackListener("emptied",value,this.onemptied);
		return this.onemptied = value;
	}
	,set_onSuspend: function(value) {
		this.updateCallbackListener("suspend",value,this.onsuspend);
		return this.onsuspend = value;
	}
	,set_onProgress: function(value) {
		this.updateCallbackListener("progress",value,this.onprogress);
		return this.onprogress = value;
	}
	,set_onLoadStart: function(value) {
		this.updateCallbackListener("loadstart",value,this.onloadstart);
		return this.onloadstart = value;
	}
	,set_onError: function(value) {
		this.updateCallbackListener("error",value,this.onerror);
		return this.onerror = value;
	}
	,set_onLoad: function(value) {
		this.updateCallbackListener("load",value,this.onload);
		return this.onload = value;
	}
	,set_onScroll: function(value) {
		this.updateCallbackListener("scroll",value,this.onscroll);
		return this.onscroll = value;
	}
	,set_onFullScreenChange: function(value) {
		this.updateCallbackListener("fullscreenchange",value,this.onfullscreenchange);
		return this.onfullscreenchange = value;
	}
	,set_onResize: function(value) {
		this.updateCallbackListener("resize",value,this.onresize);
		return this.onresize = value;
	}
	,set_onBlur: function(value) {
		this.updateCallbackListener("blur",value,this.onblur);
		return this.onblur = value;
	}
	,set_onFocus: function(value) {
		this.updateCallbackListener("focus",value,this.onfocus);
		return this.onfocus = value;
	}
	,set_onKeyUp: function(value) {
		this.updateCallbackListener("keyup",value,this.onkeyup);
		return this.onkeyup = value;
	}
	,set_onKeyDown: function(value) {
		this.updateCallbackListener("keydown",value,this.onkeydown);
		return this.onkeydown = value;
	}
	,set_onMouseWheel: function(value) {
		this.updateCallbackListener("wheel",value,this.onmousewheel);
		return this.onmousewheel = value;
	}
	,set_onMouseMove: function(value) {
		this.updateCallbackListener("mousemove",value,this.onmousemove);
		return this.onmousemove = value;
	}
	,set_onMouseOut: function(value) {
		this.updateCallbackListener("mouseout",value,this.onmouseout);
		return this.onmouseout = value;
	}
	,set_onMouseOver: function(value) {
		this.updateCallbackListener("mouseover",value,this.onmouseover);
		return this.onmouseover = value;
	}
	,set_onMouseUp: function(value) {
		this.updateCallbackListener("mouseup",value,this.onmouseup);
		return this.onmouseup = value;
	}
	,set_onMouseDown: function(value) {
		this.updateCallbackListener("mousedown",value,this.onmousedown);
		return this.onmousedown = value;
	}
	,set_onDblClick: function(value) {
		this.updateCallbackListener("dblclick",value,this.ondblclick);
		return this.ondblclick = value;
	}
	,set_onClick: function(value) {
		this.updateCallbackListener("click",value,this.onclick);
		return this.onclick = value;
	}
	,updateCallbackListener: function(eventType,newListener,oldListener) {
		if(oldListener != null) this.removeEventListener(eventType,oldListener);
		if(newListener != null) this.addEventListener(eventType,newListener);
	}
	,ontransitionend: null
	,onvolumechange: null
	,onpause: null
	,onplay: null
	,ontimeupdate: null
	,ondurationchange: null
	,onended: null
	,onseeked: null
	,onseeking: null
	,onwaiting: null
	,onplaying: null
	,oncanplaythrough: null
	,oncanplay: null
	,onloadeddata: null
	,onloadedmetadata: null
	,onstalled: null
	,onemptied: null
	,onsuspend: null
	,onprogress: null
	,onloadstart: null
	,onerror: null
	,onload: null
	,onscroll: null
	,onfullscreenchange: null
	,onresize: null
	,onblur: null
	,onfocus: null
	,onkeyup: null
	,onkeydown: null
	,onmousewheel: null
	,onmousemove: null
	,onmouseout: null
	,onmouseover: null
	,onmouseup: null
	,onmousedown: null
	,ondblclick: null
	,onclick: null
	,__class__: cocktail.core.event.EventCallback
	,__properties__: {set_onclick:"set_onClick",set_ondblclick:"set_onDblClick",set_onmousedown:"set_onMouseDown",set_onmouseup:"set_onMouseUp",set_onmouseover:"set_onMouseOver",set_onmouseout:"set_onMouseOut",set_onmousemove:"set_onMouseMove",set_onmousewheel:"set_onMouseWheel",set_onkeydown:"set_onKeyDown",set_onkeyup:"set_onKeyUp",set_onfocus:"set_onFocus",set_onblur:"set_onBlur",set_onresize:"set_onResize",set_onfullscreenchange:"set_onFullScreenChange",set_onscroll:"set_onScroll",set_onload:"set_onLoad",set_onerror:"set_onError",set_onloadstart:"set_onLoadStart",set_onprogress:"set_onProgress",set_onsuspend:"set_onSuspend",set_onemptied:"set_onEmptied",set_onstalled:"set_onStalled",set_onloadedmetadata:"set_onLoadedMetadata",set_onloadeddata:"set_onLoadedData",set_oncanplay:"set_onCanPlay",set_oncanplaythrough:"set_onCanPlayThrough",set_onplaying:"set_onPlaying",set_onwaiting:"set_onWaiting",set_onseeking:"set_onSeeking",set_onseeked:"set_onSeeked",set_onended:"set_onEnded",set_ondurationchange:"set_onDurationChanged",set_ontimeupdate:"set_onTimeUpdate",set_onplay:"set_onPlay",set_onpause:"set_onPause",set_onvolumechange:"set_onVolumeChange",set_ontransitionend:"set_onTransitionEnd"}
});
cocktail.core.dom = {}
cocktail.core.dom.NodeBase = function() {
	cocktail.core.event.EventCallback.call(this);
	this.childNodes = new Array();
};
$hxClasses["cocktail.core.dom.NodeBase"] = cocktail.core.dom.NodeBase;
cocktail.core.dom.NodeBase.__name__ = ["cocktail","core","dom","NodeBase"];
cocktail.core.dom.NodeBase.__super__ = cocktail.core.event.EventCallback;
cocktail.core.dom.NodeBase.prototype = $extend(cocktail.core.event.EventCallback.prototype,{
	get_previousSibling: function() {
		if(this.parentNode == null) return null; else if(this.parentNode.get_firstChild() != this) {
			var length = this.parentNode.childNodes.length;
			var _g = 0;
			while(_g < length) {
				var i = _g++;
				if(this.isSameNode(this.parentNode.childNodes[i]) == true) return this.parentNode.childNodes[i - 1];
			}
		}
		return null;
	}
	,get_nextSibling: function() {
		if(this.parentNode == null) return null; else if(this.parentNode.get_lastChild() != this) {
			var length = this.parentNode.childNodes.length;
			var _g = 0;
			while(_g < length) {
				var i = _g++;
				if(this.isSameNode(this.parentNode.childNodes[i]) == true) return this.parentNode.childNodes[i + 1];
			}
		}
		return null;
	}
	,get_lastChild: function() {
		if(this.hasChildNodes() == true) return this.childNodes[this.childNodes.length - 1]; else return null;
	}
	,get_firstChild: function() {
		if(this.hasChildNodes() == true) return this.childNodes[0]; else return null;
	}
	,removeFromParentIfNecessary: function(newChild) {
		if(newChild.parentNode != null) {
			var parentNode = newChild.parentNode;
			parentNode.removeChild(newChild);
		}
	}
	,getTargetAncestors: function() {
		var parent = this.parentNode;
		var targetAncestors = new Array();
		while(parent != null) {
			targetAncestors.push(parent);
			parent = parent.parentNode;
		}
		return targetAncestors;
	}
	,hasChildNodes: function() {
		return this.childNodes.length > 0;
	}
	,replaceChild: function(newChild,oldChild) {
		var length = this.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			if(this.childNodes[i] == oldChild) {
				this.removeChild(oldChild);
				this.appendChild(newChild);
			}
		}
		return oldChild;
	}
	,isSameNode: function(other) {
		return other == this;
	}
	,insertBefore: function(newChild,refChild) {
		if(refChild == null) this.appendChild(newChild); else {
			var newChildNodes = new Array();
			var length = this.childNodes.length;
			var _g = 0;
			while(_g < length) {
				var i = _g++;
				if(this.childNodes[i] == refChild) newChildNodes.push(newChild);
				newChildNodes.push(this.childNodes[i]);
			}
			var _g1 = 0, _g = newChildNodes.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.appendChild(newChildNodes[i]);
			}
		}
		return newChild;
	}
	,appendChild: function(newChild) {
		this.removeFromParentIfNecessary(newChild);
		newChild.parentNode = this;
		this.childNodes.push(newChild);
		return newChild;
	}
	,removeChild: function(oldChild) {
		oldChild.parentNode = null;
		HxOverrides.remove(this.childNodes,oldChild);
		return oldChild;
	}
	,previousSibling: null
	,nextSibling: null
	,lastChild: null
	,firstChild: null
	,childNodes: null
	,parentNode: null
	,__class__: cocktail.core.dom.NodeBase
	,__properties__: $extend(cocktail.core.event.EventCallback.prototype.__properties__,{get_firstChild:"get_firstChild",get_lastChild:"get_lastChild",get_nextSibling:"get_nextSibling",get_previousSibling:"get_previousSibling"})
});
cocktail.core.dom.Node = function() {
	cocktail.core.dom.NodeBase.call(this);
};
$hxClasses["cocktail.core.dom.Node"] = cocktail.core.dom.Node;
cocktail.core.dom.Node.__name__ = ["cocktail","core","dom","Node"];
cocktail.core.dom.Node.__super__ = cocktail.core.dom.NodeBase;
cocktail.core.dom.Node.prototype = $extend(cocktail.core.dom.NodeBase.prototype,{
	get_nodeName: function() {
		return null;
	}
	,set_nodeValue: function(value) {
		if(value != null) throw 7;
		return value;
	}
	,get_nodeValue: function() {
		return null;
	}
	,get_nodeType: function() {
		return -1;
	}
	,hasAttributes: function() {
		return false;
	}
	,ownerDocument: null
	,attributes: null
	,nodeName: null
	,nodeValue: null
	,nodeType: null
	,__class__: cocktail.core.dom.Node
	,__properties__: $extend(cocktail.core.dom.NodeBase.prototype.__properties__,{get_nodeType:"get_nodeType",set_nodeValue:"set_nodeValue",get_nodeValue:"get_nodeValue",get_nodeName:"get_nodeName"})
});
cocktail.core.dom.Attr = function(name) {
	this.name = name;
	this.specified = false;
	cocktail.core.dom.Node.call(this);
};
$hxClasses["cocktail.core.dom.Attr"] = cocktail.core.dom.Attr;
cocktail.core.dom.Attr.__name__ = ["cocktail","core","dom","Attr"];
cocktail.core.dom.Attr.__super__ = cocktail.core.dom.Node;
cocktail.core.dom.Attr.prototype = $extend(cocktail.core.dom.Node.prototype,{
	set_value: function(value) {
		this.specified = true;
		return this.value = value;
	}
	,get_value: function() {
		if(this.value == null) return "";
		return this.value;
	}
	,set_nodeValue: function(value) {
		return this.set_value(value);
	}
	,get_nodeValue: function() {
		return this.get_value();
	}
	,get_nodeType: function() {
		return 2;
	}
	,get_nodeName: function() {
		return this.name;
	}
	,ownerElement: null
	,isId: null
	,specified: null
	,value: null
	,name: null
	,__class__: cocktail.core.dom.Attr
	,__properties__: $extend(cocktail.core.dom.Node.prototype.__properties__,{set_value:"set_value",get_value:"get_value"})
});
cocktail.core.dom.Element = function(tagName) {
	this.tagName = tagName;
	this.attributes = new cocktail.core.dom.NamedNodeMap();
	cocktail.core.dom.Node.call(this);
};
$hxClasses["cocktail.core.dom.Element"] = cocktail.core.dom.Element;
cocktail.core.dom.Element.__name__ = ["cocktail","core","dom","Element"];
cocktail.core.dom.Element.__super__ = cocktail.core.dom.Node;
cocktail.core.dom.Element.prototype = $extend(cocktail.core.dom.Node.prototype,{
	get_childElementCount: function() {
		var childElementCount = 0;
		var length = this.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			if(this.childNodes[i].get_nodeType() == 1) childElementCount++;
		}
		return childElementCount;
	}
	,get_previousElementSibling: function() {
		if(this.get_previousSibling() == null) return null;
		var previousElementSibling = this.get_previousSibling();
		while(previousElementSibling.get_nodeType() != 1) {
			previousElementSibling = previousElementSibling.get_previousSibling();
			if(previousElementSibling == null) return null;
		}
		return previousElementSibling;
	}
	,get_nextElementSibling: function() {
		if(this.get_nextSibling() == null) return null;
		var nextElementSibling = this.get_nextSibling();
		while(nextElementSibling.get_nodeType() != 1) {
			nextElementSibling = nextElementSibling.get_nextSibling();
			if(nextElementSibling == null) return null;
		}
		return nextElementSibling;
	}
	,get_lastElementChild: function() {
		if(this.hasChildNodes() == false) return null;
		if(this.get_lastChild().get_nodeType() == 1) return this.get_lastChild(); else {
			var length = this.childNodes.length;
			var _g = length;
			while(_g < 0) {
				var i = _g++;
				if(this.childNodes[i].get_nodeType() == 1) return this.childNodes[i];
			}
		}
		return null;
	}
	,get_firstElementChild: function() {
		if(this.hasChildNodes() == false) return null;
		if(this.get_firstChild().get_nodeType() == 1) return this.get_firstChild(); else {
			var length = this.childNodes.length;
			var _g = 0;
			while(_g < length) {
				var i = _g++;
				if(this.childNodes[i].get_nodeType() == 1) return this.childNodes[i];
			}
		}
		return null;
	}
	,get_nodeType: function() {
		return 1;
	}
	,get_nodeName: function() {
		return this.tagName;
	}
	,hasAttributes: function() {
		return this.attributes.get_length() > 0;
	}
	,doGetElementsByClassName: function(node,className,elements) {
		if(node.hasChildNodes() == true) {
			var length = node.childNodes.length;
			var _g = 0;
			while(_g < length) {
				var i = _g++;
				var childNode = node.childNodes[i];
				switch(childNode.get_nodeType()) {
				case 1:
					var elementNode = childNode;
					var elementClassName = elementNode.getAttribute("class");
					if(elementClassName != null) {
						var elementClassNames = elementClassName.split(" ");
						var foundFlag = false;
						var _g2 = 0, _g1 = elementClassNames.length;
						while(_g2 < _g1) {
							var j = _g2++;
							if(elementClassNames[j] == className && foundFlag == false) {
								elements.push(elementNode);
								foundFlag = true;
							}
						}
					}
					break;
				}
				this.doGetElementsByClassName(childNode,className,elements);
			}
		}
	}
	,doGetElementsByTagName: function(node,tagName,elements) {
		if(node.hasChildNodes() == true) {
			var length = node.childNodes.length;
			var _g = 0;
			while(_g < length) {
				var i = _g++;
				var childNode = node.childNodes[i];
				if(childNode.get_nodeName() == tagName) elements.push(childNode); else if(tagName == "*" && childNode.get_nodeType() == 1) elements.push(childNode);
				this.doGetElementsByTagName(childNode,tagName,elements);
			}
		}
	}
	,getElementsByClassName: function(className) {
		var elements = new Array();
		this.doGetElementsByClassName(this,className,elements);
		return elements;
	}
	,getElementsByTagName: function(tagName) {
		var elements = new Array();
		this.doGetElementsByTagName(this,tagName,elements);
		return elements;
	}
	,hasAttribute: function(name) {
		return this.attributes.getNamedItem(name) != null;
	}
	,setIdAttributeNode: function(idAttr,isId) {
		idAttr.isId = isId;
		this.attributes.setNamedItem(idAttr);
	}
	,setIdAttribute: function(name,isId) {
		var idAttribute = this.attributes.getNamedItem(name);
		if(idAttribute == null) {
			idAttribute = new cocktail.core.dom.Attr(name);
			this.attributes.setNamedItem(idAttribute);
			idAttribute.ownerElement = this;
		}
		idAttribute.isId = isId;
	}
	,removeAttribute: function(name) {
		var removedAttribute = this.attributes.removeNamedItem(name);
		if(removedAttribute != null) removedAttribute.ownerElement = null;
	}
	,setAttributeNode: function(newAttr) {
		newAttr.ownerElement = this;
		return this.attributes.setNamedItem(newAttr);
	}
	,getAttributeNode: function(name) {
		var attribute = this.attributes.getNamedItem(name);
		if(attribute != null) return attribute;
		return null;
	}
	,setAttribute: function(name,value) {
		var attribute = this.attributes.getNamedItem(name);
		if(attribute == null) {
			attribute = new cocktail.core.dom.Attr(name);
			this.attributes.setNamedItem(attribute);
			attribute.ownerElement = this;
		}
		attribute.set_value(value);
	}
	,getAttribute: function(name) {
		var attribute = this.getAttributeNode(name);
		if(attribute != null) return attribute.get_value(); else return null;
	}
	,childElementCount: null
	,nextElementSibling: null
	,previousElementSibling: null
	,lastElementChild: null
	,firstElementChild: null
	,tagName: null
	,__class__: cocktail.core.dom.Element
	,__properties__: $extend(cocktail.core.dom.Node.prototype.__properties__,{get_firstElementChild:"get_firstElementChild",get_lastElementChild:"get_lastElementChild",get_previousElementSibling:"get_previousElementSibling",get_nextElementSibling:"get_nextElementSibling",get_childElementCount:"get_childElementCount"})
});
cocktail.core.html = {}
cocktail.core.html.HTMLElement = function(tagName) {
	cocktail.core.dom.Element.call(this,tagName);
	this.init();
};
$hxClasses["cocktail.core.html.HTMLElement"] = cocktail.core.html.HTMLElement;
cocktail.core.html.HTMLElement.__name__ = ["cocktail","core","html","HTMLElement"];
cocktail.core.html.HTMLElement.__super__ = cocktail.core.dom.Element;
cocktail.core.html.HTMLElement.prototype = $extend(cocktail.core.dom.Element.prototype,{
	get_clientLeft: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		return 0;
	}
	,get_clientTop: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		return 0;
	}
	,get_clientHeight: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		var computedStyle = this.coreStyle.computedStyle;
		return Math.round(computedStyle.getHeight() + computedStyle.getPaddingTop() + computedStyle.getPaddingBottom());
	}
	,get_clientWidth: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		var computedStyle = this.coreStyle.computedStyle;
		return Math.round(computedStyle.getWidth() + computedStyle.getPaddingLeft() + computedStyle.getPaddingRight());
	}
	,get_offsetTop: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		return Math.round(this.elementRenderer.positionedOrigin.y);
	}
	,get_offsetLeft: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		return Math.round(this.elementRenderer.positionedOrigin.x);
	}
	,get_offsetHeight: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		var computedStyle = this.coreStyle.computedStyle;
		return Math.round(computedStyle.getHeight() + computedStyle.getPaddingTop() + computedStyle.getPaddingBottom());
	}
	,get_offsetWidth: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		var computedStyle = this.coreStyle.computedStyle;
		return Math.round(computedStyle.getWidth() + computedStyle.getPaddingLeft() + computedStyle.getPaddingRight());
	}
	,get_offsetParent: function() {
		if(this.parentNode == null) return null;
		var parent = this.parentNode;
		var isOffsetParent = parent.elementRenderer.isPositioned();
		while(isOffsetParent == false) if(parent.parentNode != null) {
			parent = parent.parentNode;
			isOffsetParent = parent.elementRenderer.isPositioned();
		} else isOffsetParent = true;
		return parent;
	}
	,isVoidElement: function() {
		return false;
	}
	,doGetInnerHTML: function(node,xml) {
		var length = node.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = node.childNodes[i];
			switch(child.get_nodeType()) {
			case 1:
				var childXml = Xml.createElement(child.get_nodeName());
				var childAttributes = child.attributes;
				var childAttributesLength = childAttributes.get_length();
				var _g1 = 0;
				while(_g1 < childAttributesLength) {
					var j = _g1++;
					var attribute = childAttributes.item(j);
					if(attribute.specified == true) childXml.set(attribute.name,attribute.get_value());
				}
				var htmlChild = child;
				var styleAttributes = htmlChild.style.attributes;
				var concatenatedStyles = "";
				var attributesLength = styleAttributes.get_length();
				var _g1 = 0;
				while(_g1 < attributesLength) {
					var j = _g1++;
					var attribute = styleAttributes.item(j);
					if(attribute.specified == true) concatenatedStyles += attribute.name + ":" + attribute.get_value() + ";";
				}
				if(concatenatedStyles != "") childXml.set("style",concatenatedStyles);
				xml.addChild(this.doGetInnerHTML(child,childXml));
				if(childXml.firstChild() == null && this.isVoidElement() == false) childXml.addChild(Xml.createPCData(""));
				break;
			case 3:
				var text = Xml.createPCData(child.get_nodeValue());
				xml.addChild(text);
				break;
			case 8:
				var comment = Xml.createComment(child.get_nodeValue());
				xml.addChild(comment);
				break;
			}
		}
		return xml;
	}
	,get_innerHTML: function() {
		var xml = this.doGetInnerHTML(this,Xml.createElement(this.get_nodeName()));
		var str = xml.toString();
		str = HxOverrides.substr(str,str.indexOf(">") + 1,str.lastIndexOf("<") - str.indexOf(">") - 1);
		return str;
	}
	,doSetInnerHTML: function(xml) {
		switch(xml.nodeType) {
		case Xml.PCData:
			return this.ownerDocument.createTextNode(xml.getNodeValue());
		case Xml.Comment:
			return this.ownerDocument.createComment(xml.getNodeValue());
		case Xml.Element:
			var htmlElement;
			var name = xml.getNodeName().toLowerCase();
			htmlElement = this.ownerDocument.createElement(name);
			var $it0 = xml.iterator();
			while( $it0.hasNext() ) {
				var child = $it0.next();
				switch(child.nodeType) {
				case Xml.PCData:
					if(child.getNodeValue() == "") continue;
					break;
				}
				var childNode = this.doSetInnerHTML(child);
				htmlElement.appendChild(childNode);
			}
			var $it1 = xml.attributes();
			while( $it1.hasNext() ) {
				var attribute = $it1.next();
				attribute = attribute.toLowerCase();
				var value = xml.get(attribute);
				htmlElement.setAttribute(attribute,value);
			}
			return htmlElement;
		}
		return null;
	}
	,set_innerHTML: function(value) {
		var childLength = this.childNodes.length;
		var _g = 0;
		while(_g < childLength) {
			var i = _g++;
			this.removeChild(this.childNodes[0]);
		}
		var wrappedHTML = "<" + "DIV" + ">";
		wrappedHTML += value;
		wrappedHTML += "<" + "/" + "DIV" + ">";
		var node = this.doSetInnerHTML(lib.haxe.xml.Parser.parse(wrappedHTML).firstElement());
		if(node == null) return value;
		var length = node.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			this.appendChild(node.childNodes[0]);
		}
		return value;
	}
	,set_hidden: function(value) {
		cocktail.core.dom.Element.prototype.setAttribute.call(this,"hidden",Std.string(value));
		return value;
	}
	,get_hidden: function() {
		if(this.getAttribute("hidden") != null) return true; else return false;
	}
	,set_className: function(value) {
		this.setAttribute("class",value);
		return value;
	}
	,get_className: function() {
		return this.getAttribute("class");
	}
	,set_id: function(value) {
		this.setAttribute("id",value);
		return value;
	}
	,get_id: function() {
		return this.getAttribute("id");
	}
	,get_tabIndex: function() {
		var tabIndex = cocktail.core.dom.Element.prototype.getAttribute.call(this,"tabIndex");
		if(tabIndex == "") {
			if(this.isDefaultFocusable() == true) return 0; else return -1;
		} else return Std.parseInt(tabIndex);
	}
	,set_tabIndex: function(value) {
		this.setAttribute("tabIndex",Std.string(value));
		return value;
	}
	,get_scrollTop: function() {
		if(this.elementRenderer != null) return Math.round(this.elementRenderer.get_scrollTop());
		return 0;
	}
	,set_scrollTop: function(value) {
		if(this.elementRenderer != null) this.elementRenderer.set_scrollTop(value);
		return 0;
	}
	,get_scrollLeft: function() {
		if(this.elementRenderer != null) return Math.round(this.elementRenderer.get_scrollLeft());
		return 0;
	}
	,set_scrollLeft: function(value) {
		if(this.elementRenderer != null) this.elementRenderer.set_scrollLeft(value);
		return 0;
	}
	,get_scrollWidth: function() {
		if(this.elementRenderer != null) return Math.round(this.elementRenderer.get_scrollWidth());
		return 0;
	}
	,get_scrollHeight: function() {
		if(this.elementRenderer != null) return Math.round(this.elementRenderer.get_scrollHeight());
		return 0;
	}
	,isHorizontallyScrollable: function(scrollOffset) {
		if(scrollOffset == null) scrollOffset = 0;
		if(this.elementRenderer != null) return this.elementRenderer.isHorizontallyScrollable(scrollOffset);
		return false;
	}
	,isVerticallyScrollable: function(scrollOffset) {
		if(scrollOffset == null) scrollOffset = 0;
		if(this.elementRenderer != null) return this.elementRenderer.isVerticallyScrollable(scrollOffset);
		return false;
	}
	,getNearestActivatableElement: function() {
		var htmlElement = this;
		while(htmlElement.hasActivationBehaviour() == false) {
			if(htmlElement.parentNode == null) return null;
			htmlElement = htmlElement.parentNode;
		}
		return htmlElement;
	}
	,runPostClickActivationStep: function(event) {
	}
	,runCanceledActivationStep: function() {
	}
	,runPreClickActivation: function() {
	}
	,hasActivationBehaviour: function() {
		return false;
	}
	,requestFullScreen: function() {
		var htmlDocument = this.ownerDocument;
		htmlDocument.set_fullscreenElement(this);
	}
	,blur: function() {
		var htmlDocument = this.ownerDocument;
		htmlDocument.body.focus();
	}
	,focus: function() {
		var htmlDocument = this.ownerDocument;
		htmlDocument.set_activeElement(this);
	}
	,isDefaultFocusable: function() {
		return false;
	}
	,isFocusable: function() {
		if(this.parentNode == null) return false; else if(this.isDefaultFocusable() == true) return true; else if(this.get_tabIndex() > 0) return true;
		return false;
	}
	,fireEvent: function(eventTye,bubbles,cancelable) {
		var event = new cocktail.core.event.Event();
		event.initEvent(eventTye,bubbles,cancelable);
		this.dispatchEvent(event);
	}
	,click: function() {
		var mouseEvent = new cocktail.core.event.MouseEvent();
		mouseEvent.initMouseEvent("click",false,false,null,0,0,0,0,0,false,false,false,false,0,null);
		this.dispatchEvent(mouseEvent);
	}
	,isParentRendered: function() {
		if(this.parentNode == null) return false;
		var htmlParent = this.parentNode;
		if(htmlParent.elementRenderer != null) return true; else return false;
	}
	,isRendered: function() {
		if(this.get_hidden() == true) return false;
		if(this.coreStyle.computedStyle.display == cocktail.core.style.Display.none) return false;
		return true;
	}
	,attachCoreStyle: function() {
		this.elementRenderer.set_coreStyle(this.coreStyle);
	}
	,createElementRenderer: function() {
		switch( (this.coreStyle.computedStyle.display)[1] ) {
		case 0:
		case 1:
			this.elementRenderer = new cocktail.core.renderer.BlockBoxRenderer(this);
			break;
		case 2:
			this.elementRenderer = new cocktail.core.renderer.InlineBoxRenderer(this);
			break;
		case 3:
			break;
		}
	}
	,detachFromParentElementRenderer: function() {
		this.elementRenderer.parentNode.removeChild(this.elementRenderer);
	}
	,attachToParentElementRenderer: function() {
		var parent = this.parentNode;
		parent.elementRenderer.insertBefore(this.elementRenderer,this.getNextElementRendererSibling());
	}
	,getNextElementRendererSibling: function() {
		var nextSibling = this.get_nextSibling();
		if(nextSibling == null) return null; else while(nextSibling != null) {
			if(nextSibling.elementRenderer != null) {
				var elementRenderParent = nextSibling.elementRenderer.parentNode;
				if(elementRenderParent.isAnonymousBlockBox() == true) return elementRenderParent;
				return nextSibling.elementRenderer;
			}
			nextSibling = nextSibling.get_nextSibling();
		}
		return null;
	}
	,detach: function() {
		if(this.isParentRendered() == true) {
			var parent = this.parentNode;
			if(this.elementRenderer != null) {
				var length = this.childNodes.length;
				var _g = 0;
				while(_g < length) {
					var i = _g++;
					switch(this.childNodes[i].get_nodeType()) {
					case 1:
						var child = this.childNodes[i];
						child.detach();
						break;
					case 3:
						var child = this.childNodes[i];
						child.detach();
						break;
					}
				}
				this.detachFromParentElementRenderer();
				this.elementRenderer.dispose();
				this.elementRenderer = null;
			}
		}
	}
	,attach: function() {
		if(this.isParentRendered() == true) {
			this.coreStyle.computeDisplayStyles();
			if(this.elementRenderer == null && this.isRendered() == true) {
				this.createElementRenderer();
				if(this.elementRenderer != null) this.attachCoreStyle();
			}
			if(this.elementRenderer != null) {
				this.attachToParentElementRenderer();
				var length = this.childNodes.length;
				var _g = 0;
				while(_g < length) {
					var i = _g++;
					switch(this.childNodes[i].get_nodeType()) {
					case 1:
						var child = this.childNodes[i];
						child.attach();
						break;
					case 3:
						var child = this.childNodes[i];
						child.attach();
						break;
					}
				}
			}
		}
	}
	,invalidatePositioningScheme: function() {
		if(this.parentNode != null) {
			this.parentNode.detach();
			this.parentNode.attach();
		}
	}
	,invalidate: function(invalidationReason) {
		if(this.elementRenderer != null) this.elementRenderer.invalidate(invalidationReason);
	}
	,executeDefaultActionIfNeeded: function(defaultPrevented,event) {
		if(defaultPrevented == false) switch(event.type) {
		case "mousedown":
			this.focus();
			break;
		}
	}
	,getTargetAncestors: function() {
		var targetAncestors = cocktail.core.dom.Element.prototype.getTargetAncestors.call(this);
		targetAncestors.push(cocktail.Lib.get_document());
		targetAncestors.push(cocktail.Lib.get_window());
		return targetAncestors;
	}
	,getAttribute: function(name) {
		if(name == "tabIndex") return Std.string(this.get_tabIndex()); else return cocktail.core.dom.Element.prototype.getAttribute.call(this,name);
	}
	,setAttribute: function(name,value) {
		if(name == "style") {
			var styleProxy = new lib.hxtml.StyleProxy();
			new lib.hxtml.CssParser().parse(value,this,styleProxy);
			cocktail.core.dom.Element.prototype.setAttribute.call(this,name,value);
		} else cocktail.core.dom.Element.prototype.setAttribute.call(this,name,value);
	}
	,getElementsByTagName: function(tagName) {
		return cocktail.core.dom.Element.prototype.getElementsByTagName.call(this,tagName.toUpperCase());
	}
	,removeChild: function(oldChild) {
		switch(oldChild.get_nodeType()) {
		case 1:
			var htmlChild = oldChild;
			htmlChild.detach();
			break;
		case 3:
			var textChild = oldChild;
			textChild.detach();
			break;
		}
		cocktail.core.dom.Element.prototype.removeChild.call(this,oldChild);
		return oldChild;
	}
	,appendChild: function(newChild) {
		cocktail.core.dom.Element.prototype.appendChild.call(this,newChild);
		switch(newChild.get_nodeType()) {
		case 1:
			var htmlChild = newChild;
			htmlChild.attach();
			break;
		case 3:
			var textChild = newChild;
			textChild.attach();
			break;
		}
		return newChild;
	}
	,initId: function() {
		var id = new cocktail.core.dom.Attr("id");
		this.setIdAttributeNode(id,true);
	}
	,initStyle: function() {
		this.style = new cocktail.core.style.adapter.Style(this.coreStyle);
	}
	,initCoreStyle: function() {
		this.coreStyle = new cocktail.core.style.CoreStyle(this);
	}
	,init: function() {
		this.initCoreStyle();
		this.initStyle();
		this.initId();
	}
	,style: null
	,coreStyle: null
	,clientTop: null
	,clientLeft: null
	,clientHeight: null
	,clientWidth: null
	,offsetTop: null
	,offsetLeft: null
	,offsetHeight: null
	,offsetWidth: null
	,offsetParent: null
	,elementRenderer: null
	,innerHTML: null
	,scrollWidth: null
	,scrollHeight: null
	,scrollLeft: null
	,scrollTop: null
	,hidden: null
	,className: null
	,id: null
	,tabIndex: null
	,__class__: cocktail.core.html.HTMLElement
	,__properties__: $extend(cocktail.core.dom.Element.prototype.__properties__,{set_tabIndex:"set_tabIndex",get_tabIndex:"get_tabIndex",set_id:"set_id",get_id:"get_id",set_className:"set_className",get_className:"get_className",set_hidden:"set_hidden",get_hidden:"get_hidden",set_scrollTop:"set_scrollTop",get_scrollTop:"get_scrollTop",set_scrollLeft:"set_scrollLeft",get_scrollLeft:"get_scrollLeft",get_scrollHeight:"get_scrollHeight",get_scrollWidth:"get_scrollWidth",set_innerHTML:"set_innerHTML",get_innerHTML:"get_innerHTML",get_offsetParent:"get_offsetParent",get_offsetWidth:"get_offsetWidth",get_offsetHeight:"get_offsetHeight",get_offsetLeft:"get_offsetLeft",get_offsetTop:"get_offsetTop",get_clientWidth:"get_clientWidth",get_clientHeight:"get_clientHeight",get_clientLeft:"get_clientLeft",get_clientTop:"get_clientTop"})
});
cocktail.core.dom.CharacterData = function() {
	cocktail.core.html.HTMLElement.call(this,"");
};
$hxClasses["cocktail.core.dom.CharacterData"] = cocktail.core.dom.CharacterData;
cocktail.core.dom.CharacterData.__name__ = ["cocktail","core","dom","CharacterData"];
cocktail.core.dom.CharacterData.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.dom.CharacterData.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	set_nodeValue: function(value) {
		return this.data = value;
	}
	,get_nodeValue: function() {
		return this.data;
	}
	,data: null
	,__class__: cocktail.core.dom.CharacterData
});
cocktail.core.dom.Comment = function() {
	cocktail.core.dom.CharacterData.call(this);
};
$hxClasses["cocktail.core.dom.Comment"] = cocktail.core.dom.Comment;
cocktail.core.dom.Comment.__name__ = ["cocktail","core","dom","Comment"];
cocktail.core.dom.Comment.__super__ = cocktail.core.dom.CharacterData;
cocktail.core.dom.Comment.prototype = $extend(cocktail.core.dom.CharacterData.prototype,{
	get_nodeType: function() {
		return 8;
	}
	,__class__: cocktail.core.dom.Comment
});
cocktail.core.dom.DOMConstants = function() {
};
$hxClasses["cocktail.core.dom.DOMConstants"] = cocktail.core.dom.DOMConstants;
cocktail.core.dom.DOMConstants.__name__ = ["cocktail","core","dom","DOMConstants"];
cocktail.core.dom.DOMConstants.prototype = {
	__class__: cocktail.core.dom.DOMConstants
}
cocktail.core.dom.DOMException = function() {
};
$hxClasses["cocktail.core.dom.DOMException"] = cocktail.core.dom.DOMException;
cocktail.core.dom.DOMException.__name__ = ["cocktail","core","dom","DOMException"];
cocktail.core.dom.DOMException.prototype = {
	__class__: cocktail.core.dom.DOMException
}
cocktail.core.dom.Document = function() {
	cocktail.core.dom.Node.call(this);
};
$hxClasses["cocktail.core.dom.Document"] = cocktail.core.dom.Document;
cocktail.core.dom.Document.__name__ = ["cocktail","core","dom","Document"];
cocktail.core.dom.Document.__super__ = cocktail.core.dom.Node;
cocktail.core.dom.Document.prototype = $extend(cocktail.core.dom.Node.prototype,{
	get_nodeType: function() {
		return 9;
	}
	,getElementsByClassName: function(className) {
		return this.documentElement.getElementsByClassName(className);
	}
	,getElementsByTagName: function(tagName) {
		return this.documentElement.getElementsByTagName(tagName);
	}
	,doGetElementById: function(node,elementId) {
		if(node.hasChildNodes() == true && node.get_nodeType() == 1) {
			var length = node.childNodes.length;
			var _g = 0;
			while(_g < length) {
				var i = _g++;
				var matchingElement = this.doGetElementById(node.childNodes[i],elementId);
				if(matchingElement != null) return matchingElement;
			}
		}
		if(node.hasAttributes() == true) {
			var attributes = node.attributes;
			var element = node;
			var attributesLength = attributes.get_length();
			var _g = 0;
			while(_g < attributesLength) {
				var i = _g++;
				var attribute = element.getAttributeNode(attributes.item(i).get_nodeName());
				if(attribute.isId == true && attribute.specified == true) {
					if(attribute.get_value() == elementId) return element;
				}
			}
		}
		return null;
	}
	,getElementById: function(elementId) {
		return this.doGetElementById(this.documentElement,elementId);
	}
	,createEvent: function(eventInterface) {
		switch(eventInterface) {
		case "Event":
			return new cocktail.core.event.Event();
		case "UIEvent":
			return new cocktail.core.event.UIEvent();
		case "CustomEvent":
			return new cocktail.core.event.CustomEvent();
		case "MouseEvent":
			return new cocktail.core.event.MouseEvent();
		case "KeyboardEvent":
			return new cocktail.core.event.KeyboardEvent();
		case "FocusEvent":
			return new cocktail.core.event.FocusEvent();
		case "WheelEvent":
			return new cocktail.core.event.WheelEvent();
		case "TransitionEvent":
			return new cocktail.core.event.TransitionEvent();
		default:
			throw 9;
		}
		return null;
	}
	,createAttribute: function(name) {
		var attribute = new cocktail.core.dom.Attr(name);
		return attribute;
	}
	,createComment: function(data) {
		var comment = new cocktail.core.dom.Comment();
		comment.set_nodeValue(data);
		return comment;
	}
	,createTextNode: function(data) {
		var text = new cocktail.core.dom.Text();
		text.set_nodeValue(data);
		return text;
	}
	,createElement: function(tagName) {
		return null;
	}
	,documentElement: null
	,__class__: cocktail.core.dom.Document
});
cocktail.core.dom.NamedNodeMap = function() {
	this._nodes = new Array();
};
$hxClasses["cocktail.core.dom.NamedNodeMap"] = cocktail.core.dom.NamedNodeMap;
cocktail.core.dom.NamedNodeMap.__name__ = ["cocktail","core","dom","NamedNodeMap"];
cocktail.core.dom.NamedNodeMap.prototype = {
	get_length: function() {
		return this._nodes.length;
	}
	,item: function(index) {
		if(index > this.get_length() - 1) return null; else return this._nodes[index];
	}
	,removeNamedItem: function(name) {
		var removedNode = this.getNamedItem(name);
		if(removedNode == null) return null;
		var newNodes = new Array();
		var _g1 = 0, _g = this.get_length();
		while(_g1 < _g) {
			var i = _g1++;
			if(this._nodes[i].isSameNode(removedNode) == false) newNodes.push(this._nodes[i]);
		}
		this._nodes = newNodes;
		return removedNode;
	}
	,setNamedItem: function(arg) {
		var replacedNode = this.getNamedItem(arg.get_nodeName());
		if(replacedNode != null) {
			var _g1 = 0, _g = this.get_length();
			while(_g1 < _g) {
				var i = _g1++;
				if(this._nodes[i].isSameNode(replacedNode) == true) {
					this._nodes[i] = arg;
					return replacedNode;
				}
			}
		} else this._nodes.push(arg);
		return replacedNode;
	}
	,getNamedItem: function(name) {
		var nodesLength = this._nodes.length;
		var _g = 0;
		while(_g < nodesLength) {
			var i = _g++;
			if(this._nodes[i].get_nodeName() == name) return this._nodes[i];
		}
		return null;
	}
	,length: null
	,_nodes: null
	,__class__: cocktail.core.dom.NamedNodeMap
	,__properties__: {get_length:"get_length"}
}
cocktail.core.dom.Text = function() {
	cocktail.core.dom.CharacterData.call(this);
};
$hxClasses["cocktail.core.dom.Text"] = cocktail.core.dom.Text;
cocktail.core.dom.Text.__name__ = ["cocktail","core","dom","Text"];
cocktail.core.dom.Text.__super__ = cocktail.core.dom.CharacterData;
cocktail.core.dom.Text.prototype = $extend(cocktail.core.dom.CharacterData.prototype,{
	get_nodeType: function() {
		return 3;
	}
	,get_nodeName: function() {
		return "#text";
	}
	,attachCoreStyle: function() {
		var parent = this.parentNode;
		this.elementRenderer.set_coreStyle(parent.coreStyle);
	}
	,createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.TextRenderer(this);
	}
	,__class__: cocktail.core.dom.Text
});
cocktail.core.drawing.FillStyleValue = $hxClasses["cocktail.core.drawing.FillStyleValue"] = { __ename__ : ["cocktail","core","drawing","FillStyleValue"], __constructs__ : ["none","monochrome","gradient","bitmap"] }
cocktail.core.drawing.FillStyleValue.none = ["none",0];
cocktail.core.drawing.FillStyleValue.none.toString = $estr;
cocktail.core.drawing.FillStyleValue.none.__enum__ = cocktail.core.drawing.FillStyleValue;
cocktail.core.drawing.FillStyleValue.monochrome = function(colorStop) { var $x = ["monochrome",1,colorStop]; $x.__enum__ = cocktail.core.drawing.FillStyleValue; $x.toString = $estr; return $x; }
cocktail.core.drawing.FillStyleValue.gradient = function(gradientStyle) { var $x = ["gradient",2,gradientStyle]; $x.__enum__ = cocktail.core.drawing.FillStyleValue; $x.toString = $estr; return $x; }
cocktail.core.drawing.FillStyleValue.bitmap = function(nativeElement,repeat) { var $x = ["bitmap",3,nativeElement,repeat]; $x.__enum__ = cocktail.core.drawing.FillStyleValue; $x.toString = $estr; return $x; }
cocktail.core.drawing.LineStyleValue = $hxClasses["cocktail.core.drawing.LineStyleValue"] = { __ename__ : ["cocktail","core","drawing","LineStyleValue"], __constructs__ : ["none","monochrome","gradient","bitmap"] }
cocktail.core.drawing.LineStyleValue.none = ["none",0];
cocktail.core.drawing.LineStyleValue.none.toString = $estr;
cocktail.core.drawing.LineStyleValue.none.__enum__ = cocktail.core.drawing.LineStyleValue;
cocktail.core.drawing.LineStyleValue.monochrome = function(color,lineStyle) { var $x = ["monochrome",1,color,lineStyle]; $x.__enum__ = cocktail.core.drawing.LineStyleValue; $x.toString = $estr; return $x; }
cocktail.core.drawing.LineStyleValue.gradient = function(gradientStyle,lineStyle) { var $x = ["gradient",2,gradientStyle,lineStyle]; $x.__enum__ = cocktail.core.drawing.LineStyleValue; $x.toString = $estr; return $x; }
cocktail.core.drawing.LineStyleValue.bitmap = function(nativeElement,lineStyle,repeat) { var $x = ["bitmap",3,nativeElement,lineStyle,repeat]; $x.__enum__ = cocktail.core.drawing.LineStyleValue; $x.toString = $estr; return $x; }
cocktail.core.drawing.GradientTypeValue = $hxClasses["cocktail.core.drawing.GradientTypeValue"] = { __ename__ : ["cocktail","core","drawing","GradientTypeValue"], __constructs__ : ["linear","radial"] }
cocktail.core.drawing.GradientTypeValue.linear = ["linear",0];
cocktail.core.drawing.GradientTypeValue.linear.toString = $estr;
cocktail.core.drawing.GradientTypeValue.linear.__enum__ = cocktail.core.drawing.GradientTypeValue;
cocktail.core.drawing.GradientTypeValue.radial = ["radial",1];
cocktail.core.drawing.GradientTypeValue.radial.toString = $estr;
cocktail.core.drawing.GradientTypeValue.radial.__enum__ = cocktail.core.drawing.GradientTypeValue;
cocktail.core.drawing.CapsStyleValue = $hxClasses["cocktail.core.drawing.CapsStyleValue"] = { __ename__ : ["cocktail","core","drawing","CapsStyleValue"], __constructs__ : ["none","square","round"] }
cocktail.core.drawing.CapsStyleValue.none = ["none",0];
cocktail.core.drawing.CapsStyleValue.none.toString = $estr;
cocktail.core.drawing.CapsStyleValue.none.__enum__ = cocktail.core.drawing.CapsStyleValue;
cocktail.core.drawing.CapsStyleValue.square = ["square",1];
cocktail.core.drawing.CapsStyleValue.square.toString = $estr;
cocktail.core.drawing.CapsStyleValue.square.__enum__ = cocktail.core.drawing.CapsStyleValue;
cocktail.core.drawing.CapsStyleValue.round = ["round",2];
cocktail.core.drawing.CapsStyleValue.round.toString = $estr;
cocktail.core.drawing.CapsStyleValue.round.__enum__ = cocktail.core.drawing.CapsStyleValue;
cocktail.core.drawing.JointStyleValue = $hxClasses["cocktail.core.drawing.JointStyleValue"] = { __ename__ : ["cocktail","core","drawing","JointStyleValue"], __constructs__ : ["miter","round","bevel"] }
cocktail.core.drawing.JointStyleValue.miter = ["miter",0];
cocktail.core.drawing.JointStyleValue.miter.toString = $estr;
cocktail.core.drawing.JointStyleValue.miter.__enum__ = cocktail.core.drawing.JointStyleValue;
cocktail.core.drawing.JointStyleValue.round = ["round",1];
cocktail.core.drawing.JointStyleValue.round.toString = $estr;
cocktail.core.drawing.JointStyleValue.round.__enum__ = cocktail.core.drawing.JointStyleValue;
cocktail.core.drawing.JointStyleValue.bevel = ["bevel",2];
cocktail.core.drawing.JointStyleValue.bevel.toString = $estr;
cocktail.core.drawing.JointStyleValue.bevel.__enum__ = cocktail.core.drawing.JointStyleValue;
cocktail.core.event.Event = function() {
};
$hxClasses["cocktail.core.event.Event"] = cocktail.core.event.Event;
cocktail.core.event.Event.__name__ = ["cocktail","core","event","Event"];
cocktail.core.event.Event.prototype = {
	stopImmediatePropagation: function() {
		this.immediatePropagationStopped = true;
	}
	,stopPropagation: function() {
		this.propagationStopped = true;
	}
	,preventDefault: function() {
		this.defaultPrevented = true;
	}
	,reset: function() {
		this.dispatched = false;
		this.defaultPrevented = false;
		this.propagationStopped = false;
		this.immediatePropagationStopped = false;
		this.target = null;
		this.currentTarget = null;
		this.type = null;
		this.bubbles = false;
		this.cancelable = false;
		this.eventPhase = 0;
	}
	,initEvent: function(eventTypeArg,canBubbleArg,cancelableArg) {
		if(this.dispatched == true) return;
		this.type = eventTypeArg;
		this.bubbles = canBubbleArg;
		this.cancelable = cancelableArg;
	}
	,dispatched: null
	,immediatePropagationStopped: null
	,propagationStopped: null
	,defaultPrevented: null
	,cancelable: null
	,bubbles: null
	,currentTarget: null
	,target: null
	,type: null
	,eventPhase: null
	,__class__: cocktail.core.event.Event
}
cocktail.core.event.CustomEvent = function() {
	cocktail.core.event.Event.call(this);
};
$hxClasses["cocktail.core.event.CustomEvent"] = cocktail.core.event.CustomEvent;
cocktail.core.event.CustomEvent.__name__ = ["cocktail","core","event","CustomEvent"];
cocktail.core.event.CustomEvent.__super__ = cocktail.core.event.Event;
cocktail.core.event.CustomEvent.prototype = $extend(cocktail.core.event.Event.prototype,{
	initCustomEvent: function(eventTypeArg,canBubbleArg,cancelableArg,detailArg) {
		if(this.dispatched == true) return;
		this.initEvent(eventTypeArg,canBubbleArg,cancelableArg);
		this.detail = detailArg;
	}
	,detail: null
	,__class__: cocktail.core.event.CustomEvent
});
cocktail.core.event.EventListener = function(eventType,listener,useCapture) {
	this.listener = listener;
	this.useCapture = useCapture;
	this.eventType = eventType;
};
$hxClasses["cocktail.core.event.EventListener"] = cocktail.core.event.EventListener;
cocktail.core.event.EventListener.__name__ = ["cocktail","core","event","EventListener"];
cocktail.core.event.EventListener.prototype = {
	dispose: function() {
		this.listener = null;
	}
	,handleEvent: function(evt) {
		this.listener(evt);
	}
	,eventType: null
	,listener: null
	,useCapture: null
	,__class__: cocktail.core.event.EventListener
}
cocktail.core.event.UIEvent = function() {
	cocktail.core.event.Event.call(this);
};
$hxClasses["cocktail.core.event.UIEvent"] = cocktail.core.event.UIEvent;
cocktail.core.event.UIEvent.__name__ = ["cocktail","core","event","UIEvent"];
cocktail.core.event.UIEvent.__super__ = cocktail.core.event.Event;
cocktail.core.event.UIEvent.prototype = $extend(cocktail.core.event.Event.prototype,{
	initUIEvent: function(eventTypeArg,canBubbleArg,cancelableArg,viewArg,detailArg) {
		if(this.dispatched == true) return;
		this.initEvent(eventTypeArg,canBubbleArg,cancelableArg);
		this.view = viewArg;
		this.detail = detailArg;
	}
	,detail: null
	,view: null
	,__class__: cocktail.core.event.UIEvent
});
cocktail.core.event.FocusEvent = function() {
	cocktail.core.event.UIEvent.call(this);
};
$hxClasses["cocktail.core.event.FocusEvent"] = cocktail.core.event.FocusEvent;
cocktail.core.event.FocusEvent.__name__ = ["cocktail","core","event","FocusEvent"];
cocktail.core.event.FocusEvent.__super__ = cocktail.core.event.UIEvent;
cocktail.core.event.FocusEvent.prototype = $extend(cocktail.core.event.UIEvent.prototype,{
	initFocusEvent: function(eventTypeArg,canBubbleArg,cancelableArg,viewArg,detailArg,relatedTargetArg) {
		if(this.dispatched == true) return;
		this.initUIEvent(eventTypeArg,canBubbleArg,cancelableArg,viewArg,detailArg);
		this.relatedTarget = relatedTargetArg;
	}
	,relatedTarget: null
	,__class__: cocktail.core.event.FocusEvent
});
cocktail.core.event.KeyboardEvent = function() {
	cocktail.core.event.UIEvent.call(this);
};
$hxClasses["cocktail.core.event.KeyboardEvent"] = cocktail.core.event.KeyboardEvent;
cocktail.core.event.KeyboardEvent.__name__ = ["cocktail","core","event","KeyboardEvent"];
cocktail.core.event.KeyboardEvent.__super__ = cocktail.core.event.UIEvent;
cocktail.core.event.KeyboardEvent.prototype = $extend(cocktail.core.event.UIEvent.prototype,{
	initKeyboardEvent: function(eventTypeArg,canBubbleArg,cancelableArg,viewArg,charArg,keyArg,locationArg,modifiersListArg,repeatArg,localeArg) {
		if(this.dispatched == true) return;
		this.initUIEvent(eventTypeArg,canBubbleArg,cancelableArg,viewArg,0);
		this.keyChar = charArg;
		this.key = keyArg;
		this.repeat = repeatArg;
		this.location = locationArg;
		this.locale = localeArg;
	}
	,repeat: null
	,metaKey: null
	,altKey: null
	,shiftKey: null
	,ctrlKey: null
	,locale: null
	,location: null
	,key: null
	,keyChar: null
	,__class__: cocktail.core.event.KeyboardEvent
});
cocktail.core.event.MouseEvent = function() {
	cocktail.core.event.UIEvent.call(this);
};
$hxClasses["cocktail.core.event.MouseEvent"] = cocktail.core.event.MouseEvent;
cocktail.core.event.MouseEvent.__name__ = ["cocktail","core","event","MouseEvent"];
cocktail.core.event.MouseEvent.__super__ = cocktail.core.event.UIEvent;
cocktail.core.event.MouseEvent.prototype = $extend(cocktail.core.event.UIEvent.prototype,{
	initMouseEvent: function(eventTypeArg,canBubbleArg,cancelableArg,viewArg,detailArg,screenXArg,screenYArg,clientXArg,clientYArg,ctrlKeyArg,altKeyArg,shiftKeyArg,metaKeyArg,buttonArg,relatedTargeArg) {
		if(this.dispatched == true) return;
		this.initUIEvent(eventTypeArg,canBubbleArg,cancelableArg,viewArg,detailArg);
		this.screenX = screenXArg;
		this.screenY = screenYArg;
		this.clientX = clientXArg;
		this.clientY = clientYArg;
		this.ctrlKey = ctrlKeyArg;
		this.shiftKey = shiftKeyArg;
		this.altKey = altKeyArg;
		this.metaKey = metaKeyArg;
		this.button = buttonArg;
		this.relatedTarget = relatedTargeArg;
	}
	,relatedTarget: null
	,button: null
	,metaKey: null
	,altKey: null
	,shiftKey: null
	,ctrlKey: null
	,clientY: null
	,clientX: null
	,screenY: null
	,screenX: null
	,__class__: cocktail.core.event.MouseEvent
});
cocktail.core.event.TransitionEvent = function() {
	cocktail.core.event.Event.call(this);
};
$hxClasses["cocktail.core.event.TransitionEvent"] = cocktail.core.event.TransitionEvent;
cocktail.core.event.TransitionEvent.__name__ = ["cocktail","core","event","TransitionEvent"];
cocktail.core.event.TransitionEvent.__super__ = cocktail.core.event.Event;
cocktail.core.event.TransitionEvent.prototype = $extend(cocktail.core.event.Event.prototype,{
	initTransitionEvent: function(eventTypeArg,canBubbleArg,cancelableArg,propertyNameArg,elapsedTimeArg,pseudoElementArg) {
		if(this.dispatched == true) return;
		this.initEvent(eventTypeArg,canBubbleArg,cancelableArg);
		this.propertyName = propertyNameArg;
		this.elapsedTime = elapsedTimeArg;
		this.pseudoElement = pseudoElementArg;
	}
	,pseudoElement: null
	,elapsedTime: null
	,propertyName: null
	,__class__: cocktail.core.event.TransitionEvent
});
cocktail.core.event.WheelEvent = function() {
	cocktail.core.event.MouseEvent.call(this);
};
$hxClasses["cocktail.core.event.WheelEvent"] = cocktail.core.event.WheelEvent;
cocktail.core.event.WheelEvent.__name__ = ["cocktail","core","event","WheelEvent"];
cocktail.core.event.WheelEvent.__super__ = cocktail.core.event.MouseEvent;
cocktail.core.event.WheelEvent.prototype = $extend(cocktail.core.event.MouseEvent.prototype,{
	initWheelEvent: function(eventTypeArg,canBubbleArg,cancelableArg,viewArg,detailArg,screenXArg,screenYArg,clientXArg,clientYArg,buttonArg,relatedTargetArg,modifiersListArg,deltaXArg,deltaYArg,deltaZArg,deltaModeArg) {
		if(this.dispatched == true) return;
		this.initMouseEvent(eventTypeArg,canBubbleArg,cancelableArg,viewArg,detailArg,screenXArg,screenYArg,clientXArg,clientYArg,false,false,false,false,buttonArg,relatedTargetArg);
		this.deltaY = deltaYArg;
		this.deltaX = deltaXArg;
		this.deltaMode = deltaModeArg;
		this.deltaZ = deltaZArg;
	}
	,deltaMode: null
	,deltaZ: null
	,deltaY: null
	,deltaX: null
	,__class__: cocktail.core.event.WheelEvent
});
cocktail.core.focus = {}
cocktail.core.focus.FocusManager = function() {
};
$hxClasses["cocktail.core.focus.FocusManager"] = cocktail.core.focus.FocusManager;
cocktail.core.focus.FocusManager.__name__ = ["cocktail","core","focus","FocusManager"];
cocktail.core.focus.FocusManager.prototype = {
	setActiveElement: function(newActiveElement,body) {
		if(newActiveElement == null) return this.activeElement;
		if(this.activeElement == null) return this.activeElement = newActiveElement;
		if(newActiveElement != this.activeElement) {
			var focusOutEvent = new cocktail.core.event.FocusEvent();
			focusOutEvent.initFocusEvent("focusout",true,false,null,0.0,newActiveElement);
			this.activeElement.dispatchEvent(focusOutEvent);
			var focusInEvent = new cocktail.core.event.FocusEvent();
			focusInEvent.initFocusEvent("focusin",true,false,null,0.0,this.activeElement);
			newActiveElement.dispatchEvent(focusInEvent);
			var oldActiveElement = this.activeElement;
			if(newActiveElement.isFocusable() == true) this.activeElement = newActiveElement; else this.activeElement = body;
			var blurEvent = new cocktail.core.event.FocusEvent();
			blurEvent.initFocusEvent("blur",false,false,null,0.0,null);
			oldActiveElement.dispatchEvent(blurEvent);
			var focusEvent = new cocktail.core.event.FocusEvent();
			focusEvent.initFocusEvent("focus",false,false,null,0.0,null);
			newActiveElement.dispatchEvent(focusEvent);
			if(this.activeElement.onfocus != null) {
				var focusEvent1 = new cocktail.core.event.FocusEvent();
				focusEvent1.initFocusEvent("focus",true,false,null,0.0,null);
				this.activeElement.onfocus(focusEvent1);
			}
		}
		return this.activeElement;
	}
	,doBuildTabList: function(htmlElement,orderedTabList,indexedTabList) {
		var _g1 = 0, _g = htmlElement.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(htmlElement.childNodes[i].get_nodeType() == 1) {
				var child = htmlElement.childNodes[i];
				if(child.hasChildNodes() == true) this.doBuildTabList(child,orderedTabList,indexedTabList);
				if(child.isFocusable() == true) {
					if(child.get_tabIndex() == 0) orderedTabList.push(child); else if(child.get_tabIndex() > 0) {
						if(indexedTabList.length == 0) indexedTabList.push(child); else {
							var foundSpotFlag = false;
							var _g3 = 0, _g2 = indexedTabList.length;
							while(_g3 < _g2) {
								var j = _g3++;
								if(child.get_tabIndex() < indexedTabList[j].get_tabIndex()) {
									indexedTabList.splice(j,0,child);
									foundSpotFlag = true;
								}
							}
							if(foundSpotFlag == false) indexedTabList.push(child);
						}
					}
				}
			}
		}
	}
	,buildTabList: function(rootElement) {
		var orderedTabList = new Array();
		var indexedTabList = new Array();
		this.doBuildTabList(rootElement,orderedTabList,indexedTabList);
		var _g1 = 0, _g = orderedTabList.length;
		while(_g1 < _g) {
			var i = _g1++;
			indexedTabList.push(orderedTabList[i]);
		}
		return indexedTabList;
	}
	,getElementTabListIndex: function(element,tabList) {
		var _g1 = 0, _g = tabList.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(tabList[i] == element) return i;
		}
		return -1;
	}
	,getNextFocusedElement: function(reverse,rootElement,activeElement) {
		var tabList = this.buildTabList(rootElement);
		var tabListIndex;
		if(activeElement == rootElement) {
			if(reverse == false) tabListIndex = 0; else tabListIndex = tabList.length - 1;
		} else {
			tabListIndex = this.getElementTabListIndex(activeElement,tabList);
			if(reverse == false) tabListIndex++; else tabListIndex--;
		}
		if(tabListIndex == tabList.length) tabListIndex = 0; else if(tabListIndex == -1) tabListIndex = tabList.length - 1;
		return tabList[tabListIndex];
	}
	,activeElement: null
	,__class__: cocktail.core.focus.FocusManager
}
cocktail.core.font = {}
cocktail.core.font.AbstractFontManagerImpl = function() {
	this._computedFontMetrics = new Hash();
};
$hxClasses["cocktail.core.font.AbstractFontManagerImpl"] = cocktail.core.font.AbstractFontManagerImpl;
cocktail.core.font.AbstractFontManagerImpl.__name__ = ["cocktail","core","font","AbstractFontManagerImpl"];
cocktail.core.font.AbstractFontManagerImpl.prototype = {
	doGetFontMetrics: function(fontFamily,fontSize) {
		return null;
	}
	,createNativeTextElement: function(text,computedStyle) {
		return null;
	}
	,getFontMetrics: function(fontFamily,fontSize) {
		var fontMetrics;
		if(this._computedFontMetrics.exists(fontFamily) == true) {
			var fontSizeHash = this._computedFontMetrics.get(fontFamily);
			if(fontSizeHash.exists(Std.string(fontSize)) == true) fontMetrics = fontSizeHash.get(Std.string(fontSize)); else {
				fontMetrics = this.doGetFontMetrics(fontFamily,fontSize);
				fontSizeHash.set(Std.string(fontSize),fontMetrics);
				this._computedFontMetrics.set(fontFamily,fontSizeHash);
			}
		} else {
			fontMetrics = this.doGetFontMetrics(fontFamily,fontSize);
			var fontSizeHash = new Hash();
			fontSizeHash.set(Std.string(fontSize),fontMetrics);
			this._computedFontMetrics.set(fontFamily,fontSizeHash);
		}
		return fontMetrics;
	}
	,_computedFontMetrics: null
	,__class__: cocktail.core.font.AbstractFontManagerImpl
}
cocktail.core.font.FontManager = function() {
	this._fontManagerImpl = new cocktail.port.server.FontManagerImpl();
};
$hxClasses["cocktail.core.font.FontManager"] = cocktail.core.font.FontManager;
cocktail.core.font.FontManager.__name__ = ["cocktail","core","font","FontManager"];
cocktail.core.font.FontManager._instance = null;
cocktail.core.font.FontManager.getInstance = function() {
	if(cocktail.core.font.FontManager._instance == null) cocktail.core.font.FontManager._instance = new cocktail.core.font.FontManager();
	return cocktail.core.font.FontManager._instance;
}
cocktail.core.font.FontManager.prototype = {
	createNativeTextElement: function(text,computedStyle) {
		return this._fontManagerImpl.createNativeTextElement(text,computedStyle);
	}
	,getFontMetrics: function(fontFamily,fontSize) {
		return this._fontManagerImpl.getFontMetrics(fontFamily,fontSize);
	}
	,_fontManagerImpl: null
	,__class__: cocktail.core.font.FontManager
}
cocktail.core.geom = {}
cocktail.core.geom.CubicBezier = function(x1,y1,x2,y2) {
	this._x1 = x1;
	this._y1 = y1;
	this._x2 = x2;
	this._y2 = y2;
	this._cx = 3 * this._x1;
	this._bx = 3 * (this._x2 - this._x1) - this._cx;
	this._ax = 1 - this._cx - this._bx;
	this._cy = 3 * this._y1;
	this._by = 3 * (this._y2 - this._y1) - this._cy;
	this._ay = 1 - this._cy - this._by;
};
$hxClasses["cocktail.core.geom.CubicBezier"] = cocktail.core.geom.CubicBezier;
cocktail.core.geom.CubicBezier.__name__ = ["cocktail","core","geom","CubicBezier"];
cocktail.core.geom.CubicBezier.prototype = {
	bezierY: function(t) {
		return t * (this._cy + t * (this._by + t * this._ay));
	}
	,bezierX: function(t) {
		return t * (this._cx + t * (this._bx + t * this._ax));
	}
	,_ay: null
	,_by: null
	,_cy: null
	,_ax: null
	,_bx: null
	,_cx: null
	,_y2: null
	,_x2: null
	,_y1: null
	,_x1: null
	,__class__: cocktail.core.geom.CubicBezier
}
cocktail.core.geom.Matrix = function(data) {
	this.set_data(data);
};
$hxClasses["cocktail.core.geom.Matrix"] = cocktail.core.geom.Matrix;
cocktail.core.geom.Matrix.__name__ = ["cocktail","core","geom","Matrix"];
cocktail.core.geom.Matrix.prototype = {
	skew: function(skewX,skewY) {
		var skewedMatrix = new cocktail.core.geom.Matrix();
		var skewingMatrixData = { a : 1.0, b : Math.tan(skewY), c : Math.tan(skewX), d : 1.0, e : 0.0, f : 0.0};
		var skewingMatrix = new cocktail.core.geom.Matrix(skewingMatrixData);
		skewedMatrix.concatenate(skewingMatrix);
		this.concatenate(skewedMatrix);
	}
	,scale: function(scaleX,scaleY) {
		var scaledMatrix = new cocktail.core.geom.Matrix();
		var scalingMatrixData = { a : scaleX, b : 0.0, c : 0.0, d : scaleY, e : 0.0, f : 0.0};
		var scalingMatrix = new cocktail.core.geom.Matrix(scalingMatrixData);
		scaledMatrix.concatenate(scalingMatrix);
		this.concatenate(scaledMatrix);
	}
	,rotate: function(angle) {
		var rotatedMatrix = new cocktail.core.geom.Matrix();
		var a = 0.0;
		var b = 0.0;
		var c = 0.0;
		var d = 0.0;
		if(angle == Math.PI / 2) {
			a = d = 0.0;
			c = b = 1.0;
		} else if(angle == Math.PI) {
			a = d = -1.0;
			c = b = 0.0;
		} else if(angle == Math.PI * 3 / 2) {
			a = d = 0.0;
			c = b = -1.0;
		} else {
			a = d = Math.cos(angle);
			c = b = Math.sin(angle);
		}
		var rotationMatrixData = { a : a, b : b, c : c * -1.0, d : d, e : 0.0, f : 0.0};
		var rotationMatrix = new cocktail.core.geom.Matrix(rotationMatrixData);
		rotatedMatrix.concatenate(rotationMatrix);
		this.concatenate(rotatedMatrix);
	}
	,translate: function(x,y) {
		var translationMatrixData = { a : 1.0, b : 0.0, c : 0.0, d : 1.0, e : x, f : y};
		var translationMatrix = new cocktail.core.geom.Matrix(translationMatrixData);
		this.concatenate(translationMatrix);
	}
	,concatenate: function(matrix) {
		var currentMatrixData = this.data;
		var targetMatrixData = matrix.data;
		var a = currentMatrixData.a * targetMatrixData.a + currentMatrixData.c * targetMatrixData.b;
		var b = currentMatrixData.b * targetMatrixData.a + currentMatrixData.d * targetMatrixData.b;
		var c = currentMatrixData.a * targetMatrixData.c + currentMatrixData.c * targetMatrixData.d;
		var d = currentMatrixData.b * targetMatrixData.c + currentMatrixData.d * targetMatrixData.d;
		var e = currentMatrixData.a * targetMatrixData.e + currentMatrixData.c * targetMatrixData.f + currentMatrixData.e;
		var f = currentMatrixData.b * targetMatrixData.e + currentMatrixData.d * targetMatrixData.f + currentMatrixData.f;
		var concatenatedMatrixData = { a : a, b : b, c : c, d : d, e : e, f : f};
		this.set_data(concatenatedMatrixData);
	}
	,set_data: function(data) {
		this.data = data;
		if(data == null) this.identity();
		return data;
	}
	,identity: function() {
		this.set_data({ a : 1.0, b : 0.0, c : 0.0, d : 1.0, e : 0.0, f : 0.0});
	}
	,data: null
	,__class__: cocktail.core.geom.Matrix
	,__properties__: {set_data:"set_data"}
}
cocktail.core.html.EmbeddedElement = function(tagName) {
	cocktail.core.html.HTMLElement.call(this,tagName);
};
$hxClasses["cocktail.core.html.EmbeddedElement"] = cocktail.core.html.EmbeddedElement;
cocktail.core.html.EmbeddedElement.__name__ = ["cocktail","core","html","EmbeddedElement"];
cocktail.core.html.EmbeddedElement.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.html.EmbeddedElement.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	get_height: function() {
		var height = cocktail.core.html.HTMLElement.prototype.getAttribute.call(this,"height");
		if(height == null) return 0; else return Std.parseInt(height);
	}
	,set_height: function(value) {
		cocktail.core.html.HTMLElement.prototype.setAttribute.call(this,"height",Std.string(value));
		return value;
	}
	,get_width: function() {
		var width = cocktail.core.html.HTMLElement.prototype.getAttribute.call(this,"width");
		if(width == null) return 0; else return Std.parseInt(width);
	}
	,set_width: function(value) {
		cocktail.core.html.HTMLElement.prototype.setAttribute.call(this,"width",Std.string(value));
		return value;
	}
	,get_intrinsicRatio: function() {
		return this.intrinsicRatio;
	}
	,get_intrinsicWidth: function() {
		return this.intrinsicWidth;
	}
	,get_intrinsicHeight: function() {
		return this.intrinsicHeight;
	}
	,getAttribute: function(name) {
		if(name == "height") return Std.string(this.get_height()); else if(name == "width") return Std.string(this.get_width()); else return cocktail.core.html.HTMLElement.prototype.getAttribute.call(this,name);
	}
	,setAttribute: function(name,value) {
		if(name == "height") this.set_height(Std.parseInt(value)); else if(name == "width") this.set_width(Std.parseInt(value)); else cocktail.core.html.HTMLElement.prototype.setAttribute.call(this,name,value);
	}
	,initEmbeddedAsset: function() {
	}
	,init: function() {
		this.initEmbeddedAsset();
		cocktail.core.html.HTMLElement.prototype.init.call(this);
	}
	,embeddedAsset: null
	,intrinsicRatio: null
	,intrinsicWidth: null
	,intrinsicHeight: null
	,width: null
	,height: null
	,__class__: cocktail.core.html.EmbeddedElement
	,__properties__: $extend(cocktail.core.html.HTMLElement.prototype.__properties__,{set_height:"set_height",get_height:"get_height",set_width:"set_width",get_width:"get_width",get_intrinsicHeight:"get_intrinsicHeight",get_intrinsicWidth:"get_intrinsicWidth",get_intrinsicRatio:"get_intrinsicRatio"})
});
cocktail.core.html.HTMLAnchorElement = function() {
	cocktail.core.html.HTMLElement.call(this,"A");
};
$hxClasses["cocktail.core.html.HTMLAnchorElement"] = cocktail.core.html.HTMLAnchorElement;
cocktail.core.html.HTMLAnchorElement.__name__ = ["cocktail","core","html","HTMLAnchorElement"];
cocktail.core.html.HTMLAnchorElement.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.html.HTMLAnchorElement.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	get_target: function() {
		var target = cocktail.core.html.HTMLElement.prototype.getAttribute.call(this,"target");
		if(target == null) return "_self";
		return target;
	}
	,set_target: function(value) {
		this.setAttribute("target",value);
		return value;
	}
	,get_href: function() {
		return this.getAttribute("href");
	}
	,set_href: function(value) {
		this.setAttribute("href",value);
		return value;
	}
	,openDocument: function() {
		if(this.get_href() != null) cocktail.Lib.get_window().open(this.get_href(),this.get_target());
	}
	,isDefaultFocusable: function() {
		if(this.get_href() != null) return true; else return false;
	}
	,getAttribute: function(name) {
		if(name == "target") return this.get_target(); else return cocktail.core.html.HTMLElement.prototype.getAttribute.call(this,name);
	}
	,runPostClickActivationStep: function(event) {
		if(event.defaultPrevented == true) return;
		this.openDocument();
	}
	,hasActivationBehaviour: function() {
		return true;
	}
	,target: null
	,href: null
	,__class__: cocktail.core.html.HTMLAnchorElement
	,__properties__: $extend(cocktail.core.html.HTMLElement.prototype.__properties__,{set_href:"set_href",get_href:"get_href",set_target:"set_target",get_target:"get_target"})
});
cocktail.core.html.HTMLBodyElement = function() {
	cocktail.core.html.HTMLElement.call(this,"BODY");
};
$hxClasses["cocktail.core.html.HTMLBodyElement"] = cocktail.core.html.HTMLBodyElement;
cocktail.core.html.HTMLBodyElement.__name__ = ["cocktail","core","html","HTMLBodyElement"];
cocktail.core.html.HTMLBodyElement.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.html.HTMLBodyElement.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.BodyBoxRenderer(this);
	}
	,__class__: cocktail.core.html.HTMLBodyElement
});
cocktail.core.html.HTMLConstants = function() {
};
$hxClasses["cocktail.core.html.HTMLConstants"] = cocktail.core.html.HTMLConstants;
cocktail.core.html.HTMLConstants.__name__ = ["cocktail","core","html","HTMLConstants"];
cocktail.core.html.HTMLConstants.prototype = {
	__class__: cocktail.core.html.HTMLConstants
}
cocktail.core.html.HTMLDocument = function() {
	cocktail.core.dom.Document.call(this);
	this._focusManager = new cocktail.core.focus.FocusManager();
	this.documentElement = this.createElement("HTML");
	this.initBody(this.createElement("BODY"));
	this.documentElement.appendChild(this.body);
	this._shouldDispatchClickOnNextMouseUp = false;
	this._invalidationScheduled = false;
	this._documentNeedsLayout = true;
	this._documentNeedsRendering = true;
};
$hxClasses["cocktail.core.html.HTMLDocument"] = cocktail.core.html.HTMLDocument;
cocktail.core.html.HTMLDocument.__name__ = ["cocktail","core","html","HTMLDocument"];
cocktail.core.html.HTMLDocument.__super__ = cocktail.core.dom.Document;
cocktail.core.html.HTMLDocument.prototype = $extend(cocktail.core.dom.Document.prototype,{
	get_activeElement: function() {
		return this._focusManager.activeElement;
	}
	,set_activeElement: function(newActiveElement) {
		this._focusManager.setActiveElement(newActiveElement,this.body);
		return this.get_activeElement();
	}
	,getFirstVerticallyScrollableHTMLElement: function(htmlElement,scrollOffset) {
		while(htmlElement.isVerticallyScrollable(scrollOffset) == false) {
			htmlElement = htmlElement.parentNode;
			if(htmlElement == null) return null;
		}
		return htmlElement;
	}
	,getFirstElementRendererWhichCanDispatchMouseEvent: function(mouseEvent) {
		var screenX = mouseEvent.screenX;
		var screenY = mouseEvent.screenY;
		var elementRendererAtPoint = this.body.elementRenderer.layerRenderer.getTopMostElementRendererAtPoint({ x : screenX, y : screenY},0,0);
		if(elementRendererAtPoint == null) return this.body.elementRenderer;
		while(elementRendererAtPoint.node.get_nodeType() != 1 || elementRendererAtPoint.isAnonymousBlockBox() == true) {
			elementRendererAtPoint = elementRendererAtPoint.parentNode;
			if(elementRendererAtPoint == null) return null;
		}
		return elementRendererAtPoint;
	}
	,scheduleLayoutAndRender: function() {
		var onLayoutScheduleDelegate = $bind(this,this.onLayoutSchedule);
	}
	,startLayout: function(forceLayout) {
		this.documentElement.elementRenderer.layout(forceLayout);
		this.documentElement.elementRenderer.setGlobalOrigins(0,0,0,0);
	}
	,startPendingAnimation: function() {
		return this.documentElement.elementRenderer.startPendingAnimation();
	}
	,startRendering: function() {
	}
	,onLayoutSchedule: function() {
		this.layoutAndRender();
		this._invalidationScheduled = false;
	}
	,layoutAndRender: function() {
		if(this._documentNeedsLayout == true) {
			this.startLayout(false);
			this._documentNeedsLayout = false;
			var atLeastOneAnimationStarted = this.startPendingAnimation();
			if(atLeastOneAnimationStarted == true) this.startLayout(true);
		}
		if(this._documentNeedsRendering == true) {
			this.startRendering();
			this._documentNeedsRendering = false;
		}
	}
	,doInvalidate: function() {
		this._invalidationScheduled = true;
		this.scheduleLayoutAndRender();
	}
	,invalidate: function() {
		if(this._invalidationScheduled == false) this.doInvalidate();
	}
	,invalidateRendering: function() {
		this._documentNeedsRendering = true;
		this.invalidate();
	}
	,invalidateLayout: function() {
		this._documentNeedsLayout = true;
		this.invalidate();
	}
	,set_fullscreenElement: function(value) {
		if(value == null) {
			this.fullscreenElement = null;
			return value;
		}
		if(this.fullscreenElement != null) return this.fullscreenElement;
		this.fullscreenElement = value;
		if(this.onEnterFullscreen != null) this.onEnterFullscreen();
		var fullscreenEvent = new cocktail.core.event.Event();
		fullscreenEvent.initEvent("fullscreenchange",true,false);
		return value;
	}
	,get_fullscreenEnabled: function() {
		return cocktail.Lib.get_window().platform.nativeWindow.fullScreenEnabled();
	}
	,exitFullscreen: function() {
		if(this.fullscreenElement == null) return;
		this.set_fullscreenElement(null);
		if(this.onExitFullscreen != null) this.onExitFullscreen();
		var fullscreenEvent = new cocktail.core.event.Event();
		fullscreenEvent.initEvent("fullscreenchange",true,false);
	}
	,setMouseCursor: function(cursor) {
		if(this.onSetMouseCursor != null) this.onSetMouseCursor(cursor);
	}
	,dispatchClickEvent: function(mouseEvent) {
		var elementRendererAtPoint = this.getFirstElementRendererWhichCanDispatchMouseEvent(mouseEvent);
		var htmlElement = elementRendererAtPoint.node;
		var nearestActivatableElement = htmlElement.getNearestActivatableElement();
		if(nearestActivatableElement != null) nearestActivatableElement.runPreClickActivation();
		var clickEvent = new cocktail.core.event.MouseEvent();
		clickEvent.initMouseEvent("click",true,true,null,0.0,mouseEvent.screenX,mouseEvent.screenY,mouseEvent.clientX,mouseEvent.clientY,mouseEvent.ctrlKey,mouseEvent.altKey,mouseEvent.shiftKey,mouseEvent.metaKey,mouseEvent.button,null);
		htmlElement.dispatchEvent(clickEvent);
		if(nearestActivatableElement != null) {
			if(mouseEvent.defaultPrevented == true) nearestActivatableElement.runCanceledActivationStep(); else nearestActivatableElement.runPostClickActivationStep(mouseEvent);
		}
	}
	,onPlatformResizeEvent: function(event) {
		this.documentElement.invalidate(cocktail.core.renderer.InvalidationReason.windowResize);
	}
	,onPlatformKeyUpEvent: function(keyboardEvent) {
		this.get_activeElement().dispatchEvent(keyboardEvent);
	}
	,onPlatformKeyDownEvent: function(keyboardEvent) {
		this.get_activeElement().dispatchEvent(keyboardEvent);
		switch(Std.parseInt(keyboardEvent.keyChar)) {
		case 9:
			if(keyboardEvent.defaultPrevented == false) this.set_activeElement(this._focusManager.getNextFocusedElement(keyboardEvent.shiftKey == true,this.body,this.get_activeElement()));
			break;
		case 13:case 32:
			if(keyboardEvent.defaultPrevented == false) this.get_activeElement().click();
			break;
		}
	}
	,onPlatformMouseMoveEvent: function(mouseEvent) {
		var elementRendererAtPoint = this.getFirstElementRendererWhichCanDispatchMouseEvent(mouseEvent);
		if(this._hoveredElementRenderer != elementRendererAtPoint) {
			var mouseOutEvent = new cocktail.core.event.MouseEvent();
			mouseOutEvent.initMouseEvent("mouseout",true,true,null,0.0,mouseEvent.screenX,mouseEvent.screenY,mouseEvent.clientX,mouseEvent.clientY,mouseEvent.ctrlKey,mouseEvent.altKey,mouseEvent.shiftKey,mouseEvent.metaKey,mouseEvent.button,elementRendererAtPoint.node);
			this._hoveredElementRenderer.node.dispatchEvent(mouseOutEvent);
			var oldHoveredElementRenderer = this._hoveredElementRenderer;
			this._hoveredElementRenderer = elementRendererAtPoint;
			var mouseOverEvent = new cocktail.core.event.MouseEvent();
			mouseOverEvent.initMouseEvent("mouseover",true,true,null,0.0,mouseEvent.screenX,mouseEvent.screenY,mouseEvent.clientX,mouseEvent.clientY,mouseEvent.ctrlKey,mouseEvent.shiftKey,mouseEvent.altKey,mouseEvent.metaKey,mouseEvent.button,oldHoveredElementRenderer.node);
			elementRendererAtPoint.node.dispatchEvent(mouseOverEvent);
			this._shouldDispatchClickOnNextMouseUp = false;
			this.setMouseCursor(elementRendererAtPoint.node.coreStyle.computedStyle.cursor);
		}
		elementRendererAtPoint.node.dispatchEvent(mouseEvent);
	}
	,onPlatformMouseWheelEvent: function(wheelEvent) {
		var elementRendererAtPoint = this.getFirstElementRendererWhichCanDispatchMouseEvent(wheelEvent);
		elementRendererAtPoint.node.dispatchEvent(wheelEvent);
		if(wheelEvent.defaultPrevented == false) {
			var htmlElement = elementRendererAtPoint.node;
			var scrollOffset = Math.round(wheelEvent.deltaY * 10);
			var scrollableHTMLElement = this.getFirstVerticallyScrollableHTMLElement(htmlElement,scrollOffset);
			if(scrollableHTMLElement != null) {
				var _g = scrollableHTMLElement;
				_g.set_scrollTop(_g.get_scrollTop() - scrollOffset);
			}
		}
	}
	,onPlatformMouseEvent: function(mouseEvent) {
		var eventType = mouseEvent.type;
		var elementRendererAtPoint = this.getFirstElementRendererWhichCanDispatchMouseEvent(mouseEvent);
		elementRendererAtPoint.node.dispatchEvent(mouseEvent);
		switch(eventType) {
		case "mousedown":
			this._shouldDispatchClickOnNextMouseUp = true;
			break;
		case "mouseup":
			if(this._shouldDispatchClickOnNextMouseUp == true) this.dispatchClickEvent(mouseEvent);
			break;
		}
	}
	,createElement: function(tagName) {
		var element;
		tagName = tagName.toUpperCase();
		switch(tagName) {
		case "IMG":
			element = new cocktail.core.html.HTMLImageElement();
			break;
		case "INPUT":
			element = new cocktail.core.html.HTMLInputElement();
			break;
		case "A":
			element = new cocktail.core.html.HTMLAnchorElement();
			break;
		case "HTML":
			element = new cocktail.core.html.HTMLHtmlElement();
			break;
		case "BODY":
			element = new cocktail.core.html.HTMLBodyElement();
			break;
		case "VIDEO":
			element = new cocktail.core.html.HTMLVideoElement();
			break;
		case "SOURCE":
			element = new cocktail.core.html.HTMLSourceElement();
			break;
		case "OBJECT":
			element = new cocktail.core.html.HTMLObjectElement();
			break;
		case "PARAM":
			element = new cocktail.core.html.HTMLParamElement();
			break;
		default:
			element = new cocktail.core.html.HTMLElement(tagName);
		}
		element.ownerDocument = this;
		return element;
	}
	,initBody: function(htmlBodyElement) {
		this.body = htmlBodyElement;
		this.documentElement.appendChild(this.body);
		this._hoveredElementRenderer = this.body.elementRenderer;
		this.set_activeElement(this.body);
	}
	,_documentNeedsRendering: null
	,_documentNeedsLayout: null
	,_invalidationScheduled: null
	,_shouldDispatchClickOnNextMouseUp: null
	,onSetMouseCursor: null
	,onExitFullscreen: null
	,onEnterFullscreen: null
	,fullscreenElement: null
	,fullscreenEnabled: null
	,_hoveredElementRenderer: null
	,_focusManager: null
	,activeElement: null
	,body: null
	,__class__: cocktail.core.html.HTMLDocument
	,__properties__: $extend(cocktail.core.dom.Document.prototype.__properties__,{set_activeElement:"set_activeElement",get_activeElement:"get_activeElement",get_fullscreenEnabled:"get_fullscreenEnabled",set_fullscreenElement:"set_fullscreenElement"})
});
cocktail.core.html.HTMLHtmlElement = function() {
	cocktail.core.html.HTMLElement.call(this,"HTML");
	this.attach();
};
$hxClasses["cocktail.core.html.HTMLHtmlElement"] = cocktail.core.html.HTMLHtmlElement;
cocktail.core.html.HTMLHtmlElement.__name__ = ["cocktail","core","html","HTMLHtmlElement"];
cocktail.core.html.HTMLHtmlElement.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.html.HTMLHtmlElement.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	set_innerHTML: function(value) {
		cocktail.core.html.HTMLElement.prototype.set_innerHTML.call(this,value);
		var htmlDocument = this.ownerDocument;
		htmlDocument.initBody(this.getElementsByTagName("BODY")[0]);
		return value;
	}
	,get_offsetParent: function() {
		return null;
	}
	,detachFromParentElementRenderer: function() {
	}
	,attachToParentElementRenderer: function() {
	}
	,createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.InitialBlockRenderer(this);
	}
	,isParentRendered: function() {
		return true;
	}
	,__class__: cocktail.core.html.HTMLHtmlElement
});
cocktail.core.html.HTMLImageElement = function() {
	cocktail.core.html.EmbeddedElement.call(this,"IMG");
};
$hxClasses["cocktail.core.html.HTMLImageElement"] = cocktail.core.html.HTMLImageElement;
cocktail.core.html.HTMLImageElement.__name__ = ["cocktail","core","html","HTMLImageElement"];
cocktail.core.html.HTMLImageElement.__super__ = cocktail.core.html.EmbeddedElement;
cocktail.core.html.HTMLImageElement.prototype = $extend(cocktail.core.html.EmbeddedElement.prototype,{
	get_naturalWidth: function() {
		if(this.get_intrinsicWidth() == null) return 0;
		return this.get_intrinsicWidth();
	}
	,get_naturalHeight: function() {
		if(this.get_intrinsicHeight() == null) return 0;
		return this.get_intrinsicHeight();
	}
	,get_src: function() {
		return this.getAttribute("src");
	}
	,onLoadError: function() {
		var errorEvent = new cocktail.core.event.UIEvent();
		errorEvent.initUIEvent("error",false,false,null,0.0);
		this.dispatchEvent(errorEvent);
	}
	,onLoadComplete: function(resource) {
		this.intrinsicHeight = resource.intrinsicHeight;
		this.intrinsicWidth = resource.intrinsicWidth;
		this.intrinsicRatio = this.get_intrinsicHeight() / this.get_intrinsicWidth();
		this.invalidate(cocktail.core.renderer.InvalidationReason.other);
		var loadEvent = new cocktail.core.event.UIEvent();
		loadEvent.initUIEvent("load",false,false,null,0.0);
		this.dispatchEvent(loadEvent);
	}
	,removeListeners: function(resource) {
		resource.removeEventListener("load",this._resourceLoadedCallback);
		resource.removeEventListener("error",this._resourceLoadError);
	}
	,onResourceLoadError: function(e) {
		this.removeListeners(e.target);
		this.onLoadError();
	}
	,onResourceLoaded: function(e) {
		this.removeListeners(e.target);
		this.onLoadComplete(e.target);
	}
	,set_src: function(value) {
		cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,"src",value);
		var resource = cocktail.core.resource.ResourceManager.getResource(value);
		if(resource.loaded == false) {
			this._resourceLoadedCallback = $bind(this,this.onResourceLoaded);
			this._resourceLoadError = $bind(this,this.onResourceLoadError);
			resource.addEventListener("load",this._resourceLoadedCallback);
			resource.addEventListener("error",this._resourceLoadError);
		} else if(resource.loadedWithError == true) this.onLoadError(); else this.onLoadComplete(resource);
		return value;
	}
	,isVoidElement: function() {
		return true;
	}
	,createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.ImageRenderer(this);
	}
	,setAttribute: function(name,value) {
		if(name == "src") this.set_src(value); else cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,name,value);
	}
	,_resourceLoadError: null
	,_resourceLoadedCallback: null
	,naturalHeight: null
	,naturalWidth: null
	,src: null
	,__class__: cocktail.core.html.HTMLImageElement
	,__properties__: $extend(cocktail.core.html.EmbeddedElement.prototype.__properties__,{set_src:"set_src",get_src:"get_src",get_naturalWidth:"get_naturalWidth",get_naturalHeight:"get_naturalHeight"})
});
cocktail.core.html.HTMLInputElement = function() {
	cocktail.core.html.EmbeddedElement.call(this,"INPUT");
};
$hxClasses["cocktail.core.html.HTMLInputElement"] = cocktail.core.html.HTMLInputElement;
cocktail.core.html.HTMLInputElement.__name__ = ["cocktail","core","html","HTMLInputElement"];
cocktail.core.html.HTMLInputElement.__super__ = cocktail.core.html.EmbeddedElement;
cocktail.core.html.HTMLInputElement.prototype = $extend(cocktail.core.html.EmbeddedElement.prototype,{
	get_value: function() {
		if(this.elementRenderer != null) {
			var textInputElementRenderer = this.elementRenderer;
			return textInputElementRenderer.get_value();
		}
		return this.getAttribute("value");
	}
	,set_value: function(value) {
		this.setAttribute("value",value);
		if(this.elementRenderer != null) {
			var textInputElementRenderer = this.elementRenderer;
			textInputElementRenderer.set_value(value);
		}
		return value;
	}
	,get_intrinsicRatio: function() {
		return 0.15;
	}
	,get_intrinsicWidth: function() {
		return 150;
	}
	,isDefaultFocusable: function() {
		return true;
	}
	,createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.TextInputRenderer(this);
		var textInputElementRenderer = this.elementRenderer;
		var value = this.getAttribute("value");
		if(value != null) textInputElementRenderer.set_value(value);
	}
	,isVoidElement: function() {
		return true;
	}
	,value: null
	,__class__: cocktail.core.html.HTMLInputElement
	,__properties__: $extend(cocktail.core.html.EmbeddedElement.prototype.__properties__,{set_value:"set_value",get_value:"get_value"})
});
cocktail.core.html.HTMLMediaElement = function(tagName) {
	cocktail.core.html.EmbeddedElement.call(this,tagName);
	this.networkState = 0;
	this.ended = false;
	this.duration = 0;
	this.paused = true;
	this.seeking = false;
	this.readyState = 0;
	this._autoplaying = true;
	this.set_muted(false);
	this.set_volume(1.0);
	this._loadedDataWasDispatched = false;
	this._defaultPlaybackStartPosition = 0;
	this._officialPlaybackPosition = 0;
	this._currentPlaybackPosition = 0;
	this._initialPlaybackPosition = 0;
	this._earliestPossiblePosition = 0;
};
$hxClasses["cocktail.core.html.HTMLMediaElement"] = cocktail.core.html.HTMLMediaElement;
cocktail.core.html.HTMLMediaElement.__name__ = ["cocktail","core","html","HTMLMediaElement"];
cocktail.core.html.HTMLMediaElement.__super__ = cocktail.core.html.EmbeddedElement;
cocktail.core.html.HTMLMediaElement.prototype = $extend(cocktail.core.html.EmbeddedElement.prototype,{
	set_currentTime: function(value) {
		switch(this.readyState) {
		case 0:
			this._defaultPlaybackStartPosition = value;
			break;
		default:
			this._officialPlaybackPosition = value;
			this.seek(value);
		}
		return value;
	}
	,get_currentTime: function() {
		if(this._defaultPlaybackStartPosition != 0) return this._defaultPlaybackStartPosition;
		return this._officialPlaybackPosition;
	}
	,get_buffered: function() {
		var ranges = new Array();
		ranges.push({ start : 0.0, end : this.duration * (this._nativeMedia.get_bytesLoaded() / this._nativeMedia.get_bytesTotal())});
		var timeRanges = new cocktail.core.html.TimeRanges(ranges);
		return timeRanges;
	}
	,set_volume: function(value) {
		if(this.muted == false) this._nativeMedia.set_volume(value);
		this.volume = value;
		this.fireEvent("volumechange",false,false);
		return value;
	}
	,set_muted: function(value) {
		if(value == false) this._nativeMedia.set_volume(this.volume); else this._nativeMedia.set_volume(0);
		this.muted = value;
		this.fireEvent("volumechange",false,false);
		return value;
	}
	,set_loop: function(value) {
		cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,"loop",Std.string(value));
		return value;
	}
	,get_loop: function() {
		if(this.getAttribute("loop") != null) return true; else return false;
	}
	,set_autoplay: function(value) {
		cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,"autoplay",Std.string(value));
		return value;
	}
	,get_autoplay: function() {
		if(this.getAttribute("autoplay") != null) return true; else return false;
	}
	,set_src: function(value) {
		cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,"src",value);
		this.loadResource();
		return value;
	}
	,get_src: function() {
		return this.getAttribute("src");
	}
	,onProgressTick: function() {
		this.fireEvent("progress",false,false);
		if(this._nativeMedia.get_bytesLoaded() >= this._nativeMedia.get_bytesTotal()) {
			this.setReadyState(4);
			this.networkState = 1;
			this.fireEvent("suspend",false,false);
			return;
		}
		if(this.readyState == 1) this.setReadyState(3);
	}
	,onTimeUpdateTick: function() {
		if(this.paused == true) return;
		this._currentPlaybackPosition = this._nativeMedia.get_currentTime();
		this._officialPlaybackPosition = this._currentPlaybackPosition;
		if(this.duration - this._currentPlaybackPosition < 0.2) {
			if(this.get_loop() == true) {
				this.seek(0);
				return;
			}
			this.ended = true;
			this._currentPlaybackPosition = this.duration;
			this._officialPlaybackPosition = this._currentPlaybackPosition;
			this.fireEvent("timeupdate",false,false);
			if(this.paused == false) {
				this.paused = true;
				this.fireEvent("pause",false,false);
			}
			this.fireEvent("ended",false,false);
			return;
		}
		this.fireEvent("timeupdate",false,false);
	}
	,onLoadedMetaData: function(e) {
		this.intrinsicHeight = this._nativeMedia.get_height();
		this.intrinsicWidth = this._nativeMedia.get_width();
		this.intrinsicRatio = this.get_intrinsicHeight() / this.get_intrinsicWidth();
		this.establishMediaTimeline();
		this.invalidate(cocktail.core.renderer.InvalidationReason.other);
		this.onProgressTick();
	}
	,onLoadingError: function(error) {
		this.selectResource();
	}
	,hasChildSourceElement: function() {
		var _g1 = 0, _g = this.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.childNodes[i].get_nodeName() == "SOURCE") return true;
		}
		return false;
	}
	,establishMediaTimeline: function() {
		this._currentPlaybackPosition = 0;
		this._initialPlaybackPosition = 0;
		this._officialPlaybackPosition = 0;
		this.duration = this._nativeMedia.get_duration();
		this.fireEvent("durationchange",false,false);
		this.setReadyState(1);
		var jumped = false;
		if(this._defaultPlaybackStartPosition > 0) {
			this.seek(this._defaultPlaybackStartPosition);
			jumped = true;
		}
		this._defaultPlaybackStartPosition = 0;
	}
	,isPotentiallyPlaying: function() {
		if(this.paused == true) return false;
		if(this.ended == true) return false;
		return true;
	}
	,setReadyState: function(newReadyState) {
		if(this.readyState == 0 && newReadyState == 1) this.fireEvent("loadedmetadata",false,false);
		if(this.readyState == 1 && (newReadyState == 2 || newReadyState == 4 || newReadyState == 3)) {
			if(this._loadedDataWasDispatched == false) {
				this.fireEvent("loadeddata",false,false);
				this._loadedDataWasDispatched = true;
			}
			if(newReadyState == 4 || newReadyState == 3) {
				if(this.readyState >= 3 && newReadyState <= 2) {
					if(this.isPotentiallyPlaying() == true) {
						this.fireEvent("timeupdate",false,false);
						this.fireEvent("waiting",false,false);
					}
				}
				if(this.readyState <= 2 && newReadyState == 3) {
					this.fireEvent("canplay",false,false);
					if(this.paused == false) this.fireEvent("playing",false,false);
				}
				if(newReadyState == 4) {
					if(this.readyState == 2) {
						this.fireEvent("canplay",false,false);
						if(this.paused == false) this.fireEvent("playing",false,false);
					}
					if(this._autoplaying == true) {
						if(this.paused == true) {
							if(this.get_autoplay() == true) {
								this.paused = false;
								this.fireEvent("play",false,false);
								this.play();
								this.fireEvent("playing",false,false);
							}
						}
					}
					this.fireEvent("canplaythrough",false,false);
				}
			}
		}
		this.readyState = newReadyState;
	}
	,seek: function(newPlaybackPosition) {
		if(this.readyState == 0) return;
		if(this.seeking == true) {
		}
		this.seeking = true;
		if(newPlaybackPosition > this.duration) newPlaybackPosition = this.duration;
		if(newPlaybackPosition < this._earliestPossiblePosition) newPlaybackPosition = 0;
		this.fireEvent("seeking",false,false);
		this._currentPlaybackPosition = newPlaybackPosition;
		this._nativeMedia.seek(newPlaybackPosition);
		this.fireEvent("timeupdate",false,false);
		this.fireEvent("seeked",false,false);
	}
	,fetchResource: function(url) {
		this._nativeMedia.onLoadedMetaData = $bind(this,this.onLoadedMetaData);
		this._nativeMedia.set_src(url);
	}
	,selectResource: function() {
		this.networkState = 3;
		var mode;
		var candidate;
		if(this.get_src() != null) mode = 0; else if(this.hasChildSourceElement() == true) {
			mode = 1;
			var _g1 = 0, _g = this.childNodes.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.childNodes[i].get_nodeName() == "SOURCE") {
					candidate = this.childNodes[i];
					break;
				}
			}
		} else {
			this.networkState = 0;
			return;
		}
		this.networkState = 2;
		this.fireEvent("loadstart",false,false);
		if(mode == 0) {
			if(this.get_src() == "") {
				this.networkState = 3;
				this.fireEvent("error",false,false);
				return;
			}
			this.currentSrc = this.get_src();
			this.fetchResource(this.currentSrc);
		} else if(mode == 1) {
			var _g1 = 0, _g = this.childNodes.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.childNodes[i].get_nodeName() == "SOURCE") {
					var sourceChild = this.childNodes[i];
					if(sourceChild.get_type() != null) {
						if(this.canPlayType(sourceChild.get_type()) == "probably") {
							this.currentSrc = sourceChild.get_src();
							this.fetchResource(this.currentSrc);
							return;
						}
					} else if(sourceChild.get_src() != null) {
						if(this.canPlayType(sourceChild.get_src()) == "probably") {
							this.currentSrc = sourceChild.get_src();
							this.fetchResource(this.currentSrc);
							return;
						}
					}
				}
			}
			this.networkState = 0;
		}
	}
	,loadResource: function() {
		switch(this.networkState) {
		case 2:case 1:
			this.fireEvent("abort",false,false);
			break;
		}
		if(this.networkState != 0) {
			this.fireEvent("emptied",false,false);
			this._nativeMedia.set_src(null);
			this.networkState = 0;
			this.readyState = 0;
			this.paused = true;
			this.seeking = false;
			this._currentPlaybackPosition = 0;
			if(this._officialPlaybackPosition > 0) {
				this._officialPlaybackPosition = 0;
				this.fireEvent("timeupdate",false,false);
			} else this._officialPlaybackPosition = 0;
			this._initialPlaybackPosition = 0;
			this.duration = Math.NaN;
		}
		this._loadedDataWasDispatched = false;
		this.selectResource();
	}
	,canPlayType: function(type) {
		return this._nativeMedia.canPlayType(type);
	}
	,pause: function() {
		if(this.networkState == 0) this.selectResource();
		this._autoplaying = false;
		if(this.paused == false) {
			this.paused = true;
			this.fireEvent("timeupdate",false,false);
			this.fireEvent("pause",false,false);
			this._officialPlaybackPosition = this._currentPlaybackPosition;
		}
		this._nativeMedia.pause();
	}
	,play: function() {
		if(this.networkState == 0) this.selectResource();
		if(this.ended == true) {
			this.ended = false;
			this.seek(0);
		}
		if(this.paused == true) {
			this.paused = false;
			this.fireEvent("play",false,false);
			switch(this.readyState) {
			case 0:case 1:case 2:
				this.fireEvent("waiting",false,false);
				break;
			case 3:case 4:
				this.fireEvent("playing",false,false);
				break;
			}
		}
		this._autoplaying = false;
		this._nativeMedia.play();
		this.onTimeUpdateTick();
	}
	,setAttribute: function(name,value) {
		if(name == "src") this.set_src(value); else cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,name,value);
	}
	,appendChild: function(newChild) {
		cocktail.core.html.EmbeddedElement.prototype.appendChild.call(this,newChild);
		if(this.get_src() == null && this.networkState == 0) {
			if(newChild.get_nodeName() == "SOURCE") this.selectResource();
		}
		return newChild;
	}
	,initNativeMedia: function() {
	}
	,init: function() {
		this.initNativeMedia();
		cocktail.core.html.EmbeddedElement.prototype.init.call(this);
	}
	,_autoplaying: null
	,_loadedDataWasDispatched: null
	,_earliestPossiblePosition: null
	,_defaultPlaybackStartPosition: null
	,_currentPlaybackPosition: null
	,_officialPlaybackPosition: null
	,_initialPlaybackPosition: null
	,_nativeMedia: null
	,volume: null
	,muted: null
	,ended: null
	,paused: null
	,buffered: null
	,duration: null
	,currentSrc: null
	,currentTime: null
	,seeking: null
	,readyState: null
	,networkState: null
	,loop: null
	,autoplay: null
	,src: null
	,__class__: cocktail.core.html.HTMLMediaElement
	,__properties__: $extend(cocktail.core.html.EmbeddedElement.prototype.__properties__,{set_src:"set_src",get_src:"get_src",set_autoplay:"set_autoplay",get_autoplay:"get_autoplay",set_loop:"set_loop",get_loop:"get_loop",set_currentTime:"set_currentTime",get_currentTime:"get_currentTime",get_buffered:"get_buffered",set_muted:"set_muted",set_volume:"set_volume"})
});
cocktail.core.html.HTMLObjectElement = function() {
	this._imageLoader = new cocktail.core.resource.ImageLoader();
	cocktail.core.html.EmbeddedElement.call(this,"OBJECT");
	this.intrinsicHeight = 150;
	this.intrinsicWidth = 300;
	this.intrinsicRatio = this.get_intrinsicWidth() / this.get_intrinsicHeight();
};
$hxClasses["cocktail.core.html.HTMLObjectElement"] = cocktail.core.html.HTMLObjectElement;
cocktail.core.html.HTMLObjectElement.__name__ = ["cocktail","core","html","HTMLObjectElement"];
cocktail.core.html.HTMLObjectElement.__super__ = cocktail.core.html.EmbeddedElement;
cocktail.core.html.HTMLObjectElement.prototype = $extend(cocktail.core.html.EmbeddedElement.prototype,{
	get_data: function() {
		return this.getAttribute("data");
	}
	,set_data: function(value) {
		cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,"data",value);
		this._imageLoader.load([value],$bind(this,this.onLoadComplete),$bind(this,this.onLoadError));
		return value;
	}
	,onLoadError: function(message) {
		var errorEvent = new cocktail.core.event.UIEvent();
		errorEvent.initUIEvent("error",false,false,null,0.0);
		this.dispatchEvent(errorEvent);
	}
	,onLoadComplete: function(image) {
		this.invalidate(cocktail.core.renderer.InvalidationReason.other);
		var loadEvent = new cocktail.core.event.UIEvent();
		loadEvent.initUIEvent("load",false,false,null,0.0);
		this.dispatchEvent(loadEvent);
	}
	,createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.ObjectRenderer(this);
	}
	,setAttribute: function(name,value) {
		if(name == "data") this.set_data(value); else cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,name,value);
	}
	,initEmbeddedAsset: function() {
		this.embeddedAsset = this._imageLoader.getNativeElement();
	}
	,_imageLoader: null
	,data: null
	,__class__: cocktail.core.html.HTMLObjectElement
	,__properties__: $extend(cocktail.core.html.EmbeddedElement.prototype.__properties__,{set_data:"set_data",get_data:"get_data"})
});
cocktail.core.html.HTMLParamElement = function() {
	cocktail.core.html.HTMLElement.call(this,"PARAM");
};
$hxClasses["cocktail.core.html.HTMLParamElement"] = cocktail.core.html.HTMLParamElement;
cocktail.core.html.HTMLParamElement.__name__ = ["cocktail","core","html","HTMLParamElement"];
cocktail.core.html.HTMLParamElement.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.html.HTMLParamElement.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	set_value: function(value) {
		this.setAttribute("value",value);
		return value;
	}
	,get_value: function() {
		return this.getAttribute("value");
	}
	,set_name: function(value) {
		this.setAttribute("name",value);
		return value;
	}
	,get_name: function() {
		return this.getAttribute("name");
	}
	,isVoidElement: function() {
		return true;
	}
	,createElementRenderer: function() {
	}
	,value: null
	,name: null
	,__class__: cocktail.core.html.HTMLParamElement
	,__properties__: $extend(cocktail.core.html.HTMLElement.prototype.__properties__,{set_name:"set_name",get_name:"get_name",set_value:"set_value",get_value:"get_value"})
});
cocktail.core.html.HTMLSourceElement = function() {
	cocktail.core.html.HTMLElement.call(this,"SOURCE");
};
$hxClasses["cocktail.core.html.HTMLSourceElement"] = cocktail.core.html.HTMLSourceElement;
cocktail.core.html.HTMLSourceElement.__name__ = ["cocktail","core","html","HTMLSourceElement"];
cocktail.core.html.HTMLSourceElement.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.html.HTMLSourceElement.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	set_media: function(value) {
		this.setAttribute("media",value);
		return value;
	}
	,get_media: function() {
		return this.getAttribute("media");
	}
	,set_type: function(value) {
		this.setAttribute("type",value);
		return value;
	}
	,get_type: function() {
		return this.getAttribute("type");
	}
	,set_src: function(value) {
		this.setAttribute("src",value);
		return value;
	}
	,get_src: function() {
		return this.getAttribute("src");
	}
	,isVoidElement: function() {
		return true;
	}
	,createElementRenderer: function() {
	}
	,media: null
	,type: null
	,src: null
	,__class__: cocktail.core.html.HTMLSourceElement
	,__properties__: $extend(cocktail.core.html.HTMLElement.prototype.__properties__,{set_src:"set_src",get_src:"get_src",set_type:"set_type",get_type:"get_type",set_media:"set_media",get_media:"get_media"})
});
cocktail.core.html.HTMLVideoElement = function() {
	cocktail.core.html.HTMLMediaElement.call(this,"VIDEO");
	this.initPosterFrame();
};
$hxClasses["cocktail.core.html.HTMLVideoElement"] = cocktail.core.html.HTMLVideoElement;
cocktail.core.html.HTMLVideoElement.__name__ = ["cocktail","core","html","HTMLVideoElement"];
cocktail.core.html.HTMLVideoElement.__super__ = cocktail.core.html.HTMLMediaElement;
cocktail.core.html.HTMLVideoElement.prototype = $extend(cocktail.core.html.HTMLMediaElement.prototype,{
	get_videoHeight: function() {
		if(this._nativeMedia.get_height() != null) return Math.round(this._nativeMedia.get_height()); else return 150;
	}
	,get_videoWidth: function() {
		if(this._nativeMedia.get_width() != null) return Math.round(this._nativeMedia.get_width()); else return 300;
	}
	,get_poster: function() {
		return this.getAttribute("poster");
	}
	,set_poster: function(value) {
		cocktail.core.html.HTMLMediaElement.prototype.setAttribute.call(this,"poster",value);
		this._onPosterLoadComplete = $bind(this,this.onPosterLoadComplete);
		this._onPosterLoadError = $bind(this,this.onPosterLoadError);
		this._posterImage.addEventListener("load",this._onPosterLoadComplete);
		this._posterImage.addEventListener("error",this._onPosterLoadError);
		this._posterImage.set_src(value);
		return value;
	}
	,removeListeners: function() {
		this._posterImage.removeEventListener("load",this._onPosterLoadComplete);
		this._posterImage.removeEventListener("error",this._onPosterLoadError);
	}
	,onPosterLoadError: function(e) {
		this.removeListeners();
	}
	,onPosterLoadComplete: function(e) {
		this.removeListeners();
		this.invalidate(cocktail.core.renderer.InvalidationReason.other);
	}
	,shouldRenderPosterFrame: function() {
		if(this.get_poster() == null) return false;
		switch(this.readyState) {
		case 0:case 1:
			return true;
		}
		if(this.paused == true && this._currentPlaybackPosition == 0.0) return true;
		return false;
	}
	,createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.VideoRenderer(this);
	}
	,setAttribute: function(name,value) {
		if(name == "poster") this.set_poster(value); else cocktail.core.html.HTMLMediaElement.prototype.setAttribute.call(this,name,value);
	}
	,initPosterFrame: function() {
		this._posterImage = new cocktail.core.html.HTMLImageElement();
	}
	,initEmbeddedAsset: function() {
		this.embeddedAsset = this._nativeMedia.get_nativeElement();
	}
	,initNativeMedia: function() {
		this._nativeMedia = new cocktail.port.server.NativeVideo();
	}
	,videoHeight: null
	,videoWidth: null
	,_onPosterLoadError: null
	,_onPosterLoadComplete: null
	,posterFrameEmbeddedAsset: null
	,_posterImage: null
	,poster: null
	,__class__: cocktail.core.html.HTMLVideoElement
	,__properties__: $extend(cocktail.core.html.HTMLMediaElement.prototype.__properties__,{set_poster:"set_poster",get_poster:"get_poster",get_videoWidth:"get_videoWidth",get_videoHeight:"get_videoHeight"})
});
cocktail.core.html.ScrollBar = function(isVertical) {
	this._isVertical = isVertical;
	cocktail.core.html.HTMLElement.call(this,"DIV");
	this._scrollThumb = cocktail.Lib.get_document().createElement("DIV");
	this._upArrow = cocktail.Lib.get_document().createElement("DIV");
	this._downArrow = cocktail.Lib.get_document().createElement("DIV");
	this._scroll = 0;
	this._maxScroll = 0;
	this._mouseMoveStart = 0;
	this.initScrollBar();
	if(this._isVertical) this.initVerticalScrollBar(); else this.initHorizontalScrollBar();
	this.appendChild(this._scrollThumb);
	this.appendChild(this._upArrow);
	this.appendChild(this._downArrow);
	this.addEventListener("mousedown",$bind(this,this.onTrackMouseDown));
	this._scrollThumb.addEventListener("mousedown",$bind(this,this.onThumbMouseDown));
	this._downArrow.addEventListener("mousedown",$bind(this,this.onDownArrowMouseDown));
	this._upArrow.addEventListener("mousedown",$bind(this,this.onUpArrowMouseDown));
};
$hxClasses["cocktail.core.html.ScrollBar"] = cocktail.core.html.ScrollBar;
cocktail.core.html.ScrollBar.__name__ = ["cocktail","core","html","ScrollBar"];
cocktail.core.html.ScrollBar.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.html.ScrollBar.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	set_scroll: function(value) {
		this._scroll = value;
		this.updateScroll();
		return value;
	}
	,get_scroll: function() {
		return this._scroll;
	}
	,set_maxScroll: function(value) {
		var scrollPercent = this._scroll / this._maxScroll;
		if(this._maxScroll == 0) scrollPercent = 0;
		this._maxScroll = value;
		this.set_scroll(this._maxScroll * scrollPercent);
		this.updateThumbSize();
		return value;
	}
	,get_maxScroll: function() {
		return this._maxScroll;
	}
	,dispatchScrollEvent: function() {
		var scrollEvent = new cocktail.core.event.UIEvent();
		scrollEvent.initUIEvent("scroll",false,false,null,0.0);
		this.dispatchEvent(scrollEvent);
	}
	,updateThumbSize: function() {
		if(this._isVertical == true) {
			var thumbHeight = this.coreStyle.computedStyle.getHeight() - this._downArrow.coreStyle.computedStyle.getHeight() - this._upArrow.coreStyle.computedStyle.getHeight() - this.get_maxScroll();
			if(thumbHeight < 16) thumbHeight = 16;
			if(thumbHeight != this._scrollThumb.coreStyle.computedStyle.getHeight()) this._scrollThumb.style.set_height(thumbHeight + "px");
		} else {
			var thumbWidth = this.coreStyle.computedStyle.getWidth() - this._downArrow.coreStyle.computedStyle.getWidth() - this._upArrow.coreStyle.computedStyle.getWidth() - this.get_maxScroll();
			if(thumbWidth < 16) thumbWidth = 16;
			if(thumbWidth != this._scrollThumb.coreStyle.computedStyle.getWidth()) this._scrollThumb.style.set_width(thumbWidth + "px");
		}
	}
	,updateScroll: function() {
		if(this._scroll > this._maxScroll) this._scroll = this.get_maxScroll(); else if(this._scroll < 0) this._scroll = 0;
		var progress = this.get_scroll() / this.get_maxScroll();
		if(this._isVertical == true) {
			var thumbY = Math.round(progress * (this.coreStyle.computedStyle.getHeight() - this._upArrow.coreStyle.computedStyle.getHeight() - this._downArrow.coreStyle.computedStyle.getHeight() - this._scrollThumb.coreStyle.computedStyle.getHeight()) + this._upArrow.coreStyle.computedStyle.getHeight());
			this._scrollThumb.style.set_top(thumbY + "px");
		} else {
			var thumbX = Math.round(progress * (this.coreStyle.computedStyle.getWidth() - this._upArrow.coreStyle.computedStyle.getWidth() - this._downArrow.coreStyle.computedStyle.getWidth() - this._scrollThumb.coreStyle.computedStyle.getWidth()) + this._upArrow.coreStyle.computedStyle.getWidth());
			this._scrollThumb.style.set_left(thumbX + "px");
		}
		this.dispatchScrollEvent();
	}
	,onTrackMouseDown: function(event) {
		if(this._isVertical == true) {
			if(event.screenY > this._scrollThumb.elementRenderer.get_globalBounds().y) {
				var _g = this;
				_g.set_scroll(_g.get_scroll() + 50);
			} else {
				var _g = this;
				_g.set_scroll(_g.get_scroll() - 50);
			}
		} else if(event.screenX > this._scrollThumb.elementRenderer.get_globalBounds().x) {
			var _g = this;
			_g.set_scroll(_g.get_scroll() + 50);
		} else {
			var _g = this;
			_g.set_scroll(_g.get_scroll() - 50);
		}
	}
	,onThumbMove: function(event) {
		if(this._isVertical == true) {
			var thumbDelta = event.screenY - this._mouseMoveStart;
			var _g = this;
			_g.set_scroll(_g.get_scroll() + thumbDelta);
			this._mouseMoveStart = event.screenY;
		} else {
			var thumbDelta = event.screenX - this._mouseMoveStart;
			var _g = this;
			_g.set_scroll(_g.get_scroll() + thumbDelta);
			this._mouseMoveStart = event.screenX;
		}
	}
	,onThumbMouseUp: function(event) {
		cocktail.Lib.get_document().removeEventListener("mousemove",this._thumbMoveDelegate);
		cocktail.Lib.get_document().removeEventListener("mouseup",this._thumbUpDelegate);
	}
	,onThumbMouseDown: function(event) {
		if(this._isVertical == true) this._mouseMoveStart = event.screenY; else this._mouseMoveStart = event.screenX;
		event.stopPropagation();
		this._thumbMoveDelegate = $bind(this,this.onThumbMove);
		this._thumbUpDelegate = $bind(this,this.onThumbMouseUp);
		cocktail.Lib.get_document().addEventListener("mousemove",this._thumbMoveDelegate);
		cocktail.Lib.get_document().addEventListener("mouseup",this._thumbUpDelegate);
	}
	,onUpArrowMouseDown: function(event) {
		var _g = this;
		_g.set_scroll(_g.get_scroll() - 10);
		event.stopPropagation();
	}
	,onDownArrowMouseDown: function(event) {
		var _g = this;
		_g.set_scroll(_g.get_scroll() + 10);
		event.stopPropagation();
	}
	,executeDefaultActionIfNeeded: function(defaultPrevented,event) {
	}
	,detachFromParentElementRenderer: function() {
	}
	,attachToParentElementRenderer: function() {
	}
	,isParentRendered: function() {
		return true;
	}
	,createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.ScrollBarRenderer(this);
	}
	,initHorizontalScrollBar: function() {
		this.style.set_width("100%");
		this.style.set_height(16 + "px");
		this.style.set_bottom("0");
		this.style.set_left("0");
		this._downArrow.style.set_right("0");
		this._scrollThumb.style.set_left(16 + "px");
	}
	,initVerticalScrollBar: function() {
		this.style.set_height("100%");
		this.style.set_width(16 + "px");
		this.style.set_right("0");
		this.style.set_top("0");
		this._downArrow.style.set_bottom("0");
		this._scrollThumb.style.set_top(16 + "px");
	}
	,initScrollBar: function() {
		this.style.set_backgroundColor("#DDDDDD");
		this.style.set_display("block");
		this.style.set_position("absolute");
		this._scrollThumb.style.set_backgroundColor("#AAAAAA");
		this._scrollThumb.style.set_position("absolute");
		this._scrollThumb.style.set_display("block");
		this._scrollThumb.style.set_width(16 + "px");
		this._scrollThumb.style.set_height(16 + "px");
		this._upArrow.style.set_backgroundColor("#CCCCCC");
		this._upArrow.style.set_position("absolute");
		this._upArrow.style.set_display("block");
		this._upArrow.style.set_width(16 + "px");
		this._upArrow.style.set_height(16 + "px");
		this._downArrow.style.set_backgroundColor("#CCCCCC");
		this._downArrow.style.set_position("absolute");
		this._downArrow.style.set_display("block");
		this._downArrow.style.set_width(16 + "px");
		this._downArrow.style.set_height(16 + "px");
	}
	,_thumbUpDelegate: null
	,_thumbMoveDelegate: null
	,_mouseMoveStart: null
	,_downArrow: null
	,_upArrow: null
	,_scrollThumb: null
	,maxScroll: null
	,_maxScroll: null
	,scroll: null
	,_scroll: null
	,_isVertical: null
	,__class__: cocktail.core.html.ScrollBar
	,__properties__: $extend(cocktail.core.html.HTMLElement.prototype.__properties__,{set_scroll:"set_scroll",get_scroll:"get_scroll",set_maxScroll:"set_maxScroll",get_maxScroll:"get_maxScroll"})
});
cocktail.core.html.TimeRanges = function(ranges) {
	this._ranges = ranges;
};
$hxClasses["cocktail.core.html.TimeRanges"] = cocktail.core.html.TimeRanges;
cocktail.core.html.TimeRanges.__name__ = ["cocktail","core","html","TimeRanges"];
cocktail.core.html.TimeRanges.prototype = {
	get_length: function() {
		return this._ranges.length;
	}
	,end: function(index) {
		return this._ranges[index].end;
	}
	,start: function(index) {
		return this._ranges[index].start;
	}
	,_ranges: null
	,length: null
	,__class__: cocktail.core.html.TimeRanges
	,__properties__: {get_length:"get_length"}
}
cocktail.core.layer = {}
cocktail.core.layer.LayerRenderer = function(rootElementRenderer) {
	cocktail.core.dom.NodeBase.call(this);
	this.rootElementRenderer = rootElementRenderer;
	this._zeroAndAutoZIndexChildRenderers = new Array();
	this._positiveZIndexChildRenderers = new Array();
	this._negativeZIndexChildRenderers = new Array();
};
$hxClasses["cocktail.core.layer.LayerRenderer"] = cocktail.core.layer.LayerRenderer;
cocktail.core.layer.LayerRenderer.__name__ = ["cocktail","core","layer","LayerRenderer"];
cocktail.core.layer.LayerRenderer.__super__ = cocktail.core.dom.NodeBase;
cocktail.core.layer.LayerRenderer.prototype = $extend(cocktail.core.dom.NodeBase.prototype,{
	getChildRenderers: function() {
		var childRenderers = new Array();
		var _g1 = 0, _g = this._negativeZIndexChildRenderers.length;
		while(_g1 < _g) {
			var i = _g1++;
			var childRenderer = this._negativeZIndexChildRenderers[i];
			childRenderers.push(childRenderer);
		}
		var _g1 = 0, _g = this._zeroAndAutoZIndexChildRenderers.length;
		while(_g1 < _g) {
			var i = _g1++;
			var childRenderer = this._zeroAndAutoZIndexChildRenderers[i];
			childRenderers.push(childRenderer);
		}
		var _g1 = 0, _g = this._positiveZIndexChildRenderers.length;
		while(_g1 < _g) {
			var i = _g1++;
			var childRenderer = this._positiveZIndexChildRenderers[i];
			childRenderers.push(childRenderer);
		}
		return childRenderers;
	}
	,isWithinBounds: function(point,bounds) {
		return point.x >= bounds.x && point.x <= bounds.x + bounds.width && point.y >= bounds.y && point.y <= bounds.y + bounds.height;
	}
	,getElementRenderersAtPointInChildRenderers: function(point,childRenderers,scrollX,scrollY) {
		var elementRenderersAtPointInChildRenderers = new Array();
		var length = childRenderers.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var elementRenderersAtPointInChildRenderer = [];
			if(childRenderers[i].establishesNewStackingContext() == true) {
				if(childRenderers[i].isScrollBar() == true) elementRenderersAtPointInChildRenderer = childRenderers[i].layerRenderer.getElementRenderersAtPoint(point,scrollX,scrollY); else if(childRenderers[i].get_coreStyle().position == cocktail.core.style.Position.fixed) elementRenderersAtPointInChildRenderer = childRenderers[i].layerRenderer.getElementRenderersAtPoint(point,scrollX,scrollY); else elementRenderersAtPointInChildRenderer = childRenderers[i].layerRenderer.getElementRenderersAtPoint(point,scrollX + this.rootElementRenderer.get_scrollLeft(),scrollY + this.rootElementRenderer.get_scrollTop());
			}
			var childLength = elementRenderersAtPointInChildRenderer.length;
			var _g1 = 0;
			while(_g1 < childLength) {
				var j = _g1++;
				elementRenderersAtPointInChildRenderers.push(elementRenderersAtPointInChildRenderer[j]);
			}
		}
		return elementRenderersAtPointInChildRenderers;
	}
	,getElementRenderersAtPointInLayer: function(renderer,point,scrollX,scrollY) {
		var elementRenderersAtPointInLayer = new Array();
		var scrolledPoint = { x : point.x + scrollX, y : point.y + scrollY};
		if(this.isWithinBounds(scrolledPoint,renderer.get_globalBounds()) == true) elementRenderersAtPointInLayer.push(renderer);
		scrollX += renderer.get_scrollLeft();
		scrollY += renderer.get_scrollTop();
		var length = renderer.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = renderer.childNodes[i];
			if(child.layerRenderer == this) {
				if(child.hasChildNodes() == true) {
					var childElementRenderersAtPointInLayer = this.getElementRenderersAtPointInLayer(child,point,scrollX,scrollY);
					var childLength = childElementRenderersAtPointInLayer.length;
					var _g1 = 0;
					while(_g1 < childLength) {
						var j = _g1++;
						elementRenderersAtPointInLayer.push(childElementRenderersAtPointInLayer[j]);
					}
				} else {
					var scrolledPoint1 = { x : point.x + scrollX, y : point.y + scrollY};
					if(this.isWithinBounds(scrolledPoint1,child.get_globalBounds()) == true) elementRenderersAtPointInLayer.push(child);
				}
			}
		}
		return elementRenderersAtPointInLayer;
	}
	,getElementRenderersAtPoint: function(point,scrollX,scrollY) {
		var elementRenderersAtPoint = this.getElementRenderersAtPointInLayer(this.rootElementRenderer,point,scrollX,scrollY);
		if(this.rootElementRenderer.hasChildNodes() == true) {
			var childRenderers = this.getChildRenderers();
			var elementRenderersAtPointInChildRenderers = this.getElementRenderersAtPointInChildRenderers(point,childRenderers,scrollX,scrollY);
			var length = elementRenderersAtPointInChildRenderers.length;
			var _g = 0;
			while(_g < length) {
				var i = _g++;
				elementRenderersAtPoint.push(elementRenderersAtPointInChildRenderers[i]);
			}
		}
		return elementRenderersAtPoint;
	}
	,getTopMostElementRendererAtPoint: function(point,scrollX,scrollY) {
		var elementRenderersAtPoint = this.getElementRenderersAtPoint(point,scrollX,scrollY);
		var topMostElementRenderer = elementRenderersAtPoint[elementRenderersAtPoint.length - 1];
		return topMostElementRenderer;
	}
	,insertNegativeZIndexChildRenderer: function(rootElementRenderer,rootElementRendererZIndex) {
		var newNegativeZIndexChildRenderers = new Array();
		var isInserted = false;
		var length = this._negativeZIndexChildRenderers.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var currentRendererZIndex = 0;
			var $e = (this._negativeZIndexChildRenderers[i].getComputedStyle().zIndex);
			switch( $e[1] ) {
			case 1:
				var value = $e[2];
				currentRendererZIndex = value;
				break;
			default:
			}
			if(currentRendererZIndex > rootElementRendererZIndex && isInserted == false) {
				newNegativeZIndexChildRenderers.push(rootElementRenderer);
				isInserted = true;
			}
			newNegativeZIndexChildRenderers.push(this._negativeZIndexChildRenderers[i]);
		}
		if(isInserted == false) newNegativeZIndexChildRenderers.push(rootElementRenderer);
		this._negativeZIndexChildRenderers = newNegativeZIndexChildRenderers;
	}
	,insertPositiveZIndexChildRenderer: function(rootElementRenderer,rootElementRendererZIndex) {
		var newPositiveZIndexChildRenderers = new Array();
		var isInserted = false;
		var length = this._positiveZIndexChildRenderers.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var currentRendererZIndex = 0;
			var $e = (this._positiveZIndexChildRenderers[i].getComputedStyle().zIndex);
			switch( $e[1] ) {
			case 1:
				var value = $e[2];
				currentRendererZIndex = value;
				break;
			default:
			}
			if(rootElementRendererZIndex < currentRendererZIndex && isInserted == false) {
				newPositiveZIndexChildRenderers.push(rootElementRenderer);
				isInserted = true;
			}
			newPositiveZIndexChildRenderers.push(this._positiveZIndexChildRenderers[i]);
		}
		if(isInserted == false) newPositiveZIndexChildRenderers.push(rootElementRenderer);
		this._positiveZIndexChildRenderers = newPositiveZIndexChildRenderers;
	}
	,removeAutoZIndexChildElementRenderer: function(elementRenderer) {
		HxOverrides.remove(this._zeroAndAutoZIndexChildRenderers,elementRenderer);
	}
	,insertAutoZIndexChildElementRenderer: function(elementRenderer) {
		this._zeroAndAutoZIndexChildRenderers.push(elementRenderer);
	}
	,renderChildElementRenderers: function(rootElementRenderers,graphicContext,forceRendering) {
		var length = rootElementRenderers.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var parentElementRenderer = rootElementRenderers[i].parentNode;
			rootElementRenderers[i].render(graphicContext,forceRendering);
		}
	}
	,renderNegativeChildElementRenderers: function(graphicContext,forceRendering) {
		this.renderChildElementRenderers(this._negativeZIndexChildRenderers,graphicContext,forceRendering);
	}
	,renderZeroAndAutoChildElementRenderers: function(graphicContext,forceRendering) {
		this.renderChildElementRenderers(this._zeroAndAutoZIndexChildRenderers,graphicContext,forceRendering);
	}
	,renderPositiveChildElementRenderers: function(graphicContext,forceRendering) {
		this.renderChildElementRenderers(this._positiveZIndexChildRenderers,graphicContext,forceRendering);
	}
	,removeChild: function(oldChild) {
		var childLayer = oldChild;
		var removed = false;
		removed = HxOverrides.remove(this._zeroAndAutoZIndexChildRenderers,childLayer.rootElementRenderer);
		if(removed == false) {
			removed = HxOverrides.remove(this._positiveZIndexChildRenderers,childLayer.rootElementRenderer);
			if(removed == false) HxOverrides.remove(this._negativeZIndexChildRenderers,childLayer.rootElementRenderer);
		}
		cocktail.core.dom.NodeBase.prototype.removeChild.call(this,oldChild);
		return oldChild;
	}
	,appendChild: function(newChild) {
		cocktail.core.dom.NodeBase.prototype.appendChild.call(this,newChild);
		var childLayer = newChild;
		var $e = (childLayer.rootElementRenderer.getComputedStyle().zIndex);
		switch( $e[1] ) {
		case 0:
			this._zeroAndAutoZIndexChildRenderers.push(childLayer.rootElementRenderer);
			break;
		case 1:
			var value = $e[2];
			if(value == 0) this._zeroAndAutoZIndexChildRenderers.push(childLayer.rootElementRenderer); else if(value > 0) this.insertPositiveZIndexChildRenderer(childLayer.rootElementRenderer,value); else if(value < 0) this.insertNegativeZIndexChildRenderer(childLayer.rootElementRenderer,value);
			break;
		}
		return newChild;
	}
	,_negativeZIndexChildRenderers: null
	,_positiveZIndexChildRenderers: null
	,_zeroAndAutoZIndexChildRenderers: null
	,rootElementRenderer: null
	,__class__: cocktail.core.layer.LayerRenderer
});
cocktail.core.linebox = {}
cocktail.core.linebox.LineBox = function(elementRenderer) {
	cocktail.core.dom.NodeBase.call(this);
	this.set_bounds({ x : 0.0, y : 0.0, width : 0.0, height : 0.0});
	this.elementRenderer = elementRenderer;
	this.marginLeft = 0;
	this.marginRight = 0;
	this.paddingLeft = 0;
	this.paddingRight = 0;
	this.set_leadedAscent(0);
	this.set_leadedDescent(0);
};
$hxClasses["cocktail.core.linebox.LineBox"] = cocktail.core.linebox.LineBox;
cocktail.core.linebox.LineBox.__name__ = ["cocktail","core","linebox","LineBox"];
cocktail.core.linebox.LineBox.__super__ = cocktail.core.dom.NodeBase;
cocktail.core.linebox.LineBox.prototype = $extend(cocktail.core.dom.NodeBase.prototype,{
	set_leadedDescent: function(value) {
		this.leadedDescent = value;
		return value;
	}
	,get_leadedDescent: function() {
		return this.leadedDescent;
	}
	,set_leadedAscent: function(value) {
		this.leadedAscent = value;
		return value;
	}
	,get_leadedAscent: function() {
		return this.leadedAscent;
	}
	,set_bounds: function(value) {
		return this.bounds = value;
	}
	,get_bounds: function() {
		return this.bounds;
	}
	,get_layerRenderer: function() {
		return this.elementRenderer.layerRenderer;
	}
	,getBaselineOffset: function(parentBaselineOffset,parentXHeight) {
		var baselineOffset = parentBaselineOffset + this.elementRenderer.get_coreStyle().computedStyle.verticalAlign;
		switch( (this.elementRenderer.get_coreStyle().verticalAlign)[1] ) {
		case 5:
			baselineOffset -= this.get_bounds().height / 2 - parentXHeight / 2;
			break;
		case 3:
			break;
		default:
		}
		return baselineOffset;
	}
	,establishesNewFormattingContext: function() {
		return this.elementRenderer.establishesNewFormattingContext();
	}
	,isAbsolutelyPositioned: function() {
		var computedStyle = this.elementRenderer.getComputedStyle();
		return computedStyle.position == cocktail.core.style.Position.fixed || computedStyle.position == cocktail.core.style.Position.absolute;
	}
	,isStaticPosition: function() {
		return false;
	}
	,isSpace: function() {
		return false;
	}
	,isText: function() {
		return false;
	}
	,render: function(graphicContext,forceRendering) {
		var backgrounds = cocktail.core.background.BackgroundManager.render(this.get_bounds(),this.elementRenderer.get_coreStyle(),this.elementRenderer);
	}
	,paddingRight: null
	,paddingLeft: null
	,marginRight: null
	,marginLeft: null
	,leadedDescent: null
	,leadedAscent: null
	,bounds: null
	,layerRenderer: null
	,elementRenderer: null
	,__class__: cocktail.core.linebox.LineBox
	,__properties__: $extend(cocktail.core.dom.NodeBase.prototype.__properties__,{get_layerRenderer:"get_layerRenderer",set_bounds:"set_bounds",get_bounds:"get_bounds",set_leadedAscent:"set_leadedAscent",get_leadedAscent:"get_leadedAscent",set_leadedDescent:"set_leadedDescent",get_leadedDescent:"get_leadedDescent"})
});
cocktail.core.linebox.EmbeddedLineBox = function(elementRenderer) {
	cocktail.core.linebox.LineBox.call(this,elementRenderer);
};
$hxClasses["cocktail.core.linebox.EmbeddedLineBox"] = cocktail.core.linebox.EmbeddedLineBox;
cocktail.core.linebox.EmbeddedLineBox.__name__ = ["cocktail","core","linebox","EmbeddedLineBox"];
cocktail.core.linebox.EmbeddedLineBox.__super__ = cocktail.core.linebox.LineBox;
cocktail.core.linebox.EmbeddedLineBox.prototype = $extend(cocktail.core.linebox.LineBox.prototype,{
	get_bounds: function() {
		return this.elementRenderer.get_bounds();
	}
	,get_leadedDescent: function() {
		return 0.0;
	}
	,get_leadedAscent: function() {
		var computedStyle = this.elementRenderer.get_coreStyle().computedStyle;
		return this.get_bounds().height + computedStyle.getMarginTop() + computedStyle.getMarginBottom();
	}
	,render: function(graphicContext,forceRendering) {
		this.elementRenderer.render(graphicContext,forceRendering);
	}
	,__class__: cocktail.core.linebox.EmbeddedLineBox
});
cocktail.core.linebox.RootLineBox = function(elementRenderer) {
	cocktail.core.linebox.LineBox.call(this,elementRenderer);
};
$hxClasses["cocktail.core.linebox.RootLineBox"] = cocktail.core.linebox.RootLineBox;
cocktail.core.linebox.RootLineBox.__name__ = ["cocktail","core","linebox","RootLineBox"];
cocktail.core.linebox.RootLineBox.__super__ = cocktail.core.linebox.LineBox;
cocktail.core.linebox.RootLineBox.prototype = $extend(cocktail.core.linebox.LineBox.prototype,{
	getChildrenBounds: function(childrenBounds) {
		var bounds;
		var left = 50000;
		var top = 50000;
		var right = -50000;
		var bottom = -50000;
		var length = childrenBounds.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var childBounds = childrenBounds[i];
			if(childBounds.x < left) left = childBounds.x;
			if(childBounds.y < top) top = childBounds.y;
			if(childBounds.x + childBounds.width > right) right = childBounds.x + childBounds.width;
			if(childBounds.y + childBounds.height > bottom) bottom = childBounds.y + childBounds.height;
		}
		bounds = { x : left, y : top, width : right - left, height : bottom - top};
		if(bounds.width < 0) bounds.width = 0;
		if(bounds.height < 0) bounds.height = 0;
		return bounds;
	}
	,getLineBoxesBounds: function(lineBox) {
		var lineBoxesBounds = new Array();
		var length = lineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = lineBox.childNodes[i];
			if(child.isAbsolutelyPositioned() == false) {
				lineBoxesBounds.push(child.get_bounds());
				if(child.hasChildNodes() == true) {
					var childrenBounds = this.getLineBoxesBounds(child);
					var childLength = childrenBounds.length;
					var _g1 = 0;
					while(_g1 < childLength) {
						var j = _g1++;
						lineBoxesBounds.push(childrenBounds[j]);
					}
				}
			}
		}
		return lineBoxesBounds;
	}
	,get_bounds: function() {
		return this.getChildrenBounds(this.getLineBoxesBounds(this));
	}
	,__class__: cocktail.core.linebox.RootLineBox
});
cocktail.core.linebox.TextLineBox = function(elementRenderer,text,fontMetrics,fontManager) {
	cocktail.core.linebox.LineBox.call(this,elementRenderer);
	this._fontMetrics = fontMetrics;
	this.initNativeTextElement(text,fontManager,elementRenderer.get_coreStyle().computedStyle);
	this.set_leadedAscent(this.getLeadedAscent());
	this.set_leadedDescent(this.getLeadedDescent());
	this.get_bounds().width = this.getTextWidth();
	this.get_bounds().height = this.getTextHeight();
};
$hxClasses["cocktail.core.linebox.TextLineBox"] = cocktail.core.linebox.TextLineBox;
cocktail.core.linebox.TextLineBox.__name__ = ["cocktail","core","linebox","TextLineBox"];
cocktail.core.linebox.TextLineBox.__super__ = cocktail.core.linebox.LineBox;
cocktail.core.linebox.TextLineBox.prototype = $extend(cocktail.core.linebox.LineBox.prototype,{
	getTextHeight: function() {
		return this.get_leadedAscent() + this.get_leadedDescent();
	}
	,getTextWidth: function() {
		if(this.isSpace() == true) {
			var computedStyle = this.elementRenderer.get_coreStyle().computedStyle;
			return this._fontMetrics.spaceWidth + computedStyle.getLetterSpacing() + computedStyle.getWordSpacing();
		} else return 0.0;
	}
	,getLeadedDescent: function() {
		var ascent = this._fontMetrics.ascent;
		var descent = this._fontMetrics.descent;
		var leading = this.elementRenderer.get_coreStyle().computedStyle.getLineHeight() - (ascent + descent);
		var leadedAscent = ascent + leading / 2;
		var leadedDescent = descent + leading / 2;
		return leadedDescent;
	}
	,getLeadedAscent: function() {
		var ascent = this._fontMetrics.ascent;
		var descent = this._fontMetrics.descent;
		var leading = this.elementRenderer.get_coreStyle().computedStyle.getLineHeight() - (ascent + descent);
		var leadedAscent = ascent + leading / 2;
		var leadedDescent = descent + leading / 2;
		return leadedAscent;
	}
	,establishesNewFormattingContext: function() {
		return false;
	}
	,isAbsolutelyPositioned: function() {
		return false;
	}
	,isText: function() {
		return true;
	}
	,getBaselineOffset: function(parentBaselineOffset,parentXHeight) {
		return parentBaselineOffset;
	}
	,render: function(graphicContext,forceRendering) {
	}
	,initNativeTextElement: function(text,fontManager,computedStyle) {
		this._nativeElement = fontManager.createNativeTextElement(text,computedStyle);
	}
	,_nativeElement: null
	,_fontMetrics: null
	,__class__: cocktail.core.linebox.TextLineBox
});
cocktail.core.linebox.SpaceLineBox = function(elementRenderer,fontMetrics,fontManager) {
	cocktail.core.linebox.TextLineBox.call(this,elementRenderer,"",fontMetrics,null);
};
$hxClasses["cocktail.core.linebox.SpaceLineBox"] = cocktail.core.linebox.SpaceLineBox;
cocktail.core.linebox.SpaceLineBox.__name__ = ["cocktail","core","linebox","SpaceLineBox"];
cocktail.core.linebox.SpaceLineBox.__super__ = cocktail.core.linebox.TextLineBox;
cocktail.core.linebox.SpaceLineBox.prototype = $extend(cocktail.core.linebox.TextLineBox.prototype,{
	getTextWidth: function() {
		return this._fontMetrics.spaceWidth;
	}
	,isSpace: function() {
		return true;
	}
	,render: function(graphicContext,forceRendering) {
	}
	,initNativeTextElement: function(text,fontManager,computedStyle) {
	}
	,__class__: cocktail.core.linebox.SpaceLineBox
});
cocktail.core.linebox.StaticPositionLineBox = function(elementRenderer) {
	cocktail.core.linebox.LineBox.call(this,elementRenderer);
};
$hxClasses["cocktail.core.linebox.StaticPositionLineBox"] = cocktail.core.linebox.StaticPositionLineBox;
cocktail.core.linebox.StaticPositionLineBox.__name__ = ["cocktail","core","linebox","StaticPositionLineBox"];
cocktail.core.linebox.StaticPositionLineBox.__super__ = cocktail.core.linebox.LineBox;
cocktail.core.linebox.StaticPositionLineBox.prototype = $extend(cocktail.core.linebox.LineBox.prototype,{
	get_bounds: function() {
		return this.elementRenderer.get_bounds();
	}
	,isStaticPosition: function() {
		return true;
	}
	,__class__: cocktail.core.linebox.StaticPositionLineBox
});
cocktail.core.renderer = {}
cocktail.core.renderer.ElementRenderer = function(node) {
	cocktail.core.dom.NodeBase.call(this);
	this.node = node;
	this._hasOwnLayer = false;
	this._wasAutoZIndexPositioned = false;
	this.set_bounds({ x : 0.0, y : 0.0, width : 0.0, height : 0.0});
	this.positionedOrigin = { x : 0.0, y : 0.0};
	this.globalPositionnedAncestorOrigin = { x : 0.0, y : 0.0};
	this.globalContainingBlockOrigin = { x : 0.0, y : 0.0};
	this._needsRendering = true;
	this._childrenNeedRendering = true;
	this._needsLayout = true;
	this._childrenNeedLayout = true;
	this._positionedChildrenNeedLayout = true;
	this._needsVisualEffectsRendering = true;
	this.lineBoxes = new Array();
};
$hxClasses["cocktail.core.renderer.ElementRenderer"] = cocktail.core.renderer.ElementRenderer;
cocktail.core.renderer.ElementRenderer.__name__ = ["cocktail","core","renderer","ElementRenderer"];
cocktail.core.renderer.ElementRenderer.__super__ = cocktail.core.dom.NodeBase;
cocktail.core.renderer.ElementRenderer.prototype = $extend(cocktail.core.dom.NodeBase.prototype,{
	get_scrollHeight: function() {
		return this.get_bounds().height;
	}
	,get_scrollWidth: function() {
		return this.get_bounds().width;
	}
	,set_scrollTop: function(value) {
		return value;
	}
	,get_scrollTop: function() {
		return 0;
	}
	,set_scrollLeft: function(value) {
		return value;
	}
	,get_scrollLeft: function() {
		return 0;
	}
	,set_bounds: function(value) {
		return this.bounds = value;
	}
	,get_bounds: function() {
		return this.bounds;
	}
	,set_coreStyle: function(value) {
		this._coreStyle = value;
		return value;
	}
	,get_coreStyle: function() {
		return this._coreStyle;
	}
	,setComputedStyle: function(value) {
		return this._coreStyle.computedStyle = value;
	}
	,getComputedStyle: function() {
		return this._coreStyle.computedStyle;
	}
	,get_scrollableBounds: function() {
		if(this.isRelativePositioned() == false) return this.get_bounds();
		var relativeOffset = this.getRelativeOffset();
		var bounds = this.get_bounds();
		return { x : bounds.x + relativeOffset.x, y : bounds.y + relativeOffset.y, width : bounds.width, height : bounds.height};
	}
	,get_globalBounds: function() {
		var globalX;
		var globalY;
		if(this._coreStyle.position == cocktail.core.style.Position.fixed) {
			if(this._coreStyle.left == cocktail.core.style.PositionOffset.cssAuto && this._coreStyle.right == cocktail.core.style.PositionOffset.cssAuto) globalX = this.globalContainingBlockOrigin.x + this.get_bounds().x; else globalX = this.positionedOrigin.x;
			if(this._coreStyle.top == cocktail.core.style.PositionOffset.cssAuto && this._coreStyle.bottom == cocktail.core.style.PositionOffset.cssAuto) globalY = this.globalContainingBlockOrigin.y + this.get_bounds().y; else globalY = this.positionedOrigin.y;
		} else if(this._coreStyle.position == cocktail.core.style.Position.absolute) {
			if(this._coreStyle.left == cocktail.core.style.PositionOffset.cssAuto && this._coreStyle.right == cocktail.core.style.PositionOffset.cssAuto) globalX = this.globalContainingBlockOrigin.x + this.get_bounds().x; else globalX = this.globalPositionnedAncestorOrigin.x + this.positionedOrigin.x;
			if(this._coreStyle.top == cocktail.core.style.PositionOffset.cssAuto && this._coreStyle.bottom == cocktail.core.style.PositionOffset.cssAuto) globalY = this.globalContainingBlockOrigin.y + this.get_bounds().y; else globalY = this.globalPositionnedAncestorOrigin.y + this.positionedOrigin.y;
		} else {
			globalX = this.globalContainingBlockOrigin.x + this.get_bounds().x;
			globalY = this.globalContainingBlockOrigin.y + this.get_bounds().y;
		}
		return { x : globalX, y : globalY, width : this.get_bounds().width, height : this.get_bounds().height};
	}
	,invalidateText: function() {
		var length = this.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			this.childNodes[i].invalidateText();
		}
	}
	,invalidatedPositionedChildStyle: function(styleName,invalidationReason) {
		switch(styleName) {
		case "background-color":case "background-clip":case "background-image":case "background-position":case "background-origin":case "background-repeat":case "background-size":
			break;
		default:
			this._positionedChildrenNeedLayout = true;
			this._childrenNeedRendering = true;
			this.invalidateDocumentLayoutAndRendering();
		}
	}
	,invalidatedChildStyle: function(styleName,invalidationReason) {
		switch(styleName) {
		case "background-color":case "background-clip":case "background-image":case "background-position":case "background-origin":case "background-repeat":case "background-size":
			break;
		default:
			this._needsLayout = true;
			this._childrenNeedRendering = true;
			this.invalidateContainingBlock(invalidationReason);
			this.invalidateDocumentLayoutAndRendering();
		}
	}
	,invalidatedStyle: function(styleName,invalidationReason) {
		switch(styleName) {
		case "left":case "right":case "top":case "bottom":
			this._needsRendering = true;
			if(this.isPositioned() == true && this.isRelativePositioned() == false) {
				this._needsLayout = true;
				this.invalidateContainingBlock(invalidationReason);
			} else this.invalidateDocumentRendering();
			break;
		case "color":case "font-family":case "font-size":case "font-variant":case "font-style":case "font-weight":case "letter-spacing":case "text-tranform":case "white-space":
			this.invalidateText();
			this._needsLayout = true;
			this._needsRendering = true;
			this.invalidateContainingBlock(invalidationReason);
			break;
		case "background-color":case "background-clip":case "background-image":case "background-position":case "background-origin":case "background-repeat":case "background-size":
			this._needsRendering = true;
			this.invalidateDocumentRendering();
			break;
		default:
			this._needsLayout = true;
			this._needsRendering = true;
			this._childrenNeedRendering = true;
			this.invalidateDocumentRendering();
			this.invalidateContainingBlock(invalidationReason);
		}
	}
	,invalidateDocumentLayoutAndRendering: function() {
		var htmlDocument = this.node.ownerDocument;
		htmlDocument.invalidateLayout();
		htmlDocument.invalidateRendering();
	}
	,invalidateDocumentRendering: function() {
		var htmlDocument = this.node.ownerDocument;
		htmlDocument.invalidateRendering();
	}
	,invalidateDocumentLayout: function() {
		var htmlDocument = this.node.ownerDocument;
		htmlDocument.invalidateLayout();
	}
	,invalidateContainingBlock: function(invalidationReason) {
		if(this.parentNode == null) return;
		var containingBlockInvalidationReason;
		var $e = (invalidationReason);
		switch( $e[1] ) {
		case 0:
			var styleName = $e[2];
			if(this.isPositioned() == true) containingBlockInvalidationReason = cocktail.core.renderer.InvalidationReason.positionedChildStyleChanged(styleName); else containingBlockInvalidationReason = cocktail.core.renderer.InvalidationReason.childStyleChanged(styleName);
			break;
		default:
			containingBlockInvalidationReason = invalidationReason;
		}
		if(this.isPositioned() == true && this.isRelativePositioned() == false) this._containingBlock.positionedChildInvalidated(containingBlockInvalidationReason); else this._containingBlock.childInvalidated(containingBlockInvalidationReason);
	}
	,positionedChildInvalidated: function(invalidationReason) {
		this.invalidate(invalidationReason);
	}
	,childInvalidated: function(invalidationReason) {
		this.invalidate(invalidationReason);
	}
	,invalidate: function(invalidationReason) {
		var $e = (invalidationReason);
		switch( $e[1] ) {
		case 0:
			var styleName = $e[2];
			this.invalidatedStyle(styleName,invalidationReason);
			break;
		case 1:
			var styleName = $e[2];
			this.invalidatedChildStyle(styleName,invalidationReason);
			break;
		case 2:
			var styleName = $e[2];
			this.invalidatedPositionedChildStyle(styleName,invalidationReason);
			break;
		case 3:
			this.layout(true);
			break;
		case 5:
			this._needsLayout = true;
			this._childrenNeedLayout = true;
			this._childrenNeedRendering = true;
			this._needsRendering = true;
			this._positionedChildrenNeedLayout = true;
			this.invalidateDocumentLayoutAndRendering();
			break;
		case 4:
			this._needsRendering = true;
			this.invalidateDocumentRendering();
			break;
		case 6:
			this._needsLayout = true;
			this._childrenNeedLayout = true;
			this._childrenNeedRendering = true;
			this._needsRendering = true;
			this._positionedChildrenNeedLayout = true;
			this.invalidateContainingBlock(invalidationReason);
			break;
		}
	}
	,getChildrenBounds: function(childrenBounds) {
		var bounds;
		var left = 50000;
		var top = 50000;
		var right = -50000;
		var bottom = -50000;
		var length = childrenBounds.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var childBounds = childrenBounds[i];
			if(childBounds.x < left) left = childBounds.x;
			if(childBounds.y < top) top = childBounds.y;
			if(childBounds.x + childBounds.width > right) right = childBounds.x + childBounds.width;
			if(childBounds.y + childBounds.height > bottom) bottom = childBounds.y + childBounds.height;
		}
		bounds = { x : left, y : top, width : right - left, height : bottom - top};
		if(bounds.width < 0) bounds.width = 0;
		if(bounds.height < 0) bounds.height = 0;
		return bounds;
	}
	,getFirstBlockContainer: function() {
		var parent = this.parentNode;
		while(parent.isBlockContainer() == false) parent = parent.parentNode;
		return parent;
	}
	,getInitialContainingBlock: function() {
		return this.node.ownerDocument.documentElement.elementRenderer;
	}
	,getFirstPositionedAncestor: function() {
		var parent = this.parentNode;
		while(parent.isPositioned() == false) parent = parent.parentNode;
		return parent;
	}
	,getContainingBlock: function() {
		if(this.isPositioned() == true && this.isRelativePositioned() == false) {
			if(this.getComputedStyle().position == cocktail.core.style.Position.fixed) return this.getInitialContainingBlock(); else return this.getFirstPositionedAncestor();
		} else return this.getFirstBlockContainer();
	}
	,createLayer: function(parentLayer) {
		if(this.establishesNewStackingContext() == true) {
			this.layerRenderer = new cocktail.core.layer.LayerRenderer(this);
			parentLayer.appendChild(this.layerRenderer);
			this._hasOwnLayer = true;
		} else {
			this.layerRenderer = parentLayer;
			if(this.isAutoZIndexPositioned() == true) {
				this.layerRenderer.insertAutoZIndexChildElementRenderer(this);
				this._wasAutoZIndexPositioned = true;
			}
		}
	}
	,isAutoZIndexPositioned: function() {
		return false;
	}
	,rendersAsIfEstablishingStackingContext: function() {
		return false;
	}
	,getRelativeOffset: function() {
		var relativeOffset = { x : 0.0, y : 0.0};
		if(this.isRelativePositioned() == true) {
			if(this.get_coreStyle().left != cocktail.core.style.PositionOffset.cssAuto) relativeOffset.x += this.get_coreStyle().computedStyle.getLeft(); else if(this.get_coreStyle().right != cocktail.core.style.PositionOffset.cssAuto) relativeOffset.x -= this.get_coreStyle().computedStyle.getRight();
			if(this.get_coreStyle().top != cocktail.core.style.PositionOffset.cssAuto) relativeOffset.y += this.get_coreStyle().computedStyle.getTop(); else if(this.get_coreStyle().bottom != cocktail.core.style.PositionOffset.cssAuto) relativeOffset.y -= this.get_coreStyle().computedStyle.getBottom();
		}
		return relativeOffset;
	}
	,establishesNewStackingContext: function() {
		return false;
	}
	,isAnonymousBlockBox: function() {
		return false;
	}
	,childrenInline: function() {
		return false;
	}
	,isBlockContainer: function() {
		return false;
	}
	,isRelativePositioned: function() {
		return false;
	}
	,isText: function() {
		return false;
	}
	,isReplaced: function() {
		return false;
	}
	,isInlineLevel: function() {
		return false;
	}
	,isPositioned: function() {
		return false;
	}
	,isFloat: function() {
		return false;
	}
	,isScrollBar: function() {
		return false;
	}
	,establishesNewFormattingContext: function() {
		return false;
	}
	,isHorizontallyScrollable: function(scrollOffset) {
		return false;
	}
	,isVerticallyScrollable: function(scrollOffset) {
		return false;
	}
	,detachContainingBlock: function() {
		this._containingBlock.removePositionedChild(this);
	}
	,attachContaininingBlock: function() {
		if(this.isPositioned() == true) this._containingBlock.addPositionedChildren(this);
	}
	,detachLayer: function() {
		if(this._hasOwnLayer == true) {
			var parent = this.parentNode;
			parent.layerRenderer.removeChild(this.layerRenderer);
			this._hasOwnLayer = false;
		} else if(this._wasAutoZIndexPositioned == true) {
			if(this.layerRenderer != null) this.layerRenderer.removeAutoZIndexChildElementRenderer(this);
			this._wasAutoZIndexPositioned = false;
		}
		this.layerRenderer = null;
	}
	,attachLayer: function() {
		if(this.layerRenderer == null) {
			if(this.parentNode != null) {
				var parent = this.parentNode;
				if(parent.layerRenderer != null) this.createLayer(parent.layerRenderer);
			}
		}
	}
	,detach: function() {
		this.detachContainingBlock();
		this._containingBlock = null;
		var length = this.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = this.childNodes[i];
			child.detach();
		}
		this.detachLayer();
	}
	,attach: function() {
		this.attachLayer();
		var length = this.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = this.childNodes[i];
			child.attach();
		}
		this._containingBlock = this.getContainingBlock();
		this.attachContaininingBlock();
	}
	,setGlobalOrigins: function(addedX,addedY,addedPositionedX,addedPositionedY) {
		if(this.establishesNewFormattingContext() == true) {
			var globalBounds = this.get_globalBounds();
			addedX = globalBounds.x;
			addedY = globalBounds.y;
		}
		if(this.isPositioned() == true) {
			var globalBounds = this.get_globalBounds();
			addedPositionedX = globalBounds.x;
			addedPositionedY = globalBounds.y;
		}
		var length = this.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = this.childNodes[i];
			child.globalContainingBlockOrigin = { x : addedX, y : addedY};
			child.globalPositionnedAncestorOrigin = { x : addedPositionedX, y : addedPositionedY};
			if(child.hasChildNodes() == true) child.setGlobalOrigins(addedX,addedY,addedPositionedX,addedPositionedY);
		}
	}
	,layout: function(forceLayout) {
	}
	,render: function(parentGraphicContext,forceRendering) {
	}
	,doStartPendingAnimation: function(elementRenderer) {
		var atLeastOneAnimationStarted = false;
		var animationStarted = elementRenderer.get_coreStyle().startPendingAnimations();
		if(animationStarted == true) atLeastOneAnimationStarted = true;
		var _g1 = 0, _g = this.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			var animationStarted1 = this.childNodes[i].startPendingAnimation();
			if(animationStarted1 == true) atLeastOneAnimationStarted = true;
		}
		return atLeastOneAnimationStarted;
	}
	,startPendingAnimation: function() {
		return this.doStartPendingAnimation(this);
	}
	,removeChild: function(oldChild) {
		var elementRendererChild = oldChild;
		elementRendererChild.detach();
		cocktail.core.dom.NodeBase.prototype.removeChild.call(this,oldChild);
		this.invalidate(cocktail.core.renderer.InvalidationReason.other);
		return oldChild;
	}
	,appendChild: function(newChild) {
		cocktail.core.dom.NodeBase.prototype.appendChild.call(this,newChild);
		var elementRendererChild = newChild;
		elementRendererChild.attach();
		this.invalidate(cocktail.core.renderer.InvalidationReason.other);
		return newChild;
	}
	,dispose: function() {
	}
	,_containingBlock: null
	,_needsVisualEffectsRendering: null
	,_childrenNeedRendering: null
	,_needsRendering: null
	,_positionedChildrenNeedLayout: null
	,_childrenNeedLayout: null
	,_needsLayout: null
	,scrollHeight: null
	,scrollWidth: null
	,scrollTop: null
	,scrollLeft: null
	,computedStyle: null
	,_wasAutoZIndexPositioned: null
	,_hasOwnLayer: null
	,lineBoxes: null
	,layerRenderer: null
	,coreStyle: null
	,_coreStyle: null
	,node: null
	,globalPositionnedAncestorOrigin: null
	,positionedOrigin: null
	,globalContainingBlockOrigin: null
	,scrollableBounds: null
	,globalBounds: null
	,bounds: null
	,__class__: cocktail.core.renderer.ElementRenderer
	,__properties__: $extend(cocktail.core.dom.NodeBase.prototype.__properties__,{set_bounds:"set_bounds",get_bounds:"get_bounds",get_globalBounds:"get_globalBounds",get_scrollableBounds:"get_scrollableBounds",set_coreStyle:"set_coreStyle",get_coreStyle:"get_coreStyle",set_computedStyle:"setComputedStyle",get_computedStyle:"getComputedStyle",set_scrollLeft:"set_scrollLeft",get_scrollLeft:"get_scrollLeft",set_scrollTop:"set_scrollTop",get_scrollTop:"get_scrollTop",get_scrollWidth:"get_scrollWidth",get_scrollHeight:"get_scrollHeight"})
});
cocktail.core.renderer.BoxRenderer = function(node) {
	cocktail.core.renderer.ElementRenderer.call(this,node);
};
$hxClasses["cocktail.core.renderer.BoxRenderer"] = cocktail.core.renderer.BoxRenderer;
cocktail.core.renderer.BoxRenderer.__name__ = ["cocktail","core","renderer","BoxRenderer"];
cocktail.core.renderer.BoxRenderer.__super__ = cocktail.core.renderer.ElementRenderer;
cocktail.core.renderer.BoxRenderer.prototype = $extend(cocktail.core.renderer.ElementRenderer.prototype,{
	getWindowData: function() {
		var width = cocktail.Lib.get_window().get_innerWidth();
		var height = cocktail.Lib.get_window().get_innerHeight();
		var windowData = { isHeightAuto : false, isWidthAuto : false, width : width, height : height};
		return windowData;
	}
	,getContainerBlockData: function() {
		return { width : this.getComputedStyle().getWidth(), isWidthAuto : this._coreStyle.width == cocktail.core.style.Dimension.cssAuto, height : this.getComputedStyle().getHeight(), isHeightAuto : this._coreStyle.height == cocktail.core.style.Dimension.cssAuto};
	}
	,getBackgroundBounds: function() {
		return this.get_globalBounds();
	}
	,isClear: function() {
		return this.getComputedStyle().clear != cocktail.core.style.Clear.none;
	}
	,isAutoZIndexPositioned: function() {
		if(this.isPositioned() == false) return false;
		return this.getComputedStyle().zIndex == cocktail.core.style.ZIndex.cssAuto;
	}
	,establishesNewStackingContext: function() {
		if(this.isPositioned() == true) {
			if(this.isAutoZIndexPositioned() == true) return false; else return true;
		}
		return false;
	}
	,isInlineLevel: function() {
		var ret = false;
		switch( (this.getComputedStyle().display)[1] ) {
		case 2:
		case 1:
			ret = true;
			break;
		default:
			ret = false;
		}
		return ret;
	}
	,isRelativePositioned: function() {
		return this.getComputedStyle().position == cocktail.core.style.Position.relative;
	}
	,isPositioned: function() {
		return this.getComputedStyle().position != cocktail.core.style.Position.cssStatic;
	}
	,isFloat: function() {
		return this.getComputedStyle().cssFloat != cocktail.core.style.CSSFloat.none;
	}
	,layoutSelf: function() {
		var containingBlockData = this._containingBlock.getContainerBlockData();
		var containingBlockFontMetricsData = this._containingBlock.get_coreStyle().get_fontMetricsData();
		this._coreStyle.computeTextAndFontStyles(containingBlockData,containingBlockFontMetricsData);
		this._coreStyle.computeBoxModelStyles(containingBlockData,this.isReplaced());
	}
	,layout: function(forceLayout) {
		this._coreStyle.computedStyle.set_opacity(this._coreStyle.opacity);
		this._coreStyle.computeTransitionStyles();
		if(this._needsLayout == true || forceLayout == true) {
			this.layoutSelf();
			this._needsLayout = false;
		}
	}
	,getConcatenatedMatrix: function(matrix,relativeOffset) {
		var currentMatrix = new cocktail.core.geom.Matrix();
		var globalBounds = this.get_globalBounds();
		currentMatrix.translate(globalBounds.x + relativeOffset.x,globalBounds.y + relativeOffset.y);
		currentMatrix.concatenate(matrix);
		currentMatrix.translate((globalBounds.x + relativeOffset.x) * -1,(globalBounds.y + relativeOffset.y) * -1);
		return currentMatrix;
	}
	,applyOpacity: function(graphicContext) {
	}
	,applyTransformationMatrix: function(graphicContext) {
		var relativeOffset = this.getRelativeOffset();
		var concatenatedMatrix = this.getConcatenatedMatrix(this.getComputedStyle().transform,relativeOffset);
		concatenatedMatrix.translate(relativeOffset.x,relativeOffset.y);
		var matrixData = concatenatedMatrix.data;
	}
	,applyVisualEffects: function(graphicContext) {
		this.applyOpacity(graphicContext);
		if(this.isRelativePositioned() == true || this._coreStyle.transform != cocktail.core.style.Transform.none) {
			this._coreStyle.computeVisualEffectStyles();
			this.applyTransformationMatrix(graphicContext);
		}
	}
	,renderChildren: function(graphicContext,forceRendering) {
	}
	,renderBackground: function(graphicContext) {
		this._coreStyle.computeBackgroundStyles();
		var backgroundBounds = this.getBackgroundBounds();
		var backgrounds = cocktail.core.background.BackgroundManager.render(backgroundBounds,this._coreStyle,this);
	}
	,clear: function(graphicsContext) {
	}
	,renderSelf: function(graphicContext) {
		this.renderBackground(graphicContext);
	}
	,scroll: function(x,y) {
		if(this.getComputedStyle().position == cocktail.core.style.Position.fixed) {
		}
	}
	,render: function(parentGraphicContext,forceRendering) {
		if(this._needsRendering == true || forceRendering == true) {
			this.clear(this.graphicsContext);
			this.renderSelf(this.graphicsContext);
			this._needsRendering = false;
		}
		this.clear(this.childrenGraphicsContext);
		this.renderChildren(this.childrenGraphicsContext,forceRendering == true || this._childrenNeedRendering == true);
		this._childrenNeedRendering = false;
		this.applyVisualEffects(this.graphicsContext);
		this._needsVisualEffectsRendering = false;
	}
	,childrenGraphicsContext: null
	,graphicsContext: null
	,__class__: cocktail.core.renderer.BoxRenderer
});
cocktail.core.renderer.FlowBoxRenderer = function(node) {
	cocktail.core.renderer.BoxRenderer.call(this,node);
	this._positionedChildren = new Array();
};
$hxClasses["cocktail.core.renderer.FlowBoxRenderer"] = cocktail.core.renderer.FlowBoxRenderer;
cocktail.core.renderer.FlowBoxRenderer.__name__ = ["cocktail","core","renderer","FlowBoxRenderer"];
cocktail.core.renderer.FlowBoxRenderer.__super__ = cocktail.core.renderer.BoxRenderer;
cocktail.core.renderer.FlowBoxRenderer.prototype = $extend(cocktail.core.renderer.BoxRenderer.prototype,{
	childrenInline: function() {
		var length = this.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = this.childNodes[i];
			if(child.isFloat() == false) {
				if(child.isPositioned() == false || child.isRelativePositioned() == true) {
					if(child.isInlineLevel() == true) return true;
				}
			}
		}
		return false;
	}
	,getBottomOffset: function(elementRenderer,containingHTMLElementHeight) {
		var computedStyle = elementRenderer.get_coreStyle().computedStyle;
		return containingHTMLElementHeight - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getBottom();
	}
	,getTopOffset: function(elementRenderer) {
		var computedStyle = elementRenderer.get_coreStyle().computedStyle;
		return computedStyle.getTop() + computedStyle.getMarginTop();
	}
	,getRightOffset: function(elementRenderer,containingHTMLElementWidth) {
		var computedStyle = elementRenderer.get_coreStyle().computedStyle;
		return containingHTMLElementWidth - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getRight() - computedStyle.getMarginRight();
	}
	,getLeftOffset: function(elementRenderer) {
		var computedStyle = elementRenderer.get_coreStyle().computedStyle;
		return computedStyle.getLeft() + computedStyle.getMarginLeft();
	}
	,doLayoutPositionedChild: function(elementRenderer,containingBlockData) {
		if(elementRenderer.get_coreStyle().left != cocktail.core.style.PositionOffset.cssAuto) elementRenderer.positionedOrigin.x = this.getLeftOffset(elementRenderer); else if(elementRenderer.get_coreStyle().right != cocktail.core.style.PositionOffset.cssAuto) elementRenderer.positionedOrigin.x = this.getRightOffset(elementRenderer,containingBlockData.width);
		if(elementRenderer.get_coreStyle().top != cocktail.core.style.PositionOffset.cssAuto) elementRenderer.positionedOrigin.y = this.getTopOffset(elementRenderer); else if(elementRenderer.get_coreStyle().bottom != cocktail.core.style.PositionOffset.cssAuto) elementRenderer.positionedOrigin.y = this.getBottomOffset(elementRenderer,containingBlockData.height);
	}
	,layoutPositionedChild: function(elementRenderer,firstPositionedAncestorData,viewportData) {
		switch( (elementRenderer.getComputedStyle().position)[1] ) {
		case 3:
			this.doLayoutPositionedChild(elementRenderer,viewportData);
			break;
		case 2:
			this.doLayoutPositionedChild(elementRenderer,firstPositionedAncestorData);
			break;
		default:
		}
	}
	,format: function() {
	}
	,layoutPositionedChildren: function() {
		var containerBlockData = this.getContainerBlockData();
		var windowData = this.getWindowData();
		var length = this._positionedChildren.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			this.layoutPositionedChild(this._positionedChildren[i],containerBlockData,windowData);
		}
	}
	,layout: function(forceLayout) {
		cocktail.core.renderer.BoxRenderer.prototype.layout.call(this,forceLayout);
		var length = this.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			this.childNodes[i].layout(this._childrenNeedLayout);
		}
		this.format();
		if(this._positionedChildrenNeedLayout == true || forceLayout == true) {
			if(this.isPositioned() == true) this.layoutPositionedChildren();
			this._positionedChildrenNeedLayout = false;
		}
	}
	,removePositionedChild: function(element) {
		HxOverrides.remove(this._positionedChildren,element);
	}
	,addPositionedChildren: function(element) {
		this._positionedChildren.push(element);
	}
	,getLineBoxesInLine: function(rootLineBox) {
		var ret = new Array();
		var length = rootLineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			ret.push(rootLineBox.childNodes[i]);
			if(rootLineBox.childNodes[i].hasChildNodes() == true) {
				var childLineBoxes = this.getLineBoxesInLine(rootLineBox.childNodes[i]);
				var childLength = childLineBoxes.length;
				var _g1 = 0;
				while(_g1 < childLength) {
					var j = _g1++;
					ret.push(childLineBoxes[j]);
				}
			}
		}
		return ret;
	}
	,_positionedChildren: null
	,__class__: cocktail.core.renderer.FlowBoxRenderer
});
cocktail.core.renderer.BlockBoxRenderer = function(node) {
	cocktail.core.renderer.FlowBoxRenderer.call(this,node);
	this._isUpdatingScroll = false;
	this._isMakingChildrenNonInline = false;
	this._scrollLeft = 0;
	this._scrollTop = 0;
	this._scrollableBounds = { x : 0.0, y : 0.0, width : 0.0, height : 0.0};
};
$hxClasses["cocktail.core.renderer.BlockBoxRenderer"] = cocktail.core.renderer.BlockBoxRenderer;
cocktail.core.renderer.BlockBoxRenderer.__name__ = ["cocktail","core","renderer","BlockBoxRenderer"];
cocktail.core.renderer.BlockBoxRenderer.__super__ = cocktail.core.renderer.FlowBoxRenderer;
cocktail.core.renderer.BlockBoxRenderer.prototype = $extend(cocktail.core.renderer.FlowBoxRenderer.prototype,{
	treatVisibleOverflowAsAuto: function() {
		return false;
	}
	,canAlwaysOverflow: function() {
		if(this.treatVisibleOverflowAsAuto() == true) return false;
		switch( (this.getComputedStyle().overflowX)[1] ) {
		case 0:
			break;
		default:
			return false;
		}
		switch( (this.getComputedStyle().overflowY)[1] ) {
		case 0:
			break;
		default:
			return false;
		}
		return true;
	}
	,mustBubbleScrollEvent: function() {
		return false;
	}
	,dispatchScrollEvent: function() {
		var scrollEvent = new cocktail.core.event.UIEvent();
		scrollEvent.initUIEvent("scroll",this.mustBubbleScrollEvent(),false,null,0.0);
		this.node.dispatchEvent(scrollEvent);
	}
	,getHorizontalMaxScroll: function() {
		var maxScroll = this._scrollableBounds.width - this.getContainerBlockData().width;
		if(maxScroll < 0) return 0;
		return maxScroll;
	}
	,getVerticalMaxScroll: function() {
		var maxScroll = this._scrollableBounds.height - this.getContainerBlockData().height;
		if(maxScroll < 0) return 0;
		return maxScroll;
	}
	,getScrollbarContainerBlock: function() {
		return cocktail.core.renderer.FlowBoxRenderer.prototype.getContainerBlockData.call(this);
	}
	,getContainerBlockData: function() {
		var height = this.getComputedStyle().getHeight();
		if(this._horizontalScrollBar != null) height -= this._horizontalScrollBar.coreStyle.computedStyle.getHeight();
		var width = this.getComputedStyle().getWidth();
		if(this._verticalScrollBar != null) width -= this._verticalScrollBar.coreStyle.computedStyle.getWidth();
		return { width : width, isWidthAuto : this._coreStyle.width == cocktail.core.style.Dimension.cssAuto, height : height, isHeightAuto : this._coreStyle.height == cocktail.core.style.Dimension.cssAuto};
	}
	,rendersAsIfEstablishingStackingContext: function() {
		if(this.isAutoZIndexPositioned() == true) return true; else if(this.getComputedStyle().display == cocktail.core.style.Display.inlineBlock) return true; else if(this.isFloat() == true) return true;
		return false;
	}
	,isBlockContainer: function() {
		return true;
	}
	,establishesNewFormattingContext: function() {
		var establishesNewFormattingContext = false;
		if(this.isFloat() == true) establishesNewFormattingContext = true; else if(this.canAlwaysOverflow() == false) establishesNewFormattingContext = true; else if(this.isPositioned() == true && this.isRelativePositioned() == false) establishesNewFormattingContext = true; else if(this.isAnonymousBlockBox() == true) establishesNewFormattingContext = true; else {
			switch( (this.getComputedStyle().display)[1] ) {
			case 1:
				establishesNewFormattingContext = true;
				break;
			case 0:
				if(this.childrenInline() == true) establishesNewFormattingContext = true;
				break;
			default:
			}
		}
		return establishesNewFormattingContext;
	}
	,isHorizontallyScrollable: function(scrollOffset) {
		if(this._horizontalScrollBar == null) return false;
		if(scrollOffset < 0) {
			if(this.get_scrollLeft() >= this._scrollableBounds.width - this.getContainerBlockData().width) return false;
		} else if(scrollOffset > 0) {
			if(this.get_scrollLeft() <= 0) return false;
		}
		return true;
	}
	,isVerticallyScrollable: function(scrollOffset) {
		if(this._verticalScrollBar == null) return false;
		if(scrollOffset < 0) {
			if(this.get_scrollTop() >= this._scrollableBounds.height - this.getContainerBlockData().height) return false;
		} else if(scrollOffset > 0) {
			if(this.get_scrollTop() <= 0) return false;
		}
		return true;
	}
	,establishesNewStackingContext: function() {
		var establishesNewStackingContext = cocktail.core.renderer.FlowBoxRenderer.prototype.establishesNewStackingContext.call(this);
		if(establishesNewStackingContext == true) return true;
		return this.canAlwaysOverflow() != true;
	}
	,onVerticalScroll: function(event) {
		this.set_scrollTop(this._verticalScrollBar.get_scroll());
	}
	,onHorizontalScroll: function(event) {
		this.set_scrollLeft(this._horizontalScrollBar.get_scroll());
	}
	,attachOrDetachVerticalScrollBarIfNecessary: function() {
		if(this._scrollableBounds.y < 0 || this._scrollableBounds.y + this._scrollableBounds.height > this.get_bounds().height) this.attachVerticalScrollBar(); else this.detachVerticalScrollBar();
	}
	,detachVerticalScrollBar: function() {
		if(this._verticalScrollBar != null) {
			this.removeChild(this._verticalScrollBar.elementRenderer);
			this._verticalScrollBar.set_onScroll(null);
			this._verticalScrollBar = null;
			this.set_scrollTop(0);
		}
	}
	,attachVerticalScrollBar: function() {
		if(this._verticalScrollBar == null) {
			this._verticalScrollBar = new cocktail.core.html.ScrollBar(true);
			this._verticalScrollBar.ownerDocument = this.node.ownerDocument;
			this._verticalScrollBar.attach();
			this.appendChild(this._verticalScrollBar.elementRenderer);
			this._verticalScrollBar.set_onScroll($bind(this,this.onVerticalScroll));
		}
		if(this._verticalScrollBar != null) this._verticalScrollBar.set_maxScroll(this.getVerticalMaxScroll());
	}
	,attachOrDetachHorizontalScrollBarIfNecessary: function() {
		if(this._scrollableBounds.x < 0 || this._scrollableBounds.x + this._scrollableBounds.width > this.get_bounds().width) this.attachHorizontalScrollBar(); else this.detachHorizontalScrollBar();
	}
	,detachHorizontalScrollBar: function() {
		if(this._horizontalScrollBar != null) {
			this.removeChild(this._horizontalScrollBar.elementRenderer);
			this._horizontalScrollBar.set_onScroll(null);
			this._horizontalScrollBar = null;
			this.set_scrollLeft(0);
		}
	}
	,attachHorizontalScrollBar: function() {
		if(this._horizontalScrollBar == null) {
			this._horizontalScrollBar = new cocktail.core.html.ScrollBar(false);
			this._horizontalScrollBar.ownerDocument = this.node.ownerDocument;
			this._horizontalScrollBar.attach();
			this.appendChild(this._horizontalScrollBar.elementRenderer);
			this._horizontalScrollBar.set_onScroll($bind(this,this.onHorizontalScroll));
		}
		if(this._horizontalScrollBar != null) this._horizontalScrollBar.set_maxScroll(this.getHorizontalMaxScroll());
	}
	,attachScrollBarsIfnecessary: function() {
		if(this.canAlwaysOverflow() == true) {
			this.detachHorizontalScrollBar();
			this.detachVerticalScrollBar();
			return;
		}
		switch( (this.getComputedStyle().overflowX)[1] ) {
		case 2:
			this.attachHorizontalScrollBar();
			break;
		case 1:
			this.detachHorizontalScrollBar();
			break;
		case 3:
			this.attachOrDetachHorizontalScrollBarIfNecessary();
			break;
		case 0:
			if(this.treatVisibleOverflowAsAuto() == true) this.attachOrDetachHorizontalScrollBarIfNecessary(); else this.detachHorizontalScrollBar();
			break;
		}
		switch( (this.getComputedStyle().overflowY)[1] ) {
		case 2:
			this.attachVerticalScrollBar();
			break;
		case 1:
			this.detachVerticalScrollBar();
			break;
		case 3:
			this.attachOrDetachVerticalScrollBarIfNecessary();
			break;
		case 0:
			if(this.treatVisibleOverflowAsAuto() == true) this.attachOrDetachVerticalScrollBarIfNecessary(); else this.detachVerticalScrollBar();
			break;
		}
	}
	,doGetScrollableBounds: function(rootRenderer) {
		var childrenBounds = new Array();
		var length = rootRenderer.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = rootRenderer.childNodes[i];
			if(child.node != this._horizontalScrollBar && child.node != this._verticalScrollBar) {
				if(child.hasChildNodes() == true) {
					var childChildrenBounds = this.doGetScrollableBounds(child);
					var childLength = childChildrenBounds.length;
					var _g1 = 0;
					while(_g1 < childLength) {
						var j = _g1++;
						childrenBounds.push(childChildrenBounds[j]);
					}
				}
				childrenBounds.push(child.get_scrollableBounds());
			}
		}
		return childrenBounds;
	}
	,getScrollableBounds: function() {
		return this.getChildrenBounds(this.doGetScrollableBounds(this));
	}
	,updateScroll: function() {
		if(this._isUpdatingScroll == false) {
			this._isUpdatingScroll = true;
			if(this.isXAxisClipped() == true || this.isYAxisClipped() == true) this.scroll(this._scrollLeft,this._scrollTop);
			if(this._horizontalScrollBar != null) this._horizontalScrollBar.set_scroll(this.get_scrollLeft());
			if(this._verticalScrollBar != null) this._verticalScrollBar.set_scroll(this.get_scrollTop());
			this.dispatchScrollEvent();
			this._isUpdatingScroll = false;
		}
	}
	,isYAxisClipped: function() {
		switch( (this.getComputedStyle().overflowY)[1] ) {
		case 1:
		case 2:
			return true;
		case 3:
			return this._verticalScrollBar != null;
		case 0:
			if(this.treatVisibleOverflowAsAuto() == true) return this._verticalScrollBar != null;
			return false;
		}
	}
	,isXAxisClipped: function() {
		switch( (this.getComputedStyle().overflowX)[1] ) {
		case 1:
		case 2:
			return true;
		case 3:
			return this._horizontalScrollBar != null;
		case 0:
			if(this.treatVisibleOverflowAsAuto() == true) return this._horizontalScrollBar != null;
			return false;
		}
	}
	,get_scrollHeight: function() {
		if(this._scrollableBounds.height > this.get_bounds().height) return this._scrollableBounds.height;
		return this.get_bounds().height;
	}
	,get_scrollWidth: function() {
		if(this._scrollableBounds.width > this.get_bounds().width) return this._scrollableBounds.width;
		return this.get_bounds().width;
	}
	,set_scrollTop: function(value) {
		if(value <= 0) this._scrollTop = 0; else if(value > this.getVerticalMaxScroll()) this._scrollTop = this.getVerticalMaxScroll(); else this._scrollTop = value;
		this.updateScroll();
		return value;
	}
	,get_scrollTop: function() {
		return this._scrollTop;
	}
	,set_scrollLeft: function(value) {
		if(value <= 0) this._scrollLeft = 0; else if(value > this.getHorizontalMaxScroll()) this._scrollLeft = this.getHorizontalMaxScroll(); else this._scrollLeft = value;
		this.updateScroll();
		return value;
	}
	,get_scrollLeft: function() {
		return this._scrollLeft;
	}
	,layoutScrollBarsIfNecessary: function(viewportData) {
		var horizontalScrollBarContainerBlockData = this.getContainerBlockData();
		if(this._horizontalScrollBar != null) horizontalScrollBarContainerBlockData.height += this._horizontalScrollBar.coreStyle.computedStyle.getHeight();
		if(this._horizontalScrollBar != null) this.layoutPositionedChild(this._horizontalScrollBar.elementRenderer,horizontalScrollBarContainerBlockData,viewportData);
		var verticalScrollBarContainerBlockData = this.getContainerBlockData();
		if(this._verticalScrollBar != null) verticalScrollBarContainerBlockData.width += this._verticalScrollBar.coreStyle.computedStyle.getWidth();
		if(this._verticalScrollBar != null) this.layoutPositionedChild(this._verticalScrollBar.elementRenderer,verticalScrollBarContainerBlockData,viewportData);
	}
	,doFormat: function() {
		if(this.childrenInline() == true) new cocktail.core.style.formatter.InlineFormattingContext(this).format(new cocktail.core.style.floats.FloatsManager()); else new cocktail.core.style.formatter.BlockFormattingContext(this).format(new cocktail.core.style.floats.FloatsManager());
	}
	,format: function() {
		if(this.establishesNewFormattingContext() == true) {
			if(this.isPositioned() == true && this.isRelativePositioned() == false) this.doFormat(); else if(this.isFloat() == true) this.doFormat(); else if(this.getComputedStyle().display == cocktail.core.style.Display.inlineBlock) this.doFormat(); else if(this.childrenInline() == false) this.doFormat();
		}
	}
	,layout: function(forceLayout) {
		cocktail.core.renderer.FlowBoxRenderer.prototype.layout.call(this,forceLayout);
		if(this.canAlwaysOverflow() == false) this._scrollableBounds = this.getScrollableBounds();
		var isVerticalScrollAttached = this._verticalScrollBar != null;
		var isHorizontalScrollAttached = this._horizontalScrollBar != null;
		this.attachScrollBarsIfnecessary();
		if(isVerticalScrollAttached != (this._verticalScrollBar != null) || isHorizontalScrollAttached != (this._horizontalScrollBar != null)) {
			this._needsLayout = true;
			this._childrenNeedLayout = true;
			cocktail.core.renderer.FlowBoxRenderer.prototype.layout.call(this,forceLayout);
		}
		this.layoutScrollBarsIfNecessary(this.getWindowData());
	}
	,scrollChildren: function(root,scrollX,scrollY) {
		var length = root.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
		}
	}
	,clip: function() {
	}
	,scroll: function(x,y) {
		cocktail.core.renderer.FlowBoxRenderer.prototype.scroll.call(this,x,y);
		if(this._horizontalScrollBar != null || this._verticalScrollBar != null) this.scrollChildren(this,x,y);
	}
	,getBlockContainerChildren: function(rootRenderer,referenceLayer) {
		var ret = new Array();
		var length = rootRenderer.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = rootRenderer.childNodes[i];
			if(child.layerRenderer == referenceLayer && child.isPositioned() == false) {
				if(child.isReplaced() == false && child.get_coreStyle().display != cocktail.core.style.Display.inlineBlock) {
					ret.push(child);
					var childElementRenderer = this.getBlockContainerChildren(child,referenceLayer);
					var childLength = childElementRenderer.length;
					var _g1 = 0;
					while(_g1 < childLength) {
						var j = _g1++;
						ret.push(childElementRenderer[j]);
					}
				}
			}
		}
		return ret;
	}
	,getBlockReplacedChildren: function(rootRenderer,referenceLayer) {
		var ret = new Array();
		var length = rootRenderer.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = rootRenderer.childNodes[i];
			if(child.layerRenderer == referenceLayer && child.isPositioned() == false) {
				if(child.isReplaced() == false && child.get_coreStyle().display == cocktail.core.style.Display.block) {
					var childElementRenderer = this.getBlockReplacedChildren(child,referenceLayer);
					var childLength = childElementRenderer.length;
					var _g1 = 0;
					while(_g1 < childLength) {
						var j = _g1++;
						ret.push(childElementRenderer[j]);
					}
				} else if(child.get_coreStyle().display == cocktail.core.style.Display.block) ret.push(child);
			}
		}
		return ret;
	}
	,getChilrenLineBoxes: function(rootRenderer,referenceLayer) {
		var ret = new Array();
		if(rootRenderer.establishesNewFormattingContext() == true && rootRenderer.childrenInline() == true) {
			var blockBoxRenderer = rootRenderer;
			var length = blockBoxRenderer.lineBoxes.length;
			var _g = 0;
			while(_g < length) {
				var i = _g++;
				var lineBoxes = this.getLineBoxesInLine(blockBoxRenderer.lineBoxes[i]);
				var childLength = lineBoxes.length;
				var _g1 = 0;
				while(_g1 < childLength) {
					var j = _g1++;
					if(lineBoxes[j].get_layerRenderer() == referenceLayer) ret.push(lineBoxes[j]);
				}
			}
		} else {
			var length = rootRenderer.childNodes.length;
			var _g = 0;
			while(_g < length) {
				var i = _g++;
				var child = rootRenderer.childNodes[i];
				if(child.layerRenderer == referenceLayer) {
					if(child.isReplaced() == false) {
						var childLineBoxes = this.getChilrenLineBoxes(child,referenceLayer);
						var childLength = childLineBoxes.length;
						var _g1 = 0;
						while(_g1 < childLength) {
							var j = _g1++;
							ret.push(childLineBoxes[j]);
						}
					}
				}
			}
		}
		return ret;
	}
	,renderScrollBars: function(graphicContext,forceRendering) {
		if(this._horizontalScrollBar != null) this._horizontalScrollBar.elementRenderer.render(graphicContext,forceRendering);
		if(this._verticalScrollBar != null) this._verticalScrollBar.elementRenderer.render(graphicContext,forceRendering);
	}
	,renderBlockContainerChildren: function(graphicContext,forceRendering) {
		var childrenBlockContainer = this.getBlockContainerChildren(this,this.layerRenderer);
		var length = childrenBlockContainer.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			childrenBlockContainer[i].render(graphicContext,forceRendering);
		}
	}
	,renderBlockReplacedChildren: function(graphicContext,forceRendering) {
		var childrenBlockReplaced = this.getBlockReplacedChildren(this,this.layerRenderer);
		var length = childrenBlockReplaced.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			childrenBlockReplaced[i].render(graphicContext,forceRendering);
		}
	}
	,renderLineBoxes: function(graphicContext,forceRendering) {
		var lineBoxes = this.getChilrenLineBoxes(this,this.layerRenderer);
		var length = lineBoxes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			lineBoxes[i].render(graphicContext,forceRendering);
		}
	}
	,hasSignificantChild: function() {
		var length = this.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = this.childNodes[i];
			if(child.isFloat() == false) {
				if(child.isPositioned() == false || child.isRelativePositioned() == true) return true;
			}
		}
		return false;
	}
	,createAnonymousBlock: function(child) {
		var anonymousBlock = new cocktail.core.renderer.AnonymousBlockBoxRenderer();
		anonymousBlock.appendChild(child);
		anonymousBlock.set_coreStyle(anonymousBlock.node.coreStyle);
		return anonymousBlock;
	}
	,makeChildrenNonInline: function() {
		var newChildNodes = new Array();
		var i = this.childNodes.length - 1;
		while(i >= 0) {
			var child = this.childNodes[i];
			if(child.get_firstChild() != null) {
				var fs = child.get_firstChild();
			}
			if(child.isInlineLevel() == true) {
				var anonymousBlock = this.createAnonymousBlock(child);
				newChildNodes.push(anonymousBlock);
			} else newChildNodes.push(child);
			i--;
		}
		newChildNodes.reverse();
		var length = newChildNodes.length;
		var _g = 0;
		while(_g < length) {
			var i1 = _g++;
			this.appendChild(newChildNodes[i1]);
		}
	}
	,renderChildren: function(graphicContext,forceRendering) {
		cocktail.core.renderer.FlowBoxRenderer.prototype.renderChildren.call(this,graphicContext,forceRendering);
		if(this.establishesNewStackingContext() == true) {
			this.layerRenderer.renderNegativeChildElementRenderers(graphicContext,forceRendering);
			this.renderBlockContainerChildren(graphicContext,forceRendering);
			this.renderBlockReplacedChildren(graphicContext,forceRendering);
			this.renderLineBoxes(graphicContext,forceRendering);
			this.clip();
			this.renderScrollBars(graphicContext,forceRendering);
			this.layerRenderer.renderZeroAndAutoChildElementRenderers(graphicContext,forceRendering);
			this.layerRenderer.renderPositiveChildElementRenderers(graphicContext,forceRendering);
		} else if(this.rendersAsIfEstablishingStackingContext() == true) {
			this.renderBlockContainerChildren(graphicContext,forceRendering);
			this.renderBlockReplacedChildren(graphicContext,forceRendering);
			this.renderLineBoxes(graphicContext,forceRendering);
		}
	}
	,appendChild: function(newChild) {
		var shouldMakeChildrenNonInline = false;
		var elementRendererChild = newChild;
		if(this.childNodes.length > 0) {
			if(elementRendererChild.isPositioned() == false || elementRendererChild.isRelativePositioned() == true) {
				if(this.hasSignificantChild() == true) {
					if(elementRendererChild.isInlineLevel() != this.childrenInline()) shouldMakeChildrenNonInline = true;
				}
			}
		}
		cocktail.core.renderer.FlowBoxRenderer.prototype.appendChild.call(this,newChild);
		if(shouldMakeChildrenNonInline == true) {
			if(this._isMakingChildrenNonInline == false) {
				this._isMakingChildrenNonInline = true;
				this.makeChildrenNonInline();
				this._isMakingChildrenNonInline = false;
			}
		}
		return newChild;
	}
	,_isMakingChildrenNonInline: null
	,_isUpdatingScroll: null
	,_scrollTop: null
	,_scrollLeft: null
	,_scrollableBounds: null
	,_verticalScrollBar: null
	,_horizontalScrollBar: null
	,__class__: cocktail.core.renderer.BlockBoxRenderer
});
cocktail.core.renderer.AnonymousBlockBoxRenderer = function() {
	cocktail.core.renderer.BlockBoxRenderer.call(this,cocktail.Lib.get_document().createElement("DIV"));
};
$hxClasses["cocktail.core.renderer.AnonymousBlockBoxRenderer"] = cocktail.core.renderer.AnonymousBlockBoxRenderer;
cocktail.core.renderer.AnonymousBlockBoxRenderer.__name__ = ["cocktail","core","renderer","AnonymousBlockBoxRenderer"];
cocktail.core.renderer.AnonymousBlockBoxRenderer.__super__ = cocktail.core.renderer.BlockBoxRenderer;
cocktail.core.renderer.AnonymousBlockBoxRenderer.prototype = $extend(cocktail.core.renderer.BlockBoxRenderer.prototype,{
	isInlineLevel: function() {
		return false;
	}
	,establishesNewStackingContext: function() {
		return false;
	}
	,isAnonymousBlockBox: function() {
		return true;
	}
	,isPositioned: function() {
		return false;
	}
	,removeChild: function(oldChild) {
		cocktail.core.renderer.BlockBoxRenderer.prototype.removeChild.call(this,oldChild);
		this.parentNode.removeChild(this);
		return oldChild;
	}
	,__class__: cocktail.core.renderer.AnonymousBlockBoxRenderer
});
cocktail.core.renderer.BodyBoxRenderer = function(node) {
	cocktail.core.renderer.BlockBoxRenderer.call(this,node);
};
$hxClasses["cocktail.core.renderer.BodyBoxRenderer"] = cocktail.core.renderer.BodyBoxRenderer;
cocktail.core.renderer.BodyBoxRenderer.__name__ = ["cocktail","core","renderer","BodyBoxRenderer"];
cocktail.core.renderer.BodyBoxRenderer.__super__ = cocktail.core.renderer.BlockBoxRenderer;
cocktail.core.renderer.BodyBoxRenderer.prototype = $extend(cocktail.core.renderer.BlockBoxRenderer.prototype,{
	getBackgroundBounds: function() {
		var windowData = this.getWindowData();
		var width = windowData.width;
		var height = windowData.height;
		var bodyBounds = { x : 0.0, y : 0.0, width : width, height : height};
		return bodyBounds;
	}
	,layoutSelf: function() {
		cocktail.core.renderer.BlockBoxRenderer.prototype.layoutSelf.call(this);
		if(this._coreStyle.height == cocktail.core.style.Dimension.cssAuto && (this.isPositioned() == false || this.isRelativePositioned() == true)) this.getComputedStyle().set_height(this._containingBlock.getContainerBlockData().height - this.getComputedStyle().getMarginTop() - this.getComputedStyle().getMarginBottom() - this.getComputedStyle().getPaddingTop() - this.getComputedStyle().getPaddingBottom());
	}
	,__class__: cocktail.core.renderer.BodyBoxRenderer
});
cocktail.core.renderer.EmbeddedBoxRenderer = function(node) {
	cocktail.core.renderer.BoxRenderer.call(this,node);
};
$hxClasses["cocktail.core.renderer.EmbeddedBoxRenderer"] = cocktail.core.renderer.EmbeddedBoxRenderer;
cocktail.core.renderer.EmbeddedBoxRenderer.__name__ = ["cocktail","core","renderer","EmbeddedBoxRenderer"];
cocktail.core.renderer.EmbeddedBoxRenderer.__super__ = cocktail.core.renderer.BoxRenderer;
cocktail.core.renderer.EmbeddedBoxRenderer.prototype = $extend(cocktail.core.renderer.BoxRenderer.prototype,{
	get_bounds: function() {
		this.bounds.width = this.getComputedStyle().getWidth() + this.getComputedStyle().getPaddingLeft() + this.getComputedStyle().getPaddingRight();
		this.bounds.height = this.getComputedStyle().getHeight() + this.getComputedStyle().getPaddingTop() + this.getComputedStyle().getPaddingBottom();
		return this.bounds;
	}
	,renderEmbeddedAsset: function(graphicContext) {
	}
	,isReplaced: function() {
		return true;
	}
	,renderSelf: function(graphicContext) {
		cocktail.core.renderer.BoxRenderer.prototype.renderSelf.call(this,graphicContext);
		this.renderEmbeddedAsset(graphicContext);
	}
	,__class__: cocktail.core.renderer.EmbeddedBoxRenderer
});
cocktail.core.renderer.ImageRenderer = function(node) {
	cocktail.core.renderer.EmbeddedBoxRenderer.call(this,node);
};
$hxClasses["cocktail.core.renderer.ImageRenderer"] = cocktail.core.renderer.ImageRenderer;
cocktail.core.renderer.ImageRenderer.__name__ = ["cocktail","core","renderer","ImageRenderer"];
cocktail.core.renderer.ImageRenderer.__super__ = cocktail.core.renderer.EmbeddedBoxRenderer;
cocktail.core.renderer.ImageRenderer.prototype = $extend(cocktail.core.renderer.EmbeddedBoxRenderer.prototype,{
	renderEmbeddedAsset: function(graphicContext) {
		var resource = cocktail.core.resource.ResourceManager.getResource(this.node.getAttribute("src"));
		if(resource.loaded == false || resource.loadedWithError == true) return;
	}
	,__class__: cocktail.core.renderer.ImageRenderer
});
cocktail.core.renderer.InitialBlockRenderer = function(node) {
	cocktail.core.renderer.BlockBoxRenderer.call(this,node);
	this.attach();
};
$hxClasses["cocktail.core.renderer.InitialBlockRenderer"] = cocktail.core.renderer.InitialBlockRenderer;
cocktail.core.renderer.InitialBlockRenderer.__name__ = ["cocktail","core","renderer","InitialBlockRenderer"];
cocktail.core.renderer.InitialBlockRenderer.__super__ = cocktail.core.renderer.BlockBoxRenderer;
cocktail.core.renderer.InitialBlockRenderer.prototype = $extend(cocktail.core.renderer.BlockBoxRenderer.prototype,{
	get_globalBounds: function() {
		return this.get_bounds();
	}
	,get_bounds: function() {
		var containerBlockData = this.getContainerBlockData();
		var width = containerBlockData.width;
		var height = containerBlockData.height;
		return { x : 0.0, y : 0.0, width : width, height : height};
	}
	,getContainingBlock: function() {
		return this;
	}
	,getContainerBlockData: function() {
		return this.getWindowData();
	}
	,getWindowData: function() {
		var width = cocktail.Lib.get_window().get_innerWidth();
		var height = cocktail.Lib.get_window().get_innerHeight();
		var windowData = { isHeightAuto : false, isWidthAuto : false, width : width, height : height};
		if(this._verticalScrollBar != null) windowData.width -= this._verticalScrollBar.coreStyle.computedStyle.getWidth();
		if(this._horizontalScrollBar != null) windowData.height -= this._horizontalScrollBar.coreStyle.computedStyle.getHeight();
		return windowData;
	}
	,treatVisibleOverflowAsAuto: function() {
		return true;
	}
	,mustBubbleScrollEvent: function() {
		return true;
	}
	,getScrollbarContainerBlock: function() {
		var width = cocktail.Lib.get_window().get_innerWidth();
		var height = cocktail.Lib.get_window().get_innerHeight();
		var windowData = { isHeightAuto : false, isWidthAuto : false, width : width, height : height};
		return windowData;
	}
	,establishesNewStackingContext: function() {
		return true;
	}
	,establishesNewFormattingContext: function() {
		return true;
	}
	,isPositioned: function() {
		return true;
	}
	,invalidateContainingBlock: function(invalidationReason) {
		this.invalidateDocumentLayoutAndRendering();
	}
	,detachContainingBlock: function() {
	}
	,attachContaininingBlock: function() {
	}
	,detachLayer: function() {
		this.layerRenderer = null;
	}
	,attachLayer: function() {
		this.layerRenderer = new cocktail.core.layer.LayerRenderer(this);
	}
	,__class__: cocktail.core.renderer.InitialBlockRenderer
});
cocktail.core.renderer.InlineBoxRenderer = function(node) {
	cocktail.core.renderer.FlowBoxRenderer.call(this,node);
};
$hxClasses["cocktail.core.renderer.InlineBoxRenderer"] = cocktail.core.renderer.InlineBoxRenderer;
cocktail.core.renderer.InlineBoxRenderer.__name__ = ["cocktail","core","renderer","InlineBoxRenderer"];
cocktail.core.renderer.InlineBoxRenderer.__super__ = cocktail.core.renderer.FlowBoxRenderer;
cocktail.core.renderer.InlineBoxRenderer.prototype = $extend(cocktail.core.renderer.FlowBoxRenderer.prototype,{
	get_bounds: function() {
		var lineBoxesBounds = new Array();
		var length = this.lineBoxes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			lineBoxesBounds.push(this.lineBoxes[i].get_bounds());
		}
		return this.getChildrenBounds(lineBoxesBounds);
	}
	,renderChildLineBoxes: function(graphicContext,forceRendering) {
		var length = this.lineBoxes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var childLineBoxes = this.getLineBoxesInLine(this.lineBoxes[i]);
			var childLength = childLineBoxes.length;
			var _g1 = 0;
			while(_g1 < childLength) {
				var j = _g1++;
				if(childLineBoxes[j].get_layerRenderer() == this.layerRenderer) childLineBoxes[j].render(graphicContext,forceRendering);
			}
		}
	}
	,renderChildren: function(graphicContext,forceRendering) {
		cocktail.core.renderer.FlowBoxRenderer.prototype.renderChildren.call(this,graphicContext,forceRendering);
		if(this.establishesNewStackingContext() == true) this.layerRenderer.renderNegativeChildElementRenderers(graphicContext,forceRendering);
		this.renderChildLineBoxes(graphicContext,forceRendering);
		if(this.establishesNewStackingContext() == true) {
			this.layerRenderer.renderZeroAndAutoChildElementRenderers(graphicContext,forceRendering);
			this.layerRenderer.renderPositiveChildElementRenderers(graphicContext,forceRendering);
		}
	}
	,renderBackground: function(graphicContext) {
	}
	,__class__: cocktail.core.renderer.InlineBoxRenderer
});
cocktail.core.renderer.ObjectRenderer = function(node) {
	cocktail.core.renderer.EmbeddedBoxRenderer.call(this,node);
};
$hxClasses["cocktail.core.renderer.ObjectRenderer"] = cocktail.core.renderer.ObjectRenderer;
cocktail.core.renderer.ObjectRenderer.__name__ = ["cocktail","core","renderer","ObjectRenderer"];
cocktail.core.renderer.ObjectRenderer.__super__ = cocktail.core.renderer.EmbeddedBoxRenderer;
cocktail.core.renderer.ObjectRenderer.prototype = $extend(cocktail.core.renderer.EmbeddedBoxRenderer.prototype,{
	getAssetBounds: function(availableWidth,availableHeight,assetWidth,assetHeight) {
		var width;
		var height;
		if(availableWidth > availableHeight) {
			var ratio = assetHeight / availableHeight;
			if(assetWidth / ratio < availableWidth) {
				width = assetWidth / ratio;
				height = availableHeight;
			} else {
				ratio = assetWidth / availableWidth;
				width = availableWidth;
				height = assetHeight / ratio;
			}
		} else {
			var ratio = assetWidth / availableWidth;
			if(assetHeight / ratio < availableHeight) {
				height = assetHeight / ratio;
				width = availableWidth;
			} else {
				ratio = assetHeight / availableHeight;
				width = assetWidth / ratio;
				height = availableHeight;
			}
		}
		var xOffset = (availableWidth - width) / 2;
		var yOffset = (availableHeight - height) / 2;
		return { width : width, height : height, x : xOffset, y : yOffset};
	}
	,getScaleMode: function() {
		var scaleMode = "showall";
		var _g1 = 0, _g = this.node.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			var child = this.node.childNodes[i];
			if(child.tagName == "PARAM") {
				if(child.getAttribute("name") != null) {
					if(child.getAttribute("name") == "scale") {
						if(child.getAttribute("value") != null) scaleMode = child.getAttribute("value");
					}
				}
			}
		}
		return scaleMode;
	}
	,renderEmbeddedAsset: function(graphicContext) {
	}
	,__class__: cocktail.core.renderer.ObjectRenderer
});
cocktail.core.renderer.TextToken = $hxClasses["cocktail.core.renderer.TextToken"] = { __ename__ : ["cocktail","core","renderer","TextToken"], __constructs__ : ["word","space","tab","lineFeed"] }
cocktail.core.renderer.TextToken.word = function(value) { var $x = ["word",0,value]; $x.__enum__ = cocktail.core.renderer.TextToken; $x.toString = $estr; return $x; }
cocktail.core.renderer.TextToken.space = ["space",1];
cocktail.core.renderer.TextToken.space.toString = $estr;
cocktail.core.renderer.TextToken.space.__enum__ = cocktail.core.renderer.TextToken;
cocktail.core.renderer.TextToken.tab = ["tab",2];
cocktail.core.renderer.TextToken.tab.toString = $estr;
cocktail.core.renderer.TextToken.tab.__enum__ = cocktail.core.renderer.TextToken;
cocktail.core.renderer.TextToken.lineFeed = ["lineFeed",3];
cocktail.core.renderer.TextToken.lineFeed.toString = $estr;
cocktail.core.renderer.TextToken.lineFeed.__enum__ = cocktail.core.renderer.TextToken;
cocktail.core.renderer.InvalidationReason = $hxClasses["cocktail.core.renderer.InvalidationReason"] = { __ename__ : ["cocktail","core","renderer","InvalidationReason"], __constructs__ : ["styleChanged","childStyleChanged","positionedChildStyleChanged","needsImmediateLayout","backgroundImageLoaded","windowResize","other"] }
cocktail.core.renderer.InvalidationReason.styleChanged = function(styleName) { var $x = ["styleChanged",0,styleName]; $x.__enum__ = cocktail.core.renderer.InvalidationReason; $x.toString = $estr; return $x; }
cocktail.core.renderer.InvalidationReason.childStyleChanged = function(styleName) { var $x = ["childStyleChanged",1,styleName]; $x.__enum__ = cocktail.core.renderer.InvalidationReason; $x.toString = $estr; return $x; }
cocktail.core.renderer.InvalidationReason.positionedChildStyleChanged = function(styleName) { var $x = ["positionedChildStyleChanged",2,styleName]; $x.__enum__ = cocktail.core.renderer.InvalidationReason; $x.toString = $estr; return $x; }
cocktail.core.renderer.InvalidationReason.needsImmediateLayout = ["needsImmediateLayout",3];
cocktail.core.renderer.InvalidationReason.needsImmediateLayout.toString = $estr;
cocktail.core.renderer.InvalidationReason.needsImmediateLayout.__enum__ = cocktail.core.renderer.InvalidationReason;
cocktail.core.renderer.InvalidationReason.backgroundImageLoaded = ["backgroundImageLoaded",4];
cocktail.core.renderer.InvalidationReason.backgroundImageLoaded.toString = $estr;
cocktail.core.renderer.InvalidationReason.backgroundImageLoaded.__enum__ = cocktail.core.renderer.InvalidationReason;
cocktail.core.renderer.InvalidationReason.windowResize = ["windowResize",5];
cocktail.core.renderer.InvalidationReason.windowResize.toString = $estr;
cocktail.core.renderer.InvalidationReason.windowResize.__enum__ = cocktail.core.renderer.InvalidationReason;
cocktail.core.renderer.InvalidationReason.other = ["other",6];
cocktail.core.renderer.InvalidationReason.other.toString = $estr;
cocktail.core.renderer.InvalidationReason.other.__enum__ = cocktail.core.renderer.InvalidationReason;
cocktail.core.renderer.ScrollBarRenderer = function(node) {
	cocktail.core.renderer.BlockBoxRenderer.call(this,node);
};
$hxClasses["cocktail.core.renderer.ScrollBarRenderer"] = cocktail.core.renderer.ScrollBarRenderer;
cocktail.core.renderer.ScrollBarRenderer.__name__ = ["cocktail","core","renderer","ScrollBarRenderer"];
cocktail.core.renderer.ScrollBarRenderer.__super__ = cocktail.core.renderer.BlockBoxRenderer;
cocktail.core.renderer.ScrollBarRenderer.prototype = $extend(cocktail.core.renderer.BlockBoxRenderer.prototype,{
	getContainingBlock: function() {
		return this.getFirstBlockContainer();
	}
	,isAutoZIndexPositioned: function() {
		return false;
	}
	,scroll: function(x,y) {
	}
	,establishesNewStackingContext: function() {
		return true;
	}
	,isInlineLevel: function() {
		return false;
	}
	,isScrollBar: function() {
		return true;
	}
	,__class__: cocktail.core.renderer.ScrollBarRenderer
});
cocktail.core.renderer.TextInputRenderer = function(node) {
	cocktail.core.renderer.EmbeddedBoxRenderer.call(this,node);
	node.addEventListener("focus",$bind(this,this.onTextInputFocus));
};
$hxClasses["cocktail.core.renderer.TextInputRenderer"] = cocktail.core.renderer.TextInputRenderer;
cocktail.core.renderer.TextInputRenderer.__name__ = ["cocktail","core","renderer","TextInputRenderer"];
cocktail.core.renderer.TextInputRenderer.__super__ = cocktail.core.renderer.EmbeddedBoxRenderer;
cocktail.core.renderer.TextInputRenderer.prototype = $extend(cocktail.core.renderer.EmbeddedBoxRenderer.prototype,{
	set_value: function(value) {
		return null;
	}
	,get_value: function() {
		return null;
	}
	,getNativeFontFamily: function(value) {
		var fontFamily = "";
		var _g1 = 0, _g = value.length;
		while(_g1 < _g) {
			var i = _g1++;
			var fontName = value[i];
			switch(fontName) {
			case "serif":
				fontName = "_serif";
				break;
			case "sans":
				fontName = "_sans";
				break;
			case "typewriter":
				fontName = "_typewriter";
				break;
			}
			fontFamily += fontName;
			if(i < value.length - 1) fontFamily += ",";
		}
		return fontFamily;
	}
	,updateNativeTextField: function() {
	}
	,onTextInputFocus: function(e) {
	}
	,renderEmbeddedAsset: function(graphicContext) {
		this.updateNativeTextField();
	}
	,value: null
	,__class__: cocktail.core.renderer.TextInputRenderer
	,__properties__: $extend(cocktail.core.renderer.EmbeddedBoxRenderer.prototype.__properties__,{set_value:"set_value",get_value:"get_value"})
});
cocktail.core.renderer.TextRenderer = function(node) {
	cocktail.core.renderer.ElementRenderer.call(this,node);
	this._text = node;
	this._textNeedsRendering = true;
};
$hxClasses["cocktail.core.renderer.TextRenderer"] = cocktail.core.renderer.TextRenderer;
cocktail.core.renderer.TextRenderer.__name__ = ["cocktail","core","renderer","TextRenderer"];
cocktail.core.renderer.TextRenderer.__super__ = cocktail.core.renderer.ElementRenderer;
cocktail.core.renderer.TextRenderer.prototype = $extend(cocktail.core.renderer.ElementRenderer.prototype,{
	get_bounds: function() {
		var textLineBoxesBounds = new Array();
		var length = this.lineBoxes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			textLineBoxesBounds.push(this.lineBoxes[i].get_bounds());
		}
		return this.getChildrenBounds(textLineBoxesBounds);
	}
	,isInlineLevel: function() {
		return true;
	}
	,isText: function() {
		return true;
	}
	,isPositioned: function() {
		return false;
	}
	,isFloat: function() {
		return false;
	}
	,createTextLineBoxFromTextToken: function(textToken,fontMetrics,fontManager) {
		var text;
		var textLineBox;
		var $e = (textToken);
		switch( $e[1] ) {
		case 0:
			var value = $e[2];
			text = value;
			textLineBox = new cocktail.core.linebox.TextLineBox(this,text,fontMetrics,fontManager);
			break;
		case 1:
			textLineBox = new cocktail.core.linebox.SpaceLineBox(this,fontMetrics,fontManager);
			break;
		case 2:
			textLineBox = new cocktail.core.linebox.TextLineBox(this,"",fontMetrics,fontManager);
			break;
		case 3:
			textLineBox = new cocktail.core.linebox.TextLineBox(this,"",fontMetrics,fontManager);
			break;
		}
		return textLineBox;
	}
	,createTextLines: function() {
		var processedText = this._text.get_nodeValue();
		processedText = this.applyWhiteSpace(processedText,this.getComputedStyle().whiteSpace);
		processedText = this.applyTextTransform(processedText,this.getComputedStyle().textTransform);
		this._textTokens = this.doGetTextTokens(processedText);
		this.lineBoxes = [];
		var fontMetrics = this._coreStyle.get_fontMetricsData();
		var fontManager = cocktail.core.font.FontManager.getInstance();
		var length = this._textTokens.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			this.lineBoxes.push(this.createTextLineBoxFromTextToken(this._textTokens[i],fontMetrics,fontManager));
		}
	}
	,capitalizeText: function(text) {
		var capitalizedText = "";
		var _g1 = 0, _g = text.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(i == 0) capitalizedText += text.charAt(i).toUpperCase(); else capitalizedText += text.charAt(i);
		}
		return capitalizedText;
	}
	,applyTextTransform: function(text,textTransform) {
		switch( (textTransform)[1] ) {
		case 1:
			text = text.toUpperCase();
			break;
		case 2:
			text = text.toLowerCase();
			break;
		case 0:
			text = this.capitalizeText(text);
			break;
		case 3:
			break;
		}
		return text;
	}
	,applyWhiteSpace: function(text,whiteSpace) {
		switch( (whiteSpace)[1] ) {
		case 0:
		case 2:
			var er1 = new EReg("[ \t]+","");
			var er2 = new EReg("\r+","g");
			var er3 = new EReg("\n+","g");
			var er4 = new EReg("\\s+","g");
			text = er4.replace(er3.replace(er2.replace(er1.replace(text," ")," ")," ")," ");
			break;
		case 4:
			var er1 = new EReg(" *$^ *","m");
			var er2 = new EReg("[ \t]+","");
			text = er2.replace(er1.replace(text,"\n")," ");
			break;
		default:
		}
		return text;
	}
	,doGetTextTokens: function(text) {
		var textTokens = new Array();
		var textToken = null;
		var lastCharacterIsSpace = false;
		var i = 0;
		while(i < text.length) {
			if(text.charAt(i) == "\\") {
				if(i < text.length - 1) {
					if(text.charAt(i + 1) == "n") {
						if(textToken != null) {
							textTokens.push(cocktail.core.renderer.TextToken.word(textToken));
							textToken = null;
						}
						textTokens.push(cocktail.core.renderer.TextToken.lineFeed);
						i++;
					} else if(text.charAt(i + 1) == "t") {
						if(textToken != null) {
							textTokens.push(cocktail.core.renderer.TextToken.word(textToken));
							textToken = null;
						}
						textTokens.push(cocktail.core.renderer.TextToken.tab);
						i++;
					}
				}
			} else if(StringTools.isSpace(text,i) == true) {
				if(textToken != null) {
					textTokens.push(cocktail.core.renderer.TextToken.word(textToken));
					textToken = null;
				}
				textTokens.push(cocktail.core.renderer.TextToken.space);
				lastCharacterIsSpace = true;
			} else {
				lastCharacterIsSpace = false;
				if(textToken == null) textToken = "";
				textToken += text.charAt(i);
			}
			i++;
		}
		if(textToken != null) textTokens.push(cocktail.core.renderer.TextToken.word(textToken));
		return textTokens;
	}
	,invalidateText: function() {
		this._textNeedsRendering = true;
	}
	,layout: function(forceLayout) {
		if(this._textNeedsRendering == true) {
			this.createTextLines();
			this._textNeedsRendering = false;
		}
	}
	,_textNeedsRendering: null
	,_text: null
	,_textTokens: null
	,__class__: cocktail.core.renderer.TextRenderer
});
cocktail.core.renderer.VideoRenderer = function(node) {
	cocktail.core.renderer.EmbeddedBoxRenderer.call(this,node);
};
$hxClasses["cocktail.core.renderer.VideoRenderer"] = cocktail.core.renderer.VideoRenderer;
cocktail.core.renderer.VideoRenderer.__name__ = ["cocktail","core","renderer","VideoRenderer"];
cocktail.core.renderer.VideoRenderer.__super__ = cocktail.core.renderer.EmbeddedBoxRenderer;
cocktail.core.renderer.VideoRenderer.prototype = $extend(cocktail.core.renderer.EmbeddedBoxRenderer.prototype,{
	getAssetBounds: function(availableWidth,availableHeight,assetWidth,assetHeight) {
		var width;
		var height;
		if(availableWidth > availableHeight) {
			var ratio = assetHeight / availableHeight;
			if(assetWidth / ratio < availableWidth) {
				width = assetWidth / ratio;
				height = availableHeight;
			} else {
				ratio = assetWidth / availableWidth;
				width = availableWidth;
				height = assetHeight / ratio;
			}
		} else {
			var ratio = assetWidth / availableWidth;
			if(assetHeight / ratio < availableHeight) {
				height = assetHeight / ratio;
				width = availableWidth;
			} else {
				ratio = assetHeight / availableHeight;
				width = assetWidth / ratio;
				height = availableHeight;
			}
		}
		var xOffset = (availableWidth - width) / 2;
		var yOffset = (availableHeight - height) / 2;
		return { width : width, height : height, x : xOffset, y : yOffset};
	}
	,renderPosterFrame: function(htmlVideoElement,graphicContext) {
		var resource = cocktail.core.resource.ResourceManager.getResource(this.node.getAttribute("poster"));
		if(resource.loaded == false || resource.loadedWithError == true) return;
		var posterBounds = this.getAssetBounds(this._coreStyle.computedStyle.getWidth(),this._coreStyle.computedStyle.getHeight(),resource.intrinsicWidth,resource.intrinsicHeight);
	}
	,renderVideo: function(htmlVideoElement,graphicContext) {
		var videoBounds = this.getAssetBounds(this._coreStyle.computedStyle.getWidth(),this._coreStyle.computedStyle.getHeight(),htmlVideoElement.get_videoWidth(),htmlVideoElement.get_videoHeight());
	}
	,renderEmbeddedAsset: function(graphicContext) {
		var htmlVideoElement = this.node;
		if(htmlVideoElement.shouldRenderPosterFrame() == true) this.renderPosterFrame(htmlVideoElement,graphicContext); else this.renderVideo(htmlVideoElement,graphicContext);
	}
	,__class__: cocktail.core.renderer.VideoRenderer
});
cocktail.core.resource = {}
cocktail.core.resource.ResourceLoader = function() {
};
$hxClasses["cocktail.core.resource.ResourceLoader"] = cocktail.core.resource.ResourceLoader;
cocktail.core.resource.ResourceLoader.__name__ = ["cocktail","core","resource","ResourceLoader"];
cocktail.core.resource.ResourceLoader.prototype = {
	onLoadError: function(msg) {
		this._urlToLoadIdx++;
		if(this._urlToLoadIdx < this._urls.length - 1) this.doLoad(this._urls[this._urlToLoadIdx]); else this._onLoadErrorCallback(msg);
	}
	,onLoadComplete: function(data) {
		this._onLoadCompleteCallback(data);
	}
	,doLoad: function(url) {
	}
	,load: function(urls,onLoadComplete,onLoadError) {
		this._onLoadCompleteCallback = onLoadComplete;
		this._onLoadErrorCallback = onLoadError;
		this._urls = urls;
		this._urlToLoadIdx = 0;
		this.doLoad(this._urls[this._urlToLoadIdx]);
	}
	,_urls: null
	,_urlToLoadIdx: null
	,_onLoadErrorCallback: null
	,_onLoadCompleteCallback: null
	,__class__: cocktail.core.resource.ResourceLoader
}
cocktail.core.resource.AbstractMediaLoader = function() {
	cocktail.core.resource.ResourceLoader.call(this);
};
$hxClasses["cocktail.core.resource.AbstractMediaLoader"] = cocktail.core.resource.AbstractMediaLoader;
cocktail.core.resource.AbstractMediaLoader.__name__ = ["cocktail","core","resource","AbstractMediaLoader"];
cocktail.core.resource.AbstractMediaLoader.__super__ = cocktail.core.resource.ResourceLoader;
cocktail.core.resource.AbstractMediaLoader.prototype = $extend(cocktail.core.resource.ResourceLoader.prototype,{
	getIntrinsicRatio: function() {
		return this._intrinsicRatio;
	}
	,getIntrinsicHeight: function() {
		return this._intrinsicHeight;
	}
	,getIntrinsicWidth: function() {
		return this._intrinsicWidth;
	}
	,getNativeElement: function() {
		return this._nativeElement;
	}
	,intrinsicRatio: null
	,_intrinsicRatio: null
	,intrinsicHeight: null
	,_intrinsicHeight: null
	,intrinsicWidth: null
	,_intrinsicWidth: null
	,nativeElement: null
	,_nativeElement: null
	,__class__: cocktail.core.resource.AbstractMediaLoader
	,__properties__: {get_nativeElement:"getNativeElement",get_intrinsicWidth:"getIntrinsicWidth",get_intrinsicHeight:"getIntrinsicHeight",get_intrinsicRatio:"getIntrinsicRatio"}
});
cocktail.core.resource.AbstractResource = function(url) {
	cocktail.core.event.EventTarget.call(this);
	this.loaded = false;
	this.loadedWithError = false;
	this.load(url);
};
$hxClasses["cocktail.core.resource.AbstractResource"] = cocktail.core.resource.AbstractResource;
cocktail.core.resource.AbstractResource.__name__ = ["cocktail","core","resource","AbstractResource"];
cocktail.core.resource.AbstractResource.__super__ = cocktail.core.event.EventTarget;
cocktail.core.resource.AbstractResource.prototype = $extend(cocktail.core.event.EventTarget.prototype,{
	onLoadError: function() {
		this.loadedWithError = true;
		var errorEvent = new cocktail.core.event.UIEvent();
		errorEvent.initUIEvent("error",false,false,null,0.0);
		this.dispatchEvent(errorEvent);
	}
	,onLoadComplete: function() {
		this.loaded = true;
		var loadEvent = new cocktail.core.event.UIEvent();
		loadEvent.initUIEvent("load",false,false,null,0.0);
		this.dispatchEvent(loadEvent);
	}
	,load: function(url) {
	}
	,intrinsicRatio: null
	,intrinsicHeight: null
	,intrinsicWidth: null
	,nativeResource: null
	,loadedWithError: null
	,loaded: null
	,__class__: cocktail.core.resource.AbstractResource
});
cocktail.port.server.MediaLoader = function() {
	cocktail.core.resource.AbstractMediaLoader.call(this);
};
$hxClasses["cocktail.port.server.MediaLoader"] = cocktail.port.server.MediaLoader;
cocktail.port.server.MediaLoader.__name__ = ["cocktail","port","server","MediaLoader"];
cocktail.port.server.MediaLoader.__super__ = cocktail.core.resource.AbstractMediaLoader;
cocktail.port.server.MediaLoader.prototype = $extend(cocktail.core.resource.AbstractMediaLoader.prototype,{
	__class__: cocktail.port.server.MediaLoader
});
cocktail.core.resource.ImageLoader = function() {
	cocktail.port.server.MediaLoader.call(this);
};
$hxClasses["cocktail.core.resource.ImageLoader"] = cocktail.core.resource.ImageLoader;
cocktail.core.resource.ImageLoader.__name__ = ["cocktail","core","resource","ImageLoader"];
cocktail.core.resource.ImageLoader.__super__ = cocktail.port.server.MediaLoader;
cocktail.core.resource.ImageLoader.prototype = $extend(cocktail.port.server.MediaLoader.prototype,{
	__class__: cocktail.core.resource.ImageLoader
});
cocktail.core.resource.ResourceManager = function() {
};
$hxClasses["cocktail.core.resource.ResourceManager"] = cocktail.core.resource.ResourceManager;
cocktail.core.resource.ResourceManager.__name__ = ["cocktail","core","resource","ResourceManager"];
cocktail.core.resource.ResourceManager._resources = null;
cocktail.core.resource.ResourceManager.getResource = function(url) {
	if(cocktail.core.resource.ResourceManager._resources == null) cocktail.core.resource.ResourceManager._resources = new Hash();
	if(cocktail.core.resource.ResourceManager._resources.exists(url) == false) {
		var resource = new cocktail.port.server.Resource(url);
		cocktail.core.resource.ResourceManager._resources.set(url,resource);
	}
	return cocktail.core.resource.ResourceManager._resources.get(url);
}
cocktail.core.resource.ResourceManager.prototype = {
	__class__: cocktail.core.resource.ResourceManager
}
cocktail.core.resource.XMLHTTPRequest = function() {
	cocktail.core.event.EventTarget.call(this);
	this._http = new haxe.Http("");
	this._http.onData = $bind(this,this.onHTTPData);
	this._http.onStatus = $bind(this,this.onHTTPStatus);
	this._http.onError = $bind(this,this.onHTTPError);
	this.setReadyState(0);
};
$hxClasses["cocktail.core.resource.XMLHTTPRequest"] = cocktail.core.resource.XMLHTTPRequest;
cocktail.core.resource.XMLHTTPRequest.__name__ = ["cocktail","core","resource","XMLHTTPRequest"];
cocktail.core.resource.XMLHTTPRequest.__super__ = cocktail.core.event.EventTarget;
cocktail.core.resource.XMLHTTPRequest.prototype = $extend(cocktail.core.event.EventTarget.prototype,{
	get_responseText: function() {
		return this._responseText;
	}
	,get_status: function() {
		return this._status;
	}
	,get_readyState: function() {
		return this._readyState;
	}
	,setReadyState: function(value) {
		this._readyState = value;
		if(this.onReadyStateChange != null) {
			var readyStateChangeEvent = new cocktail.core.event.Event();
			readyStateChangeEvent.initEvent("readystatechange",false,false);
			this.onReadyStateChange(readyStateChangeEvent);
		}
	}
	,onHTTPError: function(data) {
		this._responseText = data;
		this.setReadyState(4);
	}
	,onHTTPData: function(data) {
		this._responseText = data;
		this.setReadyState(4);
	}
	,onHTTPStatus: function(status) {
		this._status = status;
	}
	,setRequestHeader: function(name,value) {
		this._http.setHeader(name,value);
	}
	,send: function(content) {
		var post = false;
		switch(this._method.toUpperCase()) {
		case "POST":
			post = true;
			break;
		}
		this._http.request(post);
		this.setReadyState(3);
	}
	,open: function(method,url) {
		this._http.url = url;
		this._method = method;
		this.setReadyState(1);
	}
	,_method: null
	,_http: null
	,onReadyStateChange: null
	,status: null
	,_status: null
	,responseText: null
	,_responseText: null
	,readyState: null
	,_readyState: null
	,__class__: cocktail.core.resource.XMLHTTPRequest
	,__properties__: {get_readyState:"get_readyState",get_responseText:"get_responseText",get_status:"get_status"}
});
cocktail.core.style = {}
cocktail.core.style.CSSConstants = function() {
};
$hxClasses["cocktail.core.style.CSSConstants"] = cocktail.core.style.CSSConstants;
cocktail.core.style.CSSConstants.__name__ = ["cocktail","core","style","CSSConstants"];
cocktail.core.style.CSSConstants.prototype = {
	__class__: cocktail.core.style.CSSConstants
}
cocktail.core.style.ComputedStyle = function(coreStyle) {
	this._coreStyle = coreStyle;
};
$hxClasses["cocktail.core.style.ComputedStyle"] = cocktail.core.style.ComputedStyle;
cocktail.core.style.ComputedStyle.__name__ = ["cocktail","core","style","ComputedStyle"];
cocktail.core.style.ComputedStyle.prototype = {
	getTextIndent: function() {
		return this.getTransitionablePropertyValue("text-indent",this.textIndent);
	}
	,getLineHeight: function() {
		return this.getTransitionablePropertyValue("line-height",this.lineHeight);
	}
	,getWordSpacing: function() {
		return this.getTransitionablePropertyValue("word-spacing",this.wordSpacing);
	}
	,getLetterSpacing: function() {
		return this.getTransitionablePropertyValue("letter-spacing",this.letterSpacing);
	}
	,getFontSize: function() {
		return this.getTransitionablePropertyValue("font-size",this.fontSize);
	}
	,getRight: function() {
		return this.getTransitionablePropertyValue("right",this.right);
	}
	,getBottom: function() {
		return this.getTransitionablePropertyValue("bottom",this.bottom);
	}
	,getLeft: function() {
		return this.getTransitionablePropertyValue("left",this.left);
	}
	,getTop: function() {
		return this.getTransitionablePropertyValue("top",this.top);
	}
	,getMaxWidth: function() {
		return this.getTransitionablePropertyValue("max-width",this.maxWidth);
	}
	,getMinWidth: function() {
		return this.getTransitionablePropertyValue("min-width",this.minWidth);
	}
	,getMaxHeight: function() {
		return this.getTransitionablePropertyValue("max-height",this.maxHeight);
	}
	,getMinHeight: function() {
		return this.getTransitionablePropertyValue("min-height",this.minHeight);
	}
	,getHeight: function() {
		return this.getTransitionablePropertyValue("height",this.height);
	}
	,getWidth: function() {
		return this.getTransitionablePropertyValue("width",this.width);
	}
	,getPaddingBottom: function() {
		return this.getTransitionablePropertyValue("padding-bottom",this.paddingBottom);
	}
	,getPaddingTop: function() {
		return this.getTransitionablePropertyValue("padding-top",this.paddingTop);
	}
	,getPaddingRight: function() {
		return this.getTransitionablePropertyValue("padding-right",this.paddingRight);
	}
	,getPaddingLeft: function() {
		return this.getTransitionablePropertyValue("padding-left",this.paddingLeft);
	}
	,getMarginBottom: function() {
		return this.getTransitionablePropertyValue("margin-bottom",this.marginBottom);
	}
	,getMarginTop: function() {
		return this.getTransitionablePropertyValue("margin-top",this.marginTop);
	}
	,getMarginRight: function() {
		return this.getTransitionablePropertyValue("margin-right",this.marginRight);
	}
	,getMarginLeft: function() {
		return this.getTransitionablePropertyValue("margin-left",this.marginLeft);
	}
	,getOpacity: function() {
		return this.getTransitionablePropertyValue("opacity",this.opacity);
	}
	,set_opacity: function(value) {
		return this.opacity = value;
	}
	,set_textIndent: function(value) {
		return this.textIndent = value;
	}
	,set_wordSpacing: function(value) {
		return this.wordSpacing = value;
	}
	,set_letterSpacing: function(value) {
		return this.letterSpacing = value;
	}
	,set_lineHeight: function(value) {
		return this.lineHeight = value;
	}
	,set_fontSize: function(value) {
		return this.fontSize = value;
	}
	,set_right: function(value) {
		return this.right = value;
	}
	,set_left: function(value) {
		return this.left = value;
	}
	,set_bottom: function(value) {
		return this.bottom = value;
	}
	,set_top: function(value) {
		return this.top = value;
	}
	,set_maxWidth: function(value) {
		return this.maxWidth = value;
	}
	,set_maxHeight: function(value) {
		return this.maxHeight = value;
	}
	,set_minWidth: function(value) {
		return this.minWidth = value;
	}
	,set_minHeight: function(value) {
		return this.minHeight = value;
	}
	,set_paddingRight: function(value) {
		return this.paddingRight = value;
	}
	,set_paddingLeft: function(value) {
		return this.paddingLeft = value;
	}
	,set_paddingBottom: function(value) {
		return this.paddingBottom = value;
	}
	,set_paddingTop: function(value) {
		return this.paddingTop = value;
	}
	,set_marginRight: function(value) {
		return this.marginRight = value;
	}
	,set_marginBottom: function(value) {
		return this.marginBottom = value;
	}
	,set_marginTop: function(value) {
		return this.marginTop = value;
	}
	,set_marginLeft: function(value) {
		return this.marginLeft = value;
	}
	,set_height: function(value) {
		return this.height = value;
	}
	,set_width: function(value) {
		return this.width = value;
	}
	,getTransitionablePropertyValue: function(propertyName,propertyValue) {
		var transition = cocktail.core.style.transition.TransitionManager.getInstance().getTransition(propertyName,this);
		if(transition != null) return transition.get_currentValue(); else return propertyValue;
	}
	,init: function() {
		this.set_minHeight(0.0);
		this.set_maxHeight(0.0);
		this.set_minWidth(0.0);
		this.set_maxWidth(0.0);
		this.set_width(0.0);
		this.set_height(0.0);
		this.set_marginLeft(0.0);
		this.set_marginRight(0.0);
		this.set_marginTop(0.0);
		this.set_marginBottom(0.0);
		this.set_paddingLeft(0.0);
		this.set_paddingRight(0.0);
		this.set_paddingTop(0.0);
		this.set_paddingBottom(0.0);
		this.set_left(0.0);
		this.set_right(0.0);
		this.set_top(0.0);
		this.set_bottom(0.0);
		this.clear = cocktail.core.style.Clear.none;
		this.cssFloat = cocktail.core.style.CSSFloat.none;
		this.display = cocktail.core.style.Display.cssInline;
		this.position = cocktail.core.style.Position.cssStatic;
		this.verticalAlign = 0.0;
		this.set_fontSize(16.0);
		this.set_lineHeight(14.0);
		this.fontWeight = cocktail.core.style.FontWeight.normal;
		this.fontStyle = cocktail.core.style.FontStyle.normal;
		this.fontFamily = ["serif"];
		this.fontVariant = cocktail.core.style.FontVariant.normal;
		this.textTransform = cocktail.core.style.TextTransform.none;
		this.set_letterSpacing(0);
		this.set_wordSpacing(0);
		this.set_textIndent(0);
		this.whiteSpace = cocktail.core.style.WhiteSpace.normal;
		this.textAlign = cocktail.core.style.TextAlign.left;
		this.color = { color : 0, alpha : 1.0};
		this.visibility = cocktail.core.style.Visibility.visible;
		this.zIndex = cocktail.core.style.ZIndex.cssAuto;
		this.set_opacity(1.0);
		this.overflowX = cocktail.core.style.Overflow.visible;
		this.overflowY = cocktail.core.style.Overflow.visible;
		this.transformOrigin = { x : 0.0, y : 0.0};
		this.transform = new cocktail.core.geom.Matrix();
		this.backgroundColor = { color : 0, alpha : 1.0};
		this.backgroundSize = [];
		this.backgroundOrigin = [];
		this.backgroundImage = [];
		this.backgroundClip = [];
		this.backgroundPosition = [];
		this.backgroundRepeat = [];
		this.cursor = cocktail.core.style.Cursor.cssDefault;
		this.transitionDelay = [0.0];
		this.transitionDuration = [0.0];
		this.transitionProperty = cocktail.core.style.TransitionProperty.all;
		this.transitionTimingFunction = [cocktail.core.style.TransitionTimingFunctionValue.ease];
	}
	,_coreStyle: null
	,transitionTimingFunction: null
	,transitionDelay: null
	,transitionDuration: null
	,transitionProperty: null
	,cursor: null
	,overflowY: null
	,overflowX: null
	,visibility: null
	,opacity: null
	,verticalAlign: null
	,textIndent: null
	,textAlign: null
	,whiteSpace: null
	,wordSpacing: null
	,letterSpacing: null
	,textTransform: null
	,lineHeight: null
	,color: null
	,fontVariant: null
	,fontFamily: null
	,fontStyle: null
	,fontWeight: null
	,fontSize: null
	,backgroundClip: null
	,backgroundPosition: null
	,backgroundSize: null
	,backgroundOrigin: null
	,backgroundRepeat: null
	,backgroundImage: null
	,backgroundColor: null
	,right: null
	,bottom: null
	,left: null
	,top: null
	,maxWidth: null
	,minWidth: null
	,maxHeight: null
	,minHeight: null
	,height: null
	,width: null
	,paddingBottom: null
	,paddingTop: null
	,paddingRight: null
	,paddingLeft: null
	,marginBottom: null
	,marginTop: null
	,marginRight: null
	,marginLeft: null
	,transform: null
	,transformOrigin: null
	,zIndex: null
	,clear: null
	,cssFloat: null
	,position: null
	,display: null
	,__class__: cocktail.core.style.ComputedStyle
	,__properties__: {set_marginLeft:"set_marginLeft",get_marginLeft:"getMarginLeft",set_marginRight:"set_marginRight",get_marginRight:"getMarginRight",set_marginTop:"set_marginTop",get_marginTop:"getMarginTop",set_marginBottom:"set_marginBottom",get_marginBottom:"getMarginBottom",set_paddingLeft:"set_paddingLeft",get_paddingLeft:"getPaddingLeft",set_paddingRight:"set_paddingRight",get_paddingRight:"getPaddingRight",set_paddingTop:"set_paddingTop",get_paddingTop:"getPaddingTop",set_paddingBottom:"set_paddingBottom",get_paddingBottom:"getPaddingBottom",set_width:"set_width",get_width:"getWidth",set_height:"set_height",get_height:"getHeight",set_minHeight:"set_minHeight",get_minHeight:"getMinHeight",set_maxHeight:"set_maxHeight",get_maxHeight:"getMaxHeight",set_minWidth:"set_minWidth",get_minWidth:"getMinWidth",set_maxWidth:"set_maxWidth",get_maxWidth:"getMaxWidth",set_top:"set_top",get_top:"getTop",set_left:"set_left",get_left:"getLeft",set_bottom:"set_bottom",get_bottom:"getBottom",set_right:"set_right",get_right:"getRight",set_fontSize:"set_fontSize",get_fontSize:"getFontSize",set_lineHeight:"set_lineHeight",get_lineHeight:"getLineHeight",set_letterSpacing:"set_letterSpacing",get_letterSpacing:"getLetterSpacing",set_wordSpacing:"set_wordSpacing",get_wordSpacing:"getWordSpacing",set_textIndent:"set_textIndent",get_textIndent:"getTextIndent",set_opacity:"set_opacity",get_opacity:"getOpacity"}
}
cocktail.core.style.CoreStyle = function(htmlElement) {
	this.htmlElement = htmlElement;
	this._fontManager = cocktail.core.font.FontManager.getInstance();
	this._pendingAnimations = new Array();
	this.initDefaultStyleValues(htmlElement.tagName);
};
$hxClasses["cocktail.core.style.CoreStyle"] = cocktail.core.style.CoreStyle;
cocktail.core.style.CoreStyle.__name__ = ["cocktail","core","style","CoreStyle"];
cocktail.core.style.CoreStyle.getDefaultStyle = function() {
	return { fontFamily : ["serif"], color : cocktail.core.style.CoreStyle.getColorDefaultValue()};
}
cocktail.core.style.CoreStyle.getBackgroundColorDefaultValue = function() {
	return cocktail.core.unit.CSSColor.transparent;
}
cocktail.core.style.CoreStyle.getBackgroundPositionDefaultValue = function() {
	return [{ x : cocktail.core.style.BackgroundPositionX.percent(0), y : cocktail.core.style.BackgroundPositionY.percent(0)}];
}
cocktail.core.style.CoreStyle.getColorDefaultValue = function() {
	return cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.black);
}
cocktail.core.style.CoreStyle.getDisplayDefaultValue = function() {
	return cocktail.core.style.Display.cssInline;
}
cocktail.core.style.CoreStyle.getPositionDefaultValue = function() {
	return cocktail.core.style.Position.cssStatic;
}
cocktail.core.style.CoreStyle.getWidthDefaultValue = function() {
	return cocktail.core.style.Dimension.cssAuto;
}
cocktail.core.style.CoreStyle.getHeightDefaultValue = function() {
	return cocktail.core.style.Dimension.cssAuto;
}
cocktail.core.style.CoreStyle.getMinHeightDefaultValue = function() {
	return cocktail.core.style.ConstrainedDimension.length(cocktail.core.unit.Length.px(0));
}
cocktail.core.style.CoreStyle.getMinWidthDefaultValue = function() {
	return cocktail.core.style.ConstrainedDimension.length(cocktail.core.unit.Length.px(0));
}
cocktail.core.style.CoreStyle.getMaxWidthDefaultValue = function() {
	return cocktail.core.style.ConstrainedDimension.none;
}
cocktail.core.style.CoreStyle.getMaxHeightDefaultValue = function() {
	return cocktail.core.style.ConstrainedDimension.none;
}
cocktail.core.style.CoreStyle.getMarginDefaultValue = function() {
	return cocktail.core.style.Margin.length(cocktail.core.unit.Length.px(0));
}
cocktail.core.style.CoreStyle.getPaddingDefaultValue = function() {
	return cocktail.core.style.Padding.length(cocktail.core.unit.Length.px(0));
}
cocktail.core.style.CoreStyle.getLineHeightDefaultValue = function() {
	return cocktail.core.style.LineHeight.normal;
}
cocktail.core.style.CoreStyle.prototype = {
	setCursor: function(value) {
		this.cursor = value;
		this.computedStyle.cursor = value;
		return value;
	}
	,setBackgroundOrigin: function(value) {
		this.backgroundOrigin = value;
		this.computedStyle.backgroundOrigin = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("background-origin"));
		return value;
	}
	,setBackgroundRepeat: function(value) {
		this.backgroundRepeat = value;
		this.computedStyle.backgroundRepeat = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("background-repeat"));
		return value;
	}
	,setBackgroundPosition: function(value) {
		this.backgroundPosition = value;
		this.computedStyle.backgroundPosition = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("background-position"));
		return value;
	}
	,setBackgroundClip: function(value) {
		this.backgroundClip = value;
		this.computedStyle.backgroundClip = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("background-clip"));
		return value;
	}
	,setBackgroundSize: function(value) {
		this.backgroundSize = value;
		this.computedStyle.backgroundSize = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("background-size"));
		return value;
	}
	,setBackgroundImage: function(value) {
		this.backgroundImage = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("background-image"));
		return value;
	}
	,setBackgroundColor: function(value) {
		this.backgroundColor = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("background-color"));
		return value;
	}
	,setTransitionTimingFunction: function(value) {
		this.transitionTimingFunction = value;
		this.computedStyle.transitionTimingFunction = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("transition-timing-function"));
		return value;
	}
	,setTransitionDelay: function(value) {
		this.transitionDelay = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("transition-delay"));
		return value;
	}
	,setTransitionDuration: function(value) {
		this.transitionDuration = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("transition-duration"));
		return value;
	}
	,setTransitionProperty: function(value) {
		this.transitionProperty = value;
		this.computedStyle.transitionProperty = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("transition-property"));
		return value;
	}
	,setOverflowY: function(value) {
		this.overflowY = value;
		this.computedStyle.overflowY = value;
		this.invalidatePositioningScheme();
		return value;
	}
	,setOverflowX: function(value) {
		this.overflowX = value;
		this.computedStyle.overflowX = value;
		this.invalidatePositioningScheme();
		return value;
	}
	,setTransform: function(value) {
		this.transform = value;
		this.invalidatePositioningScheme();
		return value;
	}
	,setTransformOrigin: function(value) {
		this.transformOrigin = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("transform-origin"));
		return value;
	}
	,setVisibility: function(value) {
		this.visibility = value;
		this.computedStyle.visibility = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("visibility"));
		return value;
	}
	,setOpacity: function(value) {
		this.opacity = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("opacity");
		this.registerPendingAnimation("opacity",invalidationReason,this.computedStyle.getOpacity());
		this.invalidate(invalidationReason);
		return value;
	}
	,setTextAlign: function(value) {
		this.textAlign = value;
		this.computedStyle.textAlign = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("text-align"));
		return value;
	}
	,setWhiteSpace: function(value) {
		this.whiteSpace = value;
		this.computedStyle.whiteSpace = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("white-space"));
		return value;
	}
	,setTextIndent: function(value) {
		this.textIndent = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("text-indent");
		this.invalidate(invalidationReason);
		return value;
	}
	,setVerticalAlign: function(value) {
		this.verticalAlign = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("vertical-align");
		this.invalidate(invalidationReason);
		return value;
	}
	,setColor: function(value) {
		this.color = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("color"));
		return value;
	}
	,setLineHeight: function(value) {
		this.lineHeight = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("line-height");
		this.invalidate(invalidationReason);
		return value;
	}
	,setWordSpacing: function(value) {
		this.wordSpacing = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("word-spacing");
		this.invalidate(invalidationReason);
		return value;
	}
	,setLetterSpacing: function(value) {
		this.letterSpacing = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("letter-spacing");
		this.invalidate(invalidationReason);
		return value;
	}
	,setTextTransform: function(value) {
		this.textTransform = value;
		this.computedStyle.textTransform = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("text-tranform"));
		return value;
	}
	,setFontVariant: function(value) {
		this.fontVariant = value;
		this.computedStyle.fontVariant = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("font-variant"));
		return value;
	}
	,setFontFamily: function(value) {
		this.fontFamily = value;
		this.computedStyle.fontFamily = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("font-family"));
		return value;
	}
	,setFontStyle: function(value) {
		this.fontStyle = value;
		this.computedStyle.fontStyle = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("font-style"));
		return value;
	}
	,setFontWeight: function(value) {
		this.fontWeight = value;
		this.computedStyle.fontWeight = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("font-weight"));
		return value;
	}
	,setFontSize: function(value) {
		this.fontSize = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("font-size");
		this.invalidate(invalidationReason);
		return value;
	}
	,setZIndex: function(value) {
		this.zIndex = value;
		this.computedStyle.zIndex = value;
		this.invalidatePositioningScheme();
		return value;
	}
	,setClear: function(value) {
		this.clear = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("clear"));
		return value;
	}
	,setCSSFloat: function(value) {
		this.cssFloat = value;
		this.invalidatePositioningScheme();
		return value;
	}
	,setRight: function(value) {
		this.right = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("right");
		this.registerPendingAnimation("right",invalidationReason,this.computedStyle.getRight());
		this.invalidate(invalidationReason);
		return value;
	}
	,setBottom: function(value) {
		this.bottom = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("bottom");
		this.registerPendingAnimation("bottom",invalidationReason,this.computedStyle.getBottom());
		this.invalidate(invalidationReason);
		return value;
	}
	,setLeft: function(value) {
		this.left = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("left");
		this.registerPendingAnimation("left",invalidationReason,this.computedStyle.getLeft());
		this.invalidate(invalidationReason);
		return value;
	}
	,setTop: function(value) {
		this.top = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("top");
		this.registerPendingAnimation("top",invalidationReason,this.computedStyle.getTop());
		this.invalidate(invalidationReason);
		return value;
	}
	,setMaxWidth: function(value) {
		this.maxWidth = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("max-width");
		this.invalidate(invalidationReason);
		return value;
	}
	,setMinWidth: function(value) {
		this.minWidth = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("min-width");
		this.invalidate(invalidationReason);
		return value;
	}
	,setMaxHeight: function(value) {
		this.maxHeight = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("max-height");
		this.invalidate(invalidationReason);
		return value;
	}
	,setMinHeight: function(value) {
		this.minHeight = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("min-height");
		this.invalidate(invalidationReason);
		return value;
	}
	,setHeight: function(value) {
		this.height = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("height");
		this.registerPendingAnimation("height",invalidationReason,this.computedStyle.getHeight());
		this.invalidate(invalidationReason);
		return value;
	}
	,setPosition: function(value) {
		this.position = value;
		this.computedStyle.position = value;
		this.invalidatePositioningScheme();
		return value;
	}
	,setDisplay: function(value) {
		this.display = value;
		this.invalidatePositioningScheme();
		return value;
	}
	,setPaddingBottom: function(value) {
		this.paddingBottom = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("padding-bottom");
		this.invalidate(invalidationReason);
		return value;
	}
	,setPaddingTop: function(value) {
		this.paddingTop = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("padding-top");
		this.invalidate(invalidationReason);
		return value;
	}
	,setPaddingRight: function(value) {
		this.paddingRight = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("padding-right");
		this.invalidate(invalidationReason);
		return value;
	}
	,setPaddingLeft: function(value) {
		this.paddingLeft = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("padding-left");
		this.invalidate(invalidationReason);
		return value;
	}
	,setMarginBottom: function(value) {
		this.marginBottom = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("margin-bottom");
		this.invalidate(invalidationReason);
		return value;
	}
	,setMarginTop: function(value) {
		this.marginTop = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("margin-top");
		this.invalidate(invalidationReason);
		return value;
	}
	,setMarginRight: function(value) {
		this.marginRight = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("margin-right");
		this.invalidate(invalidationReason);
		return value;
	}
	,setMarginLeft: function(value) {
		this.marginLeft = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("margin-left");
		this.invalidate(invalidationReason);
		return value;
	}
	,setWidth: function(value) {
		this.width = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("width");
		this.registerPendingAnimation("width",invalidationReason,this.computedStyle.getWidth());
		this.invalidate(invalidationReason);
		return value;
	}
	,get_fontMetricsData: function() {
		return this._fontManager.getFontMetrics(cocktail.core.unit.UnitManager.getCSSFontFamily(this.computedStyle.fontFamily),this.computedStyle.getFontSize());
	}
	,onTransitionUpdate: function(transition) {
		this.invalidate(transition.invalidationReason);
	}
	,onTransitionComplete: function(transition) {
		this.invalidate(transition.invalidationReason);
		var transitionEvent = new cocktail.core.event.TransitionEvent();
		transitionEvent.initTransitionEvent("transitionend",true,true,transition.propertyName,transition.transitionDuration,"");
		this.htmlElement.dispatchEvent(transitionEvent);
	}
	,getRepeatedIndex: function(index,length) {
		if(index < length) return index;
		return length % index;
	}
	,startTransitionIfNeeded: function(pendingAnimation) {
		var propertyIndex = 0;
		var $e = (this.computedStyle.transitionProperty);
		switch( $e[1] ) {
		case 0:
			return false;
		case 2:
			var value = $e[2];
			var foundFlag = false;
			var _g1 = 0, _g = value.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(value[i] == pendingAnimation.propertyName) {
					propertyIndex = i;
					foundFlag = true;
					break;
				}
			}
			if(foundFlag == false) return false;
			break;
		case 1:
			break;
		}
		var combinedDuration = 0.0;
		var transitionDelay = this.computedStyle.transitionDelay[this.getRepeatedIndex(propertyIndex,this.computedStyle.transitionDelay.length)];
		var transitionDuration = this.computedStyle.transitionDuration[this.getRepeatedIndex(propertyIndex,this.computedStyle.transitionDuration.length)];
		combinedDuration = transitionDuration + transitionDelay;
		if(combinedDuration <= 0) return false;
		var transitionTimingFunction = this.computedStyle.transitionTimingFunction[this.getRepeatedIndex(propertyIndex,this.computedStyle.transitionTimingFunction.length)];
		var transitionManager = cocktail.core.style.transition.TransitionManager.getInstance();
		var transition = transitionManager.getTransition(pendingAnimation.propertyName,this.computedStyle);
		if(transition != null) return false;
		var endValue = Reflect.getProperty(this.computedStyle,pendingAnimation.propertyName);
		transitionManager.startTransition(this.computedStyle,pendingAnimation.propertyName,pendingAnimation.startValue,endValue,transitionDuration,transitionDelay,transitionTimingFunction,$bind(this,this.onTransitionComplete),$bind(this,this.onTransitionUpdate),pendingAnimation.invalidationReason);
		return true;
	}
	,registerPendingAnimation: function(propertyName,invalidationReason,startValue) {
		this._pendingAnimations.push({ propertyName : propertyName, invalidationReason : invalidationReason, startValue : startValue});
	}
	,startPendingAnimations: function() {
		var atLeastOneAnimationStarted = false;
		var _g1 = 0, _g = this._pendingAnimations.length;
		while(_g1 < _g) {
			var i = _g1++;
			var animationStarted = this.startTransitionIfNeeded(this._pendingAnimations[i]);
			if(animationStarted == true) atLeastOneAnimationStarted = true;
		}
		this._pendingAnimations = new Array();
		return atLeastOneAnimationStarted;
	}
	,invalidatePositioningScheme: function() {
		this.htmlElement.invalidatePositioningScheme();
	}
	,invalidate: function(invalidationReason) {
		this.htmlElement.invalidate(invalidationReason);
	}
	,getReplacedBoxStylesComputer: function() {
		var boxComputer;
		if(this.computedStyle.cssFloat == cocktail.core.style.CSSFloat.left || this.computedStyle.cssFloat == cocktail.core.style.CSSFloat.right) boxComputer = new cocktail.core.style.computer.boxComputers.EmbeddedFloatBoxStylesComputer(); else if(this.computedStyle.position == cocktail.core.style.Position.fixed || this.computedStyle.position == cocktail.core.style.Position.absolute) boxComputer = new cocktail.core.style.computer.boxComputers.EmbeddedPositionedBoxStylesComputer(); else {
			switch( (this.computedStyle.display)[1] ) {
			case 0:
				boxComputer = new cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer();
				break;
			case 1:
				boxComputer = new cocktail.core.style.computer.boxComputers.EmbeddedInlineBlockBoxStylesComputer();
				break;
			case 3:
				boxComputer = null;
				break;
			case 2:
				boxComputer = new cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer();
				break;
			}
		}
		return boxComputer;
	}
	,getFlowBoxStylesComputer: function() {
		var boxComputer;
		if(this.computedStyle.cssFloat == cocktail.core.style.CSSFloat.left || this.computedStyle.cssFloat == cocktail.core.style.CSSFloat.right) boxComputer = new cocktail.core.style.computer.boxComputers.FloatBoxStylesComputer(); else if(this.computedStyle.position == cocktail.core.style.Position.fixed || this.computedStyle.position == cocktail.core.style.Position.absolute) boxComputer = new cocktail.core.style.computer.boxComputers.PositionedBoxStylesComputer(); else {
			switch( (this.computedStyle.display)[1] ) {
			case 0:
				boxComputer = new cocktail.core.style.computer.boxComputers.BlockBoxStylesComputer();
				break;
			case 1:
				boxComputer = new cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer();
				break;
			case 3:
				boxComputer = null;
				break;
			case 2:
				boxComputer = new cocktail.core.style.computer.boxComputers.InLineBoxStylesComputer();
				break;
			}
		}
		return boxComputer;
	}
	,getBoxStylesComputer: function(isReplaced) {
		if(isReplaced == true) return this.getReplacedBoxStylesComputer(); else return this.getFlowBoxStylesComputer();
	}
	,computeTransitionStyles: function() {
		cocktail.core.style.computer.TransitionStylesComputer.compute(this);
	}
	,computeBoxModelStyles: function(containingBlockDimensions,isReplaced) {
		var boxComputer = this.getBoxStylesComputer(isReplaced);
		boxComputer.measure(this,containingBlockDimensions);
	}
	,computeTextAndFontStyles: function(containingBlockData,containingBlockFontMetricsData) {
		cocktail.core.style.computer.FontAndTextStylesComputer.compute(this,containingBlockData,containingBlockFontMetricsData);
	}
	,computeVisualEffectStyles: function() {
		cocktail.core.style.computer.VisualEffectStylesComputer.compute(this);
	}
	,computeBackgroundStyles: function() {
		cocktail.core.style.computer.BackgroundStylesComputer.compute(this);
	}
	,computeDisplayStyles: function() {
		cocktail.core.style.computer.DisplayStylesComputer.compute(this);
	}
	,applyDefaultHTMLStyles: function(tagName) {
		switch(tagName.toUpperCase()) {
		case "HTML":case "ADRESS":case "DD":case "DIV":case "DL":case "DT":case "FIELDSET":case "FORM":case "FRAME":case "FRAMESET":case "NOFRAMES":case "OL":case "CENTER":case "DIR":case "HR":case "MENU":
			this.setDisplay(cocktail.core.style.Display.block);
			break;
		case "LI":
			this.setDisplay(cocktail.core.style.Display.block);
			break;
		case "A":
			this.setCursor(cocktail.core.style.Cursor.pointer);
			break;
		case "UL":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(1.12))));
			this.setMarginLeft(cocktail.core.style.Margin.length(cocktail.core.unit.Length.px(40)));
			break;
		case "HEAD":
			this.setDisplay(cocktail.core.style.Display.none);
			break;
		case "BODY":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setMarginLeft(this.setMarginRight(this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.px(8))))));
			break;
		case "H1":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(2)));
			this.setFontWeight(cocktail.core.style.FontWeight.bolder);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(0.67))));
			break;
		case "H2":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(1.5)));
			this.setFontWeight(cocktail.core.style.FontWeight.bolder);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(0.75))));
			break;
		case "H3":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(1.17)));
			this.setFontWeight(cocktail.core.style.FontWeight.bolder);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(0.83))));
			break;
		case "H4":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setFontWeight(cocktail.core.style.FontWeight.bolder);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(1.12))));
			break;
		case "H5":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(0.83)));
			this.setFontWeight(cocktail.core.style.FontWeight.bolder);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(1.5))));
			break;
		case "H6":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(0.75)));
			this.setFontWeight(cocktail.core.style.FontWeight.bolder);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(1.67))));
			break;
		case "P":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(1))));
			break;
		case "PRE":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setWhiteSpace(cocktail.core.style.WhiteSpace.pre);
			this.setFontFamily(["monospace"]);
			break;
		case "CODE":
			this.setFontFamily(["monospace"]);
			break;
		case "I":case "CITE":case "EM":case "VAR":
			this.setFontStyle(cocktail.core.style.FontStyle.italic);
			break;
		case "INPUT":
			this.setDisplay(cocktail.core.style.Display.inlineBlock);
			break;
		case "BLOCKQUOTE":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(1.12))));
			this.setMarginLeft(this.setMarginRight(cocktail.core.style.Margin.length(cocktail.core.unit.Length.px(40))));
			break;
		case "STRONG":
			this.setFontWeight(cocktail.core.style.FontWeight.bolder);
			break;
		case "BIG":
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(1.17)));
			break;
		case "SMALL":
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(0.83)));
			break;
		case "SUB":
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(0.83)));
			this.setVerticalAlign(cocktail.core.style.VerticalAlign.sub);
			break;
		case "SUP":
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(0.83)));
			this.setVerticalAlign(cocktail.core.style.VerticalAlign.cssSuper);
			break;
		}
	}
	,initComputedStyles: function() {
		this.computedStyle.init();
	}
	,initDefaultStyleValues: function(tagName) {
		this.computedStyle = new cocktail.core.style.ComputedStyle(this);
		this.initComputedStyles();
		this.setWidth(cocktail.core.style.CoreStyle.getWidthDefaultValue());
		this.setHeight(cocktail.core.style.CoreStyle.getHeightDefaultValue());
		this.setMinWidth(cocktail.core.style.CoreStyle.getMinWidthDefaultValue());
		this.setMaxWidth(cocktail.core.style.CoreStyle.getMaxWidthDefaultValue());
		this.setMinHeight(cocktail.core.style.CoreStyle.getMinHeightDefaultValue());
		this.setMaxHeight(cocktail.core.style.CoreStyle.getMaxHeightDefaultValue());
		this.setMarginTop(cocktail.core.style.Margin.length(cocktail.core.unit.Length.px(0)));
		this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.px(0)));
		this.setMarginLeft(cocktail.core.style.Margin.length(cocktail.core.unit.Length.px(0)));
		this.setMarginRight(cocktail.core.style.Margin.length(cocktail.core.unit.Length.px(0)));
		this.setPaddingTop(cocktail.core.style.Padding.length(cocktail.core.unit.Length.px(0)));
		this.setPaddingBottom(cocktail.core.style.Padding.length(cocktail.core.unit.Length.px(0)));
		this.setPaddingLeft(cocktail.core.style.Padding.length(cocktail.core.unit.Length.px(0)));
		this.setPaddingRight(cocktail.core.style.Padding.length(cocktail.core.unit.Length.px(0)));
		this.setLineHeight(cocktail.core.style.LineHeight.normal);
		this.setVerticalAlign(cocktail.core.style.VerticalAlign.baseline);
		this.setDisplay(cocktail.core.style.Display.cssInline);
		this.setPosition(cocktail.core.style.Position.cssStatic);
		this.setZIndex(cocktail.core.style.ZIndex.cssAuto);
		this.setTop(cocktail.core.style.PositionOffset.cssAuto);
		this.setBottom(cocktail.core.style.PositionOffset.cssAuto);
		this.setLeft(cocktail.core.style.PositionOffset.cssAuto);
		this.setRight(cocktail.core.style.PositionOffset.cssAuto);
		this.setCSSFloat(cocktail.core.style.CSSFloat.none);
		this.setClear(cocktail.core.style.Clear.none);
		this.setBackgroundColor(cocktail.core.unit.CSSColor.transparent);
		this.setBackgroundImage([cocktail.core.style.BackgroundImage.none]);
		this.setBackgroundRepeat([{ x : cocktail.core.style.BackgroundRepeatValue.repeat, y : cocktail.core.style.BackgroundRepeatValue.repeat}]);
		this.setBackgroundPosition(cocktail.core.style.CoreStyle.getBackgroundPositionDefaultValue());
		this.setBackgroundOrigin([cocktail.core.style.BackgroundOrigin.paddingBox]);
		this.setBackgroundSize([cocktail.core.style.BackgroundSize.dimensions({ x : cocktail.core.style.BackgroundSizeDimension.cssAuto, y : cocktail.core.style.BackgroundSizeDimension.cssAuto})]);
		this.setBackgroundClip([cocktail.core.style.BackgroundClip.borderBox]);
		this.setFontStyle(cocktail.core.style.FontStyle.normal);
		this.setFontVariant(cocktail.core.style.FontVariant.normal);
		this.setFontWeight(cocktail.core.style.FontWeight.normal);
		this.setFontSize(cocktail.core.style.FontSize.absoluteSize(cocktail.core.unit.FontSizeAbsoluteSize.medium));
		this.setTextIndent(cocktail.core.style.TextIndent.length(cocktail.core.unit.Length.px(0)));
		this.setTextAlign(cocktail.core.style.TextAlign.left);
		this.setLetterSpacing(cocktail.core.style.LetterSpacing.normal);
		this.setWordSpacing(cocktail.core.style.WordSpacing.normal);
		this.setTextTransform(cocktail.core.style.TextTransform.none);
		this.setWhiteSpace(cocktail.core.style.WhiteSpace.normal);
		this.setVisibility(cocktail.core.style.Visibility.visible);
		this.setOpacity(1.0);
		this.setOverflowX(cocktail.core.style.Overflow.visible);
		this.setOverflowY(cocktail.core.style.Overflow.visible);
		this.setTransitionDelay([cocktail.core.unit.TimeValue.seconds(0)]);
		this.setTransitionDuration([cocktail.core.unit.TimeValue.seconds(0)]);
		this.setTransitionProperty(cocktail.core.style.TransitionProperty.all);
		this.setTransitionTimingFunction([cocktail.core.style.TransitionTimingFunctionValue.ease]);
		this.setTransformOrigin({ x : cocktail.core.style.TransformOriginX.center, y : cocktail.core.style.TransformOriginY.center});
		this.setTransform(cocktail.core.style.Transform.none);
		this.setCursor(cocktail.core.style.Cursor.cssAuto);
		var defaultStyles = cocktail.core.style.CoreStyle.getDefaultStyle();
		this.setFontFamily(defaultStyles.fontFamily);
		this.setColor(defaultStyles.color);
		this.applyDefaultHTMLStyles(tagName);
	}
	,_pendingAnimations: null
	,_fontManager: null
	,htmlElement: null
	,fontMetrics: null
	,computedStyle: null
	,transitionTimingFunction: null
	,transitionDelay: null
	,transitionDuration: null
	,transitionProperty: null
	,cursor: null
	,transform: null
	,transformOrigin: null
	,overflowY: null
	,overflowX: null
	,visibility: null
	,opacity: null
	,verticalAlign: null
	,textIndent: null
	,textAlign: null
	,whiteSpace: null
	,wordSpacing: null
	,letterSpacing: null
	,textTransform: null
	,lineHeight: null
	,color: null
	,fontVariant: null
	,fontFamily: null
	,fontStyle: null
	,fontWeight: null
	,fontSize: null
	,backgroundClip: null
	,backgroundPosition: null
	,backgroundSize: null
	,backgroundOrigin: null
	,backgroundRepeat: null
	,backgroundImage: null
	,backgroundColor: null
	,right: null
	,bottom: null
	,left: null
	,top: null
	,maxWidth: null
	,minWidth: null
	,maxHeight: null
	,minHeight: null
	,height: null
	,width: null
	,paddingBottom: null
	,paddingTop: null
	,paddingRight: null
	,paddingLeft: null
	,marginBottom: null
	,marginTop: null
	,marginRight: null
	,marginLeft: null
	,zIndex: null
	,clear: null
	,cssFloat: null
	,position: null
	,display: null
	,__class__: cocktail.core.style.CoreStyle
	,__properties__: {set_display:"setDisplay",set_position:"setPosition",set_cssFloat:"setCSSFloat",set_clear:"setClear",set_zIndex:"setZIndex",set_marginLeft:"setMarginLeft",set_marginRight:"setMarginRight",set_marginTop:"setMarginTop",set_marginBottom:"setMarginBottom",set_paddingLeft:"setPaddingLeft",set_paddingRight:"setPaddingRight",set_paddingTop:"setPaddingTop",set_paddingBottom:"setPaddingBottom",set_width:"setWidth",set_height:"setHeight",set_minHeight:"setMinHeight",set_maxHeight:"setMaxHeight",set_minWidth:"setMinWidth",set_maxWidth:"setMaxWidth",set_top:"setTop",set_left:"setLeft",set_bottom:"setBottom",set_right:"setRight",set_backgroundColor:"setBackgroundColor",set_backgroundImage:"setBackgroundImage",set_backgroundRepeat:"setBackgroundRepeat",set_backgroundOrigin:"setBackgroundOrigin",set_backgroundSize:"setBackgroundSize",set_backgroundPosition:"setBackgroundPosition",set_backgroundClip:"setBackgroundClip",set_fontSize:"setFontSize",set_fontWeight:"setFontWeight",set_fontStyle:"setFontStyle",set_fontFamily:"setFontFamily",set_fontVariant:"setFontVariant",set_color:"setColor",set_lineHeight:"setLineHeight",set_textTransform:"setTextTransform",set_letterSpacing:"setLetterSpacing",set_wordSpacing:"setWordSpacing",set_whiteSpace:"setWhiteSpace",set_textAlign:"setTextAlign",set_textIndent:"setTextIndent",set_verticalAlign:"setVerticalAlign",set_opacity:"setOpacity",set_visibility:"setVisibility",set_overflowX:"setOverflowX",set_overflowY:"setOverflowY",set_transformOrigin:"setTransformOrigin",set_transform:"setTransform",set_cursor:"setCursor",set_transitionProperty:"setTransitionProperty",set_transitionDuration:"setTransitionDuration",set_transitionDelay:"setTransitionDelay",set_transitionTimingFunction:"setTransitionTimingFunction",get_fontMetrics:"get_fontMetricsData"}
}
cocktail.core.style.FontSize = $hxClasses["cocktail.core.style.FontSize"] = { __ename__ : ["cocktail","core","style","FontSize"], __constructs__ : ["length","percentage","absoluteSize","relativeSize"] }
cocktail.core.style.FontSize.length = function(value) { var $x = ["length",0,value]; $x.__enum__ = cocktail.core.style.FontSize; $x.toString = $estr; return $x; }
cocktail.core.style.FontSize.percentage = function(value) { var $x = ["percentage",1,value]; $x.__enum__ = cocktail.core.style.FontSize; $x.toString = $estr; return $x; }
cocktail.core.style.FontSize.absoluteSize = function(value) { var $x = ["absoluteSize",2,value]; $x.__enum__ = cocktail.core.style.FontSize; $x.toString = $estr; return $x; }
cocktail.core.style.FontSize.relativeSize = function(value) { var $x = ["relativeSize",3,value]; $x.__enum__ = cocktail.core.style.FontSize; $x.toString = $estr; return $x; }
cocktail.core.style.FontWeight = $hxClasses["cocktail.core.style.FontWeight"] = { __ename__ : ["cocktail","core","style","FontWeight"], __constructs__ : ["normal","bold","bolder","lighter","css100","css200","css300","css400","css500","css600","css700","css800","css900"] }
cocktail.core.style.FontWeight.normal = ["normal",0];
cocktail.core.style.FontWeight.normal.toString = $estr;
cocktail.core.style.FontWeight.normal.__enum__ = cocktail.core.style.FontWeight;
cocktail.core.style.FontWeight.bold = ["bold",1];
cocktail.core.style.FontWeight.bold.toString = $estr;
cocktail.core.style.FontWeight.bold.__enum__ = cocktail.core.style.FontWeight;
cocktail.core.style.FontWeight.bolder = ["bolder",2];
cocktail.core.style.FontWeight.bolder.toString = $estr;
cocktail.core.style.FontWeight.bolder.__enum__ = cocktail.core.style.FontWeight;
cocktail.core.style.FontWeight.lighter = ["lighter",3];
cocktail.core.style.FontWeight.lighter.toString = $estr;
cocktail.core.style.FontWeight.lighter.__enum__ = cocktail.core.style.FontWeight;
cocktail.core.style.FontWeight.css100 = ["css100",4];
cocktail.core.style.FontWeight.css100.toString = $estr;
cocktail.core.style.FontWeight.css100.__enum__ = cocktail.core.style.FontWeight;
cocktail.core.style.FontWeight.css200 = ["css200",5];
cocktail.core.style.FontWeight.css200.toString = $estr;
cocktail.core.style.FontWeight.css200.__enum__ = cocktail.core.style.FontWeight;
cocktail.core.style.FontWeight.css300 = ["css300",6];
cocktail.core.style.FontWeight.css300.toString = $estr;
cocktail.core.style.FontWeight.css300.__enum__ = cocktail.core.style.FontWeight;
cocktail.core.style.FontWeight.css400 = ["css400",7];
cocktail.core.style.FontWeight.css400.toString = $estr;
cocktail.core.style.FontWeight.css400.__enum__ = cocktail.core.style.FontWeight;
cocktail.core.style.FontWeight.css500 = ["css500",8];
cocktail.core.style.FontWeight.css500.toString = $estr;
cocktail.core.style.FontWeight.css500.__enum__ = cocktail.core.style.FontWeight;
cocktail.core.style.FontWeight.css600 = ["css600",9];
cocktail.core.style.FontWeight.css600.toString = $estr;
cocktail.core.style.FontWeight.css600.__enum__ = cocktail.core.style.FontWeight;
cocktail.core.style.FontWeight.css700 = ["css700",10];
cocktail.core.style.FontWeight.css700.toString = $estr;
cocktail.core.style.FontWeight.css700.__enum__ = cocktail.core.style.FontWeight;
cocktail.core.style.FontWeight.css800 = ["css800",11];
cocktail.core.style.FontWeight.css800.toString = $estr;
cocktail.core.style.FontWeight.css800.__enum__ = cocktail.core.style.FontWeight;
cocktail.core.style.FontWeight.css900 = ["css900",12];
cocktail.core.style.FontWeight.css900.toString = $estr;
cocktail.core.style.FontWeight.css900.__enum__ = cocktail.core.style.FontWeight;
cocktail.core.style.FontStyle = $hxClasses["cocktail.core.style.FontStyle"] = { __ename__ : ["cocktail","core","style","FontStyle"], __constructs__ : ["normal","italic","oblique"] }
cocktail.core.style.FontStyle.normal = ["normal",0];
cocktail.core.style.FontStyle.normal.toString = $estr;
cocktail.core.style.FontStyle.normal.__enum__ = cocktail.core.style.FontStyle;
cocktail.core.style.FontStyle.italic = ["italic",1];
cocktail.core.style.FontStyle.italic.toString = $estr;
cocktail.core.style.FontStyle.italic.__enum__ = cocktail.core.style.FontStyle;
cocktail.core.style.FontStyle.oblique = ["oblique",2];
cocktail.core.style.FontStyle.oblique.toString = $estr;
cocktail.core.style.FontStyle.oblique.__enum__ = cocktail.core.style.FontStyle;
cocktail.core.style.FontVariant = $hxClasses["cocktail.core.style.FontVariant"] = { __ename__ : ["cocktail","core","style","FontVariant"], __constructs__ : ["normal","smallCaps"] }
cocktail.core.style.FontVariant.normal = ["normal",0];
cocktail.core.style.FontVariant.normal.toString = $estr;
cocktail.core.style.FontVariant.normal.__enum__ = cocktail.core.style.FontVariant;
cocktail.core.style.FontVariant.smallCaps = ["smallCaps",1];
cocktail.core.style.FontVariant.smallCaps.toString = $estr;
cocktail.core.style.FontVariant.smallCaps.__enum__ = cocktail.core.style.FontVariant;
cocktail.core.style.WhiteSpace = $hxClasses["cocktail.core.style.WhiteSpace"] = { __ename__ : ["cocktail","core","style","WhiteSpace"], __constructs__ : ["normal","pre","nowrap","preWrap","preLine"] }
cocktail.core.style.WhiteSpace.normal = ["normal",0];
cocktail.core.style.WhiteSpace.normal.toString = $estr;
cocktail.core.style.WhiteSpace.normal.__enum__ = cocktail.core.style.WhiteSpace;
cocktail.core.style.WhiteSpace.pre = ["pre",1];
cocktail.core.style.WhiteSpace.pre.toString = $estr;
cocktail.core.style.WhiteSpace.pre.__enum__ = cocktail.core.style.WhiteSpace;
cocktail.core.style.WhiteSpace.nowrap = ["nowrap",2];
cocktail.core.style.WhiteSpace.nowrap.toString = $estr;
cocktail.core.style.WhiteSpace.nowrap.__enum__ = cocktail.core.style.WhiteSpace;
cocktail.core.style.WhiteSpace.preWrap = ["preWrap",3];
cocktail.core.style.WhiteSpace.preWrap.toString = $estr;
cocktail.core.style.WhiteSpace.preWrap.__enum__ = cocktail.core.style.WhiteSpace;
cocktail.core.style.WhiteSpace.preLine = ["preLine",4];
cocktail.core.style.WhiteSpace.preLine.toString = $estr;
cocktail.core.style.WhiteSpace.preLine.__enum__ = cocktail.core.style.WhiteSpace;
cocktail.core.style.LetterSpacing = $hxClasses["cocktail.core.style.LetterSpacing"] = { __ename__ : ["cocktail","core","style","LetterSpacing"], __constructs__ : ["normal","length"] }
cocktail.core.style.LetterSpacing.normal = ["normal",0];
cocktail.core.style.LetterSpacing.normal.toString = $estr;
cocktail.core.style.LetterSpacing.normal.__enum__ = cocktail.core.style.LetterSpacing;
cocktail.core.style.LetterSpacing.length = function(value) { var $x = ["length",1,value]; $x.__enum__ = cocktail.core.style.LetterSpacing; $x.toString = $estr; return $x; }
cocktail.core.style.WordSpacing = $hxClasses["cocktail.core.style.WordSpacing"] = { __ename__ : ["cocktail","core","style","WordSpacing"], __constructs__ : ["normal","length"] }
cocktail.core.style.WordSpacing.normal = ["normal",0];
cocktail.core.style.WordSpacing.normal.toString = $estr;
cocktail.core.style.WordSpacing.normal.__enum__ = cocktail.core.style.WordSpacing;
cocktail.core.style.WordSpacing.length = function(value) { var $x = ["length",1,value]; $x.__enum__ = cocktail.core.style.WordSpacing; $x.toString = $estr; return $x; }
cocktail.core.style.TextIndent = $hxClasses["cocktail.core.style.TextIndent"] = { __ename__ : ["cocktail","core","style","TextIndent"], __constructs__ : ["length","percentage"] }
cocktail.core.style.TextIndent.length = function(value) { var $x = ["length",0,value]; $x.__enum__ = cocktail.core.style.TextIndent; $x.toString = $estr; return $x; }
cocktail.core.style.TextIndent.percentage = function(value) { var $x = ["percentage",1,value]; $x.__enum__ = cocktail.core.style.TextIndent; $x.toString = $estr; return $x; }
cocktail.core.style.TextAlign = $hxClasses["cocktail.core.style.TextAlign"] = { __ename__ : ["cocktail","core","style","TextAlign"], __constructs__ : ["left","right","center","justify"] }
cocktail.core.style.TextAlign.left = ["left",0];
cocktail.core.style.TextAlign.left.toString = $estr;
cocktail.core.style.TextAlign.left.__enum__ = cocktail.core.style.TextAlign;
cocktail.core.style.TextAlign.right = ["right",1];
cocktail.core.style.TextAlign.right.toString = $estr;
cocktail.core.style.TextAlign.right.__enum__ = cocktail.core.style.TextAlign;
cocktail.core.style.TextAlign.center = ["center",2];
cocktail.core.style.TextAlign.center.toString = $estr;
cocktail.core.style.TextAlign.center.__enum__ = cocktail.core.style.TextAlign;
cocktail.core.style.TextAlign.justify = ["justify",3];
cocktail.core.style.TextAlign.justify.toString = $estr;
cocktail.core.style.TextAlign.justify.__enum__ = cocktail.core.style.TextAlign;
cocktail.core.style.TextTransform = $hxClasses["cocktail.core.style.TextTransform"] = { __ename__ : ["cocktail","core","style","TextTransform"], __constructs__ : ["capitalize","uppercase","lowercase","none"] }
cocktail.core.style.TextTransform.capitalize = ["capitalize",0];
cocktail.core.style.TextTransform.capitalize.toString = $estr;
cocktail.core.style.TextTransform.capitalize.__enum__ = cocktail.core.style.TextTransform;
cocktail.core.style.TextTransform.uppercase = ["uppercase",1];
cocktail.core.style.TextTransform.uppercase.toString = $estr;
cocktail.core.style.TextTransform.uppercase.__enum__ = cocktail.core.style.TextTransform;
cocktail.core.style.TextTransform.lowercase = ["lowercase",2];
cocktail.core.style.TextTransform.lowercase.toString = $estr;
cocktail.core.style.TextTransform.lowercase.__enum__ = cocktail.core.style.TextTransform;
cocktail.core.style.TextTransform.none = ["none",3];
cocktail.core.style.TextTransform.none.toString = $estr;
cocktail.core.style.TextTransform.none.__enum__ = cocktail.core.style.TextTransform;
cocktail.core.style.LineHeight = $hxClasses["cocktail.core.style.LineHeight"] = { __ename__ : ["cocktail","core","style","LineHeight"], __constructs__ : ["normal","number","length","percentage"] }
cocktail.core.style.LineHeight.normal = ["normal",0];
cocktail.core.style.LineHeight.normal.toString = $estr;
cocktail.core.style.LineHeight.normal.__enum__ = cocktail.core.style.LineHeight;
cocktail.core.style.LineHeight.number = function(value) { var $x = ["number",1,value]; $x.__enum__ = cocktail.core.style.LineHeight; $x.toString = $estr; return $x; }
cocktail.core.style.LineHeight.length = function(value) { var $x = ["length",2,value]; $x.__enum__ = cocktail.core.style.LineHeight; $x.toString = $estr; return $x; }
cocktail.core.style.LineHeight.percentage = function(value) { var $x = ["percentage",3,value]; $x.__enum__ = cocktail.core.style.LineHeight; $x.toString = $estr; return $x; }
cocktail.core.style.VerticalAlign = $hxClasses["cocktail.core.style.VerticalAlign"] = { __ename__ : ["cocktail","core","style","VerticalAlign"], __constructs__ : ["baseline","sub","cssSuper","top","textTop","middle","bottom","textBottom","percent","length"] }
cocktail.core.style.VerticalAlign.baseline = ["baseline",0];
cocktail.core.style.VerticalAlign.baseline.toString = $estr;
cocktail.core.style.VerticalAlign.baseline.__enum__ = cocktail.core.style.VerticalAlign;
cocktail.core.style.VerticalAlign.sub = ["sub",1];
cocktail.core.style.VerticalAlign.sub.toString = $estr;
cocktail.core.style.VerticalAlign.sub.__enum__ = cocktail.core.style.VerticalAlign;
cocktail.core.style.VerticalAlign.cssSuper = ["cssSuper",2];
cocktail.core.style.VerticalAlign.cssSuper.toString = $estr;
cocktail.core.style.VerticalAlign.cssSuper.__enum__ = cocktail.core.style.VerticalAlign;
cocktail.core.style.VerticalAlign.top = ["top",3];
cocktail.core.style.VerticalAlign.top.toString = $estr;
cocktail.core.style.VerticalAlign.top.__enum__ = cocktail.core.style.VerticalAlign;
cocktail.core.style.VerticalAlign.textTop = ["textTop",4];
cocktail.core.style.VerticalAlign.textTop.toString = $estr;
cocktail.core.style.VerticalAlign.textTop.__enum__ = cocktail.core.style.VerticalAlign;
cocktail.core.style.VerticalAlign.middle = ["middle",5];
cocktail.core.style.VerticalAlign.middle.toString = $estr;
cocktail.core.style.VerticalAlign.middle.__enum__ = cocktail.core.style.VerticalAlign;
cocktail.core.style.VerticalAlign.bottom = ["bottom",6];
cocktail.core.style.VerticalAlign.bottom.toString = $estr;
cocktail.core.style.VerticalAlign.bottom.__enum__ = cocktail.core.style.VerticalAlign;
cocktail.core.style.VerticalAlign.textBottom = ["textBottom",7];
cocktail.core.style.VerticalAlign.textBottom.toString = $estr;
cocktail.core.style.VerticalAlign.textBottom.__enum__ = cocktail.core.style.VerticalAlign;
cocktail.core.style.VerticalAlign.percent = function(value) { var $x = ["percent",8,value]; $x.__enum__ = cocktail.core.style.VerticalAlign; $x.toString = $estr; return $x; }
cocktail.core.style.VerticalAlign.length = function(value) { var $x = ["length",9,value]; $x.__enum__ = cocktail.core.style.VerticalAlign; $x.toString = $estr; return $x; }
cocktail.core.style.Margin = $hxClasses["cocktail.core.style.Margin"] = { __ename__ : ["cocktail","core","style","Margin"], __constructs__ : ["length","percent","cssAuto"] }
cocktail.core.style.Margin.length = function(value) { var $x = ["length",0,value]; $x.__enum__ = cocktail.core.style.Margin; $x.toString = $estr; return $x; }
cocktail.core.style.Margin.percent = function(value) { var $x = ["percent",1,value]; $x.__enum__ = cocktail.core.style.Margin; $x.toString = $estr; return $x; }
cocktail.core.style.Margin.cssAuto = ["cssAuto",2];
cocktail.core.style.Margin.cssAuto.toString = $estr;
cocktail.core.style.Margin.cssAuto.__enum__ = cocktail.core.style.Margin;
cocktail.core.style.Padding = $hxClasses["cocktail.core.style.Padding"] = { __ename__ : ["cocktail","core","style","Padding"], __constructs__ : ["length","percent"] }
cocktail.core.style.Padding.length = function(value) { var $x = ["length",0,value]; $x.__enum__ = cocktail.core.style.Padding; $x.toString = $estr; return $x; }
cocktail.core.style.Padding.percent = function(value) { var $x = ["percent",1,value]; $x.__enum__ = cocktail.core.style.Padding; $x.toString = $estr; return $x; }
cocktail.core.style.Dimension = $hxClasses["cocktail.core.style.Dimension"] = { __ename__ : ["cocktail","core","style","Dimension"], __constructs__ : ["length","percent","cssAuto"] }
cocktail.core.style.Dimension.length = function(value) { var $x = ["length",0,value]; $x.__enum__ = cocktail.core.style.Dimension; $x.toString = $estr; return $x; }
cocktail.core.style.Dimension.percent = function(value) { var $x = ["percent",1,value]; $x.__enum__ = cocktail.core.style.Dimension; $x.toString = $estr; return $x; }
cocktail.core.style.Dimension.cssAuto = ["cssAuto",2];
cocktail.core.style.Dimension.cssAuto.toString = $estr;
cocktail.core.style.Dimension.cssAuto.__enum__ = cocktail.core.style.Dimension;
cocktail.core.style.ConstrainedDimension = $hxClasses["cocktail.core.style.ConstrainedDimension"] = { __ename__ : ["cocktail","core","style","ConstrainedDimension"], __constructs__ : ["length","percent","none"] }
cocktail.core.style.ConstrainedDimension.length = function(value) { var $x = ["length",0,value]; $x.__enum__ = cocktail.core.style.ConstrainedDimension; $x.toString = $estr; return $x; }
cocktail.core.style.ConstrainedDimension.percent = function(value) { var $x = ["percent",1,value]; $x.__enum__ = cocktail.core.style.ConstrainedDimension; $x.toString = $estr; return $x; }
cocktail.core.style.ConstrainedDimension.none = ["none",2];
cocktail.core.style.ConstrainedDimension.none.toString = $estr;
cocktail.core.style.ConstrainedDimension.none.__enum__ = cocktail.core.style.ConstrainedDimension;
cocktail.core.style.Display = $hxClasses["cocktail.core.style.Display"] = { __ename__ : ["cocktail","core","style","Display"], __constructs__ : ["block","inlineBlock","cssInline","none"] }
cocktail.core.style.Display.block = ["block",0];
cocktail.core.style.Display.block.toString = $estr;
cocktail.core.style.Display.block.__enum__ = cocktail.core.style.Display;
cocktail.core.style.Display.inlineBlock = ["inlineBlock",1];
cocktail.core.style.Display.inlineBlock.toString = $estr;
cocktail.core.style.Display.inlineBlock.__enum__ = cocktail.core.style.Display;
cocktail.core.style.Display.cssInline = ["cssInline",2];
cocktail.core.style.Display.cssInline.toString = $estr;
cocktail.core.style.Display.cssInline.__enum__ = cocktail.core.style.Display;
cocktail.core.style.Display.none = ["none",3];
cocktail.core.style.Display.none.toString = $estr;
cocktail.core.style.Display.none.__enum__ = cocktail.core.style.Display;
cocktail.core.style.CSSFloat = $hxClasses["cocktail.core.style.CSSFloat"] = { __ename__ : ["cocktail","core","style","CSSFloat"], __constructs__ : ["left","right","none"] }
cocktail.core.style.CSSFloat.left = ["left",0];
cocktail.core.style.CSSFloat.left.toString = $estr;
cocktail.core.style.CSSFloat.left.__enum__ = cocktail.core.style.CSSFloat;
cocktail.core.style.CSSFloat.right = ["right",1];
cocktail.core.style.CSSFloat.right.toString = $estr;
cocktail.core.style.CSSFloat.right.__enum__ = cocktail.core.style.CSSFloat;
cocktail.core.style.CSSFloat.none = ["none",2];
cocktail.core.style.CSSFloat.none.toString = $estr;
cocktail.core.style.CSSFloat.none.__enum__ = cocktail.core.style.CSSFloat;
cocktail.core.style.Clear = $hxClasses["cocktail.core.style.Clear"] = { __ename__ : ["cocktail","core","style","Clear"], __constructs__ : ["none","left","right","both"] }
cocktail.core.style.Clear.none = ["none",0];
cocktail.core.style.Clear.none.toString = $estr;
cocktail.core.style.Clear.none.__enum__ = cocktail.core.style.Clear;
cocktail.core.style.Clear.left = ["left",1];
cocktail.core.style.Clear.left.toString = $estr;
cocktail.core.style.Clear.left.__enum__ = cocktail.core.style.Clear;
cocktail.core.style.Clear.right = ["right",2];
cocktail.core.style.Clear.right.toString = $estr;
cocktail.core.style.Clear.right.__enum__ = cocktail.core.style.Clear;
cocktail.core.style.Clear.both = ["both",3];
cocktail.core.style.Clear.both.toString = $estr;
cocktail.core.style.Clear.both.__enum__ = cocktail.core.style.Clear;
cocktail.core.style.Position = $hxClasses["cocktail.core.style.Position"] = { __ename__ : ["cocktail","core","style","Position"], __constructs__ : ["cssStatic","relative","absolute","fixed"] }
cocktail.core.style.Position.cssStatic = ["cssStatic",0];
cocktail.core.style.Position.cssStatic.toString = $estr;
cocktail.core.style.Position.cssStatic.__enum__ = cocktail.core.style.Position;
cocktail.core.style.Position.relative = ["relative",1];
cocktail.core.style.Position.relative.toString = $estr;
cocktail.core.style.Position.relative.__enum__ = cocktail.core.style.Position;
cocktail.core.style.Position.absolute = ["absolute",2];
cocktail.core.style.Position.absolute.toString = $estr;
cocktail.core.style.Position.absolute.__enum__ = cocktail.core.style.Position;
cocktail.core.style.Position.fixed = ["fixed",3];
cocktail.core.style.Position.fixed.toString = $estr;
cocktail.core.style.Position.fixed.__enum__ = cocktail.core.style.Position;
cocktail.core.style.PositionOffset = $hxClasses["cocktail.core.style.PositionOffset"] = { __ename__ : ["cocktail","core","style","PositionOffset"], __constructs__ : ["length","percent","cssAuto"] }
cocktail.core.style.PositionOffset.length = function(value) { var $x = ["length",0,value]; $x.__enum__ = cocktail.core.style.PositionOffset; $x.toString = $estr; return $x; }
cocktail.core.style.PositionOffset.percent = function(value) { var $x = ["percent",1,value]; $x.__enum__ = cocktail.core.style.PositionOffset; $x.toString = $estr; return $x; }
cocktail.core.style.PositionOffset.cssAuto = ["cssAuto",2];
cocktail.core.style.PositionOffset.cssAuto.toString = $estr;
cocktail.core.style.PositionOffset.cssAuto.__enum__ = cocktail.core.style.PositionOffset;
cocktail.core.style.ZIndex = $hxClasses["cocktail.core.style.ZIndex"] = { __ename__ : ["cocktail","core","style","ZIndex"], __constructs__ : ["cssAuto","integer"] }
cocktail.core.style.ZIndex.cssAuto = ["cssAuto",0];
cocktail.core.style.ZIndex.cssAuto.toString = $estr;
cocktail.core.style.ZIndex.cssAuto.__enum__ = cocktail.core.style.ZIndex;
cocktail.core.style.ZIndex.integer = function(value) { var $x = ["integer",1,value]; $x.__enum__ = cocktail.core.style.ZIndex; $x.toString = $estr; return $x; }
cocktail.core.style.Overflow = $hxClasses["cocktail.core.style.Overflow"] = { __ename__ : ["cocktail","core","style","Overflow"], __constructs__ : ["visible","hidden","scroll","cssAuto"] }
cocktail.core.style.Overflow.visible = ["visible",0];
cocktail.core.style.Overflow.visible.toString = $estr;
cocktail.core.style.Overflow.visible.__enum__ = cocktail.core.style.Overflow;
cocktail.core.style.Overflow.hidden = ["hidden",1];
cocktail.core.style.Overflow.hidden.toString = $estr;
cocktail.core.style.Overflow.hidden.__enum__ = cocktail.core.style.Overflow;
cocktail.core.style.Overflow.scroll = ["scroll",2];
cocktail.core.style.Overflow.scroll.toString = $estr;
cocktail.core.style.Overflow.scroll.__enum__ = cocktail.core.style.Overflow;
cocktail.core.style.Overflow.cssAuto = ["cssAuto",3];
cocktail.core.style.Overflow.cssAuto.toString = $estr;
cocktail.core.style.Overflow.cssAuto.__enum__ = cocktail.core.style.Overflow;
cocktail.core.style.Visibility = $hxClasses["cocktail.core.style.Visibility"] = { __ename__ : ["cocktail","core","style","Visibility"], __constructs__ : ["visible","hidden"] }
cocktail.core.style.Visibility.visible = ["visible",0];
cocktail.core.style.Visibility.visible.toString = $estr;
cocktail.core.style.Visibility.visible.__enum__ = cocktail.core.style.Visibility;
cocktail.core.style.Visibility.hidden = ["hidden",1];
cocktail.core.style.Visibility.hidden.toString = $estr;
cocktail.core.style.Visibility.hidden.__enum__ = cocktail.core.style.Visibility;
cocktail.core.style.Transform = $hxClasses["cocktail.core.style.Transform"] = { __ename__ : ["cocktail","core","style","Transform"], __constructs__ : ["none","transformFunctions"] }
cocktail.core.style.Transform.none = ["none",0];
cocktail.core.style.Transform.none.toString = $estr;
cocktail.core.style.Transform.none.__enum__ = cocktail.core.style.Transform;
cocktail.core.style.Transform.transformFunctions = function(transformFunctions) { var $x = ["transformFunctions",1,transformFunctions]; $x.__enum__ = cocktail.core.style.Transform; $x.toString = $estr; return $x; }
cocktail.core.style.TransformFunction = $hxClasses["cocktail.core.style.TransformFunction"] = { __ename__ : ["cocktail","core","style","TransformFunction"], __constructs__ : ["matrix","translate","translateX","translateY","scale","scaleX","scaleY","rotate","skewX","skewY","skew"] }
cocktail.core.style.TransformFunction.matrix = function(data) { var $x = ["matrix",0,data]; $x.__enum__ = cocktail.core.style.TransformFunction; $x.toString = $estr; return $x; }
cocktail.core.style.TransformFunction.translate = function(tx,ty) { var $x = ["translate",1,tx,ty]; $x.__enum__ = cocktail.core.style.TransformFunction; $x.toString = $estr; return $x; }
cocktail.core.style.TransformFunction.translateX = function(tx) { var $x = ["translateX",2,tx]; $x.__enum__ = cocktail.core.style.TransformFunction; $x.toString = $estr; return $x; }
cocktail.core.style.TransformFunction.translateY = function(ty) { var $x = ["translateY",3,ty]; $x.__enum__ = cocktail.core.style.TransformFunction; $x.toString = $estr; return $x; }
cocktail.core.style.TransformFunction.scale = function(sx,sy) { var $x = ["scale",4,sx,sy]; $x.__enum__ = cocktail.core.style.TransformFunction; $x.toString = $estr; return $x; }
cocktail.core.style.TransformFunction.scaleX = function(sx) { var $x = ["scaleX",5,sx]; $x.__enum__ = cocktail.core.style.TransformFunction; $x.toString = $estr; return $x; }
cocktail.core.style.TransformFunction.scaleY = function(sy) { var $x = ["scaleY",6,sy]; $x.__enum__ = cocktail.core.style.TransformFunction; $x.toString = $estr; return $x; }
cocktail.core.style.TransformFunction.rotate = function(angle) { var $x = ["rotate",7,angle]; $x.__enum__ = cocktail.core.style.TransformFunction; $x.toString = $estr; return $x; }
cocktail.core.style.TransformFunction.skewX = function(angle) { var $x = ["skewX",8,angle]; $x.__enum__ = cocktail.core.style.TransformFunction; $x.toString = $estr; return $x; }
cocktail.core.style.TransformFunction.skewY = function(angle) { var $x = ["skewY",9,angle]; $x.__enum__ = cocktail.core.style.TransformFunction; $x.toString = $estr; return $x; }
cocktail.core.style.TransformFunction.skew = function(angleX,angleY) { var $x = ["skew",10,angleX,angleY]; $x.__enum__ = cocktail.core.style.TransformFunction; $x.toString = $estr; return $x; }
cocktail.core.style.Translation = $hxClasses["cocktail.core.style.Translation"] = { __ename__ : ["cocktail","core","style","Translation"], __constructs__ : ["length","percent"] }
cocktail.core.style.Translation.length = function(value) { var $x = ["length",0,value]; $x.__enum__ = cocktail.core.style.Translation; $x.toString = $estr; return $x; }
cocktail.core.style.Translation.percent = function(value) { var $x = ["percent",1,value]; $x.__enum__ = cocktail.core.style.Translation; $x.toString = $estr; return $x; }
cocktail.core.style.TransformOriginX = $hxClasses["cocktail.core.style.TransformOriginX"] = { __ename__ : ["cocktail","core","style","TransformOriginX"], __constructs__ : ["length","percent","left","center","right"] }
cocktail.core.style.TransformOriginX.length = function(value) { var $x = ["length",0,value]; $x.__enum__ = cocktail.core.style.TransformOriginX; $x.toString = $estr; return $x; }
cocktail.core.style.TransformOriginX.percent = function(value) { var $x = ["percent",1,value]; $x.__enum__ = cocktail.core.style.TransformOriginX; $x.toString = $estr; return $x; }
cocktail.core.style.TransformOriginX.left = ["left",2];
cocktail.core.style.TransformOriginX.left.toString = $estr;
cocktail.core.style.TransformOriginX.left.__enum__ = cocktail.core.style.TransformOriginX;
cocktail.core.style.TransformOriginX.center = ["center",3];
cocktail.core.style.TransformOriginX.center.toString = $estr;
cocktail.core.style.TransformOriginX.center.__enum__ = cocktail.core.style.TransformOriginX;
cocktail.core.style.TransformOriginX.right = ["right",4];
cocktail.core.style.TransformOriginX.right.toString = $estr;
cocktail.core.style.TransformOriginX.right.__enum__ = cocktail.core.style.TransformOriginX;
cocktail.core.style.TransformOriginY = $hxClasses["cocktail.core.style.TransformOriginY"] = { __ename__ : ["cocktail","core","style","TransformOriginY"], __constructs__ : ["length","percent","top","center","bottom"] }
cocktail.core.style.TransformOriginY.length = function(value) { var $x = ["length",0,value]; $x.__enum__ = cocktail.core.style.TransformOriginY; $x.toString = $estr; return $x; }
cocktail.core.style.TransformOriginY.percent = function(value) { var $x = ["percent",1,value]; $x.__enum__ = cocktail.core.style.TransformOriginY; $x.toString = $estr; return $x; }
cocktail.core.style.TransformOriginY.top = ["top",2];
cocktail.core.style.TransformOriginY.top.toString = $estr;
cocktail.core.style.TransformOriginY.top.__enum__ = cocktail.core.style.TransformOriginY;
cocktail.core.style.TransformOriginY.center = ["center",3];
cocktail.core.style.TransformOriginY.center.toString = $estr;
cocktail.core.style.TransformOriginY.center.__enum__ = cocktail.core.style.TransformOriginY;
cocktail.core.style.TransformOriginY.bottom = ["bottom",4];
cocktail.core.style.TransformOriginY.bottom.toString = $estr;
cocktail.core.style.TransformOriginY.bottom.__enum__ = cocktail.core.style.TransformOriginY;
cocktail.core.style.BackgroundImage = $hxClasses["cocktail.core.style.BackgroundImage"] = { __ename__ : ["cocktail","core","style","BackgroundImage"], __constructs__ : ["none","image"] }
cocktail.core.style.BackgroundImage.none = ["none",0];
cocktail.core.style.BackgroundImage.none.toString = $estr;
cocktail.core.style.BackgroundImage.none.__enum__ = cocktail.core.style.BackgroundImage;
cocktail.core.style.BackgroundImage.image = function(value) { var $x = ["image",1,value]; $x.__enum__ = cocktail.core.style.BackgroundImage; $x.toString = $estr; return $x; }
cocktail.core.style.BackgroundRepeatValue = $hxClasses["cocktail.core.style.BackgroundRepeatValue"] = { __ename__ : ["cocktail","core","style","BackgroundRepeatValue"], __constructs__ : ["repeat","space","round","noRepeat"] }
cocktail.core.style.BackgroundRepeatValue.repeat = ["repeat",0];
cocktail.core.style.BackgroundRepeatValue.repeat.toString = $estr;
cocktail.core.style.BackgroundRepeatValue.repeat.__enum__ = cocktail.core.style.BackgroundRepeatValue;
cocktail.core.style.BackgroundRepeatValue.space = ["space",1];
cocktail.core.style.BackgroundRepeatValue.space.toString = $estr;
cocktail.core.style.BackgroundRepeatValue.space.__enum__ = cocktail.core.style.BackgroundRepeatValue;
cocktail.core.style.BackgroundRepeatValue.round = ["round",2];
cocktail.core.style.BackgroundRepeatValue.round.toString = $estr;
cocktail.core.style.BackgroundRepeatValue.round.__enum__ = cocktail.core.style.BackgroundRepeatValue;
cocktail.core.style.BackgroundRepeatValue.noRepeat = ["noRepeat",3];
cocktail.core.style.BackgroundRepeatValue.noRepeat.toString = $estr;
cocktail.core.style.BackgroundRepeatValue.noRepeat.__enum__ = cocktail.core.style.BackgroundRepeatValue;
cocktail.core.style.BackgroundPositionX = $hxClasses["cocktail.core.style.BackgroundPositionX"] = { __ename__ : ["cocktail","core","style","BackgroundPositionX"], __constructs__ : ["length","percent","left","center","right"] }
cocktail.core.style.BackgroundPositionX.length = function(value) { var $x = ["length",0,value]; $x.__enum__ = cocktail.core.style.BackgroundPositionX; $x.toString = $estr; return $x; }
cocktail.core.style.BackgroundPositionX.percent = function(value) { var $x = ["percent",1,value]; $x.__enum__ = cocktail.core.style.BackgroundPositionX; $x.toString = $estr; return $x; }
cocktail.core.style.BackgroundPositionX.left = ["left",2];
cocktail.core.style.BackgroundPositionX.left.toString = $estr;
cocktail.core.style.BackgroundPositionX.left.__enum__ = cocktail.core.style.BackgroundPositionX;
cocktail.core.style.BackgroundPositionX.center = ["center",3];
cocktail.core.style.BackgroundPositionX.center.toString = $estr;
cocktail.core.style.BackgroundPositionX.center.__enum__ = cocktail.core.style.BackgroundPositionX;
cocktail.core.style.BackgroundPositionX.right = ["right",4];
cocktail.core.style.BackgroundPositionX.right.toString = $estr;
cocktail.core.style.BackgroundPositionX.right.__enum__ = cocktail.core.style.BackgroundPositionX;
cocktail.core.style.BackgroundPositionY = $hxClasses["cocktail.core.style.BackgroundPositionY"] = { __ename__ : ["cocktail","core","style","BackgroundPositionY"], __constructs__ : ["length","percent","top","center","bottom"] }
cocktail.core.style.BackgroundPositionY.length = function(value) { var $x = ["length",0,value]; $x.__enum__ = cocktail.core.style.BackgroundPositionY; $x.toString = $estr; return $x; }
cocktail.core.style.BackgroundPositionY.percent = function(value) { var $x = ["percent",1,value]; $x.__enum__ = cocktail.core.style.BackgroundPositionY; $x.toString = $estr; return $x; }
cocktail.core.style.BackgroundPositionY.top = ["top",2];
cocktail.core.style.BackgroundPositionY.top.toString = $estr;
cocktail.core.style.BackgroundPositionY.top.__enum__ = cocktail.core.style.BackgroundPositionY;
cocktail.core.style.BackgroundPositionY.center = ["center",3];
cocktail.core.style.BackgroundPositionY.center.toString = $estr;
cocktail.core.style.BackgroundPositionY.center.__enum__ = cocktail.core.style.BackgroundPositionY;
cocktail.core.style.BackgroundPositionY.bottom = ["bottom",4];
cocktail.core.style.BackgroundPositionY.bottom.toString = $estr;
cocktail.core.style.BackgroundPositionY.bottom.__enum__ = cocktail.core.style.BackgroundPositionY;
cocktail.core.style.BackgroundClip = $hxClasses["cocktail.core.style.BackgroundClip"] = { __ename__ : ["cocktail","core","style","BackgroundClip"], __constructs__ : ["borderBox","paddingBox","contentBox"] }
cocktail.core.style.BackgroundClip.borderBox = ["borderBox",0];
cocktail.core.style.BackgroundClip.borderBox.toString = $estr;
cocktail.core.style.BackgroundClip.borderBox.__enum__ = cocktail.core.style.BackgroundClip;
cocktail.core.style.BackgroundClip.paddingBox = ["paddingBox",1];
cocktail.core.style.BackgroundClip.paddingBox.toString = $estr;
cocktail.core.style.BackgroundClip.paddingBox.__enum__ = cocktail.core.style.BackgroundClip;
cocktail.core.style.BackgroundClip.contentBox = ["contentBox",2];
cocktail.core.style.BackgroundClip.contentBox.toString = $estr;
cocktail.core.style.BackgroundClip.contentBox.__enum__ = cocktail.core.style.BackgroundClip;
cocktail.core.style.BackgroundOrigin = $hxClasses["cocktail.core.style.BackgroundOrigin"] = { __ename__ : ["cocktail","core","style","BackgroundOrigin"], __constructs__ : ["borderBox","paddingBox","contentBox"] }
cocktail.core.style.BackgroundOrigin.borderBox = ["borderBox",0];
cocktail.core.style.BackgroundOrigin.borderBox.toString = $estr;
cocktail.core.style.BackgroundOrigin.borderBox.__enum__ = cocktail.core.style.BackgroundOrigin;
cocktail.core.style.BackgroundOrigin.paddingBox = ["paddingBox",1];
cocktail.core.style.BackgroundOrigin.paddingBox.toString = $estr;
cocktail.core.style.BackgroundOrigin.paddingBox.__enum__ = cocktail.core.style.BackgroundOrigin;
cocktail.core.style.BackgroundOrigin.contentBox = ["contentBox",2];
cocktail.core.style.BackgroundOrigin.contentBox.toString = $estr;
cocktail.core.style.BackgroundOrigin.contentBox.__enum__ = cocktail.core.style.BackgroundOrigin;
cocktail.core.style.BackgroundSize = $hxClasses["cocktail.core.style.BackgroundSize"] = { __ename__ : ["cocktail","core","style","BackgroundSize"], __constructs__ : ["contain","cover","dimensions"] }
cocktail.core.style.BackgroundSize.contain = ["contain",0];
cocktail.core.style.BackgroundSize.contain.toString = $estr;
cocktail.core.style.BackgroundSize.contain.__enum__ = cocktail.core.style.BackgroundSize;
cocktail.core.style.BackgroundSize.cover = ["cover",1];
cocktail.core.style.BackgroundSize.cover.toString = $estr;
cocktail.core.style.BackgroundSize.cover.__enum__ = cocktail.core.style.BackgroundSize;
cocktail.core.style.BackgroundSize.dimensions = function(value) { var $x = ["dimensions",2,value]; $x.__enum__ = cocktail.core.style.BackgroundSize; $x.toString = $estr; return $x; }
cocktail.core.style.BackgroundSizeDimension = $hxClasses["cocktail.core.style.BackgroundSizeDimension"] = { __ename__ : ["cocktail","core","style","BackgroundSizeDimension"], __constructs__ : ["length","percent","cssAuto"] }
cocktail.core.style.BackgroundSizeDimension.length = function(value) { var $x = ["length",0,value]; $x.__enum__ = cocktail.core.style.BackgroundSizeDimension; $x.toString = $estr; return $x; }
cocktail.core.style.BackgroundSizeDimension.percent = function(value) { var $x = ["percent",1,value]; $x.__enum__ = cocktail.core.style.BackgroundSizeDimension; $x.toString = $estr; return $x; }
cocktail.core.style.BackgroundSizeDimension.cssAuto = ["cssAuto",2];
cocktail.core.style.BackgroundSizeDimension.cssAuto.toString = $estr;
cocktail.core.style.BackgroundSizeDimension.cssAuto.__enum__ = cocktail.core.style.BackgroundSizeDimension;
cocktail.core.style.Cursor = $hxClasses["cocktail.core.style.Cursor"] = { __ename__ : ["cocktail","core","style","Cursor"], __constructs__ : ["cssAuto","crosshair","cssDefault","pointer","text"] }
cocktail.core.style.Cursor.cssAuto = ["cssAuto",0];
cocktail.core.style.Cursor.cssAuto.toString = $estr;
cocktail.core.style.Cursor.cssAuto.__enum__ = cocktail.core.style.Cursor;
cocktail.core.style.Cursor.crosshair = ["crosshair",1];
cocktail.core.style.Cursor.crosshair.toString = $estr;
cocktail.core.style.Cursor.crosshair.__enum__ = cocktail.core.style.Cursor;
cocktail.core.style.Cursor.cssDefault = ["cssDefault",2];
cocktail.core.style.Cursor.cssDefault.toString = $estr;
cocktail.core.style.Cursor.cssDefault.__enum__ = cocktail.core.style.Cursor;
cocktail.core.style.Cursor.pointer = ["pointer",3];
cocktail.core.style.Cursor.pointer.toString = $estr;
cocktail.core.style.Cursor.pointer.__enum__ = cocktail.core.style.Cursor;
cocktail.core.style.Cursor.text = ["text",4];
cocktail.core.style.Cursor.text.toString = $estr;
cocktail.core.style.Cursor.text.__enum__ = cocktail.core.style.Cursor;
cocktail.core.style.TransitionProperty = $hxClasses["cocktail.core.style.TransitionProperty"] = { __ename__ : ["cocktail","core","style","TransitionProperty"], __constructs__ : ["none","all","list"] }
cocktail.core.style.TransitionProperty.none = ["none",0];
cocktail.core.style.TransitionProperty.none.toString = $estr;
cocktail.core.style.TransitionProperty.none.__enum__ = cocktail.core.style.TransitionProperty;
cocktail.core.style.TransitionProperty.all = ["all",1];
cocktail.core.style.TransitionProperty.all.toString = $estr;
cocktail.core.style.TransitionProperty.all.__enum__ = cocktail.core.style.TransitionProperty;
cocktail.core.style.TransitionProperty.list = function(value) { var $x = ["list",2,value]; $x.__enum__ = cocktail.core.style.TransitionProperty; $x.toString = $estr; return $x; }
cocktail.core.style.TransitionTimingFunctionValue = $hxClasses["cocktail.core.style.TransitionTimingFunctionValue"] = { __ename__ : ["cocktail","core","style","TransitionTimingFunctionValue"], __constructs__ : ["ease","linear","easeIn","easeOut","easeInOut","stepStart","stepEnd","steps","cubicBezier"] }
cocktail.core.style.TransitionTimingFunctionValue.ease = ["ease",0];
cocktail.core.style.TransitionTimingFunctionValue.ease.toString = $estr;
cocktail.core.style.TransitionTimingFunctionValue.ease.__enum__ = cocktail.core.style.TransitionTimingFunctionValue;
cocktail.core.style.TransitionTimingFunctionValue.linear = ["linear",1];
cocktail.core.style.TransitionTimingFunctionValue.linear.toString = $estr;
cocktail.core.style.TransitionTimingFunctionValue.linear.__enum__ = cocktail.core.style.TransitionTimingFunctionValue;
cocktail.core.style.TransitionTimingFunctionValue.easeIn = ["easeIn",2];
cocktail.core.style.TransitionTimingFunctionValue.easeIn.toString = $estr;
cocktail.core.style.TransitionTimingFunctionValue.easeIn.__enum__ = cocktail.core.style.TransitionTimingFunctionValue;
cocktail.core.style.TransitionTimingFunctionValue.easeOut = ["easeOut",3];
cocktail.core.style.TransitionTimingFunctionValue.easeOut.toString = $estr;
cocktail.core.style.TransitionTimingFunctionValue.easeOut.__enum__ = cocktail.core.style.TransitionTimingFunctionValue;
cocktail.core.style.TransitionTimingFunctionValue.easeInOut = ["easeInOut",4];
cocktail.core.style.TransitionTimingFunctionValue.easeInOut.toString = $estr;
cocktail.core.style.TransitionTimingFunctionValue.easeInOut.__enum__ = cocktail.core.style.TransitionTimingFunctionValue;
cocktail.core.style.TransitionTimingFunctionValue.stepStart = ["stepStart",5];
cocktail.core.style.TransitionTimingFunctionValue.stepStart.toString = $estr;
cocktail.core.style.TransitionTimingFunctionValue.stepStart.__enum__ = cocktail.core.style.TransitionTimingFunctionValue;
cocktail.core.style.TransitionTimingFunctionValue.stepEnd = ["stepEnd",6];
cocktail.core.style.TransitionTimingFunctionValue.stepEnd.toString = $estr;
cocktail.core.style.TransitionTimingFunctionValue.stepEnd.__enum__ = cocktail.core.style.TransitionTimingFunctionValue;
cocktail.core.style.TransitionTimingFunctionValue.steps = function(intervalNumbers,intervalChange) { var $x = ["steps",7,intervalNumbers,intervalChange]; $x.__enum__ = cocktail.core.style.TransitionTimingFunctionValue; $x.toString = $estr; return $x; }
cocktail.core.style.TransitionTimingFunctionValue.cubicBezier = function(x1,y1,x2,y2) { var $x = ["cubicBezier",8,x1,y1,x2,y2]; $x.__enum__ = cocktail.core.style.TransitionTimingFunctionValue; $x.toString = $estr; return $x; }
cocktail.core.style.IntervalChangeValue = $hxClasses["cocktail.core.style.IntervalChangeValue"] = { __ename__ : ["cocktail","core","style","IntervalChangeValue"], __constructs__ : ["start","end"] }
cocktail.core.style.IntervalChangeValue.start = ["start",0];
cocktail.core.style.IntervalChangeValue.start.toString = $estr;
cocktail.core.style.IntervalChangeValue.start.__enum__ = cocktail.core.style.IntervalChangeValue;
cocktail.core.style.IntervalChangeValue.end = ["end",1];
cocktail.core.style.IntervalChangeValue.end.toString = $estr;
cocktail.core.style.IntervalChangeValue.end.__enum__ = cocktail.core.style.IntervalChangeValue;
cocktail.core.style.adapter = {}
cocktail.core.style.adapter.Style = function(coreStyle) {
	this._coreStyle = coreStyle;
	this.attributes = new cocktail.core.dom.NamedNodeMap();
};
$hxClasses["cocktail.core.style.adapter.Style"] = cocktail.core.style.adapter.Style;
cocktail.core.style.adapter.Style.__name__ = ["cocktail","core","style","adapter","Style"];
cocktail.core.style.adapter.Style.prototype = {
	set_transformOrigin: function(value) {
		this.setAttribute("transform-origin",value);
		this._coreStyle.setTransformOrigin(cocktail.core.unit.UnitManager.getTransformOrigin(value));
		return value;
	}
	,get_transformOrigin: function() {
		return cocktail.core.unit.UnitManager.getCSSTransformOrigin(this._coreStyle.transformOrigin);
	}
	,set_transform: function(value) {
		this.setAttribute("transform",value);
		this._coreStyle.setTransform(cocktail.core.unit.UnitManager.getTransform(value));
		return value;
	}
	,get_transform: function() {
		return cocktail.core.unit.UnitManager.getCSSTransform(this._coreStyle.transform);
	}
	,set_transitionTimingFunction: function(value) {
		this.setAttribute("transition-timing-function",value);
		this._coreStyle.setTransitionTimingFunction(cocktail.core.unit.UnitManager.getTransitionTimingFunction(value));
		return value;
	}
	,get_transitionTimingFunction: function() {
		return cocktail.core.unit.UnitManager.getCSSTransitionTimingFunction(this._coreStyle.transitionTimingFunction);
	}
	,set_transitionDelay: function(value) {
		this.setAttribute("transition-delay",value);
		this._coreStyle.setTransitionDelay(cocktail.core.unit.UnitManager.getTransitionDelay(value));
		return value;
	}
	,get_transitionDelay: function() {
		return cocktail.core.unit.UnitManager.getCSSTransitionDelay(this._coreStyle.transitionDelay);
	}
	,set_transitionDuration: function(value) {
		this.setAttribute("transition-duration",value);
		this._coreStyle.setTransitionDuration(cocktail.core.unit.UnitManager.getTransitionDuration(value));
		return value;
	}
	,get_transitionDuration: function() {
		return cocktail.core.unit.UnitManager.getCSSTransitionDuration(this._coreStyle.transitionDuration);
	}
	,set_transitionProperty: function(value) {
		this.setAttribute("transition-property",value);
		this._coreStyle.setTransitionProperty(cocktail.core.unit.UnitManager.getTransitionProperty(value));
		return value;
	}
	,get_transitionProperty: function() {
		return cocktail.core.unit.UnitManager.getCSSTransitionProperty(this._coreStyle.transitionProperty);
	}
	,get_cursor: function() {
		return cocktail.core.unit.UnitManager.getCSSCursor(this._coreStyle.cursor);
	}
	,set_cursor: function(value) {
		this.setAttribute("cursor",value);
		this._coreStyle.setCursor(cocktail.core.unit.UnitManager.cursorEnum(value));
		return value;
	}
	,set_overflowY: function(value) {
		this.setAttribute("overflow-y",value);
		this._coreStyle.setOverflowY(cocktail.core.unit.UnitManager.overflowEnum(value));
		return cocktail.core.unit.UnitManager.getCSSOverflow(this._coreStyle.overflowY);
	}
	,get_overflowY: function() {
		return cocktail.core.unit.UnitManager.getCSSOverflow(this._coreStyle.overflowY);
	}
	,set_overflowX: function(value) {
		this.setAttribute("overflow-x",value);
		this._coreStyle.setOverflowX(cocktail.core.unit.UnitManager.overflowEnum(value));
		return value;
	}
	,get_overflowX: function() {
		return cocktail.core.unit.UnitManager.getCSSOverflow(this._coreStyle.overflowX);
	}
	,get_backgroundOrigin: function() {
		return cocktail.core.unit.UnitManager.getCSSBackgroundOrigin(this._coreStyle.backgroundOrigin);
	}
	,set_backgroundOrigin: function(value) {
		this.setAttribute("background-origin",value);
		this._coreStyle.setBackgroundOrigin(cocktail.core.unit.UnitManager.backgroundOriginEnum(value));
		return value;
	}
	,get_backgroundPosition: function() {
		return cocktail.core.unit.UnitManager.getCSSBackgroundPosition(this._coreStyle.backgroundPosition);
	}
	,set_backgroundPosition: function(value) {
		this.setAttribute("background-position",value);
		this._coreStyle.setBackgroundPosition(cocktail.core.unit.UnitManager.backgroundPositionEnum(value));
		return value;
	}
	,get_backgroundClip: function() {
		return cocktail.core.unit.UnitManager.getCSSBackgroundClip(this._coreStyle.backgroundClip);
	}
	,set_backgroundClip: function(value) {
		this.setAttribute("background-clip",value);
		this._coreStyle.setBackgroundClip(cocktail.core.unit.UnitManager.backgroundClipEnum(value));
		return value;
	}
	,get_backgroundSize: function() {
		return cocktail.core.unit.UnitManager.getCSSBackgroundSize(this._coreStyle.backgroundSize);
	}
	,set_backgroundSize: function(value) {
		this.setAttribute("background-size",value);
		this._coreStyle.setBackgroundSize(cocktail.core.unit.UnitManager.backgroundSizeEnum(value));
		return value;
	}
	,get_backgroundRepeat: function() {
		return cocktail.core.unit.UnitManager.getCSSBackgroundRepeat(this._coreStyle.backgroundRepeat);
	}
	,set_backgroundRepeat: function(value) {
		this.setAttribute("background-repeat",value);
		this._coreStyle.setBackgroundRepeat(cocktail.core.unit.UnitManager.backgroundRepeatEnum(value));
		return value;
	}
	,get_backgroundImage: function() {
		return cocktail.core.unit.UnitManager.getCSSBackgroundImage(this._coreStyle.backgroundImage);
	}
	,set_backgroundImage: function(value) {
		this.setAttribute("background-image",value);
		this._coreStyle.setBackgroundImage(cocktail.core.unit.UnitManager.backgroundImageEnum(value));
		return value;
	}
	,get_backgroundColor: function() {
		return cocktail.core.unit.UnitManager.getCSSColor(this._coreStyle.backgroundColor);
	}
	,set_backgroundColor: function(value) {
		this.setAttribute("background-color",value);
		this._coreStyle.setBackgroundColor(cocktail.core.unit.UnitManager.colorEnum(value));
		return value;
	}
	,set_textAlign: function(value) {
		this.setAttribute("text-align",value);
		this._coreStyle.setTextAlign(cocktail.core.unit.UnitManager.textAlignEnum(value));
		return value;
	}
	,get_textAlign: function() {
		return cocktail.core.unit.UnitManager.getCSSTextAlign(this._coreStyle.textAlign);
	}
	,set_whiteSpace: function(value) {
		this.setAttribute("white-space",value);
		this._coreStyle.setWhiteSpace(cocktail.core.unit.UnitManager.whiteSpaceEnum(value));
		return value;
	}
	,get_whiteSpace: function() {
		return cocktail.core.unit.UnitManager.getCSSWhiteSpace(this._coreStyle.whiteSpace);
	}
	,set_textIndent: function(value) {
		this.setAttribute("text-indent",value);
		this._coreStyle.setTextIndent(cocktail.core.unit.UnitManager.textIndentEnum(value));
		return value;
	}
	,get_textIndent: function() {
		return cocktail.core.unit.UnitManager.getCSSTextIndent(this._coreStyle.textIndent);
	}
	,set_verticalAlign: function(value) {
		this.setAttribute("vertical-align",value);
		this._coreStyle.setVerticalAlign(cocktail.core.unit.UnitManager.verticalAlignEnum(value));
		return value;
	}
	,get_verticalAlign: function() {
		return cocktail.core.unit.UnitManager.getCSSVerticalAlign(this._coreStyle.verticalAlign);
	}
	,set_lineHeight: function(value) {
		this.setAttribute("line-height",value);
		this._coreStyle.setLineHeight(cocktail.core.unit.UnitManager.lineHeightEnum(value));
		return value;
	}
	,get_lineHeight: function() {
		return cocktail.core.unit.UnitManager.getCSSLineHeight(this._coreStyle.lineHeight);
	}
	,set_wordSpacing: function(value) {
		this.setAttribute("word-spacing",value);
		this._coreStyle.setWordSpacing(cocktail.core.unit.UnitManager.wordSpacingEnum(value));
		return value;
	}
	,get_wordSpacing: function() {
		return cocktail.core.unit.UnitManager.getCSSWordSpacing(this._coreStyle.wordSpacing);
	}
	,set_color: function(value) {
		this.setAttribute("color",value);
		this._coreStyle.setColor(cocktail.core.unit.UnitManager.colorEnum(value));
		return value;
	}
	,get_color: function() {
		return cocktail.core.unit.UnitManager.getCSSColor(this._coreStyle.color);
	}
	,set_letterSpacing: function(value) {
		this.setAttribute("letter-spacing",value);
		this._coreStyle.setLetterSpacing(cocktail.core.unit.UnitManager.letterSpacingEnum(value));
		return value;
	}
	,get_letterSpacing: function() {
		return cocktail.core.unit.UnitManager.getCSSLetterSpacing(this._coreStyle.letterSpacing);
	}
	,set_textTransform: function(value) {
		this.setAttribute("text-tranform",value);
		this._coreStyle.setTextTransform(cocktail.core.unit.UnitManager.textTransformEnum(value));
		return value;
	}
	,get_textTransform: function() {
		return cocktail.core.unit.UnitManager.getCSSTextTransform(this._coreStyle.textTransform);
	}
	,set_fontVariant: function(value) {
		this.setAttribute("font-variant",value);
		this._coreStyle.setFontVariant(cocktail.core.unit.UnitManager.fontVariantEnum(value));
		return value;
	}
	,get_fontVariant: function() {
		return cocktail.core.unit.UnitManager.getCSSFontVariant(this._coreStyle.fontVariant);
	}
	,set_fontFamily: function(value) {
		this.setAttribute("font-family",value);
		this._coreStyle.setFontFamily(cocktail.core.unit.UnitManager.fontFamilyEnum(value));
		return value;
	}
	,get_fontFamily: function() {
		return cocktail.core.unit.UnitManager.getCSSFontFamily(this._coreStyle.fontFamily);
	}
	,set_fontStyle: function(value) {
		this.setAttribute("font-style",value);
		this._coreStyle.setFontStyle(cocktail.core.unit.UnitManager.fontStyleEnum(value));
		return value;
	}
	,get_fontStyle: function() {
		return cocktail.core.unit.UnitManager.getCSSFontStyle(this._coreStyle.fontStyle);
	}
	,set_fontWeight: function(value) {
		this.setAttribute("font-weight",value);
		this._coreStyle.setFontWeight(cocktail.core.unit.UnitManager.fontWeightEnum(value));
		return value;
	}
	,get_fontWeight: function() {
		return cocktail.core.unit.UnitManager.getCSSFontWeight(this._coreStyle.fontWeight);
	}
	,set_fontSize: function(value) {
		this.setAttribute("font-size",value);
		this._coreStyle.setFontSize(cocktail.core.unit.UnitManager.fontSizeEnum(value));
		return value;
	}
	,get_fontSize: function() {
		return cocktail.core.unit.UnitManager.getCSSFontSize(this._coreStyle.fontSize);
	}
	,set_clear: function(value) {
		this.setAttribute("clear",value);
		this._coreStyle.setClear(cocktail.core.unit.UnitManager.clearEnum(value));
		return value;
	}
	,get_clear: function() {
		return cocktail.core.unit.UnitManager.getCSSClear(this._coreStyle.clear);
	}
	,set_CSSFloat: function(value) {
		this.setAttribute("float",value);
		this._coreStyle.setCSSFloat(cocktail.core.unit.UnitManager.cssFloatEnum(value));
		return value;
	}
	,get_CSSFloat: function() {
		return cocktail.core.unit.UnitManager.getCSSFloatAsString(this._coreStyle.cssFloat);
	}
	,set_right: function(value) {
		this.setAttribute("right",value);
		this._coreStyle.setRight(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.PositionOffset,value));
		return value;
	}
	,get_right: function() {
		return cocktail.core.unit.UnitManager.getCSSPositionOffset(this._coreStyle.right);
	}
	,set_bottom: function(value) {
		this.setAttribute("bottom",value);
		this._coreStyle.setBottom(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.PositionOffset,value));
		return value;
	}
	,get_bottom: function() {
		return cocktail.core.unit.UnitManager.getCSSPositionOffset(this._coreStyle.bottom);
	}
	,set_left: function(value) {
		this.setAttribute("left",value);
		this._coreStyle.setLeft(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.PositionOffset,value));
		return value;
	}
	,get_left: function() {
		return cocktail.core.unit.UnitManager.getCSSPositionOffset(this._coreStyle.left);
	}
	,set_top: function(value) {
		this.setAttribute("top",value);
		this._coreStyle.setTop(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.PositionOffset,value));
		return value;
	}
	,get_top: function() {
		return cocktail.core.unit.UnitManager.getCSSPositionOffset(this._coreStyle.top);
	}
	,set_maxWidth: function(value) {
		this.setAttribute("max-width",value);
		this._coreStyle.setMaxWidth(cocktail.core.unit.UnitManager.constrainedDimensionEnum(value));
		return value;
	}
	,get_maxWidth: function() {
		return cocktail.core.unit.UnitManager.getCSSConstrainedDimension(this._coreStyle.maxWidth);
	}
	,set_minWidth: function(value) {
		this.setAttribute("min-width",value);
		this._coreStyle.setMinWidth(cocktail.core.unit.UnitManager.constrainedDimensionEnum(value));
		return value;
	}
	,get_minWidth: function() {
		return cocktail.core.unit.UnitManager.getCSSConstrainedDimension(this._coreStyle.minWidth);
	}
	,set_maxHeight: function(value) {
		this.setAttribute("max-height",value);
		this._coreStyle.setMaxHeight(cocktail.core.unit.UnitManager.constrainedDimensionEnum(value));
		return value;
	}
	,get_maxHeight: function() {
		return cocktail.core.unit.UnitManager.getCSSConstrainedDimension(this._coreStyle.maxHeight);
	}
	,set_minHeight: function(value) {
		this.setAttribute("min-height",value);
		this._coreStyle.setMinHeight(cocktail.core.unit.UnitManager.constrainedDimensionEnum(value));
		return value;
	}
	,get_minHeight: function() {
		return cocktail.core.unit.UnitManager.getCSSConstrainedDimension(this._coreStyle.minHeight);
	}
	,set_height: function(value) {
		this.setAttribute("height",value);
		this._coreStyle.setHeight(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Dimension,value));
		return value;
	}
	,get_height: function() {
		return cocktail.core.unit.UnitManager.getCSSDimension(this._coreStyle.height);
	}
	,set_width: function(value) {
		this.setAttribute("width",value);
		this._coreStyle.setWidth(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Dimension,value));
		return value;
	}
	,get_width: function() {
		return cocktail.core.unit.UnitManager.getCSSDimension(this._coreStyle.width);
	}
	,set_zIndex: function(value) {
		this.setAttribute("z-index",value);
		this._coreStyle.setZIndex(cocktail.core.unit.UnitManager.zIndexEnum(value));
		return value;
	}
	,get_zIndex: function() {
		return cocktail.core.unit.UnitManager.getCSSZIndex(this._coreStyle.zIndex);
	}
	,set_position: function(value) {
		this.setAttribute("position",value);
		this._coreStyle.setPosition(cocktail.core.unit.UnitManager.positionEnum(value));
		return value;
	}
	,get_position: function() {
		return cocktail.core.unit.UnitManager.getCSSPosition(this._coreStyle.position);
	}
	,set_display: function(value) {
		this.setAttribute("display",value);
		this._coreStyle.setDisplay(cocktail.core.unit.UnitManager.displayEnum(value));
		return value;
	}
	,get_display: function() {
		return cocktail.core.unit.UnitManager.getCSSDisplay(this._coreStyle.display);
	}
	,set_paddingBottom: function(value) {
		this.setAttribute("padding-bottom",value);
		this._coreStyle.setPaddingBottom(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Padding,value));
		return value;
	}
	,get_paddingBottom: function() {
		return cocktail.core.unit.UnitManager.getCSSPadding(this._coreStyle.paddingBottom);
	}
	,set_paddingTop: function(value) {
		this.setAttribute("padding-top",value);
		this._coreStyle.setPaddingTop(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Padding,value));
		return value;
	}
	,get_paddingTop: function() {
		return cocktail.core.unit.UnitManager.getCSSPadding(this._coreStyle.paddingTop);
	}
	,set_paddingRight: function(value) {
		this.setAttribute("padding-right",value);
		this._coreStyle.setPaddingRight(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Padding,value));
		return value;
	}
	,get_paddingRight: function() {
		return cocktail.core.unit.UnitManager.getCSSPadding(this._coreStyle.paddingRight);
	}
	,set_paddingLeft: function(value) {
		this.setAttribute("padding-left",value);
		this._coreStyle.setPaddingLeft(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Padding,value));
		return value;
	}
	,get_paddingLeft: function() {
		return cocktail.core.unit.UnitManager.getCSSPadding(this._coreStyle.paddingLeft);
	}
	,set_marginBottom: function(value) {
		this.setAttribute("margin-bottom",value);
		this._coreStyle.setMarginBottom(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Margin,value));
		return value;
	}
	,get_marginBottom: function() {
		return cocktail.core.unit.UnitManager.getCSSMargin(this._coreStyle.marginBottom);
	}
	,set_marginTop: function(value) {
		this.setAttribute("margin-top",value);
		this._coreStyle.setMarginTop(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Margin,value));
		return value;
	}
	,get_marginTop: function() {
		return cocktail.core.unit.UnitManager.getCSSMargin(this._coreStyle.marginTop);
	}
	,set_marginRight: function(value) {
		this.setAttribute("margin-right",value);
		this._coreStyle.setMarginRight(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Margin,value));
		return value;
	}
	,get_marginRight: function() {
		return cocktail.core.unit.UnitManager.getCSSMargin(this._coreStyle.marginRight);
	}
	,set_marginLeft: function(value) {
		this.setAttribute("margin-left",value);
		this._coreStyle.setMarginLeft(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Margin,value));
		return value;
	}
	,get_marginLeft: function() {
		return cocktail.core.unit.UnitManager.getCSSMargin(this._coreStyle.marginLeft);
	}
	,set_visibility: function(value) {
		this.setAttribute("visibility",value);
		this._coreStyle.setVisibility(cocktail.core.unit.UnitManager.visibilityEnum(value));
		return value;
	}
	,get_visibility: function() {
		return cocktail.core.unit.UnitManager.getCSSVisibility(this._coreStyle.visibility);
	}
	,set_opacity: function(value) {
		this.setAttribute("opacity",value);
		this._coreStyle.setOpacity(Std.parseFloat(value));
		return value;
	}
	,get_opacity: function() {
		return cocktail.core.unit.UnitManager.getCSSOpacity(this._coreStyle.opacity);
	}
	,setAttribute: function(name,value) {
		if(value == null) {
			this.attributes.removeNamedItem(name);
			return;
		}
		var attr = new cocktail.core.dom.Attr(name);
		attr.set_value(value);
		this.attributes.setNamedItem(attr);
	}
	,attributes: null
	,_coreStyle: null
	,cursor: null
	,transformOrigin: null
	,transform: null
	,transitionDelay: null
	,transitionTimingFunction: null
	,transitionDuration: null
	,transitionProperty: null
	,overflowY: null
	,overflowX: null
	,visibility: null
	,opacity: null
	,verticalAlign: null
	,textIndent: null
	,textAlign: null
	,whiteSpace: null
	,wordSpacing: null
	,letterSpacing: null
	,textTransform: null
	,lineHeight: null
	,color: null
	,fontVariant: null
	,fontFamily: null
	,fontStyle: null
	,fontWeight: null
	,fontSize: null
	,backgroundClip: null
	,backgroundPosition: null
	,backgroundSize: null
	,backgroundOrigin: null
	,backgroundRepeat: null
	,backgroundImage: null
	,backgroundColor: null
	,right: null
	,bottom: null
	,left: null
	,top: null
	,maxWidth: null
	,minWidth: null
	,maxHeight: null
	,minHeight: null
	,height: null
	,width: null
	,paddingBottom: null
	,paddingTop: null
	,paddingRight: null
	,paddingLeft: null
	,marginBottom: null
	,marginTop: null
	,marginRight: null
	,marginLeft: null
	,zIndex: null
	,clear: null
	,cssFloat: null
	,position: null
	,display: null
	,__class__: cocktail.core.style.adapter.Style
	,__properties__: {set_display:"set_display",get_display:"get_display",set_position:"set_position",get_position:"get_position",set_cssFloat:"set_CSSFloat",get_cssFloat:"get_CSSFloat",set_clear:"set_clear",get_clear:"get_clear",set_zIndex:"set_zIndex",get_zIndex:"get_zIndex",set_marginLeft:"set_marginLeft",get_marginLeft:"get_marginLeft",set_marginRight:"set_marginRight",get_marginRight:"get_marginRight",set_marginTop:"set_marginTop",get_marginTop:"get_marginTop",set_marginBottom:"set_marginBottom",get_marginBottom:"get_marginBottom",set_paddingLeft:"set_paddingLeft",get_paddingLeft:"get_paddingLeft",set_paddingRight:"set_paddingRight",get_paddingRight:"get_paddingRight",set_paddingTop:"set_paddingTop",get_paddingTop:"get_paddingTop",set_paddingBottom:"set_paddingBottom",get_paddingBottom:"get_paddingBottom",set_width:"set_width",get_width:"get_width",set_height:"set_height",get_height:"get_height",set_minHeight:"set_minHeight",get_minHeight:"get_minHeight",set_maxHeight:"set_maxHeight",get_maxHeight:"get_maxHeight",set_minWidth:"set_minWidth",get_minWidth:"get_minWidth",set_maxWidth:"set_maxWidth",get_maxWidth:"get_maxWidth",set_top:"set_top",get_top:"get_top",set_left:"set_left",get_left:"get_left",set_bottom:"set_bottom",get_bottom:"get_bottom",set_right:"set_right",get_right:"get_right",set_backgroundColor:"set_backgroundColor",get_backgroundColor:"get_backgroundColor",set_backgroundImage:"set_backgroundImage",get_backgroundImage:"get_backgroundImage",set_backgroundRepeat:"set_backgroundRepeat",get_backgroundRepeat:"get_backgroundRepeat",set_backgroundOrigin:"set_backgroundOrigin",get_backgroundOrigin:"get_backgroundOrigin",set_backgroundSize:"set_backgroundSize",get_backgroundSize:"get_backgroundSize",set_backgroundPosition:"set_backgroundPosition",get_backgroundPosition:"get_backgroundPosition",set_backgroundClip:"set_backgroundClip",get_backgroundClip:"get_backgroundClip",set_fontSize:"set_fontSize",get_fontSize:"get_fontSize",set_fontWeight:"set_fontWeight",get_fontWeight:"get_fontWeight",set_fontStyle:"set_fontStyle",get_fontStyle:"get_fontStyle",set_fontFamily:"set_fontFamily",get_fontFamily:"get_fontFamily",set_fontVariant:"set_fontVariant",get_fontVariant:"get_fontVariant",set_color:"set_color",get_color:"get_color",set_lineHeight:"set_lineHeight",get_lineHeight:"get_lineHeight",set_textTransform:"set_textTransform",get_textTransform:"get_textTransform",set_letterSpacing:"set_letterSpacing",get_letterSpacing:"get_letterSpacing",set_wordSpacing:"set_wordSpacing",get_wordSpacing:"get_wordSpacing",set_whiteSpace:"set_whiteSpace",get_whiteSpace:"get_whiteSpace",set_textAlign:"set_textAlign",get_textAlign:"get_textAlign",set_textIndent:"set_textIndent",get_textIndent:"get_textIndent",set_verticalAlign:"set_verticalAlign",get_verticalAlign:"get_verticalAlign",set_opacity:"set_opacity",get_opacity:"get_opacity",set_visibility:"set_visibility",get_visibility:"get_visibility",set_overflowX:"set_overflowX",get_overflowX:"get_overflowX",set_overflowY:"set_overflowY",get_overflowY:"get_overflowY",set_transitionProperty:"set_transitionProperty",get_transitionProperty:"get_transitionProperty",set_transitionDuration:"set_transitionDuration",get_transitionDuration:"get_transitionDuration",set_transitionTimingFunction:"set_transitionTimingFunction",get_transitionTimingFunction:"get_transitionTimingFunction",set_transitionDelay:"set_transitionDelay",get_transitionDelay:"get_transitionDelay",set_transform:"set_transform",get_transform:"get_transform",set_transformOrigin:"set_transformOrigin",get_transformOrigin:"get_transformOrigin",set_cursor:"set_cursor",get_cursor:"get_cursor"}
}
cocktail.core.style.computer = {}
cocktail.core.style.computer.BackgroundStylesComputer = function() {
};
$hxClasses["cocktail.core.style.computer.BackgroundStylesComputer"] = cocktail.core.style.computer.BackgroundStylesComputer;
cocktail.core.style.computer.BackgroundStylesComputer.__name__ = ["cocktail","core","style","computer","BackgroundStylesComputer"];
cocktail.core.style.computer.BackgroundStylesComputer.compute = function(style) {
	style.computedStyle.backgroundColor = cocktail.core.style.computer.BackgroundStylesComputer.getComputedBackgroundColor(style);
}
cocktail.core.style.computer.BackgroundStylesComputer.computeIndividualBackground = function(style,backgroundBox,intrinsicWidth,intrinsicHeight,intrinsicRatio,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage) {
	var fontMetrics = style.get_fontMetricsData();
	var backgroundPositioningArea = cocktail.core.style.computer.BackgroundStylesComputer.getBackgroundPositioningArea(style,backgroundOrigin,backgroundBox);
	var computedBackgroundSize = cocktail.core.style.computer.BackgroundStylesComputer.getComputedBackgroundSize(backgroundSize,backgroundPositioningArea,intrinsicWidth,intrinsicHeight,intrinsicRatio,fontMetrics.fontSize,fontMetrics.xHeight);
	var computedBackgroundPosition = cocktail.core.style.computer.BackgroundStylesComputer.getComputedBackgroundPosition(backgroundPosition,backgroundPositioningArea,computedBackgroundSize,fontMetrics.fontSize,fontMetrics.xHeight);
	var computedBackgroundClip = cocktail.core.style.computer.BackgroundStylesComputer.getBackgroundPaintingArea(style,backgroundClip,backgroundBox);
	var computedBackgroundStyle = { backgroundOrigin : backgroundPositioningArea, backgroundClip : computedBackgroundClip, backgroundRepeat : backgroundRepeat, backgroundImage : backgroundImage, backgroundSize : computedBackgroundSize, backgroundPosition : computedBackgroundPosition};
	return computedBackgroundStyle;
}
cocktail.core.style.computer.BackgroundStylesComputer.getComputedBackgroundColor = function(style) {
	var computedColor;
	computedColor = cocktail.core.unit.UnitManager.getColorDataFromCSSColor(style.backgroundColor);
	return computedColor;
}
cocktail.core.style.computer.BackgroundStylesComputer.getComputedBackgroundPosition = function(backgroundPosition,backgroundPositioningArea,computedBackgroundSize,emReference,exReference) {
	var computedBackgroundXPosition = cocktail.core.style.computer.BackgroundStylesComputer.getComputedBackgroundXPosition(backgroundPosition.x,backgroundPositioningArea.width,computedBackgroundSize.width,emReference,exReference);
	var computedBackgroundYPosition = cocktail.core.style.computer.BackgroundStylesComputer.getComputedBackgroundYPosition(backgroundPosition.y,backgroundPositioningArea.height,computedBackgroundSize.height,emReference,exReference);
	var computedBackgroundPosition = { x : computedBackgroundXPosition, y : computedBackgroundYPosition};
	return computedBackgroundPosition;
}
cocktail.core.style.computer.BackgroundStylesComputer.getComputedBackgroundXPosition = function(backgroundPosition,backgroundPositioningAreaDimension,imageDimension,emReference,exReference) {
	var computedBackgroundXPosition;
	var $e = (backgroundPosition);
	switch( $e[1] ) {
	case 0:
		var value = $e[2];
		computedBackgroundXPosition = cocktail.core.unit.UnitManager.getPixelFromLength(value,emReference,exReference);
		break;
	case 1:
		var value = $e[2];
		computedBackgroundXPosition = cocktail.core.unit.UnitManager.getPixelFromPercent(value,backgroundPositioningAreaDimension - imageDimension);
		break;
	case 3:
		computedBackgroundXPosition = cocktail.core.unit.UnitManager.getPixelFromPercent(50,backgroundPositioningAreaDimension - imageDimension);
		break;
	case 2:
		computedBackgroundXPosition = cocktail.core.unit.UnitManager.getPixelFromPercent(0,backgroundPositioningAreaDimension - imageDimension);
		break;
	case 4:
		computedBackgroundXPosition = cocktail.core.unit.UnitManager.getPixelFromPercent(100,backgroundPositioningAreaDimension - imageDimension);
		break;
	}
	return computedBackgroundXPosition;
}
cocktail.core.style.computer.BackgroundStylesComputer.getComputedBackgroundYPosition = function(backgroundPosition,backgroundPositioningAreaDimension,imageDimension,emReference,exReference) {
	var computedBackgroundYPosition;
	var $e = (backgroundPosition);
	switch( $e[1] ) {
	case 0:
		var value = $e[2];
		computedBackgroundYPosition = cocktail.core.unit.UnitManager.getPixelFromLength(value,emReference,exReference);
		break;
	case 1:
		var value = $e[2];
		computedBackgroundYPosition = cocktail.core.unit.UnitManager.getPixelFromPercent(value,backgroundPositioningAreaDimension - imageDimension);
		break;
	case 3:
		computedBackgroundYPosition = cocktail.core.unit.UnitManager.getPixelFromPercent(50,backgroundPositioningAreaDimension - imageDimension);
		break;
	case 2:
		computedBackgroundYPosition = cocktail.core.unit.UnitManager.getPixelFromPercent(0,backgroundPositioningAreaDimension - imageDimension);
		break;
	case 4:
		computedBackgroundYPosition = cocktail.core.unit.UnitManager.getPixelFromPercent(100,backgroundPositioningAreaDimension - imageDimension);
		break;
	}
	return computedBackgroundYPosition;
}
cocktail.core.style.computer.BackgroundStylesComputer.getComputedBackgroundSize = function(backgroundSize,backgroundPositioningArea,intrinsicWidth,intrinsicHeight,intrinsicRatio,emReference,exReference) {
	var computedBackgroundSize;
	var $e = (backgroundSize);
	switch( $e[1] ) {
	case 0:
		if(intrinsicRatio != null) {
			var ratio = intrinsicRatio / (backgroundPositioningArea.width / backgroundPositioningArea.height);
			computedBackgroundSize = { width : intrinsicWidth * ratio, height : intrinsicHeight * ratio};
		} else computedBackgroundSize = { width : backgroundPositioningArea.width, height : backgroundPositioningArea.height};
		break;
	case 1:
		if(intrinsicRatio != null) {
			var ratio = backgroundPositioningArea.width / backgroundPositioningArea.height / intrinsicRatio;
			computedBackgroundSize = { width : intrinsicWidth * ratio, height : intrinsicHeight * ratio};
		} else computedBackgroundSize = { width : backgroundPositioningArea.width, height : backgroundPositioningArea.height};
		break;
	case 2:
		var value = $e[2];
		computedBackgroundSize = { width : cocktail.core.style.computer.BackgroundStylesComputer.getBackgroundSizeStyleDimensionData(value.x,value.y,backgroundPositioningArea.width,backgroundPositioningArea.height,intrinsicWidth,intrinsicHeight,intrinsicRatio,emReference,exReference), height : cocktail.core.style.computer.BackgroundStylesComputer.getBackgroundSizeStyleDimensionData(value.y,value.x,backgroundPositioningArea.height,backgroundPositioningArea.width,intrinsicHeight,intrinsicWidth,intrinsicRatio,emReference,exReference)};
		break;
	}
	return computedBackgroundSize;
}
cocktail.core.style.computer.BackgroundStylesComputer.getBackgroundSizeStyleDimensionData = function(value,opositeBackgroundSizeValue,backgroundPositioningAreaDimension,opositeBackgroundAreaDimension,intrinsicDimension,opositeIntrinsicDimension,intrinsicRatio,emReference,exReference) {
	var backgroundSizeStyleDimension;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var value1 = $e[2];
		backgroundSizeStyleDimension = cocktail.core.unit.UnitManager.getPixelFromLength(value1,emReference,exReference);
		break;
	case 1:
		var value1 = $e[2];
		backgroundSizeStyleDimension = cocktail.core.unit.UnitManager.getPixelFromPercent(value1,backgroundPositioningAreaDimension);
		break;
	case 2:
		if(intrinsicDimension != null && opositeBackgroundSizeValue == cocktail.core.style.BackgroundSizeDimension.cssAuto) backgroundSizeStyleDimension = intrinsicDimension; else if(opositeIntrinsicDimension != null && intrinsicRatio != null) {
			var opositeDimension = cocktail.core.style.computer.BackgroundStylesComputer.getBackgroundSizeStyleDimensionData(opositeBackgroundSizeValue,value,opositeBackgroundAreaDimension,backgroundPositioningAreaDimension,opositeIntrinsicDimension,intrinsicDimension,intrinsicRatio,emReference,exReference);
			backgroundSizeStyleDimension = opositeDimension * intrinsicRatio;
		} else backgroundSizeStyleDimension = cocktail.core.unit.UnitManager.getPixelFromPercent(100,backgroundPositioningAreaDimension);
		break;
	}
	return backgroundSizeStyleDimension;
}
cocktail.core.style.computer.BackgroundStylesComputer.getBackgroundPositioningArea = function(style,backgroundOrigin,backgroundBox) {
	var backgroundPositioningArea;
	var height;
	var width;
	var x;
	var y;
	switch( (backgroundOrigin)[1] ) {
	case 0:
		height = backgroundBox.height;
		width = backgroundBox.width;
		x = 0.0;
		y = 0.0;
		break;
	case 1:
		height = backgroundBox.height;
		width = backgroundBox.width;
		x = 0.0;
		y = 0.0;
		break;
	case 2:
		height = backgroundBox.height - style.computedStyle.getMarginTop() - style.computedStyle.getMarginBottom() - style.computedStyle.getPaddingTop() - style.computedStyle.getPaddingBottom();
		width = backgroundBox.width - style.computedStyle.getMarginLeft() - style.computedStyle.getMarginRight() - style.computedStyle.getPaddingLeft() - style.computedStyle.getPaddingRight();
		x = 0.0;
		y = 0.0;
		break;
	}
	backgroundPositioningArea = { height : height, width : width, x : x, y : y};
	return backgroundPositioningArea;
}
cocktail.core.style.computer.BackgroundStylesComputer.getBackgroundPaintingArea = function(style,backgroundClip,backgroundBox) {
	var backgroundPaintingArea;
	var height;
	var width;
	var x;
	var y;
	switch( (backgroundClip)[1] ) {
	case 0:
		height = backgroundBox.height;
		width = backgroundBox.width;
		x = 0.0;
		y = 0.0;
		break;
	case 1:
		height = backgroundBox.height;
		width = backgroundBox.width;
		x = style.computedStyle.getMarginLeft();
		y = style.computedStyle.getMarginTop();
		break;
	case 2:
		height = backgroundBox.height - style.computedStyle.getMarginTop() - style.computedStyle.getMarginBottom() - style.computedStyle.getPaddingTop() - style.computedStyle.getPaddingBottom();
		width = backgroundBox.width - style.computedStyle.getMarginLeft() - style.computedStyle.getMarginRight() - style.computedStyle.getPaddingLeft() - style.computedStyle.getPaddingRight();
		x = style.computedStyle.getMarginLeft() + style.computedStyle.getPaddingLeft();
		y = style.computedStyle.getMarginTop() + style.computedStyle.getPaddingTop();
		break;
	}
	backgroundPaintingArea = { height : height, width : width, x : x, y : y};
	return backgroundPaintingArea;
}
cocktail.core.style.computer.BackgroundStylesComputer.prototype = {
	__class__: cocktail.core.style.computer.BackgroundStylesComputer
}
cocktail.core.style.computer.DisplayStylesComputer = function() {
};
$hxClasses["cocktail.core.style.computer.DisplayStylesComputer"] = cocktail.core.style.computer.DisplayStylesComputer;
cocktail.core.style.computer.DisplayStylesComputer.__name__ = ["cocktail","core","style","computer","DisplayStylesComputer"];
cocktail.core.style.computer.DisplayStylesComputer.compute = function(style) {
	var computedStyle = style.computedStyle;
	computedStyle.cssFloat = cocktail.core.style.computer.DisplayStylesComputer.getComputedFloat(style,computedStyle.position);
	computedStyle.display = cocktail.core.style.computer.DisplayStylesComputer.getComputedDisplay(style,computedStyle.cssFloat,computedStyle.position);
	computedStyle.clear = cocktail.core.style.computer.DisplayStylesComputer.getComputedClear(style,computedStyle.position,computedStyle.display);
}
cocktail.core.style.computer.DisplayStylesComputer.getComputedFloat = function(style,computedPosition) {
	var ret;
	if(computedPosition == cocktail.core.style.Position.absolute || computedPosition == cocktail.core.style.Position.fixed) ret = cocktail.core.style.CSSFloat.none; else ret = style.cssFloat;
	return ret;
}
cocktail.core.style.computer.DisplayStylesComputer.getComputedDisplay = function(style,computedFloat,computedPosition) {
	var ret;
	if(computedFloat != cocktail.core.style.CSSFloat.none) {
		switch( (style.display)[1] ) {
		case 2:
		case 1:
			ret = cocktail.core.style.Display.block;
			break;
		default:
			ret = style.display;
		}
	} else if(computedPosition == cocktail.core.style.Position.absolute || computedPosition == cocktail.core.style.Position.fixed) {
		switch( (style.display)[1] ) {
		case 2:
		case 1:
			ret = cocktail.core.style.Display.block;
			break;
		default:
			ret = style.display;
		}
	} else ret = style.display;
	return ret;
}
cocktail.core.style.computer.DisplayStylesComputer.getComputedClear = function(style,computedPosition,computedDisplay) {
	var ret;
	if(computedDisplay == cocktail.core.style.Display.cssInline || computedDisplay == cocktail.core.style.Display.inlineBlock) ret = cocktail.core.style.Clear.none; else if(computedPosition == cocktail.core.style.Position.absolute || computedPosition == cocktail.core.style.Position.fixed) ret = cocktail.core.style.Clear.none; else ret = style.clear;
	return ret;
}
cocktail.core.style.computer.DisplayStylesComputer.prototype = {
	__class__: cocktail.core.style.computer.DisplayStylesComputer
}
cocktail.core.style.computer.FontAndTextStylesComputer = function() {
};
$hxClasses["cocktail.core.style.computer.FontAndTextStylesComputer"] = cocktail.core.style.computer.FontAndTextStylesComputer;
cocktail.core.style.computer.FontAndTextStylesComputer.__name__ = ["cocktail","core","style","computer","FontAndTextStylesComputer"];
cocktail.core.style.computer.FontAndTextStylesComputer.compute = function(style,containingBlockData,containingBlockFontMetricsData) {
	var computedStyle = style.computedStyle;
	var fontMetrics = style.get_fontMetricsData();
	computedStyle.set_fontSize(cocktail.core.style.computer.FontAndTextStylesComputer.getComputedFontSize(style,containingBlockFontMetricsData.fontSize,containingBlockFontMetricsData.xHeight));
	computedStyle.set_lineHeight(cocktail.core.style.computer.FontAndTextStylesComputer.getComputedLineHeight(style,fontMetrics));
	computedStyle.verticalAlign = cocktail.core.style.computer.FontAndTextStylesComputer.getComputedVerticalAlign(style,containingBlockFontMetricsData,fontMetrics);
	computedStyle.set_letterSpacing(cocktail.core.style.computer.FontAndTextStylesComputer.getComputedLetterSpacing(style,fontMetrics));
	computedStyle.set_wordSpacing(cocktail.core.style.computer.FontAndTextStylesComputer.getComputedWordSpacing(style,fontMetrics));
	computedStyle.set_textIndent(cocktail.core.style.computer.FontAndTextStylesComputer.getComputedTextIndent(style,containingBlockData,fontMetrics));
	computedStyle.color = cocktail.core.style.computer.FontAndTextStylesComputer.getComputedColor(style);
}
cocktail.core.style.computer.FontAndTextStylesComputer.getComputedTextIndent = function(style,containingBlockData,fontMetrics) {
	var textIndent;
	var $e = (style.textIndent);
	switch( $e[1] ) {
	case 0:
		var value = $e[2];
		textIndent = cocktail.core.unit.UnitManager.getPixelFromLength(value,fontMetrics.fontSize,fontMetrics.xHeight);
		break;
	case 1:
		var value = $e[2];
		textIndent = cocktail.core.unit.UnitManager.getPixelFromPercent(value,containingBlockData.width);
		break;
	}
	return textIndent;
}
cocktail.core.style.computer.FontAndTextStylesComputer.getComputedVerticalAlign = function(style,containingBlockFontMetricsData,fontMetrics) {
	var verticalAlign;
	var $e = (style.verticalAlign);
	switch( $e[1] ) {
	case 0:
		verticalAlign = 0;
		break;
	case 5:
		verticalAlign = 0;
		break;
	case 1:
		verticalAlign = containingBlockFontMetricsData.subscriptOffset;
		break;
	case 2:
		verticalAlign = containingBlockFontMetricsData.superscriptOffset;
		break;
	case 4:
		verticalAlign = 0;
		break;
	case 7:
		verticalAlign = 0;
		break;
	case 8:
		var value = $e[2];
		verticalAlign = cocktail.core.unit.UnitManager.getPixelFromPercent(value,style.computedStyle.getLineHeight());
		break;
	case 9:
		var value = $e[2];
		verticalAlign = cocktail.core.unit.UnitManager.getPixelFromLength(value,fontMetrics.fontSize,fontMetrics.xHeight);
		break;
	case 3:
		verticalAlign = 0;
		break;
	case 6:
		verticalAlign = 0;
		break;
	}
	return verticalAlign;
}
cocktail.core.style.computer.FontAndTextStylesComputer.getComputedColor = function(style) {
	return cocktail.core.unit.UnitManager.getColorDataFromCSSColor(style.color);
}
cocktail.core.style.computer.FontAndTextStylesComputer.getComputedWordSpacing = function(style,fontMetrics) {
	var wordSpacing;
	var $e = (style.wordSpacing);
	switch( $e[1] ) {
	case 0:
		wordSpacing = 0;
		break;
	case 1:
		var unit = $e[2];
		wordSpacing = cocktail.core.unit.UnitManager.getPixelFromLength(unit,style.computedStyle.getFontSize(),fontMetrics.xHeight);
		break;
	}
	return wordSpacing;
}
cocktail.core.style.computer.FontAndTextStylesComputer.getComputedLineHeight = function(style,fontMetrics) {
	var lineHeight;
	var $e = (style.lineHeight);
	switch( $e[1] ) {
	case 2:
		var unit = $e[2];
		lineHeight = cocktail.core.unit.UnitManager.getPixelFromLength(unit,style.computedStyle.getFontSize(),fontMetrics.xHeight);
		break;
	case 0:
		lineHeight = style.computedStyle.getFontSize() * 1.2;
		break;
	case 3:
		var value = $e[2];
		lineHeight = cocktail.core.unit.UnitManager.getPixelFromPercent(value,style.computedStyle.getFontSize());
		break;
	case 1:
		var value = $e[2];
		lineHeight = style.computedStyle.getFontSize() * value;
		break;
	}
	return lineHeight;
}
cocktail.core.style.computer.FontAndTextStylesComputer.getComputedLetterSpacing = function(style,fontMetrics) {
	var letterSpacing;
	var $e = (style.letterSpacing);
	switch( $e[1] ) {
	case 0:
		letterSpacing = 0.0;
		break;
	case 1:
		var unit = $e[2];
		letterSpacing = cocktail.core.unit.UnitManager.getPixelFromLength(unit,fontMetrics.fontSize,fontMetrics.xHeight);
		break;
	}
	return letterSpacing;
}
cocktail.core.style.computer.FontAndTextStylesComputer.getComputedFontSize = function(style,parentFontSize,parentXHeight) {
	var fontSize;
	var $e = (style.fontSize);
	switch( $e[1] ) {
	case 0:
		var unit = $e[2];
		fontSize = cocktail.core.unit.UnitManager.getPixelFromLength(unit,parentFontSize,parentXHeight);
		break;
	case 1:
		var percent = $e[2];
		fontSize = cocktail.core.unit.UnitManager.getPixelFromPercent(percent,parentFontSize);
		break;
	case 2:
		var value = $e[2];
		fontSize = cocktail.core.unit.UnitManager.getFontSizeFromAbsoluteSizeValue(value);
		break;
	case 3:
		var value = $e[2];
		fontSize = cocktail.core.unit.UnitManager.getFontSizeFromRelativeSizeValue(value,parentFontSize);
		break;
	}
	return fontSize;
}
cocktail.core.style.computer.FontAndTextStylesComputer.prototype = {
	__class__: cocktail.core.style.computer.FontAndTextStylesComputer
}
cocktail.core.style.computer.TransitionStylesComputer = function() {
};
$hxClasses["cocktail.core.style.computer.TransitionStylesComputer"] = cocktail.core.style.computer.TransitionStylesComputer;
cocktail.core.style.computer.TransitionStylesComputer.__name__ = ["cocktail","core","style","computer","TransitionStylesComputer"];
cocktail.core.style.computer.TransitionStylesComputer.compute = function(style) {
	var computedStyle = style.computedStyle;
	computedStyle.transitionDelay = cocktail.core.style.computer.TransitionStylesComputer.getComputedTransitionDelay(style);
	computedStyle.transitionDuration = cocktail.core.style.computer.TransitionStylesComputer.getComputedTransitionDuration(style);
}
cocktail.core.style.computer.TransitionStylesComputer.getComputedTransitionDuration = function(style) {
	var transitionDurations = new Array();
	var _g1 = 0, _g = style.transitionDuration.length;
	while(_g1 < _g) {
		var i = _g1++;
		var $e = (style.transitionDuration[i]);
		switch( $e[1] ) {
		case 0:
			var value = $e[2];
			transitionDurations.push(value);
			break;
		case 1:
			var value = $e[2];
			transitionDurations.push(value / 1000);
			break;
		}
	}
	return transitionDurations;
}
cocktail.core.style.computer.TransitionStylesComputer.getComputedTransitionDelay = function(style) {
	var transitionDelays = new Array();
	var _g1 = 0, _g = style.transitionDelay.length;
	while(_g1 < _g) {
		var i = _g1++;
		var $e = (style.transitionDelay[i]);
		switch( $e[1] ) {
		case 0:
			var value = $e[2];
			transitionDelays.push(value);
			break;
		case 1:
			var value = $e[2];
			transitionDelays.push(value / 1000);
			break;
		}
	}
	return transitionDelays;
}
cocktail.core.style.computer.TransitionStylesComputer.prototype = {
	__class__: cocktail.core.style.computer.TransitionStylesComputer
}
cocktail.core.style.computer.VisualEffectStylesComputer = function() {
};
$hxClasses["cocktail.core.style.computer.VisualEffectStylesComputer"] = cocktail.core.style.computer.VisualEffectStylesComputer;
cocktail.core.style.computer.VisualEffectStylesComputer.__name__ = ["cocktail","core","style","computer","VisualEffectStylesComputer"];
cocktail.core.style.computer.VisualEffectStylesComputer.compute = function(style) {
	var computedStyle = style.computedStyle;
	var fontMetrics = style.get_fontMetricsData();
	computedStyle.transformOrigin = cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTransformOrigin(style,fontMetrics);
	computedStyle.transform = cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTransform(style,fontMetrics);
}
cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTransformOrigin = function(style,fontMetrics) {
	var x;
	var y;
	var $e = (style.transformOrigin.x);
	switch( $e[1] ) {
	case 0:
		var value = $e[2];
		x = cocktail.core.unit.UnitManager.getPixelFromLength(value,fontMetrics.fontSize,fontMetrics.xHeight);
		break;
	case 1:
		var value = $e[2];
		x = cocktail.core.unit.UnitManager.getPixelFromPercent(value,style.computedStyle.getWidth());
		break;
	case 2:
		x = cocktail.core.unit.UnitManager.getPixelFromPercent(0,style.computedStyle.getWidth());
		break;
	case 3:
		x = cocktail.core.unit.UnitManager.getPixelFromPercent(50,style.computedStyle.getWidth());
		break;
	case 4:
		x = cocktail.core.unit.UnitManager.getPixelFromPercent(100,style.computedStyle.getWidth());
		break;
	}
	var $e = (style.transformOrigin.y);
	switch( $e[1] ) {
	case 0:
		var value = $e[2];
		y = cocktail.core.unit.UnitManager.getPixelFromLength(value,fontMetrics.fontSize,fontMetrics.xHeight);
		break;
	case 1:
		var value = $e[2];
		y = cocktail.core.unit.UnitManager.getPixelFromPercent(value,style.computedStyle.getWidth());
		break;
	case 2:
		y = cocktail.core.unit.UnitManager.getPixelFromPercent(0,style.computedStyle.getWidth());
		break;
	case 3:
		y = cocktail.core.unit.UnitManager.getPixelFromPercent(50,style.computedStyle.getWidth());
		break;
	case 4:
		y = cocktail.core.unit.UnitManager.getPixelFromPercent(100,style.computedStyle.getWidth());
		break;
	}
	var transformOriginPoint = { x : x, y : y};
	return transformOriginPoint;
}
cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTransform = function(style,fontMetrics) {
	var transformFunctions;
	var transformOrigin = style.computedStyle.transformOrigin;
	var matrix = new cocktail.core.geom.Matrix();
	var $e = (style.transform);
	switch( $e[1] ) {
	case 1:
		var value = $e[2];
		transformFunctions = value;
		break;
	case 0:
		transformFunctions = new Array();
		break;
	}
	matrix.translate(transformOrigin.x,transformOrigin.y);
	var _g1 = 0, _g = transformFunctions.length;
	while(_g1 < _g) {
		var i = _g1++;
		var transformFunction = transformFunctions[i];
		var $e = (transformFunction);
		switch( $e[1] ) {
		case 0:
			var data = $e[2];
			matrix.concatenate(new cocktail.core.geom.Matrix(data));
			break;
		case 7:
			var value = $e[2];
			var angle = cocktail.core.unit.UnitManager.getRadFromAngle(value);
			matrix.rotate(angle);
			break;
		case 4:
			var sy = $e[3], sx = $e[2];
			matrix.scale(sx,sy);
			break;
		case 5:
			var sx = $e[2];
			matrix.scale(sx,1);
			break;
		case 6:
			var sy = $e[2];
			matrix.scale(1,sy);
			break;
		case 10:
			var angleY = $e[3], angleX = $e[2];
			var skewX = cocktail.core.unit.UnitManager.getRadFromAngle(angleX);
			var skewY = cocktail.core.unit.UnitManager.getRadFromAngle(angleY);
			matrix.skew(skewX,skewY);
			break;
		case 8:
			var angleX = $e[2];
			var skewX = cocktail.core.unit.UnitManager.getRadFromAngle(angleX);
			matrix.skew(skewX,0);
			break;
		case 9:
			var angleY = $e[2];
			var skewY = cocktail.core.unit.UnitManager.getRadFromAngle(angleY);
			matrix.skew(0,skewY);
			break;
		case 1:
			var ty = $e[3], tx = $e[2];
			var translationX = cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTranslation(style,tx,style.computedStyle.getWidth(),fontMetrics);
			var translationY = cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTranslation(style,ty,style.computedStyle.getHeight(),fontMetrics);
			matrix.translate(translationX,translationY);
			break;
		case 2:
			var tx = $e[2];
			var translationX = cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTranslation(style,tx,style.computedStyle.getWidth(),fontMetrics);
			matrix.translate(translationX,0.0);
			break;
		case 3:
			var ty = $e[2];
			var translationY = cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTranslation(style,ty,style.computedStyle.getHeight(),fontMetrics);
			matrix.translate(0.0,translationY);
			break;
		}
	}
	matrix.translate(transformOrigin.x * -1,transformOrigin.y * -1);
	return matrix;
}
cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTranslation = function(style,translation,percentReference,fontMetrics) {
	var computedTranslation;
	var $e = (translation);
	switch( $e[1] ) {
	case 0:
		var value = $e[2];
		computedTranslation = cocktail.core.unit.UnitManager.getPixelFromLength(value,fontMetrics.fontSize,fontMetrics.xHeight);
		break;
	case 1:
		var value = $e[2];
		computedTranslation = cocktail.core.unit.UnitManager.getPixelFromPercent(value,percentReference);
		break;
	}
	return computedTranslation;
}
cocktail.core.style.computer.VisualEffectStylesComputer.prototype = {
	__class__: cocktail.core.style.computer.VisualEffectStylesComputer
}
cocktail.core.style.computer.boxComputers = {}
cocktail.core.style.computer.boxComputers.BoxStylesComputer = function() {
};
$hxClasses["cocktail.core.style.computer.boxComputers.BoxStylesComputer"] = cocktail.core.style.computer.boxComputers.BoxStylesComputer;
cocktail.core.style.computer.boxComputers.BoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","BoxStylesComputer"];
cocktail.core.style.computer.boxComputers.BoxStylesComputer.prototype = {
	constrainHeight: function(style,computedHeight) {
		var computedStyle = style.computedStyle;
		if(style.maxHeight != cocktail.core.style.ConstrainedDimension.none) {
			if(computedHeight > computedStyle.getMaxHeight()) computedHeight = computedStyle.getMaxHeight();
		}
		if(computedHeight < computedStyle.getMinHeight()) computedHeight = computedStyle.getMinHeight();
		return computedHeight;
	}
	,constrainWidth: function(style,computedWidth) {
		var computedStyle = style.computedStyle;
		if(style.maxWidth != cocktail.core.style.ConstrainedDimension.none) {
			if(computedWidth > computedStyle.getMaxWidth()) computedWidth = computedStyle.getMaxWidth();
		}
		if(computedWidth < computedStyle.getMinWidth()) computedWidth = computedStyle.getMinWidth();
		return computedWidth;
	}
	,getComputedPadding: function(paddingStyleValue,containingHTMLElementDimension,fontSize,xHeight) {
		var computedPaddingValue;
		var $e = (paddingStyleValue);
		switch( $e[1] ) {
		case 0:
			var value = $e[2];
			computedPaddingValue = cocktail.core.unit.UnitManager.getPixelFromLength(value,fontSize,xHeight);
			break;
		case 1:
			var value = $e[2];
			computedPaddingValue = cocktail.core.unit.UnitManager.getPixelFromPercent(value,containingHTMLElementDimension);
			break;
		}
		return computedPaddingValue;
	}
	,getComputedDimension: function(dimensionStyleValue,containingHTMLElementDimension,isContainingDimensionAuto,fontSize,xHeight) {
		var computedDimensions;
		var $e = (dimensionStyleValue);
		switch( $e[1] ) {
		case 0:
			var value = $e[2];
			computedDimensions = cocktail.core.unit.UnitManager.getPixelFromLength(value,fontSize,xHeight);
			break;
		case 1:
			var value = $e[2];
			computedDimensions = cocktail.core.unit.UnitManager.getPixelFromPercent(value,containingHTMLElementDimension);
			break;
		case 2:
			computedDimensions = 0;
			break;
		}
		return computedDimensions;
	}
	,getComputedPositionOffset: function(positionOffsetStyleValue,containingHTMLElementDimension,fontSize,xHeight) {
		var computedPositionOffset;
		var $e = (positionOffsetStyleValue);
		switch( $e[1] ) {
		case 0:
			var value = $e[2];
			computedPositionOffset = cocktail.core.unit.UnitManager.getPixelFromLength(value,fontSize,xHeight);
			break;
		case 1:
			var value = $e[2];
			computedPositionOffset = cocktail.core.unit.UnitManager.getPixelFromPercent(value,containingHTMLElementDimension);
			break;
		case 2:
			computedPositionOffset = 0.0;
			break;
		}
		return computedPositionOffset;
	}
	,getComputedConstrainedDimension: function(constrainedDimension,containingHTMLElementDimension,isContainingDimensionAuto,fontSize,xHeight,isMinConstraint) {
		if(isMinConstraint == null) isMinConstraint = false;
		var computedConstraintDimension;
		var $e = (constrainedDimension);
		switch( $e[1] ) {
		case 0:
			var value = $e[2];
			computedConstraintDimension = cocktail.core.unit.UnitManager.getPixelFromLength(value,fontSize,xHeight);
			break;
		case 1:
			var value = $e[2];
			if(isContainingDimensionAuto == true) {
				if(isMinConstraint == true) computedConstraintDimension = 0; else computedConstraintDimension = Math.POSITIVE_INFINITY;
			} else computedConstraintDimension = cocktail.core.unit.UnitManager.getPixelFromPercent(value,containingHTMLElementDimension);
			break;
		case 2:
			if(isMinConstraint == true) computedConstraintDimension = 0.0; else computedConstraintDimension = Math.POSITIVE_INFINITY;
			break;
		}
		return computedConstraintDimension;
	}
	,getComputedAutoMargin: function(marginStyleValue,opositeMargin,containingHTMLElementDimension,computedDimension,isDimensionAuto,computedPaddingsDimension,fontSize,xHeight,isHorizontalMargin) {
		var computedMargin;
		if(isHorizontalMargin == false || isDimensionAuto == true) computedMargin = 0.0; else {
			switch( (opositeMargin)[1] ) {
			case 2:
				computedMargin = (containingHTMLElementDimension - computedDimension - computedPaddingsDimension) / 2;
				break;
			default:
				var opositeComputedMargin = this.getComputedMargin(opositeMargin,marginStyleValue,containingHTMLElementDimension,computedDimension,isDimensionAuto,computedPaddingsDimension,fontSize,xHeight,isHorizontalMargin);
				computedMargin = containingHTMLElementDimension - computedDimension - computedPaddingsDimension - opositeComputedMargin;
			}
		}
		return computedMargin;
	}
	,getComputedMargin: function(marginStyleValue,opositeMargin,containingHTMLElementDimension,computedDimension,isDimensionAuto,computedPaddingsDimension,fontSize,xHeight,isHorizontalMargin) {
		var computedMargin;
		var $e = (marginStyleValue);
		switch( $e[1] ) {
		case 0:
			var value = $e[2];
			computedMargin = cocktail.core.unit.UnitManager.getPixelFromLength(value,fontSize,xHeight);
			break;
		case 1:
			var value = $e[2];
			if(isDimensionAuto == true) computedMargin = 0.0; else computedMargin = cocktail.core.unit.UnitManager.getPixelFromPercent(value,containingHTMLElementDimension);
			break;
		case 2:
			computedMargin = this.getComputedAutoMargin(marginStyleValue,opositeMargin,containingHTMLElementDimension,computedDimension,isDimensionAuto,computedPaddingsDimension,fontSize,xHeight,isHorizontalMargin);
			break;
		}
		return computedMargin;
	}
	,getComputedMarginBottom: function(style,computedHeight,containingBlockData,fontMetrics) {
		return this.getComputedMargin(style.marginBottom,style.marginTop,containingBlockData.height,computedHeight,style.height == cocktail.core.style.Dimension.cssAuto,style.computedStyle.getPaddingTop() + style.computedStyle.getPaddingBottom(),fontMetrics.fontSize,fontMetrics.xHeight,false);
	}
	,getComputedMarginTop: function(style,computedHeight,containingBlockData,fontMetrics) {
		return this.getComputedMargin(style.marginTop,style.marginBottom,containingBlockData.height,computedHeight,style.height == cocktail.core.style.Dimension.cssAuto,style.computedStyle.getPaddingTop() + style.computedStyle.getPaddingBottom(),fontMetrics.fontSize,fontMetrics.xHeight,false);
	}
	,getComputedMarginRight: function(style,computedWidth,containingBlockData,fontMetrics) {
		return this.getComputedMargin(style.marginRight,style.marginLeft,containingBlockData.width,computedWidth,style.width == cocktail.core.style.Dimension.cssAuto,style.computedStyle.getPaddingRight() + style.computedStyle.getPaddingLeft(),fontMetrics.fontSize,fontMetrics.xHeight,true);
	}
	,getComputedMarginLeft: function(style,computedWidth,containingBlockData,fontMetrics) {
		return this.getComputedMargin(style.marginLeft,style.marginRight,containingBlockData.width,computedWidth,style.width == cocktail.core.style.Dimension.cssAuto,style.computedStyle.getPaddingRight() + style.computedStyle.getPaddingLeft(),fontMetrics.fontSize,fontMetrics.xHeight,true);
	}
	,getComputedAutoHeight: function(style,containingBlockData,fontMetrics) {
		return 0;
	}
	,getComputedHeight: function(style,containingBlockData,fontMetrics) {
		return this.getComputedDimension(style.height,containingBlockData.height,containingBlockData.isHeightAuto,fontMetrics.fontSize,fontMetrics.xHeight);
	}
	,getComputedAutoWidth: function(style,containingBlockData,fontMetrics) {
		return containingBlockData.width - style.computedStyle.getPaddingLeft() - style.computedStyle.getPaddingRight() - style.computedStyle.getMarginLeft() - style.computedStyle.getMarginRight();
	}
	,getComputedWidth: function(style,containingBlockData,fontMetrics) {
		return this.getComputedDimension(style.width,containingBlockData.width,containingBlockData.isWidthAuto,fontMetrics.fontSize,fontMetrics.xHeight);
	}
	,measureHeight: function(style,containingBlockData,fontMetrics) {
		var computedHeight = this.getComputedHeight(style,containingBlockData,fontMetrics);
		style.computedStyle.set_marginTop(this.getComputedMarginTop(style,computedHeight,containingBlockData,fontMetrics));
		style.computedStyle.set_marginBottom(this.getComputedMarginBottom(style,computedHeight,containingBlockData,fontMetrics));
		return computedHeight;
	}
	,measureAutoHeight: function(style,containingBlockData,fontMetrics) {
		var computedHeight = this.getComputedAutoHeight(style,containingBlockData,fontMetrics);
		style.computedStyle.set_marginTop(this.getComputedMarginTop(style,computedHeight,containingBlockData,fontMetrics));
		style.computedStyle.set_marginBottom(this.getComputedMarginBottom(style,computedHeight,containingBlockData,fontMetrics));
		return computedHeight;
	}
	,measureHeightAndVerticalMargins: function(style,containingBlockData,fontMetrics) {
		if(style.height == cocktail.core.style.Dimension.cssAuto) return this.measureAutoHeight(style,containingBlockData,fontMetrics); else return this.measureHeight(style,containingBlockData,fontMetrics);
	}
	,measureWidth: function(style,containingBlockData,fontMetrics) {
		var computedWidth = this.getComputedWidth(style,containingBlockData,fontMetrics);
		style.computedStyle.set_marginLeft(this.getComputedMarginLeft(style,computedWidth,containingBlockData,fontMetrics));
		style.computedStyle.set_marginRight(this.getComputedMarginRight(style,computedWidth,containingBlockData,fontMetrics));
		return computedWidth;
	}
	,measureAutoWidth: function(style,containingBlockData,fontMetrics) {
		var computedWidth = 0.0;
		style.computedStyle.set_marginLeft(this.getComputedMarginLeft(style,computedWidth,containingBlockData,fontMetrics));
		style.computedStyle.set_marginRight(this.getComputedMarginRight(style,computedWidth,containingBlockData,fontMetrics));
		return this.getComputedAutoWidth(style,containingBlockData,fontMetrics);
	}
	,measureWidthAndHorizontalMargins: function(style,containingBlockData,fontMetrics) {
		if(style.width == cocktail.core.style.Dimension.cssAuto) return this.measureAutoWidth(style,containingBlockData,fontMetrics); else return this.measureWidth(style,containingBlockData,fontMetrics);
	}
	,measureHorizontalPaddings: function(style,containingBlockData,fontMetrics) {
		style.computedStyle.set_paddingLeft(this.getComputedPadding(style.paddingLeft,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
		style.computedStyle.set_paddingRight(this.getComputedPadding(style.paddingRight,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
	}
	,measureVerticalPaddings: function(style,containingBlockData,fontMetrics) {
		style.computedStyle.set_paddingTop(this.getComputedPadding(style.paddingTop,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
		style.computedStyle.set_paddingBottom(this.getComputedPadding(style.paddingBottom,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
	}
	,measureDimensionsAndMargins: function(style,containingBlockData,fontMetrics) {
		style.computedStyle.set_width(this.constrainWidth(style,this.measureWidthAndHorizontalMargins(style,containingBlockData,fontMetrics)));
		style.computedStyle.set_height(this.constrainHeight(style,this.measureHeightAndVerticalMargins(style,containingBlockData,fontMetrics)));
	}
	,measurePositionOffsets: function(style,containingBlockData,fontMetrics) {
		style.computedStyle.set_left(this.getComputedPositionOffset(style.left,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
		style.computedStyle.set_right(this.getComputedPositionOffset(style.right,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
		style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
		style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
	}
	,measureDimensionsConstraints: function(style,containingBlockData,fontMetrics) {
		style.computedStyle.set_maxHeight(this.getComputedConstrainedDimension(style.maxHeight,containingBlockData.height,containingBlockData.isHeightAuto,fontMetrics.fontSize,fontMetrics.xHeight));
		style.computedStyle.set_minHeight(this.getComputedConstrainedDimension(style.minHeight,containingBlockData.height,containingBlockData.isHeightAuto,fontMetrics.fontSize,fontMetrics.xHeight,true));
		style.computedStyle.set_maxWidth(this.getComputedConstrainedDimension(style.maxWidth,containingBlockData.width,containingBlockData.isWidthAuto,fontMetrics.fontSize,fontMetrics.xHeight));
		style.computedStyle.set_minWidth(this.getComputedConstrainedDimension(style.minWidth,containingBlockData.width,containingBlockData.isWidthAuto,fontMetrics.fontSize,fontMetrics.xHeight,true));
	}
	,measure: function(style,containingBlockData) {
		var fontMetrics = style.get_fontMetricsData();
		this.measureHorizontalPaddings(style,containingBlockData,fontMetrics);
		this.measureVerticalPaddings(style,containingBlockData,fontMetrics);
		this.measureDimensionsConstraints(style,containingBlockData,fontMetrics);
		this.measureDimensionsAndMargins(style,containingBlockData,fontMetrics);
		this.measurePositionOffsets(style,containingBlockData,fontMetrics);
	}
	,__class__: cocktail.core.style.computer.boxComputers.BoxStylesComputer
}
cocktail.core.style.computer.boxComputers.BlockBoxStylesComputer = function() {
	cocktail.core.style.computer.boxComputers.BoxStylesComputer.call(this);
};
$hxClasses["cocktail.core.style.computer.boxComputers.BlockBoxStylesComputer"] = cocktail.core.style.computer.boxComputers.BlockBoxStylesComputer;
cocktail.core.style.computer.boxComputers.BlockBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","BlockBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.BlockBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.BoxStylesComputer;
cocktail.core.style.computer.boxComputers.BlockBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.BoxStylesComputer.prototype,{
	__class__: cocktail.core.style.computer.boxComputers.BlockBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer = function() {
	cocktail.core.style.computer.boxComputers.BoxStylesComputer.call(this);
};
$hxClasses["cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer"] = cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","EmbeddedBlockBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.BoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.BoxStylesComputer.prototype,{
	getComputedAutoMargin: function(marginStyleValue,opositeMargin,containingHTMLElementDimension,computedDimension,isDimensionAuto,computedPaddingsDimension,fontSize,xHeight,isHorizontalMargin) {
		var computedMargin;
		if(isHorizontalMargin == false) computedMargin = 0.0; else computedMargin = cocktail.core.style.computer.boxComputers.BoxStylesComputer.prototype.getComputedAutoMargin.call(this,marginStyleValue,opositeMargin,containingHTMLElementDimension,computedDimension,false,computedPaddingsDimension,fontSize,xHeight,isHorizontalMargin);
		return computedMargin;
	}
	,getComputedAutoHeight: function(style,containingBlockData,fontMetrics) {
		var ret = 0.0;
		var embeddedHTMLElement = style.htmlElement;
		if(embeddedHTMLElement.getAttributeNode("height") != null) ret = embeddedHTMLElement.get_height(); else if(style.width == cocktail.core.style.Dimension.cssAuto) {
			if(embeddedHTMLElement.get_intrinsicHeight() != null) ret = embeddedHTMLElement.get_intrinsicHeight(); else if(embeddedHTMLElement.get_intrinsicWidth() != null && embeddedHTMLElement.get_intrinsicRatio() != null) ret = embeddedHTMLElement.get_intrinsicWidth() * embeddedHTMLElement.get_intrinsicRatio(); else if(embeddedHTMLElement.get_intrinsicRatio() != null) {
			}
		} else {
			var computedWidth = this.getComputedDimension(style.width,containingBlockData.width,containingBlockData.isWidthAuto,fontMetrics.fontSize,fontMetrics.xHeight);
			if(embeddedHTMLElement.get_intrinsicRatio() != null) ret = style.computedStyle.getWidth() * embeddedHTMLElement.get_intrinsicRatio(); else ret = 150;
		}
		return ret;
	}
	,getComputedAutoWidth: function(style,containingBlockData,fontMetrics) {
		var ret = 0.0;
		var embeddedHTMLElement = style.htmlElement;
		if(embeddedHTMLElement.getAttributeNode("width") != null) ret = embeddedHTMLElement.get_width(); else if(style.height == cocktail.core.style.Dimension.cssAuto) {
			if(embeddedHTMLElement.get_intrinsicWidth() != null) ret = embeddedHTMLElement.get_intrinsicWidth(); else if(embeddedHTMLElement.get_intrinsicHeight() != null && embeddedHTMLElement.get_intrinsicRatio() != null) ret = embeddedHTMLElement.get_intrinsicHeight() * embeddedHTMLElement.get_intrinsicRatio(); else if(embeddedHTMLElement.get_intrinsicRatio() != null) {
				if(containingBlockData.isWidthAuto == false) {
					var computedStyle = style.computedStyle;
					ret = containingBlockData.width - computedStyle.getMarginLeft() - computedStyle.getMarginRight() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight();
				} else ret = 0.0;
			}
		} else {
			var computedHeight = this.getComputedDimension(style.height,containingBlockData.height,containingBlockData.isHeightAuto,fontMetrics.fontSize,fontMetrics.xHeight);
			if(embeddedHTMLElement.get_intrinsicRatio() != null) ret = computedHeight / embeddedHTMLElement.get_intrinsicRatio(); else if(embeddedHTMLElement.get_intrinsicWidth() != null) ret = embeddedHTMLElement.get_intrinsicWidth(); else ret = 300;
		}
		return ret;
	}
	,measureAutoWidth: function(style,containingBlockData,fontMetrics) {
		var computedWidth = this.getComputedAutoWidth(style,containingBlockData,fontMetrics);
		style.computedStyle.set_marginLeft(this.getComputedMarginLeft(style,computedWidth,containingBlockData,fontMetrics));
		style.computedStyle.set_marginRight(this.getComputedMarginRight(style,computedWidth,containingBlockData,fontMetrics));
		return computedWidth;
	}
	,constrainDimensions: function(style,computedWidth,computedHeight) {
		var maxHeight = style.computedStyle.getMaxHeight();
		var minHeight = style.computedStyle.getMinHeight();
		var maxWidth = style.computedStyle.getMaxWidth();
		var minWidth = style.computedStyle.getMinWidth();
		var widthSuperiorToMaxWidth = false;
		if(style.maxWidth != cocktail.core.style.ConstrainedDimension.none) widthSuperiorToMaxWidth = computedWidth > maxWidth;
		var heightSuperiorToMaxHeight = false;
		if(style.maxHeight != cocktail.core.style.ConstrainedDimension.none) heightSuperiorToMaxHeight = computedHeight > maxHeight;
		var widthInferiorToMinWidth = computedWidth < minWidth;
		var heightInferiorToMinHeight = computedHeight < minHeight;
		if(widthSuperiorToMaxWidth == true) {
			if(heightSuperiorToMaxHeight == true) {
				if(maxWidth / computedWidth <= maxHeight / computedHeight) {
					if(minHeight > maxWidth * (computedHeight / computedWidth)) computedHeight = minHeight; else computedHeight = maxWidth * (computedHeight / computedWidth);
					computedWidth = maxWidth;
				}
			} else if(heightInferiorToMinHeight == true) {
				computedWidth = maxWidth;
				computedHeight = minHeight;
			} else {
				if(maxWidth * (computedHeight / computedWidth) > minHeight) computedHeight = maxWidth * (computedHeight / computedWidth); else computedHeight = minHeight;
				computedWidth = maxWidth;
			}
		} else if(widthInferiorToMinWidth == true) {
			if(heightInferiorToMinHeight == true) {
				if(minWidth / computedWidth <= minHeight / computedHeight) {
					if(maxWidth < minHeight * (computedWidth / computedHeight)) computedWidth = maxWidth; else computedWidth = minHeight * (computedWidth / computedHeight);
					computedHeight = minHeight;
				} else {
					if(maxHeight < minWidth * (computedHeight / computedWidth)) computedHeight = maxHeight; else computedHeight = minWidth * (computedHeight / computedWidth);
					computedWidth = minWidth;
				}
			} else if(heightSuperiorToMaxHeight == true) {
				computedWidth = minWidth;
				computedHeight = maxHeight;
			} else {
				if(minWidth * (computedHeight / computedWidth) < maxHeight) computedHeight = minWidth * (computedHeight / computedWidth); else computedHeight = maxHeight;
				computedWidth = minWidth;
			}
		} else if(heightSuperiorToMaxHeight == true) {
			if(maxHeight * (computedWidth / computedHeight) > minWidth) computedWidth = maxHeight * (computedWidth / computedHeight); else computedWidth = minWidth;
			computedHeight = maxHeight;
		} else if(heightInferiorToMinHeight == true) {
			if(minHeight * (computedWidth / computedHeight) < minHeight) computedWidth = minHeight * (computedWidth / computedHeight); else computedWidth = minHeight;
			computedHeight = minHeight;
		}
		style.computedStyle.set_width(computedWidth);
		style.computedStyle.set_height(computedHeight);
	}
	,measureDimensionsAndMargins: function(style,containingBlockData,fontMetrics) {
		var computedWidth = this.measureWidthAndHorizontalMargins(style,containingBlockData,fontMetrics);
		var computedHeight = this.measureHeightAndVerticalMargins(style,containingBlockData,fontMetrics);
		if(style.width == cocktail.core.style.Dimension.cssAuto && style.height == cocktail.core.style.Dimension.cssAuto) this.constrainDimensions(style,computedWidth,computedHeight); else {
			style.computedStyle.set_width(this.constrainWidth(style,computedWidth));
			style.computedStyle.set_height(this.constrainHeight(style,computedHeight));
		}
	}
	,__class__: cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer = function() {
	cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer.call(this);
};
$hxClasses["cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer"] = cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","EmbeddedInlineBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer.prototype,{
	getComputedAutoMargin: function(marginStyleValue,opositeMargin,containingHTMLElementDimension,computedDimension,isDimensionAuto,computedPaddingsDimension,fontSize,xHeight,isHorizontalMargin) {
		return 0.0;
	}
	,__class__: cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.EmbeddedFloatBoxStylesComputer = function() {
	cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer.call(this);
};
$hxClasses["cocktail.core.style.computer.boxComputers.EmbeddedFloatBoxStylesComputer"] = cocktail.core.style.computer.boxComputers.EmbeddedFloatBoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedFloatBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","EmbeddedFloatBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.EmbeddedFloatBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedFloatBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer.prototype,{
	__class__: cocktail.core.style.computer.boxComputers.EmbeddedFloatBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.EmbeddedInlineBlockBoxStylesComputer = function() {
	cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer.call(this);
};
$hxClasses["cocktail.core.style.computer.boxComputers.EmbeddedInlineBlockBoxStylesComputer"] = cocktail.core.style.computer.boxComputers.EmbeddedInlineBlockBoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedInlineBlockBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","EmbeddedInlineBlockBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.EmbeddedInlineBlockBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedInlineBlockBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer.prototype,{
	__class__: cocktail.core.style.computer.boxComputers.EmbeddedInlineBlockBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.EmbeddedPositionedBoxStylesComputer = function() {
	cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer.call(this);
};
$hxClasses["cocktail.core.style.computer.boxComputers.EmbeddedPositionedBoxStylesComputer"] = cocktail.core.style.computer.boxComputers.EmbeddedPositionedBoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedPositionedBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","EmbeddedPositionedBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.EmbeddedPositionedBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedPositionedBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer.prototype,{
	getComputedStaticTop: function(style,containingBlockData) {
		return style.computedStyle.getMarginTop();
	}
	,getComputedStaticLeft: function(style,containingBlockData) {
		return style.computedStyle.getMarginLeft();
	}
	,measureVerticalPositionOffsets: function(style,containingBlockData,fontMetrics) {
		var computedStyle = style.computedStyle;
		if(style.top == cocktail.core.style.PositionOffset.cssAuto || style.bottom == cocktail.core.style.PositionOffset.cssAuto) {
			if(style.marginTop == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginTop(0);
			if(style.marginBottom == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginBottom(0);
			if(style.top == cocktail.core.style.PositionOffset.cssAuto && style.bottom == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_top(this.getComputedStaticTop(style,containingBlockData));
				style.computedStyle.set_bottom(containingBlockData.height - computedStyle.getHeight() - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop());
			} else if(style.top == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
				style.computedStyle.set_top(containingBlockData.height - computedStyle.getHeight() - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getBottom() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom());
			} else if(style.bottom == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
				style.computedStyle.set_bottom(containingBlockData.height - computedStyle.getHeight() - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getTop() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom());
			} else {
				style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
				style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
			}
		} else {
			style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
			style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
			if(style.marginTop == cocktail.core.style.Margin.cssAuto && style.marginBottom == cocktail.core.style.Margin.cssAuto) {
				var margin = (containingBlockData.height - computedStyle.getTop() - computedStyle.getBottom() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom()) / 2;
				var computedMargin = (containingBlockData.height - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop() - computedStyle.getBottom()) / 2;
				if(computedMargin >= 0) {
					style.computedStyle.set_marginTop(computedMargin);
					style.computedStyle.set_marginBottom(computedMargin);
				} else {
					style.computedStyle.set_marginTop(0);
					style.computedStyle.set_marginBottom(containingBlockData.height - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop() - computedStyle.getBottom());
				}
			} else if(style.marginTop == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginTop(containingBlockData.height - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop() - computedStyle.getBottom() - computedStyle.getMarginBottom()); else if(style.marginBottom == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginBottom(containingBlockData.height - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop() - computedStyle.getBottom() - computedStyle.getMarginTop());
		}
	}
	,measureHorizontalPositionOffsets: function(style,containingBlockData,fontMetrics) {
		var computedStyle = style.computedStyle;
		if(style.left == cocktail.core.style.PositionOffset.cssAuto || style.right == cocktail.core.style.PositionOffset.cssAuto) {
			if(style.marginLeft == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginLeft(0);
			if(style.marginRight == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginRight(0);
			if(style.left == cocktail.core.style.PositionOffset.cssAuto && style.right == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_left(this.getComputedStaticLeft(style,containingBlockData));
				style.computedStyle.set_right(containingBlockData.width - computedStyle.getWidth() - computedStyle.getMarginLeft() - computedStyle.getMarginRight() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft());
			} else if(style.left == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_right(this.getComputedPositionOffset(style.right,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
				style.computedStyle.set_left(containingBlockData.width - computedStyle.getWidth() - computedStyle.getMarginLeft() - computedStyle.getMarginRight() - computedStyle.getRight() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight());
			} else if(style.right == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_left(this.getComputedPositionOffset(style.left,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
				style.computedStyle.set_right(containingBlockData.width - computedStyle.getWidth() - computedStyle.getMarginLeft() - computedStyle.getMarginRight() - computedStyle.getLeft() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight());
			}
		} else {
			style.computedStyle.set_left(this.getComputedPositionOffset(style.left,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
			style.computedStyle.set_right(this.getComputedPositionOffset(style.right,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
			if(style.marginLeft == cocktail.core.style.Margin.cssAuto && style.marginRight == cocktail.core.style.Margin.cssAuto) {
				var margin = (containingBlockData.width - computedStyle.getLeft() - computedStyle.getRight() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight()) / 2;
				var computedMargin = (containingBlockData.width - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft() - computedStyle.getRight()) / 2;
				if(computedMargin >= 0) {
					style.computedStyle.set_marginLeft(computedMargin);
					style.computedStyle.set_marginRight(computedMargin);
				} else {
					style.computedStyle.set_marginLeft(0);
					style.computedStyle.set_marginRight(containingBlockData.width - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft() - computedStyle.getRight());
				}
				style.computedStyle.set_marginLeft(0);
			} else if(style.marginLeft == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginLeft(containingBlockData.width - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft() - computedStyle.getRight() - computedStyle.getMarginRight()); else if(style.marginRight == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginRight(containingBlockData.width - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft() - computedStyle.getRight() - computedStyle.getMarginLeft());
		}
	}
	,measurePositionOffsets: function(style,containingBlockData,fontMetrics) {
		this.measureHorizontalPositionOffsets(style,containingBlockData,fontMetrics);
		this.measureVerticalPositionOffsets(style,containingBlockData,fontMetrics);
	}
	,__class__: cocktail.core.style.computer.boxComputers.EmbeddedPositionedBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer = function() {
	cocktail.core.style.computer.boxComputers.BoxStylesComputer.call(this);
};
$hxClasses["cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer"] = cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer;
cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","InlineBlockBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.BoxStylesComputer;
cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.BoxStylesComputer.prototype,{
	getComputedAutoMargin: function(marginStyleValue,opositeMargin,containingHTMLElementDimension,computedDimension,isDimensionAuto,computedPaddingsDimension,fontSize,xHeight,isHorizontalMargin) {
		return 0.0;
	}
	,__class__: cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.FloatBoxStylesComputer = function() {
	cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer.call(this);
};
$hxClasses["cocktail.core.style.computer.boxComputers.FloatBoxStylesComputer"] = cocktail.core.style.computer.boxComputers.FloatBoxStylesComputer;
cocktail.core.style.computer.boxComputers.FloatBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","FloatBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.FloatBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer;
cocktail.core.style.computer.boxComputers.FloatBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer.prototype,{
	getComputedAutoWidth: function(style,containingBlockData,fontMetrics) {
		return 0.0;
	}
	,__class__: cocktail.core.style.computer.boxComputers.FloatBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.InLineBoxStylesComputer = function() {
	cocktail.core.style.computer.boxComputers.BoxStylesComputer.call(this);
};
$hxClasses["cocktail.core.style.computer.boxComputers.InLineBoxStylesComputer"] = cocktail.core.style.computer.boxComputers.InLineBoxStylesComputer;
cocktail.core.style.computer.boxComputers.InLineBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","InLineBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.InLineBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.BoxStylesComputer;
cocktail.core.style.computer.boxComputers.InLineBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.BoxStylesComputer.prototype,{
	getComputedHeight: function(style,containingBlockData,fontMetrics) {
		return 0.0;
	}
	,getComputedWidth: function(style,containingBlockData,fontMetrics) {
		return 0.0;
	}
	,getComputedAutoMargin: function(marginStyleValue,opositeMargin,containingHTMLElementDimension,computedDimension,isDimensionAuto,computedPaddingsDimension,fontSize,xHeight,isHorizontalMargin) {
		return 0.0;
	}
	,measureHeight: function(style,containingBlockData,fontMetrics) {
		var computedHeight = this.getComputedHeight(style,containingBlockData,fontMetrics);
		style.computedStyle.set_marginTop(0.0);
		style.computedStyle.set_marginBottom(0.0);
		return computedHeight;
	}
	,measureAutoHeight: function(style,containingBlockData,fontMetrics) {
		var computedHeight = this.getComputedAutoHeight(style,containingBlockData,fontMetrics);
		style.computedStyle.set_marginTop(0.0);
		style.computedStyle.set_marginBottom(0.0);
		return computedHeight;
	}
	,measureVerticalPaddings: function(style,containingBlockData,fontMetrics) {
		style.computedStyle.set_paddingTop(0);
		style.computedStyle.set_paddingBottom(0);
	}
	,__class__: cocktail.core.style.computer.boxComputers.InLineBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.PositionedBoxStylesComputer = function() {
	cocktail.core.style.computer.boxComputers.BoxStylesComputer.call(this);
};
$hxClasses["cocktail.core.style.computer.boxComputers.PositionedBoxStylesComputer"] = cocktail.core.style.computer.boxComputers.PositionedBoxStylesComputer;
cocktail.core.style.computer.boxComputers.PositionedBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","PositionedBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.PositionedBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.BoxStylesComputer;
cocktail.core.style.computer.boxComputers.PositionedBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.BoxStylesComputer.prototype,{
	getComputedStaticTop: function(style,containingBlockData) {
		return style.computedStyle.getMarginTop();
	}
	,getComputedStaticLeft: function(style,containingBlockData) {
		return style.computedStyle.getMarginLeft();
	}
	,measureHeight: function(style,containingBlockData,fontMetrics) {
		var computedStyle = style.computedStyle;
		var computedHeight = this.getComputedHeight(style,containingBlockData,fontMetrics);
		if(style.top != cocktail.core.style.PositionOffset.cssAuto && style.bottom != cocktail.core.style.PositionOffset.cssAuto) {
			style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
			style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
			if(style.marginTop == cocktail.core.style.Margin.cssAuto && style.marginBottom == cocktail.core.style.Margin.cssAuto) {
				var computedMargin = (containingBlockData.height - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop() - computedStyle.getBottom()) / 2;
				if(computedMargin >= 0) {
					style.computedStyle.set_marginTop(computedMargin);
					style.computedStyle.set_marginBottom(computedMargin);
				} else {
					style.computedStyle.set_marginBottom(0);
					style.computedStyle.set_marginTop(containingBlockData.height - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getBottom() - computedStyle.getTop());
				}
			} else if(style.marginTop == cocktail.core.style.Margin.cssAuto) {
				style.computedStyle.set_marginBottom(this.getComputedMarginBottom(style,computedHeight,containingBlockData,fontMetrics));
				style.computedStyle.set_marginTop(containingBlockData.height - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop() - computedStyle.getBottom() - computedStyle.getMarginBottom());
			} else if(style.marginBottom == cocktail.core.style.Margin.cssAuto) {
				style.computedStyle.set_marginTop(this.getComputedMarginTop(style,computedHeight,containingBlockData,fontMetrics));
				style.computedStyle.set_marginBottom(containingBlockData.height - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop() - computedStyle.getBottom() - computedStyle.getMarginTop());
			} else {
				style.computedStyle.set_marginTop(this.getComputedMarginTop(style,computedHeight,containingBlockData,fontMetrics));
				style.computedStyle.set_marginBottom(this.getComputedMarginBottom(style,computedHeight,containingBlockData,fontMetrics));
			}
		} else {
			if(style.marginTop == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginTop(0); else style.computedStyle.set_marginTop(this.getComputedMarginTop(style,computedHeight,containingBlockData,fontMetrics));
			if(style.marginBottom == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginBottom(0); else style.computedStyle.set_marginBottom(this.getComputedMarginBottom(style,computedHeight,containingBlockData,fontMetrics));
			if(style.top == cocktail.core.style.PositionOffset.cssAuto && style.bottom == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_top(this.getComputedStaticTop(style,containingBlockData));
				style.computedStyle.set_bottom(containingBlockData.height - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop());
			} else if(style.bottom == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
				style.computedStyle.set_bottom(containingBlockData.height - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop());
			} else if(style.top == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
				style.computedStyle.set_top(containingBlockData.height - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getBottom());
			}
		}
		return computedHeight;
	}
	,measureAutoHeight: function(style,containingBlockData,fontMetrics) {
		var computedStyle = style.computedStyle;
		var computedHeight = 0.0;
		if(style.marginTop == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginTop(0); else style.computedStyle.set_marginTop(this.getComputedMarginTop(style,computedHeight,containingBlockData,fontMetrics));
		if(style.marginBottom == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginBottom(0); else style.computedStyle.set_marginBottom(this.getComputedMarginBottom(style,computedHeight,containingBlockData,fontMetrics));
		if(style.top != cocktail.core.style.PositionOffset.cssAuto && style.bottom != cocktail.core.style.PositionOffset.cssAuto) {
			style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
			style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
			computedHeight = containingBlockData.height - computedStyle.getMarginTop() - computedStyle.getTop() - computedStyle.getBottom() - computedStyle.getMarginBottom() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom();
		} else if(style.bottom == cocktail.core.style.PositionOffset.cssAuto) {
			style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
			style.computedStyle.set_bottom(containingBlockData.height - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop());
		} else if(style.top == cocktail.core.style.PositionOffset.cssAuto) {
			style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,fontMetrics.fontSize,fontMetrics.xHeight));
			style.computedStyle.set_top(containingBlockData.height - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getBottom());
		}
		return computedHeight;
	}
	,measureWidth: function(style,containingBlockData,fontMetrics) {
		var computedStyle = style.computedStyle;
		var computedWidth = this.getComputedWidth(style,containingBlockData,fontMetrics);
		if(style.left != cocktail.core.style.PositionOffset.cssAuto && style.right != cocktail.core.style.PositionOffset.cssAuto) {
			style.computedStyle.set_left(this.getComputedPositionOffset(style.left,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
			style.computedStyle.set_right(this.getComputedPositionOffset(style.right,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
			if(style.marginLeft == cocktail.core.style.Margin.cssAuto && style.marginRight == cocktail.core.style.Margin.cssAuto) {
				var computedMargin = (containingBlockData.width - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft() - computedStyle.getRight()) / 2;
				if(computedMargin >= 0) {
					style.computedStyle.set_marginLeft(computedMargin);
					style.computedStyle.set_marginRight(computedMargin);
				} else {
					style.computedStyle.set_marginLeft(0);
					style.computedStyle.set_marginRight(containingBlockData.width - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft() - computedStyle.getRight());
				}
			} else if(style.marginLeft == cocktail.core.style.Margin.cssAuto) {
				style.computedStyle.set_marginRight(this.getComputedMarginRight(style,computedWidth,containingBlockData,fontMetrics));
				style.computedStyle.set_marginLeft(containingBlockData.width - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft() - computedStyle.getRight() - computedStyle.getMarginRight());
			} else if(style.marginRight == cocktail.core.style.Margin.cssAuto) {
				style.computedStyle.set_marginLeft(this.getComputedMarginLeft(style,computedWidth,containingBlockData,fontMetrics));
				style.computedStyle.set_marginRight(containingBlockData.width - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft() - computedStyle.getRight() - computedStyle.getMarginLeft());
			} else {
				style.computedStyle.set_marginLeft(this.getComputedMarginLeft(style,computedWidth,containingBlockData,fontMetrics));
				style.computedStyle.set_marginRight(this.getComputedMarginRight(style,computedWidth,containingBlockData,fontMetrics));
			}
		} else {
			if(style.marginLeft == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginLeft(0); else style.computedStyle.set_marginLeft(this.getComputedMarginLeft(style,computedWidth,containingBlockData,fontMetrics));
			if(style.marginRight == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginRight(0); else style.computedStyle.set_marginRight(this.getComputedMarginRight(style,computedWidth,containingBlockData,fontMetrics));
			if(style.left == cocktail.core.style.PositionOffset.cssAuto && style.right == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_left(this.getComputedStaticLeft(style,containingBlockData));
				style.computedStyle.set_right(containingBlockData.width - computedStyle.getMarginLeft() - computedStyle.getMarginRight() - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft());
			} else if(style.left == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_right(this.getComputedPositionOffset(style.right,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
				style.computedStyle.set_left(containingBlockData.width - computedStyle.getMarginLeft() - computedStyle.getMarginRight() - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getRight());
			} else if(style.right == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_left(this.getComputedPositionOffset(style.left,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
				style.computedStyle.set_right(containingBlockData.width - computedStyle.getMarginLeft() - computedStyle.getMarginRight() - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft());
			}
		}
		return computedWidth;
	}
	,measureAutoWidth: function(style,containingBlockData,fontMetrics) {
		var computedStyle = style.computedStyle;
		var computedWidth = 0.0;
		if(style.marginLeft == cocktail.core.style.Margin.cssAuto) computedStyle.set_marginLeft(0); else computedStyle.set_marginLeft(this.getComputedMarginLeft(style,computedWidth,containingBlockData,fontMetrics));
		if(style.marginRight == cocktail.core.style.Margin.cssAuto) computedStyle.set_marginRight(0); else computedStyle.set_marginRight(this.getComputedMarginRight(style,computedWidth,containingBlockData,fontMetrics));
		if(style.left != cocktail.core.style.PositionOffset.cssAuto && style.right != cocktail.core.style.PositionOffset.cssAuto) {
			computedStyle.set_left(this.getComputedPositionOffset(style.left,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
			computedStyle.set_right(this.getComputedPositionOffset(style.right,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
			computedWidth = containingBlockData.width - computedStyle.getMarginLeft() - computedStyle.getLeft() - computedStyle.getRight() - computedStyle.getMarginRight() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight();
		} else {
			if(style.left == cocktail.core.style.PositionOffset.cssAuto) style.computedStyle.set_right(this.getComputedPositionOffset(style.right,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight)); else if(style.right == cocktail.core.style.PositionOffset.cssAuto) style.computedStyle.set_left(this.getComputedPositionOffset(style.left,containingBlockData.width,fontMetrics.fontSize,fontMetrics.xHeight));
			computedWidth = containingBlockData.width;
		}
		return computedWidth;
	}
	,measurePositionOffsets: function(style,containingBlockData,fontMetrics) {
	}
	,__class__: cocktail.core.style.computer.boxComputers.PositionedBoxStylesComputer
});
cocktail.core.style.floats = {}
cocktail.core.style.floats.FloatsManager = function() {
	var floatsLeft = new Array();
	var floatsRight = new Array();
	this._floats = { left : floatsLeft, right : floatsRight};
};
$hxClasses["cocktail.core.style.floats.FloatsManager"] = cocktail.core.style.floats.FloatsManager;
cocktail.core.style.floats.FloatsManager.__name__ = ["cocktail","core","style","floats","FloatsManager"];
cocktail.core.style.floats.FloatsManager.prototype = {
	getFloats: function() {
		return this._floats;
	}
	,getLeftFloatOffset: function(y) {
		var leftFloatOffset = 0;
		var _g1 = 0, _g = this._floats.left.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._floats.left[i].y + this._floats.left[i].height > y && this._floats.left[i].y <= y) {
				if(this._floats.left[i].x + this._floats.left[i].width > leftFloatOffset) leftFloatOffset = this._floats.left[i].x + this._floats.left[i].width;
			}
		}
		return leftFloatOffset;
	}
	,getRightFloatOffset: function(y,containingWidth) {
		var rightFloatOffset = 0;
		var _g1 = 0, _g = this._floats.right.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._floats.right[i].y + this._floats.right[i].height > y && this._floats.right[i].y <= y) {
				if(containingWidth - this._floats.right[i].x > rightFloatOffset) rightFloatOffset = containingWidth - this._floats.right[i].x;
			}
		}
		return rightFloatOffset;
	}
	,doRemoveFloat: function(floats,flowY) {
		var newFloats = new Array();
		var _g1 = 0, _g = floats.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(floats[i].y + floats[i].height > flowY) newFloats.push(floats[i]);
		}
		return newFloats;
	}
	,removeFloats: function(flowY) {
		this._floats.left = this.doRemoveFloat(this._floats.left,flowY);
		this._floats.right = this.doRemoveFloat(this._floats.right,flowY);
	}
	,getFirstAvailableY: function(currentFormattingContextY,elementWidth,containingBlockWidth) {
		var retY = currentFormattingContextY;
		while(this.getLeftFloatOffset(retY) + this.getRightFloatOffset(retY,containingBlockWidth) + elementWidth > containingBlockWidth) {
			var afterFloats = new Array();
			var leftFloatLength = this._floats.left.length;
			var _g = 0;
			while(_g < leftFloatLength) {
				var i = _g++;
				if(this._floats.left[i].y <= retY && this._floats.left[i].height + this._floats.left[i].y > retY) afterFloats.push(this._floats.left[i]);
			}
			var _g1 = 0, _g = this._floats.right.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(this._floats.right[i].y <= retY && this._floats.right[i].height + this._floats.right[i].y > retY) afterFloats.push(this._floats.right[i]);
			}
			if(afterFloats.length == 0) break; else {
				var nextY = 1000000;
				var _g1 = 0, _g = afterFloats.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(afterFloats[i].y + afterFloats[i].height - retY < nextY) nextY = afterFloats[i].y + afterFloats[i].height - retY;
				}
				retY += nextY;
			}
		}
		return retY;
	}
	,getFloatData: function(elementRenderer,currentFormattingContextY,currentFormattingContextX,containingBlockWidth) {
		var computedStyle = elementRenderer.get_coreStyle().computedStyle;
		var floatWidth = computedStyle.getWidth() + computedStyle.getPaddingLeft() + computedStyle.getPaddingRight() + computedStyle.getMarginLeft() + computedStyle.getMarginRight();
		var floatHeight = computedStyle.getHeight() + computedStyle.getPaddingTop() + computedStyle.getPaddingBottom() + computedStyle.getMarginTop() + computedStyle.getMarginBottom();
		var floatY = this.getFirstAvailableY(currentFormattingContextY,floatWidth,containingBlockWidth);
		var floatX = 0.0;
		return { x : floatX, y : floatY, width : floatWidth, height : floatHeight};
	}
	,getRightFloatData: function(elementRenderer,currentFormattingContextY,currentFormattingContextX,containingBlockWidth) {
		var floatData = this.getFloatData(elementRenderer,currentFormattingContextY,currentFormattingContextX,containingBlockWidth);
		floatData.x = containingBlockWidth - floatData.width - this.getRightFloatOffset(floatData.y,containingBlockWidth);
		return floatData;
	}
	,getLeftFloatData: function(elementRenderer,currentFormattingContextY,currentFormattingContextX,containingBlockWidth) {
		var floatData = this.getFloatData(elementRenderer,currentFormattingContextY,currentFormattingContextX,containingBlockWidth);
		floatData.x = this.getLeftFloatOffset(floatData.y);
		return floatData;
	}
	,registerFloat: function(elementRenderer,currentFormattingContextY,currentFormattingContextX,containingBlockWidth) {
		var ret;
		switch( (elementRenderer.get_coreStyle().computedStyle.cssFloat)[1] ) {
		case 0:
			ret = this.getLeftFloatData(elementRenderer,currentFormattingContextY,currentFormattingContextX,containingBlockWidth);
			this._floats.left.push(ret);
			break;
		case 1:
			ret = this.getRightFloatData(elementRenderer,currentFormattingContextY,currentFormattingContextX,containingBlockWidth);
			this._floats.right.push(ret);
			break;
		case 2:
			ret = null;
			break;
		}
		return ret;
	}
	,doClearFloat: function(currentFormattingContextY,floats) {
		if(floats.length > 0) {
			var highestFloat = floats[0];
			var _g1 = 0, _g = floats.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(floats[i].y + floats[i].height > highestFloat.y + highestFloat.height) highestFloat = floats[i];
			}
			return highestFloat.y + highestFloat.height;
		} else return currentFormattingContextY;
	}
	,clearBoth: function(currentFormattingContextY) {
		var leftY = this.doClearFloat(currentFormattingContextY,this._floats.left);
		var rightY = this.doClearFloat(currentFormattingContextY,this._floats.right);
		if(leftY > rightY) return leftY; else return rightY;
	}
	,clearRight: function(currentFormattingContextY) {
		return this.doClearFloat(currentFormattingContextY,this._floats.right);
	}
	,clearLeft: function(currentFormattingContextY) {
		return this.doClearFloat(currentFormattingContextY,this._floats.left);
	}
	,clearFloat: function(clear,currentFormattingContextY) {
		var ret;
		switch( (clear)[1] ) {
		case 1:
			ret = this.clearLeft(currentFormattingContextY);
			this._floats.left = new Array();
			break;
		case 2:
			ret = this.clearRight(currentFormattingContextY);
			this._floats.right = new Array();
			break;
		case 3:
			ret = this.clearBoth(currentFormattingContextY);
			this._floats.right = new Array();
			this._floats.left = new Array();
			break;
		case 0:
			ret = currentFormattingContextY;
			break;
		}
		return ret;
	}
	,floats: null
	,_floats: null
	,__class__: cocktail.core.style.floats.FloatsManager
	,__properties__: {get_floats:"getFloats"}
}
cocktail.core.style.formatter = {}
cocktail.core.style.formatter.FormattingContext = function(formattingContextRoot) {
	this._formattingContextRoot = formattingContextRoot;
};
$hxClasses["cocktail.core.style.formatter.FormattingContext"] = cocktail.core.style.formatter.FormattingContext;
cocktail.core.style.formatter.FormattingContext.__name__ = ["cocktail","core","style","formatter","FormattingContext"];
cocktail.core.style.formatter.FormattingContext.prototype = {
	applyShrinkToFitIfNeeded: function(elementRenderer,minimumWidth) {
		var shrinkedWidth = elementRenderer.get_coreStyle().computedStyle.getWidth();
		if(elementRenderer.get_coreStyle().width == cocktail.core.style.Dimension.cssAuto) {
			if(elementRenderer.isFloat() == true || elementRenderer.get_coreStyle().computedStyle.display == cocktail.core.style.Display.inlineBlock) shrinkedWidth = minimumWidth; else if(elementRenderer.isPositioned() == true && elementRenderer.isRelativePositioned() == false) {
				var style = elementRenderer.get_coreStyle();
				if(style.left == cocktail.core.style.PositionOffset.cssAuto || style.right == cocktail.core.style.PositionOffset.cssAuto) {
					var computedStyle = style.computedStyle;
					shrinkedWidth = minimumWidth;
				}
			}
		} else shrinkedWidth = elementRenderer.get_coreStyle().computedStyle.getWidth();
		elementRenderer.get_coreStyle().computedStyle.set_width(shrinkedWidth);
	}
	,startFormatting: function() {
	}
	,format: function(floatsManager) {
		this._floatsManager = floatsManager;
		this.initFormattingContextData();
		this.startFormatting();
		this.applyShrinkToFitIfNeeded(this._formattingContextRoot,this._formattingContextData.width);
	}
	,initFormattingContextData: function() {
		var x = this._formattingContextRoot.get_coreStyle().computedStyle.getPaddingLeft();
		var y = this._formattingContextRoot.get_coreStyle().computedStyle.getPaddingTop();
		this._formattingContextData = { x : x, y : y, height : 0.0, width : 0.0};
	}
	,_formattingContextData: null
	,_floatsManager: null
	,_formattingContextRoot: null
	,__class__: cocktail.core.style.formatter.FormattingContext
}
cocktail.core.style.formatter.BlockFormattingContext = function(formattingContextRoot) {
	cocktail.core.style.formatter.FormattingContext.call(this,formattingContextRoot);
	this._registeredFloats = new Array();
};
$hxClasses["cocktail.core.style.formatter.BlockFormattingContext"] = cocktail.core.style.formatter.BlockFormattingContext;
cocktail.core.style.formatter.BlockFormattingContext.__name__ = ["cocktail","core","style","formatter","BlockFormattingContext"];
cocktail.core.style.formatter.BlockFormattingContext.__super__ = cocktail.core.style.formatter.FormattingContext;
cocktail.core.style.formatter.BlockFormattingContext.prototype = $extend(cocktail.core.style.formatter.FormattingContext.prototype,{
	getCollapsedMarginBottom: function(child,parentCollapsedMarginBottom) {
		var childComputedStyle = child.get_coreStyle().computedStyle;
		var marginBottom = childComputedStyle.getMarginBottom();
		if(childComputedStyle.getPaddingBottom() == 0) {
			if(child.get_nextSibling() != null) {
				var nextSibling = child.get_nextSibling();
				var nextSiblingComputedStyle = nextSibling.get_coreStyle().computedStyle;
				if(nextSiblingComputedStyle.getPaddingTop() == 0) {
					if(nextSiblingComputedStyle.getMarginTop() > marginBottom) marginBottom = 0;
				}
			} else if(child.parentNode != null) {
				var parent = child.parentNode;
				if(parent.establishesNewFormattingContext() == false) {
					if(parent.get_coreStyle().computedStyle.getPaddingBottom() == 0) {
						if(parentCollapsedMarginBottom > marginBottom) marginBottom = 0;
					}
				}
			}
		}
		return marginBottom;
	}
	,getCollapsedMarginTop: function(child,parentCollapsedMarginTop) {
		var childComputedStyle = child.get_coreStyle().computedStyle;
		var marginTop = childComputedStyle.getMarginTop();
		if(childComputedStyle.getPaddingTop() == 0) {
			if(child.get_previousSibling() != null) {
				var previousSibling = child.get_previousSibling();
				var previsousSiblingComputedStyle = previousSibling.get_coreStyle().computedStyle;
				if(previsousSiblingComputedStyle.getPaddingBottom() == 0) {
					if(previsousSiblingComputedStyle.getMarginBottom() > marginTop) {
						if(marginTop > 0) marginTop = 0;
					}
				}
			} else if(child.parentNode != null) {
				var parent = child.parentNode;
				if(parent.establishesNewFormattingContext() == false) {
					if(parent.get_coreStyle().computedStyle.getPaddingTop() == 0) {
						if(parentCollapsedMarginTop > marginTop) marginTop = 0;
					}
				}
			}
		}
		return marginTop;
	}
	,doFormat: function(elementRenderer,concatenatedX,concatenatedY,currentLineY,parentCollapsedMarginTop,parentCollapsedMarginBottom) {
		var elementRendererComputedStyle = elementRenderer.get_coreStyle().computedStyle;
		concatenatedX += elementRendererComputedStyle.getPaddingLeft() + elementRendererComputedStyle.getMarginLeft();
		concatenatedY += elementRendererComputedStyle.getPaddingTop() + parentCollapsedMarginTop;
		var childHeight = concatenatedY;
		var length = elementRenderer.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = elementRenderer.childNodes[i];
			var marginTop = this.getCollapsedMarginTop(child,parentCollapsedMarginTop);
			var marginBottom = this.getCollapsedMarginBottom(child,parentCollapsedMarginBottom);
			var computedStyle = child.get_coreStyle().computedStyle;
			var width = computedStyle.getWidth() + computedStyle.getPaddingLeft() + computedStyle.getPaddingRight();
			var height = computedStyle.getHeight() + computedStyle.getPaddingTop() + computedStyle.getPaddingBottom();
			var x = concatenatedX + child.get_coreStyle().computedStyle.getMarginLeft();
			var y = concatenatedY + marginTop;
			var childBounds = child.get_bounds();
			childBounds.x = x;
			childBounds.y = y;
			childBounds.width = width;
			childBounds.height = height;
			if(child.isFloat() == true) {
				if(this.isFloatRegistered(child) == false) {
					var floatBounds = this._floatsManager.registerFloat(child,concatenatedY,0,elementRendererComputedStyle.getWidth());
					this._registeredFloats.push({ node : child, bounds : floatBounds});
					this.format(this._floatsManager);
					return 0.0;
				}
				var floatBounds = this.getRegisteredFloat(child).bounds;
				childBounds.x = floatBounds.x + computedStyle.getMarginLeft();
				childBounds.y = floatBounds.y + computedStyle.getMarginTop();
				childBounds.x += concatenatedX;
			} else if(child.hasChildNodes() == true) {
				if(child.establishesNewFormattingContext() == false) {
					currentLineY = child.get_bounds().y;
					concatenatedY = this.doFormat(child,concatenatedX,concatenatedY,currentLineY,marginTop,marginBottom);
				} else if((child.isPositioned() == false || child.isRelativePositioned() == true) && child.isFloat() == false) {
					if(child.childrenInline() == true) {
						var inlineFormattingContext = new cocktail.core.style.formatter.InlineFormattingContext(child);
						inlineFormattingContext.format(this._floatsManager);
					}
					currentLineY = child.get_bounds().y;
					concatenatedY += child.get_bounds().height + marginTop + marginBottom;
				}
			} else if(child.isPositioned() == false || child.isRelativePositioned() == true) concatenatedY += child.get_bounds().height + marginTop + marginBottom;
			if(childBounds.x + childBounds.width + computedStyle.getMarginRight() > this._formattingContextData.width) {
				if(child.isAnonymousBlockBox() == false) this._formattingContextData.width = childBounds.x + childBounds.width + computedStyle.getMarginRight();
			}
			if(concatenatedY > this._formattingContextData.height) this._formattingContextData.height = concatenatedY;
		}
		if(elementRenderer.get_coreStyle().height == cocktail.core.style.Dimension.cssAuto) {
			childHeight = concatenatedY - childHeight;
			elementRenderer.get_bounds().height = childHeight + elementRendererComputedStyle.getPaddingBottom() + elementRendererComputedStyle.getPaddingTop();
			elementRendererComputedStyle.set_height(childHeight);
		} else {
			concatenatedY = childHeight;
			concatenatedY += elementRenderer.get_bounds().height;
		}
		concatenatedY += elementRendererComputedStyle.getPaddingBottom() + parentCollapsedMarginBottom;
		this._floatsManager.removeFloats(concatenatedY);
		return concatenatedY;
	}
	,getRegisteredFloat: function(child) {
		var length = this._registeredFloats.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			if(this._registeredFloats[i].node == child) return this._registeredFloats[i];
		}
		return null;
	}
	,isFloatRegistered: function(child) {
		var length = this._registeredFloats.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			if(this._registeredFloats[i].node == child) return true;
		}
		return false;
	}
	,startFormatting: function() {
		this.doFormat(this._formattingContextRoot,-this._formattingContextRoot.get_coreStyle().computedStyle.getMarginLeft(),-this._formattingContextRoot.get_coreStyle().computedStyle.getMarginTop(),0,this._formattingContextRoot.get_coreStyle().computedStyle.getMarginTop(),this._formattingContextRoot.get_coreStyle().computedStyle.getMarginBottom());
	}
	,_registeredFloats: null
	,__class__: cocktail.core.style.formatter.BlockFormattingContext
});
cocktail.core.style.formatter.InlineFormattingContext = function(formattingContextRoot) {
	this._unbreakableLineBoxes = new Array();
	this._unbreakableWidth = 0.0;
	this._firstLineFormatted = false;
	cocktail.core.style.formatter.FormattingContext.call(this,formattingContextRoot);
};
$hxClasses["cocktail.core.style.formatter.InlineFormattingContext"] = cocktail.core.style.formatter.InlineFormattingContext;
cocktail.core.style.formatter.InlineFormattingContext.__name__ = ["cocktail","core","style","formatter","InlineFormattingContext"];
cocktail.core.style.formatter.InlineFormattingContext.__super__ = cocktail.core.style.formatter.FormattingContext;
cocktail.core.style.formatter.InlineFormattingContext.prototype = $extend(cocktail.core.style.formatter.FormattingContext.prototype,{
	alignLineBoxesVertically: function(lineBox,lineBoxAscent,formattingContextY,parentBaseLineOffset,formattingContextFontMetrics) {
		var length = lineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = lineBox.childNodes[i];
			var baselineOffset = child.getBaselineOffset(parentBaseLineOffset,formattingContextFontMetrics.xHeight);
			switch( (child.elementRenderer.get_coreStyle().verticalAlign)[1] ) {
			case 3:
				child.get_bounds().y = formattingContextY;
				break;
			default:
				child.get_bounds().y = formattingContextY - baselineOffset + lineBoxAscent;
				child.get_bounds().y -= child.get_leadedAscent();
			}
			if(child.hasChildNodes() == true) this.alignLineBoxesVertically(child,lineBoxAscent,formattingContextY,baselineOffset,formattingContextFontMetrics);
		}
	}
	,setRootLineBoxMetrics: function(lineBox,rootLineBox,parentBaseLineOffset,formattingContextFontMetrics) {
		var length = lineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = lineBox.childNodes[i];
			if(child.isStaticPosition() == false) {
				var leadedAscent = child.get_leadedAscent();
				var leadedDescent = child.get_leadedDescent();
				var baselineOffset = child.getBaselineOffset(parentBaseLineOffset,formattingContextFontMetrics.xHeight);
				if(leadedAscent + baselineOffset > rootLineBox.get_leadedAscent()) rootLineBox.set_leadedAscent(leadedAscent + baselineOffset);
				if(leadedDescent + baselineOffset > rootLineBox.get_leadedDescent()) rootLineBox.set_leadedDescent(leadedDescent + baselineOffset);
				if(child.hasChildNodes() == true) this.setRootLineBoxMetrics(child,rootLineBox,baselineOffset,formattingContextFontMetrics);
			}
		}
	}
	,computeLineBoxHeight: function(rootLineBox) {
		var formattingContextFontMetrics = this._formattingContextRoot.get_coreStyle().get_fontMetricsData();
		this.setRootLineBoxMetrics(rootLineBox,rootLineBox,0.0,formattingContextFontMetrics);
		this.alignLineBoxesVertically(rootLineBox,rootLineBox.get_leadedAscent(),this._formattingContextData.y,0.0,formattingContextFontMetrics);
		var lineBoxHeight = rootLineBox.get_bounds().height;
		return lineBoxHeight;
	}
	,getLineBoxTreeAsArray: function(rootLineBox) {
		var ret = new Array();
		var _g1 = 0, _g = rootLineBox.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			var child = rootLineBox.childNodes[i];
			if(child.hasChildNodes() == true && child.isStaticPosition() == false) {
				var children = this.getLineBoxTreeAsArray(child);
				var _g3 = 0, _g2 = children.length;
				while(_g3 < _g2) {
					var j = _g3++;
					ret.push(children[j]);
				}
			} else ret.push(child);
		}
		return ret;
	}
	,removeSpaces: function(rootLineBox) {
		var lineBoxes = this.getLineBoxTreeAsArray(rootLineBox);
		if(lineBoxes.length == 0) return;
		var i = 0;
		try {
			while(i < lineBoxes.length) {
				var lineBox = lineBoxes[i];
				if(lineBox.isSpace() == true) {
					switch( (lineBox.elementRenderer.get_coreStyle().computedStyle.whiteSpace)[1] ) {
					case 0:
					case 2:
					case 4:
						lineBox.parentNode.removeChild(lineBox);
						break;
					default:
						throw "__break__";
					}
				} else if(lineBox.isStaticPosition() == false) throw "__break__";
				i++;
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		lineBoxes = this.getLineBoxTreeAsArray(rootLineBox);
		if(lineBoxes.length == 0) return;
		var i1 = lineBoxes.length - 1;
		try {
			while(i1 >= 0) {
				var lineBox = lineBoxes[i1];
				if(lineBox.isSpace() == true) {
					switch( (lineBox.elementRenderer.get_coreStyle().computedStyle.whiteSpace)[1] ) {
					case 0:
					case 2:
					case 4:
						lineBox.parentNode.removeChild(lineBox);
						break;
					default:
						throw "__break__";
					}
				} else if(lineBox.isStaticPosition() == false) throw "__break__";
				i1--;
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
	}
	,alignJustify: function(flowX,remainingSpace,lineBox,spacesInLine) {
		var length = lineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = lineBox.childNodes[i];
			if(child.isSpace() == true) {
				var spaceWidth = remainingSpace / spacesInLine;
				spacesInLine--;
				remainingSpace -= spaceWidth;
				flowX += spaceWidth;
			}
			child.get_bounds().x = flowX;
			flowX += child.get_bounds().width;
			if(child.hasChildNodes() == true) this.alignJustify(flowX,remainingSpace,child,spacesInLine);
		}
	}
	,alignRight: function(flowX,remainingSpace,lineBox) {
		flowX += lineBox.marginLeft + lineBox.paddingLeft;
		var length = lineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = lineBox.childNodes[i];
			if(child.hasChildNodes() == true) flowX = this.alignRight(flowX,remainingSpace,child);
			child.get_bounds().x = flowX + remainingSpace;
			flowX += child.get_bounds().width;
		}
		flowX += lineBox.marginRight + lineBox.paddingRight;
		return flowX;
	}
	,alignCenter: function(flowX,remainingSpace,lineBox) {
		flowX += lineBox.marginLeft + lineBox.paddingLeft;
		var length = lineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = lineBox.childNodes[i];
			if(child.hasChildNodes() == true) flowX = this.alignCenter(flowX,remainingSpace,child);
			child.get_bounds().x = remainingSpace / 2 + flowX;
			flowX += child.get_bounds().width;
		}
		flowX += lineBox.marginRight + lineBox.paddingRight;
		return flowX;
	}
	,alignLeft: function(flowX,lineBox) {
		flowX += lineBox.paddingLeft + lineBox.marginLeft;
		var length = lineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = lineBox.childNodes[i];
			if(child.hasChildNodes() == true && child.isStaticPosition() == false) flowX = this.alignLeft(flowX,child); else {
				child.get_bounds().x = flowX + child.marginLeft;
				if(child.isStaticPosition() == false) flowX += child.get_bounds().width + child.marginLeft + child.marginRight;
			}
		}
		flowX += lineBox.paddingRight + lineBox.marginRight;
		return flowX;
	}
	,alignLineBox: function(rootLineBox,isLastLine,concatenatedLength) {
		var remainingSpace;
		var flowX;
		var formattingContextRootComputedStyle = this._formattingContextRoot.get_coreStyle().computedStyle;
		remainingSpace = formattingContextRootComputedStyle.getWidth() - concatenatedLength - this._floatsManager.getLeftFloatOffset(this._formattingContextData.y) - this._floatsManager.getRightFloatOffset(this._formattingContextData.y + this._formattingContextRoot.get_bounds().y,formattingContextRootComputedStyle.getWidth());
		flowX = formattingContextRootComputedStyle.getPaddingLeft();
		if(this._firstLineFormatted == false) {
			flowX += formattingContextRootComputedStyle.getTextIndent();
			remainingSpace -= formattingContextRootComputedStyle.getTextIndent();
		}
		flowX += this._floatsManager.getLeftFloatOffset(this._formattingContextData.y + this._formattingContextRoot.get_bounds().y);
		switch( (formattingContextRootComputedStyle.textAlign)[1] ) {
		case 0:
			this.alignLeft(flowX,rootLineBox);
			break;
		case 1:
			this.alignRight(flowX,remainingSpace,rootLineBox);
			break;
		case 2:
			this.alignCenter(flowX,remainingSpace,rootLineBox);
			break;
		case 3:
			if(isLastLine == true) this.alignLeft(flowX,rootLineBox); else {
				concatenatedLength = formattingContextRootComputedStyle.getWidth();
				this.alignJustify(flowX,remainingSpace,rootLineBox,this.getSpacesNumber(rootLineBox));
			}
			break;
		}
		return concatenatedLength;
	}
	,getRemainingLineWidth: function() {
		return this._formattingContextRoot.get_coreStyle().computedStyle.getWidth() - this._formattingContextData.x - this._floatsManager.getRightFloatOffset(this._formattingContextData.y + this._formattingContextRoot.get_bounds().y,this._formattingContextRoot.get_coreStyle().computedStyle.getWidth());
	}
	,getSpacesNumber: function(lineBox) {
		var spacesNumber = 0;
		var _g1 = 0, _g = lineBox.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			var child = lineBox.childNodes[i];
			if(child.hasChildNodes() == true) spacesNumber += this.getSpacesNumber(child);
			if(child.isSpace() == true) spacesNumber++;
		}
		return spacesNumber;
	}
	,getConcatenatedWidth: function(lineBox) {
		var concatenatedWidth = 0.0;
		var length = lineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = lineBox.childNodes[i];
			if(child.isStaticPosition() == false) {
				if(child.hasChildNodes() == true) concatenatedWidth += this.getConcatenatedWidth(child);
				concatenatedWidth += child.get_bounds().width;
			}
		}
		return concatenatedWidth;
	}
	,formatLine: function(rootLineBox,isLastLine) {
		this.removeSpaces(rootLineBox);
		var lineBoxWidth = this.alignLineBox(rootLineBox,isLastLine,this.getConcatenatedWidth(rootLineBox));
		if(lineBoxWidth > this._formattingContextData.width) this._formattingContextData.width = lineBoxWidth;
		var lineBoxHeight = this.computeLineBoxHeight(rootLineBox);
		this._formattingContextData.y += lineBoxHeight;
		this._firstLineFormatted = true;
	}
	,insertIntoLine: function(lineBoxes,lineBox,rootLineBoxes,openedElementRenderers) {
		var length = lineBoxes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			this._unbreakableLineBoxes.push(lineBoxes[i]);
			if(lineBoxes[i].isStaticPosition() == false) this._unbreakableWidth += lineBoxes[i].get_bounds().width + lineBox.marginLeft + lineBox.marginRight;
			var remainingLineWidth = this.getRemainingLineWidth();
			if(remainingLineWidth - this._unbreakableWidth < 0) {
				this._formattingContextData.y = this._floatsManager.getFirstAvailableY(this._formattingContextData.y + this._formattingContextRoot.get_bounds().y,this._unbreakableWidth,this._formattingContextRoot.get_coreStyle().computedStyle.getWidth());
				this._formattingContextData.y -= this._formattingContextRoot.get_bounds().y;
				this._formattingContextData.x = this._floatsManager.getLeftFloatOffset(this._formattingContextData.y + this._formattingContextRoot.get_bounds().y);
				this.formatLine(rootLineBoxes[rootLineBoxes.length - 1],false);
				var rootLineBox = new cocktail.core.linebox.RootLineBox(this._formattingContextRoot);
				rootLineBoxes.push(rootLineBox);
				lineBox = rootLineBox;
				var _g2 = 0, _g1 = openedElementRenderers.length;
				while(_g2 < _g1) {
					var j = _g2++;
					var childLineBox = this.createContainerLineBox(openedElementRenderers[j]);
					lineBox.appendChild(childLineBox);
					lineBox = childLineBox;
				}
			}
			var unbreakableLength = this._unbreakableLineBoxes.length;
			var _g1 = 0;
			while(_g1 < unbreakableLength) {
				var j = _g1++;
				lineBox.appendChild(this._unbreakableLineBoxes[j]);
			}
			this._formattingContextData.x += this._unbreakableWidth;
			this._unbreakableLineBoxes = new Array();
			this._unbreakableWidth = 0;
		}
		return lineBox;
	}
	,createContainerLineBox: function(child) {
		var lineBox = new cocktail.core.linebox.LineBox(child);
		child.lineBoxes.push(lineBox);
		return lineBox;
	}
	,doFormat: function(elementRenderer,lineBox,rootLineBoxes,openedElementRenderers) {
		var length = elementRenderer.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = elementRenderer.childNodes[i];
			if(child.isPositioned() == true && child.isRelativePositioned() == false) {
				var staticLineBox = new cocktail.core.linebox.StaticPositionLineBox(child);
				child.get_bounds().width = child.get_coreStyle().computedStyle.getWidth() + child.get_coreStyle().computedStyle.getPaddingLeft() + child.get_coreStyle().computedStyle.getPaddingRight();
				child.get_bounds().height = child.get_coreStyle().computedStyle.getHeight() + child.get_coreStyle().computedStyle.getPaddingTop() + child.get_coreStyle().computedStyle.getPaddingBottom();
				lineBox = this.insertIntoLine([staticLineBox],lineBox,rootLineBoxes,openedElementRenderers);
			} else if(child.establishesNewFormattingContext() == true || child.isReplaced() == true) {
				var childComputedStyle = child.get_coreStyle().computedStyle;
				var childBounds = child.get_bounds();
				childBounds.width = childComputedStyle.getWidth() + childComputedStyle.getPaddingLeft() + childComputedStyle.getPaddingRight();
				childBounds.height = childComputedStyle.getHeight() + childComputedStyle.getPaddingTop() + childComputedStyle.getPaddingBottom();
				var embeddedLineBox = new cocktail.core.linebox.EmbeddedLineBox(child);
				embeddedLineBox.marginLeft = childComputedStyle.getMarginLeft();
				embeddedLineBox.marginRight = childComputedStyle.getMarginRight();
				lineBox = this.insertIntoLine([embeddedLineBox],lineBox,rootLineBoxes,openedElementRenderers);
			} else if(child.hasChildNodes() == true) {
				child.lineBoxes = new Array();
				var childLineBox = this.createContainerLineBox(child);
				var childComputedStyle = child.get_coreStyle().computedStyle;
				childLineBox.marginLeft = childComputedStyle.getMarginLeft();
				childLineBox.paddingLeft = childComputedStyle.getPaddingLeft();
				this._unbreakableWidth += childComputedStyle.getMarginLeft() + childComputedStyle.getPaddingLeft();
				lineBox.appendChild(childLineBox);
				openedElementRenderers.push(child);
				lineBox = this.doFormat(child,childLineBox,rootLineBoxes,openedElementRenderers);
				openedElementRenderers.pop();
				lineBox = lineBox.parentNode;
				var lastLineBox = child.lineBoxes[child.lineBoxes.length - 1];
				lastLineBox.marginRight = childComputedStyle.getMarginRight();
				lastLineBox.paddingRight = childComputedStyle.getPaddingRight();
				this._unbreakableWidth += childComputedStyle.getMarginRight() + childComputedStyle.getPaddingRight();
			} else lineBox = this.insertIntoLine(child.lineBoxes,lineBox,rootLineBoxes,openedElementRenderers);
		}
		return lineBox;
	}
	,startFormatting: function() {
		this._unbreakableLineBoxes = new Array();
		var rootLineBoxes = new Array();
		var initialRootLineBox = new cocktail.core.linebox.RootLineBox(this._formattingContextRoot);
		rootLineBoxes.push(initialRootLineBox);
		this._firstLineFormatted = false;
		this._unbreakableWidth = this._formattingContextRoot.get_coreStyle().computedStyle.getTextIndent();
		this._formattingContextData.x = this._formattingContextRoot.get_coreStyle().computedStyle.getTextIndent();
		this._formattingContextData.x += this._floatsManager.getLeftFloatOffset(this._formattingContextRoot.get_bounds().y);
		this.doFormat(this._formattingContextRoot,initialRootLineBox,rootLineBoxes,[]);
		this.formatLine(rootLineBoxes[rootLineBoxes.length - 1],true);
		this._formattingContextRoot.lineBoxes = rootLineBoxes;
		if(this._formattingContextRoot.get_coreStyle().height == cocktail.core.style.Dimension.cssAuto) {
			var formattingContextComputedStyle = this._formattingContextRoot.get_coreStyle().computedStyle;
			this._formattingContextRoot.get_bounds().height = this._formattingContextData.y + formattingContextComputedStyle.getPaddingBottom();
			formattingContextComputedStyle.set_height(this._formattingContextData.y - formattingContextComputedStyle.getPaddingTop());
		}
	}
	,_firstLineFormatted: null
	,_unbreakableWidth: null
	,_unbreakableLineBoxes: null
	,__class__: cocktail.core.style.formatter.InlineFormattingContext
});
cocktail.core.style.transition = {}
cocktail.core.style.transition.Transition = function(propertyName,target,transitionDuration,transitionDelay,transitionTimingFunction,startValue,endValue,onComplete,onUpdate,invalidationReason) {
	this.invalidationReason = invalidationReason;
	this._transitionDelay = transitionDelay;
	this.transitionDuration = transitionDuration;
	this._transitionTimingFunction = transitionTimingFunction;
	this._startValue = startValue;
	this._endValue = endValue;
	this.target = target;
	this.propertyName = propertyName;
	this.onComplete = onComplete;
	this.onUpdate = onUpdate;
	this._elapsedTime = 0;
};
$hxClasses["cocktail.core.style.transition.Transition"] = cocktail.core.style.transition.Transition;
cocktail.core.style.transition.Transition.__name__ = ["cocktail","core","style","transition","Transition"];
cocktail.core.style.transition.Transition.prototype = {
	get_currentValue: function() {
		var transitionTime = this._elapsedTime - this._transitionDelay * 1000;
		if(transitionTime < 0) return this._startValue;
		var completePercent = transitionTime / (this.transitionDuration * 1000);
		var $e = (this._transitionTimingFunction);
		switch( $e[1] ) {
		case 0:
			var cubicBezier = new cocktail.core.geom.CubicBezier(0.25,0.1,0.25,1.0);
			return (this._endValue - this._startValue) * cubicBezier.bezierY(completePercent) + this._startValue;
		case 2:
			var cubicBezier = new cocktail.core.geom.CubicBezier(0.25,0.1,0.25,1.0);
			return (this._endValue - this._startValue) * cubicBezier.bezierY(completePercent) + this._startValue;
		case 3:
			var cubicBezier = new cocktail.core.geom.CubicBezier(0.25,0.1,0.25,1.0);
			return (this._endValue - this._startValue) * cubicBezier.bezierY(completePercent) + this._startValue;
		case 4:
			var cubicBezier = new cocktail.core.geom.CubicBezier(0.25,0.1,0.25,1.0);
			return (this._endValue - this._startValue) * cubicBezier.bezierY(completePercent) + this._startValue;
		case 8:
			var y2 = $e[5], x2 = $e[4], y1 = $e[3], x1 = $e[2];
			var cubicBezier = new cocktail.core.geom.CubicBezier(x1,y1,x2,y2);
			return (this._endValue - this._startValue) * cubicBezier.bezierY(completePercent) + this._startValue;
		case 5:
			return this._endValue - this._startValue + this._startValue;
		case 6:
			return (this._endValue - this._startValue) * 0 + this._startValue;
		case 7:
			var intervalChange = $e[3], intervalNumbers = $e[2];
			return (this._endValue - this._startValue) * completePercent + this._startValue;
		case 1:
			return (this._endValue - this._startValue) * completePercent + this._startValue;
		}
	}
	,get_complete: function() {
		if(this._elapsedTime >= (this._transitionDelay + this.transitionDuration) * 1000) return true;
		return false;
	}
	,dispose: function() {
		this.onComplete = null;
		this.onUpdate = null;
		this._transitionTimingFunction = null;
	}
	,updateTime: function(delta) {
		this._elapsedTime += delta;
	}
	,invalidationReason: null
	,complete: null
	,target: null
	,transitionDuration: null
	,onUpdate: null
	,onComplete: null
	,currentValue: null
	,propertyName: null
	,_elapsedTime: null
	,_endValue: null
	,_startValue: null
	,_transitionTimingFunction: null
	,_transitionDelay: null
	,__class__: cocktail.core.style.transition.Transition
	,__properties__: {get_currentValue:"get_currentValue",get_complete:"get_complete"}
}
cocktail.core.style.transition.TransitionManager = function() {
	this._transitions = new Hash();
	this._currentTransitionsNumber = 0;
	this._lastTick = 0;
};
$hxClasses["cocktail.core.style.transition.TransitionManager"] = cocktail.core.style.transition.TransitionManager;
cocktail.core.style.transition.TransitionManager.__name__ = ["cocktail","core","style","transition","TransitionManager"];
cocktail.core.style.transition.TransitionManager._instance = null;
cocktail.core.style.transition.TransitionManager.getInstance = function() {
	if(cocktail.core.style.transition.TransitionManager._instance == null) cocktail.core.style.transition.TransitionManager._instance = new cocktail.core.style.transition.TransitionManager();
	return cocktail.core.style.transition.TransitionManager._instance;
}
cocktail.core.style.transition.TransitionManager.prototype = {
	onTransitionTick: function() {
		var tick = new Date().getTime();
		var interval = tick - this._lastTick;
		this._lastTick = tick;
		var $it0 = this._transitions.iterator();
		while( $it0.hasNext() ) {
			var propertyTransitions = $it0.next();
			var completedTransitions = new Array();
			var length = propertyTransitions.length;
			var _g = 0;
			while(_g < length) {
				var i = _g++;
				var transition = propertyTransitions[i];
				transition.updateTime(interval);
				if(transition.get_complete() == true) {
					transition.onComplete(transition);
					completedTransitions.push(transition);
				} else transition.onUpdate(transition);
			}
			var completedTransitionsLength = completedTransitions.length;
			var _g = 0;
			while(_g < completedTransitionsLength) {
				var i = _g++;
				this.stopTransition(completedTransitions[i]);
			}
		}
		if(this._currentTransitionsNumber > 0) {
		}
	}
	,startTransitionTimer: function() {
		this._lastTick = new Date().getTime();
	}
	,stopTransition: function(transition) {
		var propertyTransitions = this._transitions.get(transition.propertyName);
		HxOverrides.remove(propertyTransitions,transition);
		transition.dispose();
		this._currentTransitionsNumber--;
	}
	,startTransition: function(target,propertyName,startValue,endValue,transitionDuration,transitionDelay,transitionTimingFunction,onComplete,onUpdate,invalidationReason) {
		var transition = new cocktail.core.style.transition.Transition(propertyName,target,transitionDuration,transitionDelay,transitionTimingFunction,startValue,endValue,onComplete,onUpdate,invalidationReason);
		if(this._transitions.exists(propertyName) == false) this._transitions.set(propertyName,[]);
		var propertyTransitions = this._transitions.get(propertyName);
		propertyTransitions.push(transition);
		if(this._currentTransitionsNumber == 0) this.startTransitionTimer();
		this._currentTransitionsNumber++;
	}
	,getTransition: function(propertyName,style) {
		if(this._currentTransitionsNumber == 0) return null;
		if(this._transitions.exists(propertyName)) {
			var propertyTransitions = this._transitions.get(propertyName);
			var length = propertyTransitions.length;
			var _g = 0;
			while(_g < length) {
				var i = _g++;
				if(propertyTransitions[i].target == style) return propertyTransitions[i];
			}
		}
		return null;
	}
	,_lastTick: null
	,_currentTransitionsNumber: null
	,_transitions: null
	,__class__: cocktail.core.style.transition.TransitionManager
}
cocktail.core.unit = {}
cocktail.core.unit.Length = $hxClasses["cocktail.core.unit.Length"] = { __ename__ : ["cocktail","core","unit","Length"], __constructs__ : ["px","cm","mm","pt","pc","cssIn","em","ex"] }
cocktail.core.unit.Length.px = function(value) { var $x = ["px",0,value]; $x.__enum__ = cocktail.core.unit.Length; $x.toString = $estr; return $x; }
cocktail.core.unit.Length.cm = function(value) { var $x = ["cm",1,value]; $x.__enum__ = cocktail.core.unit.Length; $x.toString = $estr; return $x; }
cocktail.core.unit.Length.mm = function(value) { var $x = ["mm",2,value]; $x.__enum__ = cocktail.core.unit.Length; $x.toString = $estr; return $x; }
cocktail.core.unit.Length.pt = function(value) { var $x = ["pt",3,value]; $x.__enum__ = cocktail.core.unit.Length; $x.toString = $estr; return $x; }
cocktail.core.unit.Length.pc = function(value) { var $x = ["pc",4,value]; $x.__enum__ = cocktail.core.unit.Length; $x.toString = $estr; return $x; }
cocktail.core.unit.Length.cssIn = function(value) { var $x = ["cssIn",5,value]; $x.__enum__ = cocktail.core.unit.Length; $x.toString = $estr; return $x; }
cocktail.core.unit.Length.em = function(value) { var $x = ["em",6,value]; $x.__enum__ = cocktail.core.unit.Length; $x.toString = $estr; return $x; }
cocktail.core.unit.Length.ex = function(value) { var $x = ["ex",7,value]; $x.__enum__ = cocktail.core.unit.Length; $x.toString = $estr; return $x; }
cocktail.core.unit.FontSizeAbsoluteSize = $hxClasses["cocktail.core.unit.FontSizeAbsoluteSize"] = { __ename__ : ["cocktail","core","unit","FontSizeAbsoluteSize"], __constructs__ : ["xxSmall","xSmall","small","medium","large","xLarge","xxLarge"] }
cocktail.core.unit.FontSizeAbsoluteSize.xxSmall = ["xxSmall",0];
cocktail.core.unit.FontSizeAbsoluteSize.xxSmall.toString = $estr;
cocktail.core.unit.FontSizeAbsoluteSize.xxSmall.__enum__ = cocktail.core.unit.FontSizeAbsoluteSize;
cocktail.core.unit.FontSizeAbsoluteSize.xSmall = ["xSmall",1];
cocktail.core.unit.FontSizeAbsoluteSize.xSmall.toString = $estr;
cocktail.core.unit.FontSizeAbsoluteSize.xSmall.__enum__ = cocktail.core.unit.FontSizeAbsoluteSize;
cocktail.core.unit.FontSizeAbsoluteSize.small = ["small",2];
cocktail.core.unit.FontSizeAbsoluteSize.small.toString = $estr;
cocktail.core.unit.FontSizeAbsoluteSize.small.__enum__ = cocktail.core.unit.FontSizeAbsoluteSize;
cocktail.core.unit.FontSizeAbsoluteSize.medium = ["medium",3];
cocktail.core.unit.FontSizeAbsoluteSize.medium.toString = $estr;
cocktail.core.unit.FontSizeAbsoluteSize.medium.__enum__ = cocktail.core.unit.FontSizeAbsoluteSize;
cocktail.core.unit.FontSizeAbsoluteSize.large = ["large",4];
cocktail.core.unit.FontSizeAbsoluteSize.large.toString = $estr;
cocktail.core.unit.FontSizeAbsoluteSize.large.__enum__ = cocktail.core.unit.FontSizeAbsoluteSize;
cocktail.core.unit.FontSizeAbsoluteSize.xLarge = ["xLarge",5];
cocktail.core.unit.FontSizeAbsoluteSize.xLarge.toString = $estr;
cocktail.core.unit.FontSizeAbsoluteSize.xLarge.__enum__ = cocktail.core.unit.FontSizeAbsoluteSize;
cocktail.core.unit.FontSizeAbsoluteSize.xxLarge = ["xxLarge",6];
cocktail.core.unit.FontSizeAbsoluteSize.xxLarge.toString = $estr;
cocktail.core.unit.FontSizeAbsoluteSize.xxLarge.__enum__ = cocktail.core.unit.FontSizeAbsoluteSize;
cocktail.core.unit.FontSizeRelativeSize = $hxClasses["cocktail.core.unit.FontSizeRelativeSize"] = { __ename__ : ["cocktail","core","unit","FontSizeRelativeSize"], __constructs__ : ["larger","smaller"] }
cocktail.core.unit.FontSizeRelativeSize.larger = ["larger",0];
cocktail.core.unit.FontSizeRelativeSize.larger.toString = $estr;
cocktail.core.unit.FontSizeRelativeSize.larger.__enum__ = cocktail.core.unit.FontSizeRelativeSize;
cocktail.core.unit.FontSizeRelativeSize.smaller = ["smaller",1];
cocktail.core.unit.FontSizeRelativeSize.smaller.toString = $estr;
cocktail.core.unit.FontSizeRelativeSize.smaller.__enum__ = cocktail.core.unit.FontSizeRelativeSize;
cocktail.core.unit.TimeValue = $hxClasses["cocktail.core.unit.TimeValue"] = { __ename__ : ["cocktail","core","unit","TimeValue"], __constructs__ : ["seconds","milliSeconds"] }
cocktail.core.unit.TimeValue.seconds = function(value) { var $x = ["seconds",0,value]; $x.__enum__ = cocktail.core.unit.TimeValue; $x.toString = $estr; return $x; }
cocktail.core.unit.TimeValue.milliSeconds = function(value) { var $x = ["milliSeconds",1,value]; $x.__enum__ = cocktail.core.unit.TimeValue; $x.toString = $estr; return $x; }
cocktail.core.unit.CSSColor = $hxClasses["cocktail.core.unit.CSSColor"] = { __ename__ : ["cocktail","core","unit","CSSColor"], __constructs__ : ["rgb","rgba","hex","keyword","transparent"] }
cocktail.core.unit.CSSColor.rgb = function(red,green,blue) { var $x = ["rgb",0,red,green,blue]; $x.__enum__ = cocktail.core.unit.CSSColor; $x.toString = $estr; return $x; }
cocktail.core.unit.CSSColor.rgba = function(red,green,blue,alpha) { var $x = ["rgba",1,red,green,blue,alpha]; $x.__enum__ = cocktail.core.unit.CSSColor; $x.toString = $estr; return $x; }
cocktail.core.unit.CSSColor.hex = function(value) { var $x = ["hex",2,value]; $x.__enum__ = cocktail.core.unit.CSSColor; $x.toString = $estr; return $x; }
cocktail.core.unit.CSSColor.keyword = function(value) { var $x = ["keyword",3,value]; $x.__enum__ = cocktail.core.unit.CSSColor; $x.toString = $estr; return $x; }
cocktail.core.unit.CSSColor.transparent = ["transparent",4];
cocktail.core.unit.CSSColor.transparent.toString = $estr;
cocktail.core.unit.CSSColor.transparent.__enum__ = cocktail.core.unit.CSSColor;
cocktail.core.unit.ImageValue = $hxClasses["cocktail.core.unit.ImageValue"] = { __ename__ : ["cocktail","core","unit","ImageValue"], __constructs__ : ["url","imageList","gradient"] }
cocktail.core.unit.ImageValue.url = function(value) { var $x = ["url",0,value]; $x.__enum__ = cocktail.core.unit.ImageValue; $x.toString = $estr; return $x; }
cocktail.core.unit.ImageValue.imageList = function(value) { var $x = ["imageList",1,value]; $x.__enum__ = cocktail.core.unit.ImageValue; $x.toString = $estr; return $x; }
cocktail.core.unit.ImageValue.gradient = function(value) { var $x = ["gradient",2,value]; $x.__enum__ = cocktail.core.unit.ImageValue; $x.toString = $estr; return $x; }
cocktail.core.unit.GradientValue = $hxClasses["cocktail.core.unit.GradientValue"] = { __ename__ : ["cocktail","core","unit","GradientValue"], __constructs__ : ["linear"] }
cocktail.core.unit.GradientValue.linear = function(value) { var $x = ["linear",0,value]; $x.__enum__ = cocktail.core.unit.GradientValue; $x.toString = $estr; return $x; }
cocktail.core.unit.GradientStopValue = $hxClasses["cocktail.core.unit.GradientStopValue"] = { __ename__ : ["cocktail","core","unit","GradientStopValue"], __constructs__ : ["length","percent"] }
cocktail.core.unit.GradientStopValue.length = function(value) { var $x = ["length",0,value]; $x.__enum__ = cocktail.core.unit.GradientStopValue; $x.toString = $estr; return $x; }
cocktail.core.unit.GradientStopValue.percent = function(value) { var $x = ["percent",1,value]; $x.__enum__ = cocktail.core.unit.GradientStopValue; $x.toString = $estr; return $x; }
cocktail.core.unit.GradientAngle = $hxClasses["cocktail.core.unit.GradientAngle"] = { __ename__ : ["cocktail","core","unit","GradientAngle"], __constructs__ : ["angle","side","corner"] }
cocktail.core.unit.GradientAngle.angle = function(value) { var $x = ["angle",0,value]; $x.__enum__ = cocktail.core.unit.GradientAngle; $x.toString = $estr; return $x; }
cocktail.core.unit.GradientAngle.side = function(value) { var $x = ["side",1,value]; $x.__enum__ = cocktail.core.unit.GradientAngle; $x.toString = $estr; return $x; }
cocktail.core.unit.GradientAngle.corner = function(value) { var $x = ["corner",2,value]; $x.__enum__ = cocktail.core.unit.GradientAngle; $x.toString = $estr; return $x; }
cocktail.core.unit.GradientSideValue = $hxClasses["cocktail.core.unit.GradientSideValue"] = { __ename__ : ["cocktail","core","unit","GradientSideValue"], __constructs__ : ["top","left","bottom","right"] }
cocktail.core.unit.GradientSideValue.top = ["top",0];
cocktail.core.unit.GradientSideValue.top.toString = $estr;
cocktail.core.unit.GradientSideValue.top.__enum__ = cocktail.core.unit.GradientSideValue;
cocktail.core.unit.GradientSideValue.left = ["left",1];
cocktail.core.unit.GradientSideValue.left.toString = $estr;
cocktail.core.unit.GradientSideValue.left.__enum__ = cocktail.core.unit.GradientSideValue;
cocktail.core.unit.GradientSideValue.bottom = ["bottom",2];
cocktail.core.unit.GradientSideValue.bottom.toString = $estr;
cocktail.core.unit.GradientSideValue.bottom.__enum__ = cocktail.core.unit.GradientSideValue;
cocktail.core.unit.GradientSideValue.right = ["right",3];
cocktail.core.unit.GradientSideValue.right.toString = $estr;
cocktail.core.unit.GradientSideValue.right.__enum__ = cocktail.core.unit.GradientSideValue;
cocktail.core.unit.GradientCornerValue = $hxClasses["cocktail.core.unit.GradientCornerValue"] = { __ename__ : ["cocktail","core","unit","GradientCornerValue"], __constructs__ : ["topRight","bottomRight","bottomLeft","topLeft"] }
cocktail.core.unit.GradientCornerValue.topRight = ["topRight",0];
cocktail.core.unit.GradientCornerValue.topRight.toString = $estr;
cocktail.core.unit.GradientCornerValue.topRight.__enum__ = cocktail.core.unit.GradientCornerValue;
cocktail.core.unit.GradientCornerValue.bottomRight = ["bottomRight",1];
cocktail.core.unit.GradientCornerValue.bottomRight.toString = $estr;
cocktail.core.unit.GradientCornerValue.bottomRight.__enum__ = cocktail.core.unit.GradientCornerValue;
cocktail.core.unit.GradientCornerValue.bottomLeft = ["bottomLeft",2];
cocktail.core.unit.GradientCornerValue.bottomLeft.toString = $estr;
cocktail.core.unit.GradientCornerValue.bottomLeft.__enum__ = cocktail.core.unit.GradientCornerValue;
cocktail.core.unit.GradientCornerValue.topLeft = ["topLeft",3];
cocktail.core.unit.GradientCornerValue.topLeft.toString = $estr;
cocktail.core.unit.GradientCornerValue.topLeft.__enum__ = cocktail.core.unit.GradientCornerValue;
cocktail.core.unit.ColorKeyword = $hxClasses["cocktail.core.unit.ColorKeyword"] = { __ename__ : ["cocktail","core","unit","ColorKeyword"], __constructs__ : ["aqua","black","blue","fuchsia","gray","green","lime","maroon","navy","olive","orange","purple","red","silver","teal","white","yellow"] }
cocktail.core.unit.ColorKeyword.aqua = ["aqua",0];
cocktail.core.unit.ColorKeyword.aqua.toString = $estr;
cocktail.core.unit.ColorKeyword.aqua.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.black = ["black",1];
cocktail.core.unit.ColorKeyword.black.toString = $estr;
cocktail.core.unit.ColorKeyword.black.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.blue = ["blue",2];
cocktail.core.unit.ColorKeyword.blue.toString = $estr;
cocktail.core.unit.ColorKeyword.blue.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.fuchsia = ["fuchsia",3];
cocktail.core.unit.ColorKeyword.fuchsia.toString = $estr;
cocktail.core.unit.ColorKeyword.fuchsia.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.gray = ["gray",4];
cocktail.core.unit.ColorKeyword.gray.toString = $estr;
cocktail.core.unit.ColorKeyword.gray.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.green = ["green",5];
cocktail.core.unit.ColorKeyword.green.toString = $estr;
cocktail.core.unit.ColorKeyword.green.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.lime = ["lime",6];
cocktail.core.unit.ColorKeyword.lime.toString = $estr;
cocktail.core.unit.ColorKeyword.lime.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.maroon = ["maroon",7];
cocktail.core.unit.ColorKeyword.maroon.toString = $estr;
cocktail.core.unit.ColorKeyword.maroon.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.navy = ["navy",8];
cocktail.core.unit.ColorKeyword.navy.toString = $estr;
cocktail.core.unit.ColorKeyword.navy.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.olive = ["olive",9];
cocktail.core.unit.ColorKeyword.olive.toString = $estr;
cocktail.core.unit.ColorKeyword.olive.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.orange = ["orange",10];
cocktail.core.unit.ColorKeyword.orange.toString = $estr;
cocktail.core.unit.ColorKeyword.orange.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.purple = ["purple",11];
cocktail.core.unit.ColorKeyword.purple.toString = $estr;
cocktail.core.unit.ColorKeyword.purple.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.red = ["red",12];
cocktail.core.unit.ColorKeyword.red.toString = $estr;
cocktail.core.unit.ColorKeyword.red.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.silver = ["silver",13];
cocktail.core.unit.ColorKeyword.silver.toString = $estr;
cocktail.core.unit.ColorKeyword.silver.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.teal = ["teal",14];
cocktail.core.unit.ColorKeyword.teal.toString = $estr;
cocktail.core.unit.ColorKeyword.teal.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.white = ["white",15];
cocktail.core.unit.ColorKeyword.white.toString = $estr;
cocktail.core.unit.ColorKeyword.white.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.ColorKeyword.yellow = ["yellow",16];
cocktail.core.unit.ColorKeyword.yellow.toString = $estr;
cocktail.core.unit.ColorKeyword.yellow.__enum__ = cocktail.core.unit.ColorKeyword;
cocktail.core.unit.Angle = $hxClasses["cocktail.core.unit.Angle"] = { __ename__ : ["cocktail","core","unit","Angle"], __constructs__ : ["deg","grad","rad","turn"] }
cocktail.core.unit.Angle.deg = function(value) { var $x = ["deg",0,value]; $x.__enum__ = cocktail.core.unit.Angle; $x.toString = $estr; return $x; }
cocktail.core.unit.Angle.grad = function(value) { var $x = ["grad",1,value]; $x.__enum__ = cocktail.core.unit.Angle; $x.toString = $estr; return $x; }
cocktail.core.unit.Angle.rad = function(value) { var $x = ["rad",2,value]; $x.__enum__ = cocktail.core.unit.Angle; $x.toString = $estr; return $x; }
cocktail.core.unit.Angle.turn = function(value) { var $x = ["turn",3,value]; $x.__enum__ = cocktail.core.unit.Angle; $x.toString = $estr; return $x; }
cocktail.core.unit.UnitManager = function() {
};
$hxClasses["cocktail.core.unit.UnitManager"] = cocktail.core.unit.UnitManager;
cocktail.core.unit.UnitManager.__name__ = ["cocktail","core","unit","UnitManager"];
cocktail.core.unit.UnitManager.boxStyleEnum = function(enumType,string) {
	if(string == "auto") return Type.createEnum(enumType,"cssAuto");
	var parsed = cocktail.core.unit.UnitManager.string2VUnit(string);
	return (function($this) {
		var $r;
		switch(parsed.unit) {
		case "%":
			$r = Type.createEnum(enumType,"percent",[Std.parseInt(parsed.value)]);
			break;
		default:
			$r = Type.createEnum(enumType,"length",[cocktail.core.unit.UnitManager.string2Length(parsed)]);
		}
		return $r;
	}(this));
}
cocktail.core.unit.UnitManager.constrainedDimensionEnum = function(string) {
	if(string == "none") return cocktail.core.style.ConstrainedDimension.none;
	var parsed = cocktail.core.unit.UnitManager.string2VUnit(string);
	var constrainedDimension;
	switch(parsed.unit) {
	case "%":
		constrainedDimension = cocktail.core.style.ConstrainedDimension.percent(Std.parseInt(parsed.value));
		break;
	default:
		constrainedDimension = cocktail.core.style.ConstrainedDimension.length(cocktail.core.unit.UnitManager.string2Length(parsed));
	}
	return constrainedDimension;
}
cocktail.core.unit.UnitManager.displayEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var display;
	switch(parsed) {
	case "inline":
		display = cocktail.core.style.Display.cssInline;
		break;
	case "block":
		display = cocktail.core.style.Display.block;
		break;
	case "inline-block":
		display = cocktail.core.style.Display.inlineBlock;
		break;
	case "none":
		display = cocktail.core.style.Display.none;
		break;
	default:
		display = null;
	}
	return display;
}
cocktail.core.unit.UnitManager.overflowEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var overflow;
	switch(parsed) {
	case "visible":
		overflow = cocktail.core.style.Overflow.visible;
		break;
	case "scroll":
		overflow = cocktail.core.style.Overflow.scroll;
		break;
	case "auto":
		overflow = cocktail.core.style.Overflow.cssAuto;
		break;
	case "hidden":
		overflow = cocktail.core.style.Overflow.hidden;
		break;
	default:
		overflow = null;
	}
	return overflow;
}
cocktail.core.unit.UnitManager.zIndexEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var zIndex;
	switch(parsed) {
	case "auto":
		zIndex = cocktail.core.style.ZIndex.cssAuto;
		break;
	default:
		zIndex = cocktail.core.style.ZIndex.integer(Std.parseInt(parsed));
	}
	return zIndex;
}
cocktail.core.unit.UnitManager.fontSizeEnum = function(string) {
	string = cocktail.core.unit.UnitManager.trim(string);
	switch(string) {
	case "small":
		return cocktail.core.style.FontSize.absoluteSize(cocktail.core.unit.FontSizeAbsoluteSize.small);
	case "xx-small":
		return cocktail.core.style.FontSize.absoluteSize(cocktail.core.unit.FontSizeAbsoluteSize.xxSmall);
	case "x-small":
		return cocktail.core.style.FontSize.absoluteSize(cocktail.core.unit.FontSizeAbsoluteSize.xSmall);
	case "medium":
		return cocktail.core.style.FontSize.absoluteSize(cocktail.core.unit.FontSizeAbsoluteSize.medium);
	case "large":
		return cocktail.core.style.FontSize.absoluteSize(cocktail.core.unit.FontSizeAbsoluteSize.large);
	case "x-large":
		return cocktail.core.style.FontSize.absoluteSize(cocktail.core.unit.FontSizeAbsoluteSize.xLarge);
	case "xx-large":
		return cocktail.core.style.FontSize.absoluteSize(cocktail.core.unit.FontSizeAbsoluteSize.xxLarge);
	case "larger":
		return cocktail.core.style.FontSize.relativeSize(cocktail.core.unit.FontSizeRelativeSize.larger);
	case "smaller":
		return cocktail.core.style.FontSize.relativeSize(cocktail.core.unit.FontSizeRelativeSize.smaller);
	}
	var parsed = cocktail.core.unit.UnitManager.string2VUnit(string);
	switch(parsed.unit) {
	case "%":
		return cocktail.core.style.FontSize.percentage(Std.parseInt(parsed.value));
	default:
		return cocktail.core.style.FontSize.length(cocktail.core.unit.UnitManager.string2Length(parsed));
	}
}
cocktail.core.unit.UnitManager.verticalAlignEnum = function(string) {
	string = cocktail.core.unit.UnitManager.trim(string);
	var verticalAlign;
	switch(string) {
	case "baseline":
		verticalAlign = cocktail.core.style.VerticalAlign.baseline;
		break;
	case "bottom":
		verticalAlign = cocktail.core.style.VerticalAlign.bottom;
		break;
	case "super":
		verticalAlign = cocktail.core.style.VerticalAlign.cssSuper;
		break;
	case "middle":
		verticalAlign = cocktail.core.style.VerticalAlign.middle;
		break;
	case "top":
		verticalAlign = cocktail.core.style.VerticalAlign.top;
		break;
	case "textBottom":
		verticalAlign = cocktail.core.style.VerticalAlign.textBottom;
		break;
	case "textTop":
		verticalAlign = cocktail.core.style.VerticalAlign.textTop;
		break;
	case "sub":
		verticalAlign = cocktail.core.style.VerticalAlign.sub;
		break;
	default:
		verticalAlign = null;
	}
	if(verticalAlign == null) {
		var parsed = cocktail.core.unit.UnitManager.string2VUnit(string);
		switch(parsed.unit) {
		case "%":
			verticalAlign = cocktail.core.style.VerticalAlign.percent(Std.parseInt(parsed.value));
			break;
		default:
			verticalAlign = cocktail.core.style.VerticalAlign.length(cocktail.core.unit.UnitManager.string2Length(parsed));
		}
	}
	return verticalAlign;
}
cocktail.core.unit.UnitManager.clearEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var clear;
	switch(parsed) {
	case "both":
		clear = cocktail.core.style.Clear.both;
		break;
	case "left":
		clear = cocktail.core.style.Clear.left;
		break;
	case "right":
		clear = cocktail.core.style.Clear.right;
		break;
	case "none":
		clear = cocktail.core.style.Clear.none;
		break;
	default:
		clear = null;
	}
	return clear;
}
cocktail.core.unit.UnitManager.positionEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var position;
	switch(parsed) {
	case "static":
		position = cocktail.core.style.Position.cssStatic;
		break;
	case "absolute":
		position = cocktail.core.style.Position.absolute;
		break;
	case "relative":
		position = cocktail.core.style.Position.relative;
		break;
	case "fixed":
		position = cocktail.core.style.Position.fixed;
		break;
	default:
		position = null;
	}
	return position;
}
cocktail.core.unit.UnitManager.whiteSpaceEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var whiteSpace;
	switch(parsed) {
	case "normal":
		whiteSpace = cocktail.core.style.WhiteSpace.normal;
		break;
	case "nowrap":
		whiteSpace = cocktail.core.style.WhiteSpace.nowrap;
		break;
	case "pre":
		whiteSpace = cocktail.core.style.WhiteSpace.pre;
		break;
	case "preLine":
		whiteSpace = cocktail.core.style.WhiteSpace.preLine;
		break;
	case "preWrap":
		whiteSpace = cocktail.core.style.WhiteSpace.preWrap;
		break;
	default:
		whiteSpace = null;
	}
	return whiteSpace;
}
cocktail.core.unit.UnitManager.textAlignEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var textAlign;
	switch(parsed) {
	case "left":
		textAlign = cocktail.core.style.TextAlign.left;
		break;
	case "right":
		textAlign = cocktail.core.style.TextAlign.right;
		break;
	case "center":
		textAlign = cocktail.core.style.TextAlign.center;
		break;
	case "justify":
		textAlign = cocktail.core.style.TextAlign.justify;
		break;
	default:
		textAlign = null;
	}
	return textAlign;
}
cocktail.core.unit.UnitManager.fontWeightEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var fontWeight;
	switch(parsed) {
	case "bold":
		fontWeight = cocktail.core.style.FontWeight.bold;
		break;
	case "bolder":
		fontWeight = cocktail.core.style.FontWeight.bolder;
		break;
	case "normal":
		fontWeight = cocktail.core.style.FontWeight.normal;
		break;
	case "lighter":
		fontWeight = cocktail.core.style.FontWeight.lighter;
		break;
	case "100":
		fontWeight = cocktail.core.style.FontWeight.css100;
		break;
	case "200":
		fontWeight = cocktail.core.style.FontWeight.css200;
		break;
	case "300":
		fontWeight = cocktail.core.style.FontWeight.css300;
		break;
	case "400":
		fontWeight = cocktail.core.style.FontWeight.css400;
		break;
	case "500":
		fontWeight = cocktail.core.style.FontWeight.css500;
		break;
	case "600":
		fontWeight = cocktail.core.style.FontWeight.css600;
		break;
	case "700":
		fontWeight = cocktail.core.style.FontWeight.css700;
		break;
	case "800":
		fontWeight = cocktail.core.style.FontWeight.css800;
		break;
	case "900":
		fontWeight = cocktail.core.style.FontWeight.css900;
		break;
	default:
		fontWeight = null;
	}
	return fontWeight;
}
cocktail.core.unit.UnitManager.fontStyleEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var fontStyle;
	switch(parsed) {
	case "italic":
		fontStyle = cocktail.core.style.FontStyle.italic;
		break;
	case "normal":
		fontStyle = cocktail.core.style.FontStyle.normal;
		break;
	case "oblique":
		fontStyle = cocktail.core.style.FontStyle.oblique;
		break;
	default:
		fontStyle = null;
	}
	return fontStyle;
}
cocktail.core.unit.UnitManager.fontVariantEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var fontVariant;
	switch(parsed) {
	case "normal":
		fontVariant = cocktail.core.style.FontVariant.normal;
		break;
	case "small-caps":
		fontVariant = cocktail.core.style.FontVariant.smallCaps;
		break;
	default:
		fontVariant = null;
	}
	return fontVariant;
}
cocktail.core.unit.UnitManager.textTransformEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var textTransform;
	switch(parsed) {
	case "capitalize":
		textTransform = cocktail.core.style.TextTransform.capitalize;
		break;
	case "lowercase":
		textTransform = cocktail.core.style.TextTransform.lowercase;
		break;
	case "uppercase":
		textTransform = cocktail.core.style.TextTransform.uppercase;
		break;
	case "none":
		textTransform = cocktail.core.style.TextTransform.none;
		break;
	default:
		textTransform = null;
	}
	return textTransform;
}
cocktail.core.unit.UnitManager.visibilityEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var visibility;
	switch(parsed) {
	case "hidden":
		visibility = cocktail.core.style.Visibility.hidden;
		break;
	case "visible":
		visibility = cocktail.core.style.Visibility.visible;
		break;
	default:
		visibility = null;
	}
	return visibility;
}
cocktail.core.unit.UnitManager.cursorEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var cursor;
	switch(parsed) {
	case "auto":
		cursor = cocktail.core.style.Cursor.cssAuto;
		break;
	case "crosshair":
		cursor = cocktail.core.style.Cursor.crosshair;
		break;
	case "pointer":
		cursor = cocktail.core.style.Cursor.pointer;
		break;
	case "default":
		cursor = cocktail.core.style.Cursor.cssDefault;
		break;
	default:
		cursor = null;
	}
	return cursor;
}
cocktail.core.unit.UnitManager.wordSpacingEnum = function(string) {
	if(string == "normal") return cocktail.core.style.WordSpacing.normal;
	var parsed = cocktail.core.unit.UnitManager.string2VUnit(string);
	var wordSpacing;
	switch(parsed.unit) {
	case "%":
		wordSpacing = null;
		break;
	default:
		wordSpacing = cocktail.core.style.WordSpacing.length(cocktail.core.unit.UnitManager.string2Length(parsed));
	}
	return wordSpacing;
}
cocktail.core.unit.UnitManager.backgroundImageEnum = function(string) {
	if(string == "none") return [cocktail.core.style.BackgroundImage.none];
	var array = cocktail.core.unit.UnitManager.string2VList(string,",");
	var arrayBgImg = [];
	var _g = 0;
	while(_g < array.length) {
		var val = array[_g];
		++_g;
		if(val == "none") arrayBgImg.push(cocktail.core.style.BackgroundImage.none); else arrayBgImg.push(cocktail.core.style.BackgroundImage.image(cocktail.core.unit.ImageValue.url(cocktail.core.unit.UnitManager.string2URLData(val))));
	}
	return arrayBgImg;
}
cocktail.core.unit.UnitManager.backgroundRepeatEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var backgroundRepeat;
	switch(parsed) {
	case "repeat":
		backgroundRepeat = { x : cocktail.core.style.BackgroundRepeatValue.repeat, y : cocktail.core.style.BackgroundRepeatValue.repeat};
		break;
	case "repeat-x":
		backgroundRepeat = { x : cocktail.core.style.BackgroundRepeatValue.repeat, y : cocktail.core.style.BackgroundRepeatValue.noRepeat};
		break;
	case "repeat-y":
		backgroundRepeat = { x : cocktail.core.style.BackgroundRepeatValue.noRepeat, y : cocktail.core.style.BackgroundRepeatValue.repeat};
		break;
	case "no-repeat":
		backgroundRepeat = { x : cocktail.core.style.BackgroundRepeatValue.noRepeat, y : cocktail.core.style.BackgroundRepeatValue.noRepeat};
		break;
	default:
		backgroundRepeat = null;
	}
	return [backgroundRepeat];
}
cocktail.core.unit.UnitManager.backgroundOriginEnum = function(string) {
	return [];
}
cocktail.core.unit.UnitManager.backgroundSizeEnum = function(string) {
	string = cocktail.core.unit.UnitManager.trim(string);
	if(string == "contain") return [cocktail.core.style.BackgroundSize.contain];
	if(string == "cover") return [cocktail.core.style.BackgroundSize.cover];
	var backgroundSizes = string.split(" ");
	var backgroundsizeX;
	switch(backgroundSizes[0]) {
	case "auto":
		backgroundsizeX = cocktail.core.style.BackgroundSizeDimension.cssAuto;
		break;
	default:
		var parsedBackgroundsizeX = cocktail.core.unit.UnitManager.string2VUnit(backgroundSizes[0]);
		switch(parsedBackgroundsizeX.unit) {
		case "%":
			backgroundsizeX = cocktail.core.style.BackgroundSizeDimension.percent(Std.parseInt(parsedBackgroundsizeX.value));
			break;
		default:
			backgroundsizeX = cocktail.core.style.BackgroundSizeDimension.length(cocktail.core.unit.UnitManager.string2Length(parsedBackgroundsizeX));
		}
	}
	var backgroundsizeY;
	switch(backgroundSizes[1]) {
	case "auto":
		backgroundsizeY = cocktail.core.style.BackgroundSizeDimension.cssAuto;
		break;
	default:
		var parsedBackgroundsizeY = cocktail.core.unit.UnitManager.string2VUnit(backgroundSizes[0]);
		switch(parsedBackgroundsizeY.unit) {
		case "%":
			backgroundsizeY = cocktail.core.style.BackgroundSizeDimension.percent(Std.parseInt(parsedBackgroundsizeY.value));
			break;
		default:
			backgroundsizeY = cocktail.core.style.BackgroundSizeDimension.length(cocktail.core.unit.UnitManager.string2Length(parsedBackgroundsizeY));
		}
	}
	return [cocktail.core.style.BackgroundSize.dimensions({ x : backgroundsizeX, y : backgroundsizeY})];
}
cocktail.core.unit.UnitManager.backgroundPositionEnum = function(string) {
	if(string == null) return cocktail.core.style.CoreStyle.getBackgroundPositionDefaultValue();
	var backgroundPositions = string.split(" ");
	var backgroundPositionX;
	switch(backgroundPositions[0]) {
	case "left":
		backgroundPositionX = cocktail.core.style.BackgroundPositionX.left;
		break;
	case "center":
		backgroundPositionX = cocktail.core.style.BackgroundPositionX.center;
		break;
	case "right":
		backgroundPositionX = cocktail.core.style.BackgroundPositionX.right;
		break;
	default:
		var parsedBgPosX = cocktail.core.unit.UnitManager.string2VUnit(backgroundPositions[0]);
		switch(parsedBgPosX.unit) {
		case "%":
			backgroundPositionX = cocktail.core.style.BackgroundPositionX.percent(Std.parseInt(parsedBgPosX.value));
			break;
		default:
			backgroundPositionX = cocktail.core.style.BackgroundPositionX.length(cocktail.core.unit.UnitManager.string2Length(parsedBgPosX));
		}
	}
	var backgroundPositionY;
	switch(backgroundPositions[1]) {
	case "top":
		backgroundPositionY = cocktail.core.style.BackgroundPositionY.top;
		break;
	case "center":
		backgroundPositionY = cocktail.core.style.BackgroundPositionY.center;
		break;
	case "bottom":
		backgroundPositionY = cocktail.core.style.BackgroundPositionY.bottom;
		break;
	default:
		var parsedBgPosY = cocktail.core.unit.UnitManager.string2VUnit(backgroundPositions[1]);
		switch(parsedBgPosY.unit) {
		case "%":
			backgroundPositionY = cocktail.core.style.BackgroundPositionY.percent(Std.parseInt(parsedBgPosY.value));
			break;
		default:
			backgroundPositionY = cocktail.core.style.BackgroundPositionY.length(cocktail.core.unit.UnitManager.string2Length(parsedBgPosY));
		}
	}
	return [{ x : backgroundPositionX, y : backgroundPositionY}];
}
cocktail.core.unit.UnitManager.backgroundClipEnum = function(string) {
	return [];
}
cocktail.core.unit.UnitManager.fontFamilyEnum = function(string) {
	return cocktail.core.unit.UnitManager.string2Array(string);
}
cocktail.core.unit.UnitManager.letterSpacingEnum = function(string) {
	if(string == "normal") return cocktail.core.style.LetterSpacing.normal;
	var parsed = cocktail.core.unit.UnitManager.string2VUnit(string);
	var letterSpacing;
	switch(parsed.unit) {
	case "%":
		letterSpacing = null;
		break;
	default:
		letterSpacing = cocktail.core.style.LetterSpacing.length(cocktail.core.unit.UnitManager.string2Length(parsed));
	}
	return letterSpacing;
}
cocktail.core.unit.UnitManager.lineHeightEnum = function(string) {
	if(string == "normal") return cocktail.core.style.LineHeight.normal;
	var parsed = cocktail.core.unit.UnitManager.string2VUnit(string);
	var lineHeight;
	switch(parsed.unit) {
	case "%":
		lineHeight = cocktail.core.style.LineHeight.percentage(Std.parseInt(parsed.value));
		break;
	default:
		lineHeight = cocktail.core.style.LineHeight.length(cocktail.core.unit.UnitManager.string2Length(parsed));
	}
	return lineHeight;
}
cocktail.core.unit.UnitManager.textIndentEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.string2VUnit(string);
	var textIndent;
	switch(parsed.unit) {
	case "%":
		textIndent = cocktail.core.style.TextIndent.percentage(Std.parseInt(parsed.value));
		break;
	default:
		textIndent = cocktail.core.style.TextIndent.length(cocktail.core.unit.UnitManager.string2Length(parsed));
	}
	return textIndent;
}
cocktail.core.unit.UnitManager.cssFloatEnum = function(string) {
	var parsed = cocktail.core.unit.UnitManager.trim(string);
	var cssFloat;
	switch(parsed) {
	case "left":
		cssFloat = cocktail.core.style.CSSFloat.left;
		break;
	case "right":
		cssFloat = cocktail.core.style.CSSFloat.right;
		break;
	case "none":
		cssFloat = cocktail.core.style.CSSFloat.none;
		break;
	default:
		cssFloat = null;
	}
	return cssFloat;
}
cocktail.core.unit.UnitManager.colorEnum = function(string) {
	if(string == null) return cocktail.core.style.CoreStyle.getColorDefaultValue();
	string = cocktail.core.unit.UnitManager.trim(string);
	if(StringTools.startsWith(string,"#")) return cocktail.core.unit.CSSColor.hex(string);
	if(StringTools.startsWith(string,"rgba")) {
		var vcol = cocktail.core.unit.UnitManager.string2RGBA(string);
		return cocktail.core.unit.CSSColor.rgba(vcol.r,vcol.g,vcol.b,vcol.a);
	}
	if(StringTools.startsWith(string,"rgb")) {
		var vcol = cocktail.core.unit.UnitManager.string2RGB(string);
		return cocktail.core.unit.CSSColor.rgb(vcol.r,vcol.g,vcol.b);
	}
	return (function($this) {
		var $r;
		switch(string) {
		case "transparent":
			$r = cocktail.core.unit.CSSColor.transparent;
			break;
		case "aqua":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.aqua);
			break;
		case "black":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.black);
			break;
		case "blue":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.blue);
			break;
		case "fuchsia":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.fuchsia);
			break;
		case "gray":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.gray);
			break;
		case "green":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.green);
			break;
		case "lime":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.lime);
			break;
		case "maroon":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.maroon);
			break;
		case "navy":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.navy);
			break;
		case "olive":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.olive);
			break;
		case "orange":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.orange);
			break;
		case "purple":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.purple);
			break;
		case "red":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.red);
			break;
		case "silver":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.silver);
			break;
		case "teal":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.teal);
			break;
		case "white":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.white);
			break;
		case "yellow":
			$r = cocktail.core.unit.CSSColor.keyword(cocktail.core.unit.ColorKeyword.yellow);
			break;
		default:
			$r = (function($this) {
				var $r;
				throw "unknown color \"" + string + "\"";
				return $r;
			}($this));
		}
		return $r;
	}(this));
}
cocktail.core.unit.UnitManager.string2RGBA = function(string) {
	string = HxOverrides.substr(string,5,string.length - 6);
	var rgba = string.split(",");
	while(rgba.length < 4) rgba.push("0");
	return { r : Std.parseInt(cocktail.core.unit.UnitManager.trim(rgba[0])), g : Std.parseInt(cocktail.core.unit.UnitManager.trim(rgba[1])), b : Std.parseInt(cocktail.core.unit.UnitManager.trim(rgba[2])), a : Std.parseFloat(cocktail.core.unit.UnitManager.trim(rgba[3]))};
}
cocktail.core.unit.UnitManager.string2RGB = function(string) {
	string = HxOverrides.substr(string,4,string.length - 5);
	var rgba = string.split(",");
	while(rgba.length < 3) rgba.push("0");
	return { r : Std.parseInt(cocktail.core.unit.UnitManager.trim(rgba[0])), g : Std.parseInt(cocktail.core.unit.UnitManager.trim(rgba[1])), b : Std.parseInt(cocktail.core.unit.UnitManager.trim(rgba[2])), a : null};
}
cocktail.core.unit.UnitManager.trim = function(string) {
	return StringTools.ltrim(StringTools.rtrim(string));
}
cocktail.core.unit.UnitManager.string2VUnit = function(string) {
	var r = new EReg("^(-?[0-9]+\\.?[0-9]*)(.*)","");
	r.match(string);
	return { value : r.matched(1), unit : cocktail.core.unit.UnitManager.trim(r.matched(2))};
}
cocktail.core.unit.UnitManager.string2TimeValue = function(string) {
	string = cocktail.core.unit.UnitManager.trim(string);
	var ts = 0;
	var tms = 0;
	var tv;
	var r = new EReg("^([0-9\\.]+)(ms|s)$","");
	r.match(string);
	if(r.matched(2) == "s") tv = cocktail.core.unit.TimeValue.seconds(Std.parseFloat(r.matched(1))); else tv = cocktail.core.unit.TimeValue.milliSeconds(Std.parseFloat(r.matched(1)));
	return tv;
}
cocktail.core.unit.UnitManager.string2Length = function(parsed) {
	return (function($this) {
		var $r;
		switch(parsed.unit) {
		case "in":
			$r = cocktail.core.unit.Length.cssIn(Std.parseFloat(parsed.value));
			break;
		case "cm":
			$r = cocktail.core.unit.Length.cm(Std.parseFloat(parsed.value));
			break;
		case "em":
			$r = cocktail.core.unit.Length.em(Std.parseFloat(parsed.value));
			break;
		case "ex":
			$r = cocktail.core.unit.Length.ex(Std.parseFloat(parsed.value));
			break;
		case "mm":
			$r = cocktail.core.unit.Length.mm(Std.parseFloat(parsed.value));
			break;
		case "pc":
			$r = cocktail.core.unit.Length.pc(Std.parseFloat(parsed.value));
			break;
		case "pt":
			$r = cocktail.core.unit.Length.pt(Std.parseFloat(parsed.value));
			break;
		case "px":
			$r = cocktail.core.unit.Length.px(Std.parseFloat(parsed.value));
			break;
		case "":
			$r = (function($this) {
				var $r;
				var v = Std.parseInt(parsed.value);
				$r = v == 0?cocktail.core.unit.Length.px(v):(function($this) {
					var $r;
					throw "Bad unit \"" + parsed.unit + "\"";
					return $r;
				}($this));
				return $r;
			}($this));
			break;
		default:
			$r = (function($this) {
				var $r;
				throw "Bad unit \"" + parsed.unit + "\"";
				return $r;
			}($this));
		}
		return $r;
	}(this));
}
cocktail.core.unit.UnitManager.string2URLData = function(string) {
	string = cocktail.core.unit.UnitManager.trim(string);
	string = cocktail.core.unit.UnitManager.trim(HxOverrides.substr(string,4,string.length - 5));
	if(StringTools.startsWith(string,"\"")) string = HxOverrides.substr(string,1,null);
	if(StringTools.endsWith(string,"\"")) string = HxOverrides.substr(string,0,string.length - 1);
	if(StringTools.startsWith(string,"'")) string = HxOverrides.substr(string,1,null);
	if(StringTools.endsWith(string,"'")) string = HxOverrides.substr(string,0,string.length - 1);
	return string;
}
cocktail.core.unit.UnitManager.string2VList = function(string,sep) {
	if(sep == null) sep = " ";
	if(sep == " ") string = new EReg("[ ]{2,}","g").replace(string," "); else string = StringTools.replace(string," ","");
	string = cocktail.core.unit.UnitManager.trim(string);
	var array = string.split(sep);
	return array;
}
cocktail.core.unit.UnitManager.string2Array = function(string) {
	var r = new EReg("[ \"]*[,\"][ \"]*","g");
	var res = r.split(string);
	if(res[0] == "") res.shift();
	return res;
}
cocktail.core.unit.UnitManager.getPixelFromLength = function(length,emReference,exReference) {
	var lengthValue;
	var $e = (length);
	switch( $e[1] ) {
	case 0:
		var value = $e[2];
		lengthValue = value;
		break;
	case 2:
		var value = $e[2];
		lengthValue = value * (72 * (1 / 0.75) / 2.54) / 10;
		break;
	case 1:
		var value = $e[2];
		lengthValue = value * (72 * (1 / 0.75) / 2.54);
		break;
	case 3:
		var value = $e[2];
		lengthValue = value / 0.75;
		break;
	case 5:
		var value = $e[2];
		lengthValue = value * (72 * (1 / 0.75));
		break;
	case 4:
		var value = $e[2];
		lengthValue = value * (12 * (1 / 0.75));
		break;
	case 6:
		var value = $e[2];
		lengthValue = emReference * value;
		break;
	case 7:
		var value = $e[2];
		lengthValue = exReference * value;
		break;
	}
	return lengthValue;
}
cocktail.core.unit.UnitManager.getFontSizeFromAbsoluteSizeValue = function(absoluteSize) {
	var fontSize;
	var mediumFontSize = 16;
	switch( (absoluteSize)[1] ) {
	case 0:
		fontSize = 9;
		break;
	case 1:
		fontSize = 10;
		break;
	case 2:
		fontSize = 13;
		break;
	case 3:
		fontSize = 16;
		break;
	case 4:
		fontSize = 18;
		break;
	case 5:
		fontSize = 24;
		break;
	case 6:
		fontSize = 32;
		break;
	}
	return fontSize;
}
cocktail.core.unit.UnitManager.getFontSizeFromRelativeSizeValue = function(relativeSize,parentFontSize) {
	var fontSize;
	switch( (relativeSize)[1] ) {
	case 0:
		fontSize = cocktail.core.unit.UnitManager.getLargerFontSize(parentFontSize);
		break;
	case 1:
		fontSize = cocktail.core.unit.UnitManager.getSmallerFontSize(parentFontSize);
		break;
	}
	return fontSize;
}
cocktail.core.unit.UnitManager.getPixelFromPercent = function(percent,reference) {
	return reference * (percent * 0.01);
}
cocktail.core.unit.UnitManager.getPercentFromPixel = function(pixel,reference) {
	return reference / pixel * 100;
}
cocktail.core.unit.UnitManager.getColorDataFromCSSColor = function(value) {
	var colorValue;
	var alphaValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var blue = $e[4], green = $e[3], red = $e[2];
		colorValue = red;
		colorValue = (colorValue << 8) + green;
		colorValue = (colorValue << 8) + blue;
		alphaValue = 1.0;
		break;
	case 1:
		var alpha = $e[5], blue = $e[4], green = $e[3], red = $e[2];
		colorValue = red;
		colorValue = (colorValue << 8) + green;
		colorValue = (colorValue << 8) + blue;
		alphaValue = alpha;
		break;
	case 2:
		var value1 = $e[2];
		colorValue = Std.parseInt(StringTools.replace(value1,"#","0x"));
		alphaValue = 1.0;
		break;
	case 3:
		var value1 = $e[2];
		colorValue = cocktail.core.unit.UnitManager.getColorDataFromColorKeyword(value1).color;
		alphaValue = 1.0;
		break;
	case 4:
		colorValue = 16777215;
		alphaValue = 0.0;
		break;
	}
	var colorData = { color : colorValue, alpha : alphaValue};
	return colorData;
}
cocktail.core.unit.UnitManager.getRadFromAngle = function(value) {
	var angle;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var value1 = $e[2];
		angle = value1 * (Math.PI / 180);
		break;
	case 2:
		var value1 = $e[2];
		angle = value1;
		break;
	case 3:
		var value1 = $e[2];
		angle = value1 * 360 * (Math.PI / 180);
		break;
	case 1:
		var value1 = $e[2];
		angle = value1 * (Math.PI / 200);
		break;
	}
	return angle;
}
cocktail.core.unit.UnitManager.getDegreeFromAngle = function(value) {
	var angle;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var value1 = $e[2];
		angle = value1;
		break;
	case 2:
		var value1 = $e[2];
		angle = value1 * (180 / Math.PI);
		break;
	case 3:
		var value1 = $e[2];
		angle = value1 * 360;
		break;
	case 1:
		var value1 = $e[2];
		angle = value1 * 0.9;
		break;
	}
	return angle;
}
cocktail.core.unit.UnitManager.getColorDataFromColorKeyword = function(value) {
	var hexColor;
	switch( (value)[1] ) {
	case 0:
		hexColor = "#00FFFF";
		break;
	case 1:
		hexColor = "#000000";
		break;
	case 2:
		hexColor = "#0000FF";
		break;
	case 3:
		hexColor = "#FF00FF";
		break;
	case 4:
		hexColor = "#808080";
		break;
	case 5:
		hexColor = "#008000";
		break;
	case 6:
		hexColor = "#00FF00";
		break;
	case 7:
		hexColor = "#800000";
		break;
	case 8:
		hexColor = "#000080";
		break;
	case 9:
		hexColor = "#808000";
		break;
	case 10:
		hexColor = "#FFA500";
		break;
	case 11:
		hexColor = "#800080";
		break;
	case 12:
		hexColor = "#FF0000";
		break;
	case 13:
		hexColor = "#C0C0C0";
		break;
	case 14:
		hexColor = "#008080";
		break;
	case 15:
		hexColor = "#FFFFFF";
		break;
	case 16:
		hexColor = "#FFFF00";
		break;
	}
	return cocktail.core.unit.UnitManager.getColorDataFromCSSColor(cocktail.core.unit.CSSColor.hex(hexColor));
}
cocktail.core.unit.UnitManager.getLargerFontSize = function(parentFontSize) {
	var fontSizeTable = [9,10,13,16,18,24,32];
	var fontSize = fontSizeTable[fontSizeTable.length - 1];
	var _g1 = 0, _g = fontSizeTable.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(fontSizeTable[i] > parentFontSize) {
			fontSize = fontSizeTable[i];
			break;
		}
	}
	return fontSize;
}
cocktail.core.unit.UnitManager.getSmallerFontSize = function(parentFontSize) {
	var fontSizeTable = [9,10,13,16,18,24,32];
	var fontSize = fontSizeTable[0];
	var i = fontSizeTable.length - 1;
	while(i > 0) {
		if(fontSizeTable[i] < parentFontSize) {
			fontSize = fontSizeTable[i];
			break;
		}
		i--;
	}
	return fontSize;
}
cocktail.core.unit.UnitManager.getCSSDisplay = function(value) {
	var cssDisplayValue;
	switch( (value)[1] ) {
	case 0:
		cssDisplayValue = "block";
		break;
	case 2:
		cssDisplayValue = "inline";
		break;
	case 1:
		cssDisplayValue = "inline-block";
		break;
	case 3:
		cssDisplayValue = "none";
		break;
	}
	return cssDisplayValue;
}
cocktail.core.unit.UnitManager.getCSSFloatAsString = function(value) {
	var cssCSSFloat;
	switch( (value)[1] ) {
	case 0:
		cssCSSFloat = "left";
		break;
	case 1:
		cssCSSFloat = "right";
		break;
	case 2:
		cssCSSFloat = "none";
		break;
	}
	return cssCSSFloat;
}
cocktail.core.unit.UnitManager.getCSSClear = function(value) {
	var cssClearValue;
	switch( (value)[1] ) {
	case 1:
		cssClearValue = "left";
		break;
	case 2:
		cssClearValue = "right";
		break;
	case 3:
		cssClearValue = "both";
		break;
	case 0:
		cssClearValue = "none";
		break;
	}
	return cssClearValue;
}
cocktail.core.unit.UnitManager.getCSSZIndex = function(value) {
	var cssZIndexValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		cssZIndexValue = "auto";
		break;
	case 1:
		var value1 = $e[2];
		cssZIndexValue = Std.string(value1);
		break;
	}
	return cssZIndexValue;
}
cocktail.core.unit.UnitManager.getCSSPosition = function(value) {
	var cssPositionValue;
	switch( (value)[1] ) {
	case 0:
		cssPositionValue = "static";
		break;
	case 1:
		cssPositionValue = "relative";
		break;
	case 2:
		cssPositionValue = "absolute";
		break;
	case 3:
		cssPositionValue = "fixed";
		break;
	}
	return cssPositionValue;
}
cocktail.core.unit.UnitManager.getCSSOverflow = function(value) {
	var cssOverflowValue;
	switch( (value)[1] ) {
	case 0:
		cssOverflowValue = "visible";
		break;
	case 1:
		cssOverflowValue = "hidden";
		break;
	case 2:
		cssOverflowValue = "scroll";
		break;
	case 3:
		cssOverflowValue = "auto";
		break;
	}
	return cssOverflowValue;
}
cocktail.core.unit.UnitManager.getCSSOpacity = function(value) {
	var cssOpacityValue;
	cssOpacityValue = Std.string(value);
	return cssOpacityValue;
}
cocktail.core.unit.UnitManager.getCSSVisibility = function(value) {
	var cssVisibilityValue;
	switch( (value)[1] ) {
	case 0:
		cssVisibilityValue = "visible";
		break;
	case 1:
		cssVisibilityValue = "hidden";
		break;
	}
	return cssVisibilityValue;
}
cocktail.core.unit.UnitManager.getCSSTransform = function(value) {
	var cssTransformValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		cssTransformValue = "none";
		break;
	case 1:
		var value1 = $e[2];
		cssTransformValue = "";
		var _g1 = 0, _g = value1.length;
		while(_g1 < _g) {
			var i = _g1++;
			cssTransformValue += cocktail.core.unit.UnitManager.getCSSTransformFunction(value1[i]);
			if(i < value1.length - 1) cssTransformValue += " ";
		}
		break;
	}
	return cssTransformValue;
}
cocktail.core.unit.UnitManager.getCSSTransformFunction = function(transformFunction) {
	var cssTransformFunction;
	var $e = (transformFunction);
	switch( $e[1] ) {
	case 0:
		var value = $e[2];
		cssTransformFunction = "matrix(" + value.a + "," + value.b + "," + value.c + "," + value.d + "," + value.e + "," + value.f + ")";
		break;
	case 7:
		var angle = $e[2];
		cssTransformFunction = "rotate(" + cocktail.core.unit.UnitManager.getCSSAngle(angle) + ")";
		break;
	case 4:
		var sy = $e[3], sx = $e[2];
		cssTransformFunction = "scale(" + sx + "," + sy + ")";
		break;
	case 5:
		var sx = $e[2];
		cssTransformFunction = "scaleX(" + sx + ")";
		break;
	case 6:
		var sy = $e[2];
		cssTransformFunction = "scaleY(" + sy + ")";
		break;
	case 10:
		var skewY = $e[3], skewX = $e[2];
		cssTransformFunction = "skew(" + cocktail.core.unit.UnitManager.getCSSAngle(skewX) + "," + cocktail.core.unit.UnitManager.getCSSAngle(skewY) + ")";
		break;
	case 8:
		var skewX = $e[2];
		cssTransformFunction = "skewX(" + cocktail.core.unit.UnitManager.getCSSAngle(skewX) + ")";
		break;
	case 9:
		var skewY = $e[2];
		cssTransformFunction = "skewY(" + cocktail.core.unit.UnitManager.getCSSAngle(skewY) + ")";
		break;
	case 1:
		var ty = $e[3], tx = $e[2];
		cssTransformFunction = "translate(" + cocktail.core.unit.UnitManager.getCSSTranslation(tx) + "," + cocktail.core.unit.UnitManager.getCSSTranslation(ty) + ")";
		break;
	case 2:
		var tx = $e[2];
		cssTransformFunction = "translateX(" + cocktail.core.unit.UnitManager.getCSSTranslation(tx) + ")";
		break;
	case 3:
		var ty = $e[2];
		cssTransformFunction = "translateY(" + cocktail.core.unit.UnitManager.getCSSTranslation(ty) + ")";
		break;
	}
	return cssTransformFunction;
}
cocktail.core.unit.UnitManager.getCSSTranslation = function(translation) {
	var cssTranslation;
	var $e = (translation);
	switch( $e[1] ) {
	case 0:
		var value = $e[2];
		cssTranslation = cocktail.core.unit.UnitManager.getCSSLength(value);
		break;
	case 1:
		var value = $e[2];
		cssTranslation = cocktail.core.unit.UnitManager.getCSSPercentValue(value);
		break;
	}
	return cssTranslation;
}
cocktail.core.unit.UnitManager.getCSSTransformOrigin = function(value) {
	var cssTransformOriginValue;
	var $e = (value.x);
	switch( $e[1] ) {
	case 0:
		var value1 = $e[2];
		cssTransformOriginValue = cocktail.core.unit.UnitManager.getCSSLength(value1);
		break;
	case 1:
		var value1 = $e[2];
		cssTransformOriginValue = cocktail.core.unit.UnitManager.getCSSPercentValue(value1);
		break;
	case 2:
		cssTransformOriginValue = "left";
		break;
	case 3:
		cssTransformOriginValue = "center";
		break;
	case 4:
		cssTransformOriginValue = "right";
		break;
	}
	cssTransformOriginValue += " ";
	var $e = (value.y);
	switch( $e[1] ) {
	case 0:
		var value1 = $e[2];
		cssTransformOriginValue += cocktail.core.unit.UnitManager.getCSSLength(value1);
		break;
	case 1:
		var value1 = $e[2];
		cssTransformOriginValue += cocktail.core.unit.UnitManager.getCSSPercentValue(value1);
		break;
	case 2:
		cssTransformOriginValue += "top";
		break;
	case 3:
		cssTransformOriginValue += "center";
		break;
	case 4:
		cssTransformOriginValue += "bottom";
		break;
	}
	return cssTransformOriginValue;
}
cocktail.core.unit.UnitManager.getCSSMargin = function(value) {
	var cssMarginValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var unit = $e[2];
		cssMarginValue = cocktail.core.unit.UnitManager.getCSSLength(unit);
		break;
	case 1:
		var percentValue = $e[2];
		cssMarginValue = cocktail.core.unit.UnitManager.getCSSPercentValue(percentValue);
		break;
	case 2:
		cssMarginValue = "auto";
		break;
	}
	return cssMarginValue;
}
cocktail.core.unit.UnitManager.getCSSPadding = function(value) {
	var cssPaddingValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var unit = $e[2];
		cssPaddingValue = cocktail.core.unit.UnitManager.getCSSLength(unit);
		break;
	case 1:
		var percentValue = $e[2];
		cssPaddingValue = cocktail.core.unit.UnitManager.getCSSPercentValue(percentValue);
		break;
	}
	return cssPaddingValue;
}
cocktail.core.unit.UnitManager.getCSSDimension = function(value) {
	var cssDimensionValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var unit = $e[2];
		cssDimensionValue = cocktail.core.unit.UnitManager.getCSSLength(unit);
		break;
	case 1:
		var percentValue = $e[2];
		cssDimensionValue = cocktail.core.unit.UnitManager.getCSSPercentValue(percentValue);
		break;
	case 2:
		cssDimensionValue = "auto";
		break;
	}
	return cssDimensionValue;
}
cocktail.core.unit.UnitManager.getCSSPositionOffset = function(value) {
	var cssPositionOffsetValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var unit = $e[2];
		cssPositionOffsetValue = cocktail.core.unit.UnitManager.getCSSLength(unit);
		break;
	case 1:
		var percentValue = $e[2];
		cssPositionOffsetValue = cocktail.core.unit.UnitManager.getCSSPercentValue(percentValue);
		break;
	case 2:
		cssPositionOffsetValue = "auto";
		break;
	}
	return cssPositionOffsetValue;
}
cocktail.core.unit.UnitManager.getCSSConstrainedDimension = function(value) {
	var cssConstrainedValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var unit = $e[2];
		cssConstrainedValue = cocktail.core.unit.UnitManager.getCSSLength(unit);
		break;
	case 1:
		var percentValue = $e[2];
		cssConstrainedValue = cocktail.core.unit.UnitManager.getCSSPercentValue(percentValue);
		break;
	case 2:
		cssConstrainedValue = "none";
		break;
	}
	return cssConstrainedValue;
}
cocktail.core.unit.UnitManager.getCSSVerticalAlign = function(value) {
	var cssVerticalAlignValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		cssVerticalAlignValue = "baseline";
		break;
	case 5:
		cssVerticalAlignValue = "middle";
		break;
	case 1:
		cssVerticalAlignValue = "sub";
		break;
	case 2:
		cssVerticalAlignValue = "super";
		break;
	case 4:
		cssVerticalAlignValue = "text-top";
		break;
	case 7:
		cssVerticalAlignValue = "text-bottom";
		break;
	case 3:
		cssVerticalAlignValue = "top";
		break;
	case 6:
		cssVerticalAlignValue = "bottom";
		break;
	case 8:
		var value1 = $e[2];
		cssVerticalAlignValue = cocktail.core.unit.UnitManager.getCSSPercentValue(value1);
		break;
	case 9:
		var value1 = $e[2];
		cssVerticalAlignValue = cocktail.core.unit.UnitManager.getCSSLength(value1);
		break;
	}
	return cssVerticalAlignValue;
}
cocktail.core.unit.UnitManager.getCSSLineHeight = function(value) {
	var cssLineHeightValue;
	var $e = (value);
	switch( $e[1] ) {
	case 2:
		var unit = $e[2];
		cssLineHeightValue = cocktail.core.unit.UnitManager.getCSSLength(unit);
		break;
	case 0:
		cssLineHeightValue = "normal";
		break;
	case 3:
		var value1 = $e[2];
		cssLineHeightValue = cocktail.core.unit.UnitManager.getCSSPercentValue(value1);
		break;
	case 1:
		var value1 = $e[2];
		cssLineHeightValue = Std.string(value1);
		break;
	}
	return cssLineHeightValue;
}
cocktail.core.unit.UnitManager.getCSSFontSize = function(value) {
	var cssFontSizeValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var unit = $e[2];
		cssFontSizeValue = cocktail.core.unit.UnitManager.getCSSLength(unit);
		break;
	case 1:
		var percent = $e[2];
		cssFontSizeValue = cocktail.core.unit.UnitManager.getCSSPercentValue(percent);
		break;
	case 2:
		var value1 = $e[2];
		switch( (value1)[1] ) {
		case 0:
			cssFontSizeValue = "xx-small";
			break;
		case 1:
			cssFontSizeValue = "x-small";
			break;
		case 2:
			cssFontSizeValue = "small";
			break;
		case 3:
			cssFontSizeValue = "medium";
			break;
		case 4:
			cssFontSizeValue = "large";
			break;
		case 5:
			cssFontSizeValue = "x-large";
			break;
		case 6:
			cssFontSizeValue = "xx-large";
			break;
		}
		break;
	case 3:
		var value1 = $e[2];
		switch( (value1)[1] ) {
		case 0:
			cssFontSizeValue = "larger";
			break;
		case 1:
			cssFontSizeValue = "smaller";
			break;
		}
		break;
	}
	return cssFontSizeValue;
}
cocktail.core.unit.UnitManager.getCSSFontWeight = function(value) {
	var cssFontWeightValue;
	switch( (value)[1] ) {
	case 0:
		cssFontWeightValue = "normal";
		break;
	case 1:
		cssFontWeightValue = "bold";
		break;
	case 2:
		cssFontWeightValue = "bolder";
		break;
	case 3:
		cssFontWeightValue = "lighter";
		break;
	case 4:
		cssFontWeightValue = "100";
		break;
	case 5:
		cssFontWeightValue = "200";
		break;
	case 6:
		cssFontWeightValue = "300";
		break;
	case 7:
		cssFontWeightValue = "400";
		break;
	case 8:
		cssFontWeightValue = "500";
		break;
	case 9:
		cssFontWeightValue = "600";
		break;
	case 10:
		cssFontWeightValue = "700";
		break;
	case 11:
		cssFontWeightValue = "800";
		break;
	case 12:
		cssFontWeightValue = "900";
		break;
	}
	return cssFontWeightValue;
}
cocktail.core.unit.UnitManager.getCSSFontStyle = function(value) {
	var cssFontStyleValue;
	switch( (value)[1] ) {
	case 0:
		cssFontStyleValue = "normal";
		break;
	case 1:
		cssFontStyleValue = "italic";
		break;
	case 2:
		cssFontStyleValue = "obllique";
		break;
	}
	return cssFontStyleValue;
}
cocktail.core.unit.UnitManager.getCSSFontVariant = function(value) {
	var cssFontVariantValue;
	switch( (value)[1] ) {
	case 0:
		cssFontVariantValue = "normal";
		break;
	case 1:
		cssFontVariantValue = "small-caps";
		break;
	}
	return cssFontVariantValue;
}
cocktail.core.unit.UnitManager.getCSSFontFamily = function(value) {
	var cssFontFamilyValue = "";
	var _g1 = 0, _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		var fontName = value[i];
		if(fontName.indexOf(" ") != -1) fontName = "'" + fontName + "'";
		cssFontFamilyValue += fontName;
		if(i < value.length - 1) cssFontFamilyValue += ",";
	}
	return cssFontFamilyValue;
}
cocktail.core.unit.UnitManager.getCSSTextAlign = function(value) {
	var cssTextAlignValue;
	switch( (value)[1] ) {
	case 0:
		cssTextAlignValue = "left";
		break;
	case 1:
		cssTextAlignValue = "right";
		break;
	case 2:
		cssTextAlignValue = "center";
		break;
	case 3:
		cssTextAlignValue = "justify";
		break;
	}
	return cssTextAlignValue;
}
cocktail.core.unit.UnitManager.getCSSWhiteSpace = function(value) {
	var cssWhiteSpaceValue;
	switch( (value)[1] ) {
	case 0:
		cssWhiteSpaceValue = "normal";
		break;
	case 1:
		cssWhiteSpaceValue = "pre";
		break;
	case 2:
		cssWhiteSpaceValue = "nowrap";
		break;
	case 3:
		cssWhiteSpaceValue = "pre-wrap";
		break;
	case 4:
		cssWhiteSpaceValue = "pre-line";
		break;
	}
	return cssWhiteSpaceValue;
}
cocktail.core.unit.UnitManager.getCSSTextTransform = function(value) {
	var cssTextTransformValue;
	switch( (value)[1] ) {
	case 3:
		cssTextTransformValue = "none";
		break;
	case 1:
		cssTextTransformValue = "uppercase";
		break;
	case 2:
		cssTextTransformValue = "lowercase";
		break;
	case 0:
		cssTextTransformValue = "capitalize";
		break;
	}
	return cssTextTransformValue;
}
cocktail.core.unit.UnitManager.getCSSTextIndent = function(value) {
	var cssTextIndentValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var value1 = $e[2];
		cssTextIndentValue = cocktail.core.unit.UnitManager.getCSSLength(value1);
		break;
	case 1:
		var value1 = $e[2];
		cssTextIndentValue = cocktail.core.unit.UnitManager.getCSSPercentValue(value1);
		break;
	}
	return cssTextIndentValue;
}
cocktail.core.unit.UnitManager.getCSSLetterSpacing = function(value) {
	var cssLetterSpacingValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		cssLetterSpacingValue = "normal";
		break;
	case 1:
		var unit = $e[2];
		cssLetterSpacingValue = cocktail.core.unit.UnitManager.getCSSLength(unit);
		break;
	}
	return cssLetterSpacingValue;
}
cocktail.core.unit.UnitManager.getCSSWordSpacing = function(value) {
	var cssWordSpacingValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		cssWordSpacingValue = "normal";
		break;
	case 1:
		var unit = $e[2];
		cssWordSpacingValue = cocktail.core.unit.UnitManager.getCSSLength(unit);
		break;
	}
	return cssWordSpacingValue;
}
cocktail.core.unit.UnitManager.getCSSBackgroundColor = function(value) {
	var cssBackgroundColor;
	cssBackgroundColor = cocktail.core.unit.UnitManager.getCSSColor(value);
	return cssBackgroundColor;
}
cocktail.core.unit.UnitManager.getCSSBackgroundOrigin = function(value) {
	var cssBackgroundOrigin = "";
	var _g1 = 0, _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		switch( (value[i])[1] ) {
		case 0:
			cssBackgroundOrigin += "border-box";
			break;
		case 2:
			cssBackgroundOrigin += "content-box";
			break;
		case 1:
			cssBackgroundOrigin += "padding-box";
			break;
		}
		if(i < value.length - 1) cssBackgroundOrigin += ",";
	}
	return cssBackgroundOrigin;
}
cocktail.core.unit.UnitManager.getCSSBackgroundClip = function(value) {
	var cssBackgroundClip = "";
	var _g1 = 0, _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		switch( (value[i])[1] ) {
		case 0:
			cssBackgroundClip += "border-box";
			break;
		case 2:
			cssBackgroundClip += "content-box";
			break;
		case 1:
			cssBackgroundClip += "padding-box";
			break;
		}
		if(i < value.length - 1) cssBackgroundClip += ",";
	}
	return cssBackgroundClip;
}
cocktail.core.unit.UnitManager.getCSSBackgroundImage = function(value) {
	var cssBackgroundImage = "";
	var _g1 = 0, _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		var $e = (value[i]);
		switch( $e[1] ) {
		case 0:
			cssBackgroundImage += "none";
			break;
		case 1:
			var value1 = $e[2];
			cssBackgroundImage += cocktail.core.unit.UnitManager.getCSSImageValue(value1);
			break;
		}
		if(i < value.length - 1) cssBackgroundImage += ",";
	}
	return cssBackgroundImage;
}
cocktail.core.unit.UnitManager.getCSSBackgroundSize = function(value) {
	var cssBackgroundSize = "";
	var _g1 = 0, _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		var $e = (value[i]);
		switch( $e[1] ) {
		case 0:
			cssBackgroundSize += "contain";
			break;
		case 1:
			cssBackgroundSize += "cover";
			break;
		case 2:
			var value1 = $e[2];
			cssBackgroundSize += cocktail.core.unit.UnitManager.getCSSBackgroundSizeDimensions(value1);
			break;
		}
		if(i < value.length - 1) cssBackgroundSize += ",";
	}
	return cssBackgroundSize;
}
cocktail.core.unit.UnitManager.getCSSBackgroundSizeDimensions = function(value) {
	var cssBackgroundSizeDimensions = cocktail.core.unit.UnitManager.getCSSBackgroundSizeDimension(value.x) + " " + cocktail.core.unit.UnitManager.getCSSBackgroundSizeDimension(value.y);
	return cssBackgroundSizeDimensions;
}
cocktail.core.unit.UnitManager.getCSSBackgroundSizeDimension = function(value) {
	var cssBackgroundSizeDimension;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var value1 = $e[2];
		cssBackgroundSizeDimension = cocktail.core.unit.UnitManager.getCSSLength(value1);
		break;
	case 1:
		var value1 = $e[2];
		cssBackgroundSizeDimension = cocktail.core.unit.UnitManager.getCSSPercentValue(value1);
		break;
	case 2:
		cssBackgroundSizeDimension = "auto";
		break;
	}
	return cssBackgroundSizeDimension;
}
cocktail.core.unit.UnitManager.getCSSBackgroundPosition = function(value) {
	var cssBackgroundPositionData = "";
	var _g1 = 0, _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		cssBackgroundPositionData += cocktail.core.unit.UnitManager.getCSSBackgroundPositionX(value[i].x) + " " + cocktail.core.unit.UnitManager.getCSSBackgroundPositionY(value[i].y);
		if(i < value.length - 1) cssBackgroundPositionData += ",";
	}
	return cssBackgroundPositionData;
}
cocktail.core.unit.UnitManager.getCSSBackgroundPositionX = function(value) {
	var cssBackgroundPositionX;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var value1 = $e[2];
		cssBackgroundPositionX = cocktail.core.unit.UnitManager.getCSSLength(value1);
		break;
	case 1:
		var value1 = $e[2];
		cssBackgroundPositionX = cocktail.core.unit.UnitManager.getCSSPercentValue(value1);
		break;
	case 3:
		cssBackgroundPositionX = "center";
		break;
	case 2:
		cssBackgroundPositionX = "left";
		break;
	case 4:
		cssBackgroundPositionX = "right";
		break;
	}
	return cssBackgroundPositionX;
}
cocktail.core.unit.UnitManager.getCSSBackgroundPositionY = function(value) {
	var cssBackgroundPositionY;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var value1 = $e[2];
		cssBackgroundPositionY = cocktail.core.unit.UnitManager.getCSSLength(value1);
		break;
	case 1:
		var value1 = $e[2];
		cssBackgroundPositionY = cocktail.core.unit.UnitManager.getCSSPercentValue(value1);
		break;
	case 4:
		cssBackgroundPositionY = "bottom";
		break;
	case 2:
		cssBackgroundPositionY = "top";
		break;
	case 3:
		cssBackgroundPositionY = "center";
		break;
	}
	return cssBackgroundPositionY;
}
cocktail.core.unit.UnitManager.getCSSBackgroundRepeat = function(value) {
	var cssBackgroundRepeat = "";
	var _g1 = 0, _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		cssBackgroundRepeat += cocktail.core.unit.UnitManager.getCSSBackgroundRepeatValue(value[i].x) + " " + cocktail.core.unit.UnitManager.getCSSBackgroundRepeatValue(value[i].y);
		if(i < value.length - 1) cssBackgroundRepeat += ",";
	}
	return cssBackgroundRepeat;
}
cocktail.core.unit.UnitManager.getCSSBackgroundRepeatValue = function(value) {
	var cssBackgroundRepeatValue;
	switch( (value)[1] ) {
	case 3:
		cssBackgroundRepeatValue = "no-repeat";
		break;
	case 0:
		cssBackgroundRepeatValue = "repeat";
		break;
	case 2:
		cssBackgroundRepeatValue = "round";
		break;
	case 1:
		cssBackgroundRepeatValue = "space";
		break;
	}
	return cssBackgroundRepeatValue;
}
cocktail.core.unit.UnitManager.getCSSCursor = function(value) {
	var cssCursorValue;
	switch( (value)[1] ) {
	case 0:
		cssCursorValue = "auto";
		break;
	case 1:
		cssCursorValue = "crosshair";
		break;
	case 2:
		cssCursorValue = "default";
		break;
	case 3:
		cssCursorValue = "pointer";
		break;
	case 4:
		cssCursorValue = "text";
		break;
	}
	return cssCursorValue;
}
cocktail.core.unit.UnitManager.getCSSImageValue = function(value) {
	var cssImageValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var value1 = $e[2];
		cssImageValue = "url(\"" + value1 + "\")";
		break;
	case 1:
		var value1 = $e[2];
		cssImageValue = "image(" + cocktail.core.unit.UnitManager.getCSSImageList(value1) + ")";
		break;
	case 2:
		var value1 = $e[2];
		cssImageValue = cocktail.core.unit.UnitManager.getCSSGradientValue(value1);
		break;
	}
	return cssImageValue;
}
cocktail.core.unit.UnitManager.getCSSImageList = function(value) {
	var cssImageList = "";
	var _g1 = 0, _g = value.urls.length;
	while(_g1 < _g) {
		var i = _g1++;
		cssImageList += "\"" + value.urls[i] + "\"";
		if(i < value.urls.length - 1) cssImageList += ","; else cssImageList += "," + cocktail.core.unit.UnitManager.getCSSColor(value.fallbackColor);
	}
	return cssImageList;
}
cocktail.core.unit.UnitManager.getCSSGradientValue = function(value) {
	var cssGradientValue;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var value1 = $e[2];
		cssGradientValue = "linear-gradient(" + cocktail.core.unit.UnitManager.getCSSLinearGradientValue(value1) + ")";
		break;
	}
	return cssGradientValue;
}
cocktail.core.unit.UnitManager.getCSSLinearGradientValue = function(value) {
	var cssLinearGradientValue = cocktail.core.unit.UnitManager.getCSSGradientAngle(value.angle) + "," + cocktail.core.unit.UnitManager.getCSSColorStopsValue(value.colorStops);
	return cssLinearGradientValue;
}
cocktail.core.unit.UnitManager.getCSSColorStopsValue = function(value) {
	var cssColorStopsData = "";
	var _g1 = 0, _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		cssColorStopsData += cocktail.core.unit.UnitManager.getCSSColor(value[i].color) + " " + cocktail.core.unit.UnitManager.getCSSColorStopValue(value[i].stop);
		if(i < value.length - 1) cssColorStopsData += ",";
	}
	return cssColorStopsData;
}
cocktail.core.unit.UnitManager.getCSSColorStopValue = function(value) {
	var cssColorStopValue;
	var $e = (value);
	switch( $e[1] ) {
	case 1:
		var value1 = $e[2];
		cssColorStopValue = cocktail.core.unit.UnitManager.getCSSPercentValue(value1);
		break;
	case 0:
		var value1 = $e[2];
		cssColorStopValue = cocktail.core.unit.UnitManager.getCSSLength(value1);
		break;
	}
	return cssColorStopValue;
}
cocktail.core.unit.UnitManager.getCSSGradientAngle = function(value) {
	var cssGradientAngle;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var value1 = $e[2];
		cssGradientAngle = cocktail.core.unit.UnitManager.getCSSAngle(value1);
		break;
	case 2:
		var value1 = $e[2];
		cssGradientAngle = cocktail.core.unit.UnitManager.getCSSCornerValue(value1);
		break;
	case 1:
		var value1 = $e[2];
		cssGradientAngle = cocktail.core.unit.UnitManager.getCSSSideValue(value1);
		break;
	}
	return cssGradientAngle;
}
cocktail.core.unit.UnitManager.getCSSSideValue = function(value) {
	var cssSideValue;
	switch( (value)[1] ) {
	case 2:
		cssSideValue = "bottom";
		break;
	case 1:
		cssSideValue = "left";
		break;
	case 3:
		cssSideValue = "right";
		break;
	case 0:
		cssSideValue = "top";
		break;
	}
	return cssSideValue;
}
cocktail.core.unit.UnitManager.getCSSCornerValue = function(value) {
	var cssCornerValue;
	switch( (value)[1] ) {
	case 2:
		cssCornerValue = "left bottom";
		break;
	case 1:
		cssCornerValue = "right bottom";
		break;
	case 3:
		cssCornerValue = "left top";
		break;
	case 0:
		cssCornerValue = "right top";
		break;
	}
	return cssCornerValue;
}
cocktail.core.unit.UnitManager.getCSSColor = function(value) {
	var cssColor;
	var $e = (value);
	switch( $e[1] ) {
	case 2:
		var value1 = $e[2];
		cssColor = value1;
		break;
	case 0:
		var blue = $e[4], green = $e[3], red = $e[2];
		cssColor = "rgb(" + red + "," + green + "," + blue + ")";
		break;
	case 1:
		var alpha = $e[5], blue = $e[4], green = $e[3], red = $e[2];
		cssColor = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
		break;
	case 3:
		var value1 = $e[2];
		cssColor = cocktail.core.unit.UnitManager.getColorFromKeyword(value1);
		break;
	case 4:
		cssColor = "transparent";
		break;
	}
	return cssColor;
}
cocktail.core.unit.UnitManager.getCSSLength = function(lengthValue) {
	var cssLength;
	var $e = (lengthValue);
	switch( $e[1] ) {
	case 0:
		var pixelValue = $e[2];
		cssLength = Std.string(pixelValue) + "px";
		break;
	case 3:
		var pointValue = $e[2];
		cssLength = Std.string(pointValue) + "pt";
		break;
	case 2:
		var milimetersValue = $e[2];
		cssLength = Std.string(milimetersValue) + "mm";
		break;
	case 4:
		var picasValue = $e[2];
		cssLength = Std.string(picasValue) + "pc";
		break;
	case 1:
		var centimetersValue = $e[2];
		cssLength = Std.string(centimetersValue) + "cm";
		break;
	case 5:
		var inchesValue = $e[2];
		cssLength = Std.string(inchesValue) + "in";
		break;
	case 6:
		var emValue = $e[2];
		cssLength = Std.string(emValue) + "em";
		break;
	case 7:
		var exValue = $e[2];
		cssLength = Std.string(exValue) + "ex";
		break;
	}
	return cssLength;
}
cocktail.core.unit.UnitManager.getCSSPercentValue = function(value) {
	return Std.string(value) + "%";
}
cocktail.core.unit.UnitManager.getCSSAngle = function(value) {
	var cssAngle;
	var $e = (value);
	switch( $e[1] ) {
	case 0:
		var value1 = $e[2];
		cssAngle = Std.string(value1) + "deg";
		break;
	case 2:
		var value1 = $e[2];
		cssAngle = Std.string(value1) + "rad";
		break;
	case 1:
		var value1 = $e[2];
		cssAngle = Std.string(value1) + "grad";
		break;
	case 3:
		var value1 = $e[2];
		cssAngle = Std.string(value1) + "turn";
		break;
	}
	return cssAngle;
}
cocktail.core.unit.UnitManager.getColorFromKeyword = function(value) {
	var cssColor;
	switch( (value)[1] ) {
	case 0:
		cssColor = "aqua";
		break;
	case 1:
		cssColor = "black";
		break;
	case 2:
		cssColor = "blue";
		break;
	case 3:
		cssColor = "fuchsia";
		break;
	case 4:
		cssColor = "gray";
		break;
	case 5:
		cssColor = "green";
		break;
	case 6:
		cssColor = "lime";
		break;
	case 7:
		cssColor = "maroon";
		break;
	case 8:
		cssColor = "navy";
		break;
	case 9:
		cssColor = "olive";
		break;
	case 10:
		cssColor = "orange";
		break;
	case 11:
		cssColor = "purple";
		break;
	case 12:
		cssColor = "red";
		break;
	case 13:
		cssColor = "silver";
		break;
	case 14:
		cssColor = "teal";
		break;
	case 15:
		cssColor = "white";
		break;
	case 16:
		cssColor = "yellow";
		break;
	}
	return cssColor;
}
cocktail.core.unit.UnitManager.getTimeValueArray = function(value) {
	var tResult = new Array();
	var tValues = value.split(",");
	var _g1 = 0, _g = tValues.length;
	while(_g1 < _g) {
		var i = _g1++;
		tResult.push(cocktail.core.unit.UnitManager.string2TimeValue(tValues[i]));
	}
	return tResult;
}
cocktail.core.unit.UnitManager.getCSSTimeValueArray = function(value) {
	var tResult = new Array();
	var _g = 0;
	while(_g < value.length) {
		var val = value[_g];
		++_g;
		var $e = (val);
		switch( $e[1] ) {
		case 0:
			var timeval = $e[2];
			tResult.push(Std.string(timeval) + "s");
			break;
		case 1:
			var timeval = $e[2];
			tResult.push(Std.string(timeval) + "ms");
			break;
		}
	}
	return tResult.join(",");
}
cocktail.core.unit.UnitManager.getTransitionDuration = function(value) {
	return cocktail.core.unit.UnitManager.getTimeValueArray(value);
}
cocktail.core.unit.UnitManager.getCSSTransitionDuration = function(value) {
	return cocktail.core.unit.UnitManager.getCSSTimeValueArray(value);
}
cocktail.core.unit.UnitManager.getTransitionDelay = function(value) {
	return cocktail.core.unit.UnitManager.getTimeValueArray(value);
}
cocktail.core.unit.UnitManager.getCSSTransitionDelay = function(value) {
	return cocktail.core.unit.UnitManager.getCSSTimeValueArray(value);
}
cocktail.core.unit.UnitManager.getTransitionProperty = function(value) {
	value = cocktail.core.unit.UnitManager.trim(value);
	var tr;
	var array = cocktail.core.unit.UnitManager.string2VList(value,",");
	var arrayProperties = [];
	if(value == "none") tr = cocktail.core.style.TransitionProperty.none; else if(value == "all") tr = cocktail.core.style.TransitionProperty.all; else {
		var _g = 0;
		while(_g < array.length) {
			var val = array[_g];
			++_g;
			arrayProperties.push(val);
		}
		tr = cocktail.core.style.TransitionProperty.list(arrayProperties);
	}
	return tr;
}
cocktail.core.unit.UnitManager.getCSSTransitionProperty = function(value) {
	var result;
	var $e = (value);
	switch( $e[1] ) {
	case 2:
		var value1 = $e[2];
		result = value1.join(",");
		break;
	case 0:
		result = "none";
		break;
	case 1:
		result = "all";
		break;
	default:
		result = "none";
	}
	return result;
}
cocktail.core.unit.UnitManager.getTransitionTimingFunction = function(string) {
	var rSplit = new EReg("[^\\(][^0-9]*)],","g");
	var tSplit = rSplit.split(string);
	var tFunctions = [];
	var tResult = new Array();
	var rgB = new EReg("cubic-bezier[ ]*\\([ ]*([0-9]+)[ ]*,[ ]*([0-9]+)[ ]*,[ ]*([0-9]+)[ ]*,[ ]*([0-9]+)[ ]*\\)$","");
	var rgS = new EReg("steps[ ]*\\([ ]*([0-9]+)[ ]*,[ ]*(start|end)[ ]*\\)","");
	var tr = cocktail.core.style.TransitionTimingFunctionValue.ease;
	var _g = 0;
	while(_g < tSplit.length) {
		var func = tSplit[_g];
		++_g;
		if(!rgB.match(func) && !rgS.match(func)) tFunctions = tFunctions.concat(func.split(",")); else tFunctions.push(func);
	}
	var _g = 0;
	while(_g < tFunctions.length) {
		var func = tFunctions[_g];
		++_g;
		func = cocktail.core.unit.UnitManager.trim(func);
		if(rgS.match(func)) {
			if(rgS.matched(2) == "start") tr = cocktail.core.style.TransitionTimingFunctionValue.steps(Std.parseInt(rgS.matched(1)),cocktail.core.style.IntervalChangeValue.start); else tr = cocktail.core.style.TransitionTimingFunctionValue.steps(Std.parseInt(rgS.matched(1)),cocktail.core.style.IntervalChangeValue.end);
		} else if(rgB.match(func)) tr = cocktail.core.style.TransitionTimingFunctionValue.cubicBezier(Std.parseFloat(rgB.matched(1)),Std.parseFloat(rgB.matched(2)),Std.parseFloat(rgB.matched(3)),Std.parseFloat(rgB.matched(4))); else switch(func) {
		case "ease":
			tr = cocktail.core.style.TransitionTimingFunctionValue.ease;
			break;
		case "linear":
			tr = cocktail.core.style.TransitionTimingFunctionValue.linear;
			break;
		case "ease-in":
			tr = cocktail.core.style.TransitionTimingFunctionValue.easeIn;
			break;
		case "ease-out":
			tr = cocktail.core.style.TransitionTimingFunctionValue.easeOut;
			break;
		case "ease-in-out":
			tr = cocktail.core.style.TransitionTimingFunctionValue.easeInOut;
			break;
		case "step-start":
			tr = cocktail.core.style.TransitionTimingFunctionValue.stepStart;
			break;
		case "step-end":
			tr = cocktail.core.style.TransitionTimingFunctionValue.stepEnd;
			break;
		}
		tResult.push(tr);
	}
	return tResult;
}
cocktail.core.unit.UnitManager.getCSSTransitionTimingFunction = function(functions) {
	var tResult = new Array();
	var r;
	var func;
	var _g1 = 0, _g = functions.length;
	while(_g1 < _g) {
		var i = _g1++;
		func = functions[i];
		var $e = (func);
		switch( $e[1] ) {
		case 7:
			var intervalChange = $e[3], intervalNumbers = $e[2];
			var interval = "start";
			switch( (intervalChange)[1] ) {
			case 0:
				interval = "start";
				break;
			case 1:
				interval = "end";
				break;
			}
			r = "steps(" + Std.string(intervalNumbers) + "," + interval;
			break;
		case 8:
			var y2 = $e[5], x2 = $e[4], y1 = $e[3], x1 = $e[2];
			r = "cubic-bezier(" + Std.string(x1) + "," + Std.string(y1) + "," + Std.string(x2) + "," + Std.string(y2) + ")";
			break;
		case 0:
			r = "ease";
			break;
		case 1:
			r = "linear";
			break;
		case 2:
			r = "easeIn";
			break;
		case 3:
			r = "easeOut";
			break;
		case 4:
			r = "easeInOut";
			break;
		case 5:
			r = "stepStart";
			break;
		case 6:
			r = "stepEnd";
			break;
		}
		tResult.push(r);
	}
	return tResult.join(",");
}
cocktail.core.unit.UnitManager.getTransform = function(value) {
	var tFunctions;
	var tFresult = [];
	var res;
	var func;
	var rMatrix = new EReg("matrix[ ]*\\([ ]*([0-9\\.\\-]+)[ ]*,[ ]*([0-9\\.\\-]+)[ ]*,[ ]*([0-9\\.\\-]+)[ ]*,[ ]*([0-9\\.\\-]+)[ ]*,[ ]*([0-9\\.\\-]+)[ ]*,[ ]*([0-9\\.\\-]+)[ ]*\\)","i");
	var rTranslate = new EReg("translate[ ]*\\([ ]*([0-9]+(%|px))[ ]*,[ ]*([0-9]+(%|px))[ ]*\\)","i");
	var rTranslateX = new EReg("translatex[ ]*\\([ ]*([0-9]+(%|px))[ ]*\\)","i");
	var rTranslateY = new EReg("translatey[ ]*\\([ ]*([0-9]+(%|px))[ ]*\\)","i");
	var rScale = new EReg("scale[ ]*\\([ ]*([0-9].+)[ ]*,[ ]*([0-9].+)[ ]*\\)","i");
	var rScaleX = new EReg("scaleX[ ]*\\([ ]*([0-9].+)[ ]*\\)","i");
	var rScaleY = new EReg("scaleY[ ]*\\([ ]*([0-9].+)[ ]*\\)","i");
	var rRotate = new EReg("rotate[ ]*\\([ ]*([0-9].+)deg[ ]*\\)","i");
	var rSkewX = new EReg("skewX[ ]*\\([ ]*([0-9].+)deg[ ]*\\)","i");
	var rSkewY = new EReg("skewY[ ]*\\([ ]*([0-9].+)deg[ ]*\\)","i");
	var rSkew = new EReg("skew[ ]*\\([ ]*([0-9].+)deg[ ]*,[ ]*([0-9].+)deg[ ]*\\)","i");
	tFunctions = value.split(" ");
	func = cocktail.core.unit.UnitManager.trim(value);
	if(func == "none") {
		res = cocktail.core.style.Transform.none;
		return res;
	}
	if(rMatrix.match(func)) {
		var tMatrixData = { a : Std.parseFloat(rMatrix.matched(1)), b : Std.parseFloat(rMatrix.matched(2)), c : Std.parseFloat(rMatrix.matched(3)), d : Std.parseFloat(rMatrix.matched(4)), e : Std.parseFloat(rMatrix.matched(5)), f : Std.parseFloat(rMatrix.matched(6))};
		tFresult.push(cocktail.core.style.TransformFunction.matrix(tMatrixData));
	}
	if(rTranslate.match(func)) {
		var parsed = cocktail.core.unit.UnitManager.string2VUnit(rTranslate.matched(1));
		var tx;
		var ty;
		switch(parsed.unit) {
		case "%":
			tx = cocktail.core.style.Translation.percent(Std.parseInt(parsed.value));
			break;
		default:
			tx = cocktail.core.style.Translation.length(cocktail.core.unit.UnitManager.string2Length(parsed));
		}
		parsed = cocktail.core.unit.UnitManager.string2VUnit(rTranslate.matched(3));
		switch(parsed.unit) {
		case "%":
			ty = cocktail.core.style.Translation.percent(Std.parseInt(parsed.value));
			break;
		default:
			ty = cocktail.core.style.Translation.length(cocktail.core.unit.UnitManager.string2Length(parsed));
		}
		tFresult.push(cocktail.core.style.TransformFunction.translate(tx,ty));
	}
	if(rTranslateX.match(func)) {
		var parsed = cocktail.core.unit.UnitManager.string2VUnit(rTranslateX.matched(1));
		var tx;
		switch(parsed.unit) {
		case "%":
			tx = cocktail.core.style.Translation.percent(Std.parseInt(parsed.value));
			break;
		default:
			tx = cocktail.core.style.Translation.length(cocktail.core.unit.UnitManager.string2Length(parsed));
		}
		tFresult.push(cocktail.core.style.TransformFunction.translateX(tx));
	}
	if(rTranslateY.match(func)) {
		var parsed = cocktail.core.unit.UnitManager.string2VUnit(rTranslateY.matched(1));
		var ty;
		switch(parsed.unit) {
		case "%":
			ty = cocktail.core.style.Translation.percent(Std.parseInt(parsed.value));
			break;
		default:
			ty = cocktail.core.style.Translation.length(cocktail.core.unit.UnitManager.string2Length(parsed));
		}
		tFresult.push(cocktail.core.style.TransformFunction.translateY(ty));
	}
	if(rScale.match(func)) tFresult.push(cocktail.core.style.TransformFunction.scale(Std.parseFloat(rScale.matched(1)),Std.parseFloat(rScale.matched(2))));
	if(rScaleX.match(func)) tFresult.push(cocktail.core.style.TransformFunction.scaleX(Std.parseFloat(rScaleX.matched(1))));
	if(rScaleY.match(func)) tFresult.push(cocktail.core.style.TransformFunction.scaleY(Std.parseFloat(rScaleY.matched(1))));
	if(rRotate.match(func)) tFresult.push(cocktail.core.style.TransformFunction.rotate(cocktail.core.unit.Angle.deg(Std.parseFloat(rRotate.matched(1)))));
	if(rSkewX.match(func)) tFresult.push(cocktail.core.style.TransformFunction.skewX(cocktail.core.unit.Angle.deg(Std.parseFloat(rSkewX.matched(1)))));
	if(rSkewY.match(func)) tFresult.push(cocktail.core.style.TransformFunction.skewY(cocktail.core.unit.Angle.deg(Std.parseFloat(rSkewY.matched(1)))));
	if(rSkew.match(func)) tFresult.push(cocktail.core.style.TransformFunction.skew(cocktail.core.unit.Angle.deg(Std.parseFloat(rSkew.matched(1))),cocktail.core.unit.Angle.deg(Std.parseFloat(rSkew.matched(2)))));
	res = cocktail.core.style.Transform.transformFunctions(tFresult);
	return res;
}
cocktail.core.unit.UnitManager.getTransformOrigin = function(string) {
	var tAxis = [];
	string = cocktail.core.unit.UnitManager.trim(string);
	tAxis = string.split(" ");
	var result;
	result = { x : cocktail.core.style.TransformOriginX.percent(50), y : cocktail.core.style.TransformOriginY.percent(50)};
	switch(tAxis[0]) {
	case "left":
		result.x = cocktail.core.style.TransformOriginX.left;
		break;
	case "center":
		result.x = cocktail.core.style.TransformOriginX.center;
		break;
	case "right":
		result.x = cocktail.core.style.TransformOriginX.right;
		break;
	default:
		var parsed = cocktail.core.unit.UnitManager.string2VUnit(tAxis[0]);
		switch(parsed.unit) {
		case "%":
			result.x = cocktail.core.style.TransformOriginX.percent(Std.parseInt(parsed.value));
			break;
		default:
			result.x = cocktail.core.style.TransformOriginX.length(cocktail.core.unit.UnitManager.string2Length(parsed));
		}
	}
	switch(tAxis[1]) {
	case "top":
		result.y = cocktail.core.style.TransformOriginY.top;
		break;
	case "center":
		result.y = cocktail.core.style.TransformOriginY.center;
		break;
	case "bottom":
		result.y = cocktail.core.style.TransformOriginY.bottom;
		break;
	default:
		var parsed = cocktail.core.unit.UnitManager.string2VUnit(tAxis[1]);
		switch(parsed.unit) {
		case "%":
			result.y = cocktail.core.style.TransformOriginY.percent(Std.parseInt(parsed.value));
			break;
		default:
			result.y = cocktail.core.style.TransformOriginY.length(cocktail.core.unit.UnitManager.string2Length(parsed));
		}
	}
	return result;
}
cocktail.core.unit.UnitManager.prototype = {
	__class__: cocktail.core.unit.UnitManager
}
cocktail.core.window = {}
cocktail.core.window.Window = function() {
	cocktail.core.event.EventCallback.call(this);
	this.init();
};
$hxClasses["cocktail.core.window.Window"] = cocktail.core.window.Window;
cocktail.core.window.Window.__name__ = ["cocktail","core","window","Window"];
cocktail.core.window.Window.__super__ = cocktail.core.event.EventCallback;
cocktail.core.window.Window.prototype = $extend(cocktail.core.event.EventCallback.prototype,{
	get_innerWidth: function() {
		return this.platform.nativeWindow.get_innerWidth();
	}
	,get_innerHeight: function() {
		return this.platform.nativeWindow.get_innerHeight();
	}
	,onDocumentSetMouseCursor: function(cursor) {
		this.platform.mouse.setMouseCursor(cursor);
	}
	,onDocumentExitFullscreen: function() {
		this.platform.nativeWindow.exitFullscreen();
	}
	,onDocumentEnterFullscreen: function() {
		this.platform.nativeWindow.enterFullscreen();
	}
	,onPlatformFullScreenChange: function(event) {
		if(this.platform.nativeWindow.fullscreen() == false) this.document.exitFullscreen();
	}
	,open: function(url,name) {
		if(name == null) name = "_blank";
		this.platform.nativeWindow.open(url,name);
	}
	,init: function() {
		this.platform = new cocktail.port.platform.Platform();
		var htmlDocument = new cocktail.core.html.HTMLDocument();
		this.platform.mouse.onMouseDown = $bind(htmlDocument,htmlDocument.onPlatformMouseEvent);
		this.platform.mouse.onMouseUp = $bind(htmlDocument,htmlDocument.onPlatformMouseEvent);
		this.platform.mouse.onMouseMove = $bind(htmlDocument,htmlDocument.onPlatformMouseMoveEvent);
		this.platform.mouse.onMouseWheel = $bind(htmlDocument,htmlDocument.onPlatformMouseWheelEvent);
		this.platform.keyboard.onKeyDown = $bind(htmlDocument,htmlDocument.onPlatformKeyDownEvent);
		this.platform.keyboard.onKeyUp = $bind(htmlDocument,htmlDocument.onPlatformKeyUpEvent);
		this.platform.nativeWindow.onResize = $bind(htmlDocument,htmlDocument.onPlatformResizeEvent);
		htmlDocument.onEnterFullscreen = $bind(this,this.onDocumentEnterFullscreen);
		htmlDocument.onExitFullscreen = $bind(this,this.onDocumentExitFullscreen);
		this.platform.nativeWindow.onFullScreenChange = $bind(this,this.onPlatformFullScreenChange);
		htmlDocument.onSetMouseCursor = $bind(this,this.onDocumentSetMouseCursor);
		this.document = htmlDocument;
	}
	,platform: null
	,innerWidth: null
	,innerHeight: null
	,document: null
	,__class__: cocktail.core.window.Window
	,__properties__: $extend(cocktail.core.event.EventCallback.prototype.__properties__,{get_innerHeight:"get_innerHeight",get_innerWidth:"get_innerWidth"})
});
cocktail.port.platform = {}
cocktail.port.platform.Platform = function() {
	this.mouse = new cocktail.port.server.Mouse();
	this.keyboard = new cocktail.port.server.Keyboard();
	this.nativeWindow = new cocktail.port.server.NativeWindow();
};
$hxClasses["cocktail.port.platform.Platform"] = cocktail.port.platform.Platform;
cocktail.port.platform.Platform.__name__ = ["cocktail","port","platform","Platform"];
cocktail.port.platform.Platform.prototype = {
	nativeWindow: null
	,mouse: null
	,keyboard: null
	,__class__: cocktail.port.platform.Platform
}
cocktail.port.platform.keyboard = {}
cocktail.port.platform.keyboard.AbstractKeyboard = function() {
	this.setNativeListeners();
};
$hxClasses["cocktail.port.platform.keyboard.AbstractKeyboard"] = cocktail.port.platform.keyboard.AbstractKeyboard;
cocktail.port.platform.keyboard.AbstractKeyboard.__name__ = ["cocktail","port","platform","keyboard","AbstractKeyboard"];
cocktail.port.platform.keyboard.AbstractKeyboard.prototype = {
	getKeyData: function(event) {
		return null;
	}
	,removeNativeListeners: function() {
	}
	,setNativeListeners: function() {
	}
	,onNativeKeyUp: function(event) {
		if(this.onKeyUp != null) this.onKeyUp(this.getKeyData(event));
	}
	,onNativeKeyDown: function(event) {
		if(this.onKeyDown != null) this.onKeyDown(this.getKeyData(event));
	}
	,onKeyUp: null
	,onKeyDown: null
	,__class__: cocktail.port.platform.keyboard.AbstractKeyboard
}
cocktail.port.platform.mouse = {}
cocktail.port.platform.mouse.AbstractMouse = function() {
	this.setNativeListeners();
};
$hxClasses["cocktail.port.platform.mouse.AbstractMouse"] = cocktail.port.platform.mouse.AbstractMouse;
cocktail.port.platform.mouse.AbstractMouse.__name__ = ["cocktail","port","platform","mouse","AbstractMouse"];
cocktail.port.platform.mouse.AbstractMouse.prototype = {
	getWheelEvent: function(event) {
		return null;
	}
	,getMouseEvent: function(event) {
		return null;
	}
	,removeNativeListeners: function() {
	}
	,setNativeListeners: function() {
	}
	,onNativeMouseWheel: function(event) {
		if(this.onMouseWheel != null) this.onMouseWheel(this.getWheelEvent(event));
	}
	,onNativeMouseMove: function(event) {
		if(this.onMouseMove != null) this.onMouseMove(this.getMouseEvent(event));
	}
	,onNativeMouseUp: function(event) {
		if(this.onMouseUp != null) this.onMouseUp(this.getMouseEvent(event));
	}
	,onNativeMouseDown: function(event) {
		if(this.onMouseDown != null) this.onMouseDown(this.getMouseEvent(event));
	}
	,setMouseCursor: function(cursor) {
	}
	,onMouseWheel: null
	,onMouseMove: null
	,onMouseUp: null
	,onMouseDown: null
	,__class__: cocktail.port.platform.mouse.AbstractMouse
}
cocktail.port.platform.nativeMedia = {}
cocktail.port.platform.nativeMedia.NativeMedia = function() {
};
$hxClasses["cocktail.port.platform.nativeMedia.NativeMedia"] = cocktail.port.platform.nativeMedia.NativeMedia;
cocktail.port.platform.nativeMedia.NativeMedia.__name__ = ["cocktail","port","platform","nativeMedia","NativeMedia"];
cocktail.port.platform.nativeMedia.NativeMedia.prototype = {
	set_volume: function(value) {
		return value;
	}
	,set_src: function(value) {
		return value;
	}
	,get_duration: function() {
		return 0;
	}
	,get_nativeElement: function() {
		return null;
	}
	,get_width: function() {
		return null;
	}
	,get_height: function() {
		return null;
	}
	,get_currentTime: function() {
		return 0;
	}
	,get_bytesLoaded: function() {
		return 0;
	}
	,get_bytesTotal: function() {
		return 0;
	}
	,onNativeLoadedMetaData: function() {
		if(this.onLoadedMetaData != null) {
			var loaddedMetadataEvent = new cocktail.core.event.Event();
			loaddedMetadataEvent.initEvent("loadedmetadata",false,false);
			this.onLoadedMetaData(loaddedMetadataEvent);
		}
	}
	,canPlayType: function(type) {
		return null;
	}
	,seek: function(time) {
	}
	,pause: function() {
	}
	,play: function() {
	}
	,onLoadedMetaData: null
	,bytesTotal: null
	,bytesLoaded: null
	,nativeElement: null
	,currentTime: null
	,height: null
	,width: null
	,src: null
	,volume: null
	,duration: null
	,__class__: cocktail.port.platform.nativeMedia.NativeMedia
	,__properties__: {get_duration:"get_duration",set_volume:"set_volume",set_src:"set_src",get_width:"get_width",get_height:"get_height",get_currentTime:"get_currentTime",get_nativeElement:"get_nativeElement",get_bytesLoaded:"get_bytesLoaded",get_bytesTotal:"get_bytesTotal"}
}
cocktail.port.platform.nativeWindow = {}
cocktail.port.platform.nativeWindow.AbstractNativeWindow = function() {
	this.setNativeListeners();
};
$hxClasses["cocktail.port.platform.nativeWindow.AbstractNativeWindow"] = cocktail.port.platform.nativeWindow.AbstractNativeWindow;
cocktail.port.platform.nativeWindow.AbstractNativeWindow.__name__ = ["cocktail","port","platform","nativeWindow","AbstractNativeWindow"];
cocktail.port.platform.nativeWindow.AbstractNativeWindow.prototype = {
	get_innerWidth: function() {
		return -1;
	}
	,get_innerHeight: function() {
		return -1;
	}
	,getEvent: function(event) {
		return null;
	}
	,getUIEvent: function(event) {
		return null;
	}
	,removeNativeListeners: function() {
	}
	,setNativeListeners: function() {
	}
	,onNativeFullScreenChange: function(event) {
		if(this.onFullScreenChange != null) this.onFullScreenChange(this.getEvent(event));
	}
	,onNativeResize: function(event) {
		if(this.onResize != null) this.onResize(this.getUIEvent(event));
	}
	,fullscreen: function() {
		return false;
	}
	,fullScreenEnabled: function() {
		return false;
	}
	,exitFullscreen: function() {
	}
	,enterFullscreen: function() {
	}
	,open: function(url,name) {
	}
	,innerWidth: null
	,innerHeight: null
	,onFullScreenChange: null
	,onResize: null
	,__class__: cocktail.port.platform.nativeWindow.AbstractNativeWindow
	,__properties__: {get_innerHeight:"get_innerHeight",get_innerWidth:"get_innerWidth"}
}
cocktail.port.server.FontManagerImpl = function() {
	cocktail.core.font.AbstractFontManagerImpl.call(this);
};
$hxClasses["cocktail.port.server.FontManagerImpl"] = cocktail.port.server.FontManagerImpl;
cocktail.port.server.FontManagerImpl.__name__ = ["cocktail","port","server","FontManagerImpl"];
cocktail.port.server.FontManagerImpl.__super__ = cocktail.core.font.AbstractFontManagerImpl;
cocktail.port.server.FontManagerImpl.prototype = $extend(cocktail.core.font.AbstractFontManagerImpl.prototype,{
	__class__: cocktail.port.server.FontManagerImpl
});
cocktail.port.server.Keyboard = function() {
	cocktail.port.platform.keyboard.AbstractKeyboard.call(this);
};
$hxClasses["cocktail.port.server.Keyboard"] = cocktail.port.server.Keyboard;
cocktail.port.server.Keyboard.__name__ = ["cocktail","port","server","Keyboard"];
cocktail.port.server.Keyboard.__super__ = cocktail.port.platform.keyboard.AbstractKeyboard;
cocktail.port.server.Keyboard.prototype = $extend(cocktail.port.platform.keyboard.AbstractKeyboard.prototype,{
	__class__: cocktail.port.server.Keyboard
});
cocktail.port.server.Mouse = function() {
	cocktail.port.platform.mouse.AbstractMouse.call(this);
};
$hxClasses["cocktail.port.server.Mouse"] = cocktail.port.server.Mouse;
cocktail.port.server.Mouse.__name__ = ["cocktail","port","server","Mouse"];
cocktail.port.server.Mouse.__super__ = cocktail.port.platform.mouse.AbstractMouse;
cocktail.port.server.Mouse.prototype = $extend(cocktail.port.platform.mouse.AbstractMouse.prototype,{
	__class__: cocktail.port.server.Mouse
});
cocktail.port.server.NativeVideo = function() {
	cocktail.port.platform.nativeMedia.NativeMedia.call(this);
};
$hxClasses["cocktail.port.server.NativeVideo"] = cocktail.port.server.NativeVideo;
cocktail.port.server.NativeVideo.__name__ = ["cocktail","port","server","NativeVideo"];
cocktail.port.server.NativeVideo.__super__ = cocktail.port.platform.nativeMedia.NativeMedia;
cocktail.port.server.NativeVideo.prototype = $extend(cocktail.port.platform.nativeMedia.NativeMedia.prototype,{
	__class__: cocktail.port.server.NativeVideo
});
cocktail.port.server.NativeWindow = function() {
	cocktail.port.platform.nativeWindow.AbstractNativeWindow.call(this);
};
$hxClasses["cocktail.port.server.NativeWindow"] = cocktail.port.server.NativeWindow;
cocktail.port.server.NativeWindow.__name__ = ["cocktail","port","server","NativeWindow"];
cocktail.port.server.NativeWindow.__super__ = cocktail.port.platform.nativeWindow.AbstractNativeWindow;
cocktail.port.server.NativeWindow.prototype = $extend(cocktail.port.platform.nativeWindow.AbstractNativeWindow.prototype,{
	__class__: cocktail.port.server.NativeWindow
});
cocktail.port.server.Resource = function(url) {
	cocktail.core.resource.AbstractResource.call(this,url);
};
$hxClasses["cocktail.port.server.Resource"] = cocktail.port.server.Resource;
cocktail.port.server.Resource.__name__ = ["cocktail","port","server","Resource"];
cocktail.port.server.Resource.__super__ = cocktail.core.resource.AbstractResource;
cocktail.port.server.Resource.prototype = $extend(cocktail.core.resource.AbstractResource.prototype,{
	__class__: cocktail.port.server.Resource
});
var org = {}
org.slplayer = {}
org.slplayer.component = {}
org.slplayer.component.ISLPlayerComponent = function() { }
$hxClasses["org.slplayer.component.ISLPlayerComponent"] = org.slplayer.component.ISLPlayerComponent;
org.slplayer.component.ISLPlayerComponent.__name__ = ["org","slplayer","component","ISLPlayerComponent"];
org.slplayer.component.ISLPlayerComponent.prototype = {
	getSLPlayer: null
	,SLPlayerInstanceId: null
	,__class__: org.slplayer.component.ISLPlayerComponent
}
org.slplayer.component.ui = {}
org.slplayer.component.ui.IDisplayObject = function() { }
$hxClasses["org.slplayer.component.ui.IDisplayObject"] = org.slplayer.component.ui.IDisplayObject;
org.slplayer.component.ui.IDisplayObject.__name__ = ["org","slplayer","component","ui","IDisplayObject"];
org.slplayer.component.ui.IDisplayObject.__interfaces__ = [org.slplayer.component.ISLPlayerComponent];
org.slplayer.component.ui.IDisplayObject.prototype = {
	rootElement: null
	,__class__: org.slplayer.component.ui.IDisplayObject
}
org.slplayer.component.ui.DisplayObject = function(rootElement,SLPId) {
	this.rootElement = rootElement;
	org.slplayer.component.SLPlayerComponent.initSLPlayerComponent(this,SLPId);
	org.slplayer.core.Application.get(this.SLPlayerInstanceId).addAssociatedComponent(rootElement,this);
};
$hxClasses["org.slplayer.component.ui.DisplayObject"] = org.slplayer.component.ui.DisplayObject;
org.slplayer.component.ui.DisplayObject.__name__ = ["org","slplayer","component","ui","DisplayObject"];
org.slplayer.component.ui.DisplayObject.__interfaces__ = [org.slplayer.component.ui.IDisplayObject];
org.slplayer.component.ui.DisplayObject.isDisplayObject = function(cmpClass) {
	if(cmpClass == Type.resolveClass("org.slplayer.component.ui.DisplayObject")) return true;
	if(Type.getSuperClass(cmpClass) != null) return org.slplayer.component.ui.DisplayObject.isDisplayObject(Type.getSuperClass(cmpClass));
	return false;
}
org.slplayer.component.ui.DisplayObject.checkFilterOnElt = function(cmpClass,elt) {
	if(elt.nodeType != js.Lib.document.body.nodeType) throw "cannot instantiate " + Type.getClassName(cmpClass) + " on a non element node.";
	var tagFilter = haxe.rtti.Meta.getType(cmpClass) != null?haxe.rtti.Meta.getType(cmpClass).tagNameFilter:null;
	if(tagFilter == null) return;
	if(Lambda.exists(tagFilter,function(s) {
		return elt.nodeName.toLowerCase() == Std.string(s).toLowerCase();
	})) return;
	throw "cannot instantiate " + Type.getClassName(cmpClass) + " on this type of HTML element: " + elt.nodeName.toLowerCase();
}
org.slplayer.component.ui.DisplayObject.prototype = {
	init: function() {
	}
	,getSLPlayer: function() {
		return org.slplayer.component.SLPlayerComponent.getSLPlayer(this);
	}
	,rootElement: null
	,SLPlayerInstanceId: null
	,__class__: org.slplayer.component.ui.DisplayObject
}
var filemanager = {}
filemanager.client = {}
filemanager.client.FileManager = function(rootElement,SLPId) {
	org.slplayer.component.ui.DisplayObject.call(this,rootElement,SLPId);
	this._application = org.slplayer.core.Application.get(SLPId);
};
$hxClasses["filemanager.client.FileManager"] = filemanager.client.FileManager;
filemanager.client.FileManager.__name__ = ["filemanager","client","FileManager"];
filemanager.client.FileManager.__super__ = org.slplayer.component.ui.DisplayObject;
filemanager.client.FileManager.prototype = $extend(org.slplayer.component.ui.DisplayObject.prototype,{
	getListOfFiles: function(folderPath) {
		var _g = this;
		this._filesModel.getFiles(folderPath,function(inData) {
			_g._filesView.setList(inData);
		});
	}
	,showFiles: function(data) {
	}
	,initializeFolders: function(data) {
		var folderTreeViews = filemanager.client.models.Locator.getSLDisplay(this.SLPlayerInstanceId,"FolderTreeView");
		this._foldersView = folderTreeViews[0];
		this._foldersView.injectAppModel(this._filesModel);
		this._foldersView.injectAppManager(this);
		var filesViews = filemanager.client.models.Locator.getSLDisplay(this.SLPlayerInstanceId,"FilesView");
		this._filesView = filesViews[0];
		this._filesView.injectAppModel(this._filesModel);
		data.open = true;
		this._foldersView.initialize(data);
	}
	,showConfirmation: function(b) {
	}
	,showInputOverlay: function(b,title) {
		if(this._dialogPanel == null) {
			this._dialogPanel = new filemanager.client.views.uis.SimpleDialogPanel(this.SLPlayerInstanceId,js.Lib.document.body);
			this._dialogPanel.injectAppModel(this._filesModel);
		}
		if(b) this._dialogPanel.show(title); else this._dialogPanel.hide();
	}
	,initializeAppModel: function() {
		this._filesModel.getTreeFolder("../files",$bind(this,this.initializeFolders));
		this._filesModel.getFiles("../files",$bind(this,this.showFiles));
	}
	,initializeFileDropper: function() {
		var fileDroppers = filemanager.client.models.Locator.getSLDisplay(this.SLPlayerInstanceId,"FileDropper");
		this._fileDropper = fileDroppers[0];
		this._fileDropper.injectAppModel(this._filesModel);
	}
	,initializeUploadStatus: function() {
		var uploadStatus = filemanager.client.models.Locator.getSLDisplay(this.SLPlayerInstanceId,"UploadStatus");
		this._uploadStatus = uploadStatus[0];
		this._uploadStatus.injectAppModel(this._filesModel);
	}
	,initializeToolBox: function() {
		var toolBoxes = filemanager.client.models.Locator.getSLDisplay(this.SLPlayerInstanceId,"ToolBox");
		this._toolBox = toolBoxes[0];
		this._toolBox.injectAppModel(this._filesModel);
		this._toolBox.injectAppManager(this);
	}
	,initializeSelectedPath: function() {
		var selectedPaths = filemanager.client.models.Locator.getSLDisplay(this.SLPlayerInstanceId,"SelectedPath");
		var selectedPath = selectedPaths[0];
		selectedPath.injectAppModel(this._filesModel);
	}
	,init: function() {
		this._filesModel = new filemanager.client.models.FilesModel(this.rootElement);
		this.initializeFileDropper();
		this.initializeUploadStatus();
		this.initializeToolBox();
		this.initializeSelectedPath();
		this.initializeAppModel();
	}
	,_application: null
	,_foldersView: null
	,_filesView: null
	,_fileDropper: null
	,_dialogPanel: null
	,_toolBox: null
	,_uploadStatus: null
	,_folderView: null
	,_filesModel: null
	,__class__: filemanager.client.FileManager
});
filemanager.client.models = {}
filemanager.client.models.FilesModel = function(appRootElement) {
	this._api = new filemanager.client.services.Api();
	this._appDispatcher = appRootElement;
	this._uploadsQueue = new Hash();
};
$hxClasses["filemanager.client.models.FilesModel"] = filemanager.client.models.FilesModel;
filemanager.client.models.FilesModel.__name__ = ["filemanager","client","models","FilesModel"];
filemanager.client.models.FilesModel.prototype = {
	setFolderOfDroppedFile: function(folder,onUpdateFoldersStates) {
		var _g = this;
		this._targetFolder = folder;
		var result = this._api.moveFileToFolder(this._selectedFile.path,this._selectedFile.name,this._targetFolder.path,function(sucess) {
			_g.getTreeFolder("../files",onUpdateFoldersStates);
		});
	}
	,setDraggedFile: function(file) {
		this._selectedFile = file;
		this.dispatchUpdate();
	}
	,dispatchUpdate: function() {
		var event = js.Lib.document.createEvent("CustomEvent");
		event.initCustomEvent("pathUpdate",false,false,this._appDispatcher);
		this._appDispatcher.dispatchEvent(event);
	}
	,get_appDispatcher: function() {
		return this._appDispatcher;
	}
	,get_selectedFile: function() {
		return this._selectedFile;
	}
	,set_selectedFolder: function(value) {
		var lastCharacter = HxOverrides.substr(value,value.length - 1,1);
		this._selectedFile = null;
		this._selectedFolderPath = value;
		if(lastCharacter != "/") this._selectedFolderPath += "/";
		this.dispatchUpdate();
		return this._selectedFolderPath;
	}
	,get_selectedFolder: function() {
		return this._selectedFolderPath;
	}
	,onCancelUpload: function(trackID) {
		haxe.Log.trace("FilesModel - onCancelUpload() " + trackID,{ fileName : "FilesModel.hx", lineNumber : 241, className : "filemanager.client.models.FilesModel", methodName : "onCancelUpload"});
	}
	,createNewFolder: function(folderName) {
	}
	,renameFile: function(filePath,newName) {
		this._api.renameFile(filePath,newName,function(success) {
			haxe.Log.trace("FilesModel - renameFile() -- on  successfully renamed a file or folder " + Std.string(success),{ fileName : "FilesModel.hx", lineNumber : 225, className : "filemanager.client.models.FilesModel", methodName : "renameFile"});
		});
	}
	,pasteFile: function(newPath) {
	}
	,copyFile: function(filePath) {
	}
	,moveFile: function(filePath,newPath) {
	}
	,deleteFile: function(filePath) {
	}
	,validateFileName: function(filename) {
		filename = StringTools.replace(filename," ","");
		filename = StringTools.replace(filename,"$","");
		filename = StringTools.replace(filename,"+","");
		return filename;
	}
	,handleUploadProgress: function(msg) {
		var _g = this;
		var response = haxe.Json.parse(msg.data);
		haxe.Log.trace("FilesModel - handleUploadProgress() " + Std.string(response.destination) + " // " + Std.string(response.result.filename),{ fileName : "FilesModel.hx", lineNumber : 171, className : "filemanager.client.models.FilesModel", methodName : "handleUploadProgress"});
		switch(response.type) {
		case "progress":
			this._uploadsQueue.get(response.result.filename).progressPercent = response.result.percentuploaded;
			this.onUploadUpdate(this._uploadsQueue.get(response.result.filename));
			break;
		case "completed":
			var tempFile = response.result.filename;
			this._api.deleteTempFile(response.result.filename,function(file) {
				_g.onUploadUpdate(_g._uploadsQueue.get(response.result.filename));
			});
			this._uploadsQueue.get(response.result.filename).completed = true;
			this.onUploadUpdate(this._uploadsQueue.get(response.result.filename));
			break;
		case "started":
			this._uploadsQueue.get(response.result.filename).started = true;
			this.onUploadUpdate(this._uploadsQueue.get(response.result.filename));
			break;
		case "error":
			haxe.Log.trace("FilesModel - handleUploadProgress() - response: error " + Std.string(response.error),{ fileName : "FilesModel.hx", lineNumber : 192, className : "filemanager.client.models.FilesModel", methodName : "handleUploadProgress"});
			break;
		}
	}
	,handleUploadInitialized: function(response) {
		if(this._uploadsQueue.exists(response.filepath)) {
			var uploadWorker = new Worker("fileupload.js");
			uploadWorker.onmessage = $bind(this,this.handleUploadProgress);
			uploadWorker.onerror = $bind(this,this.handleError);
			var dataMsg = { file : this._uploadsQueue.get(response.filepath).file, validName : this.validateFileName(this._uploadsQueue.get(response.filepath).file.name), destination : this._selectedFolderPath};
			uploadWorker.postMessage(dataMsg);
		}
	}
	,uploadSelectedFiles: function(files) {
		var _g = 0;
		while(_g < files.length) {
			var file = files[_g];
			++_g;
			var fileToUpload = { file : file, validateFileName : this.validateFileName(file.name), initialized : false, progressPercent : 0, completed : false, started : false};
			this._uploadsQueue.set(this.validateFileName(file.name),fileToUpload);
		}
		var $it0 = this._uploadsQueue.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			var filehelper = this._uploadsQueue.get(key);
			if(!filehelper.initialized) {
				this._api.backupAsTemporary(filehelper.validateFileName,$bind(this,this.handleUploadInitialized));
				this._uploadsQueue.get(filehelper.validateFileName).initialized = true;
				this.onUploadUpdate(this._uploadsQueue.get(filehelper.validateFileName));
			}
		}
	}
	,browseFiles: function(evt) {
	}
	,getFiles: function(folderpath,onSuccess) {
		this._api.getFiles(folderpath,onSuccess);
	}
	,getTreeFolder: function(folderpath,onSuccess) {
		this._api.getTreeFolder(folderpath,onSuccess);
	}
	,handleError: function(e) {
		haxe.Log.trace("FilesModel - handleError() ERROR: Line " + Std.string(e.lineno) + " in " + Std.string(e.filename) + ": " + Std.string(e.message),{ fileName : "FilesModel.hx", lineNumber : 86, className : "filemanager.client.models.FilesModel", methodName : "handleError"});
	}
	,_appDispatcher: null
	,_targetFolder: null
	,_selectedFile: null
	,selectedFile: null
	,appDispatcher: null
	,selectedFolder: null
	,_selectedFolderPath: null
	,onUploadUpdate: null
	,_uploadsQueue: null
	,_api: null
	,__class__: filemanager.client.models.FilesModel
	,__properties__: {set_selectedFolder:"set_selectedFolder",get_selectedFolder:"get_selectedFolder",get_appDispatcher:"get_appDispatcher",get_selectedFile:"get_selectedFile"}
}
filemanager.client.models.Locator = function() { }
$hxClasses["filemanager.client.models.Locator"] = filemanager.client.models.Locator;
filemanager.client.models.Locator.__name__ = ["filemanager","client","models","Locator"];
filemanager.client.models.Locator.instance = null;
filemanager.client.models.Locator.getInstance = function(slPlayerID) {
	if(filemanager.client.models.Locator.instance == null) filemanager.client.models.Locator.instance = new Hash();
	if(!filemanager.client.models.Locator.instance.exists(slPlayerID)) {
		var appLocator = { slDisplays : new Hash()};
		filemanager.client.models.Locator.instance.set(slPlayerID,appLocator);
	}
	return filemanager.client.models.Locator.instance.get(slPlayerID);
}
filemanager.client.models.Locator.registerSLDisplay = function(slPlayerID,displayObjInstance,className) {
	if(!filemanager.client.models.Locator.getInstance(slPlayerID).slDisplays.exists(className)) filemanager.client.models.Locator.getInstance(slPlayerID).slDisplays.set(className,new Array());
	filemanager.client.models.Locator.getInstance(slPlayerID).slDisplays.get(className).push(displayObjInstance);
}
filemanager.client.models.Locator.getSLDisplay = function(slPlayerID,className) {
	if(filemanager.client.models.Locator.getInstance(slPlayerID).slDisplays.exists(className)) return filemanager.client.models.Locator.getInstance(slPlayerID).slDisplays.get(className); else return new Array();
}
filemanager.client.services = {}
filemanager.client.services.Api = function() {
};
$hxClasses["filemanager.client.services.Api"] = filemanager.client.services.Api;
filemanager.client.services.Api.__name__ = ["filemanager","client","services","Api"];
filemanager.client.services.Api.prototype = {
	defaultOnError: function(err) {
		haxe.Log.trace("Error (API default error handler) : " + Std.string(err),{ fileName : "Api.hx", lineNumber : 103, className : "filemanager.client.services.Api", methodName : "defaultOnError"});
	}
	,renameFile: function(filePath,newName,onSuccess,onError) {
		haxe.Log.trace("Api - renameFile() " + filePath + " // " + newName,{ fileName : "Api.hx", lineNumber : 96, className : "filemanager.client.services.Api", methodName : "renameFile"});
	}
	,moveFileToFolder: function(filePath,fileName,folderPath,onSuccess,onError) {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect("server/index.php");
		if(onError != null) cnx.setErrorHandler(onError); else cnx.setErrorHandler($bind(this,this.defaultOnError));
		cnx.resolve("api").resolve("moveFileToFolder").call([filePath,fileName,folderPath],onSuccess);
	}
	,deleteTempFile: function(fullpath,onSuccess,onError) {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect("server/index.php");
		if(onError != null) cnx.setErrorHandler(onError); else cnx.setErrorHandler($bind(this,this.defaultOnError));
		cnx.resolve("api").resolve("deleteTempFile").call([fullpath],onSuccess);
	}
	,backupAsTemporary: function(fullpath,onSuccess,onError) {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect("server/index.php");
		if(onError != null) cnx.setErrorHandler(onError); else cnx.setErrorHandler($bind(this,this.defaultOnError));
		cnx.resolve("api").resolve("backupAsTemporary").call([fullpath],onSuccess);
	}
	,getFiles: function(folderpath,onSuccess,onError) {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect("server/index.php");
		if(onError != null) cnx.setErrorHandler(onError); else cnx.setErrorHandler($bind(this,this.defaultOnError));
		cnx.resolve("api").resolve("getFiles").call([folderpath],onSuccess);
	}
	,getTreeFolder: function(folderpath,onSuccess,onError) {
		var cnx = haxe.remoting.HttpAsyncConnection.urlConnect("server/index.php");
		if(onError != null) cnx.setErrorHandler(onError); else cnx.setErrorHandler($bind(this,this.defaultOnError));
		cnx.resolve("api").resolve("getTreeFolder").call([folderpath],onSuccess);
	}
	,__class__: filemanager.client.services.Api
}
filemanager.client.views = {}
filemanager.client.views.base = {}
filemanager.client.views.base.View = function(rootElement,SLPId) {
	org.slplayer.component.ui.DisplayObject.call(this,rootElement,SLPId);
};
$hxClasses["filemanager.client.views.base.View"] = filemanager.client.views.base.View;
filemanager.client.views.base.View.__name__ = ["filemanager","client","views","base","View"];
filemanager.client.views.base.View.__super__ = org.slplayer.component.ui.DisplayObject;
filemanager.client.views.base.View.prototype = $extend(org.slplayer.component.ui.DisplayObject.prototype,{
	clear: function() {
		var childNodes = this.rootElement.childNodes.length;
		while(this.rootElement.hasChildNodes()) {
			var child = this.rootElement.childNodes[0];
			this.rootElement.removeChild(child);
		}
	}
	,__class__: filemanager.client.views.base.View
});
filemanager.client.views.DetailView = function(rootElement,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"DetailView");
	filemanager.client.views.base.View.call(this,rootElement,SLPId);
};
$hxClasses["filemanager.client.views.DetailView"] = filemanager.client.views.DetailView;
filemanager.client.views.DetailView.__name__ = ["filemanager","client","views","DetailView"];
filemanager.client.views.DetailView.__super__ = filemanager.client.views.base.View;
filemanager.client.views.DetailView.prototype = $extend(filemanager.client.views.base.View.prototype,{
	init: function() {
		this.rootElement.innerHTML = "Detail View";
		filemanager.client.views.base.View.prototype.init.call(this);
	}
	,_filesModel: null
	,__class__: filemanager.client.views.DetailView
});
filemanager.client.views.FileDropper = function(rootElement,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"FileDropper");
	rootElement.className = "fileDropper noMargin";
	var instruction = js.Lib.document.createElement("p");
	instruction.className = "dropText mediumFont";
	var txtInstruc = js.Lib.document.createTextNode("Drop your files here");
	rootElement.appendChild(instruction);
	instruction.appendChild(txtInstruc);
	rootElement.addEventListener("dragover",$bind(this,this.handleDragOver),false);
	rootElement.addEventListener("drop",$bind(this,this.handleFileSelect),false);
	filemanager.client.views.base.View.call(this,rootElement,SLPId);
};
$hxClasses["filemanager.client.views.FileDropper"] = filemanager.client.views.FileDropper;
filemanager.client.views.FileDropper.__name__ = ["filemanager","client","views","FileDropper"];
filemanager.client.views.FileDropper.__super__ = filemanager.client.views.base.View;
filemanager.client.views.FileDropper.prototype = $extend(filemanager.client.views.base.View.prototype,{
	injectAppModel: function(filesModel) {
		this._filesModel = filesModel;
	}
	,handleFileSelect: function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		this._filesModel.uploadSelectedFiles(evt.dataTransfer.files);
	}
	,handleDragOver: function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = "copy";
	}
	,_filesModel: null
	,__class__: filemanager.client.views.FileDropper
});
filemanager.client.views.FilesView = function(rootElement,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"FilesView");
	filemanager.client.views.base.View.call(this,rootElement,SLPId);
};
$hxClasses["filemanager.client.views.FilesView"] = filemanager.client.views.FilesView;
filemanager.client.views.FilesView.__name__ = ["filemanager","client","views","FilesView"];
filemanager.client.views.FilesView.__super__ = filemanager.client.views.base.View;
filemanager.client.views.FilesView.prototype = $extend(filemanager.client.views.base.View.prototype,{
	injectAppModel: function(filesModel) {
		this._filesModel = filesModel;
	}
	,handleFileDragged: function(file,evt) {
		this._filesModel.setDraggedFile(file);
	}
	,setList: function(data) {
		this.clear();
		var _g1 = 0, _g = data.length;
		while(_g1 < _g) {
			var i = _g1++;
			var file = new filemanager.client.views.uis.FileUI(data[i],this.SLPlayerInstanceId);
			this.rootElement.appendChild(file.rootElement);
			var draggedCallBack = (function(f,a1) {
				return function(a2) {
					return f(a1,a2);
				};
			})($bind(this,this.handleFileDragged),data[i]);
			file.rootElement.addEventListener("dragEventDrag",draggedCallBack,false);
		}
	}
	,_filesModel: null
	,__class__: filemanager.client.views.FilesView
});
filemanager.client.views.FolderTreeView = function(rootElement,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"FolderTreeView");
	filemanager.client.views.base.View.call(this,rootElement,SLPId);
	this._folderStatus = new Hash();
};
$hxClasses["filemanager.client.views.FolderTreeView"] = filemanager.client.views.FolderTreeView;
filemanager.client.views.FolderTreeView.__name__ = ["filemanager","client","views","FolderTreeView"];
filemanager.client.views.FolderTreeView.__super__ = filemanager.client.views.base.View;
filemanager.client.views.FolderTreeView.prototype = $extend(filemanager.client.views.base.View.prototype,{
	injectAppManager: function(fileManager) {
		this._fileManager = fileManager;
	}
	,injectAppModel: function(filesModel) {
		this._filesModel = filesModel;
	}
	,update: function(data) {
		this._data = data;
		this._rootFolder.refresh();
	}
	,init: function() {
	}
	,initialize: function(data) {
		this._data = data;
		this._filesModel.set_selectedFolder(data.path);
		this._fileManager.getListOfFiles(data.path);
		this.buildView();
	}
	,handleFileDropped: function(folderData,folderUI,evt) {
		this._filesModel.setFolderOfDroppedFile(folderData,$bind(this,this.update));
		folderUI.clear();
		folderUI.refresh(true);
	}
	,handleOnFolderClick: function(target,folderData,evt) {
		target.isOpen = !target.isOpen;
		if(this._currentFolderUISelected != null && this._currentFolderUISelected != target) {
			this._currentFolderUISelected.isSelected = false;
			this._currentFolderUISelected.refresh();
		}
		target.isSelected = true;
		this._currentFolderUISelected = target;
		var folderPath = folderData.path;
		this._folderStatus.set(folderPath,target.isOpen);
		folderData.open = target.isOpen;
		target.refresh();
		this._filesModel.set_selectedFolder(folderPath);
		this._fileManager.getListOfFiles(folderPath);
	}
	,updateEmptiness: function(currentFolder,target,inDescendant) {
	}
	,makeInteractive: function(folder,data) {
		var handelClickCallback = (function(f,a1,a2) {
			return function(a3) {
				return f(a1,a2,a3);
			};
		})($bind(this,this.handleOnFolderClick),folder,data);
		folder.rootElement.onclick = handelClickCallback;
		var droppedCallBack = (function(f,a1,a2) {
			return function(a3) {
				return f(a1,a2,a3);
			};
		})($bind(this,this.handleFileDropped),data,folder);
		folder.rootElement.addEventListener("dragEventDropped",droppedCallBack,false);
	}
	,createSubFolders: function(currentFolder,target,inDescendant) {
		var _g1 = 0, _g = currentFolder.childFolders.length;
		while(_g1 < _g) {
			var i = _g1++;
			var child = currentFolder.childFolders[i];
			var childPath = child.path + "/" + child.name;
			target.isOpen = this._folderStatus.exists(childPath)?this._folderStatus.get(childPath):target.isOpen;
			var folderChild = new filemanager.client.views.uis.FolderUI(child.children > 0,inDescendant,child.name,this.SLPlayerInstanceId);
			target.subFolders.push(folderChild);
			this.rootElement.appendChild(folderChild.rootElement);
			folderChild.isVisible = target.isOpen;
			folderChild.isOpen = child.open;
			this.makeInteractive(folderChild,child);
			this.createSubFolders(child,folderChild,inDescendant + 1);
		}
	}
	,buildView: function() {
		var isOpen = true;
		this._rootFolder = new filemanager.client.views.uis.FolderUI(this._data.children > 0,0,this._data.name,this.SLPlayerInstanceId);
		var folderPath = this._data.path + "/" + this._data.name;
		this._folderStatus.set(folderPath,isOpen);
		this.makeInteractive(this._rootFolder,this._data);
		this.rootElement.appendChild(this._rootFolder.rootElement);
		this.createSubFolders(this._data,this._rootFolder,1);
		this.handleOnFolderClick(this._rootFolder,this._data,null);
	}
	,_fileManager: null
	,_filesModel: null
	,_currentFolderUISelected: null
	,_folderStatus: null
	,_data: null
	,_rootFolder: null
	,__class__: filemanager.client.views.FolderTreeView
});
filemanager.client.views.SelectedPath = function(rootElement,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"SelectedPath");
	filemanager.client.views.base.View.call(this,rootElement,SLPId);
};
$hxClasses["filemanager.client.views.SelectedPath"] = filemanager.client.views.SelectedPath;
filemanager.client.views.SelectedPath.__name__ = ["filemanager","client","views","SelectedPath"];
filemanager.client.views.SelectedPath.__super__ = filemanager.client.views.base.View;
filemanager.client.views.SelectedPath.prototype = $extend(filemanager.client.views.base.View.prototype,{
	handleSelectedPathUpdated: function(e) {
		this.rootElement.innerHTML = this._filesModel.get_selectedFile() != null?this._filesModel.get_selectedFile().path:this._filesModel.get_selectedFolder();
	}
	,injectAppModel: function(filesModel) {
		this._filesModel = filesModel;
		this._filesModel.get_appDispatcher().addEventListener("pathUpdate",$bind(this,this.handleSelectedPathUpdated),false);
	}
	,_filesModel: null
	,__class__: filemanager.client.views.SelectedPath
});
filemanager.client.views.TitleTopBar = function(rootElement,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"TitleTopBar");
	filemanager.client.views.base.View.call(this,rootElement,SLPId);
};
$hxClasses["filemanager.client.views.TitleTopBar"] = filemanager.client.views.TitleTopBar;
filemanager.client.views.TitleTopBar.__name__ = ["filemanager","client","views","TitleTopBar"];
filemanager.client.views.TitleTopBar.__super__ = filemanager.client.views.base.View;
filemanager.client.views.TitleTopBar.prototype = $extend(filemanager.client.views.base.View.prototype,{
	init: function() {
		this.rootElement.innerHTML = "Silex Media Center";
		filemanager.client.views.base.View.prototype.init.call(this);
	}
	,_filesModel: null
	,__class__: filemanager.client.views.TitleTopBar
});
filemanager.client.views.ToolBox = function(rootElement,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"ToolBox");
	rootElement.className = "toolBox smallFont";
	filemanager.client.views.base.View.call(this,rootElement,SLPId);
};
$hxClasses["filemanager.client.views.ToolBox"] = filemanager.client.views.ToolBox;
filemanager.client.views.ToolBox.__name__ = ["filemanager","client","views","ToolBox"];
filemanager.client.views.ToolBox.__super__ = filemanager.client.views.base.View;
filemanager.client.views.ToolBox.prototype = $extend(filemanager.client.views.base.View.prototype,{
	handleSelectedPathUpdated: function(e) {
		var selectedPathIsFile = this._filesModel.get_selectedFile() != null?true:false;
		this._download.set_enabled(selectedPathIsFile);
	}
	,injectAppManager: function(filesManager) {
		this._filesManager = filesManager;
	}
	,injectAppModel: function(filesModel) {
		this._filesModel = filesModel;
		this._filesModel.get_appDispatcher().addEventListener("pathUpdate",$bind(this,this.handleSelectedPathUpdated),false);
	}
	,onClickedToolBox: function(buttonId) {
		switch(buttonId) {
		case "CreateFolderButton":
			this._filesManager.showInputOverlay(true,"Folder's name");
			break;
		case "DownloadButton":
			break;
		case "CopyButton":
			break;
		case "DeleteButton":
			break;
		case "PasteButton":
			break;
		case "RenameButton":
			var title = this._filesModel.get_selectedFile() != null?"New file's name: ":"New directory's name";
			this._filesManager.showInputOverlay(true,title);
			break;
		}
	}
	,init: function() {
		this._download = new filemanager.client.views.uis.buttons.DownloadButton("Download",this.SLPlayerInstanceId);
		this._copy = new filemanager.client.views.uis.buttons.CopyButton("Copy",this.SLPlayerInstanceId);
		this._paste = new filemanager.client.views.uis.buttons.PasteButton("Paste",this.SLPlayerInstanceId);
		this._delete = new filemanager.client.views.uis.buttons.DeleteButton("Delete",this.SLPlayerInstanceId);
		this._rename = new filemanager.client.views.uis.buttons.RenameButton("Rename",this.SLPlayerInstanceId);
		this._createFolder = new filemanager.client.views.uis.buttons.CreateFolderButton("Create New Folder",this.SLPlayerInstanceId);
		this.rootElement.appendChild(this._download.rootElement);
		this.rootElement.appendChild(this._copy.rootElement);
		this.rootElement.appendChild(this._paste.rootElement);
		this.rootElement.appendChild(this._delete.rootElement);
		this.rootElement.appendChild(this._createFolder.rootElement);
		this.rootElement.appendChild(this._rename.rootElement);
		this._download.onButtonClicked = $bind(this,this.onClickedToolBox);
		this._copy.onButtonClicked = $bind(this,this.onClickedToolBox);
		this._paste.onButtonClicked = $bind(this,this.onClickedToolBox);
		this._delete.onButtonClicked = $bind(this,this.onClickedToolBox);
		this._createFolder.onButtonClicked = $bind(this,this.onClickedToolBox);
		this._rename.onButtonClicked = $bind(this,this.onClickedToolBox);
	}
	,_filesManager: null
	,_filesModel: null
	,_rename: null
	,_createFolder: null
	,_delete: null
	,_paste: null
	,_copy: null
	,_download: null
	,__class__: filemanager.client.views.ToolBox
});
filemanager.client.views.UploadStatus = function(rootElement,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"UploadStatus");
	rootElement.className = "uploadStatus smallFont";
	this._currentQueueUIs = new Hash();
	filemanager.client.views.base.View.call(this,rootElement,SLPId);
};
$hxClasses["filemanager.client.views.UploadStatus"] = filemanager.client.views.UploadStatus;
filemanager.client.views.UploadStatus.__name__ = ["filemanager","client","views","UploadStatus"];
filemanager.client.views.UploadStatus.__super__ = filemanager.client.views.base.View;
filemanager.client.views.UploadStatus.prototype = $extend(filemanager.client.views.base.View.prototype,{
	injectAppModel: function(filesModel) {
		this._filesModel = filesModel;
		this._filesModel.onUploadUpdate = $bind(this,this.onUpdate);
	}
	,onUpdate: function(uploadUpdate) {
		if(!this._currentQueueUIs.exists(uploadUpdate.file.name)) {
			var fileUploadStatus = new filemanager.client.views.uis.FileUploadStatus(uploadUpdate,this.SLPlayerInstanceId);
			this._currentQueueUIs.set(uploadUpdate.file.name,fileUploadStatus);
			fileUploadStatus.set_onCancelUpload(($_=this._filesModel,$bind($_,$_.onCancelUpload)));
			this.rootElement.appendChild(fileUploadStatus.rootElement);
		}
		var fileName = uploadUpdate.file.name;
		this._currentQueueUIs.get(fileName).update(uploadUpdate);
	}
	,init: function() {
	}
	,_currentQueueUIs: null
	,_filesModel: null
	,__class__: filemanager.client.views.UploadStatus
});
filemanager.client.views.base.LabelButton = function(label,SLPId) {
	var viewDom = js.Lib.document.createElement("div");
	viewDom.onclick = $bind(this,this.handleClick);
	viewDom.onmouseover = $bind(this,this.handleMouseOver);
	viewDom.onmouseout = $bind(this,this.handleMouseOut);
	var label1 = js.Lib.document.createTextNode(label);
	viewDom.appendChild(label1);
	filemanager.client.views.base.View.call(this,viewDom,SLPId);
};
$hxClasses["filemanager.client.views.base.LabelButton"] = filemanager.client.views.base.LabelButton;
filemanager.client.views.base.LabelButton.__name__ = ["filemanager","client","views","base","LabelButton"];
filemanager.client.views.base.LabelButton.__super__ = filemanager.client.views.base.View;
filemanager.client.views.base.LabelButton.prototype = $extend(filemanager.client.views.base.View.prototype,{
	set_enabled: function(value) {
		this._enabled = value;
		this.rootElement.style.border = this._enabled == true?"1px solid #61c4ea":"1px solid #888888";
		this.rootElement.style.backgroundColor = this._enabled == true?"#7cceee":"#aaaaaa";
		this.rootElement.style.cursor = this._enabled?cocktail.core.unit.UnitManager.getCSSCursor(cocktail.core.style.Cursor.pointer):null;
		return this._enabled = value;
	}
	,get_enabled: function() {
		return this._enabled;
	}
	,handleMouseOut: function(e) {
		if(this._enabled) {
			this.rootElement.style.border = "1px solid #61c4ea";
			this.rootElement.style.backgroundColor = "#7cceee";
		}
	}
	,handleMouseOver: function(e) {
		if(this._enabled) {
			this.rootElement.style.border = "1px solid #4bb3db";
			this.rootElement.style.backgroundColor = "#5fbadd";
		}
	}
	,handleClick: function(e) {
		if(this.onclicked != null && this._enabled) this.onclicked(e);
	}
	,enabled: null
	,_enabled: null
	,onclicked: null
	,__class__: filemanager.client.views.base.LabelButton
	,__properties__: {set_enabled:"set_enabled",get_enabled:"get_enabled"}
});
filemanager.client.views.uis = {}
filemanager.client.views.uis.FileUI = function(data,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"FileUI");
	var viewDom = js.Lib.document.createElement("div");
	var nameFile = js.Lib.document.createTextNode(data.name);
	viewDom.appendChild(nameFile);
	viewDom.className = "fileUI smallFont";
	filemanager.client.views.base.View.call(this,viewDom,SLPId);
	this.setStyle(data);
	this.makeDraggable();
};
$hxClasses["filemanager.client.views.uis.FileUI"] = filemanager.client.views.uis.FileUI;
filemanager.client.views.uis.FileUI.__name__ = ["filemanager","client","views","uis","FileUI"];
filemanager.client.views.uis.FileUI.__super__ = filemanager.client.views.base.View;
filemanager.client.views.uis.FileUI.prototype = $extend(filemanager.client.views.base.View.prototype,{
	setStyle: function(data) {
		this.rootElement.style.cursor = cocktail.core.unit.UnitManager.getCSSCursor(cocktail.core.style.Cursor.pointer);
		this.rootElement.style.backgroundImage = "url('imgs/icons/" + data.extension + ".png')";
	}
	,makeDraggable: function() {
		var draggable = new org.slplayer.component.interaction.Draggable(this.rootElement,this.SLPlayerInstanceId);
		draggable.init();
	}
	,__class__: filemanager.client.views.uis.FileUI
});
filemanager.client.views.uis.FileUploadStatus = function(data,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"FileUploadStatus");
	var viewDom = js.Lib.document.createElement("div");
	viewDom.className = "fileUploadStatus smallFont";
	this._fileName = js.Lib.document.createElement("div");
	this._fileName.className = "titleTrack";
	this._fileName.appendChild(js.Lib.document.createTextNode(data.file.name));
	this._status = "Pending";
	this._statusUpload = js.Lib.document.createElement("div");
	this._statusUpload.className = "noMargin statusTxt";
	this._statusUpload.innerHTML = "Pending";
	this._progressBar = new filemanager.client.views.uis.ProgressBar(SLPId);
	this._cancel = new filemanager.client.views.uis.buttons.CancelUploadButton("Cancel",SLPId,data.validateFileName);
	viewDom.appendChild(this._fileName);
	viewDom.appendChild(this._progressBar.rootElement);
	viewDom.appendChild(this._statusUpload);
	viewDom.appendChild(this._cancel.rootElement);
	filemanager.client.views.base.View.call(this,viewDom,SLPId);
};
$hxClasses["filemanager.client.views.uis.FileUploadStatus"] = filemanager.client.views.uis.FileUploadStatus;
filemanager.client.views.uis.FileUploadStatus.__name__ = ["filemanager","client","views","uis","FileUploadStatus"];
filemanager.client.views.uis.FileUploadStatus.__super__ = filemanager.client.views.base.View;
filemanager.client.views.uis.FileUploadStatus.prototype = $extend(filemanager.client.views.base.View.prototype,{
	onCancelUpload: null
	,set_onCancelUpload: function(value) {
		this._onCancelUpload = value;
		if(this._cancel != null) this._cancel.requestCancelUpload = value;
		return this._onCancelUpload;
	}
	,updateStatus: function(value) {
		if(value != this._status) {
			this._statusUpload.innerHTML = value;
			this._status = value;
		}
	}
	,update: function(uploadUpdate) {
		this._progressBar.set_value(uploadUpdate.progressPercent);
		if(uploadUpdate.initialized == true && uploadUpdate.completed == false) {
			this.updateStatus("Progress");
			this._cancel.set_enabled(true);
		} else if(uploadUpdate.initialized == false && uploadUpdate.completed == false) {
			this.updateStatus("Pending");
			this._cancel.set_enabled(true);
		} else if(uploadUpdate.initialized == true && uploadUpdate.completed == true) {
			this.updateStatus("Complete");
			this._cancel.set_enabled(false);
		}
	}
	,_onCancelUpload: null
	,_status: null
	,_cancel: null
	,_statusUpload: null
	,_fileName: null
	,_progressBar: null
	,__class__: filemanager.client.views.uis.FileUploadStatus
	,__properties__: {set_onCancelUpload:"set_onCancelUpload"}
});
filemanager.client.views.uis.FolderUI = function(isFull,isDescendant,inTitle,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"FolderUI");
	var viewDom = js.Lib.document.createElement("div");
	this._title = inTitle;
	this._isFull = isFull;
	this._isDescendant = isDescendant;
	this.isSelected = this.isOpen = false;
	this.isVisible = true;
	this.subFolders = new Array();
	filemanager.client.views.base.View.call(this,viewDom,SLPId);
};
$hxClasses["filemanager.client.views.uis.FolderUI"] = filemanager.client.views.uis.FolderUI;
filemanager.client.views.uis.FolderUI.__name__ = ["filemanager","client","views","uis","FolderUI"];
filemanager.client.views.uis.FolderUI.__super__ = filemanager.client.views.base.View;
filemanager.client.views.uis.FolderUI.prototype = $extend(filemanager.client.views.base.View.prototype,{
	refresh: function(isFull) {
		if(isFull != null) this._isFull = isFull;
		this.setStyle();
	}
	,setStyle: function() {
		this.clear();
		if(!this.isVisible) {
			this.rootElement.style.height = "0px";
			this.isSelected = false;
			var _g1 = 0, _g = this.subFolders.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.subFolders[i].isVisible = false;
				this.subFolders[i].refresh();
			}
			return;
		} else {
			var _g1 = 0, _g = this.subFolders.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.subFolders[i].isVisible = this.isOpen;
				this.subFolders[i].refresh();
			}
		}
		switch(true) {
		case this.isSelected == true && this._isFull == true && this.isOpen == true:
			this.rootElement.style.backgroundImage = "url('imgs/selected_open_full.png')";
			break;
		case this.isSelected == true && this._isFull == false && this.isOpen == true:
			this.rootElement.style.backgroundImage = "url('imgs/selected_open_empty.png')";
			break;
		case this.isSelected == true && this._isFull == false && this.isOpen == false:
			this.rootElement.style.backgroundImage = "url('imgs/selected_closed_empty.png')";
			break;
		case this.isSelected == true && this._isFull == true && this.isOpen == false:
			this.rootElement.style.backgroundImage = "url('imgs/selected_closed_full.png')";
			break;
		case this.isSelected == false && this._isFull == true && this.isOpen == true:
			this.rootElement.style.backgroundImage = "url('imgs/notselected_open_full.png')";
			break;
		case this.isSelected == false && this._isFull == true && this.isOpen == false:
			this.rootElement.style.backgroundImage = "url('imgs/notselected_closed_full.png')";
			break;
		case this.isSelected == false && this._isFull == false && this.isOpen == false:
			this.rootElement.style.backgroundImage = "url('imgs/notselected_closed_empty.png')";
			break;
		case this.isSelected == false && this._isFull == false && this.isOpen == true:
			this.rootElement.style.backgroundImage = "url('imgs/notselected_open_empty.png')";
			break;
		}
		var title = js.Lib.document.createTextNode(this._title);
		this.rootElement.appendChild(title);
		this.rootElement.className = "draggable-dropzone folderUI";
		this.rootElement.style.cursor = cocktail.core.unit.UnitManager.getCSSCursor(cocktail.core.style.Cursor.pointer);
		this.rootElement.style.height = null;
		this.rootElement.style.marginLeft = Std.string(5 + this._isDescendant * 20 + "px");
	}
	,subFolders: null
	,isVisible: null
	,isSelected: null
	,isOpen: null
	,_isDescendant: null
	,_isFull: null
	,_title: null
	,__class__: filemanager.client.views.uis.FolderUI
});
filemanager.client.views.uis.ProgressBar = function(SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"ProgressBar");
	var viewDom = js.Lib.document.createElement("div");
	viewDom.className = "progressBar";
	this._bar = js.Lib.document.createElement("div");
	this._bar.className = "bar";
	viewDom.appendChild(this._bar);
	filemanager.client.views.base.View.call(this,viewDom,SLPId);
};
$hxClasses["filemanager.client.views.uis.ProgressBar"] = filemanager.client.views.uis.ProgressBar;
filemanager.client.views.uis.ProgressBar.__name__ = ["filemanager","client","views","uis","ProgressBar"];
filemanager.client.views.uis.ProgressBar.__super__ = filemanager.client.views.base.View;
filemanager.client.views.uis.ProgressBar.prototype = $extend(filemanager.client.views.base.View.prototype,{
	value: null
	,getFullBarWidth: function() {
		return this.rootElement.clientWidth - (this._bar.offsetLeft - this.rootElement.offsetLeft) * 4;
	}
	,set_value: function(percent) {
		if(this._fullBarWidth == null) this._fullBarWidth = this.getFullBarWidth();
		this._value = percent;
		this._bar.style.width = this._value * this._fullBarWidth + "px";
		return this.get_value();
	}
	,get_value: function() {
		return this._value;
	}
	,_fullBarWidth: null
	,_value: null
	,_bar: null
	,__class__: filemanager.client.views.uis.ProgressBar
	,__properties__: {set_value:"set_value",get_value:"get_value"}
});
filemanager.client.views.uis.SimpleDialogPanel = function(SLPId,parent) {
	this._parent = parent;
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"SimpleDialogPanel");
	var root = js.Lib.document.createElement("div");
	root.className = "simpleDialogPanel smallFont";
	this._background = js.Lib.document.createElement("div");
	this._background.className = "overlayBackground";
	this._panel = js.Lib.document.createElement("div");
	this._panel.className = "panel";
	this._title = js.Lib.document.createElement("span");
	this._panel.appendChild(this._title);
	this._input = js.Lib.document.createElement("input");
	this._input.addEventListener("keydown",$bind(this,this.handleKeyboardEvent),false);
	this._panel.appendChild(this._input);
	this._cancel = new filemanager.client.views.uis.buttons.CancelButton("Cancel",SLPId);
	this._panel.appendChild(this._cancel.rootElement);
	this._cancel.set_enabled(true);
	this._cancel.onclicked = $bind(this,this.hide);
	this._confirm = new filemanager.client.views.uis.buttons.ConfirmButton("Confirm",SLPId);
	this._panel.appendChild(this._confirm.rootElement);
	this._confirm.onclicked = $bind(this,this.handleUserConfirmation);
	root.appendChild(this._background);
	root.appendChild(this._panel);
	filemanager.client.views.base.View.call(this,root,SLPId);
};
$hxClasses["filemanager.client.views.uis.SimpleDialogPanel"] = filemanager.client.views.uis.SimpleDialogPanel;
filemanager.client.views.uis.SimpleDialogPanel.__name__ = ["filemanager","client","views","uis","SimpleDialogPanel"];
filemanager.client.views.uis.SimpleDialogPanel.__super__ = filemanager.client.views.base.View;
filemanager.client.views.uis.SimpleDialogPanel.prototype = $extend(filemanager.client.views.base.View.prototype,{
	injectAppModel: function(filesModel) {
		this._filesModel = filesModel;
	}
	,hide: function(evt) {
		this._parent.removeChild(this.rootElement);
	}
	,show: function(title) {
		this._title.innerHTML = title;
		this._parent.appendChild(this.rootElement);
		this._confirm.set_enabled(false);
		this._input.innerHTML = "";
	}
	,handleUserConfirmation: function(evt) {
		var selectedIsFile = this._filesModel.get_selectedFile() != null?true:false;
		var selectedPath = this._filesModel.get_selectedFile() != null?this._filesModel.get_selectedFile().path:this._filesModel.get_selectedFolder();
		var value = this._input.value;
		this._filesModel.renameFile(selectedPath,value);
		this.hide();
	}
	,handleKeyboardEvent: function(e) {
		var value = this._input.value;
		this._confirm.set_enabled(value.length > 1);
	}
	,_parent: null
	,_filesModel: null
	,_panel: null
	,_background: null
	,_confirm: null
	,_cancel: null
	,_input: null
	,_title: null
	,__class__: filemanager.client.views.uis.SimpleDialogPanel
});
filemanager.client.views.uis.buttons = {}
filemanager.client.views.uis.buttons.CancelButton = function(label,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"CancelButton");
	filemanager.client.views.base.LabelButton.call(this,label,SLPId);
	this.rootElement.className = "buttons cancelButton";
};
$hxClasses["filemanager.client.views.uis.buttons.CancelButton"] = filemanager.client.views.uis.buttons.CancelButton;
filemanager.client.views.uis.buttons.CancelButton.__name__ = ["filemanager","client","views","uis","buttons","CancelButton"];
filemanager.client.views.uis.buttons.CancelButton.__super__ = filemanager.client.views.base.LabelButton;
filemanager.client.views.uis.buttons.CancelButton.prototype = $extend(filemanager.client.views.base.LabelButton.prototype,{
	__class__: filemanager.client.views.uis.buttons.CancelButton
});
filemanager.client.views.uis.buttons.CancelUploadButton = function(label,SLPId,fileName) {
	this._fileName = fileName;
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"CancelUploadButton");
	filemanager.client.views.base.LabelButton.call(this,label,SLPId);
	this.rootElement.className = "buttons cancelButton";
};
$hxClasses["filemanager.client.views.uis.buttons.CancelUploadButton"] = filemanager.client.views.uis.buttons.CancelUploadButton;
filemanager.client.views.uis.buttons.CancelUploadButton.__name__ = ["filemanager","client","views","uis","buttons","CancelUploadButton"];
filemanager.client.views.uis.buttons.CancelUploadButton.__super__ = filemanager.client.views.base.LabelButton;
filemanager.client.views.uis.buttons.CancelUploadButton.prototype = $extend(filemanager.client.views.base.LabelButton.prototype,{
	handleClick: function(e) {
		if(this.requestCancelUpload != null && this.get_enabled() == true) this.requestCancelUpload(this._fileName);
	}
	,_fileName: null
	,requestCancelUpload: null
	,__class__: filemanager.client.views.uis.buttons.CancelUploadButton
});
filemanager.client.views.uis.buttons.ConfirmButton = function(label,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"ConfirmButton");
	filemanager.client.views.base.LabelButton.call(this,label,SLPId);
	this.rootElement.className = "buttons confirmButton";
};
$hxClasses["filemanager.client.views.uis.buttons.ConfirmButton"] = filemanager.client.views.uis.buttons.ConfirmButton;
filemanager.client.views.uis.buttons.ConfirmButton.__name__ = ["filemanager","client","views","uis","buttons","ConfirmButton"];
filemanager.client.views.uis.buttons.ConfirmButton.__super__ = filemanager.client.views.base.LabelButton;
filemanager.client.views.uis.buttons.ConfirmButton.prototype = $extend(filemanager.client.views.base.LabelButton.prototype,{
	__class__: filemanager.client.views.uis.buttons.ConfirmButton
});
filemanager.client.views.uis.buttons.CopyButton = function(label,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"CopyButton");
	filemanager.client.views.base.LabelButton.call(this,label,SLPId);
	this.rootElement.className = "buttons copyButton";
	this.onclicked = $bind(this,this.handleClicked);
	this.set_enabled(true);
};
$hxClasses["filemanager.client.views.uis.buttons.CopyButton"] = filemanager.client.views.uis.buttons.CopyButton;
filemanager.client.views.uis.buttons.CopyButton.__name__ = ["filemanager","client","views","uis","buttons","CopyButton"];
filemanager.client.views.uis.buttons.CopyButton.__super__ = filemanager.client.views.base.LabelButton;
filemanager.client.views.uis.buttons.CopyButton.prototype = $extend(filemanager.client.views.base.LabelButton.prototype,{
	handleClicked: function(evt) {
		if(this.onButtonClicked != null) this.onButtonClicked("CopyButton");
	}
	,onButtonClicked: null
	,__class__: filemanager.client.views.uis.buttons.CopyButton
});
filemanager.client.views.uis.buttons.CreateFolderButton = function(label,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"CreateFolderButton");
	filemanager.client.views.base.LabelButton.call(this,label,SLPId);
	this.rootElement.className = "buttons createFolderButton";
	this.onclicked = $bind(this,this.handleClicked);
	this.set_enabled(true);
};
$hxClasses["filemanager.client.views.uis.buttons.CreateFolderButton"] = filemanager.client.views.uis.buttons.CreateFolderButton;
filemanager.client.views.uis.buttons.CreateFolderButton.__name__ = ["filemanager","client","views","uis","buttons","CreateFolderButton"];
filemanager.client.views.uis.buttons.CreateFolderButton.__super__ = filemanager.client.views.base.LabelButton;
filemanager.client.views.uis.buttons.CreateFolderButton.prototype = $extend(filemanager.client.views.base.LabelButton.prototype,{
	handleClicked: function(evt) {
		if(this.onButtonClicked != null) this.onButtonClicked("CreateFolderButton");
	}
	,onButtonClicked: null
	,__class__: filemanager.client.views.uis.buttons.CreateFolderButton
});
filemanager.client.views.uis.buttons.DeleteButton = function(label,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"DeleteButton");
	filemanager.client.views.base.LabelButton.call(this,label,SLPId);
	this.rootElement.className = "buttons deleteButton";
	this.onclicked = $bind(this,this.handleClicked);
	this.set_enabled(true);
};
$hxClasses["filemanager.client.views.uis.buttons.DeleteButton"] = filemanager.client.views.uis.buttons.DeleteButton;
filemanager.client.views.uis.buttons.DeleteButton.__name__ = ["filemanager","client","views","uis","buttons","DeleteButton"];
filemanager.client.views.uis.buttons.DeleteButton.__super__ = filemanager.client.views.base.LabelButton;
filemanager.client.views.uis.buttons.DeleteButton.prototype = $extend(filemanager.client.views.base.LabelButton.prototype,{
	handleClicked: function(evt) {
		if(this.onButtonClicked != null) this.onButtonClicked("DeleteButton");
	}
	,onButtonClicked: null
	,__class__: filemanager.client.views.uis.buttons.DeleteButton
});
filemanager.client.views.uis.buttons.DownloadButton = function(label,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"DownloadButton");
	filemanager.client.views.base.LabelButton.call(this,label,SLPId);
	this.rootElement.className = "buttons downloadButton";
	this.onclicked = $bind(this,this.handleClicked);
	this.set_enabled(true);
};
$hxClasses["filemanager.client.views.uis.buttons.DownloadButton"] = filemanager.client.views.uis.buttons.DownloadButton;
filemanager.client.views.uis.buttons.DownloadButton.__name__ = ["filemanager","client","views","uis","buttons","DownloadButton"];
filemanager.client.views.uis.buttons.DownloadButton.__super__ = filemanager.client.views.base.LabelButton;
filemanager.client.views.uis.buttons.DownloadButton.prototype = $extend(filemanager.client.views.base.LabelButton.prototype,{
	handleClicked: function(evt) {
		if(this.onButtonClicked != null) this.onButtonClicked("DownloadButton");
	}
	,onButtonClicked: null
	,__class__: filemanager.client.views.uis.buttons.DownloadButton
});
filemanager.client.views.uis.buttons.PasteButton = function(label,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"PasteButton");
	filemanager.client.views.base.LabelButton.call(this,label,SLPId);
	this.rootElement.className = "buttons pasteButton";
	this.onclicked = $bind(this,this.handleClicked);
	this.set_enabled(true);
};
$hxClasses["filemanager.client.views.uis.buttons.PasteButton"] = filemanager.client.views.uis.buttons.PasteButton;
filemanager.client.views.uis.buttons.PasteButton.__name__ = ["filemanager","client","views","uis","buttons","PasteButton"];
filemanager.client.views.uis.buttons.PasteButton.__super__ = filemanager.client.views.base.LabelButton;
filemanager.client.views.uis.buttons.PasteButton.prototype = $extend(filemanager.client.views.base.LabelButton.prototype,{
	handleClicked: function(evt) {
		if(this.onButtonClicked != null) this.onButtonClicked("PasteButton");
	}
	,onButtonClicked: null
	,__class__: filemanager.client.views.uis.buttons.PasteButton
});
filemanager.client.views.uis.buttons.RenameButton = function(label,SLPId) {
	filemanager.client.models.Locator.registerSLDisplay(SLPId,this,"RenameButton");
	filemanager.client.views.base.LabelButton.call(this,label,SLPId);
	this.rootElement.className = "buttons renameButton";
	this.onclicked = $bind(this,this.handleClicked);
	this.set_enabled(true);
};
$hxClasses["filemanager.client.views.uis.buttons.RenameButton"] = filemanager.client.views.uis.buttons.RenameButton;
filemanager.client.views.uis.buttons.RenameButton.__name__ = ["filemanager","client","views","uis","buttons","RenameButton"];
filemanager.client.views.uis.buttons.RenameButton.__super__ = filemanager.client.views.base.LabelButton;
filemanager.client.views.uis.buttons.RenameButton.prototype = $extend(filemanager.client.views.base.LabelButton.prototype,{
	handleClicked: function(evt) {
		if(this.onButtonClicked != null) this.onButtonClicked("RenameButton");
	}
	,onButtonClicked: null
	,__class__: filemanager.client.views.uis.buttons.RenameButton
});
filemanager.cross = {}
filemanager.cross.FileUpdatedVO = function() {
};
$hxClasses["filemanager.cross.FileUpdatedVO"] = filemanager.cross.FileUpdatedVO;
filemanager.cross.FileUpdatedVO.__name__ = ["filemanager","cross","FileUpdatedVO"];
filemanager.cross.FileUpdatedVO.prototype = {
	toString: function() {
		var l_result = "SimpleResponseVO {\n";
		l_result += "\t filepath: " + this.filepath + "\n";
		l_result += "\t success: " + Std.string(this.success) + "\n";
		l_result += "\t error: " + this.error + "\n";
		l_result += "}\n";
		return l_result;
	}
	,error: null
	,success: null
	,filepath: null
	,__class__: filemanager.cross.FileUpdatedVO
}
filemanager.cross.FileVO = function() {
};
$hxClasses["filemanager.cross.FileVO"] = filemanager.cross.FileVO;
filemanager.cross.FileVO.__name__ = ["filemanager","cross","FileVO"];
filemanager.cross.FileVO.prototype = {
	toString: function() {
		var l_result = "FileVO {\n";
		l_result += "\t name: " + this.name + "\n";
		l_result += "\t path: " + this.path + "\n";
		l_result += "\t extension: " + this.extension + "\n";
		l_result += "\t size: " + this.size + "\n";
		l_result += "\t accessed: " + this.accessed + "\n";
		l_result += "\t created: " + this.created + "\n";
		l_result += "\t modified: " + this.modified + "\n";
		l_result += "}\n";
		return l_result;
	}
	,modified: null
	,created: null
	,accessed: null
	,size: null
	,extension: null
	,path: null
	,name: null
	,__class__: filemanager.cross.FileVO
}
filemanager.cross.FolderVO = function() {
	this.open = false;
};
$hxClasses["filemanager.cross.FolderVO"] = filemanager.cross.FolderVO;
filemanager.cross.FolderVO.__name__ = ["filemanager","cross","FolderVO"];
filemanager.cross.FolderVO.prototype = {
	toString: function() {
		var l_result = "FileVO {\n";
		l_result += "\t name: " + this.name + "\n";
		l_result += "\t path: " + this.path + "\n";
		l_result += "\t childFolders: " + this.childFolders.join(",") + "\n";
		l_result += "\t children: " + this.children + "\n";
		return l_result;
	}
	,children: null
	,childFolders: null
	,open: null
	,path: null
	,name: null
	,__class__: filemanager.cross.FolderVO
}
var haxe = {}
haxe.Http = function(url) {
	this.url = url;
	this.headers = new Hash();
	this.params = new Hash();
	this.async = true;
};
$hxClasses["haxe.Http"] = haxe.Http;
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.requestUrl = function(url) {
	var h = new haxe.Http(url);
	h.async = false;
	var r = null;
	h.onData = function(d) {
		r = d;
	};
	h.onError = function(e) {
		throw e;
	};
	h.request(false);
	return r;
}
haxe.Http.prototype = {
	onStatus: function(status) {
	}
	,onError: function(msg) {
	}
	,onData: function(data) {
	}
	,request: function(post) {
		var me = this;
		var r = new js.XMLHttpRequest();
		var onreadystatechange = function() {
			if(r.readyState != 4) return;
			var s = (function($this) {
				var $r;
				try {
					$r = r.status;
				} catch( e ) {
					$r = null;
				}
				return $r;
			}(this));
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) me.onData(r.responseText); else switch(s) {
			case null: case undefined:
				me.onError("Failed to connect or resolve host");
				break;
			case 12029:
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.onError("Unknown host");
				break;
			default:
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.keys();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += StringTools.urlEncode(p) + "=" + StringTools.urlEncode(this.params.get(p));
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e ) {
			this.onError(e.toString());
			return;
		}
		if(this.headers.get("Content-Type") == null && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.keys();
		while( $it1.hasNext() ) {
			var h = $it1.next();
			r.setRequestHeader(h,this.headers.get(h));
		}
		r.send(uri);
		if(!this.async) onreadystatechange();
	}
	,setPostData: function(data) {
		this.postData = data;
	}
	,setParameter: function(param,value) {
		this.params.set(param,value);
	}
	,setHeader: function(header,value) {
		this.headers.set(header,value);
	}
	,params: null
	,headers: null
	,postData: null
	,async: null
	,url: null
	,__class__: haxe.Http
}
haxe.Json = function() {
};
$hxClasses["haxe.Json"] = haxe.Json;
haxe.Json.__name__ = ["haxe","Json"];
haxe.Json.parse = function(text) {
	return new haxe.Json().doParse(text);
}
haxe.Json.stringify = function(value) {
	return new haxe.Json().toString(value);
}
haxe.Json.prototype = {
	parseString: function() {
		var start = this.pos;
		var buf = new StringBuf();
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			if(c == 34) break;
			if(c == 92) {
				buf.b += HxOverrides.substr(this.str,start,this.pos - start - 1);
				c = this.str.charCodeAt(this.pos++);
				switch(c) {
				case 114:
					buf.b += String.fromCharCode(13);
					break;
				case 110:
					buf.b += String.fromCharCode(10);
					break;
				case 116:
					buf.b += String.fromCharCode(9);
					break;
				case 98:
					buf.b += String.fromCharCode(8);
					break;
				case 102:
					buf.b += String.fromCharCode(12);
					break;
				case 47:case 92:case 34:
					buf.b += String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCharCode(uc);
					break;
				default:
					throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
				}
				start = this.pos;
			} else if(c != c) throw "Unclosed string";
		}
		buf.b += HxOverrides.substr(this.str,start,this.pos - start - 1);
		return buf.b;
	}
	,parseRec: function() {
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 32:case 13:case 10:case 9:
				break;
			case 123:
				var obj = { }, field = null, comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 125:
						if(field != null || comma == false) this.invalidChar();
						return obj;
					case 58:
						if(field == null) this.invalidChar();
						obj[field] = this.parseRec();
						field = null;
						comma = true;
						break;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					case 34:
						if(comma) this.invalidChar();
						field = this.parseString();
						break;
					default:
						this.invalidChar();
					}
				}
				break;
			case 91:
				var arr = [], comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 93:
						if(comma == false) this.invalidChar();
						return arr;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					default:
						if(comma) this.invalidChar();
						this.pos--;
						arr.push(this.parseRec());
						comma = true;
					}
				}
				break;
			case 116:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 114 || this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return true;
			case 102:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 97 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 115 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return false;
			case 110:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 108) {
					this.pos = save;
					this.invalidChar();
				}
				return null;
			case 34:
				return this.parseString();
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
				this.pos--;
				if(!this.reg_float.match(HxOverrides.substr(this.str,this.pos,null))) throw "Invalid float at position " + this.pos;
				var v = this.reg_float.matched(0);
				this.pos += v.length;
				var f = Std.parseFloat(v);
				var i = f | 0;
				return i == f?i:f;
			default:
				this.invalidChar();
			}
		}
	}
	,nextChar: function() {
		return this.str.charCodeAt(this.pos++);
	}
	,invalidChar: function() {
		this.pos--;
		throw "Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos;
	}
	,doParse: function(str) {
		this.reg_float = new EReg("^-?(0|[1-9][0-9]*)(\\.[0-9]+)?([eE][+-]?[0-9]+)?","");
		this.str = str;
		this.pos = 0;
		return this.parseRec();
	}
	,quote: function(s) {
		this.buf.b += Std.string("\"");
		var i = 0;
		while(true) {
			var c = s.charCodeAt(i++);
			if(c != c) break;
			switch(c) {
			case 34:
				this.buf.b += Std.string("\\\"");
				break;
			case 92:
				this.buf.b += Std.string("\\\\");
				break;
			case 10:
				this.buf.b += Std.string("\\n");
				break;
			case 13:
				this.buf.b += Std.string("\\r");
				break;
			case 9:
				this.buf.b += Std.string("\\t");
				break;
			case 8:
				this.buf.b += Std.string("\\b");
				break;
			case 12:
				this.buf.b += Std.string("\\f");
				break;
			default:
				this.buf.b += String.fromCharCode(c);
			}
		}
		this.buf.b += Std.string("\"");
	}
	,toStringRec: function(v) {
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 8:
			this.buf.b += Std.string("\"???\"");
			break;
		case 4:
			this.objString(v);
			break;
		case 1:
		case 2:
			this.buf.b += Std.string(v);
			break;
		case 5:
			this.buf.b += Std.string("\"<fun>\"");
			break;
		case 6:
			var c = $e[2];
			if(c == String) this.quote(v); else if(c == Array) {
				var v1 = v;
				this.buf.b += Std.string("[");
				var len = v1.length;
				if(len > 0) {
					this.toStringRec(v1[0]);
					var i = 1;
					while(i < len) {
						this.buf.b += Std.string(",");
						this.toStringRec(v1[i++]);
					}
				}
				this.buf.b += Std.string("]");
			} else if(c == Hash) {
				var v1 = v;
				var o = { };
				var $it0 = v1.keys();
				while( $it0.hasNext() ) {
					var k = $it0.next();
					o[k] = v1.get(k);
				}
				this.objString(o);
			} else this.objString(v);
			break;
		case 7:
			var e = $e[2];
			this.buf.b += Std.string(v[1]);
			break;
		case 3:
			this.buf.b += Std.string(v?"true":"false");
			break;
		case 0:
			this.buf.b += Std.string("null");
			break;
		}
	}
	,objString: function(v) {
		this.fieldsString(v,Reflect.fields(v));
	}
	,fieldsString: function(v,fields) {
		var first = true;
		this.buf.b += Std.string("{");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var value = Reflect.field(v,f);
			if(Reflect.isFunction(value)) continue;
			if(first) first = false; else this.buf.b += Std.string(",");
			this.quote(f);
			this.buf.b += Std.string(":");
			this.toStringRec(value);
		}
		this.buf.b += Std.string("}");
	}
	,toString: function(v) {
		this.buf = new StringBuf();
		this.toStringRec(v);
		return this.buf.b;
	}
	,reg_float: null
	,pos: null
	,str: null
	,buf: null
	,__class__: haxe.Json
}
haxe.Log = function() { }
$hxClasses["haxe.Log"] = haxe.Log;
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Md5 = function() {
};
$hxClasses["haxe.Md5"] = haxe.Md5;
haxe.Md5.__name__ = ["haxe","Md5"];
haxe.Md5.encode = function(s) {
	return new haxe.Md5().doEncode(s);
}
haxe.Md5.prototype = {
	doEncode: function(str) {
		var x = this.str2blks(str);
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;
		var step;
		var i = 0;
		while(i < x.length) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			step = 0;
			a = this.ff(a,b,c,d,x[i],7,-680876936);
			d = this.ff(d,a,b,c,x[i + 1],12,-389564586);
			c = this.ff(c,d,a,b,x[i + 2],17,606105819);
			b = this.ff(b,c,d,a,x[i + 3],22,-1044525330);
			a = this.ff(a,b,c,d,x[i + 4],7,-176418897);
			d = this.ff(d,a,b,c,x[i + 5],12,1200080426);
			c = this.ff(c,d,a,b,x[i + 6],17,-1473231341);
			b = this.ff(b,c,d,a,x[i + 7],22,-45705983);
			a = this.ff(a,b,c,d,x[i + 8],7,1770035416);
			d = this.ff(d,a,b,c,x[i + 9],12,-1958414417);
			c = this.ff(c,d,a,b,x[i + 10],17,-42063);
			b = this.ff(b,c,d,a,x[i + 11],22,-1990404162);
			a = this.ff(a,b,c,d,x[i + 12],7,1804603682);
			d = this.ff(d,a,b,c,x[i + 13],12,-40341101);
			c = this.ff(c,d,a,b,x[i + 14],17,-1502002290);
			b = this.ff(b,c,d,a,x[i + 15],22,1236535329);
			a = this.gg(a,b,c,d,x[i + 1],5,-165796510);
			d = this.gg(d,a,b,c,x[i + 6],9,-1069501632);
			c = this.gg(c,d,a,b,x[i + 11],14,643717713);
			b = this.gg(b,c,d,a,x[i],20,-373897302);
			a = this.gg(a,b,c,d,x[i + 5],5,-701558691);
			d = this.gg(d,a,b,c,x[i + 10],9,38016083);
			c = this.gg(c,d,a,b,x[i + 15],14,-660478335);
			b = this.gg(b,c,d,a,x[i + 4],20,-405537848);
			a = this.gg(a,b,c,d,x[i + 9],5,568446438);
			d = this.gg(d,a,b,c,x[i + 14],9,-1019803690);
			c = this.gg(c,d,a,b,x[i + 3],14,-187363961);
			b = this.gg(b,c,d,a,x[i + 8],20,1163531501);
			a = this.gg(a,b,c,d,x[i + 13],5,-1444681467);
			d = this.gg(d,a,b,c,x[i + 2],9,-51403784);
			c = this.gg(c,d,a,b,x[i + 7],14,1735328473);
			b = this.gg(b,c,d,a,x[i + 12],20,-1926607734);
			a = this.hh(a,b,c,d,x[i + 5],4,-378558);
			d = this.hh(d,a,b,c,x[i + 8],11,-2022574463);
			c = this.hh(c,d,a,b,x[i + 11],16,1839030562);
			b = this.hh(b,c,d,a,x[i + 14],23,-35309556);
			a = this.hh(a,b,c,d,x[i + 1],4,-1530992060);
			d = this.hh(d,a,b,c,x[i + 4],11,1272893353);
			c = this.hh(c,d,a,b,x[i + 7],16,-155497632);
			b = this.hh(b,c,d,a,x[i + 10],23,-1094730640);
			a = this.hh(a,b,c,d,x[i + 13],4,681279174);
			d = this.hh(d,a,b,c,x[i],11,-358537222);
			c = this.hh(c,d,a,b,x[i + 3],16,-722521979);
			b = this.hh(b,c,d,a,x[i + 6],23,76029189);
			a = this.hh(a,b,c,d,x[i + 9],4,-640364487);
			d = this.hh(d,a,b,c,x[i + 12],11,-421815835);
			c = this.hh(c,d,a,b,x[i + 15],16,530742520);
			b = this.hh(b,c,d,a,x[i + 2],23,-995338651);
			a = this.ii(a,b,c,d,x[i],6,-198630844);
			d = this.ii(d,a,b,c,x[i + 7],10,1126891415);
			c = this.ii(c,d,a,b,x[i + 14],15,-1416354905);
			b = this.ii(b,c,d,a,x[i + 5],21,-57434055);
			a = this.ii(a,b,c,d,x[i + 12],6,1700485571);
			d = this.ii(d,a,b,c,x[i + 3],10,-1894986606);
			c = this.ii(c,d,a,b,x[i + 10],15,-1051523);
			b = this.ii(b,c,d,a,x[i + 1],21,-2054922799);
			a = this.ii(a,b,c,d,x[i + 8],6,1873313359);
			d = this.ii(d,a,b,c,x[i + 15],10,-30611744);
			c = this.ii(c,d,a,b,x[i + 6],15,-1560198380);
			b = this.ii(b,c,d,a,x[i + 13],21,1309151649);
			a = this.ii(a,b,c,d,x[i + 4],6,-145523070);
			d = this.ii(d,a,b,c,x[i + 11],10,-1120210379);
			c = this.ii(c,d,a,b,x[i + 2],15,718787259);
			b = this.ii(b,c,d,a,x[i + 9],21,-343485551);
			a = this.addme(a,olda);
			b = this.addme(b,oldb);
			c = this.addme(c,oldc);
			d = this.addme(d,oldd);
			i += 16;
		}
		return this.rhex(a) + this.rhex(b) + this.rhex(c) + this.rhex(d);
	}
	,ii: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(c,this.bitOR(b,~d)),a,b,x,s,t);
	}
	,hh: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(this.bitXOR(b,c),d),a,b,x,s,t);
	}
	,gg: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,d),this.bitAND(c,~d)),a,b,x,s,t);
	}
	,ff: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,c),this.bitAND(~b,d)),a,b,x,s,t);
	}
	,cmn: function(q,a,b,x,s,t) {
		return this.addme(this.rol(this.addme(this.addme(a,q),this.addme(x,t)),s),b);
	}
	,rol: function(num,cnt) {
		return num << cnt | num >>> 32 - cnt;
	}
	,str2blks: function(str) {
		var nblk = (str.length + 8 >> 6) + 1;
		var blks = new Array();
		var _g1 = 0, _g = nblk * 16;
		while(_g1 < _g) {
			var i = _g1++;
			blks[i] = 0;
		}
		var i = 0;
		while(i < str.length) {
			blks[i >> 2] |= HxOverrides.cca(str,i) << (str.length * 8 + i) % 4 * 8;
			i++;
		}
		blks[i >> 2] |= 128 << (str.length * 8 + i) % 4 * 8;
		var l = str.length * 8;
		var k = nblk * 16 - 2;
		blks[k] = l & 255;
		blks[k] |= (l >>> 8 & 255) << 8;
		blks[k] |= (l >>> 16 & 255) << 16;
		blks[k] |= (l >>> 24 & 255) << 24;
		return blks;
	}
	,rhex: function(num) {
		var str = "";
		var hex_chr = "0123456789abcdef";
		var _g = 0;
		while(_g < 4) {
			var j = _g++;
			str += hex_chr.charAt(num >> j * 8 + 4 & 15) + hex_chr.charAt(num >> j * 8 & 15);
		}
		return str;
	}
	,addme: function(x,y) {
		var lsw = (x & 65535) + (y & 65535);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return msw << 16 | lsw & 65535;
	}
	,bitAND: function(a,b) {
		var lsb = a & 1 & (b & 1);
		var msb31 = a >>> 1 & b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitXOR: function(a,b) {
		var lsb = a & 1 ^ b & 1;
		var msb31 = a >>> 1 ^ b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitOR: function(a,b) {
		var lsb = a & 1 | b & 1;
		var msb31 = a >>> 1 | b >>> 1;
		return msb31 << 1 | lsb;
	}
	,__class__: haxe.Md5
}
haxe.Serializer = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new Hash();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe.Serializer;
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.run = function(v) {
	var s = new haxe.Serializer();
	s.serialize(v);
	return s.toString();
}
haxe.Serializer.prototype = {
	serializeException: function(e) {
		this.buf.b += Std.string("x");
		this.serialize(e);
	}
	,serialize: function(v) {
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 0:
			this.buf.b += Std.string("n");
			break;
		case 1:
			if(v == 0) {
				this.buf.b += Std.string("z");
				return;
			}
			this.buf.b += Std.string("i");
			this.buf.b += Std.string(v);
			break;
		case 2:
			if(Math.isNaN(v)) this.buf.b += Std.string("k"); else if(!Math.isFinite(v)) this.buf.b += Std.string(v < 0?"m":"p"); else {
				this.buf.b += Std.string("d");
				this.buf.b += Std.string(v);
			}
			break;
		case 3:
			this.buf.b += Std.string(v?"t":"f");
			break;
		case 6:
			var c = $e[2];
			if(c == String) {
				this.serializeString(v);
				return;
			}
			if(this.useCache && this.serializeRef(v)) return;
			switch(c) {
			case Array:
				var ucount = 0;
				this.buf.b += Std.string("a");
				var l = v.length;
				var _g = 0;
				while(_g < l) {
					var i = _g++;
					if(v[i] == null) ucount++; else {
						if(ucount > 0) {
							if(ucount == 1) this.buf.b += Std.string("n"); else {
								this.buf.b += Std.string("u");
								this.buf.b += Std.string(ucount);
							}
							ucount = 0;
						}
						this.serialize(v[i]);
					}
				}
				if(ucount > 0) {
					if(ucount == 1) this.buf.b += Std.string("n"); else {
						this.buf.b += Std.string("u");
						this.buf.b += Std.string(ucount);
					}
				}
				this.buf.b += Std.string("h");
				break;
			case List:
				this.buf.b += Std.string("l");
				var v1 = v;
				var $it0 = v1.iterator();
				while( $it0.hasNext() ) {
					var i = $it0.next();
					this.serialize(i);
				}
				this.buf.b += Std.string("h");
				break;
			case Date:
				var d = v;
				this.buf.b += Std.string("v");
				this.buf.b += Std.string(HxOverrides.dateStr(d));
				break;
			case Hash:
				this.buf.b += Std.string("b");
				var v1 = v;
				var $it1 = v1.keys();
				while( $it1.hasNext() ) {
					var k = $it1.next();
					this.serializeString(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += Std.string("h");
				break;
			case IntHash:
				this.buf.b += Std.string("q");
				var v1 = v;
				var $it2 = v1.keys();
				while( $it2.hasNext() ) {
					var k = $it2.next();
					this.buf.b += Std.string(":");
					this.buf.b += Std.string(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += Std.string("h");
				break;
			case haxe.io.Bytes:
				var v1 = v;
				var i = 0;
				var max = v1.length - 2;
				var charsBuf = new StringBuf();
				var b64 = haxe.Serializer.BASE64;
				while(i < max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					var b3 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt((b2 << 2 | b3 >> 6) & 63));
					charsBuf.b += Std.string(b64.charAt(b3 & 63));
				}
				if(i == max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt(b2 << 2 & 63));
				} else if(i == max + 1) {
					var b1 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt(b1 << 4 & 63));
				}
				var chars = charsBuf.b;
				this.buf.b += Std.string("s");
				this.buf.b += Std.string(chars.length);
				this.buf.b += Std.string(":");
				this.buf.b += Std.string(chars);
				break;
			default:
				this.cache.pop();
				if(v.hxSerialize != null) {
					this.buf.b += Std.string("C");
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					v.hxSerialize(this);
					this.buf.b += Std.string("g");
				} else {
					this.buf.b += Std.string("c");
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					this.serializeFields(v);
				}
			}
			break;
		case 4:
			if(this.useCache && this.serializeRef(v)) return;
			this.buf.b += Std.string("o");
			this.serializeFields(v);
			break;
		case 7:
			var e = $e[2];
			if(this.useCache && this.serializeRef(v)) return;
			this.cache.pop();
			this.buf.b += Std.string(this.useEnumIndex?"j":"w");
			this.serializeString(Type.getEnumName(e));
			if(this.useEnumIndex) {
				this.buf.b += Std.string(":");
				this.buf.b += Std.string(v[1]);
			} else this.serializeString(v[0]);
			this.buf.b += Std.string(":");
			var l = v.length;
			this.buf.b += Std.string(l - 2);
			var _g = 2;
			while(_g < l) {
				var i = _g++;
				this.serialize(v[i]);
			}
			this.cache.push(v);
			break;
		case 5:
			throw "Cannot serialize function";
			break;
		default:
			throw "Cannot serialize " + Std.string(v);
		}
	}
	,serializeFields: function(v) {
		var _g = 0, _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += Std.string("g");
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0, _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += Std.string("r");
				this.buf.b += Std.string(i);
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += Std.string("R");
			this.buf.b += Std.string(x);
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += Std.string("y");
		s = StringTools.urlEncode(s);
		this.buf.b += Std.string(s.length);
		this.buf.b += Std.string(":");
		this.buf.b += Std.string(s);
	}
	,toString: function() {
		return this.buf.b;
	}
	,useEnumIndex: null
	,useCache: null
	,scount: null
	,shash: null
	,cache: null
	,buf: null
	,__class__: haxe.Serializer
}
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = function() { }
$hxClasses["haxe.Stack"] = haxe.Stack;
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.Stack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
}
haxe.Stack.exceptionStack = function() {
	return [];
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += Std.string("\nCalled from ");
		haxe.Stack.itemToString(b,s);
	}
	return b.b;
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += Std.string("a C function");
		break;
	case 1:
		var m = $e[2];
		b.b += Std.string("module ");
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b += Std.string(" (");
		}
		b.b += Std.string(file);
		b.b += Std.string(" line ");
		b.b += Std.string(line);
		if(s1 != null) b.b += Std.string(")");
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += Std.string(".");
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += Std.string("local function #");
		b.b += Std.string(n);
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
}
haxe._Template = {}
haxe._Template.TemplateExpr = $hxClasses["haxe._Template.TemplateExpr"] = { __ename__ : ["haxe","_Template","TemplateExpr"], __constructs__ : ["OpVar","OpExpr","OpIf","OpStr","OpBlock","OpForeach","OpMacro"] }
haxe._Template.TemplateExpr.OpVar = function(v) { var $x = ["OpVar",0,v]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpExpr = function(expr) { var $x = ["OpExpr",1,expr]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpIf = function(expr,eif,eelse) { var $x = ["OpIf",2,expr,eif,eelse]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpStr = function(str) { var $x = ["OpStr",3,str]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpBlock = function(l) { var $x = ["OpBlock",4,l]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpForeach = function(expr,loop) { var $x = ["OpForeach",5,expr,loop]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpMacro = function(name,params) { var $x = ["OpMacro",6,name,params]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe.Template = function(str) {
	var tokens = this.parseTokens(str);
	this.expr = this.parseBlock(tokens);
	if(!tokens.isEmpty()) throw "Unexpected '" + Std.string(tokens.first().s) + "'";
};
$hxClasses["haxe.Template"] = haxe.Template;
haxe.Template.__name__ = ["haxe","Template"];
haxe.Template.prototype = {
	run: function(e) {
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			this.buf.b += Std.string(Std.string(this.resolve(v)));
			break;
		case 1:
			var e1 = $e[2];
			this.buf.b += Std.string(Std.string(e1()));
			break;
		case 2:
			var eelse = $e[4], eif = $e[3], e1 = $e[2];
			var v = e1();
			if(v == null || v == false) {
				if(eelse != null) this.run(eelse);
			} else this.run(eif);
			break;
		case 3:
			var str = $e[2];
			this.buf.b += Std.string(str);
			break;
		case 4:
			var l = $e[2];
			var $it0 = l.iterator();
			while( $it0.hasNext() ) {
				var e1 = $it0.next();
				this.run(e1);
			}
			break;
		case 5:
			var loop = $e[3], e1 = $e[2];
			var v = e1();
			try {
				var x = $iterator(v)();
				if(x.hasNext == null) throw null;
				v = x;
			} catch( e2 ) {
				try {
					if(v.hasNext == null) throw null;
				} catch( e3 ) {
					throw "Cannot iter on " + Std.string(v);
				}
			}
			this.stack.push(this.context);
			var v1 = v;
			while( v1.hasNext() ) {
				var ctx = v1.next();
				this.context = ctx;
				this.run(loop);
			}
			this.context = this.stack.pop();
			break;
		case 6:
			var params = $e[3], m = $e[2];
			var v = Reflect.field(this.macros,m);
			var pl = new Array();
			var old = this.buf;
			pl.push($bind(this,this.resolve));
			var $it1 = params.iterator();
			while( $it1.hasNext() ) {
				var p = $it1.next();
				var $e = (p);
				switch( $e[1] ) {
				case 0:
					var v1 = $e[2];
					pl.push(this.resolve(v1));
					break;
				default:
					this.buf = new StringBuf();
					this.run(p);
					pl.push(this.buf.b);
				}
			}
			this.buf = old;
			try {
				this.buf.b += Std.string(Std.string(v.apply(this.macros,pl)));
			} catch( e1 ) {
				var plstr = (function($this) {
					var $r;
					try {
						$r = pl.join(",");
					} catch( e2 ) {
						$r = "???";
					}
					return $r;
				}(this));
				var msg = "Macro call " + m + "(" + plstr + ") failed (" + Std.string(e1) + ")";
				throw msg;
			}
			break;
		}
	}
	,makeExpr2: function(l) {
		var p = l.pop();
		if(p == null) throw "<eof>";
		if(p.s) return this.makeConst(p.p);
		switch(p.p) {
		case "(":
			var e1 = this.makeExpr(l);
			var p1 = l.pop();
			if(p1 == null || p1.s) throw p1.p;
			if(p1.p == ")") return e1;
			var e2 = this.makeExpr(l);
			var p2 = l.pop();
			if(p2 == null || p2.p != ")") throw p2.p;
			return (function($this) {
				var $r;
				switch(p1.p) {
				case "+":
					$r = function() {
						return e1() + e2();
					};
					break;
				case "-":
					$r = function() {
						return e1() - e2();
					};
					break;
				case "*":
					$r = function() {
						return e1() * e2();
					};
					break;
				case "/":
					$r = function() {
						return e1() / e2();
					};
					break;
				case ">":
					$r = function() {
						return e1() > e2();
					};
					break;
				case "<":
					$r = function() {
						return e1() < e2();
					};
					break;
				case ">=":
					$r = function() {
						return e1() >= e2();
					};
					break;
				case "<=":
					$r = function() {
						return e1() <= e2();
					};
					break;
				case "==":
					$r = function() {
						return e1() == e2();
					};
					break;
				case "!=":
					$r = function() {
						return e1() != e2();
					};
					break;
				case "&&":
					$r = function() {
						return e1() && e2();
					};
					break;
				case "||":
					$r = function() {
						return e1() || e2();
					};
					break;
				default:
					$r = (function($this) {
						var $r;
						throw "Unknown operation " + p1.p;
						return $r;
					}($this));
				}
				return $r;
			}(this));
		case "!":
			var e = this.makeExpr(l);
			return function() {
				var v = e();
				return v == null || v == false;
			};
		case "-":
			var e = this.makeExpr(l);
			return function() {
				return -e();
			};
		}
		throw p.p;
	}
	,makeExpr: function(l) {
		return this.makePath(this.makeExpr2(l),l);
	}
	,makePath: function(e,l) {
		var p = l.first();
		if(p == null || p.p != ".") return e;
		l.pop();
		var field = l.pop();
		if(field == null || !field.s) throw field.p;
		var f = field.p;
		haxe.Template.expr_trim.match(f);
		f = haxe.Template.expr_trim.matched(1);
		return this.makePath(function() {
			return Reflect.field(e(),f);
		},l);
	}
	,makeConst: function(v) {
		haxe.Template.expr_trim.match(v);
		v = haxe.Template.expr_trim.matched(1);
		if(HxOverrides.cca(v,0) == 34) {
			var str = HxOverrides.substr(v,1,v.length - 2);
			return function() {
				return str;
			};
		}
		if(haxe.Template.expr_int.match(v)) {
			var i = Std.parseInt(v);
			return function() {
				return i;
			};
		}
		if(haxe.Template.expr_float.match(v)) {
			var f = Std.parseFloat(v);
			return function() {
				return f;
			};
		}
		var me = this;
		return function() {
			return me.resolve(v);
		};
	}
	,parseExpr: function(data) {
		var l = new List();
		var expr = data;
		while(haxe.Template.expr_splitter.match(data)) {
			var p = haxe.Template.expr_splitter.matchedPos();
			var k = p.pos + p.len;
			if(p.pos != 0) l.add({ p : HxOverrides.substr(data,0,p.pos), s : true});
			var p1 = haxe.Template.expr_splitter.matched(0);
			l.add({ p : p1, s : p1.indexOf("\"") >= 0});
			data = haxe.Template.expr_splitter.matchedRight();
		}
		if(data.length != 0) l.add({ p : data, s : true});
		var e;
		try {
			e = this.makeExpr(l);
			if(!l.isEmpty()) throw l.first().p;
		} catch( s ) {
			if( js.Boot.__instanceof(s,String) ) {
				throw "Unexpected '" + s + "' in " + expr;
			} else throw(s);
		}
		return function() {
			try {
				return e();
			} catch( exc ) {
				throw "Error : " + Std.string(exc) + " in " + expr;
			}
		};
	}
	,parse: function(tokens) {
		var t = tokens.pop();
		var p = t.p;
		if(t.s) return haxe._Template.TemplateExpr.OpStr(p);
		if(t.l != null) {
			var pe = new List();
			var _g = 0, _g1 = t.l;
			while(_g < _g1.length) {
				var p1 = _g1[_g];
				++_g;
				pe.add(this.parseBlock(this.parseTokens(p1)));
			}
			return haxe._Template.TemplateExpr.OpMacro(p,pe);
		}
		if(HxOverrides.substr(p,0,3) == "if ") {
			p = HxOverrides.substr(p,3,p.length - 3);
			var e = this.parseExpr(p);
			var eif = this.parseBlock(tokens);
			var t1 = tokens.first();
			var eelse;
			if(t1 == null) throw "Unclosed 'if'";
			if(t1.p == "end") {
				tokens.pop();
				eelse = null;
			} else if(t1.p == "else") {
				tokens.pop();
				eelse = this.parseBlock(tokens);
				t1 = tokens.pop();
				if(t1 == null || t1.p != "end") throw "Unclosed 'else'";
			} else {
				t1.p = HxOverrides.substr(t1.p,4,t1.p.length - 4);
				eelse = this.parse(tokens);
			}
			return haxe._Template.TemplateExpr.OpIf(e,eif,eelse);
		}
		if(HxOverrides.substr(p,0,8) == "foreach ") {
			p = HxOverrides.substr(p,8,p.length - 8);
			var e = this.parseExpr(p);
			var efor = this.parseBlock(tokens);
			var t1 = tokens.pop();
			if(t1 == null || t1.p != "end") throw "Unclosed 'foreach'";
			return haxe._Template.TemplateExpr.OpForeach(e,efor);
		}
		if(haxe.Template.expr_splitter.match(p)) return haxe._Template.TemplateExpr.OpExpr(this.parseExpr(p));
		return haxe._Template.TemplateExpr.OpVar(p);
	}
	,parseBlock: function(tokens) {
		var l = new List();
		while(true) {
			var t = tokens.first();
			if(t == null) break;
			if(!t.s && (t.p == "end" || t.p == "else" || HxOverrides.substr(t.p,0,7) == "elseif ")) break;
			l.add(this.parse(tokens));
		}
		if(l.length == 1) return l.first();
		return haxe._Template.TemplateExpr.OpBlock(l);
	}
	,parseTokens: function(data) {
		var tokens = new List();
		while(haxe.Template.splitter.match(data)) {
			var p = haxe.Template.splitter.matchedPos();
			if(p.pos > 0) tokens.add({ p : HxOverrides.substr(data,0,p.pos), s : true, l : null});
			if(HxOverrides.cca(data,p.pos) == 58) {
				tokens.add({ p : HxOverrides.substr(data,p.pos + 2,p.len - 4), s : false, l : null});
				data = haxe.Template.splitter.matchedRight();
				continue;
			}
			var parp = p.pos + p.len;
			var npar = 1;
			while(npar > 0) {
				var c = HxOverrides.cca(data,parp);
				if(c == 40) npar++; else if(c == 41) npar--; else if(c == null) throw "Unclosed macro parenthesis";
				parp++;
			}
			var params = HxOverrides.substr(data,p.pos + p.len,parp - (p.pos + p.len) - 1).split(",");
			tokens.add({ p : haxe.Template.splitter.matched(2), s : false, l : params});
			data = HxOverrides.substr(data,parp,data.length - parp);
		}
		if(data.length > 0) tokens.add({ p : data, s : true, l : null});
		return tokens;
	}
	,resolve: function(v) {
		if(Reflect.hasField(this.context,v)) return Reflect.field(this.context,v);
		var $it0 = this.stack.iterator();
		while( $it0.hasNext() ) {
			var ctx = $it0.next();
			if(Reflect.hasField(ctx,v)) return Reflect.field(ctx,v);
		}
		if(v == "__current__") return this.context;
		return Reflect.field(haxe.Template.globals,v);
	}
	,execute: function(context,macros) {
		this.macros = macros == null?{ }:macros;
		this.context = context;
		this.stack = new List();
		this.buf = new StringBuf();
		this.run(this.expr);
		return this.buf.b;
	}
	,buf: null
	,stack: null
	,macros: null
	,context: null
	,expr: null
	,__class__: haxe.Template
}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.measure = function(f,pos) {
	var t0 = haxe.Timer.stamp();
	var r = f();
	haxe.Log.trace(haxe.Timer.stamp() - t0 + "s",pos);
	return r;
}
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Timer.prototype = {
	run: function() {
	}
	,stop: function() {
		if(this.id == null) return;
		window.clearInterval(this.id);
		this.id = null;
	}
	,id: null
	,__class__: haxe.Timer
}
haxe.Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe.Unserializer;
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0, _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
}
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
}
haxe.Unserializer.prototype = {
	unserialize: function() {
		switch(this.buf.charCodeAt(this.pos++)) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = StringTools.urlDecode(s);
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n = this.readDigits();
			if(n < 0 || n >= this.cache.length) throw "Invalid reference";
			return this.cache[n];
		case 82:
			var n = this.readDigits();
			if(n < 0 || n >= this.scache.length) throw "Invalid string reference";
			return this.scache[n];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 119:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl)[index];
			if(tag == null) throw "Unknown enum index " + name + "@" + index;
			var e = this.unserializeEnum(edecl,tag);
			this.cache.push(e);
			return e;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new Hash();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h = new IntHash();
			this.cache.push(h);
			var buf = this.buf;
			var c = this.buf.charCodeAt(this.pos++);
			while(c == 58) {
				var i = this.readDigits();
				h.set(i,this.unserialize());
				c = this.buf.charCodeAt(this.pos++);
			}
			if(c != 104) throw "Invalid IntHash format";
			return h;
		case 118:
			var d = HxOverrides.strDate(HxOverrides.substr(this.buf,this.pos,19));
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len = this.readDigits();
			var buf = this.buf;
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i = this.pos;
			var rest = len & 3;
			var size = (len >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i + (len - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i < max) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				var c3 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				var c4 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c3 << 6 | c4) & 255;
			}
			if(rest >= 2) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				if(rest == 3) {
					var c3 = codes[buf.charCodeAt(i++)];
					bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				}
			}
			this.pos += len;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			o.hxUnserialize(this);
			if(this.buf.charCodeAt(this.pos++) != 103) throw "Invalid custom data";
			return o;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.buf.charCodeAt(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!js.Boot.__instanceof(k,String)) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,getResolver: function() {
		return this.resolver;
	}
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_) {
			return null;
		}}; else this.resolver = r;
	}
	,resolver: null
	,scache: null
	,cache: null
	,length: null
	,pos: null
	,buf: null
	,__class__: haxe.Unserializer
}
haxe.io = {}
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.prototype = {
	getData: function() {
		return this.b;
	}
	,toHex: function() {
		var s = new StringBuf();
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0, _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g1 = 0, _g = this.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.b[i];
			s.b += String.fromCharCode(chars[c >> 4]);
			s.b += String.fromCharCode(chars[c & 15]);
		}
		return s.b;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len = this.length < other.length?this.length:other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,get: function(pos) {
		return this.b[pos];
	}
	,b: null
	,length: null
	,__class__: haxe.io.Bytes
}
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
haxe.remoting = {}
haxe.remoting.AsyncConnection = function() { }
$hxClasses["haxe.remoting.AsyncConnection"] = haxe.remoting.AsyncConnection;
haxe.remoting.AsyncConnection.__name__ = ["haxe","remoting","AsyncConnection"];
haxe.remoting.AsyncConnection.prototype = {
	setErrorHandler: null
	,call: null
	,resolve: null
	,__class__: haxe.remoting.AsyncConnection
}
haxe.remoting.HttpAsyncConnection = function(data,path) {
	this.__data = data;
	this.__path = path;
};
$hxClasses["haxe.remoting.HttpAsyncConnection"] = haxe.remoting.HttpAsyncConnection;
haxe.remoting.HttpAsyncConnection.__name__ = ["haxe","remoting","HttpAsyncConnection"];
haxe.remoting.HttpAsyncConnection.__interfaces__ = [haxe.remoting.AsyncConnection];
haxe.remoting.HttpAsyncConnection.urlConnect = function(url) {
	return new haxe.remoting.HttpAsyncConnection({ url : url, error : function(e) {
		throw e;
	}},[]);
}
haxe.remoting.HttpAsyncConnection.prototype = {
	call: function(params,onResult) {
		var h = new haxe.Http(this.__data.url);
		var s = new haxe.Serializer();
		s.serialize(this.__path);
		s.serialize(params);
		h.setHeader("X-Haxe-Remoting","1");
		h.setParameter("__x",s.toString());
		var error = this.__data.error;
		h.onData = function(response) {
			var ok = true;
			var ret;
			try {
				if(HxOverrides.substr(response,0,3) != "hxr") throw "Invalid response : '" + response + "'";
				var s1 = new haxe.Unserializer(HxOverrides.substr(response,3,null));
				ret = s1.unserialize();
			} catch( err ) {
				ret = null;
				ok = false;
				error(err);
			}
			if(ok && onResult != null) onResult(ret);
		};
		h.onError = error;
		h.request(true);
	}
	,setErrorHandler: function(h) {
		this.__data.error = h;
	}
	,resolve: function(name) {
		var c = new haxe.remoting.HttpAsyncConnection(this.__data,this.__path.slice());
		c.__path.push(name);
		return c;
	}
	,__path: null
	,__data: null
	,__class__: haxe.remoting.HttpAsyncConnection
}
haxe.rtti = {}
haxe.rtti.Meta = function() { }
$hxClasses["haxe.rtti.Meta"] = haxe.rtti.Meta;
haxe.rtti.Meta.__name__ = ["haxe","rtti","Meta"];
haxe.rtti.Meta.getType = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.obj == null?{ }:meta.obj;
}
haxe.rtti.Meta.getStatics = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.statics == null?{ }:meta.statics;
}
haxe.rtti.Meta.getFields = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.fields == null?{ }:meta.fields;
}
haxe.xml = {}
haxe.xml.Parser = function() { }
$hxClasses["haxe.xml.Parser"] = haxe.xml.Parser;
haxe.xml.Parser.__name__ = ["haxe","xml","Parser"];
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
}
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.getNodeName()) throw "Expected </" + parent.getNodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProlog(str1));
				state = 1;
			}
			break;
		}
		c = str.charCodeAt(++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
}
haxe.xml.Parser.isValidChar = function(c) {
	return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45;
}
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = function() { }
$hxClasses["js.Lib"] = js.Lib;
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib["eval"] = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var lib = {}
lib.haxe = {}
lib.haxe.xml = {}
lib.haxe.xml.Parser = function() { }
$hxClasses["lib.haxe.xml.Parser"] = lib.haxe.xml.Parser;
lib.haxe.xml.Parser.__name__ = ["lib","haxe","xml","Parser"];
lib.haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	lib.haxe.xml.Parser.doParse(str,0,doc);
	return doc;
}
lib.haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = lib.haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.getNodeName()) throw "Expected </" + parent.getNodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProlog(str1));
				state = 1;
			}
			break;
		}
		c = str.charCodeAt(++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
}
lib.haxe.xml.Parser.isValidChar = function(c) {
	return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45;
}
lib.hxtml = {}
lib.hxtml.Browser = function(createElement,createTextNode,appendChild,setAttribute,invalidate,styleProxy) {
	this.createElement = createElement;
	this.createTextNode = createTextNode;
	this.appendChild = appendChild;
	this.setAttribute = setAttribute;
	this.invalidate = invalidate;
	this.styleProxy = styleProxy;
};
$hxClasses["lib.hxtml.Browser"] = lib.hxtml.Browser;
lib.hxtml.Browser.__name__ = ["lib","hxtml","Browser"];
lib.hxtml.Browser.prototype = {
	make: function(x) {
		switch(x.nodeType) {
		case Xml.CData:
			throw "assert";
			break;
		case Xml.PCData:case Xml.Comment:
			return this.createTextNode(x.getNodeValue());
		case Xml.DocType:
			return null;
		}
		var d;
		var name = x.getNodeName().toLowerCase();
		d = this.createElement(name);
		var allowComments = name == "style";
		var prev = null;
		var $it0 = x.iterator();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			switch(c.nodeType) {
			case Xml.PCData:
				if(new EReg("^[ \n\r\t]*$","").match(c.getNodeValue())) {
				}
				break;
			case Xml.Comment:
				if(!allowComments) continue;
				break;
			default:
			}
			if(name == "ul") haxe.Log.trace(c,{ fileName : "Browser.hx", lineNumber : 124, className : "lib.hxtml.Browser", methodName : "make"});
			prev = this.make(c);
			this.appendChild(d,prev);
		}
		var $it1 = x.attributes();
		while( $it1.hasNext() ) {
			var a = $it1.next();
			a = a.toLowerCase();
			var v = x.get(a);
			switch(a) {
			case "id":
				this.register(v,d);
				this.setAttribute(d,a,v);
				break;
			case "style":
				new lib.hxtml.CssParser().parse(v,d,this.styleProxy);
				break;
			default:
				this.setAttribute(d,a,v);
			}
		}
		return d;
	}
	,getById: function(id) {
		return this.ids.get(id);
	}
	,refresh: function() {
		this.invalid = false;
		if(this.invalidate != null) this.invalidate();
	}
	,setHtml: function(data) {
		var x = lib.haxe.xml.Parser.parse(data).firstElement();
		this.ids = new Hash();
		this.domRoot = this.make(x);
		this.refresh();
	}
	,register: function(id,d) {
		this.ids.set(id,d);
	}
	,styleProxy: null
	,invalidate: null
	,setAttribute: null
	,appendChild: null
	,createTextNode: null
	,createElement: null
	,invalid: null
	,ids: null
	,domRoot: null
	,html: null
	,__class__: lib.hxtml.Browser
}
lib.hxtml.Token = $hxClasses["lib.hxtml.Token"] = { __ename__ : ["lib","hxtml","Token"], __constructs__ : ["TIdent","TString","TInt","TFloat","TDblDot","TSharp","TPOpen","TPClose","TExclam","TComma","TEof","TPercent","TSemicolon","TBrOpen","TBrClose","TDot","TSpaces","TSlash"] }
lib.hxtml.Token.TIdent = function(i) { var $x = ["TIdent",0,i]; $x.__enum__ = lib.hxtml.Token; $x.toString = $estr; return $x; }
lib.hxtml.Token.TString = function(s) { var $x = ["TString",1,s]; $x.__enum__ = lib.hxtml.Token; $x.toString = $estr; return $x; }
lib.hxtml.Token.TInt = function(i) { var $x = ["TInt",2,i]; $x.__enum__ = lib.hxtml.Token; $x.toString = $estr; return $x; }
lib.hxtml.Token.TFloat = function(f) { var $x = ["TFloat",3,f]; $x.__enum__ = lib.hxtml.Token; $x.toString = $estr; return $x; }
lib.hxtml.Token.TDblDot = ["TDblDot",4];
lib.hxtml.Token.TDblDot.toString = $estr;
lib.hxtml.Token.TDblDot.__enum__ = lib.hxtml.Token;
lib.hxtml.Token.TSharp = ["TSharp",5];
lib.hxtml.Token.TSharp.toString = $estr;
lib.hxtml.Token.TSharp.__enum__ = lib.hxtml.Token;
lib.hxtml.Token.TPOpen = ["TPOpen",6];
lib.hxtml.Token.TPOpen.toString = $estr;
lib.hxtml.Token.TPOpen.__enum__ = lib.hxtml.Token;
lib.hxtml.Token.TPClose = ["TPClose",7];
lib.hxtml.Token.TPClose.toString = $estr;
lib.hxtml.Token.TPClose.__enum__ = lib.hxtml.Token;
lib.hxtml.Token.TExclam = ["TExclam",8];
lib.hxtml.Token.TExclam.toString = $estr;
lib.hxtml.Token.TExclam.__enum__ = lib.hxtml.Token;
lib.hxtml.Token.TComma = ["TComma",9];
lib.hxtml.Token.TComma.toString = $estr;
lib.hxtml.Token.TComma.__enum__ = lib.hxtml.Token;
lib.hxtml.Token.TEof = ["TEof",10];
lib.hxtml.Token.TEof.toString = $estr;
lib.hxtml.Token.TEof.__enum__ = lib.hxtml.Token;
lib.hxtml.Token.TPercent = ["TPercent",11];
lib.hxtml.Token.TPercent.toString = $estr;
lib.hxtml.Token.TPercent.__enum__ = lib.hxtml.Token;
lib.hxtml.Token.TSemicolon = ["TSemicolon",12];
lib.hxtml.Token.TSemicolon.toString = $estr;
lib.hxtml.Token.TSemicolon.__enum__ = lib.hxtml.Token;
lib.hxtml.Token.TBrOpen = ["TBrOpen",13];
lib.hxtml.Token.TBrOpen.toString = $estr;
lib.hxtml.Token.TBrOpen.__enum__ = lib.hxtml.Token;
lib.hxtml.Token.TBrClose = ["TBrClose",14];
lib.hxtml.Token.TBrClose.toString = $estr;
lib.hxtml.Token.TBrClose.__enum__ = lib.hxtml.Token;
lib.hxtml.Token.TDot = ["TDot",15];
lib.hxtml.Token.TDot.toString = $estr;
lib.hxtml.Token.TDot.__enum__ = lib.hxtml.Token;
lib.hxtml.Token.TSpaces = ["TSpaces",16];
lib.hxtml.Token.TSpaces.toString = $estr;
lib.hxtml.Token.TSpaces.__enum__ = lib.hxtml.Token;
lib.hxtml.Token.TSlash = ["TSlash",17];
lib.hxtml.Token.TSlash.toString = $estr;
lib.hxtml.Token.TSlash.__enum__ = lib.hxtml.Token;
lib.hxtml.Value = $hxClasses["lib.hxtml.Value"] = { __ename__ : ["lib","hxtml","Value"], __constructs__ : ["VIdent","VString","VUnit","VRGBA","VRGB","VFloat","VInt","VHex","VList","VGroup","VUrl","VLabel","VSlash"] }
lib.hxtml.Value.VIdent = function(i) { var $x = ["VIdent",0,i]; $x.__enum__ = lib.hxtml.Value; $x.toString = $estr; return $x; }
lib.hxtml.Value.VString = function(s) { var $x = ["VString",1,s]; $x.__enum__ = lib.hxtml.Value; $x.toString = $estr; return $x; }
lib.hxtml.Value.VUnit = function(v,unit) { var $x = ["VUnit",2,v,unit]; $x.__enum__ = lib.hxtml.Value; $x.toString = $estr; return $x; }
lib.hxtml.Value.VRGBA = function(v) { var $x = ["VRGBA",3,v]; $x.__enum__ = lib.hxtml.Value; $x.toString = $estr; return $x; }
lib.hxtml.Value.VRGB = function(v) { var $x = ["VRGB",4,v]; $x.__enum__ = lib.hxtml.Value; $x.toString = $estr; return $x; }
lib.hxtml.Value.VFloat = function(v) { var $x = ["VFloat",5,v]; $x.__enum__ = lib.hxtml.Value; $x.toString = $estr; return $x; }
lib.hxtml.Value.VInt = function(v) { var $x = ["VInt",6,v]; $x.__enum__ = lib.hxtml.Value; $x.toString = $estr; return $x; }
lib.hxtml.Value.VHex = function(v) { var $x = ["VHex",7,v]; $x.__enum__ = lib.hxtml.Value; $x.toString = $estr; return $x; }
lib.hxtml.Value.VList = function(l) { var $x = ["VList",8,l]; $x.__enum__ = lib.hxtml.Value; $x.toString = $estr; return $x; }
lib.hxtml.Value.VGroup = function(l) { var $x = ["VGroup",9,l]; $x.__enum__ = lib.hxtml.Value; $x.toString = $estr; return $x; }
lib.hxtml.Value.VUrl = function(v) { var $x = ["VUrl",10,v]; $x.__enum__ = lib.hxtml.Value; $x.toString = $estr; return $x; }
lib.hxtml.Value.VLabel = function(v,val) { var $x = ["VLabel",11,v,val]; $x.__enum__ = lib.hxtml.Value; $x.toString = $estr; return $x; }
lib.hxtml.Value.VSlash = ["VSlash",12];
lib.hxtml.Value.VSlash.toString = $estr;
lib.hxtml.Value.VSlash.__enum__ = lib.hxtml.Value;
lib.hxtml.CssParser = function() {
};
$hxClasses["lib.hxtml.CssParser"] = lib.hxtml.CssParser;
lib.hxtml.CssParser.__name__ = ["lib","hxtml","CssParser"];
lib.hxtml.CssParser.prototype = {
	readToken: function() {
		var t = this.tokens.pop();
		if(t != null) return t;
		while(true) {
			var c = this.css.charCodeAt(this.pos++);
			if(c != c) return lib.hxtml.Token.TEof;
			if(c == 32 || c == 10 || c == 13 || c == 9) {
				if(this.spacesTokens) {
					while(this.isSpace(this.css.charCodeAt(this.pos++))) {
					}
					this.pos--;
					return lib.hxtml.Token.TSpaces;
				}
				continue;
			}
			if(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c == 45) {
				var pos = this.pos - 1;
				do c = this.css.charCodeAt(this.pos++); while(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c == 45);
				this.pos--;
				return lib.hxtml.Token.TIdent(HxOverrides.substr(this.css,pos,this.pos - pos).toLowerCase());
			}
			if(c >= 48 && c <= 57) {
				var i = 0;
				do {
					i = i * 10 + (c - 48);
					c = this.css.charCodeAt(this.pos++);
				} while(c >= 48 && c <= 57);
				if(c == 46) {
					var f = i;
					var k = 0.1;
					while(this.isNum(c = this.css.charCodeAt(this.pos++))) {
						f += (c - 48) * k;
						k *= 0.1;
					}
					this.pos--;
					return lib.hxtml.Token.TFloat(f);
				}
				this.pos--;
				return lib.hxtml.Token.TInt(i);
			}
			switch(c) {
			case 58:
				return lib.hxtml.Token.TDblDot;
			case 35:
				return lib.hxtml.Token.TSharp;
			case 40:
				return lib.hxtml.Token.TPOpen;
			case 41:
				return lib.hxtml.Token.TPClose;
			case 33:
				return lib.hxtml.Token.TExclam;
			case 37:
				return lib.hxtml.Token.TPercent;
			case 59:
				return lib.hxtml.Token.TSemicolon;
			case 46:
				return lib.hxtml.Token.TDot;
			case 123:
				return lib.hxtml.Token.TBrOpen;
			case 125:
				return lib.hxtml.Token.TBrClose;
			case 44:
				return lib.hxtml.Token.TComma;
			case 47:
				if((c = this.css.charCodeAt(this.pos++)) != 42) {
					this.pos--;
					return lib.hxtml.Token.TSlash;
				}
				while(true) {
					while((c = this.css.charCodeAt(this.pos++)) != 42) if(c != c) throw "Unclosed comment";
					c = this.css.charCodeAt(this.pos++);
					if(c == 47) break;
					if(c != c) throw "Unclosed comment";
				}
				return this.readToken();
			case 39:case 34:
				var pos = this.pos;
				var k;
				while((k = this.css.charCodeAt(this.pos++)) != c) {
					if(k != k) throw "Unclosed string constant";
					if(k == 92) {
						throw "todo";
						continue;
					}
				}
				return lib.hxtml.Token.TString(HxOverrides.substr(this.css,pos,this.pos - pos - 1));
			default:
			}
			this.pos--;
			throw "Invalid char " + this.css.charAt(this.pos);
		}
		return null;
	}
	,readRGB: function() {
		var c = this.css.charCodeAt(this.pos++);
		while(c == 32 || c == 10 || c == 13 || c == 9) c = this.css.charCodeAt(this.pos++);
		var start = this.pos - 1;
		while(true) {
			if(c != c) break;
			c = this.css.charCodeAt(this.pos++);
			if(c == 41) break;
		}
		return StringTools.trim(HxOverrides.substr(this.css,start,this.pos - start - 1));
	}
	,readRGBA: function() {
		var c = this.css.charCodeAt(this.pos++);
		while(c == 32 || c == 10 || c == 13 || c == 9) c = this.css.charCodeAt(this.pos++);
		var start = this.pos - 1;
		while(true) {
			if(c != c) break;
			c = this.css.charCodeAt(this.pos++);
			if(c == 41) break;
		}
		return StringTools.trim(HxOverrides.substr(this.css,start,this.pos - start - 1));
	}
	,readUrl: function() {
		var c0 = this.css.charCodeAt(this.pos++);
		while(c0 == 32 || c0 == 10 || c0 == 13 || c0 == 9) c0 = this.css.charCodeAt(this.pos++);
		var quote = c0;
		if(quote == 39 || quote == 34) {
			this.pos--;
			var $e = (this.readToken());
			switch( $e[1] ) {
			case 1:
				var s = $e[2];
				var c01 = this.css.charCodeAt(this.pos++);
				while(c01 == 32 || c01 == 10 || c01 == 13 || c01 == 9) c01 = this.css.charCodeAt(this.pos++);
				if(c01 != 41) throw "Invalid char " + String.fromCharCode(c01);
				return s;
			default:
				throw "assert";
			}
		}
		var start = this.pos - 1;
		while(true) {
			if(c0 != c0) break;
			c0 = this.css.charCodeAt(this.pos++);
			if(c0 == 41) break;
		}
		return StringTools.trim(HxOverrides.substr(this.css,start,this.pos - start - 1));
	}
	,next: function() {
		return this.css.charCodeAt(this.pos++);
	}
	,isNum: function(c) {
		return c >= 48 && c <= 57;
	}
	,isIdentChar: function(c) {
		return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c == 45;
	}
	,isSpace: function(c) {
		return c == 32 || c == 10 || c == 13 || c == 9;
	}
	,loopComma: function(v,v2) {
		return (function($this) {
			var $r;
			var $e = (v2);
			switch( $e[1] ) {
			case 8:
				var l = $e[2];
				$r = (function($this) {
					var $r;
					l.unshift(v);
					$r = v2;
					return $r;
				}($this));
				break;
			case 11:
				var v21 = $e[3], lab = $e[2];
				$r = lib.hxtml.Value.VLabel(lab,$this.loopComma(v,v21));
				break;
			default:
				$r = lib.hxtml.Value.VList([v,v2]);
			}
			return $r;
		}(this));
	}
	,loopNext: function(v,v2) {
		return (function($this) {
			var $r;
			var $e = (v2);
			switch( $e[1] ) {
			case 9:
				var l = $e[2];
				$r = (function($this) {
					var $r;
					l.unshift(v);
					$r = v2;
					return $r;
				}($this));
				break;
			case 8:
				var l = $e[2];
				$r = (function($this) {
					var $r;
					l[0] = $this.loopNext(v,l[0]);
					$r = v2;
					return $r;
				}($this));
				break;
			case 11:
				var v21 = $e[3], lab = $e[2];
				$r = lib.hxtml.Value.VLabel(lab,$this.loopNext(v,v21));
				break;
			default:
				$r = lib.hxtml.Value.VGroup([v,v2]);
			}
			return $r;
		}(this));
	}
	,readValueNext: function(v) {
		var t = this.readToken();
		return (function($this) {
			var $r;
			switch( (t)[1] ) {
			case 6:
				$r = (function($this) {
					var $r;
					var $e = (v);
					switch( $e[1] ) {
					case 0:
						var i = $e[2];
						$r = (function($this) {
							var $r;
							switch(i) {
							case "url":
								$r = $this.readValueNext(lib.hxtml.Value.VUrl($this.readUrl()));
								break;
							case "rgba":
								$r = $this.readValueNext(lib.hxtml.Value.VRGBA($this.readRGBA()));
								break;
							case "rgb":
								$r = $this.readValueNext(lib.hxtml.Value.VRGB($this.readRGB()));
								break;
							default:
								$r = (function($this) {
									var $r;
									$this.tokens.push(t);
									$r = v;
									return $r;
								}($this));
							}
							return $r;
						}($this));
						break;
					default:
						$r = (function($this) {
							var $r;
							$this.tokens.push(t);
							$r = v;
							return $r;
						}($this));
					}
					return $r;
				}($this));
				break;
			case 8:
				$r = (function($this) {
					var $r;
					var t1 = $this.readToken();
					$r = (function($this) {
						var $r;
						var $e = (t1);
						switch( $e[1] ) {
						case 0:
							var i = $e[2];
							$r = lib.hxtml.Value.VLabel(i,v);
							break;
						default:
							$r = $this.unexpected(t1);
						}
						return $r;
					}($this));
					return $r;
				}($this));
				break;
			case 9:
				$r = $this.loopComma(v,$this.readValue());
				break;
			default:
				$r = (function($this) {
					var $r;
					$this.tokens.push(t);
					var v2 = $this.readValue(true);
					$r = v2 == null?v:$this.loopNext(v,v2);
					return $r;
				}($this));
			}
			return $r;
		}(this));
	}
	,readValueUnit: function(f,i) {
		var t = this.readToken();
		return (function($this) {
			var $r;
			var $e = (t);
			switch( $e[1] ) {
			case 0:
				var i1 = $e[2];
				$r = lib.hxtml.Value.VUnit(f,i1);
				break;
			case 11:
				$r = lib.hxtml.Value.VUnit(f,"%");
				break;
			default:
				$r = (function($this) {
					var $r;
					$this.tokens.push(t);
					$r = i != null?lib.hxtml.Value.VInt(i):lib.hxtml.Value.VFloat(f);
					return $r;
				}($this));
			}
			return $r;
		}(this));
	}
	,readHex: function() {
		var start = this.pos;
		while(true) {
			var c = this.css.charCodeAt(this.pos++);
			if(c >= 65 && c <= 70 || c >= 97 && c <= 102 || c >= 48 && c <= 57) continue;
			this.pos--;
			break;
		}
		return HxOverrides.substr(this.css,start,this.pos - start);
	}
	,readValue: function(opt) {
		var t = this.readToken();
		var v = (function($this) {
			var $r;
			var $e = (t);
			switch( $e[1] ) {
			case 5:
				$r = lib.hxtml.Value.VHex($this.readHex());
				break;
			case 0:
				var i = $e[2];
				$r = lib.hxtml.Value.VIdent(i);
				break;
			case 1:
				var s = $e[2];
				$r = lib.hxtml.Value.VString(s);
				break;
			case 2:
				var i = $e[2];
				$r = $this.readValueUnit(i,i);
				break;
			case 3:
				var f = $e[2];
				$r = $this.readValueUnit(f,null);
				break;
			case 17:
				$r = lib.hxtml.Value.VSlash;
				break;
			default:
				$r = (function($this) {
					var $r;
					if(!opt) $this.unexpected(t);
					$this.tokens.push(t);
					$r = null;
					return $r;
				}($this));
			}
			return $r;
		}(this));
		if(v != null) v = this.readValueNext(v);
		return v;
	}
	,readIdent: function() {
		var t = this.readToken();
		return (function($this) {
			var $r;
			var $e = (t);
			switch( $e[1] ) {
			case 0:
				var i = $e[2];
				$r = i;
				break;
			default:
				$r = $this.unexpected(t);
			}
			return $r;
		}(this));
	}
	,parseStyle: function(eof) {
		while(true) {
			if(this.isToken(eof)) break;
			var r = this.readIdent();
			this.expect(lib.hxtml.Token.TDblDot);
			var v = this.readValue();
			var s = this.s;
			var $e = (v);
			switch( $e[1] ) {
			case 11:
				var val = $e[3], label = $e[2];
				if(label == "important") v = val;
				break;
			default:
			}
			if(!this.applyStyle(r,v,s)) throw "Invalid value " + Std.string(v) + " for css " + r;
			if(this.isToken(eof)) break;
			this.expect(lib.hxtml.Token.TSemicolon);
		}
	}
	,parse: function(css,d,s) {
		this.css = css;
		this.s = s;
		this.d = d;
		this.pos = 0;
		this.tokens = [];
		this.parseStyle(lib.hxtml.Token.TEof);
	}
	,isToken: function(t) {
		var tk = this.readToken();
		if(tk == t) return true;
		this.tokens.push(tk);
		return false;
	}
	,push: function(t) {
		this.tokens.push(t);
	}
	,expect: function(t) {
		var tk = this.readToken();
		if(tk != t) this.unexpected(tk);
	}
	,unexpected: function(t) {
		throw "Unexpected " + Std.string(t);
		return null;
	}
	,getFontName: function(v) {
		return (function($this) {
			var $r;
			var $e = (v);
			switch( $e[1] ) {
			case 1:
				var s = $e[2];
				$r = s;
				break;
			case 9:
				$r = (function($this) {
					var $r;
					var g = $this.getGroup(v,$bind($this,$this.getIdent));
					$r = g == null?null:g.join(" ");
					return $r;
				}($this));
				break;
			case 0:
				var i = $e[2];
				$r = i;
				break;
			default:
				$r = null;
			}
			return $r;
		}(this));
	}
	,getCol: function(v) {
		return (function($this) {
			var $r;
			var $e = (v);
			switch( $e[1] ) {
			case 7:
				var v1 = $e[2];
				$r = v1.length == 6?Std.parseInt("0x" + v1):v1.length == 3?Std.parseInt("0x" + v1.charAt(0) + v1.charAt(0) + v1.charAt(1) + v1.charAt(1) + v1.charAt(2) + v1.charAt(2)):null;
				break;
			case 0:
				var i = $e[2];
				$r = (function($this) {
					var $r;
					switch(i) {
					case "black":
						$r = 0;
						break;
					case "red":
						$r = 16711680;
						break;
					case "lime":
						$r = 65280;
						break;
					case "blue":
						$r = 255;
						break;
					case "white":
						$r = 16777215;
						break;
					case "aqua":
						$r = 65535;
						break;
					case "fuchsia":
						$r = 16711935;
						break;
					case "yellow":
						$r = 16776960;
						break;
					case "maroon":
						$r = 8388608;
						break;
					case "green":
						$r = 32768;
						break;
					case "navy":
						$r = 128;
						break;
					case "olive":
						$r = 8421376;
						break;
					case "purple":
						$r = 8388736;
						break;
					case "teal":
						$r = 32896;
						break;
					case "silver":
						$r = 12632256;
						break;
					case "gray":case "grey":
						$r = 8421504;
						break;
					default:
						$r = null;
					}
					return $r;
				}($this));
				break;
			default:
				$r = null;
			}
			return $r;
		}(this));
	}
	,getIdent: function(v) {
		return (function($this) {
			var $r;
			var $e = (v);
			switch( $e[1] ) {
			case 0:
				var v1 = $e[2];
				$r = v1;
				break;
			default:
				$r = null;
			}
			return $r;
		}(this));
	}
	,getPix: function(v) {
		return (function($this) {
			var $r;
			var $e = (v);
			switch( $e[1] ) {
			case 2:
				var u = $e[3], f = $e[2];
				$r = (function($this) {
					var $r;
					switch(u) {
					case "px":
						$r = f | 0;
						break;
					case "pt":
						$r = f * 4 / 3 | 0;
						break;
					default:
						$r = null;
					}
					return $r;
				}($this));
				break;
			case 6:
				var v1 = $e[2];
				$r = v1;
				break;
			default:
				$r = null;
			}
			return $r;
		}(this));
	}
	,getList: function(v,f) {
		var $e = (v);
		switch( $e[1] ) {
		case 8:
			var l = $e[2];
			var a = [];
			var _g = 0;
			while(_g < l.length) {
				var v1 = l[_g];
				++_g;
				var v2 = f(v1);
				if(v2 == null) return null;
				a.push(v2);
			}
			return a;
		default:
			var v1 = f(v);
			return v1 == null?null:[v1];
		}
	}
	,getGroup: function(v,f) {
		var $e = (v);
		switch( $e[1] ) {
		case 9:
			var l = $e[2];
			var a = [];
			var _g = 0;
			while(_g < l.length) {
				var v1 = l[_g];
				++_g;
				var v2 = f(v1);
				if(v2 == null) return null;
				a.push(v2);
			}
			return a;
		default:
			var v1 = f(v);
			return v1 == null?null:[v1];
		}
	}
	,isNullInt: function(v) {
		return (function($this) {
			var $r;
			var $e = (v);
			switch( $e[1] ) {
			case 6:
				var v1 = $e[2];
				$r = v1 == 0;
				break;
			default:
				$r = false;
			}
			return $r;
		}(this));
	}
	,getValueObject: function(i) {
		return (function($this) {
			var $r;
			var $e = (i);
			switch( $e[1] ) {
			case 2:
				var u = $e[3], v = $e[2];
				$r = { value : v, unit : u};
				break;
			default:
				$r = null;
			}
			return $r;
		}(this));
	}
	,applyComposite: function(names,v,s) {
		var vl = (function($this) {
			var $r;
			var $e = (v);
			switch( $e[1] ) {
			case 9:
				var l = $e[2];
				$r = l;
				break;
			default:
				$r = [v];
			}
			return $r;
		}(this));
		while(vl.length > 0) {
			var found = false;
			var _g = 0;
			while(_g < names.length) {
				var n = names[_g];
				++_g;
				var count = (function($this) {
					var $r;
					switch(n) {
					case "background-position":
						$r = 2;
						break;
					default:
						$r = 1;
					}
					return $r;
				}(this));
				if(count > vl.length) count = vl.length;
				while(count > 0) {
					var v1 = count == 1?vl[0]:lib.hxtml.Value.VGroup(vl.slice(0,count));
					if(this.applyStyle(n,v1,s)) {
						found = true;
						HxOverrides.remove(names,n);
						var _g1 = 0;
						while(_g1 < count) {
							var i = _g1++;
							vl.shift();
						}
						break;
					}
					count--;
				}
				if(found) break;
			}
			if(!found) return false;
		}
		return true;
	}
	,applyStyle: function(r,v,s) {
		switch(r) {
		case "margin":
			var i = this.isNullInt(v);
			if(i) {
				s.setMarginBottomZero(this.d);
				s.setMarginTopZero(this.d);
				s.setMarginLeftZero(this.d);
				s.setMarginRightZero(this.d);
				return true;
			}
			var vl = (function($this) {
				var $r;
				var $e = (v);
				switch( $e[1] ) {
				case 9:
					var l = $e[2];
					$r = l;
					break;
				default:
					$r = [v];
				}
				return $r;
			}(this));
			var vUnits = new Array();
			var _g = 0;
			while(_g < vl.length) {
				var i1 = vl[_g];
				++_g;
				var vo = this.getValueObject(i1);
				if(vo != null) vUnits.push(vo);
			}
			switch(vUnits.length) {
			case 1:
				s.setMarginTopNum(this.d,vUnits[0].value,vUnits[0].unit);
				s.setMarginRightNum(this.d,vUnits[0].value,vUnits[0].unit);
				s.setMarginBottomNum(this.d,vUnits[0].value,vUnits[0].unit);
				s.setMarginLeftNum(this.d,vUnits[0].value,vUnits[0].unit);
				return true;
			case 2:
				s.setMarginTopNum(this.d,vUnits[0].value,vUnits[0].unit);
				s.setMarginRightNum(this.d,vUnits[1].value,vUnits[1].unit);
				s.setMarginBottomNum(this.d,vUnits[0].value,vUnits[0].unit);
				s.setMarginLeftNum(this.d,vUnits[1].value,vUnits[1].unit);
				return true;
			case 3:
				s.setMarginTopNum(this.d,vUnits[0].value,vUnits[0].unit);
				s.setMarginRightNum(this.d,vUnits[1].value,vUnits[1].unit);
				s.setMarginBottomNum(this.d,vUnits[2].value,vUnits[2].unit);
				s.setMarginLeftNum(this.d,vUnits[1].value,vUnits[1].unit);
				return true;
			case 4:
				s.setMarginTopNum(this.d,vUnits[0].value,vUnits[0].unit);
				s.setMarginRightNum(this.d,vUnits[1].value,vUnits[1].unit);
				s.setMarginBottomNum(this.d,vUnits[2].value,vUnits[2].unit);
				s.setMarginLeftNum(this.d,vUnits[3].value,vUnits[3].unit);
				return true;
			}
			break;
		case "margin-left":
			var val = this.getIdent(v);
			if(val != null) {
				s.setMarginLeftKey(this.d,val);
				return true;
			}
			var $e = (v);
			switch( $e[1] ) {
			case 9:
				var a = $e[2];
				var $e = (a[1]);
				switch( $e[1] ) {
				case 2:
					var u = $e[3], v1 = $e[2];
					s.setMarginLeftNum(this.d,v1 * -1,u);
					return true;
				default:
				}
				break;
			default:
			}
			var i = this.isNullInt(v);
			if(i) {
				s.setMarginLeftZero(this.d);
				return true;
			}
			var l = this.getValueObject(v);
			if(l != null) {
				s.setMarginLeftNum(this.d,l.value,l.unit);
				return true;
			}
			break;
		case "margin-right":
			var val = this.getIdent(v);
			if(val != null) {
				s.setMarginRightKey(this.d,val);
				return true;
			}
			var $e = (v);
			switch( $e[1] ) {
			case 9:
				var a = $e[2];
				var $e = (a[1]);
				switch( $e[1] ) {
				case 2:
					var u = $e[3], v1 = $e[2];
					s.setMarginRightNum(this.d,v1 * -1,u);
					return true;
				default:
				}
				break;
			default:
			}
			var i = this.isNullInt(v);
			if(i) {
				s.setMarginRightZero(this.d);
				return true;
			}
			var l = this.getValueObject(v);
			if(l != null) {
				s.setMarginRightNum(this.d,l.value,l.unit);
				return true;
			}
			break;
		case "margin-top":
			var $e = (v);
			switch( $e[1] ) {
			case 9:
				var a = $e[2];
				var $e = (a[1]);
				switch( $e[1] ) {
				case 2:
					var u = $e[3], v1 = $e[2];
					s.setMarginTopNum(this.d,v1 * -1,u);
					return true;
				default:
				}
				break;
			default:
			}
			var i = this.isNullInt(v);
			if(i) {
				s.setMarginTopZero(this.d);
				return true;
			}
			var val = this.getIdent(v);
			if(val != null) {
				s.setMarginTopKey(this.d,val);
				return true;
			}
			var l = this.getValueObject(v);
			if(l != null) {
				s.setMarginTopNum(this.d,l.value,l.unit);
				return true;
			}
			break;
		case "margin-bottom":
			var $e = (v);
			switch( $e[1] ) {
			case 9:
				var a = $e[2];
				var $e = (a[1]);
				switch( $e[1] ) {
				case 2:
					var u = $e[3], v1 = $e[2];
					s.setMarginBottomNum(this.d,v1 * -1,u);
					return true;
				default:
				}
				break;
			default:
			}
			var i = this.isNullInt(v);
			if(i) {
				s.setMarginBottomZero(this.d);
				return true;
			}
			var val = this.getIdent(v);
			if(val != null) {
				s.setMarginBottomKey(this.d,val);
				return true;
			}
			var l = this.getValueObject(v);
			if(l != null) {
				s.setMarginBottomNum(this.d,l.value,l.unit);
				return true;
			}
			break;
		case "padding":
			var vl = (function($this) {
				var $r;
				var $e = (v);
				switch( $e[1] ) {
				case 9:
					var l = $e[2];
					$r = l;
					break;
				default:
					$r = [v];
				}
				return $r;
			}(this));
			var vUnits = new Array();
			var _g = 0;
			while(_g < vl.length) {
				var i = vl[_g];
				++_g;
				var vo = this.getValueObject(i);
				if(vo != null) vUnits.push(vo);
			}
			switch(vUnits.length) {
			case 1:
				s.setPaddingTop(this.d,vUnits[0].value,vUnits[0].unit);
				s.setPaddingRight(this.d,vUnits[0].value,vUnits[0].unit);
				s.setPaddingBottom(this.d,vUnits[0].value,vUnits[0].unit);
				s.setPaddingLeft(this.d,vUnits[0].value,vUnits[0].unit);
				return true;
			case 2:
				s.setPaddingTop(this.d,vUnits[0].value,vUnits[0].unit);
				s.setPaddingRight(this.d,vUnits[1].value,vUnits[1].unit);
				s.setPaddingBottom(this.d,vUnits[0].value,vUnits[0].unit);
				s.setPaddingLeft(this.d,vUnits[1].value,vUnits[1].unit);
				return true;
			case 3:
				s.setPaddingTop(this.d,vUnits[0].value,vUnits[0].unit);
				s.setPaddingRight(this.d,vUnits[1].value,vUnits[1].unit);
				s.setPaddingBottom(this.d,vUnits[2].value,vUnits[2].unit);
				s.setPaddingLeft(this.d,vUnits[1].value,vUnits[1].unit);
				return true;
			case 4:
				s.setPaddingTop(this.d,vUnits[0].value,vUnits[0].unit);
				s.setPaddingRight(this.d,vUnits[1].value,vUnits[1].unit);
				s.setPaddingBottom(this.d,vUnits[2].value,vUnits[2].unit);
				s.setPaddingLeft(this.d,vUnits[3].value,vUnits[3].unit);
				return true;
			}
			break;
		case "padding-left":
			var i = this.getValueObject(v);
			if(i != null) {
				s.setPaddingLeft(this.d,i.value,i.unit);
				return true;
			}
			break;
		case "padding-right":
			var i = this.getValueObject(v);
			if(i != null) {
				s.setPaddingRight(this.d,i.value,i.unit);
				return true;
			}
			break;
		case "padding-top":
			var i = this.getValueObject(v);
			if(i != null) {
				s.setPaddingTop(this.d,i.value,i.unit);
				return true;
			}
			break;
		case "padding-bottom":
			var i = this.getValueObject(v);
			if(i != null) {
				s.setPaddingBottom(this.d,i.value,i.unit);
				return true;
			}
			break;
		case "width":
			var val = this.getIdent(v);
			if(val != null) {
				s.setWidthKey(this.d,val);
				return true;
			}
			var i = this.isNullInt(v);
			if(i) {
				s.setWidthZero(this.d);
				return true;
			}
			var i1 = this.getValueObject(v);
			if(i1 != null) {
				s.setWidth(this.d,i1.value,i1.unit);
				return true;
			}
			break;
		case "height":
			var val = this.getIdent(v);
			if(val != null) {
				s.setHeightKey(this.d,val);
				return true;
			}
			var i = this.getValueObject(v);
			if(i != null) {
				s.setHeight(this.d,i.value,i.unit);
				return true;
			}
			break;
		case "min-width":
			var i = this.isNullInt(v);
			if(i) {
				s.setMinWidthZero(this.d);
				return true;
			}
			var i1 = this.getValueObject(v);
			if(i1 != null) {
				s.setMinWidth(this.d,i1.value,i1.unit);
				return true;
			}
			break;
		case "min-height":
			var i = this.isNullInt(v);
			if(i) {
				s.setMinHeightZero(this.d);
				return true;
			}
			var i1 = this.getValueObject(v);
			if(i1 != null) {
				s.setMinHeight(this.d,i1.value,i1.unit);
				return true;
			}
			break;
		case "max-height":
			var i = this.isNullInt(v);
			if(i) {
				s.setMaxHeightZero(this.d);
				return true;
			}
			var val = this.getIdent(v);
			if(val != null) {
				s.setMaxHeightKey(this.d,val);
				return true;
			}
			var i1 = this.getValueObject(v);
			if(i1 != null) {
				s.setMaxHeight(this.d,i1.value,i1.unit);
				return true;
			}
			break;
		case "max-width":
			var i = this.isNullInt(v);
			if(i) {
				s.setMaxWidthZero(this.d);
				return true;
			}
			var val = this.getIdent(v);
			if(val != null) {
				s.setMaxWidthKey(this.d,val);
				return true;
			}
			var i1 = this.getValueObject(v);
			if(i1 != null) {
				s.setMaxWidth(this.d,i1.value,i1.unit);
				return true;
			}
			break;
		case "background-color":
			var $e = (v);
			switch( $e[1] ) {
			case 7:
				var v1 = $e[2];
				s.setBgColorHex(this.d,v1);
				return true;
			case 3:
				var v1 = $e[2];
				s.setBgColorRGBA(this.d,v1);
				return true;
			case 4:
				var v1 = $e[2];
				s.setBgColorRGB(this.d,v1);
				return true;
			case 0:
				var i = $e[2];
				s.setBgColorKey(this.d,i);
				return true;
			default:
				haxe.Log.trace(v,{ fileName : "CssParser.hx", lineNumber : 445, className : "lib.hxtml.CssParser", methodName : "applyStyle"});
				return true;
			}
			break;
		case "background-repeat":
			s.setBgRepeat(this.d,[this.getIdent(v)]);
			return true;
		case "background-image":
			var $e = (v);
			switch( $e[1] ) {
			case 10:
				var url = $e[2];
				s.setBgImage(this.d,[url]);
				return true;
			case 0:
				var i = $e[2];
				s.setBgImage(this.d,[i]);
				return true;
			default:
			}
			break;
		case "background-attachment":
			s.setBgAttachment(this.d,this.getIdent(v));
			return true;
		case "background-position":
			var vl = (function($this) {
				var $r;
				var $e = (v);
				switch( $e[1] ) {
				case 9:
					var l = $e[2];
					$r = l;
					break;
				default:
					$r = [v];
				}
				return $r;
			}(this));
			var str = "";
			var _g1 = 0, _g = vl.length;
			while(_g1 < _g) {
				var i = _g1++;
				var $e = (vl[i]);
				switch( $e[1] ) {
				case 0:
					var v1 = $e[2];
					if(i == 0) str += v1 + " "; else str += v1;
					break;
				case 2:
					var u = $e[3], v1 = $e[2];
					if(i == 0) str += Std.string(v1) + u + " "; else str += Std.string(v1) + u;
					break;
				default:
				}
			}
			s.setBgPos(this.d,str);
			return true;
		case "background":
			return this.applyComposite(["background-color","background-image","background-repeat","background-attachment","background-position"],v,s);
		case "font-family":
			var l = this.getList(v,$bind(this,this.getFontName));
			if(l != null) {
				s.setFontFamily(this.d,l);
				return true;
			}
			break;
		case "font-style":
			s.setFontStyle(this.d,this.getIdent(v));
			return true;
		case "font-variant":
			s.setFontVariant(this.d,this.getIdent(v));
			return true;
		case "font-weight":
			var val = this.getIdent(v);
			if(val != null) {
				s.setFontWeightKey(this.d,val);
				return true;
			}
			var $e = (v);
			switch( $e[1] ) {
			case 6:
				var i = $e[2];
				s.setFontWeightNum(this.d,i);
				return true;
			default:
			}
			break;
		case "font-size":
			var val = this.getIdent(v);
			if(val != null) {
				s.setFontSizeKey(this.d,val);
				return true;
			}
			var l = this.getValueObject(v);
			if(l != null) {
				s.setFontSizeNum(this.d,l.value,l.unit);
				return true;
			}
			break;
		case "font":
			var vl = (function($this) {
				var $r;
				var $e = (v);
				switch( $e[1] ) {
				case 9:
					var l = $e[2];
					$r = l;
					break;
				default:
					$r = [v];
				}
				return $r;
			}(this));
			var v1 = lib.hxtml.Value.VGroup(vl);
			this.applyComposite(["font-style","font-variant","font-weight"],v1,s);
			this.applyComposite(["font-size"],v1,s);
			if(vl.length > 0) {
				switch( (vl[0])[1] ) {
				case 12:
					vl.shift();
					break;
				default:
				}
			}
			this.applyComposite(["line-height"],v1,s);
			this.applyComposite(["font-family"],v1,s);
			if(vl.length == 0) return true;
			break;
		case "color":
			var $e = (v);
			switch( $e[1] ) {
			case 7:
				var v1 = $e[2];
				s.setTextColorNum(this.d,Std.parseInt(v1));
				return true;
			case 4:
				var v1 = $e[2];
				s.setTextColorRGB(this.d,v1);
				return true;
			case 3:
				var v1 = $e[2];
				s.setTextColorRGBA(this.d,v1);
				return true;
			case 0:
				var i = $e[2];
				s.setTextColorKey(this.d,i);
				return true;
			default:
			}
			break;
		case "text-decoration":
			var idents = this.getGroup(v,$bind(this,this.getIdent));
			var _g = 0;
			while(_g < idents.length) {
				var i = idents[_g];
				++_g;
				s.setTextDecoration(this.d,i);
			}
			return true;
		case "text-transform":
			var val = this.getIdent(v);
			if(val != null) {
				s.setTextTransform(this.d,val);
				return true;
			}
			break;
		case "white-space":
			var val = this.getIdent(v);
			if(val != null) {
				s.setWhiteSpace(this.d,val);
				return true;
			}
			break;
		case "z-index":
			var $e = (v);
			switch( $e[1] ) {
			case 9:
				var a = $e[2];
				var $e = (a[1]);
				switch( $e[1] ) {
				case 6:
					var v1 = $e[2];
					s.setZIndex(this.d,Std.string(v1 * -1));
					return true;
				default:
				}
				break;
			default:
			}
			var $e = (v);
			switch( $e[1] ) {
			case 6:
				var i = $e[2];
				s.setZIndex(this.d,Std.string(i));
				return true;
			default:
			}
			var val = this.getIdent(v);
			if(val != null) {
				s.setZIndex(this.d,val);
				return true;
			}
			break;
		case "line-height":
			var i = this.isNullInt(v);
			if(i) {
				s.setLineHeightZero(this.d);
				return true;
			}
			var val = this.getIdent(v);
			if(val != null) {
				s.setLineHeightKey(this.d,val);
				return true;
			}
			var l = this.getValueObject(v);
			if(l != null) {
				s.setLineHeightNum(this.d,l.value,l.unit);
				return true;
			}
			break;
		case "vertical-align":
			var val = this.getIdent(v);
			if(val != null) {
				s.setVerticalAlignKey(this.d,val);
				return true;
			}
			var l = this.getValueObject(v);
			if(l != null) {
				s.setVerticalAlignNum(this.d,l.value,l.unit);
				return true;
			}
			break;
		case "word-spacing":
			var val = this.getIdent(v);
			if(val != null) {
				s.setWordSpacingKey(this.d,val);
				return true;
			}
			var l = this.getValueObject(v);
			if(l != null) {
				s.setWordSpacingNum(this.d,l.value,l.unit);
				return true;
			}
			break;
		case "letter-spacing":
			var val = this.getIdent(v);
			if(val != null) {
				s.setLetterSpacingKey(this.d,val);
				return true;
			}
			var l = this.getValueObject(v);
			if(l != null) {
				s.setLetterSpacingNum(this.d,l.value,l.unit);
				return true;
			}
			break;
		case "text-indent":
			var l = this.getValueObject(v);
			if(l != null) {
				s.setTextIndent(this.d,l.value,l.unit);
				return true;
			}
			break;
		case "text-align":
			var val = this.getIdent(v);
			if(val != null) {
				s.setTextAlign(this.d,val);
				return true;
			}
			break;
		case "top":
			var $e = (v);
			switch( $e[1] ) {
			case 9:
				var a = $e[2];
				var $e = (a[1]);
				switch( $e[1] ) {
				case 2:
					var u = $e[3], v1 = $e[2];
					s.setTop(this.d,v1 * -1,u);
					return true;
				default:
				}
				break;
			default:
			}
			var val = this.getIdent(v);
			if(val != null) {
				s.setTopKey(this.d,val);
				return true;
			}
			var i = this.isNullInt(v);
			if(i) {
				s.setTopZero(this.d);
				return true;
			}
			var l = this.getValueObject(v);
			if(l != null) {
				s.setTop(this.d,l.value,l.unit);
				return true;
			}
			return true;
		case "left":
			var $e = (v);
			switch( $e[1] ) {
			case 9:
				var a = $e[2];
				var $e = (a[1]);
				switch( $e[1] ) {
				case 2:
					var u = $e[3], v1 = $e[2];
					s.setLeft(this.d,v1 * -1,u);
					return true;
				default:
				}
				break;
			default:
			}
			var val = this.getIdent(v);
			if(val != null) {
				s.setLeftKey(this.d,val);
				return true;
			}
			var i = this.isNullInt(v);
			if(i) {
				s.setLeftZero(this.d);
				return true;
			}
			var l = this.getValueObject(v);
			if(l != null) {
				s.setLeft(this.d,l.value,l.unit);
				return true;
			}
			return true;
		case "right":
			var $e = (v);
			switch( $e[1] ) {
			case 9:
				var a = $e[2];
				var $e = (a[1]);
				switch( $e[1] ) {
				case 2:
					var u = $e[3], v1 = $e[2];
					s.setRight(this.d,v1 * -1,u);
					return true;
				default:
				}
				break;
			default:
			}
			var val = this.getIdent(v);
			if(val != null) {
				s.setRightKey(this.d,val);
				return true;
			}
			var i = this.isNullInt(v);
			if(i) {
				s.setRightZero(this.d);
				return true;
			}
			var l = this.getValueObject(v);
			if(l != null) {
				s.setRight(this.d,l.value,l.unit);
				return true;
			}
			return true;
		case "bottom":
			var $e = (v);
			switch( $e[1] ) {
			case 9:
				var a = $e[2];
				var $e = (a[1]);
				switch( $e[1] ) {
				case 2:
					var u = $e[3], v1 = $e[2];
					s.setBottom(this.d,v1 * -1,u);
					return true;
				default:
				}
				break;
			default:
			}
			var val = this.getIdent(v);
			if(val != null) {
				s.setBottomKey(this.d,val);
				return true;
			}
			var i = this.isNullInt(v);
			if(i) {
				s.setBottomZero(this.d);
				return true;
			}
			var l = this.getValueObject(v);
			if(l != null) {
				s.setBottom(this.d,l.value,l.unit);
				return true;
			}
			return true;
		case "display":
			s.setDisplay(this.d,this.getIdent(v));
			return true;
		case "float":
			s.setCssFloat(this.d,this.getIdent(v));
			return true;
		case "clear":
			s.setClear(this.d,this.getIdent(v));
			return true;
		case "position":
			s.setPosition(this.d,this.getIdent(v));
			return true;
		case "overflow":
			var $e = (v);
			switch( $e[1] ) {
			case 9:
				var a = $e[2];
				var $e = (a[0]);
				switch( $e[1] ) {
				case 0:
					var v1 = $e[2];
					s.setOverflowX(this.d,v1);
					break;
				default:
				}
				var $e = (a[1]);
				switch( $e[1] ) {
				case 0:
					var v1 = $e[2];
					s.setOverflowY(this.d,v1);
					break;
				default:
				}
				return true;
			case 0:
				var v1 = $e[2];
				s.setOverflowX(this.d,v1);
				s.setOverflowY(this.d,v1);
				return true;
			default:
			}
			break;
		case "transition-property":
			var val = this.getIdent(v);
			if(val != null) s.setTransitionProperty(this.d,val);
			return true;
		case "transition-duration":
			var val = this.getIdent(v);
			if(val != null) s.setTransitionDuration(this.d,val);
			return true;
		case "transition-timing-function":
			var val = this.getIdent(v);
			if(val != null) s.setTransitionTimingFunction(this.d,val);
			return true;
		case "transition-delay":
			var val = this.getIdent(v);
			if(val != null) s.setTransitionDelay(this.d,val);
			return true;
		case "transform-origin":
			var val = this.getIdent(v);
			if(val != null) s.setTransformOrigin(this.d,val);
			return true;
		case "transform":
			var val = this.getIdent(v);
			if(val != null) s.setTransform(this.d,val);
			return true;
		default:
			throw "Not implemented '" + r + "' = " + Std.string(v);
		}
		return false;
	}
	,notImplemented: function() {
	}
	,tokens: null
	,spacesTokens: null
	,pos: null
	,d: null
	,s: null
	,css: null
	,__class__: lib.hxtml.CssParser
}
lib.hxtml.HxtmlConverter = function() { }
$hxClasses["lib.hxtml.HxtmlConverter"] = lib.hxtml.HxtmlConverter;
lib.hxtml.HxtmlConverter.__name__ = ["lib","hxtml","HxtmlConverter"];
lib.hxtml.IStyleProxy = function() { }
$hxClasses["lib.hxtml.IStyleProxy"] = lib.hxtml.IStyleProxy;
lib.hxtml.IStyleProxy.__name__ = ["lib","hxtml","IStyleProxy"];
lib.hxtml.IStyleProxy.prototype = {
	setZIndex: null
	,setOverflowY: null
	,setOverflowX: null
	,setWhiteSpace: null
	,setVerticalAlignKey: null
	,setVerticalAlignNum: null
	,setTextAlign: null
	,setWordSpacingKey: null
	,setWordSpacingNum: null
	,setLetterSpacingKey: null
	,setLetterSpacingNum: null
	,setTextIndent: null
	,setTextTransform: null
	,setLineHeightKey: null
	,setLineHeightZero: null
	,setLineHeightNum: null
	,setTextDecoration: null
	,setTextColorRGB: null
	,setTextColorRGBA: null
	,setTextColorNum: null
	,setTextColorKey: null
	,setFontVariant: null
	,setFontFamily: null
	,setFontStyle: null
	,setFontWeightNum: null
	,setFontWeightKey: null
	,setFontSizeKey: null
	,setFontSizeNum: null
	,setBgPos: null
	,setBgRepeat: null
	,setBgAttachment: null
	,setBgImage: null
	,setBgColorKey: null
	,setBgColorRGB: null
	,setBgColorRGBA: null
	,setBgColorHex: null
	,setRightKey: null
	,setBottomKey: null
	,setLeftKey: null
	,setTopKey: null
	,setRightZero: null
	,setRight: null
	,setBottomZero: null
	,setBottom: null
	,setLeftZero: null
	,setLeft: null
	,setTopZero: null
	,setTop: null
	,setHeightKey: null
	,setHeightZero: null
	,setHeight: null
	,setWidthKey: null
	,setWidthZero: null
	,setWidth: null
	,setMaxHeightZero: null
	,setMaxHeightKey: null
	,setMaxHeight: null
	,setMinHeightZero: null
	,setMinHeight: null
	,setMaxWidthKey: null
	,setMaxWidthZero: null
	,setMaxWidth: null
	,setMinWidthZero: null
	,setMinWidth: null
	,setPaddingBottom: null
	,setPaddingRight: null
	,setPaddingTop: null
	,setPaddingLeft: null
	,setMarginRightZero: null
	,setMarginLeftZero: null
	,setMarginTopZero: null
	,setMarginBottomZero: null
	,setMarginBottomKey: null
	,setMarginBottomNum: null
	,setMarginRightKey: null
	,setMarginRightNum: null
	,setMarginTopKey: null
	,setMarginTopNum: null
	,setMarginLeftKey: null
	,setMarginLeftNum: null
	,setTransitionDelay: null
	,setTransitionTimingFunction: null
	,setTransitionDuration: null
	,setTransitionProperty: null
	,setTransform: null
	,setTransformOrigin: null
	,setClear: null
	,setCssFloat: null
	,setPosition: null
	,setDisplay: null
	,__class__: lib.hxtml.IStyleProxy
}
lib.hxtml.StyleProxy = function() {
};
$hxClasses["lib.hxtml.StyleProxy"] = lib.hxtml.StyleProxy;
lib.hxtml.StyleProxy.__name__ = ["lib","hxtml","StyleProxy"];
lib.hxtml.StyleProxy.__interfaces__ = [lib.hxtml.IStyleProxy];
lib.hxtml.StyleProxy.prototype = {
	setTransitionTimingFunction: function(element,value) {
		element.style.set_transitionTimingFunction(value);
	}
	,setTransitionProperty: function(element,value) {
		element.style.set_transitionProperty(value);
	}
	,setTransitionDelay: function(element,value) {
		element.style.set_transitionDelay(value);
	}
	,setTransitionDuration: function(element,value) {
		element.style.set_transitionDuration(value);
	}
	,setOverflowY: function(element,value) {
		element.style.set_overflowY(value);
	}
	,setOverflowX: function(element,value) {
		element.style.set_overflowX(value);
	}
	,setZIndex: function(element,value) {
		element.style.set_zIndex(value);
	}
	,setWhiteSpace: function(element,value) {
		element.style.set_whiteSpace(value);
	}
	,setVerticalAlignKey: function(element,value) {
		element.style.set_verticalAlign(value);
	}
	,setVerticalAlignNum: function(element,value,unit) {
		element.style.set_verticalAlign(value + unit);
	}
	,setTextAlign: function(element,value) {
		element.style.set_textAlign(value);
	}
	,setTextIndent: function(element,value,unit) {
		element.style.set_textIndent(value + unit);
	}
	,setWordSpacingKey: function(element,value) {
		element.style.set_wordSpacing(value);
	}
	,setWordSpacingNum: function(element,value,unit) {
		element.style.set_wordSpacing(value + unit);
	}
	,setLetterSpacingKey: function(element,value) {
		element.style.set_letterSpacing(value);
	}
	,setLetterSpacingNum: function(element,value,unit) {
		element.style.set_letterSpacing(value + unit);
	}
	,setTextTransform: function(element,value) {
		element.style.set_textTransform(value);
	}
	,setLineHeightNum: function(element,value,unit) {
		element.style.set_lineHeight(value + unit);
	}
	,setLineHeightZero: function(element) {
		element.style.set_lineHeight("0");
	}
	,setLineHeightKey: function(element,value) {
		element.style.set_lineHeight(value);
	}
	,setTextDecoration: function(element,value) {
	}
	,setTextColorRGB: function(element,value) {
		element.style.set_color("rgb(" + value + ")");
	}
	,setTextColorRGBA: function(element,value) {
		element.style.set_color("rgba(" + value + ")");
	}
	,setTextColorNum: function(element,value) {
		element.style.set_color("#" + Std.string(value));
	}
	,setTextColorKey: function(element,value) {
		element.style.set_color(value);
	}
	,setFontVariant: function(element,value) {
		element.style.set_fontVariant(value);
	}
	,setFontFamily: function(element,value) {
		if(value.length > 0) element.style.set_fontFamily(value.join(",")); else element.style.set_fontFamily("");
	}
	,setFontStyle: function(element,value) {
		element.style.set_fontStyle(value);
	}
	,setFontWeightKey: function(element,value) {
		element.style.set_fontWeight(value);
	}
	,setFontWeightNum: function(element,value) {
		element.style.set_fontWeight(Std.string(value));
	}
	,setFontSizeKey: function(element,value) {
		element.style.set_fontSize(value);
	}
	,setFontSizeNum: function(element,value,unit) {
		element.style.set_fontSize(value + unit);
	}
	,setBgPos: function(element,value) {
		element.style.set_backgroundPosition(value);
	}
	,setBgRepeat: function(element,value) {
		element.style.set_backgroundRepeat(value.join(","));
	}
	,setBgAttachment: function(element,value) {
	}
	,setBgImage: function(element,value) {
		if(value.length == 1) element.style.set_backgroundImage("url(" + value[0] + ")"); else element.style.set_backgroundImage("");
	}
	,setBgColorKey: function(element,value) {
		element.style.set_backgroundColor(value);
	}
	,setBgColorRGB: function(element,value) {
		element.style.set_backgroundColor("rgb(" + value + ")");
	}
	,setBgColorRGBA: function(element,value) {
		element.style.set_backgroundColor("rgba(" + value + ")");
	}
	,setBgColorHex: function(element,value) {
		element.style.set_backgroundColor("#" + Std.string(value));
	}
	,setRightKey: function(element,value) {
		element.style.set_right(value);
	}
	,setBottomKey: function(element,value) {
		element.style.set_bottom(value);
	}
	,setLeftKey: function(element,value) {
		element.style.set_left(value);
	}
	,setTopKey: function(element,value) {
		element.style.set_top(value);
	}
	,setRightZero: function(element) {
		element.style.set_right("0");
	}
	,setRight: function(element,value,unit) {
		element.style.set_right(value + unit);
	}
	,setBottomZero: function(element) {
		element.style.set_bottom("0");
	}
	,setBottom: function(element,value,unit) {
		element.style.set_bottom(value + unit);
	}
	,setLeftZero: function(element) {
		element.style.set_left("0");
	}
	,setLeft: function(element,value,unit) {
		element.style.set_left(value + unit);
	}
	,setTopZero: function(element) {
		element.style.set_top("0");
	}
	,setTop: function(element,value,unit) {
		element.style.set_top(value + unit);
	}
	,setMaxHeightKey: function(element,value) {
		element.style.set_maxHeight(value);
	}
	,setMaxWidthKey: function(element,value) {
		element.style.set_maxWidth(value);
	}
	,setMaxHeightZero: function(element) {
		element.style.set_maxHeight("0");
	}
	,setMinHeightZero: function(element) {
		element.style.set_minHeight("0");
	}
	,setMaxWidthZero: function(element) {
		element.style.set_maxWidth("0");
	}
	,setMinWidthZero: function(element) {
		element.style.set_minWidth("0");
	}
	,setMaxHeight: function(element,value,unit) {
		element.style.set_maxHeight(value + unit);
	}
	,setMaxWidth: function(element,value,unit) {
		element.style.set_maxWidth(value + unit);
	}
	,setMinHeight: function(element,value,unit) {
		element.style.set_minHeight(value + unit);
	}
	,setMinWidth: function(element,value,unit) {
		element.style.set_minWidth(value + unit);
	}
	,setHeightKey: function(element,value) {
		element.style.set_height(value);
	}
	,setHeightZero: function(element) {
		element.style.set_height("0");
	}
	,setHeight: function(element,value,unit) {
		element.style.set_height(value + unit);
	}
	,setWidthKey: function(element,value) {
		element.style.set_width(value);
	}
	,setWidthZero: function(element) {
		element.style.set_width("0");
	}
	,setWidth: function(element,value,unit) {
		element.style.set_width(value + unit);
	}
	,setPaddingBottom: function(element,value,unit) {
		element.style.set_paddingBottom(value + unit);
	}
	,setPaddingRight: function(element,value,unit) {
		element.style.set_paddingRight(value + unit);
	}
	,setPaddingTop: function(element,value,unit) {
		element.style.set_paddingTop(value + unit);
	}
	,setPaddingLeft: function(element,value,unit) {
		element.style.set_paddingLeft(value + unit);
	}
	,setMarginRightZero: function(element) {
		element.style.set_marginRight("0");
	}
	,setMarginTopZero: function(element) {
		element.style.set_marginTop("0");
	}
	,setMarginLeftZero: function(element) {
		element.style.set_marginLeft("0");
	}
	,setMarginBottomZero: function(element) {
		element.style.set_marginBottom("0");
	}
	,setMarginBottomKey: function(element,value) {
		element.style.set_marginBottom(value);
	}
	,setMarginBottomNum: function(element,value,unit) {
		element.style.set_marginBottom(value + unit);
	}
	,setMarginRightKey: function(element,value) {
		element.style.set_marginRight(value);
	}
	,setMarginRightNum: function(element,value,unit) {
		element.style.set_marginRight(value + unit);
	}
	,setMarginTopKey: function(element,value) {
		element.style.set_marginTop(value);
	}
	,setMarginTopNum: function(element,value,unit) {
		element.style.set_marginTop(value + unit);
	}
	,setMarginLeftKey: function(element,value) {
		element.style.set_marginLeft(value);
	}
	,setMarginLeftNum: function(element,value,unit) {
		element.style.set_marginLeft(value + unit);
	}
	,setTransformOrigin: function(element,value) {
		element.style.set_transformOrigin(value);
	}
	,setTransform: function(element,value) {
		element.style.set_transform(value);
	}
	,setClear: function(element,value) {
		element.style.set_clear(value);
	}
	,setCssFloat: function(element,value) {
		element.style.set_CSSFloat(value);
	}
	,setPosition: function(element,value) {
		element.style.set_position(value);
	}
	,setDisplay: function(element,value) {
		element.style.set_display(value);
	}
	,__class__: lib.hxtml.StyleProxy
}
org.slplayer.component.SLPlayerComponent = function() { }
$hxClasses["org.slplayer.component.SLPlayerComponent"] = org.slplayer.component.SLPlayerComponent;
org.slplayer.component.SLPlayerComponent.__name__ = ["org","slplayer","component","SLPlayerComponent"];
org.slplayer.component.SLPlayerComponent.initSLPlayerComponent = function(component,SLPlayerInstanceId) {
	component.SLPlayerInstanceId = SLPlayerInstanceId;
}
org.slplayer.component.SLPlayerComponent.getSLPlayer = function(component) {
	return org.slplayer.core.Application.get(component.SLPlayerInstanceId);
}
org.slplayer.component.SLPlayerComponent.checkRequiredParameters = function(cmpClass,elt) {
	var requires = haxe.rtti.Meta.getType(cmpClass).requires;
	if(requires == null) return;
	var _g = 0;
	while(_g < requires.length) {
		var r = requires[_g];
		++_g;
		if(elt.getAttribute(Std.string(r)) == null || StringTools.trim(elt.getAttribute(Std.string(r))) == "") throw Std.string(r) + " parameter is required for " + Type.getClassName(cmpClass);
	}
}
org.slplayer.component.interaction = {}
org.slplayer.component.interaction.DraggableState = $hxClasses["org.slplayer.component.interaction.DraggableState"] = { __ename__ : ["org","slplayer","component","interaction","DraggableState"], __constructs__ : ["none","dragging"] }
org.slplayer.component.interaction.DraggableState.none = ["none",0];
org.slplayer.component.interaction.DraggableState.none.toString = $estr;
org.slplayer.component.interaction.DraggableState.none.__enum__ = org.slplayer.component.interaction.DraggableState;
org.slplayer.component.interaction.DraggableState.dragging = ["dragging",1];
org.slplayer.component.interaction.DraggableState.dragging.toString = $estr;
org.slplayer.component.interaction.DraggableState.dragging.__enum__ = org.slplayer.component.interaction.DraggableState;
org.slplayer.component.interaction.Draggable = function(rootElement,SLPId) {
	org.slplayer.component.ui.DisplayObject.call(this,rootElement,SLPId);
	this.state = org.slplayer.component.interaction.DraggableState.none;
	this.dropZonesClassName = rootElement.getAttribute("data-dropzones-class-name");
	if(this.dropZonesClassName == null || this.dropZonesClassName == "") this.dropZonesClassName = "draggable-dropzone";
};
$hxClasses["org.slplayer.component.interaction.Draggable"] = org.slplayer.component.interaction.Draggable;
org.slplayer.component.interaction.Draggable.__name__ = ["org","slplayer","component","interaction","Draggable"];
org.slplayer.component.interaction.Draggable.__super__ = org.slplayer.component.ui.DisplayObject;
org.slplayer.component.interaction.Draggable.prototype = $extend(org.slplayer.component.ui.DisplayObject.prototype,{
	setAsBestDropZone: function(zone) {
		if(zone == this.bestDropZone) return;
		if(this.bestDropZone != null) this.bestDropZone.parent.removeChild(this.phantom);
		if(zone != null) zone.parent.insertBefore(this.phantom,zone.parent.childNodes[zone.position]);
		this.bestDropZone = zone;
	}
	,getBestDropZone: function(mouseX,mouseY) {
		var _g1 = 0, _g = this.dropZones.length;
		while(_g1 < _g) {
			var zoneIdx = _g1++;
			var zone = this.dropZones[zoneIdx];
			if(mouseX > zone.offsetLeft && mouseX < zone.offsetLeft + zone.offsetWidth && mouseY > zone.offsetTop && mouseY < zone.offsetTop + zone.offsetHeight) {
				var lastChildIdx = 0;
				var _g3 = 0, _g2 = zone.childNodes.length;
				while(_g3 < _g2) {
					var childIdx = _g3++;
					var child = zone.childNodes[childIdx];
					if(mouseX > child.offsetLeft + Math.round(child.offsetWidth / 2)) lastChildIdx = childIdx;
				}
				return { parent : zone, position : lastChildIdx};
			}
		}
		return null;
	}
	,move: function(e) {
		if(this.state == org.slplayer.component.interaction.DraggableState.dragging) {
			var x = e.clientX - this.initialMouseX + this.initialX;
			var y = e.clientY - this.initialMouseY + this.initialY;
			this.rootElement.style.left = x + "px";
			this.rootElement.style.top = y + "px";
			this.setAsBestDropZone(this.getBestDropZone(e.clientX,e.clientY));
		}
	}
	,stopDrag: function(e) {
		if(this.state == org.slplayer.component.interaction.DraggableState.dragging) {
			if(this.bestDropZone != null) {
				this.rootElement.parentNode.removeChild(this.rootElement);
				this.bestDropZone.parent.insertBefore(this.rootElement,this.bestDropZone.parent.childNodes[this.bestDropZone.position]);
				haxe.Log.trace("Draggable stopDrag droped! " + Std.string(this.state),{ fileName : "Draggable.hx", lineNumber : 250, className : "org.slplayer.component.interaction.Draggable", methodName : "stopDrag"});
				var event = js.Lib.document.createEvent("CustomEvent");
				event.initCustomEvent("dragEventDropped",false,false,this.bestDropZone.parent);
				this.bestDropZone.parent.dispatchEvent(event);
				event = js.Lib.document.createEvent("CustomEvent");
				event.initCustomEvent("dragEventDropped",false,false,this.rootElement);
				this.rootElement.dispatchEvent(event);
			}
			this.state = org.slplayer.component.interaction.DraggableState.none;
			this.resetRootElementStyle();
			js.Lib.document.body.onmousemove = null;
			this.setAsBestDropZone(null);
			return false;;
		}
		return true;;
	}
	,startDrag: function(e) {
		var _g = this;
		haxe.Log.trace("Draggable startDrag " + Std.string(this.state),{ fileName : "Draggable.hx", lineNumber : 209, className : "org.slplayer.component.interaction.Draggable", methodName : "startDrag"});
		if(this.state == org.slplayer.component.interaction.DraggableState.none) {
			this.state = org.slplayer.component.interaction.DraggableState.dragging;
			this.initialX = this.rootElement.offsetLeft;
			this.initialY = this.rootElement.offsetTop;
			this.initialMouseX = e.clientX;
			this.initialMouseY = e.clientY;
			this.initPhantomStyle();
			this.initRootElementStyle();
			js.Lib.document.onmousemove = function(e1) {
				_g.move(e1);
			};
			this.move(e);
			var event = js.Lib.document.createEvent("CustomEvent");
			event.initCustomEvent("dragEventDrag",false,false,this.rootElement);
			this.rootElement.dispatchEvent(event);
		}
		return false;;
	}
	,resetRootElementStyle: function() {
		var _g = 0, _g1 = Reflect.fields(this.initialStyle);
		while(_g < _g1.length) {
			var styleName = _g1[_g];
			++_g;
			var val = Reflect.field(this.initialStyle,styleName);
			this.rootElement.style[styleName] = val;
		}
	}
	,initPhantomStyle: function() {
		var computedStyle = window.getComputedStyle(this.rootElement, null);
		haxe.Log.trace("initPhantomStyle " + Std.string(computedStyle),{ fileName : "Draggable.hx", lineNumber : 174, className : "org.slplayer.component.interaction.Draggable", methodName : "initPhantomStyle"});
		var _g = 0, _g1 = Reflect.fields(computedStyle);
		while(_g < _g1.length) {
			var styleName = _g1[_g];
			++_g;
			var val = Reflect.field(computedStyle,styleName);
			var mozzVal = computedStyle.getPropertyValue(val);
			if(mozzVal != null) val = mozzVal;
			this.phantom.style[styleName] = val;
		}
		this.phantom.className = this.rootElement.className + " " + "draggable-phantom";
	}
	,initRootElementStyle: function() {
		this.initialStyle = { };
		this.initialStyle.width = this.rootElement.style.width;
		this.rootElement.style.width = this.rootElement.clientWidth + "px";
		this.initialStyle.height = this.rootElement.style.height;
		this.rootElement.style.height = this.rootElement.clientHeight + "px";
		this.initialStyle.position = this.rootElement.style.position;
		this.rootElement.style.position = "absolute";
	}
	,init: function() {
		org.slplayer.component.ui.DisplayObject.prototype.init.call(this);
		haxe.Log.trace("Draggable init",{ fileName : "Draggable.hx", lineNumber : 124, className : "org.slplayer.component.interaction.Draggable", methodName : "init"});
		this.phantom = js.Lib.document.createElement("div");
		this.dragZone = org.slplayer.util.DomTools.getSingleElement(this.rootElement,"draggable-dragzone",false);
		if(this.dragZone == null) this.dragZone = this.rootElement;
		this.dropZones = js.Lib.document.body.getElementsByClassName(this.dropZonesClassName);
		if(this.dropZones.length == 0) this.dropZones[0] = this.rootElement.parentNode;
		this.dragZone.onmousedown = $bind(this,this.startDrag);
		this.dragZone.onmouseup = $bind(this,this.stopDrag);
		this.dragZone.style.cursor = "move";
	}
	,initialY: null
	,initialX: null
	,initialMouseY: null
	,initialMouseX: null
	,initialStyle: null
	,bestDropZone: null
	,dropZonesClassName: null
	,dropZones: null
	,dragZone: null
	,state: null
	,phantom: null
	,__class__: org.slplayer.component.interaction.Draggable
});
org.slplayer.core = {}
org.slplayer.core.Application = function(id,args) {
	this.dataObject = args;
	this.id = id;
	this.nodesIdSequence = 0;
	this.registeredComponents = new Array();
	this.nodeToCmpInstances = new Hash();
	this.metaParameters = new Hash();
	haxe.Log.trace("new SLPlayer instance built",{ fileName : "Application.hx", lineNumber : 106, className : "org.slplayer.core.Application", methodName : "new"});
};
$hxClasses["org.slplayer.core.Application"] = org.slplayer.core.Application;
$hxExpose(org.slplayer.core.Application, "FileManager");
org.slplayer.core.Application.__name__ = ["org","slplayer","core","Application"];
org.slplayer.core.Application.get = function(SLPId) {
	return org.slplayer.core.Application.instances.get(SLPId);
}
org.slplayer.core.Application.generateUniqueId = function() {
	return haxe.Md5.encode(HxOverrides.dateStr(new Date()) + Std.string(Std.random(new Date().getTime() | 0)));
}
org.slplayer.core.Application.init = function(appendTo,args) {
	haxe.Log.trace("SLPlayer init() called with appendTo=" + Std.string(appendTo) + " and args=" + Std.string(args),{ fileName : "Application.hx", lineNumber : 194, className : "org.slplayer.core.Application", methodName : "init"});
	var newId = org.slplayer.core.Application.generateUniqueId();
	haxe.Log.trace("New SLPlayer id created : " + newId,{ fileName : "Application.hx", lineNumber : 201, className : "org.slplayer.core.Application", methodName : "init"});
	var newInstance = new org.slplayer.core.Application(newId,args);
	haxe.Log.trace("setting ref to SLPlayer instance " + newId,{ fileName : "Application.hx", lineNumber : 207, className : "org.slplayer.core.Application", methodName : "init"});
	org.slplayer.core.Application.instances.set(newId,newInstance);
	js.Lib.window.onload = function(e) {
		newInstance.launch(appendTo);
	};
}
org.slplayer.core.Application.main = function() {
	haxe.Log.trace("noAutoStart not defined: calling init()...",{ fileName : "Application.hx", lineNumber : 220, className : "org.slplayer.core.Application", methodName : "main"});
	org.slplayer.core.Application.init();
}
org.slplayer.core.Application.prototype = {
	getUnconflictedClassTag: function(displayObjectClassName) {
		var classTag = displayObjectClassName;
		if(classTag.indexOf(".") != -1) classTag = HxOverrides.substr(classTag,classTag.lastIndexOf(".") + 1,null);
		var _g = 0, _g1 = this.registeredComponents;
		while(_g < _g1.length) {
			var rc = _g1[_g];
			++_g;
			if(rc.classname != displayObjectClassName && classTag == HxOverrides.substr(rc.classname,classTag.lastIndexOf(".") + 1,null)) return displayObjectClassName;
		}
		return classTag;
	}
	,getAssociatedComponents: function(node,typeFilter) {
		var nodeId = node.getAttribute("data-" + "slpid");
		if(nodeId != null) {
			var l = new List();
			var $it0 = this.nodeToCmpInstances.get(nodeId).iterator();
			while( $it0.hasNext() ) {
				var i = $it0.next();
				if(js.Boot.__instanceof(i,typeFilter)) {
					var inst = i;
					l.add(inst);
				}
			}
			return l;
		}
		return new List();
	}
	,addAssociatedComponent: function(node,cmp) {
		var nodeId = node.getAttribute("data-" + "slpid");
		var associatedCmps;
		if(nodeId != null) associatedCmps = this.nodeToCmpInstances.get(nodeId); else {
			this.nodesIdSequence++;
			nodeId = Std.string(this.nodesIdSequence);
			node.setAttribute("data-" + "slpid",nodeId);
			associatedCmps = new List();
		}
		associatedCmps.add(cmp);
		this.nodeToCmpInstances.set(nodeId,associatedCmps);
	}
	,callInitOnComponents: function() {
		haxe.Log.trace("call Init On Components",{ fileName : "Application.hx", lineNumber : 396, className : "org.slplayer.core.Application", methodName : "callInitOnComponents"});
		var $it0 = this.nodeToCmpInstances.iterator();
		while( $it0.hasNext() ) {
			var l = $it0.next();
			var $it1 = l.iterator();
			while( $it1.hasNext() ) {
				var c = $it1.next();
				try {
					c.init();
				} catch( unknown ) {
					haxe.Log.trace("ERROR while trying to call init() on a " + Type.getClassName(Type.getClass(c)) + ": " + Std.string(unknown),{ fileName : "Application.hx", lineNumber : 414, className : "org.slplayer.core.Application", methodName : "callInitOnComponents"});
					var excptArr = haxe.Stack.exceptionStack();
					if(excptArr.length > 0) haxe.Log.trace(haxe.Stack.toString(haxe.Stack.exceptionStack()),{ fileName : "Application.hx", lineNumber : 418, className : "org.slplayer.core.Application", methodName : "callInitOnComponents"});
				}
			}
		}
	}
	,createComponentsOfType: function(componentClassName,args) {
		haxe.Log.trace("Creating " + componentClassName + "...",{ fileName : "Application.hx", lineNumber : 266, className : "org.slplayer.core.Application", methodName : "createComponentsOfType"});
		var componentClass = Type.resolveClass(componentClassName);
		if(componentClass == null) {
			var rslErrMsg = "ERROR cannot resolve " + componentClassName;
			haxe.Log.trace(rslErrMsg,{ fileName : "Application.hx", lineNumber : 277, className : "org.slplayer.core.Application", methodName : "createComponentsOfType"});
			return;
		}
		haxe.Log.trace(componentClassName + " class resolved ",{ fileName : "Application.hx", lineNumber : 283, className : "org.slplayer.core.Application", methodName : "createComponentsOfType"});
		if(org.slplayer.component.ui.DisplayObject.isDisplayObject(componentClass)) {
			var classTag = this.getUnconflictedClassTag(componentClassName);
			haxe.Log.trace("searching now for class tag = " + classTag,{ fileName : "Application.hx", lineNumber : 291, className : "org.slplayer.core.Application", methodName : "createComponentsOfType"});
			var taggedNodes = new Array();
			var taggedNodesCollection = this.htmlRootElement.getElementsByClassName(classTag);
			var _g1 = 0, _g = taggedNodesCollection.length;
			while(_g1 < _g) {
				var nodeCnt = _g1++;
				taggedNodes.push(taggedNodesCollection[nodeCnt]);
			}
			if(componentClassName != classTag) {
				haxe.Log.trace("searching now for class tag = " + componentClassName,{ fileName : "Application.hx", lineNumber : 304, className : "org.slplayer.core.Application", methodName : "createComponentsOfType"});
				taggedNodesCollection = this.htmlRootElement.getElementsByClassName(componentClassName);
				var _g1 = 0, _g = taggedNodesCollection.length;
				while(_g1 < _g) {
					var nodeCnt = _g1++;
					taggedNodes.push(taggedNodesCollection[nodeCnt]);
				}
			}
			haxe.Log.trace("taggedNodes = " + taggedNodes.length,{ fileName : "Application.hx", lineNumber : 315, className : "org.slplayer.core.Application", methodName : "createComponentsOfType"});
			var _g = 0;
			while(_g < taggedNodes.length) {
				var node = taggedNodes[_g];
				++_g;
				var newDisplayObject;
				try {
					newDisplayObject = Type.createInstance(componentClass,[node,this.id]);
					haxe.Log.trace("Successfuly created instance of " + componentClassName,{ fileName : "Application.hx", lineNumber : 330, className : "org.slplayer.core.Application", methodName : "createComponentsOfType"});
				} catch( unknown ) {
					haxe.Log.trace("ERROR while creating " + componentClassName + ": " + Std.string(unknown),{ fileName : "Application.hx", lineNumber : 337, className : "org.slplayer.core.Application", methodName : "createComponentsOfType"});
					var excptArr = haxe.Stack.exceptionStack();
					if(excptArr.length > 0) haxe.Log.trace(haxe.Stack.toString(haxe.Stack.exceptionStack()),{ fileName : "Application.hx", lineNumber : 341, className : "org.slplayer.core.Application", methodName : "createComponentsOfType"});
				}
			}
		} else {
			haxe.Log.trace("Try to create an instance of " + componentClassName + " non visual component",{ fileName : "Application.hx", lineNumber : 350, className : "org.slplayer.core.Application", methodName : "createComponentsOfType"});
			var cmpInstance = null;
			try {
				if(args != null) cmpInstance = Type.createInstance(componentClass,[args]); else cmpInstance = Type.createInstance(componentClass,[]);
				haxe.Log.trace("Successfuly created instance of " + componentClassName,{ fileName : "Application.hx", lineNumber : 366, className : "org.slplayer.core.Application", methodName : "createComponentsOfType"});
			} catch( unknown ) {
				haxe.Log.trace("ERROR while creating " + componentClassName + ": " + Std.string(unknown),{ fileName : "Application.hx", lineNumber : 373, className : "org.slplayer.core.Application", methodName : "createComponentsOfType"});
				var excptArr = haxe.Stack.exceptionStack();
				if(excptArr.length > 0) haxe.Log.trace(haxe.Stack.toString(haxe.Stack.exceptionStack()),{ fileName : "Application.hx", lineNumber : 377, className : "org.slplayer.core.Application", methodName : "createComponentsOfType"});
			}
			if(cmpInstance != null && js.Boot.__instanceof(cmpInstance,org.slplayer.component.ISLPlayerComponent)) cmpInstance.initSLPlayerComponent(this.id);
		}
	}
	,initComponents: function() {
		var _g = 0, _g1 = this.registeredComponents;
		while(_g < _g1.length) {
			var rc = _g1[_g];
			++_g;
			this.createComponentsOfType(rc.classname,rc.args);
		}
		this.callInitOnComponents();
	}
	,registerComponent: function(componentClassName,args) {
		this.registeredComponents.push({ classname : componentClassName, args : args});
	}
	,registerComponentsforInit: function() {
		filemanager.client.views.UploadStatus;
		this.registerComponent("filemanager.client.views.UploadStatus");
		filemanager.client.views.DetailView;
		this.registerComponent("filemanager.client.views.DetailView");
		filemanager.client.views.FilesView;
		this.registerComponent("filemanager.client.views.FilesView");
		filemanager.client.views.FolderTreeView;
		this.registerComponent("filemanager.client.views.FolderTreeView");
		org.slplayer.component.interaction.Draggable;
		this.registerComponent("org.slplayer.component.interaction.Draggable");
		filemanager.client.views.SelectedPath;
		this.registerComponent("filemanager.client.views.SelectedPath");
		filemanager.client.views.TitleTopBar;
		this.registerComponent("filemanager.client.views.TitleTopBar");
		filemanager.client.views.FileDropper;
		this.registerComponent("filemanager.client.views.FileDropper");
		filemanager.client.FileManager;
		this.registerComponent("filemanager.client.FileManager");
		filemanager.client.views.ToolBox;
		this.registerComponent("filemanager.client.views.ToolBox");
	}
	,initMetaParameters: function() {
	}
	,initHtmlRootElementContent: function() {
	}
	,launch: function(appendTo) {
		haxe.Log.trace("Launching SLPlayer id " + this.id + " on " + Std.string(appendTo),{ fileName : "Application.hx", lineNumber : 118, className : "org.slplayer.core.Application", methodName : "launch"});
		if(appendTo != null) {
			haxe.Log.trace("setting htmlRootElement to " + Std.string(appendTo),{ fileName : "Application.hx", lineNumber : 124, className : "org.slplayer.core.Application", methodName : "launch"});
			this.htmlRootElement = appendTo;
		}
		if(this.htmlRootElement == null || this.htmlRootElement.nodeType != js.Lib.document.body.nodeType) {
			haxe.Log.trace("setting htmlRootElement to Lib.document.body",{ fileName : "Application.hx", lineNumber : 133, className : "org.slplayer.core.Application", methodName : "launch"});
			this.htmlRootElement = js.Lib.document.body;
		}
		if(this.htmlRootElement == null) {
			haxe.Log.trace("ERROR windows.document.body is null => You are trying to start your application while the document loading is probably not complete yet." + " To fix that, add the noAutoStart option to your slplayer application and control the application startup with: window.onload = function() { myApplication.init() };",{ fileName : "Application.hx", lineNumber : 141, className : "org.slplayer.core.Application", methodName : "launch"});
			return;
		}
		this.initHtmlRootElementContent();
		this.initMetaParameters();
		this.registerComponentsforInit();
		this.initComponents();
		haxe.Log.trace("SLPlayer id " + this.id + " launched !",{ fileName : "Application.hx", lineNumber : 162, className : "org.slplayer.core.Application", methodName : "launch"});
	}
	,getMetaParameter: function(metaParamKey) {
		return this.metaParameters.get(metaParamKey);
	}
	,metaParameters: null
	,registeredComponents: null
	,dataObject: null
	,htmlRootElement: null
	,nodeToCmpInstances: null
	,nodesIdSequence: null
	,id: null
	,__class__: org.slplayer.core.Application
}
org.slplayer.util = {}
org.slplayer.util.DomTools = function() { }
$hxClasses["org.slplayer.util.DomTools"] = org.slplayer.util.DomTools;
org.slplayer.util.DomTools.__name__ = ["org","slplayer","util","DomTools"];
org.slplayer.util.DomTools.getElementsByAttribute = function(elt,attr,value) {
	var childElts = elt.getElementsByTagName("*");
	var filteredChildElts = new Array();
	var _g1 = 0, _g = childElts.length;
	while(_g1 < _g) {
		var cCount = _g1++;
		if(childElts[cCount].getAttribute(attr) != null && (value == "*" || childElts[cCount].getAttribute(attr) == value)) filteredChildElts.push(childElts[cCount]);
	}
	return filteredChildElts;
}
org.slplayer.util.DomTools.getSingleElement = function(rootElement,className,required) {
	if(required == null) required = true;
	var domElements = rootElement.getElementsByClassName(className);
	if(domElements != null && domElements.length == 1) return domElements[0]; else {
		if(required) throw "Error: search for the element with class name \"" + className + "\" gave " + domElements.length + " results";
		return null;
	}
}
org.slplayer.util.DomTools.inspectTrace = function(obj) {
	var _g = 0, _g1 = Reflect.fields(obj);
	while(_g < _g1.length) {
		var prop = _g1[_g];
		++_g;
		haxe.Log.trace("- " + prop + " = " + Std.string(Reflect.field(obj,prop)),{ fileName : "DomTools.hx", lineNumber : 80, className : "org.slplayer.util.DomTools", methodName : "inspectTrace"});
	}
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.Prolog = "prolog";
Xml.Document = "document";
if(typeof(JSON) != "undefined") haxe.Json = JSON;
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
js.XMLHttpRequest = window.XMLHttpRequest?XMLHttpRequest:window.ActiveXObject?function() {
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch( e ) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch( e1 ) {
			throw "Unable to create XMLHttpRequest object.";
		}
	}
}:(function($this) {
	var $r;
	throw "Unable to create XMLHttpRequest object.";
	return $r;
}(this));
cocktail.core.dom.DOMConstants.ELEMENT_NODE = 1;
cocktail.core.dom.DOMConstants.ATTRIBUTE_NODE = 2;
cocktail.core.dom.DOMConstants.TEXT_NODE = 3;
cocktail.core.dom.DOMConstants.CDATA_SECTION_NODE = 4;
cocktail.core.dom.DOMConstants.ENTITY_REFERENCE_NODE = 5;
cocktail.core.dom.DOMConstants.ENTITY_NODE = 6;
cocktail.core.dom.DOMConstants.PROCESSING_INSTRUCTION_NODE = 7;
cocktail.core.dom.DOMConstants.COMMENT_NODE = 8;
cocktail.core.dom.DOMConstants.DOCUMENT_NODE = 9;
cocktail.core.dom.DOMConstants.DOCUMENT_TYPE_NODE = 10;
cocktail.core.dom.DOMConstants.DOCUMENT_FRAGMENT_NODE = 11;
cocktail.core.dom.DOMConstants.NOTATION_NODE = 11;
cocktail.core.dom.DOMConstants.EVENT_INTERFACE = "Event";
cocktail.core.dom.DOMConstants.UI_EVENT_INTERFACE = "UIEvent";
cocktail.core.dom.DOMConstants.MOUSE_EVENT_INTERFACE = "MouseEvent";
cocktail.core.dom.DOMConstants.FOCUS_EVENT_INTERFACE = "FocusEvent";
cocktail.core.dom.DOMConstants.KEYBOARD_EVENT_INTERFACE = "KeyboardEvent";
cocktail.core.dom.DOMConstants.WHEEL_EVENT_INTERFACE = "WheelEvent";
cocktail.core.dom.DOMConstants.CUSTOM_EVENT_INTERFACE = "CustomEvent";
cocktail.core.dom.DOMConstants.TRANSITION_EVENT_INTERFACE = "TransitionEvent";
cocktail.core.dom.DOMConstants.MATCH_ALL_TAG_NAME = "*";
cocktail.core.dom.DOMConstants.TEXT_NODE_NAME = "#text";
cocktail.core.dom.DOMException.INDEX_SIZE_ERR = 1;
cocktail.core.dom.DOMException.DOMSTRING_SIZE_ERR = 2;
cocktail.core.dom.DOMException.HIERARCHY_REQUEST_ERR = 3;
cocktail.core.dom.DOMException.WRONG_DOCUMENT_ERR = 4;
cocktail.core.dom.DOMException.INVALID_CHARACTER_ERR = 5;
cocktail.core.dom.DOMException.NO_DATA_ALLOWED_ERR = 6;
cocktail.core.dom.DOMException.NO_MODIFICATION_ALLOWED_ERR = 7;
cocktail.core.dom.DOMException.NOT_FOUND_ERR = 8;
cocktail.core.dom.DOMException.NOT_SUPPORTED_ERR = 9;
cocktail.core.dom.DOMException.INUSE_ATTRIBUTE_ERR = 10;
cocktail.core.dom.DOMException.INVALID_STATE_ERR = 11;
cocktail.core.dom.DOMException.SYNTAX_ERR = 12;
cocktail.core.dom.DOMException.INVALID_MODIFICATION_ERR = 13;
cocktail.core.dom.DOMException.NAMESPACE_ERR = 14;
cocktail.core.dom.DOMException.INVALID_ACCESS_ERR = 15;
cocktail.core.dom.DOMException.VALIDATION_ERR = 16;
cocktail.core.dom.DOMException.TYPE_MISMATCH_ERR = 19;
cocktail.core.event.Event.PLAY = "play";
cocktail.core.event.Event.PLAYING = "playing";
cocktail.core.event.Event.PAUSE = "pause";
cocktail.core.event.Event.ABORT = "abort";
cocktail.core.event.Event.LOAD_START = "loadstart";
cocktail.core.event.Event.WAITING = "waiting";
cocktail.core.event.Event.TIME_UPDATE = "timeupdate";
cocktail.core.event.Event.ENDED = "ended";
cocktail.core.event.Event.LOADED_DATA = "loadeddata";
cocktail.core.event.Event.SEEKING = "seeking";
cocktail.core.event.Event.SEEKED = "seeked";
cocktail.core.event.Event.PROGRESS = "progress";
cocktail.core.event.Event.ERROR = "error";
cocktail.core.event.Event.CAN_PLAY = "canplay";
cocktail.core.event.Event.EMPTIED = "emptied";
cocktail.core.event.Event.LOADED_METADATA = "loadedmetadata";
cocktail.core.event.Event.DURATION_CHANGE = "durationchange";
cocktail.core.event.Event.VOLUME_CHANGE = "volumechange";
cocktail.core.event.Event.SUSPEND = "suspend";
cocktail.core.event.Event.STALLED = "stalled";
cocktail.core.event.Event.CAN_PLAY_THROUGH = "canplaythrough";
cocktail.core.event.Event.READY_STATE_CHANGE = "readystatechange";
cocktail.core.event.Event.FULL_SCREEN_CHANGE = "fullscreenchange";
cocktail.core.event.Event.CAPTURING_PHASE = 1;
cocktail.core.event.Event.AT_TARGET = 2;
cocktail.core.event.Event.BUBBLING_PHASE = 3;
cocktail.core.event.UIEvent.SCROLL = "scroll";
cocktail.core.event.UIEvent.RESIZE = "resize";
cocktail.core.event.UIEvent.LOAD = "load";
cocktail.core.event.UIEvent.ERROR = "error";
cocktail.core.event.FocusEvent.FOCUS = "focus";
cocktail.core.event.FocusEvent.BLUR = "blur";
cocktail.core.event.FocusEvent.FOCUS_IN = "focusin";
cocktail.core.event.FocusEvent.FOCUS_OUT = "focusout";
cocktail.core.event.KeyboardEvent.KEY_DOWN = "keydown";
cocktail.core.event.KeyboardEvent.KEY_UP = "keyup";
cocktail.core.event.KeyboardEvent.DOM_KEY_LOCATION_STANDARD = 0;
cocktail.core.event.KeyboardEvent.DOM_KEY_LOCATION_LEFT = 1;
cocktail.core.event.KeyboardEvent.DOM_KEY_LOCATION_RIGHT = 2;
cocktail.core.event.KeyboardEvent.DOM_KEY_LOCATION_NUMPAD = 3;
cocktail.core.event.KeyboardEvent.DOM_KEY_LOCATION_MOBILE = 4;
cocktail.core.event.KeyboardEvent.DOM_KEY_LOCATION_JOYSTICK = 5;
cocktail.core.event.MouseEvent.CLICK = "click";
cocktail.core.event.MouseEvent.DOUBLE_CLICK = "dblclick";
cocktail.core.event.MouseEvent.MOUSE_UP = "mouseup";
cocktail.core.event.MouseEvent.MOUSE_DOWN = "mousedown";
cocktail.core.event.MouseEvent.MOUSE_OVER = "mouseover";
cocktail.core.event.MouseEvent.MOUSE_OUT = "mouseout";
cocktail.core.event.MouseEvent.MOUSE_MOVE = "mousemove";
cocktail.core.event.TransitionEvent.TRANSITION_END = "transitionend";
cocktail.core.event.WheelEvent.MOUSE_WHEEL = "wheel";
cocktail.core.event.WheelEvent.DOM_DELTA_PIXEL = 0;
cocktail.core.event.WheelEvent.DOM_DELTA_LINE = 1;
cocktail.core.event.WheelEvent.DOM_DELTA_PAGE = 2;
cocktail.core.html.HTMLConstants.HTML_BODY_TAG_NAME = "BODY";
cocktail.core.html.HTMLConstants.HTML_ANCHOR_TAG_NAME = "A";
cocktail.core.html.HTMLConstants.HTML_IMAGE_TAG_NAME = "IMG";
cocktail.core.html.HTMLConstants.HTML_INPUT_TAG_NAME = "INPUT";
cocktail.core.html.HTMLConstants.HTML_HTML_TAG_NAME = "HTML";
cocktail.core.html.HTMLConstants.HTML_VIDEO_TAG_NAME = "VIDEO";
cocktail.core.html.HTMLConstants.HTML_SOURCE_TAG_NAME = "SOURCE";
cocktail.core.html.HTMLConstants.HTML_DIV_TAG_NAME = "DIV";
cocktail.core.html.HTMLConstants.HTML_OBJECT_TAG_NAME = "OBJECT";
cocktail.core.html.HTMLConstants.HTML_PARAM_TAG_NAME = "PARAM";
cocktail.core.html.HTMLConstants.HTML_ADRESS_TAG_NAME = "ADRESS";
cocktail.core.html.HTMLConstants.HTML_DD_TAG_NAME = "DD";
cocktail.core.html.HTMLConstants.HTML_DL_TAG_NAME = "DL";
cocktail.core.html.HTMLConstants.HTML_DT_TAG_NAME = "DT";
cocktail.core.html.HTMLConstants.HTML_FIELDSET_TAG_NAME = "FIELDSET";
cocktail.core.html.HTMLConstants.HTML_FORM_TAG_NAME = "FORM";
cocktail.core.html.HTMLConstants.HTML_FRAME_TAG_NAME = "FRAME";
cocktail.core.html.HTMLConstants.HTML_FRAMESET_TAG_NAME = "FRAMESET";
cocktail.core.html.HTMLConstants.HTML_NOFRAMES_TAG_NAME = "NOFRAMES";
cocktail.core.html.HTMLConstants.HTML_OL_TAG_NAME = "OL";
cocktail.core.html.HTMLConstants.HTML_CENTER_TAG_NAME = "CENTER";
cocktail.core.html.HTMLConstants.HTML_DIR_TAG_NAME = "DIR";
cocktail.core.html.HTMLConstants.HTML_HR_TAG_NAME = "HR";
cocktail.core.html.HTMLConstants.HTML_MENU_TAG_NAME = "MENU";
cocktail.core.html.HTMLConstants.HTML_LI_TAG_NAME = "LI";
cocktail.core.html.HTMLConstants.HTML_UL_TAG_NAME = "UL";
cocktail.core.html.HTMLConstants.HTML_HEAD_TAG_NAME = "HEAD";
cocktail.core.html.HTMLConstants.HTML_H1_TAG_NAME = "H1";
cocktail.core.html.HTMLConstants.HTML_H2_TAG_NAME = "H2";
cocktail.core.html.HTMLConstants.HTML_H3_TAG_NAME = "H3";
cocktail.core.html.HTMLConstants.HTML_H4_TAG_NAME = "H4";
cocktail.core.html.HTMLConstants.HTML_H5_TAG_NAME = "H5";
cocktail.core.html.HTMLConstants.HTML_H6_TAG_NAME = "H6";
cocktail.core.html.HTMLConstants.HTML_P_TAG_NAME = "P";
cocktail.core.html.HTMLConstants.HTML_PRE_TAG_NAME = "PRE";
cocktail.core.html.HTMLConstants.HTML_CODE_TAG_NAME = "CODE";
cocktail.core.html.HTMLConstants.HTML_I_TAG_NAME = "I";
cocktail.core.html.HTMLConstants.HTML_CITE_TAG_NAME = "CITE";
cocktail.core.html.HTMLConstants.HTML_EM_TAG_NAME = "EM";
cocktail.core.html.HTMLConstants.HTML_VAR_TAG_NAME = "VAR";
cocktail.core.html.HTMLConstants.HTML_BLOCKQUOTE_TAG_NAME = "BLOCKQUOTE";
cocktail.core.html.HTMLConstants.HTML_STRONG_TAG_NAME = "STRONG";
cocktail.core.html.HTMLConstants.HTML_BIG_TAG_NAME = "BIG";
cocktail.core.html.HTMLConstants.HTML_SMALL_TAG_NAME = "SMALL";
cocktail.core.html.HTMLConstants.HTML_SUB_TAG_NAME = "SUB";
cocktail.core.html.HTMLConstants.HTML_SUP_TAG_NAME = "SUP";
cocktail.core.html.HTMLConstants.HTML_ID_ATTRIBUTE_NAME = "id";
cocktail.core.html.HTMLConstants.HTML_CLASS_ATTRIBUTE_NAME = "class";
cocktail.core.html.HTMLConstants.HTML_HIDDEN_ATTRIBUTE_NAME = "hidden";
cocktail.core.html.HTMLConstants.HTML_TAB_INDEX_ATTRIBUTE_NAME = "tabIndex";
cocktail.core.html.HTMLConstants.HTML_STYLE_ATTRIBUTE_NAME = "style";
cocktail.core.html.HTMLConstants.HTML_SRC_ATTRIBUTE_NAME = "src";
cocktail.core.html.HTMLConstants.HTML_VALUE_ATTRIBUTE_NAME = "value";
cocktail.core.html.HTMLConstants.HTML_AUTOPLAY_ATTRIBUTE_NAME = "autoplay";
cocktail.core.html.HTMLConstants.HTML_LOOP_ATTRIBUTE_NAME = "loop";
cocktail.core.html.HTMLConstants.HTML_TYPE_ATTRIBUTE_NAME = "type";
cocktail.core.html.HTMLConstants.HTML_MEDIA_ATTRIBUTE_NAME = "media";
cocktail.core.html.HTMLConstants.HTML_HREF_ATTRIBUTE_NAME = "href";
cocktail.core.html.HTMLConstants.HTML_TARGET_ATTRIBUTE_NAME = "target";
cocktail.core.html.HTMLConstants.HTML_DATA_ATTRIBUTE_NAME = "data";
cocktail.core.html.HTMLConstants.HTML_HEIGHT_ATTRIBUTE_NAME = "height";
cocktail.core.html.HTMLConstants.HTML_WIDTH_ATTRIBUTE_NAME = "width";
cocktail.core.html.HTMLConstants.HTML_POSTER_ATTRIBUTE_NAME = "poster";
cocktail.core.html.HTMLConstants.HTML_NAME_ATTRIBUTE_NAME = "name";
cocktail.core.html.HTMLConstants.TARGET_BLANK = "_blank";
cocktail.core.html.HTMLConstants.TARGET_SELF = "_self";
cocktail.core.html.HTMLConstants.TARGET_PARENT = "_parent";
cocktail.core.html.HTMLConstants.TARGET_TOP = "_top";
cocktail.core.html.HTMLConstants.HTML_TOKEN_LESS_THAN = "<";
cocktail.core.html.HTMLConstants.HTML_TOKEN_MORE_THAN = ">";
cocktail.core.html.HTMLConstants.HTML_TOKEN_SOLIDUS = "/";
cocktail.core.html.HTMLDocument.TAB_KEY_CODE = 9;
cocktail.core.html.HTMLDocument.ENTER_KEY_CODE = 13;
cocktail.core.html.HTMLDocument.SPACE_KEY_CODE = 32;
cocktail.core.html.HTMLDocument.MOUSE_WHEEL_DELTA_MULTIPLIER = 10;
cocktail.core.html.HTMLDocument.INVALIDATION_INTERVAL = 20;
cocktail.core.html.HTMLInputElement.HTML_INPUT_TEXT_INTRINSIC_WIDTH = 150;
cocktail.core.html.HTMLInputElement.HTML_INPUT_TEXT_INTRINSIC_RATIO = 0.15;
cocktail.core.html.HTMLMediaElement.RESOURCE_SELECTION_ATTRIBUTE_MODE = 0;
cocktail.core.html.HTMLMediaElement.RESOURCE_SELECTION_CHILDREN_MODE = 1;
cocktail.core.html.HTMLMediaElement.TIME_UPDATE_FREQUENCY = 15;
cocktail.core.html.HTMLMediaElement.PROGRESS_FREQUENCY = 350;
cocktail.core.html.HTMLMediaElement.PLAYBACK_END_DELTA = 0.2;
cocktail.core.html.HTMLMediaElement.NETWORK_EMPTY = 0;
cocktail.core.html.HTMLMediaElement.NETWORK_IDLE = 1;
cocktail.core.html.HTMLMediaElement.NETWORK_LOADING = 2;
cocktail.core.html.HTMLMediaElement.NETWORK_NO_SOURCE = 3;
cocktail.core.html.HTMLMediaElement.CAN_PLAY_TYPE_MAYBE = "maybe";
cocktail.core.html.HTMLMediaElement.CAN_PLAY_TYPE_PROBABLY = "probably";
cocktail.core.html.HTMLMediaElement.HAVE_NOTHING = 0;
cocktail.core.html.HTMLMediaElement.HAVE_METADATA = 1;
cocktail.core.html.HTMLMediaElement.HAVE_CURRENT_DATA = 2;
cocktail.core.html.HTMLMediaElement.HAVE_FUTURE_DATA = 3;
cocktail.core.html.HTMLMediaElement.HAVE_ENOUGH_DATA = 4;
cocktail.core.html.HTMLObjectElement.HTML_OBJECT_INTRISIC_WIDTH = 300;
cocktail.core.html.HTMLObjectElement.HTML_OBJECT_INTRINSIC_HEIGHT = 150;
cocktail.core.html.HTMLVideoElement.HTML_VIDEO_DEFAULT_WIDTH = 300;
cocktail.core.html.HTMLVideoElement.HTML_VIDEO_DEFAULT_HEIGHT = 150;
cocktail.core.html.ScrollBar.ARROW_SCROLL_OFFSET = 10;
cocktail.core.html.ScrollBar.TRACK_SCROLL_OFFSET = 50;
cocktail.core.html.ScrollBar.THUMB_DEFAULT_DIMENSION = 16;
cocktail.core.html.ScrollBar.ARROW_DEFAULT_DIMENSION = 16;
cocktail.core.html.ScrollBar.TRACK_DEFAULT_DIMENSION = 16;
cocktail.core.renderer.ObjectRenderer.NO_SCALE = "noscale";
cocktail.core.renderer.ObjectRenderer.SHOW_ALL = "showall";
cocktail.core.renderer.TextInputRenderer.SERIF_GENERIC_FONT_NAME = "serif";
cocktail.core.renderer.TextInputRenderer.SERIF_FLASH_FONT_NAME = "_serif";
cocktail.core.renderer.TextInputRenderer.SANS_SERIF_GENERIC_FONT_NAME = "sans";
cocktail.core.renderer.TextInputRenderer.SANS_SERIF_FLASH_FONT_NAME = "_sans";
cocktail.core.renderer.TextInputRenderer.MONOSPACE_GENERIC_FONT_NAME = "typewriter";
cocktail.core.renderer.TextInputRenderer.MONOSPACE_FLASH_FONT_NAME = "_typewriter";
cocktail.core.resource.XMLHTTPRequest.READY_STATE_UNSENT = 0;
cocktail.core.resource.XMLHTTPRequest.READY_STATE_OPENED = 1;
cocktail.core.resource.XMLHTTPRequest.READY_STATE_HEADERS_RECEIVED = 2;
cocktail.core.resource.XMLHTTPRequest.READY_STATE_LOADING = 3;
cocktail.core.resource.XMLHTTPRequest.READY_STATE_DONE = 4;
cocktail.core.style.CSSConstants.DISPLAY_STYLE_NAME = "display";
cocktail.core.style.CSSConstants.POSITION_STYLE_NAME = "position";
cocktail.core.style.CSSConstants.FLOAT_STYLE_NAME = "float";
cocktail.core.style.CSSConstants.CLEAR_STYLE_NAME = "clear";
cocktail.core.style.CSSConstants.Z_INDEX_STYLE_NAME = "z-index";
cocktail.core.style.CSSConstants.MARGIN_LEFT_STYLE_NAME = "margin-left";
cocktail.core.style.CSSConstants.MARGIN_RIGHT_STYLE_NAME = "margin-right";
cocktail.core.style.CSSConstants.MARGIN_TOP_STYLE_NAME = "margin-top";
cocktail.core.style.CSSConstants.MARGIN_BOTTOM_STYLE_NAME = "margin-bottom";
cocktail.core.style.CSSConstants.PADDING_LEFT_STYLE_NAME = "padding-left";
cocktail.core.style.CSSConstants.PADDING_RIGHT_STYLE_NAME = "padding-right";
cocktail.core.style.CSSConstants.PADDING_TOP_STYLE_NAME = "padding-top";
cocktail.core.style.CSSConstants.PADDING_BOTTOM_STYLE_NAME = "padding-bottom";
cocktail.core.style.CSSConstants.WIDTH_STYLE_NAME = "width";
cocktail.core.style.CSSConstants.HEIGHT_STYLE_NAME = "height";
cocktail.core.style.CSSConstants.MIN_HEIGHT_STYLE_NAME = "min-height";
cocktail.core.style.CSSConstants.MAX_HEIGHT_STYLE_NAME = "max-height";
cocktail.core.style.CSSConstants.MIN_WIDTH_STYLE_NAME = "min-width";
cocktail.core.style.CSSConstants.MAX_WIDTH_STYLE_NAME = "max-width";
cocktail.core.style.CSSConstants.TOP_STYLE_NAME = "top";
cocktail.core.style.CSSConstants.LEFT_STYLE_NAME = "left";
cocktail.core.style.CSSConstants.RIGHT_STYLE_NAME = "right";
cocktail.core.style.CSSConstants.BOTTOM_STYLE_NAME = "bottom";
cocktail.core.style.CSSConstants.BACKGROUND_COLOR_STYLE_NAME = "background-color";
cocktail.core.style.CSSConstants.BACKGROUND_IMAGE_STYLE_NAME = "background-image";
cocktail.core.style.CSSConstants.BACKGROUND_REPEAT_STYLE_NAME = "background-repeat";
cocktail.core.style.CSSConstants.BACKGROUND_ORIGIN_STYLE_NAME = "background-origin";
cocktail.core.style.CSSConstants.BACKGROUND_SIZE_STYLE_NAME = "background-size";
cocktail.core.style.CSSConstants.BACKGROUND_POSITION_STYLE_NAME = "background-position";
cocktail.core.style.CSSConstants.BACKGROUND_CLIP_STYLE_NAME = "background-clip";
cocktail.core.style.CSSConstants.FONT_SIZE_STYLE_NAME = "font-size";
cocktail.core.style.CSSConstants.FONT_WEIGHT_STYLE_NAME = "font-weight";
cocktail.core.style.CSSConstants.FONT_STYLE_STYLE_NAME = "font-style";
cocktail.core.style.CSSConstants.FONT_FAMILY_STYLE_NAME = "font-family";
cocktail.core.style.CSSConstants.FONT_VARIANT_STYLE_NAME = "font-variant";
cocktail.core.style.CSSConstants.COLOR_STYLE_NAME = "color";
cocktail.core.style.CSSConstants.LINE_HEIGHT_STYLE_NAME = "line-height";
cocktail.core.style.CSSConstants.TEXT_TRANSFORM_STYLE_NAME = "text-tranform";
cocktail.core.style.CSSConstants.LETTER_SPACING_STYLE_NAME = "letter-spacing";
cocktail.core.style.CSSConstants.WORD_SPACING_STYLE_NAME = "word-spacing";
cocktail.core.style.CSSConstants.WHITE_SPACE_STYLE_NAME = "white-space";
cocktail.core.style.CSSConstants.TEXT_ALIGN_STYLE_NAME = "text-align";
cocktail.core.style.CSSConstants.TEXT_INDENT_STYLE_NAME = "text-indent";
cocktail.core.style.CSSConstants.VERTICAL_ALIGN_STYLE_NAME = "vertical-align";
cocktail.core.style.CSSConstants.VISIBILITY_STYLE_NAME = "visibility";
cocktail.core.style.CSSConstants.OVERFLOW_X_STYLE_NAME = "overflow-x";
cocktail.core.style.CSSConstants.OVERFLOW_Y_STYLE_NAME = "overflow-y";
cocktail.core.style.CSSConstants.OPACITY_STYLE_NAME = "opacity";
cocktail.core.style.CSSConstants.CURSOR_STYLE_NAME = "cursor";
cocktail.core.style.CSSConstants.TRANSITION_DURATION_STYLE_NAME = "transition-duration";
cocktail.core.style.CSSConstants.TRANSITION_DELAY_STYLE_NAME = "transition-delay";
cocktail.core.style.CSSConstants.TRANSITION_PROPERTY_STYLE_NAME = "transition-property";
cocktail.core.style.CSSConstants.TRANSITION_TIMING_FUNCTION_STYLE_NAME = "transition-timing-function";
cocktail.core.style.CSSConstants.TRANSFORM_ORIGIN_STYLE_NAME = "transform-origin";
cocktail.core.style.CSSConstants.TRANSFORM_STYLE_NAME = "transform";
cocktail.core.style.transition.TransitionManager.TRANSITION_UPDATE_SPEED = 20;
filemanager.client.models.FilesModel.PATH_UPDTATE = "pathUpdate";
filemanager.client.services.Api.GATEWAY_URL = "server/index.php";
filemanager.client.views.uis.FileUploadStatus.PENDING = "Pending";
filemanager.client.views.uis.FileUploadStatus.PROGRESS = "Progress";
filemanager.client.views.uis.FileUploadStatus.COMPLETE = "Complete";
filemanager.client.views.uis.buttons.CancelButton.VIEW_ID = "CancelButton";
filemanager.client.views.uis.buttons.CancelUploadButton.VIEW_ID = "CancelUploadButton";
filemanager.client.views.uis.buttons.ConfirmButton.VIEW_ID = "ConfirmButton";
filemanager.client.views.uis.buttons.CopyButton.VIEW_ID = "CopyButton";
filemanager.client.views.uis.buttons.CreateFolderButton.VIEW_ID = "CreateFolderButton";
filemanager.client.views.uis.buttons.DeleteButton.VIEW_ID = "DeleteButton";
filemanager.client.views.uis.buttons.DownloadButton.VIEW_ID = "DownloadButton";
filemanager.client.views.uis.buttons.PasteButton.VIEW_ID = "PasteButton";
filemanager.client.views.uis.buttons.RenameButton.VIEW_ID = "RenameButton";
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Template.splitter = new EReg("(::[A-Za-z0-9_ ()&|!+=/><*.\"-]+::|\\$\\$([A-Za-z0-9_-]+)\\()","");
haxe.Template.expr_splitter = new EReg("(\\(|\\)|[ \r\n\t]*\"[^\"]*\"[ \r\n\t]*|[!+=/><*.&|-]+)","");
haxe.Template.expr_trim = new EReg("^[ ]*([^ ]+)[ ]*$","");
haxe.Template.expr_int = new EReg("^[0-9]+$","");
haxe.Template.expr_float = new EReg("^([+-]?)(?=\\d|,\\d)\\d*(,\\d*)?([Ee]([+-]?\\d+))?$","");
haxe.Template.globals = { };
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.CODES = null;
js.Lib.onerror = null;
org.slplayer.component.interaction.Draggable.CSS_CLASS_DRAGZONE = "draggable-dragzone";
org.slplayer.component.interaction.Draggable.CSS_CLASS_DROPZONE = "draggable-dropzone";
org.slplayer.component.interaction.Draggable.CSS_CLASS_PHANTOM = "draggable-phantom";
org.slplayer.component.interaction.Draggable.ATTR_DROPZONE = "data-dropzones-class-name";
org.slplayer.component.interaction.Draggable.EVENT_DRAG = "dragEventDrag";
org.slplayer.component.interaction.Draggable.EVENT_DROPPED = "dragEventDropped";
org.slplayer.core.Application.SLPID_ATTR_NAME = "slpid";
org.slplayer.core.Application.instances = new Hash();
org.slplayer.core.Application.main();
function $hxExpose(src, path) {
	var o = window;
	var parts = path.split(".");
	for(var ii = 0; ii < parts.length-1; ++ii) {
		var p = parts[ii];
		if(typeof o[p] == "undefined") o[p] = {};
		o = o[p];
	}
	o[parts[parts.length-1]] = src;
}
})();
