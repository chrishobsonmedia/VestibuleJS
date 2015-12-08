
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
