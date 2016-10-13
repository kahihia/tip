angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $localStorage, $ionicModal, $timeout, $state) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.logout = function() {

            $localStorage.email = "";
            $localStorage.password = "";
            $localStorage.userid = "";
            $state.go('app.login');

        }

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

                            $localStorage.userid = data.data.response.userid;
                            $localStorage.email = $scope.register.email;
                            $rootScope.userData.email =  $localStorage.email;
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
                            $localStorage.image = data.data.response.image;

                            $rootScope.userData = data.data.response;
                            $rootScope.image = $localStorage.image;

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

    .controller('HomeCtrl', function ($scope, $rootScope, $localStorage, $state, $http, $ionicPopup) {

        // for discount and question link

        $scope.checkState = function(){

            if (!$localStorage.isQuestionAnswered || $localStorage.isQuestionAnswered == "" || $localStorage.isQuestionAnswered == false){

                $state.go('app.teaser');

            } else {

                $state.go('app.discount');

            }

        };


        // get all user points

        var send_user = {

            "user" : $localStorage.userid

        };

        $http.post($rootScope.host + 'GetAnswers', send_user, {

            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

        }).then(

            function(data){

                console.log(data);

                for (var i = 0; i < data.data.length; i++){

                    if (data.data[i].correct == "0"){

                        $rootScope.incorrectAnswers += 1;

                    } else if (data.data[i].correct == "1"){

                        $rootScope.correctAnswers += 1;

                    }

                    $rootScope.allPoints = $rootScope.allPoints + Number(data.data[i].quantity);

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



    })

    .controller('QuestionCtrl', function ($scope, $http, $rootScope, $ionicPopup, $state, $localStorage) {

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

                console.log(data);

                $scope.question = data.data[0];
                $scope.question.question_image = $rootScope.phpHost + $scope.question.question_image;
                $scope.question.explain_image = $rootScope.phpHost + $scope.question.explain_image;

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

            // check answer

            if ($scope.userAnswer.selected == $scope.question.correct_answer) {

                $rootScope.isAnswerCorrect = true;

            } else {

                $rootScope.isAnswerCorrect = false;

            }

            console.log($rootScope.isAnswerCorrect);

            // update the table answered_question

            var send_question = {

                "user" : $localStorage.userid,
                "quantity" : "",
                "correct" : ""

            };

            if ($rootScope.isAnswerCorrect == true){

                send_question.quantity = "10";
                send_question.correct = "1"

            } else if ($rootScope.isAnswerCorrect == false){

                send_question.quantity = "2";
                send_question.correct = "0"

            }

            $http.post($rootScope.host + 'answerQuestion', send_question, {

                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

            }).then(

                function(data){

                    console.log(data);

                    // update local variables

                    $localStorage.isQuestionAnswered = true;
                    $rootScope.isQuestionAnswered = $localStorage.isQuestionAnswered;

                    $state.go('app.answer');

                },

                function(error){

                    $ionicPopup.alert({
                        title: "No network connection!",
                        buttons: [{
                            text: 'OK',
                            type: 'button-positive'
                        }]
                    });

                })

        };

    })

    .controller('DiscountCtrl', function ($scope, $rootScope, $state, $http, $ionicPopup) {

        var send_data = {

            'date' : $rootScope.today

        };

        $http.post($rootScope.host + 'GetDealByDate', send_data, {

                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                }).then(

                    function(data){

                        console.log(data.data);

                    },

                    function(err){

                        console.log(err);

                    });

        $scope.$on('$ionicView.enter', function () {

            $ionicPopup.alert({
                title: "מצב הנקודות שלי: " + $rootScope.allPoints,
                buttons: [{
                    text: 'OK',
                    type: 'button-positive'
                }]
            });

        });

    })


    .controller('PersonalCtrl', function ($http, $scope, $rootScope, $ionicPopup, $localStorage, $cordovaCamera, $state) {

        // select tab

        $scope.selection = 'personal';

        // PROFILE

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
        $scope.userpicURL = '';

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

                    alert($scope.userpic);

                    var options = new FileUploadOptions();

                    options.mimeType = "jpeg";
                    options.fileKey = "file";
                    options.chunkedMode = false;

                    // options.fileName = $scope.userpic.substr(($scope.userpic.lastIndexOf("/")+1), $scope.userpic.indexOf("?"));
                    // alert(options.fileName);

                    var ft = new FileTransfer();

                    ft.upload($scope.userpic, encodeURI($rootScope.host + "uploadImage"), function(data){

                        alert(JSON.stringify(data.response));
                        $scope.userpicURL = $rootScope.phpHost + data.response;
                        $localStorage.image = $scope.userpicURL;
                        $rootScope.image = $localStorage.image;

                    }, function(err){

                        alert(JSON.stringify(err));

                    }, options);

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

                    // 3. on success - collect everything in one variable

                    var send_data = {

                            "user" : $localStorage.userid,
                            "firstname" : $scope.personalInformation.firstname,
                            "lastname" : $scope.personalInformation.lastname,
                            "email" : $scope.personalInformation.email,
                            "birthday" : $scope.personalInformation.birthday,
                            "image" : $localStorage.image,
                            "password" : ''

                    };

                    if ($scope.personalInformation.new_password != ""){

                        send_data.password = $scope.personalInformation.new_password;

                    } else {

                        send_data.password = $localStorage.password;

                    }

                    alert(JSON.stringify(send_data));

                    // 3. send update info

                    $http.post($rootScope.host + 'updateProfile', send_data, {

                        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

                    }).then(

                        function(data){

                           if (data.data[0].status == '1'){

                               // 4. if success, update localStorage and rootScope

                               $localStorage.firstname = send_data.firstname;
                               $localStorage.lastname = send_data.lastname;
                               $localStorage.email = send_data.email;
                               $localStorage.birthday = send_data.birthday;
                               $localStorage.password = send_data.password;

                               if ($scope.personalInformation.new_password != ""){

                                   $localStorage.password = send_data.password;

                               }

                               $rootScope.userData = {
                                   "firstname" : $localStorage.firstname,
                                   "lastname" : $localStorage.lastname,
                                   "password" : $localStorage.password,
                                   "email" : $localStorage.email,
                                   "gender" : $localStorage.gender,
                                   "soldier" : $localStorage.soldier,
                                   "userid" : $localStorage.userid
                               };

                               $scope.personalInformation = {

                                   "firstname" : $localStorage.firstname,
                                   "lastname" : $localStorage.lastname,
                                   "email" : $localStorage.email,
                                   "birthday" : new Date($localStorage.birthday),
                                   "old_password" : "",
                                   "new_password" : ""

                               };

                               // 5. inform the user that everything is ok

                               $ionicPopup.alert({
                                   title: "The information is successfully updated!",
                                   buttons: [{
                                       text: 'OK',
                                       type: 'button-positive'
                                   }]
                               })

                           } else {

                               $ionicPopup.alert({
                                   title: "The data was not updated!",
                                   buttons: [{
                                       text: 'OK',
                                       type: 'button-positive'
                                   }]
                               })

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

        // MESSAGE TO A SPECIALIST

        $scope.message = {

            "subject" : ""

        };

        $scope.sendMessage = function(){

            if ($scope.message.subject == ""){

                $ionicPopup.alert({
                    title: "Please write your message!",
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

                            $scope.message = {

                                "subject" : ""

                            };

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

        }

    })

        .controller('CatalogCtrl', function ($scope, $rootScope, $http, $ionicPopup, $state) {

        $http.post($rootScope.host + 'GetDeals', '', {

            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; application/json'}

        }).then(

            function(data){

                console.log(data);

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

    })

    .controller('InformationCtrl', function ($scope) {


    })

    .controller('ArticleCtrl', function ($scope, $rootScope, $state, $stateParams, $http, $localStorage, $ionicPopup) {

        $scope.categoryName = $rootScope.infoCategories[$stateParams.articleId - 1];
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

                    $scope.content[i].image = $rootScope.phpHost + $scope.content[i].image;

                }

                console.log($scope.content);

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

        }

    })

;