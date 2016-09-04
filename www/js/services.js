angular.module('starter.services', [])

.factory('Messages', function($firebase, store) {
  /*var messagesRef = new Firebase("https://livechat-c2f50.firebaseio.com/messages/");
  return $firebaseArray(messagesRef);*/

  function getMessages(){

  	if(!store.get('firebaseToken'))
  		return [];

    var messagesRef = new Firebase("https://livechat-c2f50.firebaseio.com/messages");
	// Here we're using the Firebase Token we stored after login
	messagesRef.authWithCustomToken(store.get('firebaseToken'), function(error, auth) {
	  if (error) {
	    // There was an error logging in, redirect the user to login page
	    $state.reload();
	  }
	});

	var messagesSync = $firebase(messagesRef);
	var messages = messagesSync.$asArray();

	return messages;
  }

	return {
		getMessages: getMessages
	}
});
