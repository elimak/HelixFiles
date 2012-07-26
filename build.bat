ECHO OFF
ECHO.
ECHO starting full build process...

haxe build_client.hxml
haxe build_server.hxml

ECHO.
ECHO full build process complete
ECHO.

if ERRORLEVEL 1 (pause)

start chrome http://localhost.local/fileManager/FileManager.html

ECHO ON

PAUSE
