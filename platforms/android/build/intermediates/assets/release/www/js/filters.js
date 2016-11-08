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