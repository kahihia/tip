angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});


    })

    .controller('RegisterCtrl', function ($scope, $ionicPopup, $http, $rootScope, $localStorage, $state) {

        $scope.autocompleteOptions = {
            componentRestrictions: { country: 'il' },
            //types: ['geocode']
        };

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
            'code' : ""

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
                    title: "Password length must be more than three chars!",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else if (!emailRegex.test($scope.register.email)){

                $ionicPopup.alert({
                    title: "Please enter valid email!",
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
                    'code' : $scope.register.code

                };

                $http.post($rootScope.host + 'RegisterUser', send_data, {

                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                }).then(

                    function(data){

                        console.log(data);

                        if (data.data.response.status == "0"){

                            $localStorage.userId = data.data.response.userid;
                            $state.go('app.home');

                        } else {

                            $ionicPopup.alert({
                                title: "The user already exists!",
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
                            title: "No network connection!",
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


    .controller('LoginCtrl', function ($scope, $ionicPopup, $ionicModal, $http, $rootScope, $localStorage, $state) {

        $scope.login = {

            'email' : $localStorage.userData.email,
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

                console.log($scope.login);

                $http.post($rootScope.host + 'LoginUser', $scope.login, {

                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                }).then(

                    function(data){

                        console.log(data);

                        if (data.data.response.status == "0"){

                            $ionicPopup.alert({
                                title: "Login data is not valid! Please use forgot password button if necessary!",
                                buttons: [{
                                    text: 'OK',
                                    type: 'button-positive'
                                }]
                            })

                        } else {

                            $localStorage.userData = data.data.response;
                            $rootScope.userData = $localStorage.userData;
                            $state.go('app.home');

                        }

                    },

                    function(error){

                        $ionicPopup.alert({
                            title: "No network connection!",
                            buttons: [{
                                text: 'OK',
                                type: 'button-positive'
                            }]
                        })

                    }
                );

            }

        };

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

        //  MAKE FORGOT PASSWORD TO THE END

    })

    .controller('HomeCtrl', function ($scope, $localStorage, $state) {

        $scope.checkState = function(){

            if (!$localStorage.isQuestionAnswered || $localStorage.isQuestionAnswered == "" || $localStorage.isQuestionAnswered == false){

                $state.go('app.teaser');

            } else {

                $state.go('app.discount');

            }

        };

    })

    .controller('QuestionCtrl', function ($scope, $http, $rootScope, $ionicPopup, $state, $localStorage) {

        // what time is it now?

        $scope.timeNow = new Date().getHours() + ":" + new Date().getMinutes();

        if ($scope.timeNow > "13:00") {

            $scope.today = ("0" + new Date().getDate()).slice(-2) + '/' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear();

        } else {

            $scope.today = ("0" + (new Date().getDate() - 1)).slice(-2) + '/' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear();

        }

        var send_data = {

            'date' : $scope.today

        };

        // get question for today if time >= 13:00 and for yesterday if time < 13:00

        $scope.question = {};
        $scope.rightAnswer = '';

        $http.post($rootScope.host + 'GetQuestionByDate', send_data, {

            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

        }).then(

            function(data){

                $scope.question = data.data[0];
                $scope.question.question_image = "http://tapper.co.il/tipli/php/" + $scope.question.question_image;

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
                    title: "No network connection!",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            }

        );

        // check answer

        $scope.userAnswer = {

            'selected' : ''

        };

        $scope.checkAnswer = function(){

            $localStorage.isQuestionAnswered = true;
            $rootScope.isQuestionAnswered = $localStorage.isQuestionAnswered;

            $state.go('app.answer');

            if ($scope.userAnswer.selected == $scope.question.correct_answer) {

                $rootScope.isAnswerCorrect = true;

            } else {

                $rootScope.isAnswerCorrect = false;

            }

            console.log($rootScope.isAnswerCorrect);

        };

    })

    .controller('DiscountCtrl', function ($scope) {



    })


    .controller('PersonalCtrl', function ($scope, $rootScope, $ionicPopup, $localStorage, $cordovaCamera) {

        $scope.selection = 'personal';

        $scope.personalInformation = {

            "firstname" : $localStorage.userData.firstname,
            "lastname" : $localStorage.userData.lastname,
            "email" : $localStorage.userData.email,
            "birthday" : new Date($localStorage.userData.birthday),
            "old_password" : "",
            "new_password" : ""

        };

        $scope.userpic = '';

        $scope.getPhoto = function () {

            var options = {

                quality: 75,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                // targetWidth: 900,
                // targetHeight: 1200,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true

            };

            $cordovaCamera.getPicture(options).then(

                function(data){

                    $scope.userpic = data;

                },

                function(err) {

                    $ionicPopup.alert({
                        title: "The photo was not loaded!",
                        buttons: [{
                            text: 'OK',
                            type: 'button-positive'
                        }]
                    });

                }
            )

        };

        $scope.saveChanges = function(){

            console.log($scope.personalInformation);
            console.log($localStorage.userData.password);

            var emailRegex = /\S+@\S+\.\S+/;

            if ($scope.personalInformation.firstname == "" || $scope.personalInformation.lastname == "" ||
                $scope.personalInformation.email == "" || $scope.personalInformation.birthday == ""){

                $ionicPopup.alert({
                    title: "נא למלא את כל השדות",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else if (!emailRegex.test($scope.personalInformation.email)){

                $ionicPopup.alert({
                    title: "Please enter valid email!",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else if ($scope.personalInformation.old_password != "" && $scope.personalInformation.old_password != $rootScope.userData.password) {

                $ionicPopup.alert({
                    title: "Please enter valid current password!",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else if ($scope.personalInformation.old_password != "" && $scope.personalInformation.new_password == ""){

                $ionicPopup.alert({
                    title: "Please enter new password!",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else if ($scope.personalInformation.new_password != "" && $scope.personalInformation.new_password.length < 3){

                $ionicPopup.alert({
                    title: "Password length must be more than three chars!",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else {

                console.log('Valid');
                console.log($scope.personalInformation);

                

            }


        }

    })

    .controller('InformationCtrl', function ($scope) {



    })

;