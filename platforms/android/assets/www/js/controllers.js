angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $localStorage, $ionicModal, $timeout, $state) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

    })

    .controller('RouterCtrl', function($scope, $ionicPopup, $http, $rootScope, $localStorage, $state, $ionicHistory){

        if (typeof $localStorage.enterScreenIsSeen != "undefined"){

            if ($localStorage.password && $localStorage.password != "") {

                var send_user = {

                    "user" : $localStorage.userid

                };

                $http.post($rootScope.host + 'CheckUserSeenDeal', send_user, {

                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                }).then(

                    function(data){

                        if (data.data.response.seendeal == "0"){

                            $localStorage.isDailyDealSeen = false;
                            $rootScope.isDailyDealSeen = $localStorage.isDailyDealSeen;

                            $rootScope.getUserPoints();

                            $ionicHistory.nextViewOptions({
                                disableAnimate: true,
                                expire: 300
                            });

                            $state.go('app.question');

                        } else {

                            $localStorage.isDailyDealSeen = true;
                            $rootScope.isDailyDealSeen = $localStorage.isDailyDealSeen;

                            $rootScope.getUserPoints();

                            $ionicHistory.nextViewOptions({
                                disableAnimate: true,
                                expire: 300
                            });

                            $state.go('app.home');

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

            } else {

                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    expire: 300
                });

                $state.go('app.login');

            }

        } else {

            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                expire: 300
            });

            $state.go('app.enter');
            $localStorage.enterScreenIsSeen = true;

        }

    })

    .controller('RegisterCtrl', function ($ionicSideMenuDelegate, $q, $ionicLoading, $scope, $ionicPopup, $http, $rootScope, $localStorage, $state) {

        $scope.goToRegister = function(){

            $state.go("app.register");

            if(window.cordova) {
                window.ga.trackEvent('מסך הסלידר נצפה', 'כן');
            }

        };

        $scope.$on('$ionicView.enter', function(e) {

            if(window.cordova){
                window.ga.trackView($state.current.name);
            }

        });

        $ionicSideMenuDelegate.canDragContent(false);

        // Facebook login - works, don't touch it!

        // This is the success callback from the login method
        var fbLoginSuccess = function(response) {
            if (!response.authResponse){
                fbLoginError("Cannot find the authResponse");
                return;
            }

            var authResponse = response.authResponse;

            getFacebookProfileInfo(authResponse)
                .then(function(profileInfo) {

                    $scope.FacebookLoginFunction(profileInfo.id,profileInfo.first_name,profileInfo.last_name,profileInfo.email,profileInfo.gender);

                    $ionicLoading.hide();
                    //$state.go('app.home');
                }, function(fail){
                    // Fail get profile info
                    console.log('profile info fail', fail);
                });
        };

        // This is the fail callback from the login method
        var fbLoginError = function(error){
            console.log('fbLoginError', error);
            $ionicLoading.hide();
        };

        // This method is to get the user profile info from the facebook api
        var getFacebookProfileInfo = function (authResponse) {
            var info = $q.defer();

            facebookConnectPlugin.api('/me?fields=email,name,gender,first_name,last_name,locale&access_token=' + authResponse.accessToken, null,
                function (response) {
                    console.log(response);
                    info.resolve(response);
                },
                function (response) {
                    console.log(response);
                    info.reject(response);
                }
            );
            return info.promise;
        };

        //This method is executed when the user press the "Login with facebook" button
        $scope.FaceBookLoginBtn = function() {

            facebookConnectPlugin.getLoginStatus(function(success){
                if(success.status === 'connected'){
                    // The user is logged in and has authenticated your app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed request, and the time the access token
                    // and signed request each expire
                    console.log('getLoginStatus', success.status);

                    getFacebookProfileInfo(success.authResponse)
                        .then(function(profileInfo) {

                            $scope.FacebookLoginFunction(profileInfo.id,profileInfo.first_name,profileInfo.last_name,profileInfo.email,profileInfo.gender);

                            //$state.go('app.home');
                        }, function(fail){
                            // Fail get profile info
                            console.log('profile info fail', fail);
                        });

                } else {
                    // If (success.status === 'not_authorized') the user is logged in to Facebook,
                    // but has not authenticated your app
                    // Else the person is not logged into Facebook,
                    // so we're not sure if they are logged into this app or not.

                    //console.log('getLoginStatus', success.status);

                    $ionicLoading.show({
                        template: 'loading...<ion-spinner icon="spiral"></ion-spinner>'
                    });


                    // Ask the permissions you need. You can learn more about
                    // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                    facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
                }
            });
        };

        $scope.FacebookLoginFunction = function(id,firstname,lastname,email,gender)
        {
            $scope.fullname = firstname+' '+lastname;
            $scope.gender = (gender == "male" ? "0" : "1");

            $scope.register.firstname = firstname;
            $scope.register.lastname = lastname;
            $scope.register.email = email;
            $scope.register.gender = $scope.gender;
        };

        // google autocomplete options

        $scope.autocompleteOptions = {
            componentRestrictions: { country: 'il' },
            //types: ['geocode']
        };

        // registration

        $scope.register = {

            'firstname' : "",
            'lastname' : "",
            'email' : "",
            'password' : "",
            'gender' : "",
            'birthday' : "",
            'maps' : "",
            'soldier' : "",
            'conscription_date' : "",
            'release_date' : "",
            'code' : "",
            'push_id' : ''

        };

        $scope.makeRegistration = function(){

            console.log($scope.register);

            var emailRegex = /\S+@\S+\.\S+/;

            if ($scope.register.firstname == "" || $scope.register.lastname == "" ||$scope.register.email == "" ||
                $scope.register.password == "" || $scope.register.gender == "" || $scope.register.birthday == ""
                || $scope.register.maps == ""  || $scope.register.soldier == "" ){

                $ionicPopup.alert({
                    title: "נא למלא את כל השדות",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else if ($scope.register.password.length < 3){

                $ionicPopup.alert({
                    title: "דרוש יותר משלושה תווים לסיסמא",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else if (!emailRegex.test($scope.register.email)){

                $ionicPopup.alert({
                    title: "נא להכניס כתובת מייל תקינה",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else if ($scope.register.soldier == "1" && ($scope.register.conscription_date == "" || $scope.register.release_date == "")){

                $ionicPopup.alert({
                    title: "נא למלא תאריך גיוס ותאריך שחרור",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else {

                console.log($scope.register);

                var send_data = {

                    'firstname' : $scope.register.firstname,
                    'lastname' : $scope.register.lastname,
                    'email' : $scope.register.email,
                    'password' : $scope.register.password,
                    'gender' : $scope.register.gender,
                    'birthday' : $scope.register.birthday,
                    'address' : $scope.register.maps.formatted_address,
                    'location_lat' : $scope.register.maps.geometry.location.lat(),
                    'location_lng' : $scope.register.maps.geometry.location.lng(),
                    'soldier' : $scope.register.soldier,
                    'conscription_date' : $scope.register.conscription_date,
                    'release_date' : $scope.register.release_date,
                    'code' : $scope.register.code,
                    'push_id' : $rootScope.pushId

                };

                $http.post($rootScope.host + 'RegisterUser', send_data, {

                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                }).then(

                    function(data){

                        console.log(data);

                        if (data.data.response.status == "0"){

                            $localStorage.userid = data.data.response.userid;
                            $localStorage.email = $scope.register.email;
                            $localStorage.password = $scope.register.password;
                            $localStorage.firstname = $scope.register.firstname;
                            $localStorage.lastname = $scope.register.lastname;
                            $localStorage.gender = $scope.register.gender;
                            $localStorage.birthday = $scope.register.birthday;
                            $localStorage.soldier = $scope.register.soldier;
                            $localStorage.conscription_date = $scope.register.conscription_date;
                            $localStorage.release_date = $scope.register.release_date;

                            $rootScope.userData.userid = $localStorage.userid;
                            $rootScope.userData.email = $localStorage.email;
                            $rootScope.userData.password = $localStorage.password;
                            $rootScope.userData.firstname = $localStorage.firstname;
                            $rootScope.userData.lastname = $localStorage.lastname;
                            $rootScope.userData.gender = $localStorage.gender;
                            $rootScope.userData.birthday = $localStorage.birthday;
                            $rootScope.userData.soldier = $localStorage.soldier;
                            $rootScope.userData.conscription_date = $localStorage.conscription_date;
                            $rootScope.userData.release_date = $localStorage.release_date;

                            $state.go('app.home');

                        } else {

                            $ionicPopup.alert({
                                title: "המשתמש כבר רשום במערכת",
                                buttons: [{
                                    text: 'OK',
                                    type: 'button-positive'
                                }]
                            }).then(function(){

                                $state.go('app.login')

                            });

                        }

                    },

                    function(error){

                        $ionicPopup.alert({
                            title: "אין חיבור לרשת",
                            buttons: [{
                                text: 'OK',
                                type: 'button-positive'
                            }]
                        })

                    }
                );

            }

        }

    })


    .controller('LoginCtrl', function ($ionicLoading, $ionicSideMenuDelegate, $scope, $ionicPopup, $ionicModal, $http, $rootScope, $localStorage, $state) {

        $ionicSideMenuDelegate.canDragContent(false);

        $scope.$on('$ionicView.enter', function(e) {

            // if(window.cordova){
            //     window.ga.trackView("עמוד כניסה");
            // }

            $scope.login = {

                'email' : $localStorage.email,
                'password' : ''

            };

            // login

            $scope.makeLogin = function(){

                var emailRegex = /\S+@\S+\.\S+/;

                if($scope.login.email == '' || $scope.login.password == '') {

                    $ionicPopup.alert({
                        title: "נא למלא את כל השדות",
                        buttons: [{
                            text: 'OK',
                            type: 'button-positive'
                        }]
                    });

                } else {

                    var send_data = {

                        'email' : $scope.login.email,
                        'password' : $scope.login.password,
                        'push_id' : $rootScope.pushId

                    };

                    // alert(JSON.stringify(send_data));

                    $http.post($rootScope.host + 'LoginUser', send_data, {

                        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                    }).then(

                        function(data){

                            console.log(data);

                            if (data.data.response.status == "0"){

                                $ionicPopup.alert({
                                    title: 'טעות במייל או בסיסמא. נא ללחוץ על הכתפור "שכחתי סיסמא" במידת הצורך',
                                    buttons: [{
                                        text: 'OK',
                                        type: 'button-positive'
                                    }]
                                })

                            } else {

                                $localStorage.firstname = data.data.response.firstname;
                                $localStorage.lastname = data.data.response.lastname;
                                $localStorage.email = $scope.login.email;
                                $localStorage.password = $scope.login.password;
                                $localStorage.birthday = data.data.response.birthday;
                                $localStorage.userid = data.data.response.userid;
                                $localStorage.soldier = data.data.response.soldier;
                                $localStorage.gender = data.data.response.gender;
                                $localStorage.image = data.data.response.image;

                                if(data.data.response.soldier == '1'){

                                    $localStorage.conscription_date = data.data.response.conscription_date;
                                    $localStorage.release_date = data.data.response.release_date;

                                }

                                $rootScope.userData = data.data.response;
                                $rootScope.userData.password = $scope.login.password;
                                $rootScope.image = $localStorage.image;

                                $rootScope.getUserPoints();

                                $state.go('app.home');

                                $scope.login = {

                                    'email' : $localStorage.email,
                                    'password' : '',
                                    'push_id' : $rootScope.pushId

                                };

                            }

                        },

                        function(error){

                            $ionicPopup.alert({
                                title: "אין חיבור לרשת",
                                buttons: [{
                                    text: 'OK',
                                    type: 'button-positive'
                                }]
                            })

                        }
                    );

                }

            };

        });
        // forgot password

        $scope.openForgotPasswordModal = function () {

            $ionicModal.fromTemplateUrl('templates/modal_forgot_password.html', {

                scope: $scope

            }).then(function (ForgotPasswordModal) {

                $scope.ForgotPasswordModal = ForgotPasswordModal;
                $scope.ForgotPasswordModal.show();

            });
        };

        $scope.closeForgotPasswordModal = function () {

            $scope.ForgotPasswordModal.hide();

        };

        $scope.forgot = {

            'email' : ''

        };

        $scope.sendForgotPassword = function(){

            $ionicLoading.show({

                template: 'טעון...'

            }).then(function(){

                $http.post($rootScope.host + 'ForgotPassword', $scope.forgot, {

                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                }).then(

                    function(data){

                        console.log(data.data);

                        if (data.data[0].status == "1"){

                            $ionicLoading.hide();

                            var forgotPasswordPopup = $ionicPopup.show({
                                templateUrl: 'templates/popup_forgot_password.html',
                                scope: $scope,
                                cssClass: 'forgotPasswordPopup'
                            });

                            $rootScope.hideForgotPasswordPopup = function () {

                                forgotPasswordPopup.close();
                                $scope.ForgotPasswordModal.hide();

                            };

                        } else {

                            $ionicLoading.hide();

                            $ionicPopup.alert({
                                title: "טעות בכתובת המייל - נא לנסות שנית",
                                buttons: [{
                                    text: 'OK',
                                    type: 'button-positive'
                                }]
                            })

                        }

                    },

                    function(error){

                        $ionicLoading.hide();

                        $ionicPopup.alert({
                            title: "אין חיבור לרשת",
                            buttons: [{
                                text: 'OK',
                                type: 'button-positive'
                            }]
                        })

                    });

            });

        };

    })

    .controller('HomeCtrl', function ($ionicSideMenuDelegate, $scope, $rootScope, $localStorage, $state, $http, $ionicPopup) {

        $scope.$on('$ionicView.enter', function(e) {

            if(window.cordova){
                window.ga.trackView("עמוד הבית");
            }

        });

        $ionicSideMenuDelegate.canDragContent(false);

        $scope.options = {
            loop: true,
            effect: 'slide',
            speed: 300,
            autoplay: 3000,
            pagination: false
        };

        // for discount and question link

        $scope.checkState = function(){

            if (!$localStorage.isDailyDealSeen || $localStorage.isDailyDealSeen == "" || $localStorage.isDailyDealSeen == false){

                $state.go('app.question');

            } else {

                $state.go('app.discount');

            }

        };

    })

    .controller('QuestionCtrl', function ($ionicSideMenuDelegate, $scope, $http, $rootScope, $ionicPopup, $state, $localStorage) {

        $scope.$on('$ionicView.enter', function(e) {

            if(window.cordova){
                if ($state.current.name == "app.question"){
                    window.ga.trackView("עמוד שאלה");
                } else {
                    window.ga.trackView("עמוד תשובה");
                }
            }

        });

        $ionicSideMenuDelegate.canDragContent(false);

        var send_data = {

            'date' : $rootScope.today,
            'type' : ''

        };

        if ($localStorage.soldier == "1"){

            send_data.type = "1";

        } else {

            send_data.type = "2";

        }

        // get question for today if time >= 13:00 and for yesterday if time < 13:00

        $scope.question = {};
        $scope.rightAnswer = '';

        $http.post($rootScope.host + 'GetQuestionByDate', send_data, {

            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

        }).then(

            function(data){

                console.log(data);

                $scope.question = data.data[0];

                if ($scope.question.correct_answer == "1"){

                    $scope.rightAnswer = $scope.question.answer1;

                } else if($scope.question.correct_answer == "2"){

                    $scope.rightAnswer = $scope.question.answer2;

                } else if($scope.question.correct_answer == "3"){

                    $scope.rightAnswer = $scope.question.answer3;

                } else if($scope.question.correct_answer == "4"){

                    $scope.rightAnswer = $scope.question.answer4;

                }

                console.log($scope.question);
                console.log($scope.rightAnswer);

            },

            function(error){

                $ionicPopup.alert({
                    title: "אין חיבור לרשת",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            }

        );

        // check if answer is correct

        $scope.userAnswer = {

            'selected' : ''

        };

        $scope.selectAnswer = function(x){

            $scope.userAnswer.selected = x;

        };

        // which sound should be?

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {

            if (fromState.name == "app.question" && toState.name == 'app.answer'){

                var gotAnswer = $scope.checkAnswer();

                if (gotAnswer == true){

                    var audio = new Audio('sounds/yes-sound.wav');
                    audio.play();

                } else {

                    var audio = new Audio('sounds/no-sound.wav');
                    audio.play();

                }

            }

        });

        // check what is got from user

        $scope.checkAnswer = function(){

            if ($scope.userAnswer.selected == $scope.question.correct_answer) {

                $rootScope.isAnswerCorrect = true;
                return true;

            } else {

                $rootScope.isAnswerCorrect = false;
                return false;

            }

        };

        // update the table answered_question

        $scope.sendAnswer = function(){

            if ($scope.userAnswer.selected == ""){

                $ionicPopup.alert({
                    title: "נא לבחור באחת התשובות",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else {

                var checkedAnswer = $scope.checkAnswer();


                var send_question = {

                    "user" : $localStorage.userid,
                    "quantity" : "",
                    "correct" : "",
                    "question_index" : $scope.question.index,
                    "answer_index" : $scope.userAnswer.selected

                };

                if (checkedAnswer == true){

                    send_question.quantity = "10";
                    send_question.correct = "1"

                } else if (checkedAnswer == false){

                    send_question.quantity = "2";
                    send_question.correct = "0"

                }

                $http.post($rootScope.host + 'answerQuestion', send_question, {

                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                }).then(

                    function(data){

                        console.log(data);

                        if (window.cordova){
                            window.ga.trackEvent('שאלה נענתה בהצלחה', $rootScope.today);
                            window.ga.trackEvent('שאלה נענתה נכונה', checkedAnswer);
                        }

                        // update local variables

                        if (checkedAnswer == true){

                            $rootScope.allPoints += 10;
                            $rootScope.monthPoints += 10;
                            $rootScope.correctAnswers += 1;

                        } else if (checkedAnswer == false){

                            $rootScope.allPoints += 2;
                            $rootScope.monthPoints += 2;
                            $rootScope.incorrectAnswers += 1;

                        }

                        $state.go('app.answer');

                    },

                    function(error){

                        $ionicPopup.alert({
                            title: "אין חיבור לרשת",
                            buttons: [{
                                text: 'OK',
                                type: 'button-positive'
                            }]
                        });

                    })

            }

        };

        $scope.checkDiscountState = function(){

            var send_user = {

                "user" : $localStorage.userid

            };

            $http.post($rootScope.host + 'UserSeenDeal', send_user, {

                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

            }).then(

                function(data){

                    $localStorage.isDailyDealSeen = true;
                    $rootScope.isDailyDealSeen = $localStorage.isDailyDealSeen;

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

            if ($rootScope.todayDeal.showiframe == "0" && $rootScope.todayDeal.dealgivenby == "1"){

                $state.go('app.discount');
                cordova.InAppBrowser.open($rootScope.todayDeal.codelink, '_blank', 'location=yes');
                if (window.cordova){
                    window.ga.trackEvent('הטבה היום שנלחצה', x.title);
                }

            } else {

                $state.go('app.discount');
                if (window.cordova){
                    window.ga.trackEvent('הטבה היום שנלחצה', x.title);
                }

            }

        }


    })

    .controller('DiscountCtrl', function (isFavoriteFactory, makeFavoriteFactory, $sce, $localStorage, $scope, $rootScope, $state, $http, $ionicPopup) {

        $scope.options = {
            loop: true,
            effect: 'slide',
            speed: 300,
            autoplay: 3000,
            pagination: false
        };

        $scope.$on('$ionicView.enter', function(e) {

            if(window.cordova){
                if ($state.current.name == "app.teaser"){
                    window.ga.trackView("עמוד טיזר");
                } else {
                    window.ga.trackView("עמוד דיל יומי");
                }
            }

            var send_data = {

                'date' : $rootScope.today,
                'soldier' : $localStorage.soldier,
                'gender' : $localStorage.gender
            };

            console.log(send_data);

            // if ($localStorage.soldier == "1" && $localStorage.gender == "1"){
            //
            //     send_data.type = "2"; // soldier female
            //     send_data.fromtype = "3"; // all soldiers
            //
            // } else if ($localStorage.soldier == "1" && $localStorage.gender == "0"){
            //
            //     send_data.type = "1"; // soldier male
            //     send_data.fromtype = "3"; // all soldiers
            //
            // } else if ($localStorage.soldier == "0" && $localStorage.gender == "1"){
            //
            //     send_data.type = "5"; // civil female
            //     send_data.fromtype = "6"; // all civils
            //
            // } else if ($localStorage.soldier == "0" && $localStorage.gender == "0"){
            //
            //     send_data.type = "4"; // civil male
            //     send_data.fromtype = "6"; // all civils
            //
            // }

            // get deal for today

            $scope.noTodayDeal = false;

            $http.post($rootScope.host + 'GetDealByDate', send_data, {

                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

            }).then(
                function (data) {

                    if (data.data.length == 0){

                        $scope.noTodayDeal = true;

                    } else {

                        $scope.noTodayDeal = false;

                        $rootScope.todayDeal = data.data[0];

                        if ($rootScope.todayDeal.linktitle == ""){

                            $rootScope.todayDeal.linktitle = "קוד הטבה" ;

                        }

                        $rootScope.todayDeal.imageSlider = [];

                        if ($rootScope.todayDeal.image2 != "" || $rootScope.todayDeal.image3 != "" || $rootScope.todayDeal.image4 != ""){

                            $rootScope.todayDeal.imageSlider.push($rootScope.todayDeal.image);

                            if ($rootScope.todayDeal.image2 != "") {

                                $rootScope.todayDeal.imageSlider.push($rootScope.todayDeal.image2);

                            }

                            if ($rootScope.todayDeal.image3 != "") {

                                $rootScope.todayDeal.imageSlider.push($rootScope.todayDeal.image3);

                            }

                            if ($rootScope.todayDeal.image4 != "") {

                                $rootScope.todayDeal.imageSlider.push($rootScope.todayDeal.image4);

                            }

                        }

                        if ($rootScope.todayDeal.showiframe == "1"){

                            $scope.iframeLink = $sce.trustAsResourceUrl($rootScope.todayDeal.codelink);

                        }

                        console.log("Today Deal", $rootScope.todayDeal);

                        if ($state.current.name == "app.discount"){

                            var data_send = {

                                "user" : $localStorage.userid,
                                "deal_id" : $rootScope.todayDeal.index,
                                "supplier_id" : $rootScope.todayDeal.supplier_id

                            };

                            $http.post($rootScope.host + 'CountDealView', data_send, {

                                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                            }).then(

                                function(data){

                                    console.log(data);
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

                        }

                    }

                },

                function (err) {

                    $ionicPopup.alert({
                        title: "אין חיבור לרשת",
                        buttons: [{
                            text: 'OK',
                            type: 'button-positive'
                        }]
                    });

                });

        });

        // check if the deal is favorite

        $scope.isFavorite = function (x) {

            return isFavoriteFactory.isFavorite(x);

        };

        // make favorite

        $scope.makeFavorite = function(x, y){

            return makeFavoriteFactory.makeFavorite(x, $scope, y);

        };

        // open links

        $scope.goToLink = function(x, y){

            cordova.InAppBrowser.open(x, '_blank', 'location=yes');
            if(window.cordova) {
                window.ga.trackEvent('לינק בהטבה היומית', y);
            }

        };

    })

    .controller('PersonalCtrl', function (dateFilter, $timeout, $ionicScrollDelegate, $ionicSideMenuDelegate, $http, $scope, $rootScope, $ionicPopup, $localStorage, $cordovaCamera, $state) {

        $scope.$on('$ionicView.enter', function(e) {

            $rootScope.getUserPoints();

            if(window.cordova){
                if ($state.current.name == "app.personal"){
                    window.ga.trackView("עמוד אזור אישי");
                } else {
                    window.ga.trackView("עמוד פניה למומחה");
                }
            }

            // for push notifications from specialist answers

            if ($rootScope.pushNotificationType) {

                if ($rootScope.pushNotificationType == "newmessage"){

                    $scope.setSelection('message');
                    $rootScope.pushNotificationType = "";

                }

            }

            // for scroll at app.question_to_specialist

            if ($state.current.name == "app.question_to_specialist") {

                $timeout(function(){

                    $ionicScrollDelegate.$getByHandle('smallScroll').scrollBottom(true);

                }, 100)

            }

        });

        $ionicSideMenuDelegate.canDragContent(false);

        // select tab

        $scope.selection = 'personal';

        $scope.setSelection = function(x){

            $scope.selection = x;

            if ($scope.selection == 'message') {

                $timeout(function(){

                    $ionicScrollDelegate.$getByHandle('smallScroll').scrollBottom(true);

                }, 100)

            }

        };

        // PROFILE

        // fill in personal info

        $scope.personalInformation = {

            "firstname" : $localStorage.firstname,
            "lastname" : $localStorage.lastname,
            "email" : $localStorage.email,
            // "birthday" : new Date($localStorage.birthday),
            "birthday" : $localStorage.birthday,
            // "conscription_date" : new Date($localStorage.conscription_date),
            "conscription_date" : $localStorage.conscription_date,
            // "release_date" : new Date($localStorage.release_date),
            "release_date" : $localStorage.release_date,
            "old_password" : "",
            "new_password" : ""

        };

        // console.log(dateFilter($localStorage.birthday, 'dd/MM/yyyy'));

        // working with picture

        $scope.userpic = '';
        $scope.userpicURL = '';

        $scope.getPhoto = function () {

            var options = {

                quality : 75,
                destinationType : Camera.DestinationType.FILE_URI,  //Camera.DestinationType.DATA_URL,
                sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 600,
                targetHeight: 600,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true

            };

            $cordovaCamera.getPicture(options).then(

                function(data){

                    $scope.userpic = data;

                    // alert($scope.userpic);

                    var options = new FileUploadOptions();

                    options.mimeType = "jpeg";
                    options.fileKey = "file";
                    options.chunkedMode = false;

                    // options.fileName = $scope.userpic.substr(($scope.userpic.lastIndexOf("/")+1), $scope.userpic.indexOf("?"));
                    // alert(options.fileName);

                    var ft = new FileTransfer();

                    ft.upload($scope.userpic, encodeURI($rootScope.host + "UploadNewImage"), function(data){

                        // alert(JSON.stringify(data.response));
                        $scope.userpicURL = $rootScope.phpHost + data.response;
                        $localStorage.image = $scope.userpicURL;
                        $rootScope.image = $localStorage.image;

                    }, function(err){

                        $ionicPopup.alert({
                            title: "התמונה לא נטענה",
                            buttons: [{
                                text: 'OK',
                                type: 'button-positive'
                            }]
                        });

                    }, options);

                },

                function(err) {

                    $ionicPopup.alert({
                        title: "התמונה לא נטענה",
                        buttons: [{
                            text: 'OK',
                            type: 'button-positive'
                        }]
                    });

                }
            )

        };

        // save information and picture

        $scope.saveChanges = function(){

            console.log($scope.personalInformation);

            // 1. check everything

            var emailRegex = /\S+@\S+\.\S+/;

            if ($scope.personalInformation.firstname == "" || $scope.personalInformation.lastname == "" ||
                $scope.personalInformation.email == "" || $scope.personalInformation.birthday == "" || $scope.personalInformation.birthday == null){

                $ionicPopup.alert({
                    title: "נא למלא את כל השדות",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else if ($localStorage.soldier == '1' && ($scope.personalInformation.conscription_date == "" || $scope.personalInformation.release_date == "" ||
                $scope.personalInformation.conscription_date == null || $scope.personalInformation.release_date == null)) {

                $ionicPopup.alert({
                    title: "נא למלא את כל השדות",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else if (!emailRegex.test($scope.personalInformation.email)){

                $ionicPopup.alert({
                    title: "נא להכניס כתובת מייל תקינה",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else if ($scope.personalInformation.old_password != "" && $scope.personalInformation.old_password != $localStorage.password) {

                $ionicPopup.alert({
                    title: "נא להזין סיסמא נוכחית",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else if ($scope.personalInformation.old_password != "" && $scope.personalInformation.new_password == ""){

                $ionicPopup.alert({
                    title: "נא להזין סיסמא חדשה",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else if ($scope.personalInformation.new_password != "" && $scope.personalInformation.new_password.length < 3){

                $ionicPopup.alert({
                    title: "דרוש יותר משלושה תווים לסיסמא",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else {

                    // 3. on success - collect everything in one variable

                    var send_data = {

                            "user" : $localStorage.userid,
                            "firstname" : $scope.personalInformation.firstname,
                            "lastname" : $scope.personalInformation.lastname,
                            "email" : $scope.personalInformation.email,
                            "birthday" : dateFilter($scope.personalInformation.birthday, 'yyyy-MM-dd'),
                            // "birthday" : $scope.personalInformation.birthday,
                            "image" : $localStorage.image,
                            "conscription_date" : "",
                            "release_date" : "",
                            "password" : ''

                    };

                    if ($scope.personalInformation.new_password != ""){

                        send_data.password = $scope.personalInformation.new_password;

                    } else {

                        send_data.password = $localStorage.password;

                    }

                    if($localStorage.soldier == "1"){

                        send_data.conscription_date = dateFilter($scope.personalInformation.conscription_date, 'yyyy-MM-dd');
                        send_data.release_date = dateFilter($scope.personalInformation.release_date, 'yyyy-MM-dd');

                    }

                    // alert(JSON.stringify(send_data));

                    // 3. send update info

                    $http.post($rootScope.host + 'updateProfile', send_data, {

                        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                    }).then(

                        function(data){

                            console.log(data);

                           if (data.data[0].status == '1'){

                               // 4. if success, update localStorage and rootScope

                               $localStorage.firstname = send_data.firstname;
                               $localStorage.lastname = send_data.lastname;
                               $localStorage.email = send_data.email;
                               $localStorage.birthday = send_data.birthday;
                               $localStorage.password = send_data.password;
                               $localStorage.conscription_date = send_data.conscription_date;
                               $localStorage.release_date = send_data.release_date;

                               if ($scope.personalInformation.new_password != ""){

                                   $localStorage.password = send_data.password;

                               }

                               $rootScope.userData = {
                                   "firstname" : $localStorage.firstname,
                                   "lastname" : $localStorage.lastname,
                                   "password" : $localStorage.password,
                                   "email" : $localStorage.email,
                                   "birthday" : $localStorage.birthday,
                                   "gender" : $localStorage.gender,
                                   "soldier" : $localStorage.soldier,
                                   "userid" : $localStorage.userid,
                                   "conscription_date" : $localStorage.conscription_date,
                                   "release_date" : $localStorage.release_date
                               };

                               $scope.personalInformation = {

                                   "firstname" : $localStorage.firstname,
                                   "lastname" : $localStorage.lastname,
                                   "email" : $localStorage.email,
                                   // "birthday" : new Date($localStorage.birthday),
                                   "birthday" : $localStorage.birthday,
                                   // "conscription_date" : new Date($localStorage.conscription_date),
                                   "conscription_date" : $localStorage.conscription_date,
                                   // "release_date" : new Date($localStorage.release_date),
                                   "release_date" : $localStorage.release_date,
                                   "old_password" : "",
                                   "new_password" : ""

                               };

                               // 5. inform the user that everything is ok

                               var updatedInfoPopup = $ionicPopup.show({
                                   templateUrl: 'templates/popup_updated_info.html',
                                   scope: $scope,
                                   cssClass: 'updatedInfoPopup'
                               });

                               $rootScope.hideUpdatedInfoPopup = function () {

                                   updatedInfoPopup.close();

                               };

                           } else {

                               $ionicPopup.alert({
                                   title: "המידע לא עודכן",
                                   buttons: [{
                                       text: 'OK',
                                       type: 'button-positive'
                                   }]
                               })

                           }

                        },

                        function(error){

                            $ionicPopup.alert({
                                title: "אין חיבור לרשת",
                                buttons: [{
                                    text: 'OK',
                                    type: 'button-positive'
                                }]
                            })

                        }
                    );

            }

        };

        // MESSAGE TO A SPECIALIST

        // get all questions/answers

        $scope.messages = [];

        var get_messages = {

            "user" : $localStorage.userid

        };

        $http.post($rootScope.host + 'GetSpecialistMsg', get_messages, {

                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

            }).then(

                function(data){

                    $scope.messages = data.data;

                    for(var i = 0; i < $scope.messages.length; i++){

                        $scope.messages[i].date = Date.parse($scope.messages[i].date);

                    }

                    console.log("Messages", $scope.messages);

                },

                function(err){

                    $ionicPopup.alert({
                        title: "אין חיבור לרשת",
                        buttons: [{
                            text: 'OK',
                            type: 'button-positive'
                        }]
                    })

                });

        // send message

        $scope.message = {

            "subject" : ""

        };

        $scope.sendMessage = function(){

            if ($scope.message.subject == ""){

                $ionicPopup.alert({
                    title: "נא לכתוב את שאלתך למומחה",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                })

            } else {

                var send_message = {

                    "user" : $localStorage.userid,
                    "message" : $scope.message.subject

                };

                console.log(send_message);

                $http.post($rootScope.host + 'MessageSpecialist', send_message, {

                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                }).then(

                    function(data){

                        if (data.data[0].status == "1"){

                            $ionicPopup.alert({
                                title: "פנייתך תועבר למומחה, תשובה בימים הקרובים",
                                buttons: [{
                                    text: 'OK',
                                    type: 'button-positive'
                                }]
                            });

                            var new_message = {
                                "date" : new Date(),
                                "index" : "",
                                "message" : $scope.message.subject,
                                "type" : "question",
                                "userid" : $localStorage.userid
                            };

                            $scope.messages.push(new_message);

                            $scope.message = {

                                "subject" : ""

                            };

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

            }

        }

    })

    .controller('CatalogCtrl', function ($ionicScrollDelegate, $ionicLoading, $cordovaGeolocation, isFavoriteFactory, deleteFavoriteFactory, makeFavoriteFactory, $scope, $rootScope, $http, $ionicPopup, $state, $localStorage) {

        $scope.$on('$ionicView.enter', function(e) {

            if(window.cordova){
                window.ga.trackView("קטלוג");
            }

        });

        // scroll to top

        $scope.scrollTop = function () {

            $ionicScrollDelegate.scrollTop('shouldAnimate');

        };

        // open page at catalog

        $scope.openItem = function(x){

            var data_send = {

                "user" : $localStorage.userid,
                "deal_id" : x.index,
                "supplier_id" : x.supplier_id

            };
            // console.log("data_send", data_send);

            $http.post($rootScope.host + 'CountDealView', data_send, {

                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

            }).then(

                function(data){

                    console.log(data);
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

            if (x.showiframe == "0" && x.dealgivenby == "1"){

                $state.go('app.item', {itemId:x.index});
                cordova.InAppBrowser.open(x.codelink, '_blank', 'location=yes');
                if (window.cordova){
                    window.ga.trackEvent('הטבות שנלחצו', x.title);
                }

            } else {

                $state.go('app.item', {itemId:x.index});
                if (window.cordova){
                    window.ga.trackEvent('הטבות שנלחצו', x.title);
                }

            }

        };


        $scope.selection = 'catalog';

        $scope.chooseTab = function(x){

            $scope.selection = x;

        };

        $scope.weekAgo = new Date().setDate(new Date().getDate()-7);

        // get all favorites for the user

        var send_data = {

            "user" : $localStorage.userid

        };

        $http.post($rootScope.host + 'GetUserFav', send_data, {

            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

        }).then(

            function(data){

                $scope.favorites = data.data;

                for(var j = 0; j < $scope.favorites.length; j++){

                    $rootScope.favoriteDeals.push($scope.favorites[j]);

                }

                console.log("Favs", $rootScope.favoriteDeals);

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

        // check if the deal is favorite

        $scope.isFavorite = function (x) {

            return isFavoriteFactory.isFavorite(x);

        };

        // make favorite

        $scope.makeFavorite = function(x, y){

            return makeFavoriteFactory.makeFavorite(x, $scope, y);

        };

        // delete favorite

        $scope.deleteFavorite = function(x, y){

            return deleteFavoriteFactory.deleteFavorite(x, $scope, y);

        };

        // is GPS is off and user wants to see the closest deals (turn on GPS and load deals with location);

        $scope.$watch('selection', function(){

            if ($scope.selection == 'location'){

                if ($rootScope.isLocationEnabled == false) {

                    cordova.dialogGPS("Your GPS is Disabled.",
                        'Please enable location for proper work of the application',

                        function (buttonIndex) {

                            switch (buttonIndex) {
                                case 0:     // no

                                    $ionicPopup.alert({
                                        title: "לא הפעלת את הGPS",
                                        buttons: [{
                                            text: 'OK',
                                            type: 'button-positive'
                                        }]
                                    });

                                    break;

                                case 1:     // neutral

                                    $ionicPopup.alert({
                                        title: "לא הפעלת את הGPS",
                                        buttons: [{
                                            text: 'OK',
                                            type: 'button-positive'
                                        }]
                                    });

                                    break;

                                case 2:     // yes, go to settings

                                    document.addEventListener("resume", onResume, false);

                                function onResume() {

                                    var posOptions = {timeout: 3000, enableHighAccuracy: true};

                                    $cordovaGeolocation
                                        .getCurrentPosition(posOptions)
                                        .then(function (position) {

                                            $rootScope.lat = position.coords.latitude;
                                            $rootScope.lng = position.coords.longitude;

                                            $rootScope.getDealsWithLocation($rootScope.lat, $rootScope.lng);

                                        }, function (err) {

                                            $ionicPopup.alert({
                                                title: "קליטת רשת GPS חלשה מדי",
                                                buttons: [{
                                                    text: 'OK',
                                                    type: 'button-positive'
                                                }]
                                            });

                                            $rootScope.getDealsWithoutLocation();

                                        });
                                }

                                    break;

                                default:

                                    $rootScope.getDealsWithoutLocation();
                                    break;
                            }

                        });

                } else if ($rootScope.isLocationEnabled == true){
                    console.log("here2");
                    var posOptions = {timeout: 3000, enableHighAccuracy: true};

                    $cordovaGeolocation
                        .getCurrentPosition(posOptions)
                        .then(function (position) {

                            $rootScope.lat = position.coords.latitude;
                            $rootScope.lng = position.coords.longitude;

                            $rootScope.getDealsWithLocation($rootScope.lat, $rootScope.lng);

                        }, function (err) {

                            $ionicPopup.alert({
                                title: "קליטת רשת GPS חלשה מדי",
                                buttons: [{
                                    text: 'OK',
                                    type: 'button-positive'
                                }]
                            });

                            $rootScope.getDealsWithoutLocation();

                        });

                }

            }

        });

        // clicking on button Turn on GPS

        $scope.turnOnGPS = function(){

            // move user to settings

            cordova.plugins.diagnostic.switchToLocationSettings();

            // listen to his return

            document.addEventListener("resume", onResume, false);

            function onResume() {

                CheckGPS.check(function win() {     // if he turned on GPS

                    $ionicLoading.show({

                        template: 'טעון...'

                    }).then(function(){

                        var posOptions = {enableHighAccuracy: false};

                        $cordovaGeolocation
                            .getCurrentPosition(posOptions)
                            .then(function (position) {

                                $rootScope.lat = position.coords.latitude;
                                $rootScope.lng = position.coords.longitude;

                                $rootScope.getDealsWithLocation($rootScope.lat, $rootScope.lng);

                                $ionicLoading.hide();

                                document.removeEventListener("resume", onResume);

                            }, function(err) {

                                $ionicPopup.alert({
                                    title: "קליטת רשת GPS חלשה מדי",
                                    buttons: [{
                                        text: 'OK',
                                        type: 'button-positive'
                                    }]
                                });

                                $rootScope.getDealsWithoutLocation();
                                console.log('err1', err);

                                $ionicLoading.hide();

                                document.removeEventListener("resume", onResume);

                            });

                    })

                }, function fail(){     // if he didn't turn on GPS

                    setTimeout(function() {

                        $ionicPopup.alert({
                            title: "לא הפעלת את הGPS - נא לנסות שנית",
                            buttons: [{
                                text: 'OK',
                                type: 'button-positive'
                            }]
                        });

                    }, 0);

                    document.removeEventListener("resume", onResume);

                });

            }

        };

    })

    .controller('ItemCtrl', function ($sce, isFavoriteFactory, makeFavoriteFactory, deleteFavoriteFactory, $scope, $stateParams, $rootScope, $state) {

        $scope.$on('$ionicView.enter', function(e) {

            $scope.deal = {};

            // choosing deal

            for(var i = 0; i < $rootScope.deals.length; i++){

                if ($stateParams.itemId == $rootScope.deals[i].index){

                    $scope.deal = $rootScope.deals[i];

                    if ($scope.deal.showiframe == "1"){

                        $scope.iframeLink = $sce.trustAsResourceUrl($scope.deal.codelink);

                    }

                    console.log($scope.deal);

                }

            }

            if(window.cordova){
                window.ga.trackView("הטבה" + " - " + $scope.deal.title);
            }

        });

        $scope.options = {
            loop: true,
            effect: 'slide',
            speed: 300,
            autoplay: 3000,
            pagination: false
        };

        $scope.goToLink = function(x, y){

            cordova.InAppBrowser.open(x, '_blank', 'location=yes');
            if(window.cordova) {
                window.ga.trackEvent('לינק בהטבה', y);
            }

        };

        // check if the deal is favorite

        $scope.isFavorite = function (x) {

            return isFavoriteFactory.isFavorite(x);

        };

        // make favorite

        $scope.makeFavorite = function(x, y){

            return makeFavoriteFactory.makeFavorite(x, $scope, y);

        };

    })

    .controller('InformationCtrl', function ($scope, $ionicSideMenuDelegate, $state) {

        $scope.$on('$ionicView.enter', function(e) {

            if(window.cordova){
                window.ga.trackView("מידע שימושי");
            }

        });

        $ionicSideMenuDelegate.canDragContent(false);

        $scope.options = {
            loop: true,
            effect: 'slide',
            speed: 300,
            autoplay: 3000,
            pagination: false
        };

    })

    .controller('ArticleCtrl', function ($ionicScrollDelegate, $ionicSideMenuDelegate, $scope, $rootScope, $state, $stateParams, $http, $localStorage, $ionicPopup) {

        $ionicSideMenuDelegate.canDragContent(false);

        $scope.infoCategoryName = $rootScope.infoCategories[$stateParams.articleId - 1];
        $scope.infoCategoryIcon = "img/info_articles/" + $stateParams.articleId + ".png";

        $scope.$on('$ionicView.enter', function(e) {

            // console.log($state);

            if(window.cordova){
                window.ga.trackView("מידע שימושי" + " - " + $scope.infoCategoryName);
            }

            $scope.content = {};

            // get article for the page

            var send_data = {

                "catid" : $stateParams.articleId,
                "issoldier" : $localStorage.soldier

            };

            $http.post($rootScope.host + 'GetInfoArticles', send_data, {

                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

            }).then(

                function(data){

                    $scope.content = data.data;

                    for (var i = 0; i < $scope.content.length; i++){

                        // $scope.content[i].image = ($scope.content[i].image == "") ? "" : $rootScope.phpHost + "uploads/" + $scope.content[i].image;
                        // console.log($scope.content[i].desc.length);
                        // $scope.content[i].opened = 0;
                    }

                    console.log("Articles", $scope.content);

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

        });

        // show video if needed

        $scope.showVideo = function (x){

            $scope.video = x;

            var videoPopup = $ionicPopup.show({
                templateUrl: 'templates/popup_video.html',
                scope: $scope,
                cssClass: 'popupVideo'
            });

            $scope.hideVideo = function () {

                videoPopup.close();

            };

        };

        // go to landing page if needed

        $scope.goToPage = function(x){

            cordova.InAppBrowser.open(x, '_blank', 'location=yes');

        };

        // scroll to top

        $scope.scrollTopArticle = function () {

            $ionicScrollDelegate.scrollTop('shouldAnimate');

        };

    })

;