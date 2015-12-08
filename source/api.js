
/*
 * vestibule's public API
 */

if (typeof vestibule === 'undefined') {

	vestibule = function(objectsToDefine, scriptLocation) {

		if (!objectsToDefine || !scriptLocation)
			return;
		if (typeof objectsToDefine === 'string')
			objectsToDefine = [ objectsToDefine ];

		for ( var i = 0; i < objectsToDefine.length; i++) {
			defineLoadAndReplace(objectsToDefine[i],scriptLocation);
		}

	}

}
