'use strict';
define([
    'jquery',
    'underscore'
], function($,_) {

    return {
        getData: function(url, cb) {
            $.getJSON(url, function(data) {
                var parsed_data = data;
                return cb(parsed_data);
            })
        }
    }

});
