angular.module('starter', ['ionic',
  'starter.controllers',
  'starter.services',
  'auth0',
  'angular-storage',
  'angular-jwt',
  'firebase'])

.config(function($stateProvider, $urlRouterProvider, authProvider,
  jwtInterceptorProvider, $ionicConfigProvider) {


  $stateProvider
  // This is the state where you'll show the login
  .state('chat', {
    url: '/',
    templateUrl: 'templates/chat.html'
  });

  $urlRouterProvider.otherwise('/');

  authProvider.init({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    loginState: 'login'
  });

  $ionicConfigProvider.views.transition('none');

})

.run(function($ionicPlatform, $rootScope, auth, store, jwtHelper) {

  $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });


  // This hooks all auth events to check everything as soon as the app starts
  auth.hookEvents();

  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token);
        } else {
          // Use the refresh token we had
          auth.refreshIdToken(refreshToken).then(function(idToken) {
            store.set('token', idToken);
            auth.authenticate(store.get('profile'), token);
          });
        }
      }
    }
  });

});