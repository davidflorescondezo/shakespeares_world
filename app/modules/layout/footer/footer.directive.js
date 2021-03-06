'use strict';

require('./footer.module.js')
    .directive('appFooter', appFooter);

// @ngInject
function appFooter($state, FooterLinkConstants, $http) {
    var directive = {
        link: appFooterLink,
        restrict: 'A',
        replace: true,
        templateUrl: 'footer/footer.html'
    };
    return directive;

    function appFooterLink(scope) {

        scope.links = FooterLinkConstants;

        $http({
            method: 'GET',
            url: 'https://static.zooniverse.org/zoo-footer/zoo-footer.json'
        }).then(function (response) {
            scope.footer = response.data;
            scope.links = scope.footer.projectsList;
        });

        scope.$watch(function () {
            return $state.current.params;
        }, function (params) {
            scope.smallFooter = (params && params.smallFooter) ? true : false;
        });
    }
}
