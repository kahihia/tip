// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers',
    'google.places', 'ngStorage', 'youtube-embed', 'ngCordova'])

    .run(function ($ionicPlatform, $rootScope, $localStorage) {
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
        $rootScope.isAnswerCorrect = false;
        $rootScope.isQuestionAnswered = $localStorage.isQuestionAnswered;
        $rootScope.userData = $localStorage.userData;

        // PUSH NOTIFICATIONS: CHANGE $localstorage.isQuestionAnswered TO FALSE WHEN NOTIFICATION RECEIVED

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
