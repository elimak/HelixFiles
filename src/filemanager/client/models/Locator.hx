package filemanager.client.models;
import haxe.Log;
import slplayer.ui.DisplayObject;

/**
 * ...
 * @author valerie.elimak - blog.elimak.com
 */
typedef AppLocator = {
	var slDisplays : Hash<Array<DisplayObject>>;
}

class Locator 
{
	private static var instance : Hash<AppLocator>;
	
	/**
	 * get the AppLocator instance based on the SLPlayerID, if it does not exist yet, create it first. 
	 * @param	slPlayerID
	 * @return
	 */
	private static function getInstance( slPlayerID : String ):AppLocator
	{
		if ( instance == null ) {
			instance = new Hash<AppLocator>();
		}
		if ( !instance.exists(slPlayerID)) {
			var appLocator : AppLocator = { slDisplays: new Hash<Array<DisplayObject>>() };
			instance.set(slPlayerID, appLocator);
		}
		return instance.get(slPlayerID);
	}
	
	/**
	 * register any DisplayObject based on its className and the SLPlayerID
	 * @param	slPlayerID
	 * @param	displayObjInstance
	 * @param	className
	 */
	public static function registerSLDisplay( slPlayerID : String, displayObjInstance: DisplayObject, className : String): Void {
		if ( !getInstance(slPlayerID).slDisplays.exists(className)) {
			getInstance(slPlayerID).slDisplays.set(className, new Array<DisplayObject>());
		}
		getInstance(slPlayerID).slDisplays.get(className).push(displayObjInstance);
	}
	
	/**
	 * Retrieve DisplayObject based on its className and the SLPlayerID
	 * @param	slPlayerID
	 * @param	displayObjInstance
	 * @param	className
	 */
	public static function getSLDisplay (slPlayerID : String, className : String) : Array<DisplayObject>
	{
		if ( getInstance(slPlayerID).slDisplays.exists(className)) {
			return getInstance(slPlayerID).slDisplays.get(className);
		}
		else
			return new Array<DisplayObject>();
	}
}
