// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.factories',
    'google.places', 'ngStorage', 'youtube-embed', 'ngCordova'])

    .run(function ($ionicPlatform, $rootScope, $localStorage, $http, $timeout, $ionicPopup, $state, $cordovaGeolocation) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });

        // global variables

        $rootScope.host = 'http://tapper.co.il/tipli/laravel/public/';
        $rootScope.phpHost = "http://tapper.co.il/tipli/php/";
        $rootScope.isAnswerCorrect = false;
        $rootScope.isQuestionAnswered = $localStorage.isQuestionAnswered;
        $rootScope.correctAnswers = 0;
        $rootScope.incorrectAnswers = 0;
        $rootScope.allPoints = 0;
        $rootScope.userData = {
            "firstname" : $localStorage.firstname,
            "lastname" : $localStorage.lastname,
            "password" : $localStorage.password,
            "email" : $localStorage.email,
            "gender" : $localStorage.gender,
            "soldier" : $localStorage.soldier,
            "userid" : $localStorage.userid
        };
        $rootScope.image = $localStorage.image;
        $rootScope.categories = [];
        $rootScope.currState = $state;
        $rootScope.infoCategories = ['רשיון נהיגה', 'תקלות ברכב', 'עשה ואל תעשה', 'במקרה של תאונה', 'מה אומר החוק', 'שאל את המומחה', 'טלפונים חשובים'];
        $rootScope.deals = [];
        $rootScope.favoriteDeals = [];
        $rootScope.lat = "";
        $rootScope.lng = "";

        // menu links

        $rootScope.categoryNumber = {};
        $rootScope.categoryName = '';

        $rootScope.setCategory = function(x, y){

            $rootScope.categoryNumber.number = x;
            $rootScope.categoryName = y;

        };

        // what time is it now?

        $rootScope.timeNow = new Date().getHours() + ":" + new Date().getMinutes();

        if ($rootScope.timeNow > "13:00") {

            $rootScope.today = ("0" + new Date().getDate()).slice(-2) + '/' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear();

        } else {

            $rootScope.today = ("0" + (new Date().getDate() - 1)).slice(-2) + '/' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear();

        }


        // PUSH NOTIFICATIONS: CHANGE $localstorage.isQuestionAnswered TO FALSE WHEN NOTIFICATION RECEIVED


        $ionicPlatform.ready(function () {


            // tip after 1 minute

            // var send_data = {
            //
            //     'date' : $rootScope.today
            //
            // };
            //
            // $http.post($rootScope.host + 'GetTipByDate', send_data, {
            //
            //         headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}
            //
            //     }).then(
            //
            //         function(data){
            //
            //             $timeout(function () {
            //
            //                 $rootScope.$watch('currState.current.name', function() {
            //
            //                     if ($rootScope.currState.current.name != 'app.register' &&
            //                         $rootScope.currState.current.name != 'app.teaser' &&
            //                         $rootScope.currState.current.name != 'app.question' &&
            //                         $rootScope.currState.current.name != 'app.answer' &&
            //                         $rootScope.currState.current.name != 'app.discount') {
            //
            //                         $ionicPopup.alert({
            //                             title: data.data[0].title,
            //                             buttons: [{
            //                                 text: 'OK',
            //                                 type: 'button-positive'
            //                             }]
            //                         });
            //
            //                     }
            //
            //                 });
            //
            //             }, 60000)
            //
            //         },
            //
            //         function(err){
            //
            //             console.log(err);
            //
            //         });

            // get catalog categories

            $http.post($rootScope.host + 'GetDealCategories', '', {

                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

            }).then(

                function(data){

                    console.log(data);

                    for (var i = 0; i < data.data.length; i++){

                        $rootScope.categories.push(data.data[i]);

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

        });


        // which route should I use?

        // $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
        //
        //     if (toState.name == 'app.home' && !$localStorage.userid){
        //
        //         console.log(toState.name);
        //
        //         $state.go('app.register');
        //
        //     } else if (toState.name == 'app.home' && $localStorage.userid == "") {
        //
        //         console.log(toState.name);
        //
        //         $state.go('app.login');
        //
        //     }
        //
        // });

        // geolocation

        if(window.cordova) {

            $ionicPlatform.ready(function () {

                CheckGPS.check(function win() {

                    alert('win')

                        // var posOptions = {timeout: 3000, enableHighAccuracy: true};
                        //
                        // $cordovaGeolocation
                        //     .getCurrentPosition(posOptions)
                        //     .then(function (position) {
                        //
                        //         $rootScope.lat = position.coords.latitude;
                        //         $rootScope.lng = position.coords.longitude;
                        //         alert($rootScope.lat + ' ' + $rootScope.lng + ' 1')
                        //         // $rootScope.getDealsWithLocation($rootScope.lat, $rootScope.lng);
                        //
                        //     }, function (err) {
                        //
                        //         // $rootScope.getDealsWithoutLocation();
                        //
                        //     });

                    },

                    function fail() {

                        alert('fail')

                        // cordova.dialogGPS("Your GPS is Disabled.",
                        //     'Please enable location for proper work of the application',
                        //
                        //     function (buttonIndex) {
                        //
                        //         switch (buttonIndex) {
                        //             case 0:     // no
                        //
                        //                 // $rootScope.getDealsWithoutLocation();
                        //                 break;
                        //
                        //             case 1:     // neutral
                        //
                        //                 // $rootScope.getDealsWithoutLocation();
                        //                 break;
                        //
                        //             case 2:     // yes, go to settings
                        //
                        //                 document.addEventListener("resume", onResume, false);
                        //
                        //             function onResume() {
                        //
                        //                 var posOptions = {timeout: 3000, enableHighAccuracy: true};
                        //
                        //                 $cordovaGeolocation
                        //                     .getCurrentPosition(posOptions)
                        //                     .then(function (position) {
                        //
                        //                         $rootScope.lat = position.coords.latitude;
                        //                         $rootScope.lng = position.coords.longitude;
                        //                         alert($rootScope.lat + ' ' + $rootScope.lng + ' 2');
                        //
                        //                         // $rootScope.getDealsWithLocation($rootScope.lat, $rootScope.lng);
                        //
                        //                     }, function (err) {
                        //
                        //                         // $rootScope.getDealsWithoutLocation();
                        //
                        //                     });
                        //             }
                        //
                        //                 break;
                        //
                        //             default:
                        //
                        //                 // $rootScope.getDealsWithoutLocation();
                        //                 break;
                        //         }
                        //
                        //     });

                    });

            });

        } else {

            var posOptions = {enableHighAccuracy: false};

            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {

                    $rootScope.lat = position.coords.latitude;
                    $rootScope.lng = position.coords.longitude;

                    // $rootScope.getDealsWithLocation($rootScope.lat, $rootScope.lng);

                }, function(err) {

                    // $rootScope.getDealsWithoutLocation();
                    console.log('err1', err);

                });

        }

    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('app.register', {
                url: '/register',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/register.html',
                        controller: 'RegisterCtrl'
                    }
                }
            })

            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })

            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.catalog', {
                url: '/catalog',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/catalog.html',
                        controller: 'CatalogCtrl'
                    }
                }
            })
            //
            // .state('app.category', {
            //     url: '/category/:categoryId',
            //     views: {
            //         'menuContent': {
            //             templateUrl: 'templates/category.html',
            //             controller: 'CatalogCtrl'
            //         }
            //     }
            // })

            .state('app.item', {
                url: '/item/:itemId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/item.html',
                        controller: 'ItemCtrl'
                    }
                }
            })

            .state('app.question', {
                url: '/question',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/question.html',
                        controller: 'QuestionCtrl'
                    }
                }
            })

            .state('app.answer', {
                url: '/answer',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/answer.html',
                        controller: 'QuestionCtrl'
                    }
                }
            })

            .state('app.teaser', {
                url: '/teaser',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/teaser.html',
                        controller: 'DiscountCtrl'
                    }
                }
            })

            .state('app.discount', {
                url: '/discount',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/discount.html',
                        controller: 'DiscountCtrl'
                    }
                }
            })

            .state('app.personal', {
                url: '/personal',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/personal.html',
                        controller: 'PersonalCtrl'
                    }
                }
            })

            .state('app.information', {
                url: '/information',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/information.html',
                        controller: 'InformationCtrl'
                    }
                }
            })

            .state('app.article', {
                url: '/article/:articleId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/article.html',
                        controller: 'ArticleCtrl'
                    }
                }
            })
        ;
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/login');
    });
