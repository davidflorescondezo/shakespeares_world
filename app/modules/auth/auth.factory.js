'use strict';

require('./auth.module.js')
    .factory('authFactory', authFactory);

var OAuth = require('panoptes-client/lib/oauth');
var Auth = require('panoptes-client/lib/auth');

// @ngInject
function authFactory($interval, $timeout, $location, $window, localStorageService, ModalsFactory, zooAPI, zooAPIConfig, CribsheetFactory, $rootScope) {

    var factory;

    var _user = {};
    // 2 hrs
    var timeout = 120 * 60 * 1000;

    $timeout( function() {
        Auth.checkBearerToken()
            .then(function (token) {
                console.log('Token refreshed: ', token);
            })
            .catch(function (error) {
                console.log('Failed to refresh token: ', error);
                factory.signOut;
            })
    }, 10000); // 20 sec, just for testing. Swap with timeout variable when I get this to work


    OAuth.checkCurrent()
        .then(function (user) {
            if (user) {
                _setUserData();
            }
        });

    factory = {
        signIn: signIn,
        signOut: signOut,
        getUser: getUser
    };

    return factory;


    function getUser() {
        return (_user.id) ? _user : false;
    }

    function _setUserData() {
        return zooAPI.type('me').get()
            .then(function (response) {
                var response = response[0];
                _user.id = response.id;
                _user.display_name = response.display_name;
                return response.get('avatar');
            })
            .then(function (response) {
                var response = response[0];
                _user.avatar = (response.src) ? response.src : null;
                return _user;
            }, function(error) {
                console.info('No avatar found for', _user.id);
                return _user;
            })
            .then(function (user) {
                $rootScope.$broadcast('auth:loginChange', user);
                return user;
            })
            .then(CribsheetFactory.$getData)
            .catch(function (error) {
                console.error('Something\'s gone wrong with getting the user data', error);
            });
    }

    function signIn() {
        OAuth.signIn($location.absUrl())
    }

    function signOut() {
        _user = {};
        $rootScope.$broadcast('auth:loginChange');
        OAuth.signOut();
    }

}
