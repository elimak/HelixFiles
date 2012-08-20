HelixFiles
==========

Project built with Haxe + cocktail js + slplayer to upload and manage files - with drag and drop &amp; chunk of the data

== Use ==

Drop the folder bin/ in a web accessible location.
Try to access the file bin/debug.html with a web browser to see if the server side is working properly.

Access the file bin/FileManager.html with a web browser.
Drop files in the "Drop your files here" zone, and use the buttons to manage files on your server

== Compile ==

haxe build.hxml on other platforms
Or build.bat on windows

== Files ==

* fileupload.js
  web worker in pure js, used to upload files asyncroneously

== Warning ==

The security is not handled, since this is a proof of concept. **Do not use it online** since it is a security hole. 