<?php

$targetFolder = '../largefiles/'; 	// Set the folder where the movie should be saved.
$fullFileName = $_GET['name']; 		// Get the filename from the url parameter.
$errors = array(); 	// Initialize the erros array. This is where all the are will be stored.
$fileName;
$fileExtension;
$targetFile;
$errors;

function checkErrors () {

	global $errors, $fullFileName, $fileName, $fileExtension, $targetFile, $targetFolder;

	$fileName =  substr( $fullFileName, 0, strrpos( $fullFileName, '.')); 				// Remove the extension from the filename and remove special characters.
	if( empty( $fileName ) ) $errors[] = 'You did not specify a file name in the url.'; // Add an error if the video name is not specified.
	$fileExtension = substr( $fullFileName, strrpos( $fullFileName, '.') + 1 ); 		// Extract the extension.
	$targetFile = $targetFolder . $fileName. '.' . $fileExtension; 						// Create the path to the file.
	
	if (empty($errors)) 
		rename();
	else
		die('<error>' . implode(' ', $errors) . '</error>');
}


function rename () {

	global $rawPost, $errors, $fullFileName, $fileName, $fileExtension, $targetFile, $targetFolder;
	
	if ( is_file($targetFile)) {
		$tempFile = $targetFolder . $fileName. '_backup.' . $fileExtension; 
		$success = rename( $targetFile, $tempFile);
		if($success)
			die('<result>' . $targetFile . ' exists already </result>');
		else
			die('<error>the file ' . $targetFile . ' could not be renamed</error>');
	}
	else {
		die('<result>there was no file named' . $targetFile . ' </result>');
	}
}

checkErrors();

?>