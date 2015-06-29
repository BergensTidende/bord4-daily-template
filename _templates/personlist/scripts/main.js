define([
    'jquery',
    'pym',
    'handlebars',
    'underscore'
], function ($, pym, Handlebars, _ ) {

	try {
    	var pymChild = new pym.Child();
	} catch (err) {
		console.log("No pym parent");
	}


    var group_template = Handlebars.compile($("#group-template").html());

    function getData(callback) {

		$.getJSON( "data/testpersons.json", function( data ) {			

			var groups = _.groupBy(data.personer, 'part');
			callback(groups);
		});
	}

	function renderPeople(groups) {
		_.each(groups, function(persons, groupname) {

			var sorted = _.sortBy(persons, 'sortering');
			console.log(groupname, sorted);
			$('#group_container').append(group_template(
				{
					personer: sorted,
					gruppe: groupname
				}
			));
		});

		$(".btn-readmore").click(function() {
			$(".groups").addClass("expanded");
			$('.readmore').addClass("expanded")
			pymChild.sendHeight();

		});

		pymChild.sendHeight();
	}


	getData(renderPeople);


});