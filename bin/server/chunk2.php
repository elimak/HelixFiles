<?php


$rawPost = file_get_contents('php://input'); // Read the PHP input stream and save the contents to $rawPost.
$targetFolder = '../largefiles/'; 	// Set the folder where the movie should be saved.
$fullFileName = $_GET['name']; 		// Get the filename from the url parameter.
$fileSize = !empty($_GET['size']);	// Get the file size in order to calculate the progression and the finished 
$errors = array(); 	// Initialize the erros array. This is where all the are will be stored.
$fileName;
$fileExtension;
$targetFile;


// If there are no errors in the errors array. Everything is OK and we
// can append the bytes found in $rawPost to the file $targetFile.
if(empty($errors)) {
    // Append the content of $rawPost to the file $targetFile
	//if (is_file($targetFile)) {
		if ( file_put_contents($targetFile, $rawPost, FILE_APPEND) ) {
			if ( $isLast ) {
			// here you can save the record into a database as the file is fully and successfuly uploaded on the server
			}
			die('<result>' . $targetFile. " -- " . $fileName . " -- append -- size " . filesize($targetFile) . '</result>');
		}
		else {
			die('<error> something got wrong </error>');
		}
/*	}
	else{
		if ( file_put_contents($targetFile, $rawPost) ) {
			if ( $isLast ) {
			// here you can save the record into a database as the file is fully and successfuly uploaded on the server
			}
			die('<result>' . $targetFile. " -- " . $fileName . " -- dont append -- size " . filesize($targetFile) . '</result>');
		}
		
	}*/
} else {
    die('<error>' . implode(' ', $errors) . '</error>');
}

function checkErrors (){
	if( empty( $rawPost ) ) $errors[] = 'You did not send any POST data.'; 		// Add an error if there is no data posted.
	$fileName =  substr( $fullFileName, 0, strrpos( $fullFileName, '.')); 		// Remove the extension from the filename and remove special characters.
	if( empty( $fileName ) ) $errors[] = 'You did not specify a file name in the url.'; // Add an error if the video name is not specified.
	$fileExtension = substr( $fullFileName, strrpos( $fullFileName, '.') + 1 ); 	// Extract the extension.
	$targetFile = $targetFolder . $fileName. '.' . $fileExtension; 					// Create the path to the file.
	
	if (empty($errors)) 
		prepareUpload();
	else
		die('<error>' . implode(' ', $errors) . '</error>');
}

function prepareUpload() {
	// check if the file that we are uploading already exist
	// if it does exist: 
	// --> rename it to avoid overriding it 
}

function uploadChunk () {
	// append the data to the file chunk after chunk
	// if the file is complete 
	// -> finalize
	// else
	// send failure to the user
}


function finalizeUpload () {
	// check if there is was a previous version of the file
	// if there was one:
	// delete it
}
checkErrors();

?>