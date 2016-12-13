angular.module('starter.filters', [])

    .filter('chooseCategory', function($rootScope) {

        return function(input) {

            var out = [];

            for (var i = 0; i < input.length; i++){

                if (input[i].cat_id == $rootScope.categoryNumber) {

                    out.push(input[i]);

                }

            }

            return out;
        }

    });

    // .filter('limitHtml', function() {
    //
    //     return function(text, limit) {
    //
    //         var changedString = String(text).replace(/<[^>]+>/gm, '');
    //         var length = changedString.length;
    //
    //         return changedString.length > limit ? changedString.substr(0, limit - 1) + " " + "<span><a href=''>READ MORE</a></span>" : changedString;
    //
    //     }
    // });