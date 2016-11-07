// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.factories', 'starter.filters',
    'google.places', 'ngStorage', 'youtube-embed', 'ngCordova'
])

    .run(function ($ionicPlatform, $ionicHistory, $rootScope, $localStorage, $http, $timeout, $ionicPopup, $state, $cordovaGeolocation, $ionicSideMenuDelegate) {
        $ionicPlatform.ready(function () {

                // Back button
				
				$ionicPlatform.registerBackButtonAction(function (event) 
				{
					if($state.current.name == 'app.login' || $state.current.name == 'app.home' ||
                        $state.current.name == 'app.question' || $state.current.name == 'app.answer') {

					    // do nothing

					}  else {

						 $ionicHistory.goBack();

					}
					
				},100);


                // Notifications and GA

                document.addEventListener("deviceready", function(){

                    // Google Analytics

                    window.ga.startTrackerWithId('UA-86948163-1');

                    // Notifications

                    var notificationOpenedCallback = function (jsonData) {

                        // alert(JSON.stringify(jsonData));

                        // NEW MESSAGE FROM SPECIALIST

                        if (jsonData.additionalData.type == "newmessage") {

                            if ($localStorage.userid == ''){        // if not logged in

                                $state.go('app.login');

                            } else {        // if logged in

                                $rootScope.pushNotificationType = "newmessage";

                                $state.go('app.personal');

                            }

                        }

                        // DAILY DEAL

                        if (jsonData.additionalData.type == "dailydeal") {

                            $localStorage.isDailyDealSeen = false;
                            $rootScope.isDailyDealSeen = $localStorage.isDailyDealSeen;

                            // alert(JSON.stringify(jsonData.additionalData));

                            if ($localStorage.userid == ''){        // if not logged in

                                $state.go('app.login');

                            } else {        // if logged in

                                $rootScope.pushNotificationType = "dailydeal";

                                $state.go('app.teaser');

                            }

                        }

                        // BIRTHDAY

                        if (jsonData.additionalData.type == "birthday") {

                            if ($localStorage.userid == ''){        // if not logged in

                                $state.go('app.login');

                            } else {        // if logged in

                                $state.go('app.home');

                            }

                        }

                    };

                    window.plugins.OneSignal.init("96b66281-ac3d-44e5-834f-e39b3cc98626",
                        {googleProjectNumber: "627358870772"},
                        notificationOpenedCallback);

                    window.plugins.OneSignal.getIds(function (ids) {

                        $rootScope.pushId = ids.userId;

                    });
                    // Show an alert box if a notification comes in when the user is in your app.
                    window.plugins.OneSignal.enableInAppAlertNotification(true);

                }, false);


                // Default code

                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);

                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }

                // tip after 1 minute

                var send_data = {

                    'date' : $rootScope.today,
                    'type' : ""

                };

                if ($localStorage.soldier == "1"){

                    send_data.type = "1";

                } else {

                    send_data.type = "2";

                }

                $http.post($rootScope.host + 'GetTipByDate', send_data, {

                        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                    }).then(

                        function(data){

                            console.log("Daily tip", data);
                            $localStorage.isTipShown = false;

                            $timeout(function () {

                                $rootScope.$watch('currState.current.name', function() {

                                    if ($rootScope.currState.current.name != 'app.register' &&
                                        $rootScope.currState.current.name != 'app.teaser' &&
                                        $rootScope.currState.current.name != 'app.question' &&
                                        $rootScope.currState.current.name != 'app.answer' &&
                                        $rootScope.currState.current.name != 'app.discount' &&
                                        $localStorage.isTipShown == false) {

                                        $rootScope.dailyTipText = data.data[0].title;

                                        var dailyTipPopup = $ionicPopup.show({
                                            templateUrl: 'templates/popup_daily_tip.html',
                                            scope: $rootScope,
                                            cssClass: 'dailyTipPopup'
                                        });

                                        $rootScope.hideDailyTip = function () {

                                            dailyTipPopup.close();

                                        };

                                        $localStorage.isTipShown = true;
                                    }

                                 })

                            }, 60000)

                        },

                        function(err){

                            console.log(err);

                        });

                // geolocation

                if (window.cordova) {

                    $ionicPlatform.ready(function () {

                        CheckGPS.check(function win() {

                                var posOptions = {timeout: 3000, enableHighAccuracy: true};

                                $cordovaGeolocation
                                    .getCurrentPosition(posOptions)
                                    .then(function (position) {

                                        $rootScope.lat = position.coords.latitude;
                                        $rootScope.lng = position.coords.longitude;
                                        $rootScope.getDealsWithLocation($rootScope.lat, $rootScope.lng);

                                    }, function (err) {

                                        $rootScope.getDealsWithoutLocation();

                                    });

                            },

                            function fail() {

                                $rootScope.getDealsWithoutLocation();

                            });

                    });

                } else {

                    var posOptions = {enableHighAccuracy: false};

                    $cordovaGeolocation
                        .getCurrentPosition(posOptions)
                        .then(function (position) {

                            $rootScope.lat = position.coords.latitude;
                            $rootScope.lng = position.coords.longitude;

                            $rootScope.getDealsWithLocation($rootScope.lat, $rootScope.lng);

                        }, function (err) {

                            $rootScope.getDealsWithoutLocation();
                            console.log('err1', err);

                        });

                }

            });

        // global variables

        $rootScope.host = 'http://tapper.co.il/tipli/laravel/public/';
        $rootScope.phpHost = "http://tapper.co.il/tipli/php/";
        $rootScope.imageHost = "http://tapper.co.il/tipli/php/uploads";
        $rootScope.isDailyDealSeen = $localStorage.isDailyDealSeen;
        $rootScope.isTipShown = $localStorage.isTipShown;
        $rootScope.isAnswerCorrect = false;
        $rootScope.correctAnswers = 0;
        $rootScope.incorrectAnswers = 0;
        $rootScope.allPoints = 0;
        $rootScope.monthPoints = 0;
        $rootScope.userData = {
            "userid" : $localStorage.userid,
            "firstname" : $localStorage.firstname,
            "lastname" : $localStorage.lastname,
            "password" : $localStorage.password,
            "email" : $localStorage.email,
            "gender" : $localStorage.gender,
            "soldier" : $localStorage.soldier,
            "conscription_date" : $localStorage.conscription_date,
            "release_date" : $localStorage.release_date
        };
        $rootScope.image = $localStorage.image;
        $rootScope.categories = [];
        $rootScope.currState = $state;
        $rootScope.infoCategories = ['רשיון נהיגה', 'תקלות ברכב', 'עשה ואל תעשה', 'במקרה של תאונה', 'מה אומר החוק', 'שאל את המומחה', 'טלפונים חשובים'];
        $rootScope.deals = [];
        $rootScope.closeDeals = [];
        $rootScope.favoriteDeals = [];
        $rootScope.todayDeal = {};
        $rootScope.lat = "";
        $rootScope.lng = "";
        $rootScope.isLocationEnabled = false;
        $rootScope.bannersMain = [];
        $rootScope.bannersTeaser = [];
        $rootScope.bannersInfo = [];
        $rootScope.monthBanner = "";
        $rootScope.yearBanner = "";


        // get catalog categories

        $http.post($rootScope.host + 'GetDealCategories', '', {

            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

        }).then(

            function(data){

                for (var i = 0; i < data.data.length; i++){

                    $rootScope.categories.push(data.data[i]);

                }

                var sales = {};

                for(var j = 0; j < $rootScope.categories.length; j++){

                    if ($rootScope.categories[j].index == "10"){

                        sales = $rootScope.categories[j];

                        $rootScope.categories.splice(j, 1);
                        $rootScope.categories.unshift(sales);

                    }

                }

                console.log("Categories", $rootScope.categories);

            },

            function(err){

                $ionicPopup.alert({
                    title: "אין חיבור לרשת",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            });


        // menu links

        $rootScope.categoryNumber = 0;
        $rootScope.categoryName = '';

        $rootScope.setCategory = function(x, y){

            $rootScope.categoryNumber = x;
            $rootScope.categoryName = y;

            if (x != 0){
                if (window.cordova){
                    window.ga.trackEvent('קטגוריות', y);
                }
            }

        };

        // toggle menu

        $rootScope.toggleRightSideMenu = function() {

            $ionicSideMenuDelegate.toggleRight();

        };

        // get all user points

        $rootScope.getUserPoints = function(){

            var send_points = {

                "user" : $localStorage.userid

            };

            $http.post($rootScope.host + 'GetPointsPerMonth', send_points, {

                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

            }).then(

                function(data){

                    console.log("Points", data.data);

                    $rootScope.correctAnswers = data.data.month_correct;
                    $rootScope.incorrectAnswers = data.data.month_wrong;
                    $rootScope.monthPoints = data.data.month_points;
                    $rootScope.allPoints = data.data.total_points;

                },

                function(err){

                    $ionicPopup.alert({
                        title: "אין חיבור לרשת",
                        buttons: [{
                            text: 'OK',
                            type: 'button-positive'
                        }]
                    });

                });

        };


        // logout

        $rootScope.logout = function() {

            var send_user = {

                'user' : $localStorage.userid

            };

            $http.post($rootScope.host + 'LogOutUser', send_user, {

                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

            }).then(

                function(data){

                    console.log(data);

                    if(data.data[0].status == '1'){

                        $localStorage.email = "";
                        $localStorage.password = "";
                        $localStorage.userid = "";
                        $localStorage.soldier = "";
                        $localStorage.gender = "";
                        $localStorage.image = "";

                        $state.go('app.login');



                    } else {

                        $ionicPopup.alert({
                            title: "אין חיבור לרשת",
                            buttons: [{
                                text: 'OK',
                                type: 'button-positive'
                            }]
                        });

                    }

                },

                function(err){

                    $ionicPopup.alert({
                        title: "אין חיבור לרשת",
                        buttons: [{
                            text: 'OK',
                            type: 'button-positive'
                        }]
                    });

                });



        };

        // what time is it now?

        $rootScope.timeNow = ("0" + new Date().getHours()).slice(-2) + ":" + ("0" + new Date().getMinutes()).slice(-2);

        if ($rootScope.timeNow > "12:59") {

            $rootScope.today = ("0" + new Date().getDate()).slice(-2) + '/' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear();
            $rootScope.todayDate = ("0" + new Date().getDate()).slice(-2) + '/' + ("0" + (new Date().getMonth() + 1)).slice(-2);

        } else {

            $rootScope.temp = new Date();
            $rootScope.temp = $rootScope.temp.setDate($rootScope.temp.getDate()-1);

            $rootScope.today = ("0" + new Date($rootScope.temp).getDate()).slice(-2) + '/' + ("0" + (new Date($rootScope.temp).getMonth() + 1)).slice(-2) + '/' + new Date($rootScope.temp).getFullYear();
            $rootScope.todayDate = ("0" + new Date($rootScope.temp).getDate()).slice(-2) + '/' + ("0" + (new Date($rootScope.temp).getMonth() + 1)).slice(-2);

        }

        // get all deals without location

        $rootScope.getDealsWithoutLocation = function(){

            $http.post($rootScope.host + 'GetDeals', '', {

                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

            }).then(

                function(data){

                    $rootScope.deals = data.data;

                    for(var i = 0; i < $rootScope.deals.length; i++){

                        if ($rootScope.deals[i].linktitle == ""){

                            $rootScope.deals[i].linktitle = "קוד הטבה" ;

                        }

                        $rootScope.deals[i].imageSlider = [];

                        if ($rootScope.deals[i].image2 != "" || $rootScope.deals[i].image3 != "" || $rootScope.deals[i].image4 != ""){

                            $rootScope.deals[i].imageSlider.push($rootScope.deals[i].image);

                            if ($rootScope.deals[i].image2 != "") {

                                $rootScope.deals[i].imageSlider.push($rootScope.deals[i].image2);

                            }

                            if ($rootScope.deals[i].image3 != "") {

                                $rootScope.deals[i].imageSlider.push($rootScope.deals[i].image3);

                            }

                            if ($rootScope.deals[i].image4 != "") {

                                $rootScope.deals[i].imageSlider.push($rootScope.deals[i].image4);

                            }

                        }

                    }

                    $rootScope.isLocationEnabled = false;

                    console.log("DealsWithoutLocation", $rootScope.deals);

                },

                function(err){

                    $ionicPopup.alert({
                        title: "אין חיבור לרשת",
                        buttons: [{
                            text: 'OK',
                            type: 'button-positive'
                        }]
                    });

                });

        };

        // get all deals with location

        $rootScope.getDealsWithLocation = function(){

            var send_coord = {

                'lat' : $rootScope.lat,
                'lng' : $rootScope.lng

            };

            $http.post($rootScope.host + 'GetDealsWithLocation', send_coord, {

                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

            }).then(

                function(data){

                    $rootScope.deals = data.data;

                    for(var i = 0; i < $rootScope.deals.length; i++){

                        if ($rootScope.deals[i].linktitle == ""){

                            $rootScope.deals[i].linktitle = "קוד הטבה" ;

                        }

                        $rootScope.deals[i].imageSlider = [];

                        if ($rootScope.deals[i].image2 != "" || $rootScope.deals[i].image3 != "" || $rootScope.deals[i].image4 != ""){

                            $rootScope.deals[i].imageSlider.push($rootScope.deals[i].image);

                            if ($rootScope.deals[i].image2 != "") {

                                $rootScope.deals[i].imageSlider.push($rootScope.deals[i].image2);

                            }

                            if ($rootScope.deals[i].image3 != "") {

                                $rootScope.deals[i].imageSlider.push($rootScope.deals[i].image3);

                            }

                            if ($rootScope.deals[i].image4 != "") {

                                $rootScope.deals[i].imageSlider.push($rootScope.deals[i].image4);

                            }

                        }

                        $rootScope.closeDeals = [];

                        for (var j = 0; j < $rootScope.deals[i].brances.length; j++){

                            if (Number($rootScope.deals[i].brances[j][0].dist) <= 10){

                                $rootScope.closeDeals.push($rootScope.deals[i]);

                            }

                        }

                    }

                    $rootScope.isLocationEnabled = true;

                    console.log("closeDeals", $rootScope.closeDeals);

                    console.log("DealsWithLocation", $rootScope.deals);

                },

                function(err){

                    $ionicPopup.alert({
                        title: "אין חיבור לרשת",
                        buttons: [{
                            text: 'OK',
                            type: 'button-positive'
                        }]
                    });

                });

        };

        // show popup with quantity of points collected by user

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {

            if (fromState.name == 'app.answer' && toState.name == 'app.discount'){

                $rootScope.leftQuestions = 15 - Number($rootScope.correctAnswers) - Number($rootScope.incorrectAnswers);

                $timeout(function(){

                    var pointsPopup = $ionicPopup.show({
                        templateUrl: 'templates/popup_points.html',
                        scope: $rootScope,
                        cssClass: 'pointsPopup'
                    });

                    $rootScope.hidePointsPopup = function () {

                        pointsPopup.close();

                    };

                }, 10000);

            }

            if ((fromState.name == 'app.catalog' && toState.name == 'app.home') || (fromState.name == 'app.item' && toState.name == 'app.home')){

                $rootScope.setCategory(0, "");

            }

        });

        // banners

        $http.post($rootScope.host + 'GetBannersByType', '', {

            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

        }).then(

            function(data){

                $rootScope.bannersData = data.data;

                for (var p = 0; p < $rootScope.bannersData.length; p++){

                    // $rootScope.bannersData[p].image = $rootScope.phpHost + 'uploads/' + $rootScope.bannersData[p].image;

                    if ($rootScope.bannersData[p].gallery_id == '1'){

                        $rootScope.bannersMain.push($rootScope.bannersData[p]);

                    } else if ($rootScope.bannersData[p].gallery_id == '2'){

                        $rootScope.monthBanner = $rootScope.bannersData[p];

                    } else if ($rootScope.bannersData[p].gallery_id == '3'){

                        $rootScope.yearBanner = $rootScope.bannersData[p];

                    } else if ($rootScope.bannersData[p].gallery_id == '4'){

                        $rootScope.bannersTeaser.push($rootScope.bannersData[p]);

                    } else if ($rootScope.bannersData[p].gallery_id == '5'){

                        $rootScope.bannersInfo.push($rootScope.bannersData[p]);

                    }

                }
                console.log("Banners", $rootScope.bannersMain, $rootScope.bannersTeaser, $rootScope.bannersInfo);
                console.log('Month banner', $rootScope.monthBanner);
                console.log('Year banner', $rootScope.yearBanner);

            },

            function(err){

                $ionicPopup.alert({
                    title: "אין חיבור לרשת",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
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

            .state('app.router', {
                url: '/router',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/router.html',
                        controller: 'RouterCtrl'
                    }
                }

            })

            .state('app.enter', {
                url: '/enter',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/enter.html',
                        controller: 'RegisterCtrl'
                    }
                }
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

            .state('app.question_to_specialist', {
                url: '/question_to_specialist',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/question_to_specialist.html',
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
        // if none of the above states are matched, use this as the fallback router
        $urlRouterProvider.otherwise('/app/router');
    });
