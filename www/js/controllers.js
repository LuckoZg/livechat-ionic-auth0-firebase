angular.module('starter.controllers', [])

.controller('BodyController', function ($scope) {
    console.log("BodyController");

    $scope.parentAuth = {};
    $scope.parentAuth.isAuthenticated = false;
    
})

.controller('ChatController', function ($scope, $state, $ionicPopup, auth, store, Messages) {
    console.log("ChatController");

    $scope.start = function(){
      $scope.auth = auth;
      $scope.profile = auth.profile;
      $scope.messages = Messages.getMessages();
      if($scope.auth)
        $scope.parentAuth.isAuthenticated = true;
      console.log($scope.auth);
    }
 
    $scope.addMessage = function() {
     $ionicPopup.prompt({
       title: $scope.profile.name+':'
     }).then(function(res) {
        if(res){
          var time = new Date().getTime();
          $scope.messages.$add({
            "message": res,
            "name": $scope.profile.name,
            "avatar": $scope.profile.picture,
            "time": time
          });
        }
     });
    };

     $scope.login = function() {
      auth.signin({
          closable: false
      }, function(profile, token, accessToken, state, refreshToken) {
        //console.log(token);
        store.set('profile', profile);
        store.set('token', token);
        store.set('refreshToken', refreshToken);
        auth.getToken({
          api: 'firebase'
        }).then(function(delegation) {
          store.set('firebaseToken', delegation.id_token);
          $scope.start();
        }, function(error) {
          // Error getting the firebase token
        })
      }, function() {
        // Error callback
      });
    }

    $scope.logout = function() {
      auth.signout();
      store.remove('token');
      store.remove('profile');
      store.remove('refreshToken');
      store.remove('firebaseToken');
      $scope.parentAuth.isAuthenticated = false;
      $scope.messages = [];
      $scope.login();
    }

    $scope.start();

    if(!$scope.auth.isAuthenticated)
      $scope.login();

});

