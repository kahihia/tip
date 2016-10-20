angular.module('starter.factories', [])

    .factory('isFavoriteFactory', function($rootScope){

        return {

            isFavorite: function(x){

                for (var k = 0; k < $rootScope.favoriteDeals.length; k++){

                    if (x == $rootScope.favoriteDeals[k].index){

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

                        var newFav = data.data[0];

                        newFav.deal.favorite_id = data.data[0].index;
                        newFav.deal.image = $rootScope.phpHost + newFav.deal.image;
                        newFav.deal.image2 = $rootScope.phpHost + newFav.deal.image2;

                        var newFavoriteDeal = newFav.deal;

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

                    if ($rootScope.favoriteDeals[m].index == x){

                        del_fav.id = $rootScope.favoriteDeals[m].favorite_id;

                    }

                }

                $http.post($rootScope.host + 'DelFavoriteById', del_fav, {

                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                }).then(

                    function(data){

                        if (data.data[0].status == "1"){

                            for (var n = 0; n < $rootScope.favoriteDeals.length; n++){

                                if ($rootScope.favoriteDeals[n].favorite_id == del_fav.id){

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
