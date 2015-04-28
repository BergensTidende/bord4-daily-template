define([
    'jquery',
    'pym',
], function ($, pym ) {

	try {
    	var pymChild = new pym.Child();
	} catch (err) {
		console.log("No pym parent");
	}

});