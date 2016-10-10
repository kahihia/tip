// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers',
    'google.places', 'ngStorage', 'youtube-embed', 'ngCordova'])

    .run(function ($ionicPlatform, $rootScope, $localStorage, $http, $timeout, $ionicPopup) {
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

        // what time is it now?

        $rootScope.timeNow = new Date().getHours() + ":" + new Date().getMinutes();

        if ($rootScope.timeNow > "13:00") {

            $rootScope.today = ("0" + new Date().getDate()).slice(-2) + '/' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear();

        } else {

            $rootScope.today = ("0" + (new Date().getDate() - 1)).slice(-2) + '/' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear();

        }

        // global variables

        $rootScope.host = 'http://tapper.co.il/tipli/laravel/public/';
        $rootScope.isAnswerCorrect = false;
        $rootScope.isQuestionAnswered = $localStorage.isQuestionAnswered;
        $rootScope.userData = {
            "firstname" : $localStorage.firstname,
            "lastname" : $localStorage.lastname,
            "password" : $localStorage.password,
            "email" : $localStorage.email,
            "gender" : $localStorage.gender,
            "soldier" : $localStorage.soldier,
            "userid" : $localStorage.userid
        };
        $rootScope.categories = [];
        $rootScope.currentState = "";

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
            //                 if ($rootScope.currentState != 'app.register' ||
            //                     $rootScope.currentState != 'app.teaser' ||
            //                     $rootScope.currentState != 'app.question' ||
            //                     $rootScope.currentState != 'app.answer' ||
            //                     $rootScope.currentState != 'app.discount') {
            //
            //                     $ionicPopup.alert({
            //                         title: data.data[0].title,
            //                         buttons: [{
            //                             text: 'OK',
            //                             type: 'button-positive'
            //                         }]
            //                     });
            //
            //                 }
            //
            //             }, 2000)
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
        ;
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/login');
    });
