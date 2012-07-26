/*
	This project is © 2010-2011 Silex Labs and is released under the GPL License:
	This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License (GPL) as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version. 
	This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
	To read the license please visit http://www.gnu.org/copyleft/gpl.html
*/

/**
 * This class reads an xml
 * 
 * @author Raphael Harmel
 */

package frontend.services;

import haxe.Http;
import haxe.Json;
import haxe.Log;

class JSONLoader
{
	// Defines onLoad callback, called when the xml feed is loaded
	public var onLoad : String->Void;

	/**
	 * Constuctor
	 */
	public function new() 
	{
	}
	
	/**
	 * Loads the data
	 * @param	url
	 */
	public function loadJSON(jsonUrl:String): Void
	{
		var http:Http = new Http(jsonUrl);
		http.onData = onJSONLoaded;
		http.onError = onJSONError;
		http.request(false);
	}
	
	/**
	 * Error on loading the json data
	 * @param	msg
	 */
	private function onJSONError( msg : String ):Void
	{
		trace("Error while loading JSON Data : " + msg);
	}
	
	/**
	 * Data json successfully loaded
	 * @param	response
	 */
	private function onJSONLoaded(jsonString:String):Void
	{
		if (onLoad != null) {
			onLoad(jsonString);
		}
	}
	
}