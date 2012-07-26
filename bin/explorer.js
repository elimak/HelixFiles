var $_, $hxClasses = $hxClasses || {}, $estr = function() { return js.Boot.__string_rec(this,''); }
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,match: function(s) {
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.add(this.matchedLeft());
			buf.add(f(this));
			s = this.matchedRight();
		}
		buf.b[buf.b.length] = s == null?"null":s;
		return buf.b.join("");
	}
	,__class__: EReg
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	h: null
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return a.iterator();
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,toString: function() {
		var s = new StringBuf();
		s.b[s.b.length] = "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b[s.b.length] = i == null?"null":i;
			s.b[s.b.length] = " => ";
			s.add(Std.string(this.get(i)));
			if(it.hasNext()) s.b[s.b.length] = ", ";
		}
		s.b[s.b.length] = "}";
		return s.b.join("");
	}
	,__class__: Hash
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	min: null
	,max: null
	,hasNext: function() {
		return this.min < this.max;
	}
	,next: function() {
		return this.min++;
	}
	,__class__: IntIter
}
var JsExplorer = $hxClasses["JsExplorer"] = function() {
	var manager = new frontend.FileManager();
};
JsExplorer.__name__ = ["JsExplorer"];
JsExplorer.main = function() {
	new JsExplorer();
}
JsExplorer.prototype = {
	__class__: JsExplorer
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
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
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b[s.b.length] = "{";
		while(l != null) {
			if(first) first = false; else s.b[s.b.length] = ", ";
			s.add(Std.string(l[0]));
			l = l[1];
		}
		s.b[s.b.length] = "}";
		return s.b.join("");
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b[s.b.length] = sep == null?"null":sep;
			s.add(l[0]);
			l = l[1];
		}
		return s.b.join("");
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
	,map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
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
	return typeof(f) == "function" && f.__name__ == null;
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
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && v.__name__ != null;
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
Reflect.prototype = {
	__class__: Reflect
}
var Std = $hxClasses["Std"] = function() { }
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
	if(v == 0 && x.charCodeAt(1) == 120) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
Std.prototype = {
	__class__: Std
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = new Array();
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b[this.b.length] = x == null?"null":x;
	}
	,addSub: function(s,pos,len) {
		this.b[this.b.length] = s.substr(pos,len);
	}
	,addChar: function(c) {
		this.b[this.b.length] = String.fromCharCode(c);
	}
	,toString: function() {
		return this.b.join("");
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
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
	return s.length >= start.length && s.substr(0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && s.substr(slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = s.charCodeAt(pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return s.substr(r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return s.substr(0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += c.substr(0,l - sl);
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
		ns += c.substr(0,l - sl);
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
	return s.cca(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
StringTools.prototype = {
	__class__: StringTools
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
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if(o.__enum__ != null) return null;
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
	if(cl == null || cl.__name__ == null) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || e.__ename__ == null) return null;
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
	a.remove("__class__");
	a.remove("__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	a.remove("__name__");
	a.remove("__interfaces__");
	a.remove("__properties__");
	a.remove("__super__");
	a.remove("prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.copy();
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
		if(v.__name__ != null) return ValueType.TObject;
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
Type.prototype = {
	__class__: Type
}
var Xml = $hxClasses["Xml"] = function() {
};
Xml.__name__ = ["Xml"];
Xml.Element = null;
Xml.PCData = null;
Xml.CData = null;
Xml.Comment = null;
Xml.DocType = null;
Xml.Prolog = null;
Xml.Document = null;
Xml.parse = function(str) {
	var rules = [Xml.enode,Xml.epcdata,Xml.eend,Xml.ecdata,Xml.edoctype,Xml.ecomment,Xml.eprolog];
	var nrules = rules.length;
	var current = Xml.createDocument();
	var stack = new List();
	while(str.length > 0) {
		var i = 0;
		try {
			while(i < nrules) {
				var r = rules[i];
				if(r.match(str)) {
					switch(i) {
					case 0:
						var x = Xml.createElement(r.matched(1));
						current.addChild(x);
						str = r.matchedRight();
						while(Xml.eattribute.match(str)) {
							x.set(Xml.eattribute.matched(1),Xml.eattribute.matched(3));
							str = Xml.eattribute.matchedRight();
						}
						if(!Xml.eclose.match(str)) {
							i = nrules;
							throw "__break__";
						}
						if(Xml.eclose.matched(1) == ">") {
							stack.push(current);
							current = x;
						}
						str = Xml.eclose.matchedRight();
						break;
					case 1:
						var x = Xml.createPCData(r.matched(0));
						current.addChild(x);
						str = r.matchedRight();
						break;
					case 2:
						if(current._children != null && current._children.length == 0) {
							var e = Xml.createPCData("");
							current.addChild(e);
						}
						if(r.matched(1) != current._nodeName || stack.isEmpty()) {
							i = nrules;
							throw "__break__";
						}
						current = stack.pop();
						str = r.matchedRight();
						break;
					case 3:
						str = r.matchedRight();
						if(!Xml.ecdata_end.match(str)) throw "End of CDATA section not found";
						var x = Xml.createCData(Xml.ecdata_end.matchedLeft());
						current.addChild(x);
						str = Xml.ecdata_end.matchedRight();
						break;
					case 4:
						var pos = 0;
						var count = 0;
						var old = str;
						try {
							while(true) {
								if(!Xml.edoctype_elt.match(str)) throw "End of DOCTYPE section not found";
								var p = Xml.edoctype_elt.matchedPos();
								pos += p.pos + p.len;
								str = Xml.edoctype_elt.matchedRight();
								switch(Xml.edoctype_elt.matched(0)) {
								case "[":
									count++;
									break;
								case "]":
									count--;
									if(count < 0) throw "Invalid ] found in DOCTYPE declaration";
									break;
								default:
									if(count == 0) throw "__break__";
								}
							}
						} catch( e ) { if( e != "__break__" ) throw e; }
						var x = Xml.createDocType(old.substr(10,pos - 11));
						current.addChild(x);
						break;
					case 5:
						if(!Xml.ecomment_end.match(str)) throw "Unclosed Comment";
						var p = Xml.ecomment_end.matchedPos();
						var x = Xml.createComment(str.substr(4,p.pos + p.len - 7));
						current.addChild(x);
						str = Xml.ecomment_end.matchedRight();
						break;
					case 6:
						var prolog = r.matched(0);
						var x = Xml.createProlog(prolog.substr(2,prolog.length - 4));
						current.addChild(x);
						str = r.matchedRight();
						break;
					}
					throw "__break__";
				}
				i += 1;
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		if(i == nrules) {
			if(str.length > 10) throw "Xml parse error : Unexpected " + str.substr(0,10) + "..."; else throw "Xml parse error : Unexpected " + str;
		}
	}
	if(!stack.isEmpty()) throw "Xml parse error : Unclosed " + stack.last().getNodeName();
	return current;
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
	nodeType: null
	,nodeName: null
	,nodeValue: null
	,parent: null
	,_nodeName: null
	,_nodeValue: null
	,_attributes: null
	,_children: null
	,_parent: null
	,getNodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,setNodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,getNodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,setNodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,getParent: function() {
		return this._parent;
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,remove: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.remove(att);
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,attributes: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.keys();
	}
	,iterator: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			return this.cur < this.x.length;
		}, next : function() {
			return this.x[this.cur++];
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
	,firstChild: function() {
		if(this._children == null) throw "bad nodetype";
		return this._children[0];
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
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) x._parent._children.remove(x);
		x._parent = this;
		this._children.push(x);
	}
	,removeChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		var b = this._children.remove(x);
		if(b) x._parent = null;
		return b;
	}
	,insertChild: function(x,pos) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) x._parent._children.remove(x);
		x._parent = this;
		this._children.insert(pos,x);
	}
	,toString: function() {
		if(this.nodeType == Xml.PCData) return this._nodeValue;
		if(this.nodeType == Xml.CData) return "<![CDATA[" + this._nodeValue + "]]>";
		if(this.nodeType == Xml.Comment) return "<!--" + this._nodeValue + "-->";
		if(this.nodeType == Xml.DocType) return "<!DOCTYPE " + this._nodeValue + ">";
		if(this.nodeType == Xml.Prolog) return "<?" + this._nodeValue + "?>";
		var s = new StringBuf();
		if(this.nodeType == Xml.Element) {
			s.b[s.b.length] = "<";
			s.add(this._nodeName);
			var $it0 = this._attributes.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				s.b[s.b.length] = " ";
				s.b[s.b.length] = k == null?"null":k;
				s.b[s.b.length] = "=\"";
				s.add(this._attributes.get(k));
				s.b[s.b.length] = "\"";
			}
			if(this._children.length == 0) {
				s.b[s.b.length] = "/>";
				return s.b.join("");
			}
			s.b[s.b.length] = ">";
		}
		var $it1 = this.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			s.add(x.toString());
		}
		if(this.nodeType == Xml.Element) {
			s.b[s.b.length] = "</";
			s.add(this._nodeName);
			s.b[s.b.length] = ">";
		}
		return s.b.join("");
	}
	,__class__: Xml
	,__properties__: {get_parent:"getParent",set_nodeValue:"setNodeValue",get_nodeValue:"getNodeValue",set_nodeName:"setNodeName",get_nodeName:"getNodeName"}
}
var cocktail = cocktail || {}
cocktail.Lib = $hxClasses["cocktail.Lib"] = function() {
};
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
if(!cocktail.core) cocktail.core = {}
if(!cocktail.core.drawing) cocktail.core.drawing = {}
cocktail.core.drawing.AbstractDrawingManager = $hxClasses["cocktail.core.drawing.AbstractDrawingManager"] = function(width,height) {
	this._width = width;
	this._height = height;
};
cocktail.core.drawing.AbstractDrawingManager.__name__ = ["cocktail","core","drawing","AbstractDrawingManager"];
cocktail.core.drawing.AbstractDrawingManager.prototype = {
	_nativeElement: null
	,nativeElement: null
	,_width: null
	,width: null
	,_height: null
	,height: null
	,beginFill: function(fillStyle,lineStyle) {
		if(fillStyle == null) fillStyle = cocktail.core.dom.FillStyleValue.none;
		if(lineStyle == null) lineStyle = cocktail.core.dom.LineStyleValue.none;
		this.setFillStyle(fillStyle);
		this.setLineStyle(lineStyle);
	}
	,endFill: function() {
	}
	,clear: function() {
	}
	,setLineStyle: function(lineStyle) {
	}
	,setFillStyle: function(fillStyle) {
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
	,drawImage: function(source,matrix,sourceRect) {
	}
	,lineTo: function(x,y) {
	}
	,moveTo: function(x,y) {
	}
	,curveTo: function(controlX,controlY,x,y) {
	}
	,toNativeAlpha: function(genericAlpa) {
		return null;
	}
	,toNativeColor: function(genericColor) {
		return null;
	}
	,toNativeRatio: function(genericRatio) {
		return null;
	}
	,toNativeCapStyle: function(genericCapStyle) {
		return null;
	}
	,toNativeJointStyle: function(genericJointStyle) {
		return null;
	}
	,getNativeElement: function() {
		return this._nativeElement;
	}
	,setWidth: function(value) {
		return this._width = value;
	}
	,getWidth: function() {
		return this._width;
	}
	,setHeight: function(value) {
		return this._height = value;
	}
	,getHeight: function() {
		return this._height;
	}
	,__class__: cocktail.core.drawing.AbstractDrawingManager
	,__properties__: {set_height:"setHeight",get_height:"getHeight",set_width:"setWidth",get_width:"getWidth",get_nativeElement:"getNativeElement"}
}
if(!cocktail.port) cocktail.port = {}
if(!cocktail.port.server) cocktail.port.server = {}
cocktail.port.server.DrawingManager = $hxClasses["cocktail.port.server.DrawingManager"] = function(width,height) {
	cocktail.core.drawing.AbstractDrawingManager.call(this,width,height);
};
cocktail.port.server.DrawingManager.__name__ = ["cocktail","port","server","DrawingManager"];
cocktail.port.server.DrawingManager.__super__ = cocktail.core.drawing.AbstractDrawingManager;
cocktail.port.server.DrawingManager.prototype = $extend(cocktail.core.drawing.AbstractDrawingManager.prototype,{
	__class__: cocktail.port.server.DrawingManager
});
if(!cocktail.core.background) cocktail.core.background = {}
cocktail.core.background.BackgroundDrawingManager = $hxClasses["cocktail.core.background.BackgroundDrawingManager"] = function(backgroundBox) {
	cocktail.port.server.DrawingManager.call(this,Math.round(backgroundBox.width),Math.round(backgroundBox.height));
};
cocktail.core.background.BackgroundDrawingManager.__name__ = ["cocktail","core","background","BackgroundDrawingManager"];
cocktail.core.background.BackgroundDrawingManager.__super__ = cocktail.port.server.DrawingManager;
cocktail.core.background.BackgroundDrawingManager.prototype = $extend(cocktail.port.server.DrawingManager.prototype,{
	drawBackgroundImage: function(nativeImage,backgroundPositioningBox,backgroundPaintingBox,intrinsicWidth,intrinsicHeight,intrinsicRatio,computedBackgroundSize,computedBackgroundPosition,backgroundRepeat) {
		var totalWidth = Math.round(computedBackgroundPosition.x) + Math.round(backgroundPositioningBox.x);
		var maxWidth = Math.round(backgroundPaintingBox.x + backgroundPaintingBox.width);
		var imageWidth = Math.round(computedBackgroundSize.width);
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
		while(totalHeight < maxHeight) {
			var matrix = new cocktail.core.geom.Matrix();
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
	,drawBackgroundColor: function(color,backgroundPaintingBox) {
		var fillStyle = cocktail.core.dom.FillStyleValue.monochrome(color);
		var lineStyle = cocktail.core.dom.LineStyleValue.none;
		this.beginFill(fillStyle,lineStyle);
		this.drawRect(Math.round(backgroundPaintingBox.x),Math.round(backgroundPaintingBox.y),Math.round(backgroundPaintingBox.width),Math.round(backgroundPaintingBox.height));
		this.endFill();
	}
	,drawBackgroundGradient: function(gradient,backgroundPositioningBox,backgroundPaintingBox,computedBackgroundSize,computedBackgroundPosition,backgroundRepeat) {
		var gradientSurface = new cocktail.port.server.DrawingManager(Math.round(computedBackgroundSize.width),Math.round(computedBackgroundSize.height));
		var fillStyle;
		var lineStyle = cocktail.core.dom.LineStyleValue.none;
		var $e = (gradient);
		switch( $e[1] ) {
		case 0:
			var value = $e[2];
			var gradientStyle = { gradientType : cocktail.core.dom.GradientTypeValue.linear, gradientStops : this.getGradientStops(value.colorStops), rotation : this.getRotation(value.angle)};
			fillStyle = cocktail.core.dom.FillStyleValue.gradient(gradientStyle);
			break;
		}
		gradientSurface.beginFill(fillStyle,lineStyle);
		gradientSurface.drawRect(0,0,Math.round(computedBackgroundSize.width),Math.round(computedBackgroundSize.height));
		gradientSurface.endFill();
		this.drawBackgroundImage(gradientSurface.getNativeElement(),backgroundPositioningBox,backgroundPaintingBox,Math.round(computedBackgroundSize.width),Math.round(computedBackgroundSize.height),computedBackgroundSize.width / computedBackgroundSize.height,computedBackgroundSize,computedBackgroundPosition,backgroundRepeat);
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
	,getRotation: function(value) {
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
	,__class__: cocktail.core.background.BackgroundDrawingManager
});
cocktail.core.background.BackgroundManager = $hxClasses["cocktail.core.background.BackgroundManager"] = function(elementRenderer) {
	this._elementRenderer = elementRenderer;
};
cocktail.core.background.BackgroundManager.__name__ = ["cocktail","core","background","BackgroundManager"];
cocktail.core.background.BackgroundManager.prototype = {
	_elementRenderer: null
	,render: function(backgroundBox,style) {
		var nativeElements = new Array();
		if(backgroundBox.width <= 0 || backgroundBox.height <= 0) return nativeElements;
		var _g1 = 0, _g = style.backgroundImage.length;
		while(_g1 < _g) {
			var i = _g1++;
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
					var imageNativeElement = this.drawBackgroundImage(imageDeclaration,style,backgroundBox,style.backgroundPosition[i],style.backgroundSize[i],style.backgroundOrigin[i],style.backgroundClip[i],style.backgroundRepeat[i],style.backgroundImage[i]);
					nativeElements.push(imageNativeElement);
					break;
				case 1:
					var value1 = $e[2];
					var imageNativeElement = this.drawBackgroundImage(value1,style,backgroundBox,style.backgroundPosition[i],style.backgroundSize[i],style.backgroundOrigin[i],style.backgroundClip[i],style.backgroundRepeat[i],style.backgroundImage[i]);
					nativeElements.push(imageNativeElement);
					break;
				case 2:
					var value1 = $e[2];
					var gradientNativeElement = this.drawBackgroundGradient(style,value1,backgroundBox,style.backgroundPosition[i],style.backgroundSize[i],style.backgroundOrigin[i],style.backgroundClip[i],style.backgroundRepeat[i],style.backgroundImage[i]);
					nativeElements.push(gradientNativeElement);
					break;
				}
				break;
			}
			if(i == style.backgroundImage.length - 1) {
				var backgroundColorNativeElement = this.drawBackgroundColor(style,style.computedStyle.backgroundColor,backgroundBox,style.backgroundPosition[i],style.backgroundSize[i],style.backgroundOrigin[i],style.backgroundClip[i],style.backgroundRepeat[i],style.backgroundImage[i]);
				nativeElements.reverse();
				nativeElements.unshift(backgroundColorNativeElement);
			}
		}
		return nativeElements;
	}
	,drawBackgroundImage: function(imageDeclaration,style,backgroundBox,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage) {
		var backgroundImageDrawingManager = new cocktail.core.background.BackgroundDrawingManager(backgroundBox);
		var backgroundImageNativeElement = backgroundImageDrawingManager.getNativeElement();
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
				resource.addEventListener("load",this.onBackgroundImageLoaded.$bind(this));
				resource.addEventListener("error",this.onBackgroundImageLoadError.$bind(this));
				foundResource = true;
				break;
			}
		}
		if(foundResource == false) {
			var computedBackgroundStyles = cocktail.core.style.computer.BackgroundStylesComputer.computeIndividualBackground(style,backgroundBox,null,null,null,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage);
			var backgroundColor = cocktail.core.unit.UnitManager.getColorDataFromCSSColor(imageDeclaration.fallbackColor);
			var backgroundColorDrawingManager = new cocktail.core.background.BackgroundDrawingManager(backgroundBox);
			backgroundColorDrawingManager.drawBackgroundColor(backgroundColor,computedBackgroundStyles.backgroundClip);
			backgroundImageNativeElement = backgroundColorDrawingManager.getNativeElement();
		}
		return backgroundImageNativeElement;
	}
	,onBackgroundImageLoaded: function(e) {
		this._elementRenderer.invalidate(cocktail.core.renderer.InvalidationReason.other);
	}
	,onBackgroundImageLoadError: function(e) {
		this._elementRenderer.invalidate(cocktail.core.renderer.InvalidationReason.other);
	}
	,drawBackgroundColor: function(style,backgroundColor,backgroundBox,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage) {
		var computedBackgroundStyles = cocktail.core.style.computer.BackgroundStylesComputer.computeIndividualBackground(style,backgroundBox,null,null,null,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage);
		var backgroundColorDrawingManager = new cocktail.core.background.BackgroundDrawingManager(backgroundBox);
		backgroundColorDrawingManager.drawBackgroundColor(backgroundColor,computedBackgroundStyles.backgroundClip);
		return backgroundColorDrawingManager.getNativeElement();
	}
	,drawBackgroundGradient: function(style,gradientValue,backgroundBox,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage) {
		var computedGradientStyles = cocktail.core.style.computer.BackgroundStylesComputer.computeIndividualBackground(style,backgroundBox,null,null,null,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage);
		var backgroundGradientDrawingManager = new cocktail.core.background.BackgroundDrawingManager(backgroundBox);
		backgroundGradientDrawingManager.drawBackgroundGradient(gradientValue,computedGradientStyles.backgroundOrigin,computedGradientStyles.backgroundClip,computedGradientStyles.backgroundSize,computedGradientStyles.backgroundPosition,computedGradientStyles.backgroundRepeat);
		return backgroundGradientDrawingManager.getNativeElement();
	}
	,__class__: cocktail.core.background.BackgroundManager
}
if(!cocktail.core.event) cocktail.core.event = {}
cocktail.core.event.EventTarget = $hxClasses["cocktail.core.event.EventTarget"] = function() {
	this._registeredEventListeners = new Hash();
};
cocktail.core.event.EventTarget.__name__ = ["cocktail","core","event","EventTarget"];
cocktail.core.event.EventTarget.prototype = {
	_registeredEventListeners: null
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
	,addEventListener: function(type,listener,useCapture) {
		if(useCapture == null) useCapture = false;
		if(this._registeredEventListeners.exists(type) == false) this._registeredEventListeners.set(type,new Array());
		this.removeEventListener(type,listener,useCapture);
		var eventListener = new cocktail.core.event.EventListener(type,listener,useCapture);
		this._registeredEventListeners.get(type).push(eventListener);
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
	,shouldStopEventPropagation: function(evt) {
		return evt.propagationStopped == true || evt.immediatePropagationStopped == true;
	}
	,endEventDispatching: function(evt) {
		var defaultPrevented = evt.defaultPrevented;
		this.executeDefaultActionIfNeeded(defaultPrevented,evt);
		evt.reset();
		return defaultPrevented;
	}
	,getTargetAncestors: function() {
		return [];
	}
	,executeDefaultActionIfNeeded: function(defaultPrevented,event) {
	}
	,__class__: cocktail.core.event.EventTarget
}
cocktail.core.event.EventCallback = $hxClasses["cocktail.core.event.EventCallback"] = function() {
	cocktail.core.event.EventTarget.call(this);
};
cocktail.core.event.EventCallback.__name__ = ["cocktail","core","event","EventCallback"];
cocktail.core.event.EventCallback.__super__ = cocktail.core.event.EventTarget;
cocktail.core.event.EventCallback.prototype = $extend(cocktail.core.event.EventTarget.prototype,{
	onclick: null
	,ondblclick: null
	,onmousedown: null
	,onmouseup: null
	,onmouseover: null
	,onmouseout: null
	,onmousemove: null
	,onmousewheel: null
	,onkeydown: null
	,onkeyup: null
	,onfocus: null
	,onblur: null
	,onresize: null
	,onfullscreenchange: null
	,onscroll: null
	,onload: null
	,onerror: null
	,onloadstart: null
	,onprogress: null
	,onsuspend: null
	,onemptied: null
	,onstalled: null
	,onloadedmetadata: null
	,onloadeddata: null
	,oncanplay: null
	,oncanplaythrough: null
	,onplaying: null
	,onwaiting: null
	,onseeking: null
	,onseeked: null
	,onended: null
	,ondurationchange: null
	,ontimeupdate: null
	,onplay: null
	,onpause: null
	,onvolumechange: null
	,ontransitionend: null
	,updateCallbackListener: function(eventType,newListener,oldListener) {
		if(oldListener != null) this.removeEventListener(eventType,oldListener);
		if(newListener != null) this.addEventListener(eventType,newListener);
	}
	,set_onClick: function(value) {
		this.updateCallbackListener("click",value,this.onclick);
		return this.onclick = value;
	}
	,set_onDblClick: function(value) {
		this.updateCallbackListener("dblclick",value,this.ondblclick);
		return this.ondblclick = value;
	}
	,set_onMouseDown: function(value) {
		this.updateCallbackListener("mousedown",value,this.onmousedown);
		return this.onmousedown = value;
	}
	,set_onMouseUp: function(value) {
		this.updateCallbackListener("mouseup",value,this.onmouseup);
		return this.onmouseup = value;
	}
	,set_onMouseOver: function(value) {
		this.updateCallbackListener("mouseover",value,this.onmouseover);
		return this.onmouseover = value;
	}
	,set_onMouseOut: function(value) {
		this.updateCallbackListener("mouseout",value,this.onmouseout);
		return this.onmouseout = value;
	}
	,set_onMouseMove: function(value) {
		this.updateCallbackListener("mousemove",value,this.onmousemove);
		return this.onmousemove = value;
	}
	,set_onMouseWheel: function(value) {
		this.updateCallbackListener("wheel",value,this.onmousewheel);
		return this.onmousewheel = value;
	}
	,set_onKeyDown: function(value) {
		this.updateCallbackListener("keydown",value,this.onkeydown);
		return this.onkeydown = value;
	}
	,set_onKeyUp: function(value) {
		this.updateCallbackListener("keyup",value,this.onkeyup);
		return this.onkeyup = value;
	}
	,set_onFocus: function(value) {
		this.updateCallbackListener("focus",value,this.onfocus);
		return this.onfocus = value;
	}
	,set_onBlur: function(value) {
		this.updateCallbackListener("blur",value,this.onblur);
		return this.onblur = value;
	}
	,set_onResize: function(value) {
		this.updateCallbackListener("resize",value,this.onresize);
		return this.onresize = value;
	}
	,set_onFullScreenChange: function(value) {
		this.updateCallbackListener("fullscreenchange",value,this.onfullscreenchange);
		return this.onfullscreenchange = value;
	}
	,set_onScroll: function(value) {
		this.updateCallbackListener("scroll",value,this.onscroll);
		return this.onscroll = value;
	}
	,set_onLoad: function(value) {
		this.updateCallbackListener("load",value,this.onload);
		return this.onload = value;
	}
	,set_onError: function(value) {
		this.updateCallbackListener("error",value,this.onerror);
		return this.onerror = value;
	}
	,set_onLoadStart: function(value) {
		this.updateCallbackListener("loadstart",value,this.onloadstart);
		return this.onloadstart = value;
	}
	,set_onProgress: function(value) {
		this.updateCallbackListener("progress",value,this.onprogress);
		return this.onprogress = value;
	}
	,set_onSuspend: function(value) {
		this.updateCallbackListener("suspend",value,this.onsuspend);
		return this.onsuspend = value;
	}
	,set_onEmptied: function(value) {
		this.updateCallbackListener("emptied",value,this.onemptied);
		return this.onemptied = value;
	}
	,set_onStalled: function(value) {
		this.updateCallbackListener("stalled",value,this.onstalled);
		return this.onstalled = value;
	}
	,set_onLoadedMetadata: function(value) {
		this.updateCallbackListener("loadedmetadata",value,this.onloadedmetadata);
		return this.onloadedmetadata = value;
	}
	,set_onLoadedData: function(value) {
		this.updateCallbackListener("loadeddata",value,this.onloadeddata);
		return this.onloadeddata = value;
	}
	,set_onCanPlay: function(value) {
		this.updateCallbackListener("canplay",value,this.oncanplay);
		return this.oncanplay = value;
	}
	,set_onCanPlayThrough: function(value) {
		this.updateCallbackListener("canplaythrough",value,this.oncanplaythrough);
		return this.oncanplaythrough = value;
	}
	,set_onPlaying: function(value) {
		this.updateCallbackListener("playing",value,this.onplaying);
		return this.onplaying = value;
	}
	,set_onWaiting: function(value) {
		this.updateCallbackListener("waiting",value,this.onwaiting);
		return this.onwaiting = value;
	}
	,set_onSeeking: function(value) {
		this.updateCallbackListener("seeking",value,this.onseeking);
		return this.set_onWaiting(value);
	}
	,set_onSeeked: function(value) {
		this.updateCallbackListener("seeked",value,this.onseeked);
		return this.onseeked = value;
	}
	,set_onEnded: function(value) {
		this.updateCallbackListener("ended",value,this.onended);
		return this.onended = value;
	}
	,set_onDurationChanged: function(value) {
		this.updateCallbackListener("durationchange",value,this.ondurationchange);
		return this.ondurationchange = value;
	}
	,set_onTimeUpdate: function(value) {
		this.updateCallbackListener("timeupdate",value,this.ontimeupdate);
		return this.ontimeupdate = value;
	}
	,set_onPlay: function(value) {
		this.updateCallbackListener("play",value,this.onplay);
		return this.onplay = value;
	}
	,set_onPause: function(value) {
		this.updateCallbackListener("pause",value,this.onpause);
		return this.onpause = value;
	}
	,set_onVolumeChange: function(value) {
		this.updateCallbackListener("volumechange",value,this.onvolumechange);
		return this.onvolumechange = value;
	}
	,set_onTransitionEnd: function(value) {
		this.updateCallbackListener("transitionend",value,this.ontransitionend);
		return this.ontransitionend = value;
	}
	,__class__: cocktail.core.event.EventCallback
	,__properties__: {set_ontransitionend:"set_onTransitionEnd",set_onvolumechange:"set_onVolumeChange",set_onpause:"set_onPause",set_onplay:"set_onPlay",set_ontimeupdate:"set_onTimeUpdate",set_ondurationchange:"set_onDurationChanged",set_onended:"set_onEnded",set_onseeked:"set_onSeeked",set_onseeking:"set_onSeeking",set_onwaiting:"set_onWaiting",set_onplaying:"set_onPlaying",set_oncanplaythrough:"set_onCanPlayThrough",set_oncanplay:"set_onCanPlay",set_onloadeddata:"set_onLoadedData",set_onloadedmetadata:"set_onLoadedMetadata",set_onstalled:"set_onStalled",set_onemptied:"set_onEmptied",set_onsuspend:"set_onSuspend",set_onprogress:"set_onProgress",set_onloadstart:"set_onLoadStart",set_onerror:"set_onError",set_onload:"set_onLoad",set_onscroll:"set_onScroll",set_onfullscreenchange:"set_onFullScreenChange",set_onresize:"set_onResize",set_onblur:"set_onBlur",set_onfocus:"set_onFocus",set_onkeyup:"set_onKeyUp",set_onkeydown:"set_onKeyDown",set_onmousewheel:"set_onMouseWheel",set_onmousemove:"set_onMouseMove",set_onmouseout:"set_onMouseOut",set_onmouseover:"set_onMouseOver",set_onmouseup:"set_onMouseUp",set_onmousedown:"set_onMouseDown",set_ondblclick:"set_onDblClick",set_onclick:"set_onClick"}
});
if(!cocktail.core.dom) cocktail.core.dom = {}
cocktail.core.dom.NodeBase = $hxClasses["cocktail.core.dom.NodeBase"] = function() {
	cocktail.core.event.EventCallback.call(this);
	this.childNodes = new Array();
};
cocktail.core.dom.NodeBase.__name__ = ["cocktail","core","dom","NodeBase"];
cocktail.core.dom.NodeBase.__super__ = cocktail.core.event.EventCallback;
cocktail.core.dom.NodeBase.prototype = $extend(cocktail.core.event.EventCallback.prototype,{
	parentNode: null
	,childNodes: null
	,firstChild: null
	,lastChild: null
	,nextSibling: null
	,previousSibling: null
	,removeChild: function(oldChild) {
		oldChild.parentNode = null;
		var newChildNodes = new Array();
		var length = this.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			if(this.childNodes[i] != oldChild) newChildNodes.push(this.childNodes[i]);
		}
		this.childNodes = newChildNodes;
		return oldChild;
	}
	,appendChild: function(newChild) {
		this.removeFromParentIfNecessary(newChild);
		newChild.parentNode = this;
		this.childNodes.push(newChild);
		return newChild;
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
	,isSameNode: function(other) {
		return other == this;
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
	,hasChildNodes: function() {
		return this.childNodes.length > 0;
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
	,removeFromParentIfNecessary: function(newChild) {
		if(newChild.parentNode != null) {
			var parentNode = newChild.parentNode;
			parentNode.removeChild(newChild);
		}
	}
	,get_firstChild: function() {
		if(this.hasChildNodes() == true) return this.childNodes[0]; else return null;
	}
	,get_lastChild: function() {
		if(this.hasChildNodes() == true) return this.childNodes[this.childNodes.length - 1]; else return null;
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
	,get_previousSibling: function() {
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
	,__class__: cocktail.core.dom.NodeBase
	,__properties__: $extend(cocktail.core.event.EventCallback.prototype.__properties__,{get_previousSibling:"get_previousSibling",get_nextSibling:"get_nextSibling",get_lastChild:"get_lastChild",get_firstChild:"get_firstChild"})
});
cocktail.core.dom.Node = $hxClasses["cocktail.core.dom.Node"] = function() {
	cocktail.core.dom.NodeBase.call(this);
};
cocktail.core.dom.Node.__name__ = ["cocktail","core","dom","Node"];
cocktail.core.dom.Node.__super__ = cocktail.core.dom.NodeBase;
cocktail.core.dom.Node.prototype = $extend(cocktail.core.dom.NodeBase.prototype,{
	nodeType: null
	,nodeValue: null
	,nodeName: null
	,attributes: null
	,ownerDocument: null
	,hasAttributes: function() {
		return false;
	}
	,get_nodeType: function() {
		return -1;
	}
	,get_nodeValue: function() {
		return null;
	}
	,set_nodeValue: function(value) {
		if(value != null) throw 7;
		return value;
	}
	,get_nodeName: function() {
		return null;
	}
	,__class__: cocktail.core.dom.Node
	,__properties__: $extend(cocktail.core.dom.NodeBase.prototype.__properties__,{get_nodeName:"get_nodeName",set_nodeValue:"set_nodeValue",get_nodeValue:"get_nodeValue",get_nodeType:"get_nodeType"})
});
cocktail.core.dom.Attr = $hxClasses["cocktail.core.dom.Attr"] = function(name) {
	this.name = name;
	this.specified = false;
	cocktail.core.dom.Node.call(this);
};
cocktail.core.dom.Attr.__name__ = ["cocktail","core","dom","Attr"];
cocktail.core.dom.Attr.__super__ = cocktail.core.dom.Node;
cocktail.core.dom.Attr.prototype = $extend(cocktail.core.dom.Node.prototype,{
	name: null
	,value: null
	,specified: null
	,isId: null
	,ownerElement: null
	,get_nodeName: function() {
		return this.name;
	}
	,get_nodeType: function() {
		return 2;
	}
	,get_nodeValue: function() {
		return this.get_value();
	}
	,set_nodeValue: function(value) {
		return this.set_value(value);
	}
	,get_value: function() {
		if(this.value == null) return "";
		return this.value;
	}
	,set_value: function(value) {
		this.specified = true;
		return this.value = value;
	}
	,__class__: cocktail.core.dom.Attr
	,__properties__: $extend(cocktail.core.dom.Node.prototype.__properties__,{set_value:"set_value",get_value:"get_value"})
});
cocktail.core.dom.Element = $hxClasses["cocktail.core.dom.Element"] = function(tagName) {
	this.tagName = tagName;
	this.attributes = new cocktail.core.dom.NamedNodeMap();
	cocktail.core.dom.Node.call(this);
};
cocktail.core.dom.Element.__name__ = ["cocktail","core","dom","Element"];
cocktail.core.dom.Element.__super__ = cocktail.core.dom.Node;
cocktail.core.dom.Element.prototype = $extend(cocktail.core.dom.Node.prototype,{
	tagName: null
	,firstElementChild: null
	,lastElementChild: null
	,previousElementSibling: null
	,nextElementSibling: null
	,childElementCount: null
	,getAttribute: function(name) {
		var attribute = this.getAttributeNode(name);
		if(attribute != null) return attribute.get_value(); else return null;
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
	,getAttributeNode: function(name) {
		var attribute = this.attributes.getNamedItem(name);
		if(attribute != null) return attribute;
		return null;
	}
	,setAttributeNode: function(newAttr) {
		newAttr.ownerElement = this;
		return this.attributes.setNamedItem(newAttr);
	}
	,removeAttribute: function(name) {
		var removedAttribute = this.attributes.removeNamedItem(name);
		if(removedAttribute != null) removedAttribute.ownerElement = null;
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
	,setIdAttributeNode: function(idAttr,isId) {
		idAttr.isId = isId;
		this.attributes.setNamedItem(idAttr);
	}
	,hasAttribute: function(name) {
		return this.attributes.getNamedItem(name) != null;
	}
	,getElementsByTagName: function(tagName) {
		var elements = new Array();
		this.doGetElementsByTagName(this,tagName,elements);
		return elements;
	}
	,getElementsByClassName: function(className) {
		var elements = new Array();
		this.doGetElementsByClassName(this,className,elements);
		return elements;
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
	,hasAttributes: function() {
		return this.attributes.get_length() > 0;
	}
	,get_nodeName: function() {
		return this.tagName;
	}
	,get_nodeType: function() {
		return 1;
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
	,get_nextElementSibling: function() {
		if(this.get_nextSibling() == null) return null;
		var nextElementSibling = this.get_nextSibling();
		while(nextElementSibling.get_nodeType() != 1) {
			nextElementSibling = nextElementSibling.get_nextSibling();
			if(nextElementSibling == null) return null;
		}
		return nextElementSibling;
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
	,get_childElementCount: function() {
		var childElementCount = 0;
		var length = this.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			if(this.childNodes[i].get_nodeType() == 1) childElementCount++;
		}
		return childElementCount;
	}
	,__class__: cocktail.core.dom.Element
	,__properties__: $extend(cocktail.core.dom.Node.prototype.__properties__,{get_childElementCount:"get_childElementCount",get_nextElementSibling:"get_nextElementSibling",get_previousElementSibling:"get_previousElementSibling",get_lastElementChild:"get_lastElementChild",get_firstElementChild:"get_firstElementChild"})
});
if(!cocktail.core.html) cocktail.core.html = {}
cocktail.core.html.HTMLElement = $hxClasses["cocktail.core.html.HTMLElement"] = function(tagName) {
	cocktail.core.dom.Element.call(this,tagName);
	this.init();
};
cocktail.core.html.HTMLElement.__name__ = ["cocktail","core","html","HTMLElement"];
cocktail.core.html.HTMLElement.__super__ = cocktail.core.dom.Element;
cocktail.core.html.HTMLElement.prototype = $extend(cocktail.core.dom.Element.prototype,{
	tabIndex: null
	,id: null
	,className: null
	,hidden: null
	,scrollTop: null
	,scrollLeft: null
	,scrollHeight: null
	,scrollWidth: null
	,innerHTML: null
	,elementRenderer: null
	,offsetParent: null
	,offsetWidth: null
	,offsetHeight: null
	,offsetLeft: null
	,offsetTop: null
	,clientWidth: null
	,clientHeight: null
	,clientLeft: null
	,clientTop: null
	,coreStyle: null
	,style: null
	,init: function() {
		this.initCoreStyle();
		this.initStyle();
		this.initId();
	}
	,initCoreStyle: function() {
		this.coreStyle = new cocktail.core.style.CoreStyle(this);
	}
	,initStyle: function() {
		this.style = new cocktail.core.style.adapter.Style(this.coreStyle);
	}
	,initId: function() {
		var id = new cocktail.core.dom.Attr("id");
		this.setIdAttributeNode(id,true);
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
	,getElementsByTagName: function(tagName) {
		return cocktail.core.dom.Element.prototype.getElementsByTagName.call(this,tagName.toUpperCase());
	}
	,setAttribute: function(name,value) {
		if(name == "style") {
			var styleProxy = new lib.hxtml.StyleProxy();
			new lib.hxtml.CssParser().parse(value,this,styleProxy);
			cocktail.core.dom.Element.prototype.setAttribute.call(this,name,value);
		} else cocktail.core.dom.Element.prototype.setAttribute.call(this,name,value);
	}
	,getAttribute: function(name) {
		if(name == "tabIndex") return Std.string(this.get_tabIndex()); else return cocktail.core.dom.Element.prototype.getAttribute.call(this,name);
	}
	,getTargetAncestors: function() {
		var targetAncestors = cocktail.core.dom.Element.prototype.getTargetAncestors.call(this);
		targetAncestors.push(cocktail.Lib.get_document());
		targetAncestors.push(cocktail.Lib.get_window());
		return targetAncestors;
	}
	,executeDefaultActionIfNeeded: function(defaultPrevented,event) {
		if(defaultPrevented == false) switch(event.type) {
		case "mousedown":
			this.focus();
			break;
		}
	}
	,invalidate: function(invalidationReason) {
		if(this.elementRenderer != null) this.elementRenderer.invalidate(invalidationReason);
	}
	,invalidatePositioningScheme: function() {
		if(this.parentNode != null) {
			this.parentNode.detach();
			this.parentNode.attach();
		}
	}
	,attach: function() {
		if(this.isParentRendered() == true) {
			this.coreStyle.computeDisplayStyles();
			if(this.elementRenderer == null && this.isRendered() == true) this.createElementRenderer();
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
	,attachToParentElementRenderer: function() {
		var parent = this.parentNode;
		parent.elementRenderer.insertBefore(this.elementRenderer,this.getNextElementRendererSibling());
	}
	,detachFromParentElementRenderer: function() {
		this.elementRenderer.parentNode.removeChild(this.elementRenderer);
	}
	,createElementRenderer: function() {
		switch( (this.coreStyle.computedStyle.display)[1] ) {
		case 0:
		case 1:
			this.elementRenderer = new cocktail.core.renderer.BlockBoxRenderer(this);
			this.elementRenderer.set_coreStyle(this.coreStyle);
			break;
		case 2:
			this.elementRenderer = new cocktail.core.renderer.InlineBoxRenderer(this);
			this.elementRenderer.set_coreStyle(this.coreStyle);
			break;
		case 3:
			break;
		}
	}
	,isRendered: function() {
		if(this.get_hidden() == true) return false;
		if(this.coreStyle.computedStyle.display == cocktail.core.style.Display.none) return false;
		return true;
	}
	,isParentRendered: function() {
		if(this.parentNode == null) return false;
		var htmlParent = this.parentNode;
		if(htmlParent.elementRenderer != null) return true; else return false;
	}
	,click: function() {
		var mouseEvent = new cocktail.core.event.MouseEvent();
		mouseEvent.initMouseEvent("click",false,false,null,0,0,0,0,0,false,false,false,false,0,null);
		this.dispatchEvent(mouseEvent);
	}
	,fireEvent: function(eventTye,bubbles,cancelable) {
		var event = new cocktail.core.event.Event();
		event.initEvent(eventTye,bubbles,cancelable);
		this.dispatchEvent(event);
	}
	,isFocusable: function() {
		if(this.parentNode == null) return false; else if(this.isDefaultFocusable() == true) return true; else if(this.get_tabIndex() > 0) return true;
		return false;
	}
	,isDefaultFocusable: function() {
		return false;
	}
	,focus: function() {
		var htmlDocument = this.ownerDocument;
		htmlDocument.set_activeElement(this);
	}
	,blur: function() {
		var htmlDocument = this.ownerDocument;
		htmlDocument.body.focus();
	}
	,requestFullScreen: function() {
		var htmlDocument = this.ownerDocument;
		htmlDocument.set_fullscreenElement(this);
	}
	,hasActivationBehaviour: function() {
		return false;
	}
	,runPreClickActivation: function() {
	}
	,runCanceledActivationStep: function() {
	}
	,runPostClickActivationStep: function(event) {
	}
	,getNearestActivatableElement: function() {
		var htmlElement = this;
		while(htmlElement.hasActivationBehaviour() == false) {
			if(htmlElement.parentNode == null) return null;
			htmlElement = htmlElement.parentNode;
		}
		return htmlElement;
	}
	,isVerticallyScrollable: function(scrollOffset) {
		if(scrollOffset == null) scrollOffset = 0;
		if(this.elementRenderer != null) return this.elementRenderer.isVerticallyScrollable(scrollOffset);
		return false;
	}
	,isHorizontallyScrollable: function(scrollOffset) {
		if(scrollOffset == null) scrollOffset = 0;
		if(this.elementRenderer != null) return this.elementRenderer.isHorizontallyScrollable(scrollOffset);
		return false;
	}
	,get_scrollHeight: function() {
		if(this.elementRenderer != null) return Math.round(this.elementRenderer.get_scrollHeight());
		return 0;
	}
	,get_scrollWidth: function() {
		if(this.elementRenderer != null) return Math.round(this.elementRenderer.get_scrollWidth());
		return 0;
	}
	,set_scrollLeft: function(value) {
		if(this.elementRenderer != null) this.elementRenderer.set_scrollLeft(value);
		return 0;
	}
	,get_scrollLeft: function() {
		if(this.elementRenderer != null) return Math.round(this.elementRenderer.get_scrollLeft());
		return 0;
	}
	,set_scrollTop: function(value) {
		if(this.elementRenderer != null) this.elementRenderer.set_scrollTop(value);
		return 0;
	}
	,get_scrollTop: function() {
		if(this.elementRenderer != null) return Math.round(this.elementRenderer.get_scrollTop());
		return 0;
	}
	,set_tabIndex: function(value) {
		this.setAttribute("tabIndex",Std.string(value));
		return value;
	}
	,get_tabIndex: function() {
		var tabIndex = cocktail.core.dom.Element.prototype.getAttribute.call(this,"tabIndex");
		if(tabIndex == "") {
			if(this.isDefaultFocusable() == true) return 0; else return -1;
		} else return Std.parseInt(tabIndex);
	}
	,get_id: function() {
		return this.getAttribute("id");
	}
	,set_id: function(value) {
		this.setAttribute("id",value);
		return value;
	}
	,get_className: function() {
		return this.getAttribute("class");
	}
	,set_className: function(value) {
		this.setAttribute("class",value);
		return value;
	}
	,get_hidden: function() {
		if(this.getAttribute("hidden") != null) return true; else return false;
	}
	,set_hidden: function(value) {
		cocktail.core.dom.Element.prototype.setAttribute.call(this,"hidden",Std.string(value));
		return value;
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
	,get_innerHTML: function() {
		var xml = this.doGetInnerHTML(this,Xml.createElement(this.get_nodeName()));
		var str = xml.toString();
		str = str.substr(str.indexOf(">") + 1,str.lastIndexOf("<") - str.indexOf(">") - 1);
		return str;
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
	,isVoidElement: function() {
		return false;
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
	,get_offsetWidth: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		var computedStyle = this.coreStyle.computedStyle;
		return Math.round(computedStyle.getWidth() + computedStyle.getPaddingLeft() + computedStyle.getPaddingRight());
	}
	,get_offsetHeight: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		var computedStyle = this.coreStyle.computedStyle;
		return Math.round(computedStyle.getHeight() + computedStyle.getPaddingTop() + computedStyle.getPaddingBottom());
	}
	,get_offsetLeft: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		return Math.round(this.elementRenderer.positionedOrigin.x);
	}
	,get_offsetTop: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		return Math.round(this.elementRenderer.positionedOrigin.y);
	}
	,get_clientWidth: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		var computedStyle = this.coreStyle.computedStyle;
		return Math.round(computedStyle.getWidth() + computedStyle.getPaddingLeft() + computedStyle.getPaddingRight());
	}
	,get_clientHeight: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		var computedStyle = this.coreStyle.computedStyle;
		return Math.round(computedStyle.getHeight() + computedStyle.getPaddingTop() + computedStyle.getPaddingBottom());
	}
	,get_clientTop: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		return 0;
	}
	,get_clientLeft: function() {
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		return 0;
	}
	,__class__: cocktail.core.html.HTMLElement
	,__properties__: $extend(cocktail.core.dom.Element.prototype.__properties__,{get_clientTop:"get_clientTop",get_clientLeft:"get_clientLeft",get_clientHeight:"get_clientHeight",get_clientWidth:"get_clientWidth",get_offsetTop:"get_offsetTop",get_offsetLeft:"get_offsetLeft",get_offsetHeight:"get_offsetHeight",get_offsetWidth:"get_offsetWidth",get_offsetParent:"get_offsetParent",set_innerHTML:"set_innerHTML",get_innerHTML:"get_innerHTML",get_scrollWidth:"get_scrollWidth",get_scrollHeight:"get_scrollHeight",set_scrollLeft:"set_scrollLeft",get_scrollLeft:"get_scrollLeft",set_scrollTop:"set_scrollTop",get_scrollTop:"get_scrollTop",set_hidden:"set_hidden",get_hidden:"get_hidden",set_className:"set_className",get_className:"get_className",set_id:"set_id",get_id:"get_id",set_tabIndex:"set_tabIndex",get_tabIndex:"get_tabIndex"})
});
cocktail.core.dom.CharacterData = $hxClasses["cocktail.core.dom.CharacterData"] = function() {
	cocktail.core.html.HTMLElement.call(this,"");
};
cocktail.core.dom.CharacterData.__name__ = ["cocktail","core","dom","CharacterData"];
cocktail.core.dom.CharacterData.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.dom.CharacterData.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	data: null
	,get_nodeValue: function() {
		return this.data;
	}
	,set_nodeValue: function(value) {
		return this.data = value;
	}
	,__class__: cocktail.core.dom.CharacterData
});
cocktail.core.dom.Comment = $hxClasses["cocktail.core.dom.Comment"] = function() {
	cocktail.core.dom.CharacterData.call(this);
};
cocktail.core.dom.Comment.__name__ = ["cocktail","core","dom","Comment"];
cocktail.core.dom.Comment.__super__ = cocktail.core.dom.CharacterData;
cocktail.core.dom.Comment.prototype = $extend(cocktail.core.dom.CharacterData.prototype,{
	get_nodeType: function() {
		return 8;
	}
	,__class__: cocktail.core.dom.Comment
});
cocktail.core.dom.FillStyleValue = $hxClasses["cocktail.core.dom.FillStyleValue"] = { __ename__ : ["cocktail","core","dom","FillStyleValue"], __constructs__ : ["none","monochrome","gradient","bitmap"] }
cocktail.core.dom.FillStyleValue.none = ["none",0];
cocktail.core.dom.FillStyleValue.none.toString = $estr;
cocktail.core.dom.FillStyleValue.none.__enum__ = cocktail.core.dom.FillStyleValue;
cocktail.core.dom.FillStyleValue.monochrome = function(colorStop) { var $x = ["monochrome",1,colorStop]; $x.__enum__ = cocktail.core.dom.FillStyleValue; $x.toString = $estr; return $x; }
cocktail.core.dom.FillStyleValue.gradient = function(gradientStyle) { var $x = ["gradient",2,gradientStyle]; $x.__enum__ = cocktail.core.dom.FillStyleValue; $x.toString = $estr; return $x; }
cocktail.core.dom.FillStyleValue.bitmap = function(nativeElement,repeat) { var $x = ["bitmap",3,nativeElement,repeat]; $x.__enum__ = cocktail.core.dom.FillStyleValue; $x.toString = $estr; return $x; }
cocktail.core.dom.LineStyleValue = $hxClasses["cocktail.core.dom.LineStyleValue"] = { __ename__ : ["cocktail","core","dom","LineStyleValue"], __constructs__ : ["none","monochrome","gradient","bitmap"] }
cocktail.core.dom.LineStyleValue.none = ["none",0];
cocktail.core.dom.LineStyleValue.none.toString = $estr;
cocktail.core.dom.LineStyleValue.none.__enum__ = cocktail.core.dom.LineStyleValue;
cocktail.core.dom.LineStyleValue.monochrome = function(color,lineStyle) { var $x = ["monochrome",1,color,lineStyle]; $x.__enum__ = cocktail.core.dom.LineStyleValue; $x.toString = $estr; return $x; }
cocktail.core.dom.LineStyleValue.gradient = function(gradientStyle,lineStyle) { var $x = ["gradient",2,gradientStyle,lineStyle]; $x.__enum__ = cocktail.core.dom.LineStyleValue; $x.toString = $estr; return $x; }
cocktail.core.dom.LineStyleValue.bitmap = function(nativeElement,lineStyle,repeat) { var $x = ["bitmap",3,nativeElement,lineStyle,repeat]; $x.__enum__ = cocktail.core.dom.LineStyleValue; $x.toString = $estr; return $x; }
cocktail.core.dom.GradientTypeValue = $hxClasses["cocktail.core.dom.GradientTypeValue"] = { __ename__ : ["cocktail","core","dom","GradientTypeValue"], __constructs__ : ["linear","radial"] }
cocktail.core.dom.GradientTypeValue.linear = ["linear",0];
cocktail.core.dom.GradientTypeValue.linear.toString = $estr;
cocktail.core.dom.GradientTypeValue.linear.__enum__ = cocktail.core.dom.GradientTypeValue;
cocktail.core.dom.GradientTypeValue.radial = ["radial",1];
cocktail.core.dom.GradientTypeValue.radial.toString = $estr;
cocktail.core.dom.GradientTypeValue.radial.__enum__ = cocktail.core.dom.GradientTypeValue;
cocktail.core.dom.CapsStyleValue = $hxClasses["cocktail.core.dom.CapsStyleValue"] = { __ename__ : ["cocktail","core","dom","CapsStyleValue"], __constructs__ : ["none","square","round"] }
cocktail.core.dom.CapsStyleValue.none = ["none",0];
cocktail.core.dom.CapsStyleValue.none.toString = $estr;
cocktail.core.dom.CapsStyleValue.none.__enum__ = cocktail.core.dom.CapsStyleValue;
cocktail.core.dom.CapsStyleValue.square = ["square",1];
cocktail.core.dom.CapsStyleValue.square.toString = $estr;
cocktail.core.dom.CapsStyleValue.square.__enum__ = cocktail.core.dom.CapsStyleValue;
cocktail.core.dom.CapsStyleValue.round = ["round",2];
cocktail.core.dom.CapsStyleValue.round.toString = $estr;
cocktail.core.dom.CapsStyleValue.round.__enum__ = cocktail.core.dom.CapsStyleValue;
cocktail.core.dom.JointStyleValue = $hxClasses["cocktail.core.dom.JointStyleValue"] = { __ename__ : ["cocktail","core","dom","JointStyleValue"], __constructs__ : ["miter","round","bevel"] }
cocktail.core.dom.JointStyleValue.miter = ["miter",0];
cocktail.core.dom.JointStyleValue.miter.toString = $estr;
cocktail.core.dom.JointStyleValue.miter.__enum__ = cocktail.core.dom.JointStyleValue;
cocktail.core.dom.JointStyleValue.round = ["round",1];
cocktail.core.dom.JointStyleValue.round.toString = $estr;
cocktail.core.dom.JointStyleValue.round.__enum__ = cocktail.core.dom.JointStyleValue;
cocktail.core.dom.JointStyleValue.bevel = ["bevel",2];
cocktail.core.dom.JointStyleValue.bevel.toString = $estr;
cocktail.core.dom.JointStyleValue.bevel.__enum__ = cocktail.core.dom.JointStyleValue;
cocktail.core.dom.DOMException = $hxClasses["cocktail.core.dom.DOMException"] = function() {
};
cocktail.core.dom.DOMException.__name__ = ["cocktail","core","dom","DOMException"];
cocktail.core.dom.DOMException.prototype = {
	__class__: cocktail.core.dom.DOMException
}
cocktail.core.dom.Document = $hxClasses["cocktail.core.dom.Document"] = function() {
	cocktail.core.dom.Node.call(this);
};
cocktail.core.dom.Document.__name__ = ["cocktail","core","dom","Document"];
cocktail.core.dom.Document.__super__ = cocktail.core.dom.Node;
cocktail.core.dom.Document.prototype = $extend(cocktail.core.dom.Node.prototype,{
	documentElement: null
	,createElement: function(tagName) {
		return null;
	}
	,createTextNode: function(data) {
		var text = new cocktail.core.dom.Text();
		text.set_nodeValue(data);
		return text;
	}
	,createComment: function(data) {
		var comment = new cocktail.core.dom.Comment();
		comment.set_nodeValue(data);
		return comment;
	}
	,createAttribute: function(name) {
		var attribute = new cocktail.core.dom.Attr(name);
		return attribute;
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
	,getElementById: function(elementId) {
		return this.doGetElementById(this.documentElement,elementId);
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
	,getElementsByTagName: function(tagName) {
		return this.documentElement.getElementsByTagName(tagName);
	}
	,getElementsByClassName: function(className) {
		return this.documentElement.getElementsByClassName(className);
	}
	,get_nodeType: function() {
		return 9;
	}
	,__class__: cocktail.core.dom.Document
});
cocktail.core.dom.NamedNodeMap = $hxClasses["cocktail.core.dom.NamedNodeMap"] = function() {
	this._nodes = new Array();
};
cocktail.core.dom.NamedNodeMap.__name__ = ["cocktail","core","dom","NamedNodeMap"];
cocktail.core.dom.NamedNodeMap.prototype = {
	_nodes: null
	,length: null
	,getNamedItem: function(name) {
		var nodesLength = this._nodes.length;
		var _g = 0;
		while(_g < nodesLength) {
			var i = _g++;
			if(this._nodes[i].get_nodeName() == name) return this._nodes[i];
		}
		return null;
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
	,item: function(index) {
		if(index > this.get_length() - 1) return null; else return this._nodes[index];
	}
	,get_length: function() {
		return this._nodes.length;
	}
	,__class__: cocktail.core.dom.NamedNodeMap
	,__properties__: {get_length:"get_length"}
}
cocktail.core.dom.Text = $hxClasses["cocktail.core.dom.Text"] = function() {
	cocktail.core.dom.CharacterData.call(this);
};
cocktail.core.dom.Text.__name__ = ["cocktail","core","dom","Text"];
cocktail.core.dom.Text.__super__ = cocktail.core.dom.CharacterData;
cocktail.core.dom.Text.prototype = $extend(cocktail.core.dom.CharacterData.prototype,{
	createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.TextRenderer(this);
		var parent = this.parentNode;
		this.elementRenderer.set_coreStyle(parent.coreStyle);
	}
	,get_nodeType: function() {
		return 3;
	}
	,__class__: cocktail.core.dom.Text
});
cocktail.core.event.Event = $hxClasses["cocktail.core.event.Event"] = function() {
};
cocktail.core.event.Event.__name__ = ["cocktail","core","event","Event"];
cocktail.core.event.Event.prototype = {
	eventPhase: null
	,type: null
	,target: null
	,currentTarget: null
	,bubbles: null
	,cancelable: null
	,defaultPrevented: null
	,propagationStopped: null
	,immediatePropagationStopped: null
	,dispatched: null
	,initEvent: function(eventTypeArg,canBubbleArg,cancelableArg) {
		if(this.dispatched == true) return;
		this.type = eventTypeArg;
		this.bubbles = canBubbleArg;
		this.cancelable = cancelableArg;
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
	,preventDefault: function() {
		this.defaultPrevented = true;
	}
	,stopPropagation: function() {
		this.propagationStopped = true;
	}
	,stopImmediatePropagation: function() {
		this.immediatePropagationStopped = true;
	}
	,__class__: cocktail.core.event.Event
}
cocktail.core.event.CustomEvent = $hxClasses["cocktail.core.event.CustomEvent"] = function() {
	cocktail.core.event.Event.call(this);
};
cocktail.core.event.CustomEvent.__name__ = ["cocktail","core","event","CustomEvent"];
cocktail.core.event.CustomEvent.__super__ = cocktail.core.event.Event;
cocktail.core.event.CustomEvent.prototype = $extend(cocktail.core.event.Event.prototype,{
	detail: null
	,initCustomEvent: function(eventTypeArg,canBubbleArg,cancelableArg,detailArg) {
		if(this.dispatched == true) return;
		this.initEvent(eventTypeArg,canBubbleArg,cancelableArg);
		this.detail = detailArg;
	}
	,__class__: cocktail.core.event.CustomEvent
});
cocktail.core.event.EventListener = $hxClasses["cocktail.core.event.EventListener"] = function(eventType,listener,useCapture) {
	this.listener = listener;
	this.useCapture = useCapture;
	this.eventType = eventType;
};
cocktail.core.event.EventListener.__name__ = ["cocktail","core","event","EventListener"];
cocktail.core.event.EventListener.prototype = {
	useCapture: null
	,listener: null
	,eventType: null
	,handleEvent: function(evt) {
		this.listener(evt);
	}
	,dispose: function() {
		this.listener = null;
	}
	,__class__: cocktail.core.event.EventListener
}
cocktail.core.event.UIEvent = $hxClasses["cocktail.core.event.UIEvent"] = function() {
	cocktail.core.event.Event.call(this);
};
cocktail.core.event.UIEvent.__name__ = ["cocktail","core","event","UIEvent"];
cocktail.core.event.UIEvent.__super__ = cocktail.core.event.Event;
cocktail.core.event.UIEvent.prototype = $extend(cocktail.core.event.Event.prototype,{
	view: null
	,detail: null
	,initUIEvent: function(eventTypeArg,canBubbleArg,cancelableArg,viewArg,detailArg) {
		if(this.dispatched == true) return;
		this.initEvent(eventTypeArg,canBubbleArg,cancelableArg);
		this.view = viewArg;
		this.detail = detailArg;
	}
	,__class__: cocktail.core.event.UIEvent
});
cocktail.core.event.FocusEvent = $hxClasses["cocktail.core.event.FocusEvent"] = function() {
	cocktail.core.event.UIEvent.call(this);
};
cocktail.core.event.FocusEvent.__name__ = ["cocktail","core","event","FocusEvent"];
cocktail.core.event.FocusEvent.__super__ = cocktail.core.event.UIEvent;
cocktail.core.event.FocusEvent.prototype = $extend(cocktail.core.event.UIEvent.prototype,{
	relatedTarget: null
	,initFocusEvent: function(eventTypeArg,canBubbleArg,cancelableArg,viewArg,detailArg,relatedTargetArg) {
		if(this.dispatched == true) return;
		this.initUIEvent(eventTypeArg,canBubbleArg,cancelableArg,viewArg,detailArg);
		this.relatedTarget = relatedTargetArg;
	}
	,__class__: cocktail.core.event.FocusEvent
});
cocktail.core.event.KeyboardEvent = $hxClasses["cocktail.core.event.KeyboardEvent"] = function() {
	cocktail.core.event.UIEvent.call(this);
};
cocktail.core.event.KeyboardEvent.__name__ = ["cocktail","core","event","KeyboardEvent"];
cocktail.core.event.KeyboardEvent.__super__ = cocktail.core.event.UIEvent;
cocktail.core.event.KeyboardEvent.prototype = $extend(cocktail.core.event.UIEvent.prototype,{
	keyChar: null
	,key: null
	,location: null
	,locale: null
	,ctrlKey: null
	,shiftKey: null
	,altKey: null
	,metaKey: null
	,repeat: null
	,initKeyboardEvent: function(eventTypeArg,canBubbleArg,cancelableArg,viewArg,charArg,keyArg,locationArg,modifiersListArg,repeatArg,localeArg) {
		if(this.dispatched == true) return;
		this.initUIEvent(eventTypeArg,canBubbleArg,cancelableArg,viewArg,0);
		this.keyChar = charArg;
		this.key = keyArg;
		this.repeat = repeatArg;
		this.location = locationArg;
		this.locale = localeArg;
	}
	,__class__: cocktail.core.event.KeyboardEvent
});
cocktail.core.event.MouseEvent = $hxClasses["cocktail.core.event.MouseEvent"] = function() {
	cocktail.core.event.UIEvent.call(this);
};
cocktail.core.event.MouseEvent.__name__ = ["cocktail","core","event","MouseEvent"];
cocktail.core.event.MouseEvent.__super__ = cocktail.core.event.UIEvent;
cocktail.core.event.MouseEvent.prototype = $extend(cocktail.core.event.UIEvent.prototype,{
	screenX: null
	,screenY: null
	,clientX: null
	,clientY: null
	,ctrlKey: null
	,shiftKey: null
	,altKey: null
	,metaKey: null
	,button: null
	,relatedTarget: null
	,initMouseEvent: function(eventTypeArg,canBubbleArg,cancelableArg,viewArg,detailArg,screenXArg,screenYArg,clientXArg,clientYArg,ctrlKeyArg,altKeyArg,shiftKeyArg,metaKeyArg,buttonArg,relatedTargeArg) {
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
	,__class__: cocktail.core.event.MouseEvent
});
cocktail.core.event.TransitionEvent = $hxClasses["cocktail.core.event.TransitionEvent"] = function() {
	cocktail.core.event.Event.call(this);
};
cocktail.core.event.TransitionEvent.__name__ = ["cocktail","core","event","TransitionEvent"];
cocktail.core.event.TransitionEvent.__super__ = cocktail.core.event.Event;
cocktail.core.event.TransitionEvent.prototype = $extend(cocktail.core.event.Event.prototype,{
	propertyName: null
	,elapsedTime: null
	,pseudoElement: null
	,initTransitionEvent: function(eventTypeArg,canBubbleArg,cancelableArg,propertyNameArg,elapsedTimeArg,pseudoElementArg) {
		if(this.dispatched == true) return;
		this.initEvent(eventTypeArg,canBubbleArg,cancelableArg);
		this.propertyName = propertyNameArg;
		this.elapsedTime = elapsedTimeArg;
		this.pseudoElement = pseudoElementArg;
	}
	,__class__: cocktail.core.event.TransitionEvent
});
cocktail.core.event.WheelEvent = $hxClasses["cocktail.core.event.WheelEvent"] = function() {
	cocktail.core.event.MouseEvent.call(this);
};
cocktail.core.event.WheelEvent.__name__ = ["cocktail","core","event","WheelEvent"];
cocktail.core.event.WheelEvent.__super__ = cocktail.core.event.MouseEvent;
cocktail.core.event.WheelEvent.prototype = $extend(cocktail.core.event.MouseEvent.prototype,{
	deltaX: null
	,deltaY: null
	,deltaZ: null
	,deltaMode: null
	,initWheelEvent: function(eventTypeArg,canBubbleArg,cancelableArg,viewArg,detailArg,screenXArg,screenYArg,clientXArg,clientYArg,buttonArg,relatedTargetArg,modifiersListArg,deltaXArg,deltaYArg,deltaZArg,deltaModeArg) {
		if(this.dispatched == true) return;
		this.initMouseEvent(eventTypeArg,canBubbleArg,cancelableArg,viewArg,detailArg,screenXArg,screenYArg,clientXArg,clientYArg,false,false,false,false,buttonArg,relatedTargetArg);
		this.deltaY = deltaYArg;
		this.deltaX = deltaXArg;
		this.deltaMode = deltaModeArg;
		this.deltaZ = deltaZArg;
	}
	,__class__: cocktail.core.event.WheelEvent
});
if(!cocktail.core.focus) cocktail.core.focus = {}
cocktail.core.focus.FocusManager = $hxClasses["cocktail.core.focus.FocusManager"] = function() {
};
cocktail.core.focus.FocusManager.__name__ = ["cocktail","core","focus","FocusManager"];
cocktail.core.focus.FocusManager.prototype = {
	activeElement: null
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
	,getElementTabListIndex: function(element,tabList) {
		var _g1 = 0, _g = tabList.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(tabList[i] == element) return i;
		}
		return -1;
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
									indexedTabList.insert(j,child);
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
	,setActiveElement: function(newActiveElement,body) {
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
	,__class__: cocktail.core.focus.FocusManager
}
if(!cocktail.core.font) cocktail.core.font = {}
cocktail.core.font.AbstractFontLoader = $hxClasses["cocktail.core.font.AbstractFontLoader"] = function() {
	this._successCallbackArray = new Array();
	this._errorCallbackArray = new Array();
};
cocktail.core.font.AbstractFontLoader.__name__ = ["cocktail","core","font","AbstractFontLoader"];
cocktail.core.font.AbstractFontLoader.prototype = {
	fontData: null
	,_successCallbackArray: null
	,_errorCallbackArray: null
	,load: function(url,name) {
		var extension = url.substr(url.lastIndexOf("."),url.length);
		this.fontData = { url : url, name : name, type : cocktail.core.font.FontType.unknown};
		if(extension == ".ttf") this.fontData.type = cocktail.core.font.FontType.ttf; else if(extension == ".eot") this.fontData.type = cocktail.core.font.FontType.eot; else if(extension == ".otf") this.fontData.type = cocktail.core.font.FontType.otf; else if(extension == ".swf") this.fontData.type = cocktail.core.font.FontType.swf; else this.fontData.type = cocktail.core.font.FontType.unknown;
	}
	,addCallback: function(successCallback,errorCallback) {
		if(successCallback != null) this._successCallbackArray.push(successCallback);
		if(errorCallback != null) this._errorCallbackArray.push(errorCallback);
	}
	,_successCallback: function() {
		var idx;
		var _g1 = 0, _g = this._successCallbackArray.length;
		while(_g1 < _g) {
			var idx1 = _g1++;
			this._successCallbackArray[idx1](this.fontData);
		}
		this.cleanup();
	}
	,_errorCallback: function(errorStr) {
		var idx;
		var _g1 = 0, _g = this._errorCallbackArray.length;
		while(_g1 < _g) {
			var idx1 = _g1++;
			this._errorCallbackArray[idx1](this.fontData,errorStr);
		}
		this.cleanup();
	}
	,cleanup: function() {
		while(this._successCallbackArray.length > 0) this._successCallbackArray.pop();
		while(this._errorCallbackArray.length > 0) this._errorCallbackArray.pop();
	}
	,__class__: cocktail.core.font.AbstractFontLoader
}
cocktail.core.font.AbstractFontManager = $hxClasses["cocktail.core.font.AbstractFontManager"] = function() {
	if(cocktail.core.font.AbstractFontManager._fontLoaderArray == null) cocktail.core.font.AbstractFontManager._fontLoaderArray = new Array();
	if(cocktail.core.font.AbstractFontManager._loadedFonts == null) cocktail.core.font.AbstractFontManager._loadedFonts = new Array();
	if(cocktail.core.font.AbstractFontManager._computedFontMetrics == null) cocktail.core.font.AbstractFontManager._computedFontMetrics = new Hash();
};
cocktail.core.font.AbstractFontManager.__name__ = ["cocktail","core","font","AbstractFontManager"];
cocktail.core.font.AbstractFontManager._loadedFonts = null;
cocktail.core.font.AbstractFontManager._fontLoaderArray = null;
cocktail.core.font.AbstractFontManager._computedFontMetrics = null;
cocktail.core.font.AbstractFontManager.prototype = {
	getEmbeddedFonts: function() {
		return cocktail.core.font.AbstractFontManager._loadedFonts;
	}
	,getSystemFonts: function() {
		throw "Virtual method should be implemented in sub class";
		return null;
	}
	,hasFont: function(fontName) {
		var fontDataArray;
		var idx;
		fontDataArray = this.getEmbeddedFonts();
		var _g1 = 0, _g = fontDataArray.length;
		while(_g1 < _g) {
			var idx1 = _g1++;
			if(fontDataArray[idx1].name == fontName) return true;
		}
		fontDataArray = this.getSystemFonts();
		var _g1 = 0, _g = fontDataArray.length;
		while(_g1 < _g) {
			var idx1 = _g1++;
			if(fontDataArray[idx1].name == fontName) return true;
		}
		return false;
	}
	,getFontMetrics: function(fontFamily,fontSize) {
		var fontMetrics;
		if(cocktail.core.font.AbstractFontManager._computedFontMetrics.exists(fontFamily) == true) {
			var fontSizeHash = cocktail.core.font.AbstractFontManager._computedFontMetrics.get(fontFamily);
			if(fontSizeHash.exists(Std.string(fontSize)) == true) fontMetrics = fontSizeHash.get(Std.string(fontSize)); else {
				fontMetrics = this.doGetFontMetrics(fontFamily,fontSize);
				fontSizeHash.set(Std.string(fontSize),fontMetrics);
				cocktail.core.font.AbstractFontManager._computedFontMetrics.set(fontFamily,fontSizeHash);
			}
		} else {
			fontMetrics = this.doGetFontMetrics(fontFamily,fontSize);
			var fontSizeHash = new Hash();
			fontSizeHash.set(Std.string(fontSize),fontMetrics);
			cocktail.core.font.AbstractFontManager._computedFontMetrics.set(fontFamily,fontSizeHash);
		}
		return fontMetrics;
	}
	,createNativeTextElement: function(text,computedStyle) {
		throw "Virtual method should be implemented in sub class";
		return null;
	}
	,doGetFontMetrics: function(fontFamily,fontSize) {
		throw "Virtual method should be implemented in sub class";
		return null;
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
	,capitalizeText: function(text) {
		var capitalizedText = "";
		var _g1 = 0, _g = text.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(i == 0) capitalizedText += text.charAt(i).toUpperCase(); else capitalizedText += text.charAt(i);
		}
		return capitalizedText;
	}
	,loadFont: function(url,name,successCallback,errorCallback) {
		var fontLoader;
		var idx;
		var _g1 = 0, _g = cocktail.core.font.AbstractFontManager._fontLoaderArray.length;
		while(_g1 < _g) {
			var idx1 = _g1++;
			if(cocktail.core.font.AbstractFontManager._fontLoaderArray[idx1].fontData.url == url && cocktail.core.font.AbstractFontManager._fontLoaderArray[idx1].fontData.name == name) {
				cocktail.core.font.AbstractFontManager._fontLoaderArray[idx1].addCallback(successCallback,errorCallback);
				return;
			}
		}
		fontLoader = new cocktail.port.server.FontLoader();
		fontLoader.addCallback(this._onFontLoadingSuccess.$bind(this),this._onFontLoadingError.$bind(this));
		fontLoader.addCallback(successCallback,errorCallback);
		fontLoader.load(url,name);
		cocktail.core.font.AbstractFontManager._fontLoaderArray.push(fontLoader);
	}
	,_onFontLoadingSuccess: function(fontData) {
		cocktail.core.font.AbstractFontManager._loadedFonts.push(fontData);
		if(this._removeFontLoader(fontData) == false) haxe.Log.trace("could not remove font loader from the list after the font was successfully loaded",{ fileName : "AbstractFontManager.hx", lineNumber : 266, className : "cocktail.core.font.AbstractFontManager", methodName : "_onFontLoadingSuccess"});
	}
	,_onFontLoadingError: function(fontData,errorStr) {
		haxe.Log.trace("font loading has failed",{ fileName : "AbstractFontManager.hx", lineNumber : 275, className : "cocktail.core.font.AbstractFontManager", methodName : "_onFontLoadingError"});
		if(this._removeFontLoader(fontData) == false) haxe.Log.trace("could not remove font loader from the list after the font loading has failed",{ fileName : "AbstractFontManager.hx", lineNumber : 281, className : "cocktail.core.font.AbstractFontManager", methodName : "_onFontLoadingError"});
	}
	,_removeFontLoader: function(fontData) {
		var fontLoader;
		var idx;
		var _g1 = 0, _g = cocktail.core.font.AbstractFontManager._fontLoaderArray.length;
		while(_g1 < _g) {
			var idx1 = _g1++;
			if(cocktail.core.font.AbstractFontManager._fontLoaderArray[idx1].fontData.url == fontData.url && cocktail.core.font.AbstractFontManager._fontLoaderArray[idx1].fontData.name == fontData.name) {
				cocktail.core.font.AbstractFontManager._fontLoaderArray.remove(cocktail.core.font.AbstractFontManager._fontLoaderArray[idx1]);
				return true;
			}
		}
		return false;
	}
	,__class__: cocktail.core.font.AbstractFontManager
}
cocktail.core.font.FontType = $hxClasses["cocktail.core.font.FontType"] = { __ename__ : ["cocktail","core","font","FontType"], __constructs__ : ["ttf","otf","eot","swf","system","unknown"] }
cocktail.core.font.FontType.ttf = ["ttf",0];
cocktail.core.font.FontType.ttf.toString = $estr;
cocktail.core.font.FontType.ttf.__enum__ = cocktail.core.font.FontType;
cocktail.core.font.FontType.otf = ["otf",1];
cocktail.core.font.FontType.otf.toString = $estr;
cocktail.core.font.FontType.otf.__enum__ = cocktail.core.font.FontType;
cocktail.core.font.FontType.eot = ["eot",2];
cocktail.core.font.FontType.eot.toString = $estr;
cocktail.core.font.FontType.eot.__enum__ = cocktail.core.font.FontType;
cocktail.core.font.FontType.swf = ["swf",3];
cocktail.core.font.FontType.swf.toString = $estr;
cocktail.core.font.FontType.swf.__enum__ = cocktail.core.font.FontType;
cocktail.core.font.FontType.system = ["system",4];
cocktail.core.font.FontType.system.toString = $estr;
cocktail.core.font.FontType.system.__enum__ = cocktail.core.font.FontType;
cocktail.core.font.FontType.unknown = ["unknown",5];
cocktail.core.font.FontType.unknown.toString = $estr;
cocktail.core.font.FontType.unknown.__enum__ = cocktail.core.font.FontType;
if(!cocktail.core.geom) cocktail.core.geom = {}
cocktail.core.geom.CubicBezier = $hxClasses["cocktail.core.geom.CubicBezier"] = function(x1,y1,x2,y2) {
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
cocktail.core.geom.CubicBezier.__name__ = ["cocktail","core","geom","CubicBezier"];
cocktail.core.geom.CubicBezier.prototype = {
	_x1: null
	,_y1: null
	,_x2: null
	,_y2: null
	,_cx: null
	,_bx: null
	,_ax: null
	,_cy: null
	,_by: null
	,_ay: null
	,bezierX: function(t) {
		return t * (this._cx + t * (this._bx + t * this._ax));
	}
	,bezierY: function(t) {
		return t * (this._cy + t * (this._by + t * this._ay));
	}
	,__class__: cocktail.core.geom.CubicBezier
}
cocktail.core.geom.Matrix = $hxClasses["cocktail.core.geom.Matrix"] = function(data) {
	this.set_data(data);
};
cocktail.core.geom.Matrix.__name__ = ["cocktail","core","geom","Matrix"];
cocktail.core.geom.Matrix.prototype = {
	data: null
	,identity: function() {
		this.set_data({ a : 1.0, b : 0.0, c : 0.0, d : 1.0, e : 0.0, f : 0.0});
	}
	,set_data: function(data) {
		this.data = data;
		if(data == null) this.identity();
		return data;
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
	,translate: function(x,y) {
		var translationMatrixData = { a : 1.0, b : 0.0, c : 0.0, d : 1.0, e : x, f : y};
		var translationMatrix = new cocktail.core.geom.Matrix(translationMatrixData);
		this.concatenate(translationMatrix);
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
	,scale: function(scaleX,scaleY) {
		var scaledMatrix = new cocktail.core.geom.Matrix();
		var scalingMatrixData = { a : scaleX, b : 0.0, c : 0.0, d : scaleY, e : 0.0, f : 0.0};
		var scalingMatrix = new cocktail.core.geom.Matrix(scalingMatrixData);
		scaledMatrix.concatenate(scalingMatrix);
		this.concatenate(scaledMatrix);
	}
	,skew: function(skewX,skewY) {
		var skewedMatrix = new cocktail.core.geom.Matrix();
		var skewingMatrixData = { a : 1.0, b : Math.tan(skewY), c : Math.tan(skewX), d : 1.0, e : 0.0, f : 0.0};
		var skewingMatrix = new cocktail.core.geom.Matrix(skewingMatrixData);
		skewedMatrix.concatenate(skewingMatrix);
		this.concatenate(skewedMatrix);
	}
	,__class__: cocktail.core.geom.Matrix
	,__properties__: {set_data:"set_data"}
}
cocktail.core.html.EmbeddedElement = $hxClasses["cocktail.core.html.EmbeddedElement"] = function(tagName) {
	cocktail.core.html.HTMLElement.call(this,tagName);
};
cocktail.core.html.EmbeddedElement.__name__ = ["cocktail","core","html","EmbeddedElement"];
cocktail.core.html.EmbeddedElement.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.html.EmbeddedElement.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	height: null
	,width: null
	,intrinsicHeight: null
	,intrinsicWidth: null
	,intrinsicRatio: null
	,embeddedAsset: null
	,init: function() {
		this.initEmbeddedAsset();
		cocktail.core.html.HTMLElement.prototype.init.call(this);
	}
	,initEmbeddedAsset: function() {
	}
	,setAttribute: function(name,value) {
		if(name == "height") this.set_height(Std.parseInt(value)); else if(name == "width") this.set_width(Std.parseInt(value)); else cocktail.core.html.HTMLElement.prototype.setAttribute.call(this,name,value);
	}
	,getAttribute: function(name) {
		if(name == "height") return Std.string(this.get_height()); else if(name == "width") return Std.string(this.get_width()); else return cocktail.core.html.HTMLElement.prototype.getAttribute.call(this,name);
	}
	,get_intrinsicHeight: function() {
		return this.intrinsicHeight;
	}
	,get_intrinsicWidth: function() {
		return this.intrinsicWidth;
	}
	,get_intrinsicRatio: function() {
		return this.intrinsicRatio;
	}
	,set_width: function(value) {
		cocktail.core.html.HTMLElement.prototype.setAttribute.call(this,"width",Std.string(value));
		return value;
	}
	,get_width: function() {
		var width = cocktail.core.html.HTMLElement.prototype.getAttribute.call(this,"width");
		if(width == "") return 0; else return Std.parseInt(width);
	}
	,set_height: function(value) {
		cocktail.core.html.HTMLElement.prototype.setAttribute.call(this,"height",Std.string(value));
		return value;
	}
	,get_height: function() {
		var height = cocktail.core.html.HTMLElement.prototype.getAttribute.call(this,"height");
		if(height == null) return 0; else return Std.parseInt(height);
	}
	,__class__: cocktail.core.html.EmbeddedElement
	,__properties__: $extend(cocktail.core.html.HTMLElement.prototype.__properties__,{get_intrinsicRatio:"get_intrinsicRatio",get_intrinsicWidth:"get_intrinsicWidth",get_intrinsicHeight:"get_intrinsicHeight",set_width:"set_width",get_width:"get_width",set_height:"set_height",get_height:"get_height"})
});
cocktail.core.html.HTMLAnchorElement = $hxClasses["cocktail.core.html.HTMLAnchorElement"] = function() {
	cocktail.core.html.HTMLElement.call(this,"A");
};
cocktail.core.html.HTMLAnchorElement.__name__ = ["cocktail","core","html","HTMLAnchorElement"];
cocktail.core.html.HTMLAnchorElement.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.html.HTMLAnchorElement.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	href: null
	,target: null
	,hasActivationBehaviour: function() {
		return true;
	}
	,runPostClickActivationStep: function(event) {
		if(event.defaultPrevented == true) return;
		this.openDocument();
	}
	,getAttribute: function(name) {
		if(name == "target") return this.get_target(); else return cocktail.core.html.HTMLElement.prototype.getAttribute.call(this,name);
	}
	,isDefaultFocusable: function() {
		if(this.get_href() != null) return true; else return false;
	}
	,openDocument: function() {
		if(this.get_href() != null) cocktail.Lib.get_window().open(this.get_href(),this.get_target());
	}
	,set_href: function(value) {
		this.setAttribute("href",value);
		return value;
	}
	,get_href: function() {
		return this.getAttribute("href");
	}
	,set_target: function(value) {
		this.setAttribute("target",value);
		return value;
	}
	,get_target: function() {
		var target = cocktail.core.html.HTMLElement.prototype.getAttribute.call(this,"target");
		if(target == null) return "_self";
		return target;
	}
	,__class__: cocktail.core.html.HTMLAnchorElement
	,__properties__: $extend(cocktail.core.html.HTMLElement.prototype.__properties__,{set_target:"set_target",get_target:"get_target",set_href:"set_href",get_href:"get_href"})
});
cocktail.core.html.HTMLBodyElement = $hxClasses["cocktail.core.html.HTMLBodyElement"] = function() {
	cocktail.core.html.HTMLElement.call(this,"BODY");
};
cocktail.core.html.HTMLBodyElement.__name__ = ["cocktail","core","html","HTMLBodyElement"];
cocktail.core.html.HTMLBodyElement.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.html.HTMLBodyElement.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.BodyBoxRenderer(this);
		this.elementRenderer.set_coreStyle(this.coreStyle);
	}
	,__class__: cocktail.core.html.HTMLBodyElement
});
cocktail.core.html.HTMLConstants = $hxClasses["cocktail.core.html.HTMLConstants"] = function() {
};
cocktail.core.html.HTMLConstants.__name__ = ["cocktail","core","html","HTMLConstants"];
cocktail.core.html.HTMLConstants.prototype = {
	__class__: cocktail.core.html.HTMLConstants
}
cocktail.core.html.HTMLDocument = $hxClasses["cocktail.core.html.HTMLDocument"] = function() {
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
cocktail.core.html.HTMLDocument.__name__ = ["cocktail","core","html","HTMLDocument"];
cocktail.core.html.HTMLDocument.__super__ = cocktail.core.dom.Document;
cocktail.core.html.HTMLDocument.prototype = $extend(cocktail.core.dom.Document.prototype,{
	body: null
	,activeElement: null
	,_focusManager: null
	,_hoveredElementRenderer: null
	,fullscreenEnabled: null
	,fullscreenElement: null
	,onEnterFullscreen: null
	,onExitFullscreen: null
	,onSetMouseCursor: null
	,_shouldDispatchClickOnNextMouseUp: null
	,_invalidationScheduled: null
	,_documentNeedsLayout: null
	,_documentNeedsRendering: null
	,initBody: function(htmlBodyElement) {
		this.body = htmlBodyElement;
		this.documentElement.appendChild(this.body);
		this._hoveredElementRenderer = this.body.elementRenderer;
		this.set_activeElement(this.body);
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
		default:
			element = new cocktail.core.html.HTMLElement(tagName);
		}
		element.ownerDocument = this;
		return element;
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
	,onPlatformKeyUpEvent: function(keyboardEvent) {
		this.get_activeElement().dispatchEvent(keyboardEvent);
	}
	,onPlatformResizeEvent: function(event) {
		this.documentElement.invalidate(cocktail.core.renderer.InvalidationReason.windowResize);
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
	,setMouseCursor: function(cursor) {
		if(this.onSetMouseCursor != null) this.onSetMouseCursor(cursor);
	}
	,exitFullscreen: function() {
		if(this.fullscreenElement == null) return;
		this.set_fullscreenElement(null);
		if(this.onExitFullscreen != null) this.onExitFullscreen();
		var fullscreenEvent = new cocktail.core.event.Event();
		fullscreenEvent.initEvent("fullscreenchange",true,false);
	}
	,get_fullscreenEnabled: function() {
		return true;
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
	,invalidateLayout: function(immediate) {
		this._documentNeedsLayout = true;
		this.invalidate(immediate);
	}
	,invalidateRendering: function() {
		this._documentNeedsRendering = true;
		this.invalidate(false);
	}
	,invalidateLayoutAndRendering: function() {
		this._documentNeedsLayout = true;
		this._documentNeedsRendering = true;
		this.invalidate(false);
	}
	,invalidate: function(immediate) {
		if(immediate == null) immediate = false;
		if(this._invalidationScheduled == false || immediate == true) this.doInvalidate(immediate);
	}
	,doInvalidate: function(immediate) {
		if(immediate == null) immediate = false;
		if(immediate == false) {
			this._invalidationScheduled = true;
			this.scheduleLayoutAndRender();
		} else {
			if(this._documentNeedsLayout == true) this.startLayout();
			this._documentNeedsLayout = false;
		}
	}
	,layoutAndRender: function() {
		if(this._documentNeedsLayout == true) this.startLayout();
		this._documentNeedsLayout = false;
		if(this._documentNeedsRendering == true) this.startRendering();
		this._documentNeedsRendering = false;
	}
	,onLayoutSchedule: function() {
		this.layoutAndRender();
		this._invalidationScheduled = false;
	}
	,startRendering: function() {
	}
	,startLayout: function() {
		this.documentElement.elementRenderer.layout(false);
		this.documentElement.elementRenderer.setGlobalOrigins(0,0,0,0);
	}
	,scheduleLayoutAndRender: function() {
		var onLayoutScheduleDelegate = this.onLayoutSchedule.$bind(this);
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
	,getFirstVerticallyScrollableHTMLElement: function(htmlElement,scrollOffset) {
		while(htmlElement.isVerticallyScrollable(scrollOffset) == false) {
			htmlElement = htmlElement.parentNode;
			if(htmlElement == null) return null;
		}
		return htmlElement;
	}
	,set_activeElement: function(newActiveElement) {
		this._focusManager.setActiveElement(newActiveElement,this.body);
		return this.get_activeElement();
	}
	,get_activeElement: function() {
		return this._focusManager.activeElement;
	}
	,__class__: cocktail.core.html.HTMLDocument
	,__properties__: $extend(cocktail.core.dom.Document.prototype.__properties__,{set_fullscreenElement:"set_fullscreenElement",get_fullscreenEnabled:"get_fullscreenEnabled",set_activeElement:"set_activeElement",get_activeElement:"get_activeElement"})
});
cocktail.core.html.HTMLHtmlElement = $hxClasses["cocktail.core.html.HTMLHtmlElement"] = function() {
	cocktail.core.html.HTMLElement.call(this,"HTML");
	this.attach();
};
cocktail.core.html.HTMLHtmlElement.__name__ = ["cocktail","core","html","HTMLHtmlElement"];
cocktail.core.html.HTMLHtmlElement.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.html.HTMLHtmlElement.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	isParentRendered: function() {
		return true;
	}
	,createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.InitialBlockRenderer(this);
		this.elementRenderer.set_coreStyle(this.coreStyle);
	}
	,attachToParentElementRenderer: function() {
	}
	,detachFromParentElementRenderer: function() {
	}
	,get_offsetParent: function() {
		return null;
	}
	,set_innerHTML: function(value) {
		cocktail.core.html.HTMLElement.prototype.set_innerHTML.call(this,value);
		var htmlDocument = this.ownerDocument;
		htmlDocument.initBody(this.getElementsByTagName("BODY")[0]);
		return value;
	}
	,__class__: cocktail.core.html.HTMLHtmlElement
});
cocktail.core.html.HTMLImageElement = $hxClasses["cocktail.core.html.HTMLImageElement"] = function() {
	cocktail.core.html.EmbeddedElement.call(this,"IMG");
};
cocktail.core.html.HTMLImageElement.__name__ = ["cocktail","core","html","HTMLImageElement"];
cocktail.core.html.HTMLImageElement.__super__ = cocktail.core.html.EmbeddedElement;
cocktail.core.html.HTMLImageElement.prototype = $extend(cocktail.core.html.EmbeddedElement.prototype,{
	src: null
	,naturalWidth: null
	,naturalHeight: null
	,_resourceLoadedCallback: null
	,_resourceLoadError: null
	,setAttribute: function(name,value) {
		if(name == "src") this.set_src(value); else cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,name,value);
	}
	,createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.ImageRenderer(this);
		this.elementRenderer.set_coreStyle(this.coreStyle);
	}
	,isVoidElement: function() {
		return true;
	}
	,set_src: function(value) {
		cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,"src",value);
		var resource = cocktail.core.resource.ResourceManager.getResource(value);
		if(resource.loaded == false) {
			this._resourceLoadedCallback = this.onResourceLoaded.$bind(this);
			this._resourceLoadError = this.onResourceLoadError.$bind(this);
			resource.addEventListener("load",this._resourceLoadedCallback);
			resource.addEventListener("error",this._resourceLoadError);
		} else if(resource.loadedWithError == true) this.onLoadError(); else this.onLoadComplete(resource);
		return value;
	}
	,onResourceLoaded: function(e) {
		this.removeListeners(e.target);
		this.onLoadComplete(e.target);
	}
	,onResourceLoadError: function(e) {
		this.removeListeners(e.target);
		this.onLoadError();
	}
	,removeListeners: function(resource) {
		resource.removeEventListener("load",this._resourceLoadedCallback);
		resource.removeEventListener("error",this._resourceLoadError);
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
	,onLoadError: function() {
		var errorEvent = new cocktail.core.event.UIEvent();
		errorEvent.initUIEvent("error",false,false,null,0.0);
		this.dispatchEvent(errorEvent);
	}
	,get_src: function() {
		return this.getAttribute("src");
	}
	,get_naturalHeight: function() {
		if(this.get_intrinsicHeight() == null) return 0;
		return this.get_intrinsicHeight();
	}
	,get_naturalWidth: function() {
		if(this.get_intrinsicWidth() == null) return 0;
		return this.get_intrinsicWidth();
	}
	,__class__: cocktail.core.html.HTMLImageElement
	,__properties__: $extend(cocktail.core.html.EmbeddedElement.prototype.__properties__,{get_naturalHeight:"get_naturalHeight",get_naturalWidth:"get_naturalWidth",set_src:"set_src",get_src:"get_src"})
});
cocktail.core.html.HTMLInputElement = $hxClasses["cocktail.core.html.HTMLInputElement"] = function() {
	cocktail.core.html.EmbeddedElement.call(this,"INPUT");
};
cocktail.core.html.HTMLInputElement.__name__ = ["cocktail","core","html","HTMLInputElement"];
cocktail.core.html.HTMLInputElement.__super__ = cocktail.core.html.EmbeddedElement;
cocktail.core.html.HTMLInputElement.prototype = $extend(cocktail.core.html.EmbeddedElement.prototype,{
	value: null
	,isVoidElement: function() {
		return true;
	}
	,createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.TextInputRenderer(this);
		this.elementRenderer.set_coreStyle(this.coreStyle);
		var textInputElementRenderer = this.elementRenderer;
		var value = this.getAttribute("value");
		if(value != null) textInputElementRenderer.set_value(value);
	}
	,isDefaultFocusable: function() {
		return true;
	}
	,get_intrinsicWidth: function() {
		return 150;
	}
	,get_intrinsicRatio: function() {
		return 0.15;
	}
	,set_value: function(value) {
		this.setAttribute("value",value);
		if(this.elementRenderer != null) {
			var textInputElementRenderer = this.elementRenderer;
			textInputElementRenderer.set_value(value);
		}
		return value;
	}
	,get_value: function() {
		if(this.elementRenderer != null) {
			var textInputElementRenderer = this.elementRenderer;
			return textInputElementRenderer.get_value();
		}
		return this.getAttribute("value");
	}
	,__class__: cocktail.core.html.HTMLInputElement
	,__properties__: $extend(cocktail.core.html.EmbeddedElement.prototype.__properties__,{set_value:"set_value",get_value:"get_value"})
});
cocktail.core.html.HTMLMediaElement = $hxClasses["cocktail.core.html.HTMLMediaElement"] = function(tagName) {
	cocktail.core.html.EmbeddedElement.call(this,tagName);
	this._networkState = 0;
	this._ended = false;
	this._duration = 0;
	this._paused = true;
	this._seeking = false;
	this._readyState = 0;
	this._autoplaying = true;
	this._muted = false;
	this._volume = 1.0;
	this._loadedDataWasDispatched = false;
	this._defaultPlaybackStartPosition = 0;
	this._officialPlaybackPosition = 0;
	this._currentPlaybackPosition = 0;
	this._initialPlaybackPosition = 0;
	this._earliestPossiblePosition = 0;
};
cocktail.core.html.HTMLMediaElement.__name__ = ["cocktail","core","html","HTMLMediaElement"];
cocktail.core.html.HTMLMediaElement.__super__ = cocktail.core.html.EmbeddedElement;
cocktail.core.html.HTMLMediaElement.prototype = $extend(cocktail.core.html.EmbeddedElement.prototype,{
	src: null
	,autoplay: null
	,loop: null
	,_networkState: null
	,networkState: null
	,_readyState: null
	,readyState: null
	,_seeking: null
	,seeking: null
	,currentTime: null
	,_currentSrc: null
	,currentSrc: null
	,_duration: null
	,duration: null
	,buffered: null
	,_paused: null
	,paused: null
	,_ended: null
	,ended: null
	,_muted: null
	,muted: null
	,_volume: null
	,volume: null
	,_nativeMedia: null
	,_initialPlaybackPosition: null
	,_officialPlaybackPosition: null
	,_currentPlaybackPosition: null
	,_defaultPlaybackStartPosition: null
	,_earliestPossiblePosition: null
	,_loadedDataWasDispatched: null
	,_autoplaying: null
	,init: function() {
		this.initNativeMedia();
		cocktail.core.html.EmbeddedElement.prototype.init.call(this);
	}
	,initNativeMedia: function() {
	}
	,appendChild: function(newChild) {
		cocktail.core.html.EmbeddedElement.prototype.appendChild.call(this,newChild);
		if(this.get_src() == null && this._networkState == 0) {
			if(newChild.get_nodeName() == "SOURCE") this.selectResource();
		}
		return newChild;
	}
	,setAttribute: function(name,value) {
		if(name == "src") this.set_src(value); else cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,name,value);
	}
	,detachFromParentElementRenderer: function() {
		cocktail.core.html.EmbeddedElement.prototype.detachFromParentElementRenderer.call(this);
		if(this._networkState != 0) this.pause();
	}
	,play: function() {
		if(this._networkState == 0) this.selectResource();
		if(this._ended == true) this.seek(0);
		if(this._paused == true) {
			this._paused = false;
			this.fireEvent("play",false,false);
			switch(this._readyState) {
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
	,pause: function() {
		if(this._networkState == 0) this.selectResource();
		this._autoplaying = false;
		if(this._paused == false) {
			this._paused = true;
			this.fireEvent("timeupdate",false,false);
			this.fireEvent("pause",false,false);
			this._officialPlaybackPosition = this._currentPlaybackPosition;
		}
		this._nativeMedia.pause();
	}
	,canPlayType: function(type) {
		return this._nativeMedia.canPlayType(type);
	}
	,loadResource: function() {
		switch(this._networkState) {
		case 2:case 1:
			this.fireEvent("abort",false,false);
			break;
		}
		if(this._networkState != 0) {
			this.fireEvent("emptied",false,false);
			this._nativeMedia.set_src(null);
			this._networkState = 0;
			this._readyState = 0;
			this._paused = true;
			this._seeking = false;
			this._currentPlaybackPosition = 0;
			if(this._officialPlaybackPosition > 0) {
				this._officialPlaybackPosition = 0;
				this.fireEvent("timeupdate",false,false);
			} else this._officialPlaybackPosition = 0;
			this._initialPlaybackPosition = 0;
			this._duration = Math.NaN;
		}
		this._loadedDataWasDispatched = false;
		this.selectResource();
	}
	,selectResource: function() {
		this._networkState = 3;
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
			this._networkState = 0;
			return;
		}
		this._networkState = 2;
		this.fireEvent("loadstart",false,false);
		if(mode == 0) {
			if(this.get_src() == "") {
				this._networkState = 3;
				this.fireEvent("error",false,false);
				return;
			}
			this._currentSrc = this.get_src();
			this.fetchResource(this._currentSrc);
		} else if(mode == 1) {
			var _g1 = 0, _g = this.childNodes.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(this.childNodes[i].get_nodeName() == "SOURCE") {
					var sourceChild = this.childNodes[i];
					if(sourceChild.get_type() != null) {
						if(this.canPlayType(sourceChild.get_type()) == "probably") {
							this._currentSrc = sourceChild.get_src();
							this.fetchResource(this._currentSrc);
							return;
						}
					} else if(sourceChild.get_src() != null) {
						if(this.canPlayType(sourceChild.get_src()) == "probably") {
							this._currentSrc = sourceChild.get_src();
							this.fetchResource(this._currentSrc);
							return;
						}
					}
				}
			}
			this._networkState = 0;
		}
	}
	,fetchResource: function(url) {
		this._nativeMedia.onLoadedMetaData = this.onLoadedMetaData.$bind(this);
		this._nativeMedia.set_src(url);
	}
	,seek: function(newPlaybackPosition) {
		if(this._readyState == 0) return;
		if(this._seeking == true) {
		}
		this._seeking = true;
		if(newPlaybackPosition > this._duration) newPlaybackPosition = this._duration;
		if(newPlaybackPosition < this._earliestPossiblePosition) newPlaybackPosition = 0;
		this.fireEvent("seeking",false,false);
		this._currentPlaybackPosition = newPlaybackPosition;
		this._nativeMedia.seek(newPlaybackPosition);
		this.fireEvent("timeupdate",false,false);
		this.fireEvent("seeked",false,false);
	}
	,setReadyState: function(newReadyState) {
		if(this._readyState == 0 && newReadyState == 1) this.fireEvent("loadedmetadata",false,false);
		if(this._readyState == 1 && (newReadyState == 2 || newReadyState == 4 || newReadyState == 3)) {
			if(this._loadedDataWasDispatched == false) {
				this.fireEvent("loadeddata",false,false);
				this._loadedDataWasDispatched = true;
			}
			if(newReadyState == 4 || newReadyState == 3) {
				if(this._readyState >= 3 && newReadyState <= 2) {
					if(this.isPotentiallyPlaying() == true) {
						this.fireEvent("timeupdate",false,false);
						this.fireEvent("waiting",false,false);
					}
				}
				if(this._readyState <= 2 && newReadyState == 3) {
					this.fireEvent("canplay",false,false);
					if(this._paused == false) this.fireEvent("playing",false,false);
				}
				if(newReadyState == 4) {
					if(this._readyState == 2) {
						this.fireEvent("canplay",false,false);
						if(this._paused == false) this.fireEvent("playing",false,false);
					}
					if(this._autoplaying == true) {
						if(this._paused == true) {
							if(this.get_autoplay() == true) {
								this._paused = false;
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
		this._readyState = newReadyState;
	}
	,isPotentiallyPlaying: function() {
		if(this._paused == true) return false;
		if(this._ended == true) return false;
		return true;
	}
	,establishMediaTimeline: function() {
		this._currentPlaybackPosition = 0;
		this._initialPlaybackPosition = 0;
		this._officialPlaybackPosition = 0;
		this._duration = this._nativeMedia.get_duration();
		this.fireEvent("durationchange",false,false);
		this.setReadyState(1);
		var jumped = false;
		if(this._defaultPlaybackStartPosition > 0) {
			this.seek(this._defaultPlaybackStartPosition);
			jumped = true;
		}
		this._defaultPlaybackStartPosition = 0;
	}
	,hasChildSourceElement: function() {
		var _g1 = 0, _g = this.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.childNodes[i].get_nodeName() == "SOURCE") return true;
		}
		return false;
	}
	,onLoadingError: function(error) {
		this.selectResource();
	}
	,onLoadedMetaData: function(e) {
		this.intrinsicHeight = this._nativeMedia.get_height();
		this.intrinsicWidth = this._nativeMedia.get_width();
		this.intrinsicRatio = this.get_intrinsicHeight() / this.get_intrinsicWidth();
		this.establishMediaTimeline();
		this.invalidate(cocktail.core.renderer.InvalidationReason.other);
		this.onProgressTick();
	}
	,onTimeUpdateTick: function() {
		if(this._paused == true) return;
		this._currentPlaybackPosition = this._nativeMedia.get_currentTime();
		this._officialPlaybackPosition = this._currentPlaybackPosition;
		if(this._duration - this._currentPlaybackPosition < 0.2) {
			this._ended = true;
			this._currentPlaybackPosition = this._duration;
			this._officialPlaybackPosition = this._currentPlaybackPosition;
			this.fireEvent("timeupdate",false,false);
			this.fireEvent("ended",false,false);
			return;
		}
		this.fireEvent("timeupdate",false,false);
	}
	,onProgressTick: function() {
		this.fireEvent("progress",false,false);
		if(this._nativeMedia.get_bytesLoaded() >= this._nativeMedia.get_bytesTotal()) {
			this.setReadyState(4);
			this._networkState = 1;
			this.fireEvent("suspend",false,false);
			return;
		}
		if(this._readyState == 1) this.setReadyState(3);
	}
	,get_src: function() {
		return this.getAttribute("src");
	}
	,set_src: function(value) {
		cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,"src",value);
		this.loadResource();
		return value;
	}
	,get_autoplay: function() {
		if(this.getAttribute("autoplay") != null) return true; else return false;
	}
	,set_autoplay: function(value) {
		cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,"autoplay",Std.string(value));
		return value;
	}
	,get_loop: function() {
		if(this.getAttribute("loop") != null) return true; else return false;
	}
	,set_loop: function(value) {
		cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,"loop",Std.string(value));
		return value;
	}
	,get_muted: function() {
		return this._muted;
	}
	,set_muted: function(value) {
		if(value == false) this._nativeMedia.set_volume(this._volume); else this._nativeMedia.set_volume(0);
		this._muted = value;
		this.fireEvent("volumechange",false,false);
		return this._muted;
	}
	,set_volume: function(value) {
		if(this._muted == false) this._nativeMedia.set_volume(value);
		this._volume = value;
		this.fireEvent("volumechange",false,false);
		return this._volume;
	}
	,get_volume: function() {
		return this._volume;
	}
	,get_buffered: function() {
		var ranges = new Array();
		ranges.push({ start : 0.0, end : this._duration * (this._nativeMedia.get_bytesLoaded() / this._nativeMedia.get_bytesTotal())});
		var timeRanges = new cocktail.core.html.TimeRanges(ranges);
		return timeRanges;
	}
	,get_currentSrc: function() {
		return this._currentSrc;
	}
	,get_networkState: function() {
		return this._networkState;
	}
	,get_currentTime: function() {
		if(this._defaultPlaybackStartPosition != 0) return this._defaultPlaybackStartPosition;
		return this._officialPlaybackPosition;
	}
	,set_currentTime: function(value) {
		switch(this._readyState) {
		case 0:
			this._defaultPlaybackStartPosition = value;
			break;
		default:
			this._officialPlaybackPosition = value;
			this.seek(value);
		}
		return value;
	}
	,get_duration: function() {
		return this._duration;
	}
	,get_paused: function() {
		return this._paused;
	}
	,get_ended: function() {
		return this._ended;
	}
	,get_readyState: function() {
		return this._readyState;
	}
	,get_seeking: function() {
		return this._seeking;
	}
	,__class__: cocktail.core.html.HTMLMediaElement
	,__properties__: $extend(cocktail.core.html.EmbeddedElement.prototype.__properties__,{set_volume:"set_volume",get_volume:"get_volume",set_muted:"set_muted",get_muted:"get_muted",get_ended:"get_ended",get_paused:"get_paused",get_buffered:"get_buffered",get_duration:"get_duration",get_currentSrc:"get_currentSrc",set_currentTime:"set_currentTime",get_currentTime:"get_currentTime",get_seeking:"get_seeking",get_readyState:"get_readyState",get_networkState:"get_networkState",set_loop:"set_loop",get_loop:"get_loop",set_autoplay:"set_autoplay",get_autoplay:"get_autoplay",set_src:"set_src",get_src:"get_src"})
});
cocktail.core.html.HTMLObjectElement = $hxClasses["cocktail.core.html.HTMLObjectElement"] = function() {
	this._imageLoader = new cocktail.core.resource.ImageLoader();
	cocktail.core.html.EmbeddedElement.call(this,"OBJECT");
};
cocktail.core.html.HTMLObjectElement.__name__ = ["cocktail","core","html","HTMLObjectElement"];
cocktail.core.html.HTMLObjectElement.__super__ = cocktail.core.html.EmbeddedElement;
cocktail.core.html.HTMLObjectElement.prototype = $extend(cocktail.core.html.EmbeddedElement.prototype,{
	data: null
	,_imageLoader: null
	,initEmbeddedAsset: function() {
		this.embeddedAsset = this._imageLoader.getNativeElement();
	}
	,setAttribute: function(name,value) {
		if(name == "data") this.set_data(value); else cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,name,value);
	}
	,createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.ImageRenderer(this);
		this.elementRenderer.set_coreStyle(this.coreStyle);
	}
	,onLoadComplete: function(image) {
		this.intrinsicHeight = this._imageLoader.getIntrinsicHeight();
		this.intrinsicWidth = this._imageLoader.getIntrinsicWidth();
		this.intrinsicRatio = this.get_intrinsicHeight() / this.get_intrinsicWidth();
		this.invalidate(cocktail.core.renderer.InvalidationReason.other);
		var loadEvent = new cocktail.core.event.UIEvent();
		loadEvent.initUIEvent("load",false,false,null,0.0);
		this.dispatchEvent(loadEvent);
	}
	,onLoadError: function(message) {
		var errorEvent = new cocktail.core.event.UIEvent();
		errorEvent.initUIEvent("error",false,false,null,0.0);
		this.dispatchEvent(errorEvent);
	}
	,set_data: function(value) {
		cocktail.core.html.EmbeddedElement.prototype.setAttribute.call(this,"data",value);
		this._imageLoader.load([value],this.onLoadComplete.$bind(this),this.onLoadError.$bind(this));
		return value;
	}
	,get_data: function() {
		return this.getAttribute("data");
	}
	,__class__: cocktail.core.html.HTMLObjectElement
	,__properties__: $extend(cocktail.core.html.EmbeddedElement.prototype.__properties__,{set_data:"set_data",get_data:"get_data"})
});
cocktail.core.html.HTMLSourceElement = $hxClasses["cocktail.core.html.HTMLSourceElement"] = function() {
	cocktail.core.html.HTMLElement.call(this,"SOURCE");
};
cocktail.core.html.HTMLSourceElement.__name__ = ["cocktail","core","html","HTMLSourceElement"];
cocktail.core.html.HTMLSourceElement.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.html.HTMLSourceElement.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	src: null
	,type: null
	,media: null
	,createElementRenderer: function() {
	}
	,isVoidElement: function() {
		return true;
	}
	,get_src: function() {
		return this.getAttribute("src");
	}
	,set_src: function(value) {
		this.setAttribute("src",value);
		return value;
	}
	,get_type: function() {
		return this.getAttribute("type");
	}
	,set_type: function(value) {
		this.setAttribute("type",value);
		return value;
	}
	,get_media: function() {
		return this.getAttribute("media");
	}
	,set_media: function(value) {
		this.setAttribute("media",value);
		return value;
	}
	,__class__: cocktail.core.html.HTMLSourceElement
	,__properties__: $extend(cocktail.core.html.HTMLElement.prototype.__properties__,{set_media:"set_media",get_media:"get_media",set_type:"set_type",get_type:"get_type",set_src:"set_src",get_src:"get_src"})
});
cocktail.core.html.HTMLVideoElement = $hxClasses["cocktail.core.html.HTMLVideoElement"] = function() {
	cocktail.core.html.HTMLMediaElement.call(this,"VIDEO");
	this.initPosterFrame();
};
cocktail.core.html.HTMLVideoElement.__name__ = ["cocktail","core","html","HTMLVideoElement"];
cocktail.core.html.HTMLVideoElement.__super__ = cocktail.core.html.HTMLMediaElement;
cocktail.core.html.HTMLVideoElement.prototype = $extend(cocktail.core.html.HTMLMediaElement.prototype,{
	poster: null
	,_posterImage: null
	,posterFrameEmbeddedAsset: null
	,_onPosterLoadComplete: null
	,_onPosterLoadError: null
	,videoWidth: null
	,videoHeight: null
	,initNativeMedia: function() {
		this._nativeMedia = new cocktail.port.server.NativeVideo();
	}
	,initEmbeddedAsset: function() {
		this.embeddedAsset = this._nativeMedia.get_nativeElement();
	}
	,initPosterFrame: function() {
		this._posterImage = new cocktail.core.html.HTMLImageElement();
	}
	,setAttribute: function(name,value) {
		if(name == "poster") this.set_poster(value); else cocktail.core.html.HTMLMediaElement.prototype.setAttribute.call(this,name,value);
	}
	,createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.VideoRenderer(this);
		this.elementRenderer.set_coreStyle(this.coreStyle);
	}
	,shouldRenderPosterFrame: function() {
		if(this.get_poster() == null) return false;
		switch(this._readyState) {
		case 0:case 1:
			return true;
		}
		if(this._paused == true && this._currentPlaybackPosition == 0.0) return true;
		return false;
	}
	,onPosterLoadComplete: function(e) {
		this.removeListeners();
		this.invalidate(cocktail.core.renderer.InvalidationReason.other);
	}
	,onPosterLoadError: function(e) {
		this.removeListeners();
	}
	,removeListeners: function() {
		this._posterImage.removeEventListener("load",this._onPosterLoadComplete);
		this._posterImage.removeEventListener("error",this._onPosterLoadError);
	}
	,set_poster: function(value) {
		cocktail.core.html.HTMLMediaElement.prototype.setAttribute.call(this,"poster",value);
		this._onPosterLoadComplete = this.onPosterLoadComplete.$bind(this);
		this._onPosterLoadError = this.onPosterLoadError.$bind(this);
		this._posterImage.addEventListener("load",this._onPosterLoadComplete);
		this._posterImage.addEventListener("error",this._onPosterLoadError);
		this._posterImage.set_src(value);
		return value;
	}
	,get_poster: function() {
		return this.getAttribute("poster");
	}
	,get_videoWidth: function() {
		if(this._nativeMedia.get_width() != null) return Math.round(this._nativeMedia.get_width()); else return 300;
	}
	,get_videoHeight: function() {
		if(this._nativeMedia.get_height() != null) return Math.round(this._nativeMedia.get_height()); else return 150;
	}
	,__class__: cocktail.core.html.HTMLVideoElement
	,__properties__: $extend(cocktail.core.html.HTMLMediaElement.prototype.__properties__,{get_videoHeight:"get_videoHeight",get_videoWidth:"get_videoWidth",set_poster:"set_poster",get_poster:"get_poster"})
});
cocktail.core.html.ScrollBar = $hxClasses["cocktail.core.html.ScrollBar"] = function(isVertical) {
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
	this.addEventListener("mousedown",this.onTrackMouseDown.$bind(this));
	this._scrollThumb.addEventListener("mousedown",this.onThumbMouseDown.$bind(this));
	this._downArrow.addEventListener("mousedown",this.onDownArrowMouseDown.$bind(this));
	this._upArrow.addEventListener("mousedown",this.onUpArrowMouseDown.$bind(this));
};
cocktail.core.html.ScrollBar.__name__ = ["cocktail","core","html","ScrollBar"];
cocktail.core.html.ScrollBar.__super__ = cocktail.core.html.HTMLElement;
cocktail.core.html.ScrollBar.prototype = $extend(cocktail.core.html.HTMLElement.prototype,{
	_isVertical: null
	,_scroll: null
	,scroll: null
	,_maxScroll: null
	,maxScroll: null
	,_scrollThumb: null
	,_upArrow: null
	,_downArrow: null
	,_mouseMoveStart: null
	,_thumbMoveDelegate: null
	,_thumbUpDelegate: null
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
	,initVerticalScrollBar: function() {
		this.style.set_height("100%");
		this.style.set_width(16 + "px");
		this.style.set_right("0");
		this.style.set_top("0");
		this._downArrow.style.set_bottom("0");
		this._scrollThumb.style.set_top(16 + "px");
	}
	,initHorizontalScrollBar: function() {
		this.style.set_width("100%");
		this.style.set_height(16 + "px");
		this.style.set_bottom("0");
		this.style.set_left("0");
		this._downArrow.style.set_right("0");
		this._scrollThumb.style.set_left(16 + "px");
	}
	,createElementRenderer: function() {
		this.elementRenderer = new cocktail.core.renderer.ScrollBarRenderer(this);
		this.elementRenderer.set_coreStyle(this.coreStyle);
	}
	,isParentRendered: function() {
		return true;
	}
	,attachToParentElementRenderer: function() {
	}
	,detachFromParentElementRenderer: function() {
	}
	,executeDefaultActionIfNeeded: function(defaultPrevented,event) {
	}
	,onDownArrowMouseDown: function(event) {
		var _g = this;
		_g.set_scroll(_g.get_scroll() + 10);
		event.stopPropagation();
	}
	,onUpArrowMouseDown: function(event) {
		var _g = this;
		_g.set_scroll(_g.get_scroll() - 10);
		event.stopPropagation();
	}
	,onThumbMouseDown: function(event) {
		if(this._isVertical == true) this._mouseMoveStart = event.screenY; else this._mouseMoveStart = event.screenX;
		event.stopPropagation();
		this._thumbMoveDelegate = this.onThumbMove.$bind(this);
		this._thumbUpDelegate = this.onThumbMouseUp.$bind(this);
		cocktail.Lib.get_document().addEventListener("mousemove",this._thumbMoveDelegate);
		cocktail.Lib.get_document().addEventListener("mouseup",this._thumbUpDelegate);
	}
	,onThumbMouseUp: function(event) {
		cocktail.Lib.get_document().removeEventListener("mousemove",this._thumbMoveDelegate);
		cocktail.Lib.get_document().removeEventListener("mouseup",this._thumbUpDelegate);
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
	,dispatchScrollEvent: function() {
		var scrollEvent = new cocktail.core.event.UIEvent();
		scrollEvent.initUIEvent("scroll",false,false,null,0.0);
		this.dispatchEvent(scrollEvent);
	}
	,get_maxScroll: function() {
		return this._maxScroll;
	}
	,set_maxScroll: function(value) {
		var scrollPercent = this._scroll / this._maxScroll;
		if(this._maxScroll == 0) scrollPercent = 0;
		this._maxScroll = value;
		this.set_scroll(this._maxScroll * scrollPercent);
		this.updateThumbSize();
		return value;
	}
	,get_scroll: function() {
		return this._scroll;
	}
	,set_scroll: function(value) {
		this._scroll = value;
		this.updateScroll();
		return value;
	}
	,__class__: cocktail.core.html.ScrollBar
	,__properties__: $extend(cocktail.core.html.HTMLElement.prototype.__properties__,{set_maxScroll:"set_maxScroll",get_maxScroll:"get_maxScroll",set_scroll:"set_scroll",get_scroll:"get_scroll"})
});
cocktail.core.html.TimeRanges = $hxClasses["cocktail.core.html.TimeRanges"] = function(ranges) {
	this._ranges = ranges;
};
cocktail.core.html.TimeRanges.__name__ = ["cocktail","core","html","TimeRanges"];
cocktail.core.html.TimeRanges.prototype = {
	length: null
	,_ranges: null
	,start: function(index) {
		return this._ranges[index].start;
	}
	,end: function(index) {
		return this._ranges[index].end;
	}
	,get_length: function() {
		return this._ranges.length;
	}
	,__class__: cocktail.core.html.TimeRanges
	,__properties__: {get_length:"get_length"}
}
if(!cocktail.core.renderer) cocktail.core.renderer = {}
cocktail.core.renderer.ElementRenderer = $hxClasses["cocktail.core.renderer.ElementRenderer"] = function(node) {
	cocktail.core.dom.NodeBase.call(this);
	this.node = node;
	this._hasOwnLayer = false;
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
cocktail.core.renderer.ElementRenderer.__name__ = ["cocktail","core","renderer","ElementRenderer"];
cocktail.core.renderer.ElementRenderer.__super__ = cocktail.core.dom.NodeBase;
cocktail.core.renderer.ElementRenderer.prototype = $extend(cocktail.core.dom.NodeBase.prototype,{
	bounds: null
	,globalBounds: null
	,scrollableBounds: null
	,globalContainingBlockOrigin: null
	,positionedOrigin: null
	,globalPositionnedAncestorOrigin: null
	,node: null
	,_coreStyle: null
	,coreStyle: null
	,layerRenderer: null
	,lineBoxes: null
	,_hasOwnLayer: null
	,computedStyle: null
	,scrollLeft: null
	,scrollTop: null
	,scrollWidth: null
	,scrollHeight: null
	,_needsLayout: null
	,_childrenNeedLayout: null
	,_positionedChildrenNeedLayout: null
	,_needsRendering: null
	,_childrenNeedRendering: null
	,_needsVisualEffectsRendering: null
	,_containingBlock: null
	,dispose: function() {
	}
	,appendChild: function(newChild) {
		cocktail.core.dom.NodeBase.prototype.appendChild.call(this,newChild);
		var elementRendererChild = newChild;
		elementRendererChild.attach();
		this.invalidate(cocktail.core.renderer.InvalidationReason.other);
		return newChild;
	}
	,removeChild: function(oldChild) {
		var elementRendererChild = oldChild;
		elementRendererChild.detach();
		cocktail.core.dom.NodeBase.prototype.removeChild.call(this,oldChild);
		this.invalidate(cocktail.core.renderer.InvalidationReason.other);
		return oldChild;
	}
	,render: function(parentGraphicContext,forceRendering) {
	}
	,layout: function(forceLayout) {
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
	,attachLayer: function() {
		if(this.layerRenderer == null) {
			if(this.parentNode != null) {
				var parent = this.parentNode;
				if(parent.layerRenderer != null) this.createLayer(parent.layerRenderer);
			}
		}
	}
	,detachLayer: function() {
		if(this._hasOwnLayer == true) {
			var parent = this.parentNode;
			parent.layerRenderer.removeChild(this.layerRenderer);
			this._hasOwnLayer = false;
		} else if(this.isAutoZIndexPositioned() == true) {
			if(this.layerRenderer != null) this.layerRenderer.removeAutoZIndexChildElementRenderer(this);
		}
		this.layerRenderer = null;
	}
	,attachContaininingBlock: function() {
		if(this.isPositioned() == true) this._containingBlock.addPositionedChildren(this);
	}
	,detachContainingBlock: function() {
		this._containingBlock.removePositionedChild(this);
	}
	,isVerticallyScrollable: function(scrollOffset) {
		return false;
	}
	,isHorizontallyScrollable: function(scrollOffset) {
		return false;
	}
	,establishesNewFormattingContext: function() {
		return false;
	}
	,isScrollBar: function() {
		return false;
	}
	,isFloat: function() {
		return false;
	}
	,isPositioned: function() {
		return false;
	}
	,isInlineLevel: function() {
		return false;
	}
	,isReplaced: function() {
		return false;
	}
	,isText: function() {
		return false;
	}
	,isRelativePositioned: function() {
		return false;
	}
	,isBlockContainer: function() {
		return false;
	}
	,childrenInline: function() {
		return false;
	}
	,isAnonymousBlockBox: function() {
		return false;
	}
	,establishesNewStackingContext: function() {
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
	,rendersAsIfEstablishingStackingContext: function() {
		return false;
	}
	,isAutoZIndexPositioned: function() {
		return false;
	}
	,createLayer: function(parentLayer) {
		if(this.establishesNewStackingContext() == true) {
			this.layerRenderer = new cocktail.core.renderer.LayerRenderer(this);
			parentLayer.appendChild(this.layerRenderer);
			this._hasOwnLayer = true;
		} else {
			this.layerRenderer = parentLayer;
			if(this.isAutoZIndexPositioned() == true) this.layerRenderer.insertAutoZIndexChildElementRenderer(this);
		}
	}
	,getContainingBlock: function() {
		if(this.isPositioned() == true && this.isRelativePositioned() == false) {
			if(this.getComputedStyle().position == cocktail.core.style.Position.fixed) return this.getInitialContainingBlock(); else return this.getFirstPositionedAncestor();
		} else return this.getFirstBlockContainer();
	}
	,getFirstPositionedAncestor: function() {
		var parent = this.parentNode;
		while(parent.isPositioned() == false) parent = parent.parentNode;
		return parent;
	}
	,getInitialContainingBlock: function() {
		return this.node.ownerDocument.documentElement.elementRenderer;
	}
	,getFirstBlockContainer: function() {
		var parent = this.parentNode;
		while(parent.isBlockContainer() == false) parent = parent.parentNode;
		return parent;
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
			this.invalidateDocumentLayout(true);
			break;
		case 4:
			this._needsLayout = true;
			this._childrenNeedLayout = true;
			this._childrenNeedRendering = true;
			this._needsRendering = true;
			this._positionedChildrenNeedLayout = true;
			this.invalidateDocumentLayoutAndRendering();
			break;
		default:
			this._needsLayout = true;
			this._childrenNeedLayout = true;
			this._childrenNeedRendering = true;
			this._needsRendering = true;
			this._positionedChildrenNeedLayout = true;
			this.invalidateContainingBlock(invalidationReason);
		}
	}
	,childInvalidated: function(invalidationReason) {
		this.invalidate(invalidationReason);
	}
	,positionedChildInvalidated: function(invalidationReason) {
		this.invalidate(invalidationReason);
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
	,invalidateDocumentLayout: function(immediate) {
		var htmlDocument = this.node.ownerDocument;
		htmlDocument.invalidateLayout(immediate);
	}
	,invalidateDocumentRendering: function() {
		var htmlDocument = this.node.ownerDocument;
		htmlDocument.invalidateRendering();
	}
	,invalidateDocumentLayoutAndRendering: function() {
		var htmlDocument = this.node.ownerDocument;
		htmlDocument.invalidateLayoutAndRendering();
	}
	,invalidatedStyle: function(styleName,invalidationReason) {
		switch(styleName) {
		case "background-color":case "background-clip":case "background-image":case "background-position":case "background-origin":case "background-repeat":case "background-size":
			this._needsRendering = true;
			this.invalidateDocumentRendering();
			break;
		default:
			this._needsLayout = true;
			this._needsRendering = true;
			this.invalidateContainingBlock(invalidationReason);
		}
	}
	,invalidatedChildStyle: function(styleName,invalidationReason) {
		switch(styleName) {
		case "background-color":case "background-clip":case "background-image":case "background-position":case "background-origin":case "background-repeat":case "background-size":
			break;
		default:
			this._needsLayout = true;
			this._childrenNeedRendering = true;
			this.invalidateDocumentLayoutAndRendering();
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
	,invalidateText: function() {
		var _g1 = 0, _g = this.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			var child = this.childNodes[i];
			child.invalidateText();
		}
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
	,get_scrollableBounds: function() {
		if(this.isRelativePositioned() == false) return this.get_bounds();
		var relativeOffset = this.getRelativeOffset();
		var bounds = this.get_bounds();
		return { x : bounds.x + relativeOffset.x, y : bounds.y + relativeOffset.y, width : bounds.width, height : bounds.height};
	}
	,getComputedStyle: function() {
		return this._coreStyle.computedStyle;
	}
	,setComputedStyle: function(value) {
		return this._coreStyle.computedStyle = value;
	}
	,get_coreStyle: function() {
		return this._coreStyle;
	}
	,set_coreStyle: function(value) {
		this._coreStyle = value;
		return value;
	}
	,get_bounds: function() {
		return this.bounds;
	}
	,set_bounds: function(value) {
		return this.bounds = value;
	}
	,get_scrollLeft: function() {
		return 0;
	}
	,set_scrollLeft: function(value) {
		return value;
	}
	,get_scrollTop: function() {
		return 0;
	}
	,set_scrollTop: function(value) {
		return value;
	}
	,get_scrollWidth: function() {
		return this.get_bounds().width;
	}
	,get_scrollHeight: function() {
		return this.get_bounds().height;
	}
	,__class__: cocktail.core.renderer.ElementRenderer
	,__properties__: $extend(cocktail.core.dom.NodeBase.prototype.__properties__,{get_scrollHeight:"get_scrollHeight",get_scrollWidth:"get_scrollWidth",set_scrollTop:"set_scrollTop",get_scrollTop:"get_scrollTop",set_scrollLeft:"set_scrollLeft",get_scrollLeft:"get_scrollLeft",set_computedStyle:"setComputedStyle",get_computedStyle:"getComputedStyle",set_coreStyle:"set_coreStyle",get_coreStyle:"get_coreStyle",get_scrollableBounds:"get_scrollableBounds",get_globalBounds:"get_globalBounds",set_bounds:"set_bounds",get_bounds:"get_bounds"})
});
cocktail.core.renderer.BoxRenderer = $hxClasses["cocktail.core.renderer.BoxRenderer"] = function(node) {
	cocktail.core.renderer.ElementRenderer.call(this,node);
};
cocktail.core.renderer.BoxRenderer.__name__ = ["cocktail","core","renderer","BoxRenderer"];
cocktail.core.renderer.BoxRenderer.__super__ = cocktail.core.renderer.ElementRenderer;
cocktail.core.renderer.BoxRenderer.prototype = $extend(cocktail.core.renderer.ElementRenderer.prototype,{
	graphicsContext: null
	,childrenGraphicsContext: null
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
	,scroll: function(x,y) {
		if(this.getComputedStyle().position == cocktail.core.style.Position.fixed) {
		}
	}
	,renderSelf: function(graphicContext) {
		this.renderBackground(graphicContext);
	}
	,clear: function(graphicsContext) {
	}
	,renderBackground: function(graphicContext) {
		this._coreStyle.computeBackgroundStyles();
		var backgroundManager = new cocktail.core.background.BackgroundManager(this);
		var backgroundBounds = this.getBackgroundBounds();
		var backgrounds = backgroundManager.render(backgroundBounds,this._coreStyle);
	}
	,renderChildren: function(graphicContext,forceRendering) {
	}
	,applyVisualEffects: function(graphicContext) {
		this.applyOpacity(graphicContext);
		if(this.isRelativePositioned() == true || this._coreStyle.transform != cocktail.core.style.Transform.none) {
			this._coreStyle.computeVisualEffectStyles();
			this.applyTransformationMatrix(graphicContext);
		}
	}
	,applyTransformationMatrix: function(graphicContext) {
		var relativeOffset = this.getRelativeOffset();
		var concatenatedMatrix = this.getConcatenatedMatrix(this.getComputedStyle().transform,relativeOffset);
		concatenatedMatrix.translate(relativeOffset.x,relativeOffset.y);
		var matrixData = concatenatedMatrix.data;
	}
	,applyOpacity: function(graphicContext) {
	}
	,getConcatenatedMatrix: function(matrix,relativeOffset) {
		var currentMatrix = new cocktail.core.geom.Matrix();
		var globalBounds = this.get_globalBounds();
		currentMatrix.translate(globalBounds.x + relativeOffset.x,globalBounds.y + relativeOffset.y);
		currentMatrix.concatenate(matrix);
		currentMatrix.translate((globalBounds.x + relativeOffset.x) * -1,(globalBounds.y + relativeOffset.y) * -1);
		return currentMatrix;
	}
	,layout: function(forceLayout) {
		this._coreStyle.computedStyle.set_opacity(this._coreStyle.opacity);
		this._coreStyle.computeTransitionStyles();
		if(this._needsLayout == true || forceLayout == true) {
			this.layoutSelf();
			this._needsLayout = false;
		}
	}
	,layoutSelf: function() {
		var containingBlockData = this._containingBlock.getContainerBlockData();
		var containingBlockFontMetricsData = this._containingBlock.get_coreStyle().get_fontMetricsData();
		this._coreStyle.computeTextAndFontStyles(containingBlockData,containingBlockFontMetricsData);
		this._coreStyle.computeBoxModelStyles(containingBlockData,this.isReplaced());
	}
	,isFloat: function() {
		var ret = false;
		switch( (this.getComputedStyle().cssFloat)[1] ) {
		case 0:
		case 1:
			ret = true;
			break;
		case 2:
			ret = false;
			break;
		}
		return ret;
	}
	,isPositioned: function() {
		var ret = false;
		switch( (this.getComputedStyle().position)[1] ) {
		case 1:
		case 2:
		case 3:
			ret = true;
			break;
		case 0:
			ret = false;
			break;
		}
		return ret;
	}
	,isRelativePositioned: function() {
		return this.getComputedStyle().position == cocktail.core.style.Position.relative;
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
	,establishesNewStackingContext: function() {
		if(this.isPositioned() == true) {
			if(this.isAutoZIndexPositioned() == true) return false; else return true;
			var $e = (this.getComputedStyle().zIndex);
			switch( $e[1] ) {
			case 0:
				return false;
			case 1:
				var value = $e[2];
				return true;
			}
		}
		return false;
	}
	,isAutoZIndexPositioned: function() {
		if(this.isPositioned() == false) return false;
		var $e = (this.getComputedStyle().zIndex);
		switch( $e[1] ) {
		case 0:
			return true;
		case 1:
			var value = $e[2];
			return false;
		}
	}
	,isClear: function() {
		var ret = false;
		switch( (this.getComputedStyle().clear)[1] ) {
		case 1:
		case 2:
		case 3:
			ret = true;
			break;
		case 0:
			ret = false;
			break;
		}
		return ret;
	}
	,getBackgroundBounds: function() {
		return this.get_globalBounds();
	}
	,getContainerBlockData: function() {
		return { width : this.getComputedStyle().getWidth(), isWidthAuto : this._coreStyle.width == cocktail.core.style.Dimension.cssAuto, height : this.getComputedStyle().getHeight(), isHeightAuto : this._coreStyle.height == cocktail.core.style.Dimension.cssAuto};
	}
	,getWindowData: function() {
		var width = cocktail.Lib.get_window().get_innerWidth();
		var height = cocktail.Lib.get_window().get_innerHeight();
		var windowData = { isHeightAuto : false, isWidthAuto : false, width : width, height : height};
		return windowData;
	}
	,__class__: cocktail.core.renderer.BoxRenderer
});
cocktail.core.renderer.FlowBoxRenderer = $hxClasses["cocktail.core.renderer.FlowBoxRenderer"] = function(node) {
	cocktail.core.renderer.BoxRenderer.call(this,node);
	this._positionedChildren = new Array();
};
cocktail.core.renderer.FlowBoxRenderer.__name__ = ["cocktail","core","renderer","FlowBoxRenderer"];
cocktail.core.renderer.FlowBoxRenderer.__super__ = cocktail.core.renderer.BoxRenderer;
cocktail.core.renderer.FlowBoxRenderer.prototype = $extend(cocktail.core.renderer.BoxRenderer.prototype,{
	_positionedChildren: null
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
	,addPositionedChildren: function(element) {
		this._positionedChildren.push(element);
	}
	,removePositionedChild: function(element) {
		this._positionedChildren.remove(element);
	}
	,layout: function(forceLayout) {
		cocktail.core.renderer.BoxRenderer.prototype.layout.call(this,forceLayout);
		var length = this.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			this.childNodes[i].layout(this._childrenNeedLayout == true);
		}
		this.format();
		if(this._positionedChildrenNeedLayout == true || forceLayout == true) {
			if(this.isPositioned() == true) this.layoutPositionedChildren();
			this._positionedChildrenNeedLayout = false;
		}
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
	,format: function() {
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
	,doLayoutPositionedChild: function(elementRenderer,containingBlockData) {
		if(elementRenderer.get_coreStyle().left != cocktail.core.style.PositionOffset.cssAuto) elementRenderer.positionedOrigin.x = this.getLeftOffset(elementRenderer); else if(elementRenderer.get_coreStyle().right != cocktail.core.style.PositionOffset.cssAuto) elementRenderer.positionedOrigin.x = this.getRightOffset(elementRenderer,containingBlockData.width);
		if(elementRenderer.get_coreStyle().top != cocktail.core.style.PositionOffset.cssAuto) elementRenderer.positionedOrigin.y = this.getTopOffset(elementRenderer); else if(elementRenderer.get_coreStyle().bottom != cocktail.core.style.PositionOffset.cssAuto) elementRenderer.positionedOrigin.y = this.getBottomOffset(elementRenderer,containingBlockData.height);
	}
	,getLeftOffset: function(elementRenderer) {
		var computedStyle = elementRenderer.get_coreStyle().computedStyle;
		return computedStyle.getLeft() + computedStyle.getMarginLeft();
	}
	,getRightOffset: function(elementRenderer,containingHTMLElementWidth) {
		var computedStyle = elementRenderer.get_coreStyle().computedStyle;
		return containingHTMLElementWidth - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getRight() - computedStyle.getMarginRight();
	}
	,getTopOffset: function(elementRenderer) {
		var computedStyle = elementRenderer.get_coreStyle().computedStyle;
		return computedStyle.getTop() + computedStyle.getMarginTop();
	}
	,getBottomOffset: function(elementRenderer,containingHTMLElementHeight) {
		var computedStyle = elementRenderer.get_coreStyle().computedStyle;
		return containingHTMLElementHeight - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getBottom();
	}
	,childrenInline: function() {
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
	,__class__: cocktail.core.renderer.FlowBoxRenderer
});
cocktail.core.renderer.BlockBoxRenderer = $hxClasses["cocktail.core.renderer.BlockBoxRenderer"] = function(node) {
	cocktail.core.renderer.FlowBoxRenderer.call(this,node);
	this._isUpdatingScroll = false;
	this._isMakingChildrenNonInline = false;
	this._scrollLeft = 0;
	this._scrollTop = 0;
	this._scrollableBounds = { x : 0.0, y : 0.0, width : 0.0, height : 0.0};
};
cocktail.core.renderer.BlockBoxRenderer.__name__ = ["cocktail","core","renderer","BlockBoxRenderer"];
cocktail.core.renderer.BlockBoxRenderer.__super__ = cocktail.core.renderer.FlowBoxRenderer;
cocktail.core.renderer.BlockBoxRenderer.prototype = $extend(cocktail.core.renderer.FlowBoxRenderer.prototype,{
	_horizontalScrollBar: null
	,_verticalScrollBar: null
	,_scrollableBounds: null
	,_scrollLeft: null
	,_scrollTop: null
	,_isUpdatingScroll: null
	,_isMakingChildrenNonInline: null
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
	,createAnonymousBlock: function(child) {
		var anonymousBlock = new cocktail.core.renderer.AnonymousBlockBoxRenderer();
		anonymousBlock.appendChild(child);
		anonymousBlock.set_coreStyle(anonymousBlock.node.coreStyle);
		return anonymousBlock;
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
	,renderLineBoxes: function(graphicContext,forceRendering) {
		var lineBoxes = this.getChilrenLineBoxes(this,this.layerRenderer);
		var length = lineBoxes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			lineBoxes[i].render(graphicContext,forceRendering);
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
	,renderBlockContainerChildren: function(graphicContext,forceRendering) {
		var childrenBlockContainer = this.getBlockContainerChildren(this,this.layerRenderer);
		var length = childrenBlockContainer.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			childrenBlockContainer[i].render(graphicContext,forceRendering);
		}
	}
	,renderScrollBars: function(graphicContext,forceRendering) {
		if(this._horizontalScrollBar != null) {
			this._horizontalScrollBar.elementRenderer.render(graphicContext,forceRendering);
			this.updateScroll();
		}
		if(this._verticalScrollBar != null) {
			this._verticalScrollBar.elementRenderer.render(graphicContext,forceRendering);
			this.updateScroll();
		}
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
	,scroll: function(x,y) {
		cocktail.core.renderer.FlowBoxRenderer.prototype.scroll.call(this,x,y);
		if(this._horizontalScrollBar != null || this._verticalScrollBar != null) this.scrollChildren(this,x,y);
	}
	,clip: function() {
	}
	,scrollChildren: function(root,scrollX,scrollY) {
		var length = root.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
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
	,format: function() {
		if(this.establishesNewFormattingContext() == true) {
			if(this.isPositioned() == true && this.isRelativePositioned() == false) this.doFormat(); else if(this.isFloat() == true) this.doFormat(); else if(this.getComputedStyle().display == cocktail.core.style.Display.inlineBlock) this.doFormat(); else if(this.childrenInline() == false) this.doFormat();
		}
	}
	,doFormat: function() {
		if(this.childrenInline() == true) new cocktail.core.style.formatter.InlineFormattingContext(this).format(new cocktail.core.style.floats.FloatsManager()); else new cocktail.core.style.formatter.BlockFormattingContext(this).format(new cocktail.core.style.floats.FloatsManager());
	}
	,layoutScrollBarsIfNecessary: function(viewportData) {
		var horizontalScrollBarContainerBlockData = this.getContainerBlockData();
		if(this._horizontalScrollBar != null) horizontalScrollBarContainerBlockData.height += this._horizontalScrollBar.coreStyle.computedStyle.getHeight();
		if(this._horizontalScrollBar != null) this.layoutPositionedChild(this._horizontalScrollBar.elementRenderer,horizontalScrollBarContainerBlockData,viewportData);
		var verticalScrollBarContainerBlockData = this.getContainerBlockData();
		if(this._verticalScrollBar != null) verticalScrollBarContainerBlockData.width += this._verticalScrollBar.coreStyle.computedStyle.getWidth();
		if(this._verticalScrollBar != null) this.layoutPositionedChild(this._verticalScrollBar.elementRenderer,verticalScrollBarContainerBlockData,viewportData);
	}
	,get_scrollLeft: function() {
		return this._scrollLeft;
	}
	,set_scrollLeft: function(value) {
		if(value <= 0) this._scrollLeft = 0; else if(value > this.getHorizontalMaxScroll()) this._scrollLeft = this.getHorizontalMaxScroll(); else this._scrollLeft = value;
		this.updateScroll();
		return value;
	}
	,get_scrollTop: function() {
		return this._scrollTop;
	}
	,set_scrollTop: function(value) {
		if(value <= 0) this._scrollTop = 0; else if(value > this.getVerticalMaxScroll()) this._scrollTop = this.getVerticalMaxScroll(); else this._scrollTop = value;
		this.updateScroll();
		return value;
	}
	,get_scrollWidth: function() {
		if(this._scrollableBounds.width > this.get_bounds().width) return this._scrollableBounds.width;
		return this.get_bounds().width;
	}
	,get_scrollHeight: function() {
		if(this._scrollableBounds.height > this.get_bounds().height) return this._scrollableBounds.height;
		return this.get_bounds().height;
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
	,getScrollableBounds: function() {
		return this.getChildrenBounds(this.doGetScrollableBounds(this));
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
	,attachHorizontalScrollBar: function() {
		if(this._horizontalScrollBar == null) {
			this._horizontalScrollBar = new cocktail.core.html.ScrollBar(false);
			this._horizontalScrollBar.ownerDocument = this.node.ownerDocument;
			this._horizontalScrollBar.attach();
			this.appendChild(this._horizontalScrollBar.elementRenderer);
			this._horizontalScrollBar.set_onScroll(this.onHorizontalScroll.$bind(this));
		}
		if(this._horizontalScrollBar != null) this._horizontalScrollBar.set_maxScroll(this.getHorizontalMaxScroll());
	}
	,detachHorizontalScrollBar: function() {
		if(this._horizontalScrollBar != null) {
			this.removeChild(this._horizontalScrollBar.elementRenderer);
			this._horizontalScrollBar.set_onScroll(null);
			this._horizontalScrollBar = null;
			this.set_scrollLeft(0);
		}
	}
	,attachOrDetachHorizontalScrollBarIfNecessary: function() {
		if(this._scrollableBounds.x < 0 || this._scrollableBounds.x + this._scrollableBounds.width > this.get_bounds().width) this.attachHorizontalScrollBar(); else this.detachHorizontalScrollBar();
	}
	,attachVerticalScrollBar: function() {
		if(this._verticalScrollBar == null) {
			this._verticalScrollBar = new cocktail.core.html.ScrollBar(true);
			this._verticalScrollBar.ownerDocument = this.node.ownerDocument;
			this._verticalScrollBar.attach();
			this.appendChild(this._verticalScrollBar.elementRenderer);
			this._verticalScrollBar.set_onScroll(this.onVerticalScroll.$bind(this));
		}
		if(this._verticalScrollBar != null) this._verticalScrollBar.set_maxScroll(this.getVerticalMaxScroll());
	}
	,detachVerticalScrollBar: function() {
		if(this._verticalScrollBar != null) {
			this.removeChild(this._verticalScrollBar.elementRenderer);
			this._verticalScrollBar.set_onScroll(null);
			this._verticalScrollBar = null;
			this.set_scrollTop(0);
		}
	}
	,attachOrDetachVerticalScrollBarIfNecessary: function() {
		if(this._scrollableBounds.y < 0 || this._scrollableBounds.y + this._scrollableBounds.height > this.get_bounds().height) this.attachVerticalScrollBar(); else this.detachVerticalScrollBar();
	}
	,onHorizontalScroll: function(event) {
		this.set_scrollLeft(this._horizontalScrollBar.get_scroll());
	}
	,onVerticalScroll: function(event) {
		this.set_scrollTop(this._verticalScrollBar.get_scroll());
	}
	,establishesNewStackingContext: function() {
		var establishesNewStackingContext = cocktail.core.renderer.FlowBoxRenderer.prototype.establishesNewStackingContext.call(this);
		if(establishesNewStackingContext == true) return true;
		return this.canAlwaysOverflow() != true;
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
	,isHorizontallyScrollable: function(scrollOffset) {
		if(this._horizontalScrollBar == null) return false;
		if(scrollOffset < 0) {
			if(this.get_scrollLeft() >= this._scrollableBounds.width - this.getContainerBlockData().width) return false;
		} else if(scrollOffset > 0) {
			if(this.get_scrollLeft() <= 0) return false;
		}
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
	,isBlockContainer: function() {
		return true;
	}
	,rendersAsIfEstablishingStackingContext: function() {
		if(this.isAutoZIndexPositioned() == true) return true; else if(this.getComputedStyle().display == cocktail.core.style.Display.inlineBlock) return true; else if(this.isFloat() == true) return true;
		return false;
	}
	,getContainerBlockData: function() {
		var height = this.getComputedStyle().getHeight();
		if(this._horizontalScrollBar != null) height -= this._horizontalScrollBar.coreStyle.computedStyle.getHeight();
		var width = this.getComputedStyle().getWidth();
		if(this._verticalScrollBar != null) width -= this._verticalScrollBar.coreStyle.computedStyle.getWidth();
		return { width : width, isWidthAuto : this._coreStyle.width == cocktail.core.style.Dimension.cssAuto, height : height, isHeightAuto : this._coreStyle.height == cocktail.core.style.Dimension.cssAuto};
	}
	,getScrollbarContainerBlock: function() {
		return cocktail.core.renderer.FlowBoxRenderer.prototype.getContainerBlockData.call(this);
	}
	,getVerticalMaxScroll: function() {
		var maxScroll = this._scrollableBounds.height - this.getContainerBlockData().height;
		if(maxScroll < 0) return 0;
		return maxScroll;
	}
	,getHorizontalMaxScroll: function() {
		var maxScroll = this._scrollableBounds.width - this.getContainerBlockData().width;
		if(maxScroll < 0) return 0;
		return maxScroll;
	}
	,dispatchScrollEvent: function() {
		var scrollEvent = new cocktail.core.event.UIEvent();
		scrollEvent.initUIEvent("scroll",this.mustBubbleScrollEvent(),false,null,0.0);
		this.node.dispatchEvent(scrollEvent);
	}
	,mustBubbleScrollEvent: function() {
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
	,treatVisibleOverflowAsAuto: function() {
		return false;
	}
	,__class__: cocktail.core.renderer.BlockBoxRenderer
});
cocktail.core.renderer.AnonymousBlockBoxRenderer = $hxClasses["cocktail.core.renderer.AnonymousBlockBoxRenderer"] = function() {
	cocktail.core.renderer.BlockBoxRenderer.call(this,cocktail.Lib.get_document().createElement("DIV"));
};
cocktail.core.renderer.AnonymousBlockBoxRenderer.__name__ = ["cocktail","core","renderer","AnonymousBlockBoxRenderer"];
cocktail.core.renderer.AnonymousBlockBoxRenderer.__super__ = cocktail.core.renderer.BlockBoxRenderer;
cocktail.core.renderer.AnonymousBlockBoxRenderer.prototype = $extend(cocktail.core.renderer.BlockBoxRenderer.prototype,{
	removeChild: function(oldChild) {
		cocktail.core.renderer.BlockBoxRenderer.prototype.removeChild.call(this,oldChild);
		this.parentNode.removeChild(this);
		return oldChild;
	}
	,isPositioned: function() {
		return false;
	}
	,isAnonymousBlockBox: function() {
		return true;
	}
	,establishesNewStackingContext: function() {
		return false;
	}
	,isInlineLevel: function() {
		return false;
	}
	,__class__: cocktail.core.renderer.AnonymousBlockBoxRenderer
});
cocktail.core.renderer.BodyBoxRenderer = $hxClasses["cocktail.core.renderer.BodyBoxRenderer"] = function(node) {
	cocktail.core.renderer.BlockBoxRenderer.call(this,node);
};
cocktail.core.renderer.BodyBoxRenderer.__name__ = ["cocktail","core","renderer","BodyBoxRenderer"];
cocktail.core.renderer.BodyBoxRenderer.__super__ = cocktail.core.renderer.BlockBoxRenderer;
cocktail.core.renderer.BodyBoxRenderer.prototype = $extend(cocktail.core.renderer.BlockBoxRenderer.prototype,{
	layoutSelf: function() {
		cocktail.core.renderer.BlockBoxRenderer.prototype.layoutSelf.call(this);
		if(this._coreStyle.height == cocktail.core.style.Dimension.cssAuto && (this.isPositioned() == false || this.isRelativePositioned() == true)) this.getComputedStyle().set_height(this._containingBlock.getContainerBlockData().height - this.getComputedStyle().getMarginTop() - this.getComputedStyle().getMarginBottom() - this.getComputedStyle().getPaddingTop() - this.getComputedStyle().getPaddingBottom());
	}
	,getBackgroundBounds: function() {
		var windowData = this.getWindowData();
		var width = windowData.width;
		var height = windowData.height;
		var bodyBounds = { x : 0.0, y : 0.0, width : width, height : height};
		return bodyBounds;
	}
	,__class__: cocktail.core.renderer.BodyBoxRenderer
});
cocktail.core.renderer.EmbeddedBoxRenderer = $hxClasses["cocktail.core.renderer.EmbeddedBoxRenderer"] = function(node) {
	cocktail.core.renderer.BoxRenderer.call(this,node);
};
cocktail.core.renderer.EmbeddedBoxRenderer.__name__ = ["cocktail","core","renderer","EmbeddedBoxRenderer"];
cocktail.core.renderer.EmbeddedBoxRenderer.__super__ = cocktail.core.renderer.BoxRenderer;
cocktail.core.renderer.EmbeddedBoxRenderer.prototype = $extend(cocktail.core.renderer.BoxRenderer.prototype,{
	renderSelf: function(graphicContext) {
		cocktail.core.renderer.BoxRenderer.prototype.renderSelf.call(this,graphicContext);
		this.renderEmbeddedAsset(graphicContext);
	}
	,isReplaced: function() {
		return true;
	}
	,renderEmbeddedAsset: function(graphicContext) {
	}
	,get_bounds: function() {
		this.bounds.width = this.getComputedStyle().getWidth() + this.getComputedStyle().getPaddingLeft() + this.getComputedStyle().getPaddingRight();
		this.bounds.height = this.getComputedStyle().getHeight() + this.getComputedStyle().getPaddingTop() + this.getComputedStyle().getPaddingBottom();
		return this.bounds;
	}
	,__class__: cocktail.core.renderer.EmbeddedBoxRenderer
});
cocktail.core.renderer.LineBox = $hxClasses["cocktail.core.renderer.LineBox"] = function(elementRenderer) {
	cocktail.core.dom.NodeBase.call(this);
	this._bounds = { x : 0.0, y : 0.0, width : 0.0, height : 0.0};
	this._elementRenderer = elementRenderer;
	this._marginLeft = 0;
	this._marginRight = 0;
	this._paddingLeft = 0;
	this._paddingRight = 0;
	this._leadedAscent = 0;
	this._leadedDescent = 0;
	this._backgroundManager = new cocktail.core.background.BackgroundManager(this._elementRenderer);
};
cocktail.core.renderer.LineBox.__name__ = ["cocktail","core","renderer","LineBox"];
cocktail.core.renderer.LineBox.__super__ = cocktail.core.dom.NodeBase;
cocktail.core.renderer.LineBox.prototype = $extend(cocktail.core.dom.NodeBase.prototype,{
	_elementRenderer: null
	,elementRenderer: null
	,layerRenderer: null
	,_bounds: null
	,bounds: null
	,_nativeElement: null
	,nativeElement: null
	,_leadedAscent: null
	,leadedAscent: null
	,_leadedDescent: null
	,leadedDescent: null
	,_marginLeft: null
	,marginLeft: null
	,_marginRight: null
	,marginRight: null
	,_paddingLeft: null
	,paddingLeft: null
	,_paddingRight: null
	,paddingRight: null
	,_backgroundManager: null
	,render: function(graphicContext,forceRendering) {
		var backgrounds = this._backgroundManager.render(this._bounds,this._elementRenderer.get_coreStyle());
	}
	,isText: function() {
		return false;
	}
	,isSpace: function() {
		return false;
	}
	,isAbsolutelyPositioned: function() {
		return this._elementRenderer.get_coreStyle().computedStyle.position == cocktail.core.style.Position.fixed || this._elementRenderer.get_coreStyle().computedStyle.position == cocktail.core.style.Position.absolute;
	}
	,establishesNewFormattingContext: function() {
		return this._elementRenderer.establishesNewFormattingContext();
	}
	,getBaselineOffset: function(parentBaselineOffset,parentXHeight) {
		var baselineOffset = parentBaselineOffset + this._elementRenderer.get_coreStyle().computedStyle.verticalAlign;
		switch( (this._elementRenderer.get_coreStyle().verticalAlign)[1] ) {
		case 5:
			baselineOffset -= this.get_bounds().height / 2 - parentXHeight / 2;
			break;
		case 3:
			break;
		default:
		}
		return baselineOffset;
	}
	,get_elementRenderer: function() {
		return this._elementRenderer;
	}
	,get_layerRenderer: function() {
		return this._elementRenderer.layerRenderer;
	}
	,get_paddingRight: function() {
		return this._paddingRight;
	}
	,set_paddingRight: function(value) {
		return this._paddingRight = value;
	}
	,get_paddingLeft: function() {
		return this._paddingLeft;
	}
	,set_paddingLeft: function(value) {
		return this._paddingLeft = value;
	}
	,get_marginRight: function() {
		return this._marginRight;
	}
	,get_marginLeft: function() {
		return this._marginLeft;
	}
	,set_marginLeft: function(value) {
		return this._marginLeft = value;
	}
	,set_marginRight: function(value) {
		return this._marginRight = value;
	}
	,get_nativeElement: function() {
		return this._nativeElement;
	}
	,get_bounds: function() {
		return this._bounds;
	}
	,set_bounds: function(value) {
		return this._bounds = value;
	}
	,get_leadedAscent: function() {
		return this._leadedAscent;
	}
	,set_leadedAscent: function(value) {
		return this._leadedAscent = value;
	}
	,get_leadedDescent: function() {
		return this._leadedDescent;
	}
	,set_leadedDescent: function(value) {
		return this._leadedDescent = value;
	}
	,__class__: cocktail.core.renderer.LineBox
	,__properties__: $extend(cocktail.core.dom.NodeBase.prototype.__properties__,{set_paddingRight:"set_paddingRight",get_paddingRight:"get_paddingRight",set_paddingLeft:"set_paddingLeft",get_paddingLeft:"get_paddingLeft",set_marginRight:"set_marginRight",get_marginRight:"get_marginRight",set_marginLeft:"set_marginLeft",get_marginLeft:"get_marginLeft",set_leadedDescent:"set_leadedDescent",get_leadedDescent:"get_leadedDescent",set_leadedAscent:"set_leadedAscent",get_leadedAscent:"get_leadedAscent",get_nativeElement:"get_nativeElement",set_bounds:"set_bounds",get_bounds:"get_bounds",get_layerRenderer:"get_layerRenderer",get_elementRenderer:"get_elementRenderer"})
});
cocktail.core.renderer.EmbeddedLineBox = $hxClasses["cocktail.core.renderer.EmbeddedLineBox"] = function(elementRenderer) {
	cocktail.core.renderer.LineBox.call(this,elementRenderer);
};
cocktail.core.renderer.EmbeddedLineBox.__name__ = ["cocktail","core","renderer","EmbeddedLineBox"];
cocktail.core.renderer.EmbeddedLineBox.__super__ = cocktail.core.renderer.LineBox;
cocktail.core.renderer.EmbeddedLineBox.prototype = $extend(cocktail.core.renderer.LineBox.prototype,{
	render: function(graphicContext,forceRendering) {
		this._elementRenderer.render(graphicContext,forceRendering);
	}
	,get_leadedAscent: function() {
		return this.get_bounds().height + this._elementRenderer.get_coreStyle().computedStyle.getMarginTop() + this._elementRenderer.get_coreStyle().computedStyle.getMarginBottom();
	}
	,get_leadedDescent: function() {
		return 0.0;
	}
	,get_bounds: function() {
		return this._elementRenderer.get_bounds();
	}
	,__class__: cocktail.core.renderer.EmbeddedLineBox
});
cocktail.core.renderer.ImageRenderer = $hxClasses["cocktail.core.renderer.ImageRenderer"] = function(node) {
	cocktail.core.renderer.EmbeddedBoxRenderer.call(this,node);
};
cocktail.core.renderer.ImageRenderer.__name__ = ["cocktail","core","renderer","ImageRenderer"];
cocktail.core.renderer.ImageRenderer.__super__ = cocktail.core.renderer.EmbeddedBoxRenderer;
cocktail.core.renderer.ImageRenderer.prototype = $extend(cocktail.core.renderer.EmbeddedBoxRenderer.prototype,{
	renderEmbeddedAsset: function(graphicContext) {
		var resource = cocktail.core.resource.ResourceManager.getResource(this.node.getAttribute("src"));
		if(resource.loaded == false || resource.loadedWithError == true) return;
	}
	,__class__: cocktail.core.renderer.ImageRenderer
});
cocktail.core.renderer.InitialBlockRenderer = $hxClasses["cocktail.core.renderer.InitialBlockRenderer"] = function(node) {
	cocktail.core.renderer.BlockBoxRenderer.call(this,node);
	this.attach();
};
cocktail.core.renderer.InitialBlockRenderer.__name__ = ["cocktail","core","renderer","InitialBlockRenderer"];
cocktail.core.renderer.InitialBlockRenderer.__super__ = cocktail.core.renderer.BlockBoxRenderer;
cocktail.core.renderer.InitialBlockRenderer.prototype = $extend(cocktail.core.renderer.BlockBoxRenderer.prototype,{
	attachLayer: function() {
		this.layerRenderer = new cocktail.core.renderer.LayerRenderer(this);
	}
	,detachLayer: function() {
		this.layerRenderer = null;
	}
	,attachContaininingBlock: function() {
	}
	,detachContainingBlock: function() {
	}
	,invalidateContainingBlock: function(invalidationReason) {
		this.invalidateDocumentLayoutAndRendering();
	}
	,isPositioned: function() {
		return true;
	}
	,establishesNewFormattingContext: function() {
		return true;
	}
	,establishesNewStackingContext: function() {
		return true;
	}
	,getScrollbarContainerBlock: function() {
		var width = cocktail.Lib.get_window().get_innerWidth();
		var height = cocktail.Lib.get_window().get_innerHeight();
		var windowData = { isHeightAuto : false, isWidthAuto : false, width : width, height : height};
		return windowData;
	}
	,mustBubbleScrollEvent: function() {
		return true;
	}
	,treatVisibleOverflowAsAuto: function() {
		return true;
	}
	,getWindowData: function() {
		var width = cocktail.Lib.get_window().get_innerWidth();
		var height = cocktail.Lib.get_window().get_innerHeight();
		var windowData = { isHeightAuto : false, isWidthAuto : false, width : width, height : height};
		if(this._verticalScrollBar != null) windowData.width -= this._verticalScrollBar.coreStyle.computedStyle.getWidth();
		if(this._horizontalScrollBar != null) windowData.height -= this._horizontalScrollBar.coreStyle.computedStyle.getHeight();
		return windowData;
	}
	,getContainerBlockData: function() {
		return this.getWindowData();
	}
	,getContainingBlock: function() {
		return this;
	}
	,get_bounds: function() {
		var containerBlockData = this.getContainerBlockData();
		var width = containerBlockData.width;
		var height = containerBlockData.height;
		return { x : 0.0, y : 0.0, width : width, height : height};
	}
	,get_globalBounds: function() {
		return this.get_bounds();
	}
	,__class__: cocktail.core.renderer.InitialBlockRenderer
});
cocktail.core.renderer.InlineBlockLineBox = $hxClasses["cocktail.core.renderer.InlineBlockLineBox"] = function(elementRenderer) {
	cocktail.core.renderer.EmbeddedLineBox.call(this,elementRenderer);
};
cocktail.core.renderer.InlineBlockLineBox.__name__ = ["cocktail","core","renderer","InlineBlockLineBox"];
cocktail.core.renderer.InlineBlockLineBox.__super__ = cocktail.core.renderer.EmbeddedLineBox;
cocktail.core.renderer.InlineBlockLineBox.prototype = $extend(cocktail.core.renderer.EmbeddedLineBox.prototype,{
	get_leadedAscent: function() {
		return this.get_bounds().height + this._elementRenderer.get_coreStyle().computedStyle.getMarginTop() + this._elementRenderer.get_coreStyle().computedStyle.getMarginBottom();
	}
	,__class__: cocktail.core.renderer.InlineBlockLineBox
});
cocktail.core.renderer.InlineBoxRenderer = $hxClasses["cocktail.core.renderer.InlineBoxRenderer"] = function(node) {
	cocktail.core.renderer.FlowBoxRenderer.call(this,node);
};
cocktail.core.renderer.InlineBoxRenderer.__name__ = ["cocktail","core","renderer","InlineBoxRenderer"];
cocktail.core.renderer.InlineBoxRenderer.__super__ = cocktail.core.renderer.FlowBoxRenderer;
cocktail.core.renderer.InlineBoxRenderer.prototype = $extend(cocktail.core.renderer.FlowBoxRenderer.prototype,{
	renderBackground: function(graphicContext) {
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
	,get_bounds: function() {
		var lineBoxesBounds = new Array();
		var length = this.lineBoxes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			lineBoxesBounds.push(this.lineBoxes[i].get_bounds());
		}
		return this.getChildrenBounds(lineBoxesBounds);
	}
	,__class__: cocktail.core.renderer.InlineBoxRenderer
});
cocktail.core.renderer.LayerRenderer = $hxClasses["cocktail.core.renderer.LayerRenderer"] = function(rootElementRenderer) {
	cocktail.core.dom.NodeBase.call(this);
	this._rootElementRenderer = rootElementRenderer;
	this._zeroAndAutoZIndexChildRenderers = new Array();
	this._positiveZIndexChildRenderers = new Array();
	this._negativeZIndexChildRenderers = new Array();
};
cocktail.core.renderer.LayerRenderer.__name__ = ["cocktail","core","renderer","LayerRenderer"];
cocktail.core.renderer.LayerRenderer.__super__ = cocktail.core.dom.NodeBase;
cocktail.core.renderer.LayerRenderer.prototype = $extend(cocktail.core.dom.NodeBase.prototype,{
	_rootElementRenderer: null
	,rootElementRenderer: null
	,_zeroAndAutoZIndexChildRenderers: null
	,_positiveZIndexChildRenderers: null
	,_negativeZIndexChildRenderers: null
	,appendChild: function(newChild) {
		cocktail.core.dom.NodeBase.prototype.appendChild.call(this,newChild);
		var childLayer = newChild;
		var $e = (childLayer.get_rootElementRenderer().getComputedStyle().zIndex);
		switch( $e[1] ) {
		case 0:
			this._zeroAndAutoZIndexChildRenderers.push(childLayer.get_rootElementRenderer());
			break;
		case 1:
			var value = $e[2];
			if(value == 0) this._zeroAndAutoZIndexChildRenderers.push(childLayer.get_rootElementRenderer()); else if(value > 0) this.insertPositiveZIndexChildRenderer(childLayer.get_rootElementRenderer(),value); else if(value < 0) this.insertNegativeZIndexChildRenderer(childLayer.get_rootElementRenderer(),value);
			break;
		}
		return newChild;
	}
	,removeChild: function(oldChild) {
		var childLayer = oldChild;
		var removed = false;
		removed = this._zeroAndAutoZIndexChildRenderers.remove(childLayer.get_rootElementRenderer());
		if(removed == false) {
			removed = this._positiveZIndexChildRenderers.remove(childLayer.get_rootElementRenderer());
			if(removed == false) this._negativeZIndexChildRenderers.remove(childLayer.get_rootElementRenderer());
		}
		cocktail.core.dom.NodeBase.prototype.removeChild.call(this,oldChild);
		return oldChild;
	}
	,renderPositiveChildElementRenderers: function(graphicContext,forceRendering) {
		this.renderChildElementRenderers(this._positiveZIndexChildRenderers,graphicContext,forceRendering);
	}
	,renderZeroAndAutoChildElementRenderers: function(graphicContext,forceRendering) {
		this.renderChildElementRenderers(this._zeroAndAutoZIndexChildRenderers,graphicContext,forceRendering);
	}
	,renderNegativeChildElementRenderers: function(graphicContext,forceRendering) {
		this.renderChildElementRenderers(this._negativeZIndexChildRenderers,graphicContext,forceRendering);
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
	,insertAutoZIndexChildElementRenderer: function(elementRenderer) {
		this._zeroAndAutoZIndexChildRenderers.push(elementRenderer);
	}
	,removeAutoZIndexChildElementRenderer: function(elementRenderer) {
		this._zeroAndAutoZIndexChildRenderers.remove(elementRenderer);
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
	,getTopMostElementRendererAtPoint: function(point,scrollX,scrollY) {
		var elementRenderersAtPoint = this.getElementRenderersAtPoint(point,scrollX,scrollY);
		var topMostElementRenderer = elementRenderersAtPoint[elementRenderersAtPoint.length - 1];
		return topMostElementRenderer;
	}
	,getElementRenderersAtPoint: function(point,scrollX,scrollY) {
		var elementRenderersAtPoint = this.getElementRenderersAtPointInLayer(this._rootElementRenderer,point,scrollX,scrollY);
		if(this._rootElementRenderer.hasChildNodes() == true) {
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
	,getElementRenderersAtPointInChildRenderers: function(point,childRenderers,scrollX,scrollY) {
		var elementRenderersAtPointInChildRenderers = new Array();
		var length = childRenderers.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var elementRenderersAtPointInChildRenderer = [];
			if(childRenderers[i].establishesNewStackingContext() == true) {
				if(childRenderers[i].isScrollBar() == true) elementRenderersAtPointInChildRenderer = childRenderers[i].layerRenderer.getElementRenderersAtPoint(point,scrollX,scrollY); else if(childRenderers[i].get_coreStyle().position == cocktail.core.style.Position.fixed) elementRenderersAtPointInChildRenderer = childRenderers[i].layerRenderer.getElementRenderersAtPoint(point,scrollX,scrollY); else elementRenderersAtPointInChildRenderer = childRenderers[i].layerRenderer.getElementRenderersAtPoint(point,scrollX + this._rootElementRenderer.get_scrollLeft(),scrollY + this._rootElementRenderer.get_scrollTop());
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
	,isWithinBounds: function(point,bounds) {
		return point.x >= bounds.x && point.x <= bounds.x + bounds.width && point.y >= bounds.y && point.y <= bounds.y + bounds.height;
	}
	,getChildRenderers: function() {
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
	,get_rootElementRenderer: function() {
		return this._rootElementRenderer;
	}
	,__class__: cocktail.core.renderer.LayerRenderer
	,__properties__: $extend(cocktail.core.dom.NodeBase.prototype.__properties__,{get_rootElementRenderer:"get_rootElementRenderer"})
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
cocktail.core.renderer.InvalidationReason = $hxClasses["cocktail.core.renderer.InvalidationReason"] = { __ename__ : ["cocktail","core","renderer","InvalidationReason"], __constructs__ : ["styleChanged","childStyleChanged","positionedChildStyleChanged","needsImmediateLayout","windowResize","other"] }
cocktail.core.renderer.InvalidationReason.styleChanged = function(styleName) { var $x = ["styleChanged",0,styleName]; $x.__enum__ = cocktail.core.renderer.InvalidationReason; $x.toString = $estr; return $x; }
cocktail.core.renderer.InvalidationReason.childStyleChanged = function(styleName) { var $x = ["childStyleChanged",1,styleName]; $x.__enum__ = cocktail.core.renderer.InvalidationReason; $x.toString = $estr; return $x; }
cocktail.core.renderer.InvalidationReason.positionedChildStyleChanged = function(styleName) { var $x = ["positionedChildStyleChanged",2,styleName]; $x.__enum__ = cocktail.core.renderer.InvalidationReason; $x.toString = $estr; return $x; }
cocktail.core.renderer.InvalidationReason.needsImmediateLayout = ["needsImmediateLayout",3];
cocktail.core.renderer.InvalidationReason.needsImmediateLayout.toString = $estr;
cocktail.core.renderer.InvalidationReason.needsImmediateLayout.__enum__ = cocktail.core.renderer.InvalidationReason;
cocktail.core.renderer.InvalidationReason.windowResize = ["windowResize",4];
cocktail.core.renderer.InvalidationReason.windowResize.toString = $estr;
cocktail.core.renderer.InvalidationReason.windowResize.__enum__ = cocktail.core.renderer.InvalidationReason;
cocktail.core.renderer.InvalidationReason.other = ["other",5];
cocktail.core.renderer.InvalidationReason.other.toString = $estr;
cocktail.core.renderer.InvalidationReason.other.__enum__ = cocktail.core.renderer.InvalidationReason;
cocktail.core.renderer.RootLineBox = $hxClasses["cocktail.core.renderer.RootLineBox"] = function(elementRenderer) {
	cocktail.core.renderer.LineBox.call(this,elementRenderer);
};
cocktail.core.renderer.RootLineBox.__name__ = ["cocktail","core","renderer","RootLineBox"];
cocktail.core.renderer.RootLineBox.__super__ = cocktail.core.renderer.LineBox;
cocktail.core.renderer.RootLineBox.prototype = $extend(cocktail.core.renderer.LineBox.prototype,{
	get_bounds: function() {
		return this.getChildrenBounds(this.getLineBoxesBounds(this));
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
	,__class__: cocktail.core.renderer.RootLineBox
});
cocktail.core.renderer.ScrollBarRenderer = $hxClasses["cocktail.core.renderer.ScrollBarRenderer"] = function(node) {
	cocktail.core.renderer.BlockBoxRenderer.call(this,node);
};
cocktail.core.renderer.ScrollBarRenderer.__name__ = ["cocktail","core","renderer","ScrollBarRenderer"];
cocktail.core.renderer.ScrollBarRenderer.__super__ = cocktail.core.renderer.BlockBoxRenderer;
cocktail.core.renderer.ScrollBarRenderer.prototype = $extend(cocktail.core.renderer.BlockBoxRenderer.prototype,{
	isScrollBar: function() {
		return true;
	}
	,isInlineLevel: function() {
		return false;
	}
	,establishesNewStackingContext: function() {
		return true;
	}
	,scroll: function(x,y) {
	}
	,isAutoZIndexPositioned: function() {
		return false;
	}
	,getContainingBlock: function() {
		return this.getFirstBlockContainer();
	}
	,__class__: cocktail.core.renderer.ScrollBarRenderer
});
cocktail.core.renderer.TextInputRenderer = $hxClasses["cocktail.core.renderer.TextInputRenderer"] = function(node) {
	cocktail.core.renderer.EmbeddedBoxRenderer.call(this,node);
	node.addEventListener("focus",this.onTextInputFocus.$bind(this));
};
cocktail.core.renderer.TextInputRenderer.__name__ = ["cocktail","core","renderer","TextInputRenderer"];
cocktail.core.renderer.TextInputRenderer.__super__ = cocktail.core.renderer.EmbeddedBoxRenderer;
cocktail.core.renderer.TextInputRenderer.prototype = $extend(cocktail.core.renderer.EmbeddedBoxRenderer.prototype,{
	value: null
	,renderEmbeddedAsset: function(graphicContext) {
		this.updateNativeTextField();
	}
	,onTextInputFocus: function(e) {
	}
	,updateNativeTextField: function() {
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
	,get_value: function() {
		return null;
	}
	,set_value: function(value) {
		return null;
	}
	,__class__: cocktail.core.renderer.TextInputRenderer
	,__properties__: $extend(cocktail.core.renderer.EmbeddedBoxRenderer.prototype.__properties__,{set_value:"set_value",get_value:"get_value"})
});
cocktail.core.renderer.TextLineBox = $hxClasses["cocktail.core.renderer.TextLineBox"] = function(elementRenderer,text) {
	cocktail.core.renderer.LineBox.call(this,elementRenderer);
	this._text = text;
	this._nativeElement = new cocktail.port.server.FontManager().createNativeTextElement(text,elementRenderer.get_coreStyle().computedStyle);
	this._bounds.height = this.getTextHeight();
};
cocktail.core.renderer.TextLineBox.__name__ = ["cocktail","core","renderer","TextLineBox"];
cocktail.core.renderer.TextLineBox.__super__ = cocktail.core.renderer.LineBox;
cocktail.core.renderer.TextLineBox.prototype = $extend(cocktail.core.renderer.LineBox.prototype,{
	_text: null
	,render: function(graphicContext,forceRendering) {
	}
	,getBaselineOffset: function(parentBaselineOffset,parentXHeight) {
		return parentBaselineOffset;
	}
	,isSpace: function() {
		return this._text == " ";
	}
	,isText: function() {
		return true;
	}
	,isAbsolutelyPositioned: function() {
		return false;
	}
	,establishesNewFormattingContext: function() {
		return false;
	}
	,get_leadedAscent: function() {
		var ascent = this._elementRenderer.get_coreStyle().get_fontMetricsData().ascent;
		var descent = this._elementRenderer.get_coreStyle().get_fontMetricsData().descent;
		var leading = this._elementRenderer.get_coreStyle().computedStyle.getLineHeight() - (ascent + descent);
		var leadedAscent = ascent + leading / 2;
		var leadedDescent = descent + leading / 2;
		return leadedAscent;
	}
	,get_leadedDescent: function() {
		var ascent = this._elementRenderer.get_coreStyle().get_fontMetricsData().ascent;
		var descent = this._elementRenderer.get_coreStyle().get_fontMetricsData().descent;
		var leading = this._elementRenderer.get_coreStyle().computedStyle.getLineHeight() - (ascent + descent);
		var leadedAscent = ascent + leading / 2;
		var leadedDescent = descent + leading / 2;
		return leadedDescent;
	}
	,getTextWidth: function() {
		if(this.isSpace() == true) return this._elementRenderer.get_coreStyle().get_fontMetricsData().spaceWidth + this._elementRenderer.get_coreStyle().computedStyle.getLetterSpacing() + this._elementRenderer.get_coreStyle().computedStyle.getWordSpacing(); else return 0.0;
	}
	,getTextHeight: function() {
		return this.get_leadedAscent() + this.get_leadedDescent();
	}
	,__class__: cocktail.core.renderer.TextLineBox
});
cocktail.core.renderer.TextRenderer = $hxClasses["cocktail.core.renderer.TextRenderer"] = function(node) {
	cocktail.core.renderer.ElementRenderer.call(this,node);
	this._text = node;
};
cocktail.core.renderer.TextRenderer.__name__ = ["cocktail","core","renderer","TextRenderer"];
cocktail.core.renderer.TextRenderer.doGetTextTokens = function(text,whiteSpace) {
	text = cocktail.core.renderer.TextRenderer.applyWhiteSpace(text,whiteSpace);
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
cocktail.core.renderer.TextRenderer.applyWhiteSpace = function(text,whiteSpace) {
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
cocktail.core.renderer.TextRenderer.__super__ = cocktail.core.renderer.ElementRenderer;
cocktail.core.renderer.TextRenderer.prototype = $extend(cocktail.core.renderer.ElementRenderer.prototype,{
	_textTokens: null
	,_text: null
	,layout: function(forceLayout) {
		this.createTextLines();
	}
	,invalidateText: function() {
	}
	,createTextLines: function() {
		this._textTokens = cocktail.core.renderer.TextRenderer.doGetTextTokens(this._text.get_nodeValue(),this.getComputedStyle().whiteSpace);
		this.lineBoxes = [];
		var length = this._textTokens.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			this.lineBoxes.push(this.createTextLineBoxFromTextToken(this._textTokens[i]));
		}
	}
	,createTextLineBoxFromTextToken: function(textToken) {
		var text;
		var $e = (textToken);
		switch( $e[1] ) {
		case 0:
			var value = $e[2];
			text = value;
			break;
		case 1:
			text = " ";
			break;
		case 2:
			text = "";
			break;
		case 3:
			text = "";
			break;
		}
		var textLineBox = new cocktail.core.renderer.TextLineBox(this,text);
		return textLineBox;
	}
	,isFloat: function() {
		return false;
	}
	,isPositioned: function() {
		return false;
	}
	,isText: function() {
		return true;
	}
	,isInlineLevel: function() {
		return true;
	}
	,get_bounds: function() {
		var textLineBoxesBounds = new Array();
		var length = this.lineBoxes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			textLineBoxesBounds.push(this.lineBoxes[i].get_bounds());
		}
		return this.getChildrenBounds(textLineBoxesBounds);
	}
	,__class__: cocktail.core.renderer.TextRenderer
});
cocktail.core.renderer.VideoRenderer = $hxClasses["cocktail.core.renderer.VideoRenderer"] = function(node) {
	cocktail.core.renderer.EmbeddedBoxRenderer.call(this,node);
};
cocktail.core.renderer.VideoRenderer.__name__ = ["cocktail","core","renderer","VideoRenderer"];
cocktail.core.renderer.VideoRenderer.__super__ = cocktail.core.renderer.EmbeddedBoxRenderer;
cocktail.core.renderer.VideoRenderer.prototype = $extend(cocktail.core.renderer.EmbeddedBoxRenderer.prototype,{
	renderEmbeddedAsset: function(graphicContext) {
		var htmlVideoElement = this.node;
		if(htmlVideoElement.shouldRenderPosterFrame() == true) this.renderPosterFrame(htmlVideoElement,graphicContext); else this.renderVideo(htmlVideoElement,graphicContext);
	}
	,renderVideo: function(htmlVideoElement,graphicContext) {
		var width;
		var height;
		if(this._coreStyle.computedStyle.getWidth() < this._coreStyle.computedStyle.getHeight()) {
			var ratio = htmlVideoElement.get_videoHeight() / this._coreStyle.computedStyle.getHeight();
			width = htmlVideoElement.get_videoWidth() / ratio;
			height = this._coreStyle.computedStyle.getHeight();
		} else {
			var ratio = htmlVideoElement.get_videoWidth() / this._coreStyle.computedStyle.getWidth();
			height = htmlVideoElement.get_videoHeight() / ratio;
			width = this._coreStyle.computedStyle.getWidth();
		}
		var xOffset = (this._coreStyle.computedStyle.getWidth() - width) / 2;
		var yOffset = (this._coreStyle.computedStyle.getHeight() - height) / 2;
	}
	,renderPosterFrame: function(htmlVideoElement,graphicContext) {
		var resource = cocktail.core.resource.ResourceManager.getResource(this.node.getAttribute("poster"));
		if(resource.loaded == false || resource.loadedWithError == true) return;
	}
	,__class__: cocktail.core.renderer.VideoRenderer
});
if(!cocktail.core.resource) cocktail.core.resource = {}
cocktail.core.resource.ResourceLoader = $hxClasses["cocktail.core.resource.ResourceLoader"] = function() {
};
cocktail.core.resource.ResourceLoader.__name__ = ["cocktail","core","resource","ResourceLoader"];
cocktail.core.resource.ResourceLoader.prototype = {
	_onLoadCompleteCallback: null
	,_onLoadErrorCallback: null
	,_urlToLoadIdx: null
	,_urls: null
	,load: function(urls,onLoadComplete,onLoadError) {
		this._onLoadCompleteCallback = onLoadComplete;
		this._onLoadErrorCallback = onLoadError;
		this._urls = urls;
		this._urlToLoadIdx = 0;
		this.doLoad(this._urls[this._urlToLoadIdx]);
	}
	,doLoad: function(url) {
	}
	,onLoadComplete: function(data) {
		this._onLoadCompleteCallback(data);
	}
	,onLoadError: function(msg) {
		this._urlToLoadIdx++;
		if(this._urlToLoadIdx < this._urls.length - 1) this.doLoad(this._urls[this._urlToLoadIdx]); else this._onLoadErrorCallback(msg);
	}
	,__class__: cocktail.core.resource.ResourceLoader
}
cocktail.core.resource.AbstractMediaLoader = $hxClasses["cocktail.core.resource.AbstractMediaLoader"] = function() {
	cocktail.core.resource.ResourceLoader.call(this);
};
cocktail.core.resource.AbstractMediaLoader.__name__ = ["cocktail","core","resource","AbstractMediaLoader"];
cocktail.core.resource.AbstractMediaLoader.__super__ = cocktail.core.resource.ResourceLoader;
cocktail.core.resource.AbstractMediaLoader.prototype = $extend(cocktail.core.resource.ResourceLoader.prototype,{
	_nativeElement: null
	,nativeElement: null
	,_intrinsicWidth: null
	,intrinsicWidth: null
	,_intrinsicHeight: null
	,intrinsicHeight: null
	,_intrinsicRatio: null
	,intrinsicRatio: null
	,getNativeElement: function() {
		return this._nativeElement;
	}
	,getIntrinsicWidth: function() {
		return this._intrinsicWidth;
	}
	,getIntrinsicHeight: function() {
		return this._intrinsicHeight;
	}
	,getIntrinsicRatio: function() {
		return this._intrinsicRatio;
	}
	,__class__: cocktail.core.resource.AbstractMediaLoader
	,__properties__: {get_intrinsicRatio:"getIntrinsicRatio",get_intrinsicHeight:"getIntrinsicHeight",get_intrinsicWidth:"getIntrinsicWidth",get_nativeElement:"getNativeElement"}
});
cocktail.core.resource.AbstractResource = $hxClasses["cocktail.core.resource.AbstractResource"] = function(url) {
	cocktail.core.event.EventTarget.call(this);
	this.loaded = false;
	this.loadedWithError = false;
	this.load(url);
};
cocktail.core.resource.AbstractResource.__name__ = ["cocktail","core","resource","AbstractResource"];
cocktail.core.resource.AbstractResource.__super__ = cocktail.core.event.EventTarget;
cocktail.core.resource.AbstractResource.prototype = $extend(cocktail.core.event.EventTarget.prototype,{
	loaded: null
	,loadedWithError: null
	,nativeResource: null
	,intrinsicWidth: null
	,intrinsicHeight: null
	,intrinsicRatio: null
	,load: function(url) {
	}
	,onLoadComplete: function() {
		this.loaded = true;
		var loadEvent = new cocktail.core.event.UIEvent();
		loadEvent.initUIEvent("load",false,false,null,0.0);
		this.dispatchEvent(loadEvent);
	}
	,onLoadError: function() {
		this.loadedWithError = true;
		var errorEvent = new cocktail.core.event.UIEvent();
		errorEvent.initUIEvent("error",false,false,null,0.0);
		this.dispatchEvent(errorEvent);
	}
	,__class__: cocktail.core.resource.AbstractResource
});
cocktail.port.server.MediaLoader = $hxClasses["cocktail.port.server.MediaLoader"] = function() {
	cocktail.core.resource.AbstractMediaLoader.call(this);
};
cocktail.port.server.MediaLoader.__name__ = ["cocktail","port","server","MediaLoader"];
cocktail.port.server.MediaLoader.__super__ = cocktail.core.resource.AbstractMediaLoader;
cocktail.port.server.MediaLoader.prototype = $extend(cocktail.core.resource.AbstractMediaLoader.prototype,{
	__class__: cocktail.port.server.MediaLoader
});
cocktail.core.resource.ImageLoader = $hxClasses["cocktail.core.resource.ImageLoader"] = function() {
	cocktail.port.server.MediaLoader.call(this);
};
cocktail.core.resource.ImageLoader.__name__ = ["cocktail","core","resource","ImageLoader"];
cocktail.core.resource.ImageLoader.__super__ = cocktail.port.server.MediaLoader;
cocktail.core.resource.ImageLoader.prototype = $extend(cocktail.port.server.MediaLoader.prototype,{
	__class__: cocktail.core.resource.ImageLoader
});
cocktail.core.resource.ResourceManager = $hxClasses["cocktail.core.resource.ResourceManager"] = function() {
};
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
cocktail.core.resource.XMLHTTPRequest = $hxClasses["cocktail.core.resource.XMLHTTPRequest"] = function() {
	cocktail.core.event.EventTarget.call(this);
	this._http = new haxe.Http("");
	this._http.onData = this.onHTTPData.$bind(this);
	this._http.onStatus = this.onHTTPStatus.$bind(this);
	this._http.onError = this.onHTTPError.$bind(this);
	this.setReadyState(0);
};
cocktail.core.resource.XMLHTTPRequest.__name__ = ["cocktail","core","resource","XMLHTTPRequest"];
cocktail.core.resource.XMLHTTPRequest.__super__ = cocktail.core.event.EventTarget;
cocktail.core.resource.XMLHTTPRequest.prototype = $extend(cocktail.core.event.EventTarget.prototype,{
	_readyState: null
	,readyState: null
	,_responseText: null
	,responseText: null
	,_status: null
	,status: null
	,onReadyStateChange: null
	,_http: null
	,_method: null
	,open: function(method,url) {
		this._http.url = url;
		this._method = method;
		this.setReadyState(1);
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
	,setRequestHeader: function(name,value) {
		this._http.setHeader(name,value);
	}
	,onHTTPStatus: function(status) {
		this._status = status;
	}
	,onHTTPData: function(data) {
		this._responseText = data;
		this.setReadyState(4);
	}
	,onHTTPError: function(data) {
		this._responseText = data;
		this.setReadyState(4);
	}
	,setReadyState: function(value) {
		this._readyState = value;
		if(this.onReadyStateChange != null) {
			var readyStateChangeEvent = new cocktail.core.event.Event();
			readyStateChangeEvent.initEvent("readystatechange",false,false);
			this.onReadyStateChange(readyStateChangeEvent);
		}
	}
	,get_readyState: function() {
		return this._readyState;
	}
	,get_status: function() {
		return this._status;
	}
	,get_responseText: function() {
		return this._responseText;
	}
	,__class__: cocktail.core.resource.XMLHTTPRequest
	,__properties__: {get_status:"get_status",get_responseText:"get_responseText",get_readyState:"get_readyState"}
});
if(!cocktail.core.style) cocktail.core.style = {}
cocktail.core.style.CSSConstants = $hxClasses["cocktail.core.style.CSSConstants"] = function() {
};
cocktail.core.style.CSSConstants.__name__ = ["cocktail","core","style","CSSConstants"];
cocktail.core.style.CSSConstants.prototype = {
	__class__: cocktail.core.style.CSSConstants
}
cocktail.core.style.ComputedStyle = $hxClasses["cocktail.core.style.ComputedStyle"] = function(coreStyle) {
	this._coreStyle = coreStyle;
};
cocktail.core.style.ComputedStyle.__name__ = ["cocktail","core","style","ComputedStyle"];
cocktail.core.style.ComputedStyle.prototype = {
	display: null
	,position: null
	,cssFloat: null
	,clear: null
	,zIndex: null
	,transformOrigin: null
	,transform: null
	,marginLeft: null
	,marginRight: null
	,marginTop: null
	,marginBottom: null
	,paddingLeft: null
	,paddingRight: null
	,paddingTop: null
	,paddingBottom: null
	,width: null
	,height: null
	,minHeight: null
	,maxHeight: null
	,minWidth: null
	,maxWidth: null
	,top: null
	,left: null
	,bottom: null
	,right: null
	,backgroundColor: null
	,backgroundImage: null
	,backgroundRepeat: null
	,backgroundOrigin: null
	,backgroundSize: null
	,backgroundPosition: null
	,backgroundClip: null
	,fontSize: null
	,fontWeight: null
	,fontStyle: null
	,fontFamily: null
	,fontVariant: null
	,color: null
	,lineHeight: null
	,textTransform: null
	,letterSpacing: null
	,wordSpacing: null
	,whiteSpace: null
	,textAlign: null
	,textIndent: null
	,verticalAlign: null
	,opacity: null
	,visibility: null
	,overflowX: null
	,overflowY: null
	,cursor: null
	,transitionProperty: null
	,transitionDuration: null
	,transitionDelay: null
	,transitionTimingFunction: null
	,_coreStyle: null
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
	,getTransitionablePropertyValue: function(propertyName,propertyValue) {
		var transition = cocktail.core.style.transition.TransitionManager.getInstance().getTransition(propertyName,this);
		if(transition != null) return transition.get_currentValue(); else return propertyValue;
	}
	,constrainWidth: function(style,computedWidth) {
		var computedStyle = style.computedStyle;
		if(style.maxWidth != cocktail.core.style.ConstrainedDimension.none) {
			if(computedWidth > computedStyle.getMaxWidth()) computedWidth = computedStyle.getMaxWidth();
		}
		if(computedWidth < computedStyle.getMinWidth()) computedWidth = computedStyle.getMinWidth();
		return computedWidth;
	}
	,constrainHeight: function(style,computedHeight) {
		var computedStyle = style.computedStyle;
		if(style.maxHeight != cocktail.core.style.ConstrainedDimension.none) {
			if(computedHeight > computedStyle.getMaxHeight()) computedHeight = computedStyle.getMaxHeight();
		}
		if(computedHeight < computedStyle.getMinHeight()) computedHeight = computedStyle.getMinHeight();
		return computedHeight;
	}
	,set_width: function(value) {
		this.width = this.constrainWidth(this._coreStyle,value);
		return value;
	}
	,set_height: function(value) {
		this.height = this.constrainHeight(this._coreStyle,value);
		return value;
	}
	,set_marginLeft: function(value) {
		return this.marginLeft = value;
	}
	,set_marginTop: function(value) {
		return this.marginTop = value;
	}
	,set_marginBottom: function(value) {
		return this.marginBottom = value;
	}
	,set_marginRight: function(value) {
		return this.marginRight = value;
	}
	,set_paddingTop: function(value) {
		return this.paddingTop = value;
	}
	,set_paddingBottom: function(value) {
		return this.paddingBottom = value;
	}
	,set_paddingLeft: function(value) {
		return this.paddingLeft = value;
	}
	,set_paddingRight: function(value) {
		return this.paddingRight = value;
	}
	,set_minHeight: function(value) {
		return this.minHeight = value;
	}
	,set_minWidth: function(value) {
		return this.minWidth = value;
	}
	,set_maxHeight: function(value) {
		return this.maxHeight = value;
	}
	,set_maxWidth: function(value) {
		return this.maxWidth = value;
	}
	,set_top: function(value) {
		return this.top = value;
	}
	,set_bottom: function(value) {
		return this.bottom = value;
	}
	,set_left: function(value) {
		return this.left = value;
	}
	,set_right: function(value) {
		return this.right = value;
	}
	,set_fontSize: function(value) {
		return this.fontSize = value;
	}
	,set_lineHeight: function(value) {
		return this.lineHeight = value;
	}
	,set_letterSpacing: function(value) {
		return this.letterSpacing = value;
	}
	,set_wordSpacing: function(value) {
		return this.wordSpacing = value;
	}
	,set_textIndent: function(value) {
		return this.textIndent = value;
	}
	,set_opacity: function(value) {
		return this.opacity = value;
	}
	,getOpacity: function() {
		return this.getTransitionablePropertyValue("opacity",this.opacity);
	}
	,getMarginLeft: function() {
		return this.getTransitionablePropertyValue("margin-left",this.marginLeft);
	}
	,getMarginRight: function() {
		return this.getTransitionablePropertyValue("margin-right",this.marginRight);
	}
	,getMarginTop: function() {
		return this.getTransitionablePropertyValue("margin-top",this.marginTop);
	}
	,getMarginBottom: function() {
		return this.getTransitionablePropertyValue("margin-bottom",this.marginBottom);
	}
	,getPaddingLeft: function() {
		return this.getTransitionablePropertyValue("padding-left",this.paddingLeft);
	}
	,getPaddingRight: function() {
		return this.getTransitionablePropertyValue("padding-right",this.paddingRight);
	}
	,getPaddingTop: function() {
		return this.getTransitionablePropertyValue("padding-top",this.paddingTop);
	}
	,getPaddingBottom: function() {
		return this.getTransitionablePropertyValue("padding-bottom",this.paddingBottom);
	}
	,getWidth: function() {
		return this.getTransitionablePropertyValue("width",this.width);
	}
	,getHeight: function() {
		return this.getTransitionablePropertyValue("height",this.height);
	}
	,getMinHeight: function() {
		return this.getTransitionablePropertyValue("min-height",this.minHeight);
	}
	,getMaxHeight: function() {
		return this.getTransitionablePropertyValue("max-height",this.maxHeight);
	}
	,getMinWidth: function() {
		return this.getTransitionablePropertyValue("min-width",this.minWidth);
	}
	,getMaxWidth: function() {
		return this.getTransitionablePropertyValue("max-width",this.maxWidth);
	}
	,getTop: function() {
		return this.getTransitionablePropertyValue("top",this.top);
	}
	,getLeft: function() {
		return this.getTransitionablePropertyValue("left",this.left);
	}
	,getBottom: function() {
		return this.getTransitionablePropertyValue("bottom",this.bottom);
	}
	,getRight: function() {
		return this.getTransitionablePropertyValue("right",this.right);
	}
	,getFontSize: function() {
		return this.getTransitionablePropertyValue("font-size",this.fontSize);
	}
	,getLetterSpacing: function() {
		return this.getTransitionablePropertyValue("letter-spacing",this.letterSpacing);
	}
	,getWordSpacing: function() {
		return this.getTransitionablePropertyValue("word-spacing",this.wordSpacing);
	}
	,getLineHeight: function() {
		return this.getTransitionablePropertyValue("line-height",this.lineHeight);
	}
	,getTextIndent: function() {
		return this.getTransitionablePropertyValue("text-indent",this.textIndent);
	}
	,__class__: cocktail.core.style.ComputedStyle
	,__properties__: {set_opacity:"set_opacity",get_opacity:"getOpacity",set_textIndent:"set_textIndent",get_textIndent:"getTextIndent",set_wordSpacing:"set_wordSpacing",get_wordSpacing:"getWordSpacing",set_letterSpacing:"set_letterSpacing",get_letterSpacing:"getLetterSpacing",set_lineHeight:"set_lineHeight",get_lineHeight:"getLineHeight",set_fontSize:"set_fontSize",get_fontSize:"getFontSize",set_right:"set_right",get_right:"getRight",set_bottom:"set_bottom",get_bottom:"getBottom",set_left:"set_left",get_left:"getLeft",set_top:"set_top",get_top:"getTop",set_maxWidth:"set_maxWidth",get_maxWidth:"getMaxWidth",set_minWidth:"set_minWidth",get_minWidth:"getMinWidth",set_maxHeight:"set_maxHeight",get_maxHeight:"getMaxHeight",set_minHeight:"set_minHeight",get_minHeight:"getMinHeight",set_height:"set_height",get_height:"getHeight",set_width:"set_width",get_width:"getWidth",set_paddingBottom:"set_paddingBottom",get_paddingBottom:"getPaddingBottom",set_paddingTop:"set_paddingTop",get_paddingTop:"getPaddingTop",set_paddingRight:"set_paddingRight",get_paddingRight:"getPaddingRight",set_paddingLeft:"set_paddingLeft",get_paddingLeft:"getPaddingLeft",set_marginBottom:"set_marginBottom",get_marginBottom:"getMarginBottom",set_marginTop:"set_marginTop",get_marginTop:"getMarginTop",set_marginRight:"set_marginRight",get_marginRight:"getMarginRight",set_marginLeft:"set_marginLeft",get_marginLeft:"getMarginLeft"}
}
cocktail.core.style.CoreStyle = $hxClasses["cocktail.core.style.CoreStyle"] = function(htmlElement) {
	this.htmlElement = htmlElement;
	this.initDefaultStyleValues(htmlElement.tagName);
};
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
	display: null
	,position: null
	,cssFloat: null
	,clear: null
	,zIndex: null
	,marginLeft: null
	,marginRight: null
	,marginTop: null
	,marginBottom: null
	,paddingLeft: null
	,paddingRight: null
	,paddingTop: null
	,paddingBottom: null
	,width: null
	,height: null
	,minHeight: null
	,maxHeight: null
	,minWidth: null
	,maxWidth: null
	,top: null
	,left: null
	,bottom: null
	,right: null
	,backgroundColor: null
	,backgroundImage: null
	,backgroundRepeat: null
	,backgroundOrigin: null
	,backgroundSize: null
	,backgroundPosition: null
	,backgroundClip: null
	,fontSize: null
	,fontWeight: null
	,fontStyle: null
	,fontFamily: null
	,fontVariant: null
	,color: null
	,lineHeight: null
	,textTransform: null
	,letterSpacing: null
	,wordSpacing: null
	,whiteSpace: null
	,textAlign: null
	,textIndent: null
	,verticalAlign: null
	,opacity: null
	,visibility: null
	,overflowX: null
	,overflowY: null
	,transformOrigin: null
	,transform: null
	,cursor: null
	,transitionProperty: null
	,transitionDuration: null
	,transitionDelay: null
	,transitionTimingFunction: null
	,computedStyle: null
	,fontMetrics: null
	,htmlElement: null
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
	,initComputedStyles: function() {
		this.computedStyle.init();
	}
	,applyDefaultHTMLStyles: function(tagName) {
		switch(tagName.toLowerCase()) {
		case "html":case "adress":case "dd":case "div":case "dl":case "dt":case "fieldset":case "form":case "frame":case "frameset":case "noframes":case "ol":case "center":case "dir":case "hr":case "menu":
			this.setDisplay(cocktail.core.style.Display.block);
			break;
		case "li":
			this.setDisplay(cocktail.core.style.Display.block);
			break;
		case "a":
			this.setCursor(cocktail.core.style.Cursor.pointer);
			break;
		case "ul":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(1.12))));
			this.setMarginLeft(cocktail.core.style.Margin.length(cocktail.core.unit.Length.px(40)));
			break;
		case "head":
			this.setDisplay(cocktail.core.style.Display.none);
			break;
		case "body":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setMarginLeft(this.setMarginRight(this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.px(8))))));
			break;
		case "h1":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(2)));
			this.setFontWeight(cocktail.core.style.FontWeight.bolder);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(0.67))));
			break;
		case "h2":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(1.5)));
			this.setFontWeight(cocktail.core.style.FontWeight.bolder);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(0.75))));
			break;
		case "h3":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(1.17)));
			this.setFontWeight(cocktail.core.style.FontWeight.bolder);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(0.83))));
			break;
		case "h4":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setFontWeight(cocktail.core.style.FontWeight.bolder);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(1.12))));
			break;
		case "h5":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(0.83)));
			this.setFontWeight(cocktail.core.style.FontWeight.bolder);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(1.5))));
			break;
		case "h6":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(0.75)));
			this.setFontWeight(cocktail.core.style.FontWeight.bolder);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(1.67))));
			break;
		case "p":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(1))));
			break;
		case "pre":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setWhiteSpace(cocktail.core.style.WhiteSpace.pre);
			this.setFontFamily(["monospace"]);
			break;
		case "code":
			this.setFontFamily(["monospace"]);
			break;
		case "i":case "cite":case "em":case "var":
			this.setFontStyle(cocktail.core.style.FontStyle.italic);
			break;
		case "input":
			this.setDisplay(cocktail.core.style.Display.inlineBlock);
			break;
		case "blockquote":
			this.setDisplay(cocktail.core.style.Display.block);
			this.setMarginTop(this.setMarginBottom(cocktail.core.style.Margin.length(cocktail.core.unit.Length.em(1.12))));
			this.setMarginLeft(this.setMarginRight(cocktail.core.style.Margin.length(cocktail.core.unit.Length.px(40))));
			break;
		case "strong":
			this.setFontWeight(cocktail.core.style.FontWeight.bolder);
			break;
		case "big":
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(1.17)));
			break;
		case "small":
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(0.83)));
			break;
		case "sub":
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(0.83)));
			this.setVerticalAlign(cocktail.core.style.VerticalAlign.sub);
			break;
		case "sup":
			this.setFontSize(cocktail.core.style.FontSize.length(cocktail.core.unit.Length.em(0.83)));
			this.setVerticalAlign(cocktail.core.style.VerticalAlign.cssSuper);
			break;
		}
	}
	,computeDisplayStyles: function() {
		cocktail.core.style.computer.DisplayStylesComputer.compute(this);
	}
	,computeBackgroundStyles: function() {
		cocktail.core.style.computer.BackgroundStylesComputer.compute(this);
	}
	,computeVisualEffectStyles: function() {
		cocktail.core.style.computer.VisualEffectStylesComputer.compute(this);
	}
	,computeTextAndFontStyles: function(containingBlockData,containingBlockFontMetricsData) {
		cocktail.core.style.computer.FontAndTextStylesComputer.compute(this,containingBlockData,containingBlockFontMetricsData);
	}
	,computeBoxModelStyles: function(containingBlockDimensions,isReplaced) {
		var boxComputer = this.getBoxStylesComputer(isReplaced);
		boxComputer.measure(this,containingBlockDimensions);
	}
	,computeTransitionStyles: function() {
		cocktail.core.style.computer.TransitionStylesComputer.compute(this);
	}
	,getBoxStylesComputer: function(isReplaced) {
		if(isReplaced == true) return this.getReplacedBoxStylesComputer(); else return this.getFlowBoxStylesComputer();
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
	,invalidate: function(invalidationReason) {
		this.htmlElement.invalidate(invalidationReason);
	}
	,invalidatePositioningScheme: function() {
		this.htmlElement.invalidatePositioningScheme();
	}
	,startTransitionIfNeeded: function(propertyName,invalidationReason) {
		var propertyIndex = 0;
		var $e = (this.computedStyle.transitionProperty);
		switch( $e[1] ) {
		case 0:
			return;
		case 2:
			var value = $e[2];
			var foundFlag = false;
			var _g1 = 0, _g = value.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(value[i] == propertyName) {
					propertyIndex = i;
					foundFlag = true;
					break;
				}
			}
			if(foundFlag == false) return;
			break;
		case 1:
			break;
		}
		if(this.computedStyle.transitionDelay.length == 0 || this.computedStyle.transitionDuration.length == 0) return;
		var combinedDuration = 0.0;
		var transitionDelay = this.computedStyle.transitionDelay[this.getRepeatedIndex(propertyIndex,this.computedStyle.transitionDelay.length)];
		var transitionDuration = this.computedStyle.transitionDuration[this.getRepeatedIndex(propertyIndex,this.computedStyle.transitionDuration.length)];
		combinedDuration = transitionDuration + transitionDelay;
		if(combinedDuration <= 0) return;
		var transitionTimingFunction = this.computedStyle.transitionTimingFunction[this.getRepeatedIndex(propertyIndex,this.computedStyle.transitionTimingFunction.length)];
		var transition = cocktail.core.style.transition.TransitionManager.getInstance().getTransition(propertyName,this.computedStyle);
		if(transition != null) cocktail.core.style.transition.TransitionManager.getInstance().stopTransition(transition);
		var startValue = Reflect.getProperty(this.computedStyle,propertyName);
		this.invalidate(cocktail.core.renderer.InvalidationReason.needsImmediateLayout);
		var endValue = Reflect.getProperty(this.computedStyle,propertyName);
		cocktail.core.style.transition.TransitionManager.getInstance().startTransition(this.computedStyle,propertyName,startValue,endValue,transitionDuration,transitionDelay,transitionTimingFunction,this.onTransitionComplete.$bind(this),this.onTransitionUpdate.$bind(this),invalidationReason);
	}
	,getRepeatedIndex: function(index,length) {
		if(index < length) return index;
		return length % index;
	}
	,onTransitionComplete: function(transition) {
		this.invalidate(transition.invalidationReason);
		var transitionEvent = new cocktail.core.event.TransitionEvent();
		transitionEvent.initTransitionEvent("transitionend",true,true,transition.propertyName,transition.transitionDuration,"");
		this.htmlElement.dispatchEvent(transitionEvent);
	}
	,onTransitionUpdate: function(transition) {
		this.invalidate(transition.invalidationReason);
	}
	,get_fontMetricsData: function() {
		var fontManager = new cocktail.port.server.FontManager();
		this.fontMetrics = fontManager.getFontMetrics(cocktail.core.unit.UnitManager.getCSSFontFamily(this.computedStyle.fontFamily),this.computedStyle.getFontSize());
		return this.fontMetrics;
	}
	,setWidth: function(value) {
		this.width = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("width");
		this.startTransitionIfNeeded("width",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setMarginLeft: function(value) {
		this.marginLeft = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("margin-left");
		this.startTransitionIfNeeded("margin-left",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setMarginRight: function(value) {
		this.marginRight = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("margin-right");
		this.startTransitionIfNeeded("margin-right",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setMarginTop: function(value) {
		this.marginTop = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("margin-top");
		this.startTransitionIfNeeded("margin-top",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setMarginBottom: function(value) {
		this.marginBottom = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("margin-bottom");
		this.startTransitionIfNeeded("margin-bottom",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setPaddingLeft: function(value) {
		this.paddingLeft = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("padding-left");
		this.startTransitionIfNeeded("padding-left",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setPaddingRight: function(value) {
		this.paddingRight = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("padding-right");
		this.startTransitionIfNeeded("padding-right",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setPaddingTop: function(value) {
		this.paddingTop = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("padding-top");
		this.startTransitionIfNeeded("padding-top",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setPaddingBottom: function(value) {
		this.paddingBottom = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("padding-bottom");
		this.startTransitionIfNeeded("padding-bottom",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setDisplay: function(value) {
		this.display = value;
		this.invalidatePositioningScheme();
		return value;
	}
	,setPosition: function(value) {
		this.position = value;
		this.computedStyle.position = value;
		this.invalidatePositioningScheme();
		return value;
	}
	,setHeight: function(value) {
		this.height = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("height");
		this.startTransitionIfNeeded("height",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setMinHeight: function(value) {
		this.minHeight = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("min-height");
		this.startTransitionIfNeeded("min-height",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setMaxHeight: function(value) {
		this.maxHeight = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("max-height");
		this.startTransitionIfNeeded("max-height",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setMinWidth: function(value) {
		this.minWidth = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("min-width");
		this.startTransitionIfNeeded("min-width",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setMaxWidth: function(value) {
		this.maxWidth = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("max-width");
		this.startTransitionIfNeeded("max-width",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setTop: function(value) {
		this.top = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("top");
		this.startTransitionIfNeeded("top",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setLeft: function(value) {
		this.left = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("left");
		this.startTransitionIfNeeded("left",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setBottom: function(value) {
		this.bottom = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("bottom");
		this.startTransitionIfNeeded("bottom",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setRight: function(value) {
		this.right = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("right");
		this.startTransitionIfNeeded("right",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setCSSFloat: function(value) {
		this.cssFloat = value;
		this.invalidatePositioningScheme();
		return value;
	}
	,setClear: function(value) {
		this.clear = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("clear"));
		return value;
	}
	,setZIndex: function(value) {
		this.zIndex = value;
		this.computedStyle.zIndex = value;
		this.invalidatePositioningScheme();
		return value;
	}
	,setFontSize: function(value) {
		this.fontSize = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("font-size");
		this.startTransitionIfNeeded("font-size",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setFontWeight: function(value) {
		this.fontWeight = value;
		this.computedStyle.fontWeight = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("font-weight"));
		return value;
	}
	,setFontStyle: function(value) {
		this.fontStyle = value;
		this.computedStyle.fontStyle = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("font-style"));
		return value;
	}
	,setFontFamily: function(value) {
		this.fontFamily = value;
		this.computedStyle.fontFamily = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("font-family"));
		return value;
	}
	,setFontVariant: function(value) {
		this.fontVariant = value;
		this.computedStyle.fontVariant = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("font-variant"));
		return value;
	}
	,setTextTransform: function(value) {
		this.textTransform = value;
		this.computedStyle.textTransform = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("text-tranform"));
		return value;
	}
	,setLetterSpacing: function(value) {
		this.letterSpacing = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("letter-spacing");
		this.startTransitionIfNeeded("letter-spacing",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setWordSpacing: function(value) {
		this.wordSpacing = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("word-spacing");
		this.startTransitionIfNeeded("word-spacing",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setLineHeight: function(value) {
		this.lineHeight = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("line-height");
		this.startTransitionIfNeeded("line-height",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setColor: function(value) {
		this.color = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("color"));
		return value;
	}
	,setVerticalAlign: function(value) {
		this.verticalAlign = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("vertical-align");
		this.startTransitionIfNeeded("vertical-align",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setTextIndent: function(value) {
		this.textIndent = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("text-indent");
		this.startTransitionIfNeeded("text-indent",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setWhiteSpace: function(value) {
		this.whiteSpace = value;
		this.computedStyle.whiteSpace = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("white-space"));
		return value;
	}
	,setTextAlign: function(value) {
		this.textAlign = value;
		this.computedStyle.textAlign = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("text-align"));
		return value;
	}
	,setOpacity: function(value) {
		this.opacity = value;
		var invalidationReason = cocktail.core.renderer.InvalidationReason.styleChanged("opacity");
		this.startTransitionIfNeeded("opacity",invalidationReason);
		this.invalidate(invalidationReason);
		return value;
	}
	,setVisibility: function(value) {
		this.visibility = value;
		this.computedStyle.visibility = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("visibility"));
		return value;
	}
	,setTransformOrigin: function(value) {
		this.transformOrigin = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.other);
		return value;
	}
	,setTransform: function(value) {
		this.transform = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.other);
		return value;
	}
	,setOverflowX: function(value) {
		this.overflowX = value;
		this.computedStyle.overflowX = value;
		this.invalidatePositioningScheme();
		return value;
	}
	,setOverflowY: function(value) {
		this.overflowY = value;
		this.computedStyle.overflowY = value;
		this.invalidatePositioningScheme();
		return value;
	}
	,setTransitionProperty: function(value) {
		this.transitionProperty = value;
		this.computedStyle.transitionProperty = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("transition-property"));
		return value;
	}
	,setTransitionDuration: function(value) {
		this.transitionDuration = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("transition-duration"));
		return value;
	}
	,setTransitionDelay: function(value) {
		this.transitionDelay = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("transition-delay"));
		return value;
	}
	,setTransitionTimingFunction: function(value) {
		this.transitionTimingFunction = value;
		this.computedStyle.transitionTimingFunction = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("transition-timing-function"));
		return value;
	}
	,setBackgroundColor: function(value) {
		this.backgroundColor = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("background-color"));
		return value;
	}
	,setBackgroundImage: function(value) {
		this.backgroundImage = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("background-image"));
		return value;
	}
	,setBackgroundSize: function(value) {
		this.backgroundSize = value;
		this.computedStyle.backgroundSize = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("background-size"));
		return value;
	}
	,setBackgroundClip: function(value) {
		this.backgroundClip = value;
		this.computedStyle.backgroundClip = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("background-clip"));
		return value;
	}
	,setBackgroundPosition: function(value) {
		this.backgroundPosition = value;
		this.computedStyle.backgroundPosition = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("background-position"));
		return value;
	}
	,setBackgroundRepeat: function(value) {
		this.backgroundRepeat = value;
		this.computedStyle.backgroundRepeat = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("background-repeat"));
		return value;
	}
	,setBackgroundOrigin: function(value) {
		this.backgroundOrigin = value;
		this.computedStyle.backgroundOrigin = value;
		this.invalidate(cocktail.core.renderer.InvalidationReason.styleChanged("background-origin"));
		return value;
	}
	,setCursor: function(value) {
		this.cursor = value;
		this.computedStyle.cursor = value;
		return value;
	}
	,__class__: cocktail.core.style.CoreStyle
	,__properties__: {get_fontMetrics:"get_fontMetricsData",set_transitionTimingFunction:"setTransitionTimingFunction",set_transitionDelay:"setTransitionDelay",set_transitionDuration:"setTransitionDuration",set_transitionProperty:"setTransitionProperty",set_cursor:"setCursor",set_transform:"setTransform",set_transformOrigin:"setTransformOrigin",set_overflowY:"setOverflowY",set_overflowX:"setOverflowX",set_visibility:"setVisibility",set_opacity:"setOpacity",set_verticalAlign:"setVerticalAlign",set_textIndent:"setTextIndent",set_textAlign:"setTextAlign",set_whiteSpace:"setWhiteSpace",set_wordSpacing:"setWordSpacing",set_letterSpacing:"setLetterSpacing",set_textTransform:"setTextTransform",set_lineHeight:"setLineHeight",set_color:"setColor",set_fontVariant:"setFontVariant",set_fontFamily:"setFontFamily",set_fontStyle:"setFontStyle",set_fontWeight:"setFontWeight",set_fontSize:"setFontSize",set_backgroundClip:"setBackgroundClip",set_backgroundPosition:"setBackgroundPosition",set_backgroundSize:"setBackgroundSize",set_backgroundOrigin:"setBackgroundOrigin",set_backgroundRepeat:"setBackgroundRepeat",set_backgroundImage:"setBackgroundImage",set_backgroundColor:"setBackgroundColor",set_right:"setRight",set_bottom:"setBottom",set_left:"setLeft",set_top:"setTop",set_maxWidth:"setMaxWidth",set_minWidth:"setMinWidth",set_maxHeight:"setMaxHeight",set_minHeight:"setMinHeight",set_height:"setHeight",set_width:"setWidth",set_paddingBottom:"setPaddingBottom",set_paddingTop:"setPaddingTop",set_paddingRight:"setPaddingRight",set_paddingLeft:"setPaddingLeft",set_marginBottom:"setMarginBottom",set_marginTop:"setMarginTop",set_marginRight:"setMarginRight",set_marginLeft:"setMarginLeft",set_zIndex:"setZIndex",set_clear:"setClear",set_cssFloat:"setCSSFloat",set_position:"setPosition",set_display:"setDisplay"}
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
if(!cocktail.core.style.adapter) cocktail.core.style.adapter = {}
cocktail.core.style.adapter.Style = $hxClasses["cocktail.core.style.adapter.Style"] = function(coreStyle) {
	this._coreStyle = coreStyle;
	this.attributes = new cocktail.core.dom.NamedNodeMap();
};
cocktail.core.style.adapter.Style.__name__ = ["cocktail","core","style","adapter","Style"];
cocktail.core.style.adapter.Style.prototype = {
	display: null
	,position: null
	,cssFloat: null
	,clear: null
	,zIndex: null
	,marginLeft: null
	,marginRight: null
	,marginTop: null
	,marginBottom: null
	,paddingLeft: null
	,paddingRight: null
	,paddingTop: null
	,paddingBottom: null
	,width: null
	,height: null
	,minHeight: null
	,maxHeight: null
	,minWidth: null
	,maxWidth: null
	,top: null
	,left: null
	,bottom: null
	,right: null
	,backgroundColor: null
	,backgroundImage: null
	,backgroundRepeat: null
	,backgroundOrigin: null
	,backgroundSize: null
	,backgroundPosition: null
	,backgroundClip: null
	,fontSize: null
	,fontWeight: null
	,fontStyle: null
	,fontFamily: null
	,fontVariant: null
	,color: null
	,lineHeight: null
	,textTransform: null
	,letterSpacing: null
	,wordSpacing: null
	,whiteSpace: null
	,textAlign: null
	,textIndent: null
	,verticalAlign: null
	,opacity: null
	,visibility: null
	,overflowX: null
	,overflowY: null
	,transitionProperty: null
	,transitionDuration: null
	,transitionTimingFunction: null
	,transitionDelay: null
	,cursor: null
	,_coreStyle: null
	,attributes: null
	,setAttribute: function(name,value) {
		if(value == null) {
			this.attributes.removeNamedItem(name);
			return;
		}
		var attr = new cocktail.core.dom.Attr(name);
		attr.set_value(value);
		this.attributes.setNamedItem(attr);
	}
	,get_opacity: function() {
		return cocktail.core.unit.UnitManager.getCSSOpacity(this._coreStyle.opacity);
	}
	,set_opacity: function(value) {
		this.setAttribute("opacity",value);
		this._coreStyle.setOpacity(Std.parseFloat(value));
		return value;
	}
	,get_visibility: function() {
		return cocktail.core.unit.UnitManager.getCSSVisibility(this._coreStyle.visibility);
	}
	,set_visibility: function(value) {
		this.setAttribute("visibility",value);
		this._coreStyle.setVisibility(cocktail.core.unit.UnitManager.visibilityEnum(value));
		return value;
	}
	,get_marginLeft: function() {
		return cocktail.core.unit.UnitManager.getCSSMargin(this._coreStyle.marginLeft);
	}
	,set_marginLeft: function(value) {
		this.setAttribute("margin-left",value);
		this._coreStyle.setMarginLeft(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Margin,value));
		return value;
	}
	,get_marginRight: function() {
		return cocktail.core.unit.UnitManager.getCSSMargin(this._coreStyle.marginRight);
	}
	,set_marginRight: function(value) {
		this.setAttribute("margin-right",value);
		this._coreStyle.setMarginRight(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Margin,value));
		return value;
	}
	,get_marginTop: function() {
		return cocktail.core.unit.UnitManager.getCSSMargin(this._coreStyle.marginTop);
	}
	,set_marginTop: function(value) {
		this.setAttribute("margin-top",value);
		this._coreStyle.setMarginTop(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Margin,value));
		return value;
	}
	,get_marginBottom: function() {
		return cocktail.core.unit.UnitManager.getCSSMargin(this._coreStyle.marginBottom);
	}
	,set_marginBottom: function(value) {
		this.setAttribute("margin-bottom",value);
		this._coreStyle.setMarginBottom(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Margin,value));
		return value;
	}
	,get_paddingLeft: function() {
		return cocktail.core.unit.UnitManager.getCSSPadding(this._coreStyle.paddingLeft);
	}
	,set_paddingLeft: function(value) {
		this.setAttribute("padding-left",value);
		this._coreStyle.setPaddingLeft(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Padding,value));
		return value;
	}
	,get_paddingRight: function() {
		return cocktail.core.unit.UnitManager.getCSSPadding(this._coreStyle.paddingRight);
	}
	,set_paddingRight: function(value) {
		this.setAttribute("padding-right",value);
		this._coreStyle.setPaddingRight(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Padding,value));
		return value;
	}
	,get_paddingTop: function() {
		return cocktail.core.unit.UnitManager.getCSSPadding(this._coreStyle.paddingTop);
	}
	,set_paddingTop: function(value) {
		this.setAttribute("padding-top",value);
		this._coreStyle.setPaddingTop(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Padding,value));
		return value;
	}
	,get_paddingBottom: function() {
		return cocktail.core.unit.UnitManager.getCSSPadding(this._coreStyle.paddingBottom);
	}
	,set_paddingBottom: function(value) {
		this.setAttribute("padding-bottom",value);
		this._coreStyle.setPaddingBottom(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Padding,value));
		return value;
	}
	,get_display: function() {
		return cocktail.core.unit.UnitManager.getCSSDisplay(this._coreStyle.display);
	}
	,set_display: function(value) {
		this.setAttribute("display",value);
		this._coreStyle.setDisplay(cocktail.core.unit.UnitManager.displayEnum(value));
		return value;
	}
	,get_position: function() {
		return cocktail.core.unit.UnitManager.getCSSPosition(this._coreStyle.position);
	}
	,set_position: function(value) {
		this.setAttribute("position",value);
		this._coreStyle.setPosition(cocktail.core.unit.UnitManager.positionEnum(value));
		return value;
	}
	,get_zIndex: function() {
		return cocktail.core.unit.UnitManager.getCSSZIndex(this._coreStyle.zIndex);
	}
	,set_zIndex: function(value) {
		this.setAttribute("z-index",value);
		this._coreStyle.setZIndex(cocktail.core.unit.UnitManager.zIndexEnum(value));
		return value;
	}
	,get_width: function() {
		return cocktail.core.unit.UnitManager.getCSSDimension(this._coreStyle.width);
	}
	,set_width: function(value) {
		this.setAttribute("width",value);
		this._coreStyle.setWidth(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Dimension,value));
		return value;
	}
	,get_height: function() {
		return cocktail.core.unit.UnitManager.getCSSDimension(this._coreStyle.height);
	}
	,set_height: function(value) {
		this.setAttribute("height",value);
		this._coreStyle.setHeight(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.Dimension,value));
		return value;
	}
	,get_minHeight: function() {
		return cocktail.core.unit.UnitManager.getCSSConstrainedDimension(this._coreStyle.minHeight);
	}
	,set_minHeight: function(value) {
		this.setAttribute("min-height",value);
		this._coreStyle.setMinHeight(cocktail.core.unit.UnitManager.constrainedDimensionEnum(value));
		return value;
	}
	,get_maxHeight: function() {
		return cocktail.core.unit.UnitManager.getCSSConstrainedDimension(this._coreStyle.maxHeight);
	}
	,set_maxHeight: function(value) {
		this.setAttribute("max-height",value);
		this._coreStyle.setMaxHeight(cocktail.core.unit.UnitManager.constrainedDimensionEnum(value));
		return value;
	}
	,get_minWidth: function() {
		return cocktail.core.unit.UnitManager.getCSSConstrainedDimension(this._coreStyle.minWidth);
	}
	,set_minWidth: function(value) {
		this.setAttribute("min-width",value);
		this._coreStyle.setMinWidth(cocktail.core.unit.UnitManager.constrainedDimensionEnum(value));
		return value;
	}
	,get_maxWidth: function() {
		return cocktail.core.unit.UnitManager.getCSSConstrainedDimension(this._coreStyle.maxWidth);
	}
	,set_maxWidth: function(value) {
		this.setAttribute("max-width",value);
		this._coreStyle.setMaxWidth(cocktail.core.unit.UnitManager.constrainedDimensionEnum(value));
		return value;
	}
	,get_top: function() {
		return cocktail.core.unit.UnitManager.getCSSPositionOffset(this._coreStyle.top);
	}
	,set_top: function(value) {
		this.setAttribute("top",value);
		this._coreStyle.setTop(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.PositionOffset,value));
		return value;
	}
	,get_left: function() {
		return cocktail.core.unit.UnitManager.getCSSPositionOffset(this._coreStyle.left);
	}
	,set_left: function(value) {
		this.setAttribute("left",value);
		this._coreStyle.setLeft(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.PositionOffset,value));
		return value;
	}
	,get_bottom: function() {
		return cocktail.core.unit.UnitManager.getCSSPositionOffset(this._coreStyle.bottom);
	}
	,set_bottom: function(value) {
		this.setAttribute("bottom",value);
		this._coreStyle.setBottom(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.PositionOffset,value));
		return value;
	}
	,get_right: function() {
		return cocktail.core.unit.UnitManager.getCSSPositionOffset(this._coreStyle.right);
	}
	,set_right: function(value) {
		this.setAttribute("right",value);
		this._coreStyle.setRight(cocktail.core.unit.UnitManager.boxStyleEnum(cocktail.core.style.PositionOffset,value));
		return value;
	}
	,get_CSSFloat: function() {
		return cocktail.core.unit.UnitManager.getCSSFloatAsString(this._coreStyle.cssFloat);
	}
	,set_CSSFloat: function(value) {
		this.setAttribute("float",value);
		this._coreStyle.setCSSFloat(cocktail.core.unit.UnitManager.cssFloatEnum(value));
		return value;
	}
	,get_clear: function() {
		return cocktail.core.unit.UnitManager.getCSSClear(this._coreStyle.clear);
	}
	,set_clear: function(value) {
		this.setAttribute("clear",value);
		this._coreStyle.setClear(cocktail.core.unit.UnitManager.clearEnum(value));
		return value;
	}
	,get_fontSize: function() {
		return cocktail.core.unit.UnitManager.getCSSFontSize(this._coreStyle.fontSize);
	}
	,set_fontSize: function(value) {
		this.setAttribute("font-size",value);
		this._coreStyle.setFontSize(cocktail.core.unit.UnitManager.fontSizeEnum(value));
		return value;
	}
	,get_fontWeight: function() {
		return cocktail.core.unit.UnitManager.getCSSFontWeight(this._coreStyle.fontWeight);
	}
	,set_fontWeight: function(value) {
		this.setAttribute("font-weight",value);
		this._coreStyle.setFontWeight(cocktail.core.unit.UnitManager.fontWeightEnum(value));
		return value;
	}
	,get_fontStyle: function() {
		return cocktail.core.unit.UnitManager.getCSSFontStyle(this._coreStyle.fontStyle);
	}
	,set_fontStyle: function(value) {
		this.setAttribute("font-style",value);
		this._coreStyle.setFontStyle(cocktail.core.unit.UnitManager.fontStyleEnum(value));
		return value;
	}
	,get_fontFamily: function() {
		return cocktail.core.unit.UnitManager.getCSSFontFamily(this._coreStyle.fontFamily);
	}
	,set_fontFamily: function(value) {
		this.setAttribute("font-family",value);
		this._coreStyle.setFontFamily(cocktail.core.unit.UnitManager.fontFamilyEnum(value));
		return value;
	}
	,get_fontVariant: function() {
		return cocktail.core.unit.UnitManager.getCSSFontVariant(this._coreStyle.fontVariant);
	}
	,set_fontVariant: function(value) {
		this.setAttribute("font-variant",value);
		this._coreStyle.setFontVariant(cocktail.core.unit.UnitManager.fontVariantEnum(value));
		return value;
	}
	,get_textTransform: function() {
		return cocktail.core.unit.UnitManager.getCSSTextTransform(this._coreStyle.textTransform);
	}
	,set_textTransform: function(value) {
		this.setAttribute("text-tranform",value);
		this._coreStyle.setTextTransform(cocktail.core.unit.UnitManager.textTransformEnum(value));
		return value;
	}
	,get_letterSpacing: function() {
		return cocktail.core.unit.UnitManager.getCSSLetterSpacing(this._coreStyle.letterSpacing);
	}
	,set_letterSpacing: function(value) {
		this.setAttribute("letter-spacing",value);
		this._coreStyle.setLetterSpacing(cocktail.core.unit.UnitManager.letterSpacingEnum(value));
		return value;
	}
	,get_color: function() {
		return cocktail.core.unit.UnitManager.getCSSColor(this._coreStyle.color);
	}
	,set_color: function(value) {
		this.setAttribute("color",value);
		this._coreStyle.setColor(cocktail.core.unit.UnitManager.colorEnum(value));
		return value;
	}
	,get_wordSpacing: function() {
		return cocktail.core.unit.UnitManager.getCSSWordSpacing(this._coreStyle.wordSpacing);
	}
	,set_wordSpacing: function(value) {
		this.setAttribute("word-spacing",value);
		this._coreStyle.setWordSpacing(cocktail.core.unit.UnitManager.wordSpacingEnum(value));
		return value;
	}
	,get_lineHeight: function() {
		return cocktail.core.unit.UnitManager.getCSSLineHeight(this._coreStyle.lineHeight);
	}
	,set_lineHeight: function(value) {
		this.setAttribute("line-height",value);
		this._coreStyle.setLineHeight(cocktail.core.unit.UnitManager.lineHeightEnum(value));
		return value;
	}
	,get_verticalAlign: function() {
		return cocktail.core.unit.UnitManager.getCSSVerticalAlign(this._coreStyle.verticalAlign);
	}
	,set_verticalAlign: function(value) {
		this.setAttribute("vertical-align",value);
		this._coreStyle.setVerticalAlign(cocktail.core.unit.UnitManager.verticalAlignEnum(value));
		return value;
	}
	,get_textIndent: function() {
		return cocktail.core.unit.UnitManager.getCSSTextIndent(this._coreStyle.textIndent);
	}
	,set_textIndent: function(value) {
		this.setAttribute("text-indent",value);
		this._coreStyle.setTextIndent(cocktail.core.unit.UnitManager.textIndentEnum(value));
		return value;
	}
	,get_whiteSpace: function() {
		return cocktail.core.unit.UnitManager.getCSSWhiteSpace(this._coreStyle.whiteSpace);
	}
	,set_whiteSpace: function(value) {
		this.setAttribute("white-space",value);
		this._coreStyle.setWhiteSpace(cocktail.core.unit.UnitManager.whiteSpaceEnum(value));
		return value;
	}
	,get_textAlign: function() {
		return cocktail.core.unit.UnitManager.getCSSTextAlign(this._coreStyle.textAlign);
	}
	,set_textAlign: function(value) {
		this.setAttribute("text-align",value);
		this._coreStyle.setTextAlign(cocktail.core.unit.UnitManager.textAlignEnum(value));
		return value;
	}
	,set_backgroundColor: function(value) {
		this.setAttribute("background-color",value);
		this._coreStyle.setBackgroundColor(cocktail.core.unit.UnitManager.colorEnum(value));
		return value;
	}
	,get_backgroundColor: function() {
		return cocktail.core.unit.UnitManager.getCSSColor(this._coreStyle.backgroundColor);
	}
	,set_backgroundImage: function(value) {
		this.setAttribute("background-image",value);
		this._coreStyle.setBackgroundImage(cocktail.core.unit.UnitManager.backgroundImageEnum(value));
		return value;
	}
	,get_backgroundImage: function() {
		return cocktail.core.unit.UnitManager.getCSSBackgroundImage(this._coreStyle.backgroundImage);
	}
	,set_backgroundRepeat: function(value) {
		this.setAttribute("background-repeat",value);
		this._coreStyle.setBackgroundRepeat(cocktail.core.unit.UnitManager.backgroundRepeatEnum(value));
		return value;
	}
	,get_backgroundRepeat: function() {
		return cocktail.core.unit.UnitManager.getCSSBackgroundRepeat(this._coreStyle.backgroundRepeat);
	}
	,set_backgroundSize: function(value) {
		this.setAttribute("background-size",value);
		this._coreStyle.setBackgroundSize(cocktail.core.unit.UnitManager.backgroundSizeEnum(value));
		return value;
	}
	,get_backgroundSize: function() {
		return cocktail.core.unit.UnitManager.getCSSBackgroundSize(this._coreStyle.backgroundSize);
	}
	,set_backgroundClip: function(value) {
		this.setAttribute("background-clip",value);
		this._coreStyle.setBackgroundClip(cocktail.core.unit.UnitManager.backgroundClipEnum(value));
		return value;
	}
	,get_backgroundClip: function() {
		return cocktail.core.unit.UnitManager.getCSSBackgroundClip(this._coreStyle.backgroundClip);
	}
	,set_backgroundPosition: function(value) {
		this.setAttribute("background-position",value);
		this._coreStyle.setBackgroundPosition(cocktail.core.unit.UnitManager.backgroundPositionEnum(value));
		return value;
	}
	,get_backgroundPosition: function() {
		return cocktail.core.unit.UnitManager.getCSSBackgroundPosition(this._coreStyle.backgroundPosition);
	}
	,set_backgroundOrigin: function(value) {
		this.setAttribute("background-origin",value);
		this._coreStyle.setBackgroundOrigin(cocktail.core.unit.UnitManager.backgroundOriginEnum(value));
		return value;
	}
	,get_backgroundOrigin: function() {
		return cocktail.core.unit.UnitManager.getCSSBackgroundOrigin(this._coreStyle.backgroundOrigin);
	}
	,get_overflowX: function() {
		return cocktail.core.unit.UnitManager.getCSSOverflow(this._coreStyle.overflowX);
	}
	,set_overflowX: function(value) {
		this.setAttribute("overflow-x",value);
		this._coreStyle.setOverflowX(cocktail.core.unit.UnitManager.overflowEnum(value));
		return value;
	}
	,get_overflowY: function() {
		return cocktail.core.unit.UnitManager.getCSSOverflow(this._coreStyle.overflowY);
	}
	,set_overflowY: function(value) {
		this.setAttribute("overflow-y",value);
		this._coreStyle.setOverflowY(cocktail.core.unit.UnitManager.overflowEnum(value));
		return cocktail.core.unit.UnitManager.getCSSOverflow(this._coreStyle.overflowY);
	}
	,set_cursor: function(value) {
		this.setAttribute("cursor",value);
		this._coreStyle.setCursor(cocktail.core.unit.UnitManager.cursorEnum(value));
		return value;
	}
	,get_cursor: function() {
		return cocktail.core.unit.UnitManager.getCSSCursor(this._coreStyle.cursor);
	}
	,get_transitionProperty: function() {
		return cocktail.core.unit.UnitManager.getCSSTransitionProperty(this._coreStyle.transitionProperty);
	}
	,set_transitionProperty: function(value) {
		this.setAttribute("transition-property",value);
		this._coreStyle.setTransitionProperty(cocktail.core.unit.UnitManager.getTransitionProperty(value));
		return value;
	}
	,get_transitionDuration: function() {
		return cocktail.core.unit.UnitManager.getCSSTransitionDuration(this._coreStyle.transitionDuration);
	}
	,set_transitionDuration: function(value) {
		this.setAttribute("transition-duration",value);
		this._coreStyle.setTransitionDuration(cocktail.core.unit.UnitManager.getTransitionDuration(value));
		return value;
	}
	,get_transitionDelay: function() {
		return cocktail.core.unit.UnitManager.getCSSTransitionDelay(this._coreStyle.transitionDelay);
	}
	,set_transitionDelay: function(value) {
		this.setAttribute("transition-delay",value);
		this._coreStyle.setTransitionDelay(cocktail.core.unit.UnitManager.getTransitionDelay(value));
		return value;
	}
	,get_transitionTimingFunction: function() {
		return cocktail.core.unit.UnitManager.getCSSTransitionTimingFunction(this._coreStyle.transitionTimingFunction);
	}
	,set_transitionTimingFunction: function(value) {
		this.setAttribute("transition-timing-function",value);
		this._coreStyle.setTransitionTimingFunction(cocktail.core.unit.UnitManager.getTransitionTimingFunction(value));
		return value;
	}
	,__class__: cocktail.core.style.adapter.Style
	,__properties__: {set_cursor:"set_cursor",get_cursor:"get_cursor",set_transitionDelay:"set_transitionDelay",get_transitionDelay:"get_transitionDelay",set_transitionTimingFunction:"set_transitionTimingFunction",get_transitionTimingFunction:"get_transitionTimingFunction",set_transitionDuration:"set_transitionDuration",get_transitionDuration:"get_transitionDuration",set_transitionProperty:"set_transitionProperty",get_transitionProperty:"get_transitionProperty",set_overflowY:"set_overflowY",get_overflowY:"get_overflowY",set_overflowX:"set_overflowX",get_overflowX:"get_overflowX",set_visibility:"set_visibility",get_visibility:"get_visibility",set_opacity:"set_opacity",get_opacity:"get_opacity",set_verticalAlign:"set_verticalAlign",get_verticalAlign:"get_verticalAlign",set_textIndent:"set_textIndent",get_textIndent:"get_textIndent",set_textAlign:"set_textAlign",get_textAlign:"get_textAlign",set_whiteSpace:"set_whiteSpace",get_whiteSpace:"get_whiteSpace",set_wordSpacing:"set_wordSpacing",get_wordSpacing:"get_wordSpacing",set_letterSpacing:"set_letterSpacing",get_letterSpacing:"get_letterSpacing",set_textTransform:"set_textTransform",get_textTransform:"get_textTransform",set_lineHeight:"set_lineHeight",get_lineHeight:"get_lineHeight",set_color:"set_color",get_color:"get_color",set_fontVariant:"set_fontVariant",get_fontVariant:"get_fontVariant",set_fontFamily:"set_fontFamily",get_fontFamily:"get_fontFamily",set_fontStyle:"set_fontStyle",get_fontStyle:"get_fontStyle",set_fontWeight:"set_fontWeight",get_fontWeight:"get_fontWeight",set_fontSize:"set_fontSize",get_fontSize:"get_fontSize",set_backgroundClip:"set_backgroundClip",get_backgroundClip:"get_backgroundClip",set_backgroundPosition:"set_backgroundPosition",get_backgroundPosition:"get_backgroundPosition",set_backgroundSize:"set_backgroundSize",get_backgroundSize:"get_backgroundSize",set_backgroundOrigin:"set_backgroundOrigin",get_backgroundOrigin:"get_backgroundOrigin",set_backgroundRepeat:"set_backgroundRepeat",get_backgroundRepeat:"get_backgroundRepeat",set_backgroundImage:"set_backgroundImage",get_backgroundImage:"get_backgroundImage",set_backgroundColor:"set_backgroundColor",get_backgroundColor:"get_backgroundColor",set_right:"set_right",get_right:"get_right",set_bottom:"set_bottom",get_bottom:"get_bottom",set_left:"set_left",get_left:"get_left",set_top:"set_top",get_top:"get_top",set_maxWidth:"set_maxWidth",get_maxWidth:"get_maxWidth",set_minWidth:"set_minWidth",get_minWidth:"get_minWidth",set_maxHeight:"set_maxHeight",get_maxHeight:"get_maxHeight",set_minHeight:"set_minHeight",get_minHeight:"get_minHeight",set_height:"set_height",get_height:"get_height",set_width:"set_width",get_width:"get_width",set_paddingBottom:"set_paddingBottom",get_paddingBottom:"get_paddingBottom",set_paddingTop:"set_paddingTop",get_paddingTop:"get_paddingTop",set_paddingRight:"set_paddingRight",get_paddingRight:"get_paddingRight",set_paddingLeft:"set_paddingLeft",get_paddingLeft:"get_paddingLeft",set_marginBottom:"set_marginBottom",get_marginBottom:"get_marginBottom",set_marginTop:"set_marginTop",get_marginTop:"get_marginTop",set_marginRight:"set_marginRight",get_marginRight:"get_marginRight",set_marginLeft:"set_marginLeft",get_marginLeft:"get_marginLeft",set_zIndex:"set_zIndex",get_zIndex:"get_zIndex",set_clear:"set_clear",get_clear:"get_clear",set_cssFloat:"set_CSSFloat",get_cssFloat:"get_CSSFloat",set_position:"set_position",get_position:"get_position",set_display:"set_display",get_display:"get_display"}
}
if(!cocktail.core.style.computer) cocktail.core.style.computer = {}
cocktail.core.style.computer.BackgroundStylesComputer = $hxClasses["cocktail.core.style.computer.BackgroundStylesComputer"] = function() {
};
cocktail.core.style.computer.BackgroundStylesComputer.__name__ = ["cocktail","core","style","computer","BackgroundStylesComputer"];
cocktail.core.style.computer.BackgroundStylesComputer.compute = function(style) {
	style.computedStyle.backgroundColor = cocktail.core.style.computer.BackgroundStylesComputer.getComputedBackgroundColor(style);
}
cocktail.core.style.computer.BackgroundStylesComputer.computeIndividualBackground = function(style,backgroundBox,intrinsicWidth,intrinsicHeight,intrinsicRatio,backgroundPosition,backgroundSize,backgroundOrigin,backgroundClip,backgroundRepeat,backgroundImage) {
	var backgroundPositioningArea = cocktail.core.style.computer.BackgroundStylesComputer.getBackgroundPositioningArea(style,backgroundOrigin,backgroundBox);
	var computedBackgroundSize = cocktail.core.style.computer.BackgroundStylesComputer.getComputedBackgroundSize(backgroundSize,backgroundPositioningArea,intrinsicWidth,intrinsicHeight,intrinsicRatio,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight);
	var computedBackgroundPosition = cocktail.core.style.computer.BackgroundStylesComputer.getComputedBackgroundPosition(backgroundPosition,backgroundPositioningArea,computedBackgroundSize,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight);
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
cocktail.core.style.computer.DisplayStylesComputer = $hxClasses["cocktail.core.style.computer.DisplayStylesComputer"] = function() {
};
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
cocktail.core.style.computer.FontAndTextStylesComputer = $hxClasses["cocktail.core.style.computer.FontAndTextStylesComputer"] = function() {
};
cocktail.core.style.computer.FontAndTextStylesComputer.__name__ = ["cocktail","core","style","computer","FontAndTextStylesComputer"];
cocktail.core.style.computer.FontAndTextStylesComputer.compute = function(style,containingBlockData,containingBlockFontMetricsData) {
	var computedStyle = style.computedStyle;
	computedStyle.set_fontSize(cocktail.core.style.computer.FontAndTextStylesComputer.getComputedFontSize(style,containingBlockFontMetricsData.fontSize,containingBlockFontMetricsData.xHeight));
	computedStyle.set_lineHeight(cocktail.core.style.computer.FontAndTextStylesComputer.getComputedLineHeight(style));
	computedStyle.verticalAlign = cocktail.core.style.computer.FontAndTextStylesComputer.getComputedVerticalAlign(style,containingBlockFontMetricsData);
	computedStyle.set_letterSpacing(cocktail.core.style.computer.FontAndTextStylesComputer.getComputedLetterSpacing(style));
	computedStyle.set_wordSpacing(cocktail.core.style.computer.FontAndTextStylesComputer.getComputedWordSpacing(style));
	computedStyle.set_textIndent(cocktail.core.style.computer.FontAndTextStylesComputer.getComputedTextIndent(style,containingBlockData));
	computedStyle.color = cocktail.core.style.computer.FontAndTextStylesComputer.getComputedColor(style);
}
cocktail.core.style.computer.FontAndTextStylesComputer.getComputedTextIndent = function(style,containingBlockData) {
	var textIndent;
	var $e = (style.textIndent);
	switch( $e[1] ) {
	case 0:
		var value = $e[2];
		textIndent = cocktail.core.unit.UnitManager.getPixelFromLength(value,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight);
		break;
	case 1:
		var value = $e[2];
		textIndent = cocktail.core.unit.UnitManager.getPixelFromPercent(value,containingBlockData.width);
		break;
	}
	return textIndent;
}
cocktail.core.style.computer.FontAndTextStylesComputer.getComputedVerticalAlign = function(style,containingBlockFontMetricsData) {
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
		verticalAlign = cocktail.core.unit.UnitManager.getPixelFromLength(value,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight);
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
cocktail.core.style.computer.FontAndTextStylesComputer.getComputedWordSpacing = function(style) {
	var wordSpacing;
	var $e = (style.wordSpacing);
	switch( $e[1] ) {
	case 0:
		wordSpacing = 0;
		break;
	case 1:
		var unit = $e[2];
		wordSpacing = cocktail.core.unit.UnitManager.getPixelFromLength(unit,style.computedStyle.getFontSize(),style.get_fontMetricsData().xHeight);
		break;
	}
	return wordSpacing;
}
cocktail.core.style.computer.FontAndTextStylesComputer.getComputedLineHeight = function(style) {
	var lineHeight;
	var $e = (style.lineHeight);
	switch( $e[1] ) {
	case 2:
		var unit = $e[2];
		lineHeight = cocktail.core.unit.UnitManager.getPixelFromLength(unit,style.computedStyle.getFontSize(),style.get_fontMetricsData().xHeight);
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
cocktail.core.style.computer.FontAndTextStylesComputer.getComputedLetterSpacing = function(style) {
	var letterSpacing;
	var $e = (style.letterSpacing);
	switch( $e[1] ) {
	case 0:
		letterSpacing = 0.0;
		break;
	case 1:
		var unit = $e[2];
		letterSpacing = cocktail.core.unit.UnitManager.getPixelFromLength(unit,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight);
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
cocktail.core.style.computer.TransitionStylesComputer = $hxClasses["cocktail.core.style.computer.TransitionStylesComputer"] = function() {
};
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
cocktail.core.style.computer.VisualEffectStylesComputer = $hxClasses["cocktail.core.style.computer.VisualEffectStylesComputer"] = function() {
};
cocktail.core.style.computer.VisualEffectStylesComputer.__name__ = ["cocktail","core","style","computer","VisualEffectStylesComputer"];
cocktail.core.style.computer.VisualEffectStylesComputer.compute = function(style) {
	var computedStyle = style.computedStyle;
	computedStyle.transformOrigin = cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTransformOrigin(style);
	computedStyle.transform = cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTransform(style);
}
cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTransformOrigin = function(style) {
	var x;
	var y;
	var $e = (style.transformOrigin.x);
	switch( $e[1] ) {
	case 0:
		var value = $e[2];
		x = cocktail.core.unit.UnitManager.getPixelFromLength(value,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight);
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
		y = cocktail.core.unit.UnitManager.getPixelFromLength(value,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight);
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
cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTransform = function(style) {
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
			var translationX = cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTranslation(style,tx,style.computedStyle.getWidth());
			var translationY = cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTranslation(style,ty,style.computedStyle.getHeight());
			matrix.translate(translationX,translationY);
			break;
		case 2:
			var tx = $e[2];
			var translationX = cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTranslation(style,tx,style.computedStyle.getWidth());
			matrix.translate(translationX,0.0);
			break;
		case 3:
			var ty = $e[2];
			var translationY = cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTranslation(style,ty,style.computedStyle.getHeight());
			matrix.translate(0.0,translationY);
			break;
		}
	}
	matrix.translate(transformOrigin.x * -1,transformOrigin.y * -1);
	return matrix;
}
cocktail.core.style.computer.VisualEffectStylesComputer.getComputedTranslation = function(style,translation,percentReference) {
	var computedTranslation;
	var $e = (translation);
	switch( $e[1] ) {
	case 0:
		var value = $e[2];
		computedTranslation = cocktail.core.unit.UnitManager.getPixelFromLength(value,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight);
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
if(!cocktail.core.style.computer.boxComputers) cocktail.core.style.computer.boxComputers = {}
cocktail.core.style.computer.boxComputers.BoxStylesComputer = $hxClasses["cocktail.core.style.computer.boxComputers.BoxStylesComputer"] = function() {
};
cocktail.core.style.computer.boxComputers.BoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","BoxStylesComputer"];
cocktail.core.style.computer.boxComputers.BoxStylesComputer.prototype = {
	measure: function(style,containingBlockData) {
		this.measureHorizontalPaddings(style,containingBlockData);
		this.measureVerticalPaddings(style,containingBlockData);
		this.measureDimensionsConstraints(style,containingBlockData);
		this.measureWidthAndHorizontalMargins(style,containingBlockData);
		this.measureHeightAndVerticalMargins(style,containingBlockData);
		this.measurePositionOffsets(style,containingBlockData);
	}
	,measureDimensionsConstraints: function(style,containingBlockData) {
		style.computedStyle.set_maxHeight(this.getComputedConstrainedDimension(style.maxHeight,containingBlockData.height,containingBlockData.isHeightAuto,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
		style.computedStyle.set_minHeight(this.getComputedConstrainedDimension(style.minHeight,containingBlockData.height,containingBlockData.isHeightAuto,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight,true));
		style.computedStyle.set_maxWidth(this.getComputedConstrainedDimension(style.maxWidth,containingBlockData.width,containingBlockData.isWidthAuto,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
		style.computedStyle.set_minWidth(this.getComputedConstrainedDimension(style.minWidth,containingBlockData.width,containingBlockData.isWidthAuto,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight,true));
	}
	,measurePositionOffsets: function(style,containingBlockData) {
		style.computedStyle.set_left(this.getComputedPositionOffset(style.left,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
		style.computedStyle.set_right(this.getComputedPositionOffset(style.right,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
		style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
		style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
	}
	,measureVerticalPaddings: function(style,containingBlockData) {
		style.computedStyle.set_paddingTop(this.getComputedPadding(style.paddingTop,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
		style.computedStyle.set_paddingBottom(this.getComputedPadding(style.paddingBottom,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
	}
	,measureHorizontalPaddings: function(style,containingBlockData) {
		style.computedStyle.set_paddingLeft(this.getComputedPadding(style.paddingLeft,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
		style.computedStyle.set_paddingRight(this.getComputedPadding(style.paddingRight,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
	}
	,measureWidthAndHorizontalMargins: function(style,containingBlockData) {
		if(style.width == cocktail.core.style.Dimension.cssAuto) this.measureAutoWidth(style,containingBlockData); else this.measureWidth(style,containingBlockData);
	}
	,measureAutoWidth: function(style,containingBlockData) {
		style.computedStyle.set_width(0.0);
		style.computedStyle.set_marginLeft(this.getComputedMarginLeft(style,containingBlockData));
		style.computedStyle.set_marginRight(this.getComputedMarginRight(style,containingBlockData));
		style.computedStyle.set_width(this.getComputedAutoWidth(style,containingBlockData));
	}
	,measureWidth: function(style,containingBlockData) {
		style.computedStyle.set_width(this.getComputedWidth(style,containingBlockData));
		style.computedStyle.set_marginLeft(this.getComputedMarginLeft(style,containingBlockData));
		style.computedStyle.set_marginRight(this.getComputedMarginRight(style,containingBlockData));
	}
	,measureHeightAndVerticalMargins: function(style,containingBlockData) {
		if(style.height == cocktail.core.style.Dimension.cssAuto) this.measureAutoHeight(style,containingBlockData); else this.measureHeight(style,containingBlockData);
	}
	,measureAutoHeight: function(style,containingBlockData) {
		style.computedStyle.set_height(this.getComputedAutoHeight(style,containingBlockData));
		style.computedStyle.set_marginTop(this.getComputedMarginTop(style,containingBlockData));
		style.computedStyle.set_marginBottom(this.getComputedMarginBottom(style,containingBlockData));
	}
	,measureHeight: function(style,containingBlockData) {
		style.computedStyle.set_height(this.getComputedHeight(style,containingBlockData));
		style.computedStyle.set_marginTop(this.getComputedMarginTop(style,containingBlockData));
		style.computedStyle.set_marginBottom(this.getComputedMarginBottom(style,containingBlockData));
	}
	,getComputedWidth: function(style,containingBlockData) {
		return this.getComputedDimension(style.width,containingBlockData.width,containingBlockData.isWidthAuto,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight);
	}
	,getComputedAutoWidth: function(style,containingBlockData) {
		return containingBlockData.width - style.computedStyle.getPaddingLeft() - style.computedStyle.getPaddingRight() - style.computedStyle.getMarginLeft() - style.computedStyle.getMarginRight();
	}
	,getComputedHeight: function(style,containingBlockData) {
		return this.getComputedDimension(style.height,containingBlockData.height,containingBlockData.isHeightAuto,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight);
	}
	,getComputedAutoHeight: function(style,containingBlockData) {
		return 0;
	}
	,getComputedMarginLeft: function(style,containingBlockData) {
		return this.getComputedMargin(style.marginLeft,style.marginRight,containingBlockData.width,style.computedStyle.getWidth(),style.width == cocktail.core.style.Dimension.cssAuto,style.computedStyle.getPaddingRight() + style.computedStyle.getPaddingLeft(),style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight,true);
	}
	,getComputedMarginRight: function(style,containingBlockData) {
		return this.getComputedMargin(style.marginRight,style.marginLeft,containingBlockData.width,style.computedStyle.getWidth(),style.width == cocktail.core.style.Dimension.cssAuto,style.computedStyle.getPaddingRight() + style.computedStyle.getPaddingLeft(),style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight,true);
	}
	,getComputedMarginTop: function(style,containingBlockData) {
		return this.getComputedMargin(style.marginTop,style.marginBottom,containingBlockData.height,style.computedStyle.getHeight(),style.height == cocktail.core.style.Dimension.cssAuto,style.computedStyle.getPaddingTop() + style.computedStyle.getPaddingBottom(),style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight,false);
	}
	,getComputedMarginBottom: function(style,containingBlockData) {
		return this.getComputedMargin(style.marginBottom,style.marginTop,containingBlockData.height,style.computedStyle.getHeight(),style.height == cocktail.core.style.Dimension.cssAuto,style.computedStyle.getPaddingTop() + style.computedStyle.getPaddingBottom(),style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight,false);
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
	,__class__: cocktail.core.style.computer.boxComputers.BoxStylesComputer
}
cocktail.core.style.computer.boxComputers.BlockBoxStylesComputer = $hxClasses["cocktail.core.style.computer.boxComputers.BlockBoxStylesComputer"] = function() {
	cocktail.core.style.computer.boxComputers.BoxStylesComputer.call(this);
};
cocktail.core.style.computer.boxComputers.BlockBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","BlockBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.BlockBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.BoxStylesComputer;
cocktail.core.style.computer.boxComputers.BlockBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.BoxStylesComputer.prototype,{
	__class__: cocktail.core.style.computer.boxComputers.BlockBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer = $hxClasses["cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer"] = function() {
	cocktail.core.style.computer.boxComputers.BoxStylesComputer.call(this);
};
cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","EmbeddedBlockBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.BoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.BoxStylesComputer.prototype,{
	measureAutoWidth: function(style,containingBlockData) {
		style.computedStyle.set_width(this.getComputedAutoWidth(style,containingBlockData));
		style.computedStyle.set_marginLeft(this.getComputedMarginLeft(style,containingBlockData));
		style.computedStyle.set_marginRight(this.getComputedMarginRight(style,containingBlockData));
	}
	,getComputedAutoWidth: function(style,containingBlockData) {
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
			var computedHeight = this.getComputedDimension(style.height,containingBlockData.height,containingBlockData.isHeightAuto,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight);
			style.computedStyle.set_height(computedHeight);
			if(embeddedHTMLElement.get_intrinsicRatio() != null) ret = computedHeight / embeddedHTMLElement.get_intrinsicRatio(); else if(embeddedHTMLElement.get_intrinsicWidth() != null) ret = embeddedHTMLElement.get_intrinsicWidth(); else ret = 300;
		}
		return ret;
	}
	,getComputedAutoHeight: function(style,containingBlockData) {
		var ret = 0.0;
		var embeddedHTMLElement = style.htmlElement;
		if(embeddedHTMLElement.getAttributeNode("height") != null) ret = embeddedHTMLElement.get_height(); else if(style.width == cocktail.core.style.Dimension.cssAuto) {
			if(embeddedHTMLElement.get_intrinsicHeight() != null) ret = embeddedHTMLElement.get_intrinsicHeight(); else if(embeddedHTMLElement.get_intrinsicWidth() != null && embeddedHTMLElement.get_intrinsicRatio() != null) ret = embeddedHTMLElement.get_intrinsicWidth() * embeddedHTMLElement.get_intrinsicRatio(); else if(embeddedHTMLElement.get_intrinsicRatio() != null) {
			}
		} else {
			var computedWidth = this.getComputedDimension(style.width,containingBlockData.width,containingBlockData.isWidthAuto,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight);
			style.computedStyle.set_width(computedWidth);
			if(embeddedHTMLElement.get_intrinsicRatio() != null) ret = style.computedStyle.getWidth() * embeddedHTMLElement.get_intrinsicRatio(); else ret = 150;
		}
		return ret;
	}
	,getComputedAutoMargin: function(marginStyleValue,opositeMargin,containingHTMLElementDimension,computedDimension,isDimensionAuto,computedPaddingsDimension,fontSize,xHeight,isHorizontalMargin) {
		var computedMargin;
		if(isHorizontalMargin == false) computedMargin = 0.0; else computedMargin = cocktail.core.style.computer.boxComputers.BoxStylesComputer.prototype.getComputedAutoMargin.call(this,marginStyleValue,opositeMargin,containingHTMLElementDimension,computedDimension,false,computedPaddingsDimension,fontSize,xHeight,isHorizontalMargin);
		return computedMargin;
	}
	,__class__: cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer = $hxClasses["cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer"] = function() {
	cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer.call(this);
};
cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","EmbeddedInlineBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer.prototype,{
	getComputedAutoMargin: function(marginStyleValue,opositeMargin,containingHTMLElementDimension,computedDimension,isDimensionAuto,computedPaddingsDimension,fontSize,xHeight,isHorizontalMargin) {
		return 0.0;
	}
	,__class__: cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.EmbeddedFloatBoxStylesComputer = $hxClasses["cocktail.core.style.computer.boxComputers.EmbeddedFloatBoxStylesComputer"] = function() {
	cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer.call(this);
};
cocktail.core.style.computer.boxComputers.EmbeddedFloatBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","EmbeddedFloatBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.EmbeddedFloatBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedFloatBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer.prototype,{
	__class__: cocktail.core.style.computer.boxComputers.EmbeddedFloatBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.EmbeddedInlineBlockBoxStylesComputer = $hxClasses["cocktail.core.style.computer.boxComputers.EmbeddedInlineBlockBoxStylesComputer"] = function() {
	cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer.call(this);
};
cocktail.core.style.computer.boxComputers.EmbeddedInlineBlockBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","EmbeddedInlineBlockBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.EmbeddedInlineBlockBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedInlineBlockBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.EmbeddedInlineBoxStylesComputer.prototype,{
	__class__: cocktail.core.style.computer.boxComputers.EmbeddedInlineBlockBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.EmbeddedPositionedBoxStylesComputer = $hxClasses["cocktail.core.style.computer.boxComputers.EmbeddedPositionedBoxStylesComputer"] = function() {
	cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer.call(this);
};
cocktail.core.style.computer.boxComputers.EmbeddedPositionedBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","EmbeddedPositionedBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.EmbeddedPositionedBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer;
cocktail.core.style.computer.boxComputers.EmbeddedPositionedBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.EmbeddedBlockBoxStylesComputer.prototype,{
	measurePositionOffsets: function(style,containingBlockData) {
		this.measureHorizontalPositionOffsets(style,containingBlockData);
		this.measureVerticalPositionOffsets(style,containingBlockData);
	}
	,measureHorizontalPositionOffsets: function(style,containingBlockData) {
		var computedStyle = style.computedStyle;
		if(style.left == cocktail.core.style.PositionOffset.cssAuto || style.right == cocktail.core.style.PositionOffset.cssAuto) {
			if(style.marginLeft == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginLeft(0);
			if(style.marginRight == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginRight(0);
			if(style.left == cocktail.core.style.PositionOffset.cssAuto && style.right == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_left(this.getComputedStaticLeft(style,containingBlockData));
				style.computedStyle.set_right(containingBlockData.width - computedStyle.getWidth() - computedStyle.getMarginLeft() - computedStyle.getMarginRight() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft());
			} else if(style.left == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_right(this.getComputedPositionOffset(style.right,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
				style.computedStyle.set_left(containingBlockData.width - computedStyle.getWidth() - computedStyle.getMarginLeft() - computedStyle.getMarginRight() - computedStyle.getRight() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight());
			} else if(style.right == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_left(this.getComputedPositionOffset(style.left,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
				style.computedStyle.set_right(containingBlockData.width - computedStyle.getWidth() - computedStyle.getMarginLeft() - computedStyle.getMarginRight() - computedStyle.getLeft() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight());
			}
		} else {
			style.computedStyle.set_left(this.getComputedPositionOffset(style.left,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
			style.computedStyle.set_right(this.getComputedPositionOffset(style.right,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
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
	,measureVerticalPositionOffsets: function(style,containingBlockData) {
		var computedStyle = style.computedStyle;
		if(style.top == cocktail.core.style.PositionOffset.cssAuto || style.bottom == cocktail.core.style.PositionOffset.cssAuto) {
			if(style.marginTop == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginTop(0);
			if(style.marginBottom == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginBottom(0);
			if(style.top == cocktail.core.style.PositionOffset.cssAuto && style.bottom == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_top(this.getComputedStaticTop(style,containingBlockData));
				style.computedStyle.set_bottom(containingBlockData.height - computedStyle.getHeight() - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop());
			} else if(style.top == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
				style.computedStyle.set_top(containingBlockData.height - computedStyle.getHeight() - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getBottom() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom());
			} else if(style.bottom == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
				style.computedStyle.set_bottom(containingBlockData.height - computedStyle.getHeight() - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getTop() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom());
			} else {
				style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
				style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
			}
		} else {
			style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
			style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
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
	,getComputedStaticLeft: function(style,containingBlockData) {
		return style.computedStyle.getMarginLeft();
	}
	,getComputedStaticTop: function(style,containingBlockData) {
		return style.computedStyle.getMarginTop();
	}
	,__class__: cocktail.core.style.computer.boxComputers.EmbeddedPositionedBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer = $hxClasses["cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer"] = function() {
	cocktail.core.style.computer.boxComputers.BoxStylesComputer.call(this);
};
cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","InlineBlockBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.BoxStylesComputer;
cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.BoxStylesComputer.prototype,{
	getComputedAutoMargin: function(marginStyleValue,opositeMargin,containingHTMLElementDimension,computedDimension,isDimensionAuto,computedPaddingsDimension,fontSize,xHeight,isHorizontalMargin) {
		return 0.0;
	}
	,__class__: cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.FloatBoxStylesComputer = $hxClasses["cocktail.core.style.computer.boxComputers.FloatBoxStylesComputer"] = function() {
	cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer.call(this);
};
cocktail.core.style.computer.boxComputers.FloatBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","FloatBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.FloatBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer;
cocktail.core.style.computer.boxComputers.FloatBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.InlineBlockBoxStylesComputer.prototype,{
	getComputedAutoWidth: function(style,containingBlockData) {
		return 0.0;
	}
	,__class__: cocktail.core.style.computer.boxComputers.FloatBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.InLineBoxStylesComputer = $hxClasses["cocktail.core.style.computer.boxComputers.InLineBoxStylesComputer"] = function() {
	cocktail.core.style.computer.boxComputers.BoxStylesComputer.call(this);
};
cocktail.core.style.computer.boxComputers.InLineBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","InLineBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.InLineBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.BoxStylesComputer;
cocktail.core.style.computer.boxComputers.InLineBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.BoxStylesComputer.prototype,{
	measureVerticalPaddings: function(style,containingBlockData) {
		style.computedStyle.set_paddingTop(0);
		style.computedStyle.set_paddingBottom(0);
	}
	,measureAutoHeight: function(style,containingBlockData) {
		style.computedStyle.set_height(this.getComputedAutoHeight(style,containingBlockData));
		style.computedStyle.set_marginTop(0.0);
		style.computedStyle.set_marginBottom(0.0);
	}
	,measureHeight: function(style,containingBlockData) {
		style.computedStyle.set_height(this.getComputedHeight(style,containingBlockData));
		style.computedStyle.set_marginTop(0.0);
		style.computedStyle.set_marginBottom(0.0);
	}
	,getComputedAutoMargin: function(marginStyleValue,opositeMargin,containingHTMLElementDimension,computedDimension,isDimensionAuto,computedPaddingsDimension,fontSize,xHeight,isHorizontalMargin) {
		return 0.0;
	}
	,getComputedWidth: function(style,containingBlockData) {
		return 0.0;
	}
	,getComputedHeight: function(style,containingBlockData) {
		return 0.0;
	}
	,__class__: cocktail.core.style.computer.boxComputers.InLineBoxStylesComputer
});
cocktail.core.style.computer.boxComputers.PositionedBoxStylesComputer = $hxClasses["cocktail.core.style.computer.boxComputers.PositionedBoxStylesComputer"] = function() {
	cocktail.core.style.computer.boxComputers.BoxStylesComputer.call(this);
};
cocktail.core.style.computer.boxComputers.PositionedBoxStylesComputer.__name__ = ["cocktail","core","style","computer","boxComputers","PositionedBoxStylesComputer"];
cocktail.core.style.computer.boxComputers.PositionedBoxStylesComputer.__super__ = cocktail.core.style.computer.boxComputers.BoxStylesComputer;
cocktail.core.style.computer.boxComputers.PositionedBoxStylesComputer.prototype = $extend(cocktail.core.style.computer.boxComputers.BoxStylesComputer.prototype,{
	measurePositionOffsets: function(style,containingBlockData) {
	}
	,measureAutoWidth: function(style,containingBlockData) {
		var computedStyle = style.computedStyle;
		if(style.marginLeft == cocktail.core.style.Margin.cssAuto) computedStyle.set_marginLeft(0); else computedStyle.set_marginLeft(this.getComputedMarginLeft(style,containingBlockData));
		if(style.marginRight == cocktail.core.style.Margin.cssAuto) computedStyle.set_marginRight(0); else computedStyle.set_marginRight(this.getComputedMarginRight(style,containingBlockData));
		if(style.left != cocktail.core.style.PositionOffset.cssAuto && style.right != cocktail.core.style.PositionOffset.cssAuto) {
			computedStyle.set_left(this.getComputedPositionOffset(style.left,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
			computedStyle.set_right(this.getComputedPositionOffset(style.right,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
			style.computedStyle.set_width(containingBlockData.width - computedStyle.getMarginLeft() - computedStyle.getLeft() - computedStyle.getRight() - computedStyle.getMarginRight() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight());
		} else {
			if(style.left == cocktail.core.style.PositionOffset.cssAuto) style.computedStyle.set_right(this.getComputedPositionOffset(style.right,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight)); else if(style.right == cocktail.core.style.PositionOffset.cssAuto) style.computedStyle.set_left(this.getComputedPositionOffset(style.left,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
			style.computedStyle.set_width(containingBlockData.width);
		}
	}
	,measureWidth: function(style,containingBlockData) {
		var computedStyle = style.computedStyle;
		style.computedStyle.set_width(this.getComputedWidth(style,containingBlockData));
		if(style.left != cocktail.core.style.PositionOffset.cssAuto && style.right != cocktail.core.style.PositionOffset.cssAuto) {
			style.computedStyle.set_left(this.getComputedPositionOffset(style.left,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
			style.computedStyle.set_right(this.getComputedPositionOffset(style.right,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
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
				style.computedStyle.set_marginRight(this.getComputedMarginRight(style,containingBlockData));
				style.computedStyle.set_marginLeft(containingBlockData.width - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft() - computedStyle.getRight() - computedStyle.getMarginRight());
			} else if(style.marginRight == cocktail.core.style.Margin.cssAuto) {
				style.computedStyle.set_marginLeft(this.getComputedMarginLeft(style,containingBlockData));
				style.computedStyle.set_marginRight(containingBlockData.width - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft() - computedStyle.getRight() - computedStyle.getMarginLeft());
			} else {
				style.computedStyle.set_marginLeft(this.getComputedMarginLeft(style,containingBlockData));
				style.computedStyle.set_marginRight(this.getComputedMarginRight(style,containingBlockData));
			}
		} else {
			if(style.marginLeft == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginLeft(0); else style.computedStyle.set_marginLeft(this.getComputedMarginLeft(style,containingBlockData));
			if(style.marginRight == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginRight(0); else style.computedStyle.set_marginRight(this.getComputedMarginRight(style,containingBlockData));
			if(style.left == cocktail.core.style.PositionOffset.cssAuto && style.right == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_left(this.getComputedStaticLeft(style,containingBlockData));
				style.computedStyle.set_right(containingBlockData.width - computedStyle.getMarginLeft() - computedStyle.getMarginRight() - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft());
			} else if(style.left == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_right(this.getComputedPositionOffset(style.right,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
				style.computedStyle.set_left(containingBlockData.width - computedStyle.getMarginLeft() - computedStyle.getMarginRight() - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getRight());
			} else if(style.right == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_left(this.getComputedPositionOffset(style.left,containingBlockData.width,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
				style.computedStyle.set_right(containingBlockData.width - computedStyle.getMarginLeft() - computedStyle.getMarginRight() - computedStyle.getWidth() - computedStyle.getPaddingLeft() - computedStyle.getPaddingRight() - computedStyle.getLeft());
			}
		}
	}
	,measureAutoHeight: function(style,containingBlockData) {
		var computedStyle = style.computedStyle;
		if(style.marginTop == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginTop(0); else style.computedStyle.set_marginTop(this.getComputedMarginTop(style,containingBlockData));
		if(style.marginBottom == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginBottom(0); else style.computedStyle.set_marginBottom(this.getComputedMarginBottom(style,containingBlockData));
		if(style.top != cocktail.core.style.PositionOffset.cssAuto && style.bottom != cocktail.core.style.PositionOffset.cssAuto) {
			style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
			style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
			style.computedStyle.set_height(containingBlockData.height - computedStyle.getMarginTop() - computedStyle.getTop() - computedStyle.getBottom() - computedStyle.getMarginBottom() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom());
		} else if(style.bottom == cocktail.core.style.PositionOffset.cssAuto) {
			style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
			style.computedStyle.set_bottom(containingBlockData.height - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop());
		} else if(style.top == cocktail.core.style.PositionOffset.cssAuto) {
			style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
			style.computedStyle.set_top(containingBlockData.height - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getBottom());
		}
	}
	,measureHeight: function(style,containingBlockData) {
		var computedStyle = style.computedStyle;
		style.computedStyle.set_height(this.getComputedHeight(style,containingBlockData));
		if(style.top != cocktail.core.style.PositionOffset.cssAuto && style.bottom != cocktail.core.style.PositionOffset.cssAuto) {
			style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
			style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
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
				style.computedStyle.set_marginBottom(this.getComputedMarginBottom(style,containingBlockData));
				style.computedStyle.set_marginTop(containingBlockData.height - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop() - computedStyle.getBottom() - computedStyle.getMarginBottom());
			} else if(style.marginBottom == cocktail.core.style.Margin.cssAuto) {
				style.computedStyle.set_marginTop(this.getComputedMarginTop(style,containingBlockData));
				style.computedStyle.set_marginBottom(containingBlockData.height - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop() - computedStyle.getBottom() - computedStyle.getMarginTop());
			} else {
				style.computedStyle.set_marginTop(this.getComputedMarginTop(style,containingBlockData));
				style.computedStyle.set_marginBottom(this.getComputedMarginBottom(style,containingBlockData));
			}
		} else {
			if(style.marginTop == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginTop(0); else style.computedStyle.set_marginTop(this.getComputedMarginTop(style,containingBlockData));
			if(style.marginBottom == cocktail.core.style.Margin.cssAuto) style.computedStyle.set_marginBottom(0); else style.computedStyle.set_marginBottom(this.getComputedMarginBottom(style,containingBlockData));
			if(style.top == cocktail.core.style.PositionOffset.cssAuto && style.bottom == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_top(this.getComputedStaticTop(style,containingBlockData));
				style.computedStyle.set_bottom(containingBlockData.height - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop());
			} else if(style.bottom == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_top(this.getComputedPositionOffset(style.top,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
				style.computedStyle.set_bottom(containingBlockData.height - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getTop());
			} else if(style.top == cocktail.core.style.PositionOffset.cssAuto) {
				style.computedStyle.set_bottom(this.getComputedPositionOffset(style.bottom,containingBlockData.height,style.get_fontMetricsData().fontSize,style.get_fontMetricsData().xHeight));
				style.computedStyle.set_top(containingBlockData.height - computedStyle.getMarginTop() - computedStyle.getMarginBottom() - computedStyle.getHeight() - computedStyle.getPaddingTop() - computedStyle.getPaddingBottom() - computedStyle.getBottom());
			}
		}
	}
	,getComputedStaticLeft: function(style,containingBlockData) {
		return style.computedStyle.getMarginLeft();
	}
	,getComputedStaticTop: function(style,containingBlockData) {
		return style.computedStyle.getMarginTop();
	}
	,__class__: cocktail.core.style.computer.boxComputers.PositionedBoxStylesComputer
});
if(!cocktail.core.style.floats) cocktail.core.style.floats = {}
cocktail.core.style.floats.FloatsManager = $hxClasses["cocktail.core.style.floats.FloatsManager"] = function() {
	var floatsLeft = new Array();
	var floatsRight = new Array();
	this._floats = { left : floatsLeft, right : floatsRight};
};
cocktail.core.style.floats.FloatsManager.__name__ = ["cocktail","core","style","floats","FloatsManager"];
cocktail.core.style.floats.FloatsManager.prototype = {
	_floats: null
	,floats: null
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
	,clearLeft: function(currentFormattingContextY) {
		return this.doClearFloat(currentFormattingContextY,this._floats.left);
	}
	,clearRight: function(currentFormattingContextY) {
		return this.doClearFloat(currentFormattingContextY,this._floats.right);
	}
	,clearBoth: function(currentFormattingContextY) {
		var leftY = this.doClearFloat(currentFormattingContextY,this._floats.left);
		var rightY = this.doClearFloat(currentFormattingContextY,this._floats.right);
		if(leftY > rightY) return leftY; else return rightY;
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
	,getLeftFloatData: function(elementRenderer,currentFormattingContextY,currentFormattingContextX,containingBlockWidth) {
		var floatData = this.getFloatData(elementRenderer,currentFormattingContextY,currentFormattingContextX,containingBlockWidth);
		floatData.x = this.getLeftFloatOffset(floatData.y);
		return floatData;
	}
	,getRightFloatData: function(elementRenderer,currentFormattingContextY,currentFormattingContextX,containingBlockWidth) {
		var floatData = this.getFloatData(elementRenderer,currentFormattingContextY,currentFormattingContextX,containingBlockWidth);
		floatData.x = containingBlockWidth - floatData.width - this.getRightFloatOffset(floatData.y,containingBlockWidth);
		return floatData;
	}
	,getFloatData: function(elementRenderer,currentFormattingContextY,currentFormattingContextX,containingBlockWidth) {
		var computedStyle = elementRenderer.get_coreStyle().computedStyle;
		var floatWidth = computedStyle.getWidth() + computedStyle.getPaddingLeft() + computedStyle.getPaddingRight() + computedStyle.getMarginLeft() + computedStyle.getMarginRight();
		var floatHeight = computedStyle.getHeight() + computedStyle.getPaddingTop() + computedStyle.getPaddingBottom() + computedStyle.getMarginTop() + computedStyle.getMarginBottom();
		var floatY = this.getFirstAvailableY(currentFormattingContextY,floatWidth,containingBlockWidth);
		var floatX = 0.0;
		return { x : floatX, y : floatY, width : floatWidth, height : floatHeight};
	}
	,getFirstAvailableY: function(currentFormattingContextY,elementWidth,containingBlockWidth) {
		var retY = currentFormattingContextY;
		while(this.getLeftFloatOffset(retY) + this.getRightFloatOffset(retY,containingBlockWidth) + elementWidth > containingBlockWidth) {
			var afterFloats = new Array();
			var _g1 = 0, _g = this._floats.left.length;
			while(_g1 < _g) {
				var i = _g1++;
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
	,removeFloats: function(flowY) {
		this._floats.left = this.doRemoveFloat(this._floats.left,flowY);
		this._floats.right = this.doRemoveFloat(this._floats.right,flowY);
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
	,getFloats: function() {
		return this._floats;
	}
	,__class__: cocktail.core.style.floats.FloatsManager
	,__properties__: {get_floats:"getFloats"}
}
if(!cocktail.core.style.formatter) cocktail.core.style.formatter = {}
cocktail.core.style.formatter.FormattingContext = $hxClasses["cocktail.core.style.formatter.FormattingContext"] = function(formattingContextRoot) {
	this._formattingContextRoot = formattingContextRoot;
};
cocktail.core.style.formatter.FormattingContext.__name__ = ["cocktail","core","style","formatter","FormattingContext"];
cocktail.core.style.formatter.FormattingContext.prototype = {
	_formattingContextRoot: null
	,_floatsManager: null
	,_formattingContextData: null
	,initFormattingContextData: function() {
		var x = this._formattingContextRoot.get_coreStyle().computedStyle.getPaddingLeft();
		var y = this._formattingContextRoot.get_coreStyle().computedStyle.getPaddingTop();
		this._formattingContextData = { x : x, y : y, maxHeight : 0.0, maxWidth : 0.0};
	}
	,format: function(floatsManager) {
		this._floatsManager = floatsManager;
		this.initFormattingContextData();
		this.startFormatting();
		this.applyShrinkToFitIfNeeded(this._formattingContextRoot,this._formattingContextData.maxWidth);
	}
	,startFormatting: function() {
	}
	,applyShrinkToFitIfNeeded: function(elementRenderer,minimumWidth) {
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
	,__class__: cocktail.core.style.formatter.FormattingContext
}
cocktail.core.style.formatter.BlockFormattingContext = $hxClasses["cocktail.core.style.formatter.BlockFormattingContext"] = function(formattingContextRoot) {
	cocktail.core.style.formatter.FormattingContext.call(this,formattingContextRoot);
	this._registeredFloats = new Array();
};
cocktail.core.style.formatter.BlockFormattingContext.__name__ = ["cocktail","core","style","formatter","BlockFormattingContext"];
cocktail.core.style.formatter.BlockFormattingContext.__super__ = cocktail.core.style.formatter.FormattingContext;
cocktail.core.style.formatter.BlockFormattingContext.prototype = $extend(cocktail.core.style.formatter.FormattingContext.prototype,{
	_registeredFloats: null
	,startFormatting: function() {
		this.doFormat(this._formattingContextRoot,-this._formattingContextRoot.get_coreStyle().computedStyle.getMarginLeft(),-this._formattingContextRoot.get_coreStyle().computedStyle.getMarginTop(),0,this._formattingContextRoot.get_coreStyle().computedStyle.getMarginTop(),this._formattingContextRoot.get_coreStyle().computedStyle.getMarginBottom());
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
	,getRegisteredFloat: function(child) {
		var length = this._registeredFloats.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			if(this._registeredFloats[i].node == child) return this._registeredFloats[i];
		}
		return null;
	}
	,doFormat: function(elementRenderer,concatenatedX,concatenatedY,currentLineY,parentCollapsedMarginTop,parentCollapsedMarginBottom) {
		concatenatedX += elementRenderer.get_coreStyle().computedStyle.getPaddingLeft() + elementRenderer.get_coreStyle().computedStyle.getMarginLeft();
		concatenatedY += elementRenderer.get_coreStyle().computedStyle.getPaddingTop() + parentCollapsedMarginTop;
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
			child.get_bounds().x = x;
			child.get_bounds().y = y;
			child.get_bounds().width = width;
			child.get_bounds().height = height;
			if(child.isFloat() == true) {
				if(this.isFloatRegistered(child) == false) {
					var floatBounds = this._floatsManager.registerFloat(child,concatenatedY,0,elementRenderer.getComputedStyle().getWidth());
					this._registeredFloats.push({ node : child, bounds : floatBounds});
					this.format(this._floatsManager);
					return 0.0;
				}
				var floatBounds = this.getRegisteredFloat(child).bounds;
				child.get_bounds().x = floatBounds.x + child.get_coreStyle().computedStyle.getMarginLeft();
				child.get_bounds().y = floatBounds.y + child.get_coreStyle().computedStyle.getMarginTop();
				child.get_bounds().x += concatenatedX;
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
			if(child.get_bounds().x + child.get_bounds().width + child.get_coreStyle().computedStyle.getMarginRight() > this._formattingContextData.maxWidth) {
				if(child.isAnonymousBlockBox() == false) this._formattingContextData.maxWidth = child.get_bounds().x + child.get_bounds().width + child.get_coreStyle().computedStyle.getMarginRight();
			}
			if(concatenatedY > this._formattingContextData.maxHeight) this._formattingContextData.maxHeight = concatenatedY;
		}
		childHeight = concatenatedY - childHeight;
		if(elementRenderer.get_coreStyle().height == cocktail.core.style.Dimension.cssAuto) {
			elementRenderer.get_bounds().height = childHeight + elementRenderer.get_coreStyle().computedStyle.getPaddingBottom() + elementRenderer.get_coreStyle().computedStyle.getPaddingTop();
			elementRenderer.get_coreStyle().computedStyle.set_height(childHeight);
		}
		concatenatedY += elementRenderer.get_coreStyle().computedStyle.getPaddingBottom() + parentCollapsedMarginBottom;
		this._floatsManager.removeFloats(concatenatedY);
		return concatenatedY;
	}
	,getCollapsedMarginTop: function(child,parentCollapsedMarginTop) {
		var marginTop = child.get_coreStyle().computedStyle.getMarginTop();
		if(child.get_coreStyle().computedStyle.getPaddingTop() == 0) {
			if(child.get_previousSibling() != null) {
				var previousSibling = child.get_previousSibling();
				if(previousSibling.get_coreStyle().computedStyle.getPaddingBottom() == 0) {
					if(previousSibling.get_coreStyle().computedStyle.getMarginBottom() > marginTop) {
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
	,getCollapsedMarginBottom: function(child,parentCollapsedMarginBottom) {
		var marginBottom = child.get_coreStyle().computedStyle.getMarginBottom();
		if(child.get_coreStyle().computedStyle.getPaddingBottom() == 0) {
			if(child.get_nextSibling() != null) {
				var nextSibling = child.get_nextSibling();
				if(nextSibling.get_coreStyle().computedStyle.getPaddingTop() == 0) {
					if(nextSibling.get_coreStyle().computedStyle.getMarginTop() > marginBottom) marginBottom = 0;
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
	,__class__: cocktail.core.style.formatter.BlockFormattingContext
});
cocktail.core.style.formatter.InlineFormattingContext = $hxClasses["cocktail.core.style.formatter.InlineFormattingContext"] = function(formattingContextRoot) {
	this._unbreakableLineBoxes = new Array();
	this._unbreakableWidth = 0.0;
	this._firstLineFormatted = false;
	cocktail.core.style.formatter.FormattingContext.call(this,formattingContextRoot);
};
cocktail.core.style.formatter.InlineFormattingContext.__name__ = ["cocktail","core","style","formatter","InlineFormattingContext"];
cocktail.core.style.formatter.InlineFormattingContext.__super__ = cocktail.core.style.formatter.FormattingContext;
cocktail.core.style.formatter.InlineFormattingContext.prototype = $extend(cocktail.core.style.formatter.FormattingContext.prototype,{
	_unbreakableLineBoxes: null
	,_unbreakableWidth: null
	,_firstLineFormatted: null
	,startFormatting: function() {
		this._unbreakableLineBoxes = new Array();
		var rootLineBoxes = new Array();
		var initialRootLineBox = new cocktail.core.renderer.RootLineBox(this._formattingContextRoot);
		rootLineBoxes.push(initialRootLineBox);
		this._unbreakableWidth = this._formattingContextRoot.get_coreStyle().computedStyle.getTextIndent();
		this._formattingContextData.x = this._formattingContextRoot.get_coreStyle().computedStyle.getTextIndent();
		this._formattingContextData.x += this._floatsManager.getLeftFloatOffset(this._formattingContextRoot.get_bounds().y);
		this.doFormat(this._formattingContextRoot,initialRootLineBox,rootLineBoxes,[]);
		this.formatLine(rootLineBoxes[rootLineBoxes.length - 1],true);
		this._formattingContextRoot.lineBoxes = rootLineBoxes;
		if(this._formattingContextRoot.get_coreStyle().height == cocktail.core.style.Dimension.cssAuto) {
			this._formattingContextRoot.get_bounds().height = this._formattingContextData.y + this._formattingContextRoot.get_coreStyle().computedStyle.getPaddingBottom();
			this._formattingContextRoot.get_coreStyle().computedStyle.set_height(this._formattingContextRoot.get_bounds().height - this._formattingContextRoot.get_coreStyle().computedStyle.getPaddingBottom() - this._formattingContextRoot.get_coreStyle().computedStyle.getPaddingTop());
		}
	}
	,doFormat: function(elementRenderer,lineBox,rootLineBoxes,openedElementRenderers) {
		var length = elementRenderer.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = elementRenderer.childNodes[i];
			if(child.establishesNewFormattingContext() == true) {
				child.get_bounds().width = child.get_coreStyle().computedStyle.getWidth() + child.get_coreStyle().computedStyle.getPaddingLeft() + child.get_coreStyle().computedStyle.getPaddingRight();
				child.get_bounds().height = child.get_coreStyle().computedStyle.getHeight() + child.get_coreStyle().computedStyle.getPaddingTop() + child.get_coreStyle().computedStyle.getPaddingBottom();
				var inlineBlockLineBox = new cocktail.core.renderer.InlineBlockLineBox(child);
				child.lineBoxes.push(inlineBlockLineBox);
				inlineBlockLineBox.set_marginLeft(child.get_coreStyle().computedStyle.getMarginLeft());
				inlineBlockLineBox.set_marginRight(child.get_coreStyle().computedStyle.getMarginRight());
				var childLineBoxes = [inlineBlockLineBox];
				lineBox = this.insertIntoLine(childLineBoxes,lineBox,rootLineBoxes,openedElementRenderers);
			} else if(child.isReplaced() == true && child.isText() == false) {
				var embeddedLineBox = new cocktail.core.renderer.EmbeddedLineBox(child);
				child.lineBoxes.push(embeddedLineBox);
				var childLineBoxes = [embeddedLineBox];
				lineBox = this.insertIntoLine(childLineBoxes,lineBox,rootLineBoxes,openedElementRenderers);
			} else if(child.hasChildNodes() == true && child.establishesNewFormattingContext() == false) {
				child.lineBoxes = new Array();
				var childLineBox = this.createContainerLineBox(child);
				childLineBox.set_marginLeft(child.get_coreStyle().computedStyle.getMarginLeft());
				childLineBox.set_paddingLeft(child.get_coreStyle().computedStyle.getPaddingLeft());
				this._unbreakableWidth += child.get_coreStyle().computedStyle.getMarginLeft() + child.get_coreStyle().computedStyle.getPaddingLeft();
				lineBox.appendChild(childLineBox);
				openedElementRenderers.push(child);
				lineBox = this.doFormat(child,childLineBox,rootLineBoxes,openedElementRenderers);
				openedElementRenderers.pop();
				lineBox = lineBox.parentNode;
				child.lineBoxes[child.lineBoxes.length - 1].set_marginRight(child.get_coreStyle().computedStyle.getMarginRight());
				child.lineBoxes[child.lineBoxes.length - 1].set_paddingRight(child.get_coreStyle().computedStyle.getPaddingRight());
				this._unbreakableWidth += child.get_coreStyle().computedStyle.getMarginRight() + child.get_coreStyle().computedStyle.getPaddingRight();
			} else {
				var childLineBoxes = child.lineBoxes;
				lineBox = this.insertIntoLine(childLineBoxes,lineBox,rootLineBoxes,openedElementRenderers);
			}
		}
		return lineBox;
	}
	,createContainerLineBox: function(child) {
		var lineBox = new cocktail.core.renderer.LineBox(child);
		child.lineBoxes.push(lineBox);
		return lineBox;
	}
	,insertIntoLine: function(lineBoxes,lineBox,rootLineBoxes,openedElementRenderers) {
		var length = lineBoxes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			this._unbreakableLineBoxes.push(lineBoxes[i]);
			if(lineBoxes[i].isAbsolutelyPositioned() == false || lineBoxes[i].isText() == true) this._unbreakableWidth += lineBoxes[i].get_bounds().width + lineBox.get_marginLeft() + lineBox.get_marginRight();
			var remainingLineWidth = this.getRemainingLineWidth();
			if(remainingLineWidth - this._unbreakableWidth < 0) {
				this._formattingContextData.y = this._floatsManager.getFirstAvailableY(this._formattingContextData.y + this._formattingContextRoot.get_bounds().y,this._unbreakableWidth,this._formattingContextRoot.get_coreStyle().computedStyle.getWidth());
				this._formattingContextData.y -= this._formattingContextRoot.get_bounds().y;
				this._formattingContextData.x = this._floatsManager.getLeftFloatOffset(this._formattingContextData.y + this._formattingContextRoot.get_bounds().y);
				this.formatLine(rootLineBoxes[rootLineBoxes.length - 1],false);
				var rootLineBox = new cocktail.core.renderer.RootLineBox(this._formattingContextRoot);
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
	,formatLine: function(rootLineBox,isLastLine) {
		this.removeSpaces(rootLineBox);
		var lineBoxWidth = this.alignLineBox(rootLineBox,isLastLine,this.getConcatenatedWidth(rootLineBox),this.getSpacesNumber(rootLineBox));
		if(lineBoxWidth > this._formattingContextData.maxWidth) this._formattingContextData.maxWidth = lineBoxWidth;
		var lineBoxHeight = this.computeLineBoxHeight(rootLineBox);
		this._formattingContextData.y += lineBoxHeight;
		this._firstLineFormatted = true;
	}
	,getConcatenatedWidth: function(lineBox) {
		var concatenatedWidth = 0.0;
		var length = lineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = lineBox.childNodes[i];
			if(child.hasChildNodes() == true && (child.isAbsolutelyPositioned() == false || child.isText() == true)) concatenatedWidth += this.getConcatenatedWidth(child);
			if(child.isAbsolutelyPositioned() == false || child.isText() == true) concatenatedWidth += child.get_bounds().width;
		}
		return concatenatedWidth;
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
	,getRemainingLineWidth: function() {
		return this._formattingContextRoot.get_coreStyle().computedStyle.getWidth() - this._formattingContextData.x - this._floatsManager.getRightFloatOffset(this._formattingContextData.y + this._formattingContextRoot.get_bounds().y,this._formattingContextRoot.get_coreStyle().computedStyle.getWidth());
	}
	,alignLineBox: function(rootLineBox,isLastLine,concatenatedLength,spaceInLine) {
		var remainingSpace;
		var flowX;
		remainingSpace = this._formattingContextRoot.get_coreStyle().computedStyle.getWidth() - concatenatedLength - this._floatsManager.getLeftFloatOffset(this._formattingContextData.y) - this._floatsManager.getRightFloatOffset(this._formattingContextData.y + this._formattingContextRoot.get_bounds().y,this._formattingContextRoot.get_coreStyle().computedStyle.getWidth());
		flowX = this._formattingContextRoot.get_coreStyle().computedStyle.getPaddingLeft();
		if(this._firstLineFormatted == false) {
			flowX += this._formattingContextRoot.get_coreStyle().computedStyle.getTextIndent();
			remainingSpace -= this._formattingContextRoot.get_coreStyle().computedStyle.getTextIndent();
		}
		flowX += this._floatsManager.getLeftFloatOffset(this._formattingContextData.y + this._formattingContextRoot.get_bounds().y);
		switch( (this._formattingContextRoot.get_coreStyle().computedStyle.textAlign)[1] ) {
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
				concatenatedLength = this._formattingContextRoot.get_coreStyle().computedStyle.getWidth();
				this.alignJustify(flowX,remainingSpace,rootLineBox,spaceInLine);
			}
			break;
		}
		return concatenatedLength;
	}
	,alignLeft: function(flowX,lineBox) {
		flowX += lineBox.get_paddingLeft() + lineBox.get_marginLeft();
		var length = lineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = lineBox.childNodes[i];
			if(child.hasChildNodes() == true && child.isAbsolutelyPositioned() == false) flowX = this.alignLeft(flowX,child); else {
				child.get_bounds().x = flowX + child.get_marginLeft();
				if(child.isAbsolutelyPositioned() == false || child.isText() == true) flowX += child.get_bounds().width + child.get_marginLeft() + child.get_marginRight();
			}
		}
		flowX += lineBox.get_paddingRight() + lineBox.get_marginRight();
		return flowX;
	}
	,alignCenter: function(flowX,remainingSpace,lineBox) {
		flowX += lineBox.get_marginLeft() + lineBox.get_paddingLeft();
		var length = lineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = lineBox.childNodes[i];
			if(child.hasChildNodes() == true) flowX = this.alignCenter(flowX,remainingSpace,child);
			child.get_bounds().x = remainingSpace / 2 + flowX;
			flowX += child.get_bounds().width;
		}
		flowX += lineBox.get_marginRight() + lineBox.get_paddingRight();
		return flowX;
	}
	,alignRight: function(flowX,remainingSpace,lineBox) {
		flowX += lineBox.get_marginLeft() + lineBox.get_paddingLeft();
		var length = lineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = lineBox.childNodes[i];
			if(child.hasChildNodes() == true) flowX = this.alignRight(flowX,remainingSpace,child);
			child.get_bounds().x = flowX + remainingSpace;
			flowX += child.get_bounds().width;
		}
		flowX += lineBox.get_marginRight() + lineBox.get_paddingRight();
		return flowX;
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
	,shouldTabBeConvertedToSpace: function(whiteSpace) {
		var shouldTabBeConvertedToSpace;
		switch( (whiteSpace)[1] ) {
		case 0:
		case 2:
		case 4:
			shouldTabBeConvertedToSpace = true;
			break;
		case 1:
		case 3:
			shouldTabBeConvertedToSpace = false;
			break;
		}
		return shouldTabBeConvertedToSpace;
	}
	,isLineFeedAllowed: function(whiteSpace) {
		var lineFeedAllowed;
		switch( (whiteSpace)[1] ) {
		case 0:
		case 2:
			lineFeedAllowed = false;
			break;
		case 1:
		case 3:
		case 4:
			lineFeedAllowed = true;
			break;
		}
		return lineFeedAllowed;
	}
	,shouldInsertSpace: function(whiteSpace,isNexElementALineFeed) {
		var shouldInsertSpace;
		switch( (whiteSpace)[1] ) {
		case 0:
		case 2:
		case 4:
			shouldInsertSpace = isNexElementALineFeed == false;
			break;
		case 3:
		case 1:
			shouldInsertSpace = true;
			break;
		}
		if(shouldInsertSpace == true) {
		}
		return shouldInsertSpace;
	}
	,removeSpaces: function(rootLineBox) {
		var lineBoxes = this.getLineBoxTreeAsArray(rootLineBox);
		if(lineBoxes.length == 0) return;
		var i = 0;
		try {
			while(i < lineBoxes.length) {
				var lineBox = lineBoxes[i];
				if(lineBox.isSpace() == true) {
					switch( (lineBox.get_elementRenderer().get_coreStyle().computedStyle.whiteSpace)[1] ) {
					case 0:
					case 2:
					case 4:
						lineBox.parentNode.removeChild(lineBox);
						break;
					default:
						throw "__break__";
					}
				} else if(lineBox.isAbsolutelyPositioned() == false) throw "__break__";
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
					switch( (lineBox.get_elementRenderer().get_coreStyle().computedStyle.whiteSpace)[1] ) {
					case 0:
					case 2:
					case 4:
						lineBox.parentNode.removeChild(lineBox);
						break;
					default:
						throw "__break__";
					}
				} else if(lineBox.isAbsolutelyPositioned() == false) throw "__break__";
				i1--;
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
	}
	,getLineBoxTreeAsArray: function(rootLineBox) {
		var ret = new Array();
		var _g1 = 0, _g = rootLineBox.childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			var child = rootLineBox.childNodes[i];
			if(child.hasChildNodes() == true && child.isAbsolutelyPositioned() == false) {
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
	,computeLineBoxHeight: function(rootLineBox) {
		this.setRootLineBoxMetrics(rootLineBox,rootLineBox,0.0);
		this.alignLineBoxesVertically(rootLineBox,rootLineBox.get_leadedAscent(),this._formattingContextData.y,0.0);
		var lineBoxHeight = rootLineBox.get_bounds().height;
		return lineBoxHeight;
	}
	,setRootLineBoxMetrics: function(lineBox,rootLineBox,parentBaseLineOffset) {
		var length = lineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = lineBox.childNodes[i];
			if(child.isAbsolutelyPositioned() == false || child.isText() == true) {
				var leadedAscent = child.get_leadedAscent();
				var leadedDescent = child.get_leadedDescent();
				var baselineOffset = child.getBaselineOffset(parentBaseLineOffset,this._formattingContextRoot.get_coreStyle().get_fontMetricsData().xHeight);
				if(leadedAscent + baselineOffset > rootLineBox.get_leadedAscent()) rootLineBox.set_leadedAscent(leadedAscent + baselineOffset);
				if(leadedDescent + baselineOffset > rootLineBox.get_leadedDescent()) rootLineBox.set_leadedDescent(leadedDescent + baselineOffset);
				if(child.hasChildNodes() == true) this.setRootLineBoxMetrics(child,rootLineBox,baselineOffset);
			}
		}
	}
	,alignLineBoxesVertically: function(lineBox,lineBoxAscent,formattingContextY,parentBaseLineOffset) {
		var length = lineBox.childNodes.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var child = lineBox.childNodes[i];
			var baselineOffset = child.getBaselineOffset(parentBaseLineOffset,this._formattingContextRoot.get_coreStyle().get_fontMetricsData().xHeight);
			switch( (child.get_elementRenderer().get_coreStyle().verticalAlign)[1] ) {
			case 3:
				child.get_bounds().y = formattingContextY;
				break;
			default:
				child.get_bounds().y = formattingContextY - baselineOffset + lineBoxAscent;
				child.get_bounds().y -= child.get_leadedAscent();
			}
			if(child.hasChildNodes() == true) this.alignLineBoxesVertically(child,lineBoxAscent,formattingContextY,baselineOffset);
			if(child.establishesNewFormattingContext() == true || child.get_elementRenderer().isReplaced() == true && child.get_elementRenderer().isText() == false) {
				if(child.isAbsolutelyPositioned() == true) child.get_bounds().y += child.get_leadedAscent();
			}
		}
	}
	,__class__: cocktail.core.style.formatter.InlineFormattingContext
});
if(!cocktail.core.style.transition) cocktail.core.style.transition = {}
cocktail.core.style.transition.Transition = $hxClasses["cocktail.core.style.transition.Transition"] = function(propertyName,target,transitionDuration,transitionDelay,transitionTimingFunction,startValue,endValue,onComplete,onUpdate,invalidationReason) {
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
cocktail.core.style.transition.Transition.__name__ = ["cocktail","core","style","transition","Transition"];
cocktail.core.style.transition.Transition.prototype = {
	_transitionDelay: null
	,_transitionTimingFunction: null
	,_startValue: null
	,_endValue: null
	,_elapsedTime: null
	,propertyName: null
	,currentValue: null
	,onComplete: null
	,onUpdate: null
	,transitionDuration: null
	,target: null
	,complete: null
	,invalidationReason: null
	,updateTime: function(delta) {
		this._elapsedTime += delta;
	}
	,dispose: function() {
		this.onComplete = null;
		this.onUpdate = null;
		this._transitionTimingFunction = null;
	}
	,get_complete: function() {
		if(this._elapsedTime >= (this._transitionDelay + this.transitionDuration) * 1000) return true;
		return false;
	}
	,get_currentValue: function() {
		var completePercent = this._elapsedTime / ((this._transitionDelay + this.transitionDuration) * 1000);
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
	,__class__: cocktail.core.style.transition.Transition
	,__properties__: {get_complete:"get_complete",get_currentValue:"get_currentValue"}
}
cocktail.core.style.transition.TransitionManager = $hxClasses["cocktail.core.style.transition.TransitionManager"] = function() {
	this._transitions = new Hash();
	this._currentTransitionsNumber = 0;
	this._lastTick = 0;
};
cocktail.core.style.transition.TransitionManager.__name__ = ["cocktail","core","style","transition","TransitionManager"];
cocktail.core.style.transition.TransitionManager._instance = null;
cocktail.core.style.transition.TransitionManager.getInstance = function() {
	if(cocktail.core.style.transition.TransitionManager._instance == null) cocktail.core.style.transition.TransitionManager._instance = new cocktail.core.style.transition.TransitionManager();
	return cocktail.core.style.transition.TransitionManager._instance;
}
cocktail.core.style.transition.TransitionManager.prototype = {
	_transitions: null
	,_currentTransitionsNumber: null
	,_lastTick: null
	,getTransition: function(propertyName,style) {
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
	,startTransition: function(target,propertyName,startValue,endValue,transitionDuration,transitionDelay,transitionTimingFunction,onComplete,onUpdate,invalidationReason) {
		var transition = new cocktail.core.style.transition.Transition(propertyName,target,transitionDuration,transitionDelay,transitionTimingFunction,startValue,endValue,onComplete,onUpdate,invalidationReason);
		if(this._transitions.exists(propertyName) == false) this._transitions.set(propertyName,[]);
		var propertyTransitions = this._transitions.get(propertyName);
		propertyTransitions.push(transition);
		if(this._currentTransitionsNumber == 0) this.startTransitionTimer();
		this._currentTransitionsNumber++;
	}
	,stopTransition: function(transition) {
		var propertyTransitions = this._transitions.get(transition.propertyName);
		propertyTransitions.remove(transition);
		transition.dispose();
		this._currentTransitionsNumber--;
	}
	,startTransitionTimer: function() {
		this._lastTick = Date.now().getTime();
	}
	,onTransitionTick: function() {
		var tick = Date.now().getTime();
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
	,__class__: cocktail.core.style.transition.TransitionManager
}
if(!cocktail.core.unit) cocktail.core.unit = {}
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
cocktail.core.unit.UnitManager = $hxClasses["cocktail.core.unit.UnitManager"] = function() {
};
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
	string = string.substr(5,string.length - 6);
	var rgba = string.split(",");
	while(rgba.length < 4) rgba.push("0");
	return { r : Std.parseInt(cocktail.core.unit.UnitManager.trim(rgba[0])), g : Std.parseInt(cocktail.core.unit.UnitManager.trim(rgba[1])), b : Std.parseInt(cocktail.core.unit.UnitManager.trim(rgba[2])), a : Std.parseFloat(cocktail.core.unit.UnitManager.trim(rgba[3]))};
}
cocktail.core.unit.UnitManager.string2RGB = function(string) {
	string = string.substr(4,string.length - 5);
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
	var r = new EReg("^([0-9]+)(ms|s)$","");
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
	string = cocktail.core.unit.UnitManager.trim(string.substr(4,string.length - 5));
	if(StringTools.startsWith(string,"\"")) string = string.substr(1);
	if(StringTools.endsWith(string,"\"")) string = string.substr(0,string.length - 1);
	if(StringTools.startsWith(string,"'")) string = string.substr(1);
	if(StringTools.endsWith(string,"'")) string = string.substr(0,string.length - 1);
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
cocktail.core.unit.UnitManager.prototype = {
	__class__: cocktail.core.unit.UnitManager
}
if(!cocktail.core.window) cocktail.core.window = {}
cocktail.core.window.Window = $hxClasses["cocktail.core.window.Window"] = function() {
	cocktail.core.event.EventCallback.call(this);
	this.init();
};
cocktail.core.window.Window.__name__ = ["cocktail","core","window","Window"];
cocktail.core.window.Window.__super__ = cocktail.core.event.EventCallback;
cocktail.core.window.Window.prototype = $extend(cocktail.core.event.EventCallback.prototype,{
	document: null
	,innerHeight: null
	,innerWidth: null
	,_platform: null
	,init: function() {
		this._platform = new cocktail.port.platform.Platform();
		var htmlDocument = new cocktail.core.html.HTMLDocument();
		this._platform.set_onMouseDown(htmlDocument.onPlatformMouseEvent.$bind(htmlDocument));
		this._platform.set_onMouseUp(htmlDocument.onPlatformMouseEvent.$bind(htmlDocument));
		this._platform.set_onMouseMove(htmlDocument.onPlatformMouseMoveEvent.$bind(htmlDocument));
		this._platform.set_onMouseWheel(htmlDocument.onPlatformMouseWheelEvent.$bind(htmlDocument));
		this._platform.set_onKeyDown(htmlDocument.onPlatformKeyDownEvent.$bind(htmlDocument));
		this._platform.set_onKeyUp(htmlDocument.onPlatformKeyUpEvent.$bind(htmlDocument));
		this._platform.set_onResize(htmlDocument.onPlatformResizeEvent.$bind(htmlDocument));
		htmlDocument.onEnterFullscreen = this.onDocumentEnterFullscreen.$bind(this);
		htmlDocument.onExitFullscreen = this.onDocumentExitFullscreen.$bind(this);
		this._platform.set_onFullScreenChange(this.onPlatformFullScreenChange.$bind(this));
		htmlDocument.onSetMouseCursor = this.onDocumentSetMouseCursor.$bind(this);
		this.document = htmlDocument;
	}
	,open: function(url,name) {
		if(name == null) name = "_blank";
		this._platform.open(url,name);
	}
	,onPlatformFullScreenChange: function(event) {
		if(this._platform.fullscreen() == false) this.document.exitFullscreen();
	}
	,onDocumentEnterFullscreen: function() {
		this._platform.enterFullscreen();
	}
	,onDocumentExitFullscreen: function() {
		this._platform.exitFullscreen();
	}
	,onDocumentSetMouseCursor: function(cursor) {
		this._platform.setMouseCursor(cursor);
	}
	,get_innerHeight: function() {
		return this._platform.get_innerHeight();
	}
	,get_innerWidth: function() {
		return this._platform.get_innerWidth();
	}
	,__class__: cocktail.core.window.Window
	,__properties__: $extend(cocktail.core.event.EventCallback.prototype.__properties__,{get_innerWidth:"get_innerWidth",get_innerHeight:"get_innerHeight"})
});
if(!cocktail.port.platform) cocktail.port.platform = {}
cocktail.port.platform.Platform = $hxClasses["cocktail.port.platform.Platform"] = function() {
	cocktail.core.event.EventCallback.call(this);
	this.initKeyboardListeners();
	this.initMouseListeners();
	this.initNativeWindowListners();
};
cocktail.port.platform.Platform.__name__ = ["cocktail","port","platform","Platform"];
cocktail.port.platform.Platform.__super__ = cocktail.core.event.EventCallback;
cocktail.port.platform.Platform.prototype = $extend(cocktail.core.event.EventCallback.prototype,{
	innerHeight: null
	,innerWidth: null
	,_keyboard: null
	,_mouse: null
	,_nativeWindow: null
	,initMouseListeners: function() {
		this._mouse = new cocktail.port.server.Mouse();
		this._mouse.onMouseDown = this.dispatchMouseEvent.$bind(this);
		this._mouse.onMouseUp = this.dispatchMouseEvent.$bind(this);
		this._mouse.onMouseMove = this.dispatchMouseEvent.$bind(this);
		this._mouse.onMouseWheel = this.dispatchMouseWheelEvent.$bind(this);
	}
	,initKeyboardListeners: function() {
		this._keyboard = new cocktail.port.server.Keyboard();
		this._keyboard.onKeyDown = this.dispatchKeyboardEvent.$bind(this);
		this._keyboard.onKeyUp = this.dispatchKeyboardEvent.$bind(this);
	}
	,initNativeWindowListners: function() {
		this._nativeWindow = new cocktail.port.server.NativeWindow();
		this._nativeWindow.onResize = this.dispatchUIEvent.$bind(this);
		this._nativeWindow.onFullScreenChange = this.dispatchFullScreenEvent.$bind(this);
	}
	,open: function(url,name) {
		this._nativeWindow.open(url,name);
	}
	,enterFullscreen: function() {
		this._nativeWindow.enterFullscreen();
	}
	,exitFullscreen: function() {
		this._nativeWindow.exitFullscreen();
	}
	,fullscreen: function() {
		return this._nativeWindow.fullscreen();
	}
	,setMouseCursor: function(cursor) {
		this._mouse.setMouseCursor(cursor);
	}
	,dispatchMouseEvent: function(mouseEvent) {
		switch(mouseEvent.type) {
		case "mousedown":
			if(this.onmousedown != null) this.onmousedown(mouseEvent);
			break;
		case "mousemove":
			if(this.onmousemove != null) this.onmousemove(mouseEvent);
			break;
		case "mouseup":
			if(this.onmouseup != null) this.onmouseup(mouseEvent);
			break;
		}
	}
	,dispatchMouseWheelEvent: function(mouseWheelEvent) {
		if(this.onmousewheel != null) this.onmousewheel(mouseWheelEvent);
	}
	,dispatchKeyboardEvent: function(keyboardEvent) {
		switch(keyboardEvent.type) {
		case "keydown":
			if(this.onkeydown != null) this.onkeydown(keyboardEvent);
			break;
		case "keyup":
			if(this.onkeyup != null) this.onkeyup(keyboardEvent);
			break;
		}
	}
	,dispatchUIEvent: function(uiEvent) {
		if(this.onresize != null) this.onresize(uiEvent);
	}
	,dispatchFullScreenEvent: function(event) {
		if(this.onfullscreenchange != null) this.onfullscreenchange(event);
	}
	,get_innerHeight: function() {
		return this._nativeWindow.get_innerHeight();
	}
	,get_innerWidth: function() {
		return this._nativeWindow.get_innerWidth();
	}
	,__class__: cocktail.port.platform.Platform
	,__properties__: $extend(cocktail.core.event.EventCallback.prototype.__properties__,{get_innerWidth:"get_innerWidth",get_innerHeight:"get_innerHeight"})
});
if(!cocktail.port.platform.keyboard) cocktail.port.platform.keyboard = {}
cocktail.port.platform.keyboard.AbstractKeyboard = $hxClasses["cocktail.port.platform.keyboard.AbstractKeyboard"] = function() {
	this.setNativeListeners();
};
cocktail.port.platform.keyboard.AbstractKeyboard.__name__ = ["cocktail","port","platform","keyboard","AbstractKeyboard"];
cocktail.port.platform.keyboard.AbstractKeyboard.prototype = {
	onKeyDown: null
	,onKeyUp: null
	,onNativeKeyDown: function(event) {
		if(this.onKeyDown != null) this.onKeyDown(this.getKeyData(event));
	}
	,onNativeKeyUp: function(event) {
		if(this.onKeyUp != null) this.onKeyUp(this.getKeyData(event));
	}
	,setNativeListeners: function() {
	}
	,removeNativeListeners: function() {
	}
	,getKeyData: function(event) {
		return null;
	}
	,__class__: cocktail.port.platform.keyboard.AbstractKeyboard
}
if(!cocktail.port.platform.mouse) cocktail.port.platform.mouse = {}
cocktail.port.platform.mouse.AbstractMouse = $hxClasses["cocktail.port.platform.mouse.AbstractMouse"] = function() {
	this.setNativeListeners();
};
cocktail.port.platform.mouse.AbstractMouse.__name__ = ["cocktail","port","platform","mouse","AbstractMouse"];
cocktail.port.platform.mouse.AbstractMouse.prototype = {
	onMouseDown: null
	,onMouseUp: null
	,onMouseMove: null
	,onMouseWheel: null
	,setMouseCursor: function(cursor) {
	}
	,onNativeMouseDown: function(event) {
		if(this.onMouseDown != null) this.onMouseDown(this.getMouseEvent(event));
	}
	,onNativeMouseUp: function(event) {
		if(this.onMouseUp != null) this.onMouseUp(this.getMouseEvent(event));
	}
	,onNativeMouseMove: function(event) {
		if(this.onMouseMove != null) this.onMouseMove(this.getMouseEvent(event));
	}
	,onNativeMouseWheel: function(event) {
		if(this.onMouseWheel != null) this.onMouseWheel(this.getWheelEvent(event));
	}
	,setNativeListeners: function() {
	}
	,removeNativeListeners: function() {
	}
	,getMouseEvent: function(event) {
		return null;
	}
	,getWheelEvent: function(event) {
		return null;
	}
	,__class__: cocktail.port.platform.mouse.AbstractMouse
}
if(!cocktail.port.platform.nativeMedia) cocktail.port.platform.nativeMedia = {}
cocktail.port.platform.nativeMedia.NativeMedia = $hxClasses["cocktail.port.platform.nativeMedia.NativeMedia"] = function() {
};
cocktail.port.platform.nativeMedia.NativeMedia.__name__ = ["cocktail","port","platform","nativeMedia","NativeMedia"];
cocktail.port.platform.nativeMedia.NativeMedia.prototype = {
	duration: null
	,volume: null
	,src: null
	,width: null
	,height: null
	,currentTime: null
	,nativeElement: null
	,bytesLoaded: null
	,bytesTotal: null
	,onLoadedMetaData: null
	,play: function() {
	}
	,pause: function() {
	}
	,seek: function(time) {
	}
	,canPlayType: function(type) {
		return null;
	}
	,onNativeLoadedMetaData: function() {
		if(this.onLoadedMetaData != null) {
			var loaddedMetadataEvent = new cocktail.core.event.Event();
			loaddedMetadataEvent.initEvent("loadedmetadata",false,false);
			this.onLoadedMetaData(loaddedMetadataEvent);
		}
	}
	,get_bytesTotal: function() {
		return 0;
	}
	,get_bytesLoaded: function() {
		return 0;
	}
	,get_currentTime: function() {
		return 0;
	}
	,get_height: function() {
		return null;
	}
	,get_width: function() {
		return null;
	}
	,get_nativeElement: function() {
		return null;
	}
	,get_duration: function() {
		return 0;
	}
	,set_src: function(value) {
		return value;
	}
	,set_volume: function(value) {
		return value;
	}
	,__class__: cocktail.port.platform.nativeMedia.NativeMedia
	,__properties__: {get_bytesTotal:"get_bytesTotal",get_bytesLoaded:"get_bytesLoaded",get_nativeElement:"get_nativeElement",get_currentTime:"get_currentTime",get_height:"get_height",get_width:"get_width",set_src:"set_src",set_volume:"set_volume",get_duration:"get_duration"}
}
if(!cocktail.port.platform.nativeWindow) cocktail.port.platform.nativeWindow = {}
cocktail.port.platform.nativeWindow.AbstractNativeWindow = $hxClasses["cocktail.port.platform.nativeWindow.AbstractNativeWindow"] = function() {
	this.setNativeListeners();
};
cocktail.port.platform.nativeWindow.AbstractNativeWindow.__name__ = ["cocktail","port","platform","nativeWindow","AbstractNativeWindow"];
cocktail.port.platform.nativeWindow.AbstractNativeWindow.prototype = {
	onResize: null
	,onFullScreenChange: null
	,innerHeight: null
	,innerWidth: null
	,open: function(url,name) {
	}
	,enterFullscreen: function() {
	}
	,exitFullscreen: function() {
	}
	,fullscreen: function() {
		return false;
	}
	,onNativeResize: function(event) {
		if(this.onResize != null) this.onResize(this.getUIEvent(event));
	}
	,onNativeFullScreenChange: function(event) {
		if(this.onFullScreenChange != null) this.onFullScreenChange(this.getEvent(event));
	}
	,setNativeListeners: function() {
	}
	,removeNativeListeners: function() {
	}
	,getUIEvent: function(event) {
		return null;
	}
	,getEvent: function(event) {
		return null;
	}
	,get_innerHeight: function() {
		return -1;
	}
	,get_innerWidth: function() {
		return -1;
	}
	,__class__: cocktail.port.platform.nativeWindow.AbstractNativeWindow
	,__properties__: {get_innerWidth:"get_innerWidth",get_innerHeight:"get_innerHeight"}
}
cocktail.port.server.FontLoader = $hxClasses["cocktail.port.server.FontLoader"] = function() {
	cocktail.core.font.AbstractFontLoader.call(this);
};
cocktail.port.server.FontLoader.__name__ = ["cocktail","port","server","FontLoader"];
cocktail.port.server.FontLoader.__super__ = cocktail.core.font.AbstractFontLoader;
cocktail.port.server.FontLoader.prototype = $extend(cocktail.core.font.AbstractFontLoader.prototype,{
	__class__: cocktail.port.server.FontLoader
});
cocktail.port.server.FontManager = $hxClasses["cocktail.port.server.FontManager"] = function() {
	cocktail.core.font.AbstractFontManager.call(this);
};
cocktail.port.server.FontManager.__name__ = ["cocktail","port","server","FontManager"];
cocktail.port.server.FontManager.__super__ = cocktail.core.font.AbstractFontManager;
cocktail.port.server.FontManager.prototype = $extend(cocktail.core.font.AbstractFontManager.prototype,{
	__class__: cocktail.port.server.FontManager
});
cocktail.port.server.Keyboard = $hxClasses["cocktail.port.server.Keyboard"] = function() {
	cocktail.port.platform.keyboard.AbstractKeyboard.call(this);
};
cocktail.port.server.Keyboard.__name__ = ["cocktail","port","server","Keyboard"];
cocktail.port.server.Keyboard.__super__ = cocktail.port.platform.keyboard.AbstractKeyboard;
cocktail.port.server.Keyboard.prototype = $extend(cocktail.port.platform.keyboard.AbstractKeyboard.prototype,{
	__class__: cocktail.port.server.Keyboard
});
cocktail.port.server.Mouse = $hxClasses["cocktail.port.server.Mouse"] = function() {
	cocktail.port.platform.mouse.AbstractMouse.call(this);
};
cocktail.port.server.Mouse.__name__ = ["cocktail","port","server","Mouse"];
cocktail.port.server.Mouse.__super__ = cocktail.port.platform.mouse.AbstractMouse;
cocktail.port.server.Mouse.prototype = $extend(cocktail.port.platform.mouse.AbstractMouse.prototype,{
	__class__: cocktail.port.server.Mouse
});
cocktail.port.server.NativeVideo = $hxClasses["cocktail.port.server.NativeVideo"] = function() {
	cocktail.port.platform.nativeMedia.NativeMedia.call(this);
};
cocktail.port.server.NativeVideo.__name__ = ["cocktail","port","server","NativeVideo"];
cocktail.port.server.NativeVideo.__super__ = cocktail.port.platform.nativeMedia.NativeMedia;
cocktail.port.server.NativeVideo.prototype = $extend(cocktail.port.platform.nativeMedia.NativeMedia.prototype,{
	__class__: cocktail.port.server.NativeVideo
});
cocktail.port.server.NativeWindow = $hxClasses["cocktail.port.server.NativeWindow"] = function() {
	cocktail.port.platform.nativeWindow.AbstractNativeWindow.call(this);
};
cocktail.port.server.NativeWindow.__name__ = ["cocktail","port","server","NativeWindow"];
cocktail.port.server.NativeWindow.__super__ = cocktail.port.platform.nativeWindow.AbstractNativeWindow;
cocktail.port.server.NativeWindow.prototype = $extend(cocktail.port.platform.nativeWindow.AbstractNativeWindow.prototype,{
	__class__: cocktail.port.server.NativeWindow
});
cocktail.port.server.Resource = $hxClasses["cocktail.port.server.Resource"] = function(url) {
	cocktail.core.resource.AbstractResource.call(this,url);
};
cocktail.port.server.Resource.__name__ = ["cocktail","port","server","Resource"];
cocktail.port.server.Resource.__super__ = cocktail.core.resource.AbstractResource;
cocktail.port.server.Resource.prototype = $extend(cocktail.core.resource.AbstractResource.prototype,{
	__class__: cocktail.port.server.Resource
});
var dto = dto || {}
dto.FileVO = $hxClasses["dto.FileVO"] = function() {
};
dto.FileVO.__name__ = ["dto","FileVO"];
dto.FileVO.prototype = {
	name: null
	,path: null
	,extension: null
	,size: null
	,accessed: null
	,created: null
	,modified: null
	,toString: function() {
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
	,__class__: dto.FileVO
}
dto.FolderVO = $hxClasses["dto.FolderVO"] = function() {
	this.open = false;
};
dto.FolderVO.__name__ = ["dto","FolderVO"];
dto.FolderVO.prototype = {
	name: null
	,path: null
	,open: null
	,children: null
	,toString: function() {
		var l_result = "FileVO {\n";
		l_result += "\t name: " + this.name + "\n";
		l_result += "\t path: " + this.path + "\n";
		l_result += "\t children: " + this.children.join(",") + "\n";
		return l_result;
	}
	,__class__: dto.FolderVO
}
var frontend = frontend || {}
frontend.FileManager = $hxClasses["frontend.FileManager"] = function() {
	this._filesModel = new frontend.model.FilesModel();
	this._filesModel.getTreeFolder("../files",this.updateDataTree.$bind(this));
	this._body = js.Lib.document.body;
	this.setBodyStyle(this._body);
	this._mainContainer = js.Lib.document.createElement("div");
	this.setMainContainerStyle(this._mainContainer);
	this._body.appendChild(this._mainContainer);
};
frontend.FileManager.__name__ = ["frontend","FileManager"];
frontend.FileManager.prototype = {
	_body: null
	,_mainContainer: null
	,_filesModel: null
	,_filesList: null
	,updateFilesList: function(inDataString) {
		haxe.Log.trace("FileManager - updateFilesList() " + inDataString,{ fileName : "FileManager.hx", lineNumber : 42, className : "frontend.FileManager", methodName : "updateFilesList"});
		var data = haxe.Json.parse(inDataString);
		this._filesList.setList(data);
	}
	,updateDataTree: function(inDataString) {
		var data = haxe.Json.parse(inDataString);
		var folderTree = new frontend.views.FolderTreeView();
		folderTree.onSelectFolder = this.requestFiles.$bind(this);
		this._mainContainer.appendChild(folderTree.get_view());
		this._filesList = new frontend.views.FilesView();
		this._mainContainer.appendChild(this._filesList.get_view());
		folderTree.initialize(data);
	}
	,requestFiles: function(folderPath) {
		this._filesModel.getFiles(folderPath,this.updateFilesList.$bind(this));
	}
	,setMainContainerStyle: function(domElement) {
		domElement.style.display = "block";
		domElement.style.overflowY = "hidden";
		domElement.style.width = "800px";
		domElement.style.marginLeft = "0";
		domElement.style.marginRight = "0";
		domElement.style.top = "30px";
	}
	,setBodyStyle: function(domElement) {
		domElement.style.fontFamily = "HelveticaNeue, Sans-Serif, Arial";
	}
	,__class__: frontend.FileManager
}
if(!frontend.model) frontend.model = {}
frontend.model.FilesModel = $hxClasses["frontend.model.FilesModel"] = function() {
};
frontend.model.FilesModel.__name__ = ["frontend","model","FilesModel"];
frontend.model.FilesModel.prototype = {
	getTreeFolder: function(folderpath,callBack) {
		var url = "server/?service=folders&folderpath=" + folderpath;
		var treeLoader = new frontend.services.JSONLoader();
		treeLoader.loadJSON(url);
		treeLoader.onLoad = callBack;
	}
	,getFiles: function(folderpath,callBack) {
		var url = "server/?service=files&folderpath=" + folderpath;
		var filesListLoader = new frontend.services.JSONLoader();
		filesListLoader.loadJSON(url);
		filesListLoader.onLoad = callBack;
	}
	,__class__: frontend.model.FilesModel
}
if(!frontend.services) frontend.services = {}
frontend.services.JSONLoader = $hxClasses["frontend.services.JSONLoader"] = function() {
};
frontend.services.JSONLoader.__name__ = ["frontend","services","JSONLoader"];
frontend.services.JSONLoader.prototype = {
	onLoad: null
	,loadJSON: function(jsonUrl) {
		var http = new haxe.Http(jsonUrl);
		http.onData = this.onJSONLoaded.$bind(this);
		http.onError = this.onJSONError.$bind(this);
		http.request(false);
	}
	,onJSONError: function(msg) {
		haxe.Log.trace("Error while loading JSON Data : " + msg,{ fileName : "JSONLoader.hx", lineNumber : 50, className : "frontend.services.JSONLoader", methodName : "onJSONError"});
	}
	,onJSONLoaded: function(jsonString) {
		if(this.onLoad != null) this.onLoad(jsonString);
	}
	,__class__: frontend.services.JSONLoader
}
if(!frontend.styles) frontend.styles = {}
frontend.styles.FontPrefinedStyle = $hxClasses["frontend.styles.FontPrefinedStyle"] = function() {
};
frontend.styles.FontPrefinedStyle.__name__ = ["frontend","styles","FontPrefinedStyle"];
frontend.styles.FontPrefinedStyle.getFontStyle = function(domElement,type) {
	switch( (type)[1] ) {
	case 1:
		domElement.style.fontSize = cocktail.core.unit.UnitManager.getCSSFontSize(cocktail.core.style.FontSize.absoluteSize(cocktail.core.unit.FontSizeAbsoluteSize.small));
		domElement.style.fontWeight = cocktail.core.unit.UnitManager.getCSSFontWeight(cocktail.core.style.FontWeight.normal);
		break;
	case 0:
		domElement.style.fontSize = cocktail.core.unit.UnitManager.getCSSFontSize(cocktail.core.style.FontSize.absoluteSize(cocktail.core.unit.FontSizeAbsoluteSize.small));
		domElement.style.fontWeight = cocktail.core.unit.UnitManager.getCSSFontWeight(cocktail.core.style.FontWeight.bold);
		break;
	case 2:
		domElement.style.fontSize = cocktail.core.unit.UnitManager.getCSSFontSize(cocktail.core.style.FontSize.absoluteSize(cocktail.core.unit.FontSizeAbsoluteSize.medium));
		domElement.style.fontWeight = cocktail.core.unit.UnitManager.getCSSFontWeight(cocktail.core.style.FontWeight.bold);
		break;
	case 3:
		domElement.style.fontSize = cocktail.core.unit.UnitManager.getCSSFontSize(cocktail.core.style.FontSize.absoluteSize(cocktail.core.unit.FontSizeAbsoluteSize.medium));
		domElement.style.fontWeight = cocktail.core.unit.UnitManager.getCSSFontWeight(cocktail.core.style.FontWeight.normal);
		break;
	case 4:
		domElement.style.fontSize = cocktail.core.unit.UnitManager.getCSSFontSize(cocktail.core.style.FontSize.absoluteSize(cocktail.core.unit.FontSizeAbsoluteSize.xSmall));
		domElement.style.fontWeight = cocktail.core.unit.UnitManager.getCSSFontWeight(cocktail.core.style.FontWeight.normal);
		break;
	case 5:
		domElement.style.fontSize = cocktail.core.unit.UnitManager.getCSSFontSize(cocktail.core.style.FontSize.absoluteSize(cocktail.core.unit.FontSizeAbsoluteSize.large));
		domElement.style.fontWeight = cocktail.core.unit.UnitManager.getCSSFontWeight(cocktail.core.style.FontWeight.bold);
		break;
	}
}
frontend.styles.FontPrefinedStyle.prototype = {
	__class__: frontend.styles.FontPrefinedStyle
}
frontend.styles.EFontStyle = $hxClasses["frontend.styles.EFontStyle"] = { __ename__ : ["frontend","styles","EFontStyle"], __constructs__ : ["BUTTON","BODY","HEADLINE","SUBHEAD","SMALLPRINT","OVERSIZED"] }
frontend.styles.EFontStyle.BUTTON = ["BUTTON",0];
frontend.styles.EFontStyle.BUTTON.toString = $estr;
frontend.styles.EFontStyle.BUTTON.__enum__ = frontend.styles.EFontStyle;
frontend.styles.EFontStyle.BODY = ["BODY",1];
frontend.styles.EFontStyle.BODY.toString = $estr;
frontend.styles.EFontStyle.BODY.__enum__ = frontend.styles.EFontStyle;
frontend.styles.EFontStyle.HEADLINE = ["HEADLINE",2];
frontend.styles.EFontStyle.HEADLINE.toString = $estr;
frontend.styles.EFontStyle.HEADLINE.__enum__ = frontend.styles.EFontStyle;
frontend.styles.EFontStyle.SUBHEAD = ["SUBHEAD",3];
frontend.styles.EFontStyle.SUBHEAD.toString = $estr;
frontend.styles.EFontStyle.SUBHEAD.__enum__ = frontend.styles.EFontStyle;
frontend.styles.EFontStyle.SMALLPRINT = ["SMALLPRINT",4];
frontend.styles.EFontStyle.SMALLPRINT.toString = $estr;
frontend.styles.EFontStyle.SMALLPRINT.__enum__ = frontend.styles.EFontStyle;
frontend.styles.EFontStyle.OVERSIZED = ["OVERSIZED",5];
frontend.styles.EFontStyle.OVERSIZED.toString = $estr;
frontend.styles.EFontStyle.OVERSIZED.__enum__ = frontend.styles.EFontStyle;
if(!frontend.views) frontend.views = {}
if(!frontend.views.base) frontend.views.base = {}
frontend.views.base.View = $hxClasses["frontend.views.base.View"] = function() {
};
frontend.views.base.View.__name__ = ["frontend","views","base","View"];
frontend.views.base.View.prototype = {
	_view: null
	,get_view: function() {
		return this._view;
	}
	,view: null
	,clear: function() {
		var childNodes = this._view.childNodes.length;
		while(this._view.hasChildNodes()) {
			var child = this._view.childNodes[0];
			this._view.removeChild(child);
		}
	}
	,__class__: frontend.views.base.View
	,__properties__: {get_view:"get_view"}
}
frontend.views.FilesView = $hxClasses["frontend.views.FilesView"] = function() {
	this._view = js.Lib.document.createElement("div");
	this._view.style.cssFloat = "left";
	frontend.views.base.View.call(this);
};
frontend.views.FilesView.__name__ = ["frontend","views","FilesView"];
frontend.views.FilesView.__super__ = frontend.views.base.View;
frontend.views.FilesView.prototype = $extend(frontend.views.base.View.prototype,{
	setList: function(data) {
		this.clear();
		var _g1 = 0, _g = data.length;
		while(_g1 < _g) {
			var i = _g1++;
			var file = new frontend.views.uis.FileUI(data[i]);
			this._view.appendChild(file.get_view());
		}
	}
	,__class__: frontend.views.FilesView
});
frontend.views.FolderTreeView = $hxClasses["frontend.views.FolderTreeView"] = function() {
	this._view = js.Lib.document.createElement("div");
	this._view.style.width = "300px";
	this._view.style.cssFloat = "left";
	this._folderStatus = new Hash();
	frontend.views.base.View.call(this);
};
frontend.views.FolderTreeView.__name__ = ["frontend","views","FolderTreeView"];
frontend.views.FolderTreeView.__super__ = frontend.views.base.View;
frontend.views.FolderTreeView.prototype = $extend(frontend.views.base.View.prototype,{
	_rootFolder: null
	,_data: null
	,_folderStatus: null
	,onSelectFolder: null
	,_currentFolderUISelected: null
	,initialize: function(data) {
		this._data = data;
		this.buildView();
	}
	,buildView: function() {
		this._rootFolder = new frontend.views.uis.FolderUI(this._data.children.length > 0,0,this._data.name);
		this._rootFolder.isOpen = this._data.open;
		var folderPath = this._data.path + "/" + this._data.name;
		this._folderStatus.set(folderPath,this._data.open);
		this.makeInteractive(this._rootFolder,this._data);
		this._view.appendChild(this._rootFolder.get_view());
		this.createSubFolders(this._data,this._rootFolder,1);
	}
	,createSubFolders: function(currentFolder,target,inDescendant) {
		var _g1 = 0, _g = currentFolder.children.length;
		while(_g1 < _g) {
			var i = _g1++;
			var child = currentFolder.children[i];
			var childPath = child.path + "/" + child.name;
			target.isOpen = this._folderStatus.exists(childPath)?this._folderStatus.get(childPath):target.isOpen;
			var folderChild = new frontend.views.uis.FolderUI(child.children.length > 0,inDescendant,child.name);
			target.subFolders.push(folderChild);
			this._view.appendChild(folderChild.get_view());
			folderChild.isVisible = target.isOpen;
			folderChild.refresh();
			folderChild.isOpen = child.open;
			this.makeInteractive(folderChild,child);
			this.createSubFolders(child,folderChild,inDescendant + 1);
		}
	}
	,updateSubFolders: function(target) {
		var _g1 = 0, _g = target.subFolders.length;
		while(_g1 < _g) {
			var i = _g1++;
			var folderChild = target.subFolders[i];
			folderChild.isVisible = target.isOpen;
			folderChild.refresh();
		}
	}
	,makeInteractive: function(folder,data) {
		var handelClickCallback = (function(f,a1,a2) {
			return function(a3) {
				return f(a1,a2,a3);
			};
		})(this.handleOnFolderClick.$bind(this),folder,data);
		folder.get_view().onclick = handelClickCallback;
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
		this.updateSubFolders(target);
		target.refresh();
		this.onSelectFolder(folderPath);
	}
	,__class__: frontend.views.FolderTreeView
});
if(!frontend.views.uis) frontend.views.uis = {}
frontend.views.uis.FileUI = $hxClasses["frontend.views.uis.FileUI"] = function(data) {
	this._view = js.Lib.document.createElement("span");
	var nameFile = js.Lib.document.createTextNode(data.name);
	this._view.appendChild(nameFile);
	this.setStyle(data);
	frontend.views.base.View.call(this);
};
frontend.views.uis.FileUI.__name__ = ["frontend","views","uis","FileUI"];
frontend.views.uis.FileUI.__super__ = frontend.views.base.View;
frontend.views.uis.FileUI.prototype = $extend(frontend.views.base.View.prototype,{
	setStyle: function(data) {
		this._view.style.backgroundPosition = "left center";
		this._view.style.backgroundRepeat = "no-repeat";
		this._view.style.paddingLeft = "50px";
		this._view.style.display = "block";
		this._view.style.paddingTop = "2px";
		this._view.style.width = "250px";
		this._view.style.cursor = cocktail.core.unit.UnitManager.getCSSCursor(cocktail.core.style.Cursor.pointer);
		this._view.style.backgroundImage = "url('imgs/icons/" + data.extension + ".png')";
		this._view.style.height = "25px";
		this._view.style.marginLeft = "20px";
		frontend.styles.FontPrefinedStyle.getFontStyle(this._view,frontend.styles.EFontStyle.BODY);
	}
	,__class__: frontend.views.uis.FileUI
});
frontend.views.uis.FolderUI = $hxClasses["frontend.views.uis.FolderUI"] = function(isFull,isDescendant,inTitle) {
	this._view = js.Lib.document.createElement("span");
	this._title = inTitle;
	this._isFull = isFull;
	this._isDescendant = isDescendant;
	this.isSelected = false;
	this.isOpen = false;
	this.isVisible = true;
	this.subFolders = new Array();
	this.setStyle();
	frontend.views.base.View.call(this);
};
frontend.views.uis.FolderUI.__name__ = ["frontend","views","uis","FolderUI"];
frontend.views.uis.FolderUI.__super__ = frontend.views.base.View;
frontend.views.uis.FolderUI.prototype = $extend(frontend.views.base.View.prototype,{
	_title: null
	,_isFull: null
	,_isDescendant: null
	,isOpen: null
	,isSelected: null
	,isVisible: null
	,subFolders: null
	,setStyle: function() {
		this.clear();
		if(!this.isVisible) {
			this._view.style.height = "0px";
			this.isSelected = false;
			var _g1 = 0, _g = this.subFolders.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.subFolders[i].isVisible = false;
				this.subFolders[i].refresh();
			}
			return;
		} else if(this.isOpen) {
			var _g1 = 0, _g = this.subFolders.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.subFolders[i].isVisible = true;
				this.subFolders[i].refresh();
			}
		}
		switch(true) {
		case this.isSelected == true && this._isFull == true && this.isOpen == true:
			this._view.style.backgroundImage = "url('imgs/selected_open_full.png')";
			break;
		case this.isSelected == true && this._isFull == false && this.isOpen == true:
			this._view.style.backgroundImage = "url('imgs/selected_open_empty.png')";
			break;
		case this.isSelected == true && this._isFull == false && this.isOpen == false:
			this._view.style.backgroundImage = "url('imgs/selected_closed_empty.png')";
			break;
		case this.isSelected == true && this._isFull == true && this.isOpen == false:
			this._view.style.backgroundImage = "url('imgs/selected_closed_full.png')";
			break;
		case this.isSelected == false && this._isFull == true && this.isOpen == true:
			this._view.style.backgroundImage = "url('imgs/notselected_open_full.png')";
			break;
		case this.isSelected == false && this._isFull == true && this.isOpen == false:
			this._view.style.backgroundImage = "url('imgs/notselected_closed_full.png')";
			break;
		case this.isSelected == false && this._isFull == false && this.isOpen == false:
			this._view.style.backgroundImage = "url('imgs/notselected_closed_empty.png')";
			break;
		case this.isSelected == false && this._isFull == false && this.isOpen == true:
			this._view.style.backgroundImage = "url('imgs/notselected_open_empty.png')";
			break;
		}
		var title = js.Lib.document.createTextNode(this._title);
		this._view.appendChild(title);
		this._view.style.backgroundPosition = "left center";
		this._view.style.backgroundRepeat = "no-repeat";
		this._view.style.paddingLeft = "50px";
		this._view.style.display = "block";
		this._view.style.marginTop = "5px";
		this._view.style.height = null;
		this._view.style.width = "250px";
		this._view.style.cursor = cocktail.core.unit.UnitManager.getCSSCursor(cocktail.core.style.Cursor.pointer);
		this._view.style.marginLeft = Std.string(this._isDescendant * 20 + "px");
		frontend.styles.FontPrefinedStyle.getFontStyle(this._view,frontend.styles.EFontStyle.BODY);
	}
	,refresh: function() {
		this.setStyle();
	}
	,__class__: frontend.views.uis.FolderUI
});
var haxe = haxe || {}
haxe.Http = $hxClasses["haxe.Http"] = function(url) {
	this.url = url;
	this.headers = new Hash();
	this.params = new Hash();
	this.async = true;
};
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
	url: null
	,async: null
	,postData: null
	,headers: null
	,params: null
	,setHeader: function(header,value) {
		this.headers.set(header,value);
	}
	,setParameter: function(param,value) {
		this.params.set(param,value);
	}
	,setPostData: function(data) {
		this.postData = data;
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
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,__class__: haxe.Http
}
haxe.Json = $hxClasses["haxe.Json"] = function() {
};
haxe.Json.__name__ = ["haxe","Json"];
haxe.Json.parse = function(text) {
	return new haxe.Json().doParse(text);
}
haxe.Json.stringify = function(value) {
	return new haxe.Json().toString(value);
}
haxe.Json.prototype = {
	buf: null
	,str: null
	,pos: null
	,reg_float: null
	,toString: function(v) {
		this.buf = new StringBuf();
		this.toStringRec(v);
		return this.buf.b.join("");
	}
	,objString: function(v) {
		var first = true;
		this.buf.add("{");
		var _g = 0, _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			var value = Reflect.field(v,f);
			if(Reflect.isFunction(value)) continue;
			if(first) first = false; else this.buf.add(",");
			this.quote(f);
			this.buf.add(":");
			this.toStringRec(value);
		}
		this.buf.add("}");
	}
	,toStringRec: function(v) {
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 8:
			this.buf.add("\"???\"");
			break;
		case 4:
			this.objString(v);
			break;
		case 1:
		case 2:
			this.buf.add(v);
			break;
		case 5:
			this.buf.add("\"<fun>\"");
			break;
		case 6:
			var c = $e[2];
			if(c == String) this.quote(v); else if(c == Array) {
				var v1 = v;
				this.buf.add("[");
				var len = v1.length;
				if(len > 0) {
					this.toStringRec(v1[0]);
					var i = 1;
					while(i < len) {
						this.buf.add(",");
						this.toStringRec(v1[i++]);
					}
				}
				this.buf.add("]");
			} else if(c == Hash) {
				var v1 = v;
				var o = { };
				var $it0 = v1.keys();
				while( $it0.hasNext() ) {
					var k = $it0.next();
					o[k] = v1.get(k);
				}
				this.objString(o);
			} else if(v.iterator != null) {
				var a = [];
				var it = v.iterator();
				while( it.hasNext() ) {
					var v1 = it.next();
					a.push(v1);
				}
				this.toStringRec(a);
			} else this.objString(v);
			break;
		case 7:
			var e = $e[2];
			this.buf.add(v[1]);
			break;
		case 3:
			this.buf.add(v?"true":"false");
			break;
		case 0:
			this.buf.add("null");
			break;
		}
	}
	,quote: function(s) {
		this.buf.add("\"");
		var i = 0;
		while(true) {
			var c = s.cca(i++);
			if(c != c) break;
			switch(c) {
			case 34:
				this.buf.add("\\\"");
				break;
			case 92:
				this.buf.add("\\\\");
				break;
			case 10:
				this.buf.add("\\n");
				break;
			case 13:
				this.buf.add("\\r");
				break;
			case 9:
				this.buf.add("\\t");
				break;
			case 8:
				this.buf.add("\\b");
				break;
			case 12:
				this.buf.add("\\f");
				break;
			default:
				this.buf.addChar(c);
			}
		}
		this.buf.add("\"");
	}
	,doParse: function(str) {
		this.reg_float = new EReg("^-?(0|[1-9][0-9]*)(\\.[0-9]+)?([eE][+-]?[0-9]+)?","");
		this.str = str;
		this.pos = 0;
		return this.parseRec();
	}
	,invalidChar: function() {
		this.pos--;
		throw "Invalid char " + this.str.cca(this.pos) + " at position " + this.pos;
	}
	,nextChar: function() {
		return this.str.cca(this.pos++);
	}
	,parseRec: function() {
		while(true) {
			var c = this.str.cca(this.pos++);
			switch(c) {
			case 32:case 13:case 10:case 9:
				break;
			case 123:
				var obj = { }, field = null, comma = null;
				while(true) {
					var c1 = this.str.cca(this.pos++);
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
					var c1 = this.str.cca(this.pos++);
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
				if(this.str.cca(this.pos++) != 114 || this.str.cca(this.pos++) != 117 || this.str.cca(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return true;
			case 102:
				var save = this.pos;
				if(this.str.cca(this.pos++) != 97 || this.str.cca(this.pos++) != 108 || this.str.cca(this.pos++) != 115 || this.str.cca(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return false;
			case 110:
				var save = this.pos;
				if(this.str.cca(this.pos++) != 117 || this.str.cca(this.pos++) != 108 || this.str.cca(this.pos++) != 108) {
					this.pos = save;
					this.invalidChar();
				}
				return null;
			case 34:
				return this.parseString();
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
				this.pos--;
				if(!this.reg_float.match(this.str.substr(this.pos))) throw "Invalid float at position " + this.pos;
				var v = this.reg_float.matched(0);
				this.pos += v.length;
				var f = Std.parseFloat(v);
				var i = f | 0;
				return i == f?i:f;
			default:
				this.invalidChar();
			}
		}
		return null;
	}
	,parseString: function() {
		var start = this.pos;
		var buf = new StringBuf();
		while(true) {
			var c = this.str.cca(this.pos++);
			if(c == 34) break;
			if(c == 92) {
				buf.b[buf.b.length] = this.str.substr(start,this.pos - start - 1);
				c = this.str.cca(this.pos++);
				switch(c) {
				case 114:
					buf.b[buf.b.length] = String.fromCharCode(13);
					break;
				case 110:
					buf.b[buf.b.length] = String.fromCharCode(10);
					break;
				case 116:
					buf.b[buf.b.length] = String.fromCharCode(9);
					break;
				case 98:
					buf.b[buf.b.length] = String.fromCharCode(8);
					break;
				case 102:
					buf.b[buf.b.length] = String.fromCharCode(12);
					break;
				case 47:case 92:case 34:
					buf.b[buf.b.length] = String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + this.str.substr(this.pos,4));
					this.pos += 4;
					buf.b[buf.b.length] = String.fromCharCode(uc);
					break;
				default:
					throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
				}
				start = this.pos;
			} else if(c != c) throw "Unclosed string";
		}
		buf.b[buf.b.length] = this.str.substr(start,this.pos - start - 1);
		return buf.b.join("");
	}
	,__class__: haxe.Json
}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Log.prototype = {
	__class__: haxe.Log
}
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = $hxClasses["haxe.Stack"] = function() { }
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	return [];
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
		b.b[b.b.length] = "\nCalled from ";
		haxe.Stack.itemToString(b,s);
	}
	return b.b.join("");
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b[b.b.length] = "a C function";
		break;
	case 1:
		var m = $e[2];
		b.b[b.b.length] = "module ";
		b.b[b.b.length] = m == null?"null":m;
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b[b.b.length] = " (";
		}
		b.b[b.b.length] = file == null?"null":file;
		b.b[b.b.length] = " line ";
		b.b[b.b.length] = line == null?"null":line;
		if(s1 != null) b.b[b.b.length] = ")";
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b[b.b.length] = cname == null?"null":cname;
		b.b[b.b.length] = ".";
		b.b[b.b.length] = meth == null?"null":meth;
		break;
	case 4:
		var n = $e[2];
		b.b[b.b.length] = "local function #";
		b.b[b.b.length] = n == null?"null":n;
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	return null;
}
haxe.Stack.prototype = {
	__class__: haxe.Stack
}
haxe.Timer = $hxClasses["haxe.Timer"] = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
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
	return Date.now().getTime() / 1000;
}
haxe.Timer.prototype = {
	id: null
	,stop: function() {
		if(this.id == null) return;
		window.clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe.Timer
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ != null || o.__ename__ != null)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__ != null) {
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
		return o.__enum__ == cl || cl == Class && o.__name__ != null || cl == Enum && o.__ename__ != null;
	}
}
js.Boot.__init = function() {
	js.Lib.isIE = typeof document!='undefined' && document.all != null && typeof window!='undefined' && window.opera == null;
	js.Lib.isOpera = typeof window!='undefined' && window.opera != null;
	Array.prototype.copy = Array.prototype.slice;
	Array.prototype.insert = function(i,x) {
		this.splice(i,0,x);
	};
	Array.prototype.remove = Array.prototype.indexOf?function(obj) {
		var idx = this.indexOf(obj);
		if(idx == -1) return false;
		this.splice(idx,1);
		return true;
	}:function(obj) {
		var i = 0;
		var l = this.length;
		while(i < l) {
			if(this[i] == obj) {
				this.splice(i,1);
				return true;
			}
			i++;
		}
		return false;
	};
	Array.prototype.iterator = function() {
		return { cur : 0, arr : this, hasNext : function() {
			return this.cur < this.arr.length;
		}, next : function() {
			return this.arr[this.cur++];
		}};
	};
	if(String.prototype.cca == null) String.prototype.cca = String.prototype.charCodeAt;
	String.prototype.charCodeAt = function(i) {
		var x = this.cca(i);
		if(x != x) return undefined;
		return x;
	};
	var oldsub = String.prototype.substr;
	String.prototype.substr = function(pos,len) {
		if(pos != null && pos != 0 && len != null && len < 0) return "";
		if(len == null) len = this.length;
		if(pos < 0) {
			pos = this.length + pos;
			if(pos < 0) pos = 0;
		} else if(len < 0) len = this.length + len - pos;
		return oldsub.apply(this,[pos,len]);
	};
	Function.prototype["$bind"] = function(o) {
		var f = function() {
			return f.method.apply(f.scope,arguments);
		};
		f.scope = o;
		f.method = this;
		return f;
	};
}
js.Boot.prototype = {
	__class__: js.Boot
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.isIE = null;
js.Lib.isOpera = null;
js.Lib.document = null;
js.Lib.window = null;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
js.Lib.prototype = {
	__class__: js.Lib
}
var lib = lib || {}
if(!lib.haxe) lib.haxe = {}
if(!lib.haxe.xml) lib.haxe.xml = {}
lib.haxe.xml.Parser = $hxClasses["lib.haxe.xml.Parser"] = function() { }
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
	var c = str.cca(p);
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
				var child = Xml.createPCData(str.substr(start,p - start));
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			}
			break;
		case 17:
			if(c == 93 && str.cca(p + 1) == 93 && str.cca(p + 2) == 62) {
				var child = Xml.createCData(str.substr(start,p - start));
				parent.addChild(child);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.cca(p + 1) == 91) {
					p += 2;
					if(str.substr(p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.cca(p + 1) == 68 || str.cca(p + 1) == 100) {
					if(str.substr(p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.cca(p + 1) != 45 || str.cca(p + 2) != 45) throw "Expected <!--"; else {
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
				xml = Xml.createElement(str.substr(start,p - start));
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
				tmp = str.substr(start,p - start);
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
			if(c == str.cca(start)) {
				var val = str.substr(start + 1,p - start - 1);
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
				var v = str.substr(start,p - start);
				if(v != parent.getNodeName()) throw "Expected </" + parent.getNodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.cca(p + 1) == 45 && str.cca(p + 2) == 62) {
				parent.addChild(Xml.createComment(str.substr(start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(str.substr(start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.cca(p + 1) == 62) {
				p++;
				var str1 = str.substr(start + 1,p - start - 2);
				parent.addChild(Xml.createProlog(str1));
				state = 1;
			}
			break;
		}
		c = str.cca(++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(str.substr(start,p - start)));
		return p;
	}
	throw "Unexpected end";
}
lib.haxe.xml.Parser.isValidChar = function(c) {
	return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45;
}
lib.haxe.xml.Parser.prototype = {
	__class__: lib.haxe.xml.Parser
}
if(!lib.hxtml) lib.hxtml = {}
lib.hxtml.Browser = $hxClasses["lib.hxtml.Browser"] = function(createElement,createTextNode,appendChild,setAttribute,invalidate,styleProxy) {
	this.createElement = createElement;
	this.createTextNode = createTextNode;
	this.appendChild = appendChild;
	this.setAttribute = setAttribute;
	this.invalidate = invalidate;
	this.styleProxy = styleProxy;
};
lib.hxtml.Browser.__name__ = ["lib","hxtml","Browser"];
lib.hxtml.Browser.prototype = {
	html: null
	,domRoot: null
	,ids: null
	,invalid: null
	,createElement: null
	,createTextNode: null
	,appendChild: null
	,setAttribute: null
	,invalidate: null
	,styleProxy: null
	,register: function(id,d) {
		this.ids.set(id,d);
	}
	,setHtml: function(data) {
		var x = lib.haxe.xml.Parser.parse(data).firstElement();
		this.ids = new Hash();
		this.domRoot = this.make(x);
		this.refresh();
	}
	,refresh: function() {
		this.invalid = false;
		if(this.invalidate != null) this.invalidate();
	}
	,getById: function(id) {
		return this.ids.get(id);
	}
	,make: function(x) {
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
lib.hxtml.CssParser = $hxClasses["lib.hxtml.CssParser"] = function() {
};
lib.hxtml.CssParser.__name__ = ["lib","hxtml","CssParser"];
lib.hxtml.CssParser.prototype = {
	css: null
	,s: null
	,d: null
	,pos: null
	,spacesTokens: null
	,tokens: null
	,notImplemented: function() {
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
			var l = this.getList(v,this.getFontName.$bind(this));
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
			var idents = this.getGroup(v,this.getIdent.$bind(this));
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
		default:
			throw "Not implemented '" + r + "' = " + Std.string(v);
		}
		return false;
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
						names.remove(n);
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
					var g = $this.getGroup(v,$this.getIdent.$bind($this));
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
	,unexpected: function(t) {
		throw "Unexpected " + Std.string(t);
		return null;
	}
	,expect: function(t) {
		var tk = this.readToken();
		if(tk != t) this.unexpected(tk);
	}
	,push: function(t) {
		this.tokens.push(t);
	}
	,isToken: function(t) {
		var tk = this.readToken();
		if(tk == t) return true;
		this.tokens.push(tk);
		return false;
	}
	,parse: function(css,d,s) {
		this.css = css;
		this.s = s;
		this.d = d;
		this.pos = 0;
		this.tokens = [];
		this.parseStyle(lib.hxtml.Token.TEof);
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
	,readHex: function() {
		var start = this.pos;
		while(true) {
			var c = this.css.cca(this.pos++);
			if(c >= 65 && c <= 70 || c >= 97 && c <= 102 || c >= 48 && c <= 57) continue;
			this.pos--;
			break;
		}
		return this.css.substr(start,this.pos - start);
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
	,isSpace: function(c) {
		return c == 32 || c == 10 || c == 13 || c == 9;
	}
	,isIdentChar: function(c) {
		return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c == 45;
	}
	,isNum: function(c) {
		return c >= 48 && c <= 57;
	}
	,next: function() {
		return this.css.cca(this.pos++);
	}
	,readUrl: function() {
		var c0 = this.css.cca(this.pos++);
		while(c0 == 32 || c0 == 10 || c0 == 13 || c0 == 9) c0 = this.css.cca(this.pos++);
		var quote = c0;
		if(quote == 39 || quote == 34) {
			this.pos--;
			var $e = (this.readToken());
			switch( $e[1] ) {
			case 1:
				var s = $e[2];
				var c01 = this.css.cca(this.pos++);
				while(c01 == 32 || c01 == 10 || c01 == 13 || c01 == 9) c01 = this.css.cca(this.pos++);
				if(c01 != 41) throw "Invalid char " + String.fromCharCode(c01);
				return s;
			default:
				throw "assert";
			}
		}
		var start = this.pos - 1;
		while(true) {
			if(c0 != c0) break;
			c0 = this.css.cca(this.pos++);
			if(c0 == 41) break;
		}
		return StringTools.trim(this.css.substr(start,this.pos - start - 1));
	}
	,readRGBA: function() {
		var c = this.css.cca(this.pos++);
		while(c == 32 || c == 10 || c == 13 || c == 9) c = this.css.cca(this.pos++);
		var start = this.pos - 1;
		while(true) {
			if(c != c) break;
			c = this.css.cca(this.pos++);
			if(c == 41) break;
		}
		return StringTools.trim(this.css.substr(start,this.pos - start - 1));
	}
	,readRGB: function() {
		var c = this.css.cca(this.pos++);
		while(c == 32 || c == 10 || c == 13 || c == 9) c = this.css.cca(this.pos++);
		var start = this.pos - 1;
		while(true) {
			if(c != c) break;
			c = this.css.cca(this.pos++);
			if(c == 41) break;
		}
		return StringTools.trim(this.css.substr(start,this.pos - start - 1));
	}
	,readToken: function() {
		var t = this.tokens.pop();
		if(t != null) return t;
		while(true) {
			var c = this.css.cca(this.pos++);
			if(c != c) return lib.hxtml.Token.TEof;
			if(c == 32 || c == 10 || c == 13 || c == 9) {
				if(this.spacesTokens) {
					while(this.isSpace(this.css.cca(this.pos++))) {
					}
					this.pos--;
					return lib.hxtml.Token.TSpaces;
				}
				continue;
			}
			if(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c == 45) {
				var pos = this.pos - 1;
				do c = this.css.cca(this.pos++); while(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c == 45);
				this.pos--;
				return lib.hxtml.Token.TIdent(this.css.substr(pos,this.pos - pos).toLowerCase());
			}
			if(c >= 48 && c <= 57) {
				var i = 0;
				do {
					i = i * 10 + (c - 48);
					c = this.css.cca(this.pos++);
				} while(c >= 48 && c <= 57);
				if(c == 46) {
					var f = i;
					var k = 0.1;
					while(this.isNum(c = this.css.cca(this.pos++))) {
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
				if((c = this.css.cca(this.pos++)) != 42) {
					this.pos--;
					return lib.hxtml.Token.TSlash;
				}
				while(true) {
					while((c = this.css.cca(this.pos++)) != 42) if(c != c) throw "Unclosed comment";
					c = this.css.cca(this.pos++);
					if(c == 47) break;
					if(c != c) throw "Unclosed comment";
				}
				return this.readToken();
			case 39:case 34:
				var pos = this.pos;
				var k;
				while((k = this.css.cca(this.pos++)) != c) {
					if(k != k) throw "Unclosed string constant";
					if(k == 92) {
						throw "todo";
						continue;
					}
				}
				return lib.hxtml.Token.TString(this.css.substr(pos,this.pos - pos - 1));
			default:
			}
			this.pos--;
			throw "Invalid char " + this.css.charAt(this.pos);
		}
		return null;
	}
	,__class__: lib.hxtml.CssParser
}
lib.hxtml.HxtmlConverter = $hxClasses["lib.hxtml.HxtmlConverter"] = function() { }
lib.hxtml.HxtmlConverter.__name__ = ["lib","hxtml","HxtmlConverter"];
lib.hxtml.HxtmlConverter.prototype = {
	__class__: lib.hxtml.HxtmlConverter
}
lib.hxtml.IStyleProxy = $hxClasses["lib.hxtml.IStyleProxy"] = function() { }
lib.hxtml.IStyleProxy.__name__ = ["lib","hxtml","IStyleProxy"];
lib.hxtml.IStyleProxy.prototype = {
	setDisplay: null
	,setPosition: null
	,setCssFloat: null
	,setClear: null
	,setTransitionProperty: null
	,setTransitionDuration: null
	,setTransitionTimingFunction: null
	,setTransitionDelay: null
	,setMarginLeftNum: null
	,setMarginLeftKey: null
	,setMarginTopNum: null
	,setMarginTopKey: null
	,setMarginRightNum: null
	,setMarginRightKey: null
	,setMarginBottomNum: null
	,setMarginBottomKey: null
	,setMarginBottomZero: null
	,setMarginTopZero: null
	,setMarginLeftZero: null
	,setMarginRightZero: null
	,setPaddingLeft: null
	,setPaddingTop: null
	,setPaddingRight: null
	,setPaddingBottom: null
	,setMinWidth: null
	,setMinWidthZero: null
	,setMaxWidth: null
	,setMaxWidthZero: null
	,setMaxWidthKey: null
	,setMinHeight: null
	,setMinHeightZero: null
	,setMaxHeight: null
	,setMaxHeightKey: null
	,setMaxHeightZero: null
	,setWidth: null
	,setWidthZero: null
	,setWidthKey: null
	,setHeight: null
	,setHeightZero: null
	,setHeightKey: null
	,setTop: null
	,setTopZero: null
	,setLeft: null
	,setLeftZero: null
	,setBottom: null
	,setBottomZero: null
	,setRight: null
	,setRightZero: null
	,setTopKey: null
	,setLeftKey: null
	,setBottomKey: null
	,setRightKey: null
	,setBgColorHex: null
	,setBgColorRGBA: null
	,setBgColorRGB: null
	,setBgColorKey: null
	,setBgImage: null
	,setBgAttachment: null
	,setBgRepeat: null
	,setBgPos: null
	,setFontSizeNum: null
	,setFontSizeKey: null
	,setFontWeightKey: null
	,setFontWeightNum: null
	,setFontStyle: null
	,setFontFamily: null
	,setFontVariant: null
	,setTextColorKey: null
	,setTextColorNum: null
	,setTextColorRGBA: null
	,setTextColorRGB: null
	,setTextDecoration: null
	,setLineHeightNum: null
	,setLineHeightZero: null
	,setLineHeightKey: null
	,setTextTransform: null
	,setTextIndent: null
	,setLetterSpacingNum: null
	,setLetterSpacingKey: null
	,setWordSpacingNum: null
	,setWordSpacingKey: null
	,setTextAlign: null
	,setVerticalAlignNum: null
	,setVerticalAlignKey: null
	,setWhiteSpace: null
	,setOverflowX: null
	,setOverflowY: null
	,setZIndex: null
	,__class__: lib.hxtml.IStyleProxy
}
lib.hxtml.StyleProxy = $hxClasses["lib.hxtml.StyleProxy"] = function() {
};
lib.hxtml.StyleProxy.__name__ = ["lib","hxtml","StyleProxy"];
lib.hxtml.StyleProxy.__interfaces__ = [lib.hxtml.IStyleProxy];
lib.hxtml.StyleProxy.prototype = {
	setDisplay: function(element,value) {
		element.style.set_display(value);
	}
	,setPosition: function(element,value) {
		element.style.set_position(value);
	}
	,setCssFloat: function(element,value) {
		element.style.set_CSSFloat(value);
	}
	,setClear: function(element,value) {
		element.style.set_clear(value);
	}
	,setMarginLeftNum: function(element,value,unit) {
		element.style.set_marginLeft(value + unit);
	}
	,setMarginLeftKey: function(element,value) {
		element.style.set_marginLeft(value);
	}
	,setMarginTopNum: function(element,value,unit) {
		element.style.set_marginTop(value + unit);
	}
	,setMarginTopKey: function(element,value) {
		element.style.set_marginTop(value);
	}
	,setMarginRightNum: function(element,value,unit) {
		element.style.set_marginRight(value + unit);
	}
	,setMarginRightKey: function(element,value) {
		element.style.set_marginRight(value);
	}
	,setMarginBottomNum: function(element,value,unit) {
		element.style.set_marginBottom(value + unit);
	}
	,setMarginBottomKey: function(element,value) {
		element.style.set_marginBottom(value);
	}
	,setMarginBottomZero: function(element) {
		element.style.set_marginBottom("0");
	}
	,setMarginLeftZero: function(element) {
		element.style.set_marginLeft("0");
	}
	,setMarginTopZero: function(element) {
		element.style.set_marginTop("0");
	}
	,setMarginRightZero: function(element) {
		element.style.set_marginRight("0");
	}
	,setPaddingLeft: function(element,value,unit) {
		element.style.set_paddingLeft(value + unit);
	}
	,setPaddingTop: function(element,value,unit) {
		element.style.set_paddingTop(value + unit);
	}
	,setPaddingRight: function(element,value,unit) {
		element.style.set_paddingRight(value + unit);
	}
	,setPaddingBottom: function(element,value,unit) {
		element.style.set_paddingBottom(value + unit);
	}
	,setWidth: function(element,value,unit) {
		element.style.set_width(value + unit);
	}
	,setWidthZero: function(element) {
		element.style.set_width("0");
	}
	,setWidthKey: function(element,value) {
		element.style.set_width(value);
	}
	,setHeight: function(element,value,unit) {
		element.style.set_height(value + unit);
	}
	,setHeightZero: function(element) {
		element.style.set_height("0");
	}
	,setHeightKey: function(element,value) {
		element.style.set_height(value);
	}
	,setMinWidth: function(element,value,unit) {
		element.style.set_minWidth(value + unit);
	}
	,setMinHeight: function(element,value,unit) {
		element.style.set_minHeight(value + unit);
	}
	,setMaxWidth: function(element,value,unit) {
		element.style.set_maxWidth(value + unit);
	}
	,setMaxHeight: function(element,value,unit) {
		element.style.set_maxHeight(value + unit);
	}
	,setMinWidthZero: function(element) {
		element.style.set_minWidth("0");
	}
	,setMaxWidthZero: function(element) {
		element.style.set_maxWidth("0");
	}
	,setMinHeightZero: function(element) {
		element.style.set_minHeight("0");
	}
	,setMaxHeightZero: function(element) {
		element.style.set_maxHeight("0");
	}
	,setMaxWidthKey: function(element,value) {
		element.style.set_maxWidth(value);
	}
	,setMaxHeightKey: function(element,value) {
		element.style.set_maxHeight(value);
	}
	,setTop: function(element,value,unit) {
		element.style.set_top(value + unit);
	}
	,setTopZero: function(element) {
		element.style.set_top("0");
	}
	,setLeft: function(element,value,unit) {
		element.style.set_left(value + unit);
	}
	,setLeftZero: function(element) {
		element.style.set_left("0");
	}
	,setBottom: function(element,value,unit) {
		element.style.set_bottom(value + unit);
	}
	,setBottomZero: function(element) {
		element.style.set_bottom("0");
	}
	,setRight: function(element,value,unit) {
		element.style.set_right(value + unit);
	}
	,setRightZero: function(element) {
		element.style.set_right("0");
	}
	,setTopKey: function(element,value) {
		element.style.set_top(value);
	}
	,setLeftKey: function(element,value) {
		element.style.set_left(value);
	}
	,setBottomKey: function(element,value) {
		element.style.set_bottom(value);
	}
	,setRightKey: function(element,value) {
		element.style.set_right(value);
	}
	,setBgColorHex: function(element,value) {
		element.style.set_backgroundColor("#" + Std.string(value));
	}
	,setBgColorRGBA: function(element,value) {
		element.style.set_backgroundColor("rgba(" + value + ")");
	}
	,setBgColorRGB: function(element,value) {
		element.style.set_backgroundColor("rgb(" + value + ")");
	}
	,setBgColorKey: function(element,value) {
		element.style.set_backgroundColor(value);
	}
	,setBgImage: function(element,value) {
		if(value.length == 1) element.style.set_backgroundImage("url(" + value[0] + ")"); else element.style.set_backgroundImage("");
	}
	,setBgAttachment: function(element,value) {
	}
	,setBgRepeat: function(element,value) {
		element.style.set_backgroundRepeat(value.join(","));
	}
	,setBgPos: function(element,value) {
		element.style.set_backgroundPosition(value);
	}
	,setFontSizeNum: function(element,value,unit) {
		element.style.set_fontSize(value + unit);
	}
	,setFontSizeKey: function(element,value) {
		element.style.set_fontSize(value);
	}
	,setFontWeightNum: function(element,value) {
		element.style.set_fontWeight(Std.string(value));
	}
	,setFontWeightKey: function(element,value) {
		element.style.set_fontWeight(value);
	}
	,setFontStyle: function(element,value) {
		element.style.set_fontStyle(value);
	}
	,setFontFamily: function(element,value) {
		if(value.length > 0) element.style.set_fontFamily(value.join(",")); else element.style.set_fontFamily("");
	}
	,setFontVariant: function(element,value) {
		element.style.set_fontVariant(value);
	}
	,setTextColorKey: function(element,value) {
		element.style.set_color(value);
	}
	,setTextColorNum: function(element,value) {
		element.style.set_color("#" + Std.string(value));
	}
	,setTextColorRGBA: function(element,value) {
		element.style.set_color("rgba(" + value + ")");
	}
	,setTextColorRGB: function(element,value) {
		element.style.set_color("rgb(" + value + ")");
	}
	,setTextDecoration: function(element,value) {
	}
	,setLineHeightKey: function(element,value) {
		element.style.set_lineHeight(value);
	}
	,setLineHeightZero: function(element) {
		element.style.set_lineHeight("0");
	}
	,setLineHeightNum: function(element,value,unit) {
		element.style.set_lineHeight(value + unit);
	}
	,setTextTransform: function(element,value) {
		element.style.set_textTransform(value);
	}
	,setLetterSpacingNum: function(element,value,unit) {
		element.style.set_letterSpacing(value + unit);
	}
	,setLetterSpacingKey: function(element,value) {
		element.style.set_letterSpacing(value);
	}
	,setWordSpacingNum: function(element,value,unit) {
		element.style.set_wordSpacing(value + unit);
	}
	,setWordSpacingKey: function(element,value) {
		element.style.set_wordSpacing(value);
	}
	,setTextIndent: function(element,value,unit) {
		element.style.set_textIndent(value + unit);
	}
	,setTextAlign: function(element,value) {
		element.style.set_textAlign(value);
	}
	,setVerticalAlignNum: function(element,value,unit) {
		element.style.set_verticalAlign(value + unit);
	}
	,setVerticalAlignKey: function(element,value) {
		element.style.set_verticalAlign(value);
	}
	,setWhiteSpace: function(element,value) {
		element.style.set_whiteSpace(value);
	}
	,setZIndex: function(element,value) {
		element.style.set_zIndex(value);
	}
	,setOverflowX: function(element,value) {
		element.style.set_overflowX(value);
	}
	,setOverflowY: function(element,value) {
		element.style.set_overflowY(value);
	}
	,setTransitionDuration: function(element,value) {
		element.style.set_transitionDuration(value);
	}
	,setTransitionDelay: function(element,value) {
		element.style.set_transitionDelay(value);
	}
	,setTransitionProperty: function(element,value) {
		element.style.set_transitionProperty(value);
	}
	,setTransitionTimingFunction: function(element,value) {
		element.style.set_transitionTimingFunction(value);
	}
	,__class__: lib.hxtml.StyleProxy
}
js.Boot.__res = {}
js.Boot.__init();
{
	var d = Date;
	d.now = function() {
		return new Date();
	};
	d.fromTime = function(t) {
		var d1 = new Date();
		d1["setTime"](t);
		return d1;
	};
	d.fromString = function(s) {
		switch(s.length) {
		case 8:
			var k = s.split(":");
			var d1 = new Date();
			d1["setTime"](0);
			d1["setUTCHours"](k[0]);
			d1["setUTCMinutes"](k[1]);
			d1["setUTCSeconds"](k[2]);
			return d1;
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
	};
	d.prototype["toString"] = function() {
		var date = this;
		var m = date.getMonth() + 1;
		var d1 = date.getDate();
		var h = date.getHours();
		var mi = date.getMinutes();
		var s = date.getSeconds();
		return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d1 < 10?"0" + d1:"" + d1) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
	};
	d.prototype.__class__ = $hxClasses["Date"] = d;
	d.__name__ = ["Date"];
}
{
	Math.__name__ = ["Math"];
	Math.NaN = Number["NaN"];
	Math.NEGATIVE_INFINITY = Number["NEGATIVE_INFINITY"];
	Math.POSITIVE_INFINITY = Number["POSITIVE_INFINITY"];
	$hxClasses["Math"] = Math;
	Math.isFinite = function(i) {
		return isFinite(i);
	};
	Math.isNaN = function(i) {
		return isNaN(i);
	};
}
{
	String.prototype.__class__ = $hxClasses["String"] = String;
	String.__name__ = ["String"];
	Array.prototype.__class__ = $hxClasses["Array"] = Array;
	Array.__name__ = ["Array"];
	var Int = $hxClasses["Int"] = { __name__ : ["Int"]};
	var Dynamic = $hxClasses["Dynamic"] = { __name__ : ["Dynamic"]};
	var Float = $hxClasses["Float"] = Number;
	Float.__name__ = ["Float"];
	var Bool = $hxClasses["Bool"] = Boolean;
	Bool.__ename__ = ["Bool"];
	var Class = $hxClasses["Class"] = { __name__ : ["Class"]};
	var Enum = { };
	var Void = $hxClasses["Void"] = { __ename__ : ["Void"]};
}
{
	Xml.Element = "element";
	Xml.PCData = "pcdata";
	Xml.CData = "cdata";
	Xml.Comment = "comment";
	Xml.DocType = "doctype";
	Xml.Prolog = "prolog";
	Xml.Document = "document";
}
if(typeof(JSON) != "undefined") haxe.Json = JSON;
{
	if(typeof document != "undefined") js.Lib.document = document;
	if(typeof window != "undefined") {
		js.Lib.window = window;
		js.Lib.window.onerror = function(msg,url,line) {
			var f = js.Lib.onerror;
			if(f == null) return false;
			return f(msg,[url + ":" + line]);
		};
	}
}
js["XMLHttpRequest"] = window.XMLHttpRequest?XMLHttpRequest:window.ActiveXObject?function() {
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
Xml.enode = new EReg("^<([a-zA-Z0-9:._-]+)","");
Xml.ecdata = new EReg("^<!\\[CDATA\\[","i");
Xml.edoctype = new EReg("^<!DOCTYPE ","i");
Xml.eend = new EReg("^</([a-zA-Z0-9:._-]+)>","");
Xml.epcdata = new EReg("^[^<]+","");
Xml.ecomment = new EReg("^<!--","");
Xml.eprolog = new EReg("^<\\?[^\\?]+\\?>","");
Xml.eattribute = new EReg("^\\s*([a-zA-Z0-9:_-]+)\\s*=\\s*([\"'])([^\\2]*?)\\2","");
Xml.eclose = new EReg("^[ \r\n\t]*(>|(/>))","");
Xml.ecdata_end = new EReg("\\]\\]>","");
Xml.edoctype_elt = new EReg("[\\[|\\]>]","");
Xml.ecomment_end = new EReg("-->","");
cocktail.core.dom.Node.ELEMENT_NODE = 1;
cocktail.core.dom.Node.ATTRIBUTE_NODE = 2;
cocktail.core.dom.Node.TEXT_NODE = 3;
cocktail.core.dom.Node.CDATA_SECTION_NODE = 4;
cocktail.core.dom.Node.ENTITY_REFERENCE_NODE = 5;
cocktail.core.dom.Node.ENTITY_NODE = 6;
cocktail.core.dom.Node.PROCESSING_INSTRUCTION_NODE = 7;
cocktail.core.dom.Node.COMMENT_NODE = 8;
cocktail.core.dom.Node.DOCUMENT_NODE = 9;
cocktail.core.dom.Node.DOCUMENT_TYPE_NODE = 10;
cocktail.core.dom.Node.DOCUMENT_FRAGMENT_NODE = 11;
cocktail.core.dom.Node.NOTATION_NODE = 11;
cocktail.core.dom.Element.MATCH_ALL_TAG_NAME = "*";
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
cocktail.core.dom.Document.EVENT_INTERFACE = "Event";
cocktail.core.dom.Document.UI_EVENT_INTERFACE = "UIEvent";
cocktail.core.dom.Document.MOUSE_EVENT_INTERFACE = "MouseEvent";
cocktail.core.dom.Document.FOCUS_EVENT_INTERFACE = "FocusEvent";
cocktail.core.dom.Document.KEYBOARD_EVENT_INTERFACE = "KeyboardEvent";
cocktail.core.dom.Document.WHEEL_EVENT_INTERFACE = "WheelEvent";
cocktail.core.dom.Document.CUSTOM_EVENT_INTERFACE = "CustomEvent";
cocktail.core.dom.Document.TRANSITION_EVENT_INTERFACE = "TransitionEvent";
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
cocktail.core.html.HTMLMediaElement.TIME_UPDATE_FREQUENCY = 350;
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
cocktail.core.html.HTMLVideoElement.HTML_VIDEO_DEFAULT_WIDTH = 300;
cocktail.core.html.HTMLVideoElement.HTML_VIDEO_DEFAULT_HEIGHT = 150;
cocktail.core.html.ScrollBar.ARROW_SCROLL_OFFSET = 10;
cocktail.core.html.ScrollBar.TRACK_SCROLL_OFFSET = 50;
cocktail.core.html.ScrollBar.THUMB_DEFAULT_DIMENSION = 16;
cocktail.core.html.ScrollBar.ARROW_DEFAULT_DIMENSION = 16;
cocktail.core.html.ScrollBar.TRACK_DEFAULT_DIMENSION = 16;
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
cocktail.core.style.transition.TransitionManager.TRANSITION_UPDATE_SPEED = 20;
js.Lib.onerror = null;
JsExplorer.main()