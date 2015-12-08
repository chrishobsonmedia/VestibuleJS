
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
