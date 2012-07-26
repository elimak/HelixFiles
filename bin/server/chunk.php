<?php

$rawPost = file_get_contents('php://input'); 	// Read the PHP input stream and save the contents to $rawPost.
$targetFolder = '../largefiles/'; 				// Set the folder where the movie should be saved.
$fullFileName = $_GET['name']; 					// Get the filename from the url parameter.
$fileSize = $_GET['filesize'];					// Get the file size in order to calculate the progression and the finished 
$chunkSize = $_GET['chunksize'];				// Get the chunk size in order to calculate the progression and the finished 
$errors = array(); 								// Initialize the erros array. This is where all the are will be stored.
$fileName;
$fileExtension;
$targetFile;

function checkErrors () {
	global $rawPost, $errors, $fullFileName, $fileName, $fileExtension, $targetFile, $targetFolder, $fileSize, $chunkSize;
	
	if( empty( $rawPost ) ) $errors[] = 'You did not send any POST data.'; 				// Add an error if there is no data posted.
	$fileName =  substr( $fullFileName, 0, strrpos( $fullFileName, '.')); 				// Remove the extension from the filename and remove special characters.
	if( empty( $fileName ) ) $errors[] = 'You did not specify a file name in the url.'; // Add an error if name is not specified.
	if( empty( $fileSize ) ) $errors[] = 'You did not specify the file\'s size.'; 		// Add an error if size is not specified.
	if( empty( $chunkSize ) ) $errors[] = 'You did not specify the chunk\'s size.';		// Add an error if chunk is not specified.
	$fileExtension = substr( $fullFileName, strrpos( $fullFileName, '.') + 1 ); 		// Extract the extension.
	$targetFile = $targetFolder . $fileName. '.' . $fileExtension; 						// Create the path to the file.
	
	if (empty($errors)) 
		uploadChunk();
	else
		die('{error:' . implode(' ', $errors) . '}');
}


function uploadChunk() {
	global $rawPost, $errors, $fullFileName, $fileName, $fileExtension, $targetFile, $targetFolder, $fileSize, $chunkSize;
	
	clearstatcache(); // make sure the cache is not used
	
	// append the chunk to the file and write it on the server
	if ( file_put_contents($targetFile, $rawPost, FILE_APPEND) ) {
		$percentProgress = filesize($targetFile) / $fileSize;
		
		die('{"result":{"filename":"' . $fullFileName. '", "filesize":' . filesize($targetFile) . ',"percentuploaded":' . $percentProgress . ',"chunksize":' . $chunkSize . '}, "type":"progress"}');
		//die('<result><filename>' . $fullFileName. '</filename><currentsize>' . filesize($targetFile) . '</currentsize><percentuploaded>' . $percentProgress . '</percentuploaded><chunksize>' . $chunkSize . '</chunksize></result>');
	}
	else {
		die('{"error":"Something went wrong"}');
	}
}

function finalizeUpload () {
	// check if there is was a previous version of the file
	// if there was one:
	// delete it
}
checkErrors();

?>