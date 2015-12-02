'use strict';

require('./overlay.module.js')
    .directive('overlayControls', overlayControls);

// @ngInject
function overlayControls($interval, MarkingSurfaceFactory, $rootScope, FavouritesFactory, SubjectsFactory) {
    var directive = {
        link: overlayControlsLink,
        replace: true,
        restrict: 'A',
        templateUrl: 'overlay/overlay-controls.html'
    };
    return directive;

    function overlayControlsLink(scope) {
        var promise;
        var vm = scope.vm;
        vm.alphabet = alphabetToggle;
        vm.centre = MarkingSurfaceFactory.resizeAndCentre;
        console.log('OVERLAY-current', SubjectsFactory.current.data.id)
        vm.favourite = FavouritesFactory.addToFavourites(SubjectsFactory.current.data.id)
        vm.rotate = MarkingSurfaceFactory.rotate;
        vm.zoomStart = zoomStart;
        vm.zoomStop = zoomStop;

        function alphabetToggle() {
            $rootScope.$broadcast('event:toggle');
        }

        function zoomStart(direction) {
            MarkingSurfaceFactory[direction]();
            promise = $interval(function () {
                MarkingSurfaceFactory[direction]();
            }, 150);
        }

        function zoomStop() {
            $interval.cancel(promise);
        }
    }
}
