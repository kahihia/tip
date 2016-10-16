angular.module('starter.factories', [])

    .factory('isFavoriteFactory', function($rootScope){

        return {

            isFavorite: function(x){

                for (var k = 0; k < $rootScope.favoriteDeals.length; k++){

                    if (x == $rootScope.favoriteDeals[k].deal_id){

                        return true;

                    }

                }

            }
        };

    })

    .factory('makeFavoriteFactory', function($rootScope, $localStorage, $http, $ionicPopup){

        return {

            makeFavorite: function(x){

                var send_fav = {

                    "user" : $localStorage.userid,
                    "dealid" : x

                };

                $http.post($rootScope.host + 'AddFavDeal', send_fav, {

                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                }).then(

                    function(data){

                        var newFavoriteDeal = data.data[0];

                        newFavoriteDeal.deal.image = $rootScope.phpHost + newFavoriteDeal.deal.image;
                        newFavoriteDeal.deal.image2 = $rootScope.phpHost + newFavoriteDeal.deal.image2;

                        $rootScope.favoriteDeals.push(newFavoriteDeal);

                        $ionicPopup.alert({
                            title: "Successfully added!",
                            buttons: [{
                                text: 'OK',
                                type: 'button-positive'
                            }]
                        });

                    },

                    function(err){

                        $ionicPopup.alert({
                            title: "No network connection!",
                            buttons: [{
                                text: 'OK',
                                type: 'button-positive'
                            }]
                        });

                    });

            }
        };

    })


    .factory('deleteFavoriteFactory', function($rootScope, $ionicPopup, $http){

        return {

            deleteFavorite: function(x){

                var del_fav = {

                    "id" : ""

                };

                for (var m = 0; m < $rootScope.favoriteDeals.length; m++){

                    if ($rootScope.favoriteDeals[m].deal.index == x){

                        del_fav.id = $rootScope.favoriteDeals[m].index;

                    }

                }

                $http.post($rootScope.host + 'DelFavoriteById', del_fav, {

                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                }).then(

                    function(data){

                        if (data.data[0].status == "1"){

                            for (var n = 0; n < $rootScope.favoriteDeals.length; n++){

                                if ($rootScope.favoriteDeals[n].index == del_fav.id){

                                    $rootScope.favoriteDeals.splice(n, 1);

                                }

                            }

                            $ionicPopup.alert({
                                title: "Successfully deleted!",
                                buttons: [{
                                    text: 'OK',
                                    type: 'button-positive'
                                }]
                            });


                        } else {

                            $ionicPopup.alert({
                                title: "No network connection!",
                                buttons: [{
                                    text: 'OK',
                                    type: 'button-positive'
                                }]
                            });

                        }

                    },

                    function(err){

                        $ionicPopup.alert({
                            title: "No network connection!",
                            buttons: [{
                                text: 'OK',
                                type: 'button-positive'
                            }]
                        });

                    });

            }
        };

    })

;
