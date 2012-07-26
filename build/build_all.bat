ECHO OFF
ECHO.
ECHO starting full build process...

haxe build/explorer_php.hxml
haxe build/explorer_js.hxml
haxe build/explorer_as.hxml


ECHO.
ECHO full build process complete
ECHO.

start chrome http://localhost.local/HaxeExplorer/bin/

ECHO ON

PAUSE
