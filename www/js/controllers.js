angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});


    })

    .controller('RegisterCtrl', function ($scope, $ionicPopup) {

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
            'city' : "",
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
                || $scope.register.city == ""  || $scope.register.soldier == "" ){

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

            } else if ($scope.register.soldier == "yes" && ($scope.register.conscription_date == "" || $scope.register.release_date == "")){

                $ionicPopup.alert({
                    title: "נא למלא תאריך גיוס ותאריך שחרור",
                    buttons: [{
                        text: 'OK',
                        type: 'button-positive'
                    }]
                });

            } else {

                console.log('Valid');
                console.log($scope.register);
                console.log($scope.register.city.formatted_address);
                console.log($scope.register.city.geometry.location.lat());
                console.log($scope.register.city.geometry.location.lng());

            }

        }



    })


    .controller('LoginCtrl', function ($scope, $ionicPopup, $ionicModal) {

        $scope.login = {

            'email' : '',
            'password' : ''

        };

        // login

        $scope.makeLogin = function(){

            console.log($scope.login);

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

                console.log('Valid');
                console.log($scope.login);

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


    })

    .controller('HomeCtrl', function ($scope, $localStorage, $state) {

        $scope.checkState = function(){

            if (!$localStorage.isYesterdayQuestionAnswered || $localStorage.isYesterdayQuestionAnswered == ""){

                $state.go('app.teaser');

            } else {

                $state.go('app.discount');

            }

        }

    })

    .controller('QuestionCtrl', function ($scope, $http, $rootScope) {

        // $http.get($rootScope.host + '/getSapakimWithoutDistance.php').then();

    })

    .controller('PersonalCtrl', function ($scope) {



    })

    .controller('InformationCtrl', function ($scope) {



    })

;