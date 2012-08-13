/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 
 Multi-thread upload:
 Web Worker used to upload a chunked file.
 The file is instanciated and used from the FilesModel.hx
 
 */
 
chunks = [];

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
				scope.postMessage('{"result":{"filename":"' + chunk.name+ '", "filesize":' +chunk.size+ '}, "type":"completed", "destination":"'+chunk.destination+'"}');
		}
	}
	
	var service = 'server/chunk.php?'+"name="+chunk.name+"&filesize="+chunk.size+"&chunksize="+chunk.chunksize+"&destination="+chunk.destination;
	xhr.onerror = function(e) {scope.postMessage( '{"error":"Something went wrong"}' );};
	xhr.open('POST', service, true);
	xhr.send(chunk.chunk);
}

function process( blob, validName, inDestination) {

	self.postMessage('{"result":{"filename":"' + validName+ '"}, "type":"started", "destination":"'+inDestination+'"}');
	const BYTES_PER_CHUNK = 210000;/*Math.round(1024 * 1024 / 5);*/ // around 200k chunk sizes.
	
	const SIZE = blob.size;
	var start = 0;
	var end = BYTES_PER_CHUNK;

	while (start < SIZE) {

		if ('mozSlice' in blob) {
			var chunk = blob.mozSlice(start, end);
		} else {
			var chunk = blob.slice(start, end);
		}
		
		var chunksize = end - start;
		chunks.push({chunk:chunk, name: validName, size: blob.size, chunksize: chunksize, destination: inDestination});

		start = end;
		end = ((start + BYTES_PER_CHUNK) < SIZE) ? (start + BYTES_PER_CHUNK) : SIZE;
	}
	
	upload();
}

self.onmessage = function(e) {
	process(e.data.file, e.data.validName, e.data.destination );
}