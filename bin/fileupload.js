/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */
 
var file = [], p = true, chunks = [];

function upload() {
	var chunk = chunks.pop();
	var scope = self;
	var xhr = new XMLHttpRequest();
	
	xhr.onreadystatechange = function(  ){
		if (xhr.readyState==4 && xhr.status==200){
			scope.postMessage( xhr.responseText );
			if (chunks.length > 0 )
				upload();
			else
				scope.postMessage('{"result":{"filename":"' + chunk.name+ '", "filesize":' +chunk.size+ '}, "type":"completed"}');
		}
	}
	
	var service = 'server/chunk.php?'+"name="+chunk.name+"&filesize="+chunk.size+"&chunksize="+chunk.chunksize;
	xhr.onerror = function(e) {scope.postMessage( '{"error":"Something went wrong"}' );};
	xhr.open('POST', service, true);
	xhr.send(chunk.chunk);
}

function process() {

	var blob = file.pop();
	self.postMessage('{"result":{"filename":"' + blob.name+ '"}, "type":"started"}');
	const BYTES_PER_CHUNK = 210000;/*Math.round(1024 * 1024 / 5);*/ // around 200k chunk sizes.
	
	const SIZE = blob.size;
	var start = 0;
	var end = BYTES_PER_CHUNK;

	while (start < SIZE) {

		if ('mozSlice' in blob) {
			var chunk = blob.mozSlice(start, end);
		} else {
			var chunk = blob.webkitSlice(start, end);
		}
		
		var chunksize = end - start;
		
		chunks.push({chunk:chunk, name: blob.name, size: blob.size, chunksize: chunksize});


		start = end;
		end = ((start + BYTES_PER_CHUNK) < SIZE) ? (start + BYTES_PER_CHUNK) : SIZE;
	}
	
	upload();
	p = ( file.length > 0 ) ? true : false;
	if (p) process();
}

self.onmessage = function(e) {
	file = [];
	for (var j = 0; j < e.data.length; j++){
		file.push(e.data[j]);
	}
	process();
}