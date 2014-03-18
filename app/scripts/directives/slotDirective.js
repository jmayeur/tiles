(function (angular) {
    'use strict';

    angular.module('tiles').directive('slotElement', [ function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                'tile': '=',
                'handleDrop': '=',
                'handleDragOver': '='
            },
            template: ' <div class="singleItemList unselectable" ng-transclude></div>',
            transclude: true,
            link: function (scope, element, attrs) {
                element.bind('drop', scope.handleDrop);
                element.bind('dragover', scope.handleDragOver);
                element.attr('id', scope.tile.guid);
            }
        };
    }]);

})(angular);
