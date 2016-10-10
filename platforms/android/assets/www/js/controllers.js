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

        $scope.$on('$ionicView.enter', function() {

            $rootScope.currentState = $state.current.name;

        });

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

        $scope.$on('$ionicView.enter', function() {

            $rootScope.currentState = $state.current.name;

        });

        $scope.login = {

            'email' : '',
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

                            $localStorage.firstname = data.data.response.firstname;
                            $localStorage.lastname = data.data.response.lastname;
                            $localStorage.email = data.data.response.email;
                            $localStorage.password = data.data.response.password;
                            $localStorage.birthday = data.data.response.birthday;
                            $localStorage.userid = data.data.response.userid;
                            $localStorage.soldier = data.data.response.soldier;
                            $localStorage.gender = data.data.response.gender;

                            $rootScope.userData = data.data.response;

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

    .controller('HomeCtrl', function ($scope, $rootScope, $localStorage, $state) {

        $scope.$on('$ionicView.enter', function() {

            $rootScope.currentState = $state.current.name;

        });

        $scope.checkState = function(){

            if (!$localStorage.isQuestionAnswered || $localStorage.isQuestionAnswered == "" || $localStorage.isQuestionAnswered == false){

                $state.go('app.teaser');

            } else {

                $state.go('app.discount');

            }

        };

    })

    .controller('QuestionCtrl', function ($scope, $http, $rootScope, $ionicPopup, $state, $localStorage) {

        $scope.$on('$ionicView.enter', function() {

            $rootScope.currentState = $state.current.name;

        });

        var send_data = {

            'date' : $rootScope.today

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

    .controller('DiscountCtrl', function ($scope, $rootScope, $state) {

        $scope.$on('$ionicView.enter', function() {

            $rootScope.currentState = $state.current.name;

        });

    })


    .controller('PersonalCtrl', function ($http, $scope, $rootScope, $ionicPopup, $localStorage, $cordovaCamera, $state) {

        $scope.$on('$ionicView.enter', function() {

            $rootScope.currentState = $state.current.name;

        });

        // select tab

        $scope.selection = 'personal';

        // fill in personal info

        $scope.personalInformation = {

            "firstname" : $localStorage.firstname,
            "lastname" : $localStorage.lastname,
            "email" : $localStorage.email,
            "birthday" : new Date($localStorage.birthday),
            "old_password" : "",
            "new_password" : ""

        };

        // working with picture

        $scope.userpic = '';

        $scope.getPhoto = function () {

            var options = {

                quality: 75,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: false,
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

        // save information and picture

        $scope.saveChanges = function(){

            console.log($scope.personalInformation);

            // 1. check everything

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

            } else if ($scope.personalInformation.old_password != "" && $scope.personalInformation.old_password != $localStorage.password) {

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

                // alert('Valid');
                //
                // // 2. collect everything in one variable
                //
                // var send_data = {
                //
                //         "user" : $localStorage.userid,
                //         "firstname" : $scope.personalInformation.firstname,
                //         "lastname" : $scope.personalInformation.lastname,
                //         "email" : $scope.personalInformation.email,
                //         "birthday" : $scope.personalInformation.birthday,
                //         "password" : ''
                //
                // };
                //
                // if ($scope.personalInformation.new_password != ""){
                //
                //     send_data.password = $scope.personalInformation.new_password;
                //
                // } else {
                //
                //     send_data.password = $localStorage.password;
                //
                // }
                //
                // // 3. send update info
                //
                // $http.post($rootScope.host + 'updateProfile', send_data, {
                //
                //     headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}
                //
                // }).then(
                //
                //     function(data){
                //
                //        if (data.data[0].status == '1'){
                //
                //            $localStorage.firstname = send_data.firstname;
                //            $localStorage.lastname = send_data.lastname;
                //            $localStorage.email = send_data.email;
                //            $localStorage.birthday = send_data.birthday;
                //            $localStorage.password = send_data.password;
                //
                //            if ($scope.personalInformation.new_password != ""){
                //
                //                $localStorage.password = send_data.password;
                //
                //            }
                //
                //            $ionicPopup.alert({
                //                title: "The information is successfully updated!",
                //                buttons: [{
                //                    text: 'OK',
                //                    type: 'button-positive'
                //                }]
                //            })
                //
                //        } else {
                //
                //            $ionicPopup.alert({
                //                title: "The data was not updated!",
                //                buttons: [{
                //                    text: 'OK',
                //                    type: 'button-positive'
                //                }]
                //            })
                //
                //
                //        }
                //
                //     },
                //
                //     function(error){
                //
                //         $ionicPopup.alert({
                //             title: "No network connection!",
                //             buttons: [{
                //                 text: 'OK',
                //                 type: 'button-positive'
                //             }]
                //         })
                //
                //     }
                // );

                alert($scope.userpic);

                var options = new FileUploadOptions();

                options.mimeType = "image/jpeg";
                options.fileKey = "file";

                // options.fileName = $scope.userpic.substr(($scope.userpic.lastIndexOf("/")+1), $scope.userpic.indexOf("?"));
                options.fileName = "uploaded_file.jpg";
                // options.fileName = $scope.userpic.substr($scope.userpic.lastIndexOf('/') + 1);
                alert(options.fileName);

                var params = {};
                options.params = params;

                var ft = new FileTransfer();

                ft.upload($scope.userpic, encodeURI($rootScope.host + "uploadImage"), function(data){

                    alert(JSON.stringify(data.response));

                }, function(err){

                    alert(JSON.stringify(err));

                }, options);

            }

        }

    })

        .controller('CatalogCtrl', function ($scope, $rootScope, $http, $ionicPopup, $state) {

        $scope.$on('$ionicView.enter', function() {

            $rootScope.currentState = $state.current.name;

        });

        // $http.post($rootScope.host + 'GetDeals', '', {
        //
        //     headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}
        //
        // }).then(
        //
        //     function(data){
        //
        //         console.log(data);
        //
        //     },
        //
        //     function(err){
        //
        //         $ionicPopup.alert({
        //             title: "No network connection!",
        //             buttons: [{
        //                 text: 'OK',
        //                 type: 'button-positive'
        //             }]
        //         });
        //
        //     });

    })

    .controller('InformationCtrl', function ($scope, $rootScope, $state) {

        $scope.$on('$ionicView.enter', function() {

            $rootScope.currentState = $state.current.name;

        });

    })


;