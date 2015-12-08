/**
 * Vestibule JS
 * @version 1.0.3
 
The "Vestibule" allows a team to define and map a public JavaScript API.  
Then, even without understanding module dependency, JS file locations or managing a-synchronous lazying loading & timing issues, another team can simply use that API.    

The required files are automatically lazy loaded "on-demand" based on the usage of that API.

Example usage:

//arg1 = "Public Method Name[s]":String/Array
//arg2 = "Script-Location.js":String

vestibule(['EXTERNAL_API_A','EXTERNAL_API_B'],'external-api.js'); - 

Now, another file can call EXTERNAL_API_A('');.  At that point 'external-api.js' will get loaded and the original call dispatched accordingly.  

See deploy folder for working demo.  Use ANT build.xml to compile source.

------

Copyright (c) 2015 Chris Hobson 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 */

(function(){
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

var VESTIBULE_KEY = Math.round(Math.random()*10000+1);

/**
 * Loader : Function
 * 
 * JavaScript and CSS lazy loader utility class, appends file to page head,
 * crossdomain compatible
 * 
 * Example Usage:
 * 
 * loader({ 
 * 	source 		: "http://www.att.com/scripts/jquery.min.js", 	//- required, relative/absolute path to JS or CSS file
 *  verify 		: function() { return typeof jQuery; },	 		//-optional, a routine run to check for loaded file complete
 *  complete 	: function() { //do this on load complete } 	//-optional, called when script is completed loading
 * 	rate 		: 300											//-optional, integer, refresh rate when using verify to check for script load
 * 
 */
function loader(params) {

	// CONSTANTS
	var CONST_NODE_CSS = 'link';
	var CONST_NODE_SCRIPT = 'script';
	var CONST_TYPE_CSS = 'css';
	var CONST_TYPE_SCRIPT = 'js';
	var CONST_QUEUE_STRUCT = {
		complete : 'complete',
		verify : 'verify',
		source : 'source'
	};

	// local vars
	var rate = params.rate || 300;
	var document = window.document;

	// loader queue
	if (!loader.queue)
		loader.queue = [];
	var queue = loader.queue;// set local var pointer

	// exit if missing require parameters
	if (!params || !params.source)
		return;

	// add to queue only if verify and complete callbacks provided
	if (params[CONST_QUEUE_STRUCT.verify]
			&& params[CONST_QUEUE_STRUCT.complete]) {
		queue.push({
			complete : params[CONST_QUEUE_STRUCT.complete] || null,
			verify : params[CONST_QUEUE_STRUCT.verify] || null,
			source : params[CONST_QUEUE_STRUCT.source] || null
		});
	}

	// START --- of "CASES"

	// case 1 - if script already exists on page, process then exit
	if (existing(params.source)) {

		process();
		return;

		// case 2 - script previously added to queue, just process
	} else if ((function() {
		var count = 0;
		for ( var i = 0; i < queue.length; i++) {
			if (params.source === queue[i].source)
				count++;
		}
		if (count > 1)
			return true;
		return false;
	})()) {
		process();
		return;

		// case 3 - new script create then process
	} else {

		create(params.source);
		process();
		return;

	}

	// END--- of "CASES"

	// hoisted utility functions

	function process() {
		if (!queue || !queue.length)
			return;
		for ( var i = queue.length - 1; i >= 0; i--) {
			if (!queue[i])
				continue;// another thread may have acted upon array and
							// recently removed element
			if (queue[i][CONST_QUEUE_STRUCT.verify]()) {
				var item = queue.splice(i, 1)[0];
				item[CONST_QUEUE_STRUCT.complete](item);
			}
		}
		setTimeout(process, rate);
	}

	function existing(source) {
		if (!source)
			return false;
		var type = (source.lastIndexOf('.') === CONST_TYPE_CSS ? CONST_NODE_CSS
				: CONST_NODE_SCRIPT);
		var elements = document.getElementsByTagName(type);
		for ( var i = 0; i < elements.length; i++) {
			if (type === CONST_NODE_CSS) {
				if (elements.href === source)
					return true;
			} else if (CONST_NODE_SCRIPT) {
				if (elements.src === source)
					return true;
			}
		}
		return false;
	}

	function create(source) {
		var element = null;
		if (source.slice(source.length - 2, source.length) === CONST_TYPE_SCRIPT) {
			element = document.createElement(CONST_NODE_SCRIPT);
			element.src = source;
			element.type = 'text/javascript';
		} else if (source.slice(source.length - 3, source.length) === CONST_TYPE_CSS) {
			element = document.createElement(CONST_NODE_CSS);
			element.href = source;
			element.type = 'text/css';
			element.rel = "stylesheet";
		}
		if (typeof element !== "undefined") {
			document.getElementsByTagName('head').item(0).appendChild(element);
		}
		return element;
	}

};

/*
 * vestibule's utility methods
 */

function defineLoadAndReplace(name,location) {
	defineMethodByName(name, function() {
		var args = arguments;
		loader({
			source : location,
			verify : function() {
				var validated = findMethodByName(name);
				if (validated && !validated[VESTIBULE_KEY])
					return true;
			},
			complete : function(params) {
				findMethodByName(name).apply(this, args);
			}
		});
	});
}

function defineMethodByName(name, behavior) {
	var context = window;
	var namespaces = name.split(".");
	var func = namespaces.pop();
	for ( var i = 0; i < namespaces.length; i++) {
		if (typeof context[namespaces[i]] === 'undefined')// create
			context[namespaces[i]] = {};
		context = context[namespaces[i]];
	}
	if (typeof context[func] === 'undefined')
		context[func] = behavior;
	context[func][VESTIBULE_KEY.toString()] = VESTIBULE_KEY;
	return null;
}

function findMethodByName(name) {
	if (typeof name === 'function')
		return name;
	var context = window;
	var namespaces = name.split(".");
	var func = namespaces.pop();
	for ( var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func];
}

function loadAndCallScript(source, validate, structure, complete) {
	loader({
		source : source,
		verify : validate,
		complete : function(params) {
			structure.method = findMethodByName(structure.method);
			var output = structure.method.apply(structure.object,
					structure.args);
			if (typeof complete === 'function') {
				complete(output);
			}
		}
	});
}

function parseQueryString(input) {
	var query = "";
	var params = {};
	if (input) {
		query = input;
	} else {
		query = location.href.split('?')[1];
	}
	if (query && query.length) {
		var nvpairs = query.split("&");
		for ( var idx = 0; idx < nvpairs.length; idx++) {
			var tokens = nvpairs[idx].split("=");
			params[unescape(tokens[0])] = tokens.length == 2 ? unescape(tokens[1])
					: undefined;
		}
	}
	return params;
}
})();