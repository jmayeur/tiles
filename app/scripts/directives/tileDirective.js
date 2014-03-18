(function (angular) {
    'use strict';

    angular.module('tiles').directive('tileElement', [ function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                'tile': '=',
                'handleDrag': '=',
                'handleDragEnd': '=',
                'handleClick': '='
            },
            template: ' <div class="unseclectable" ng-class="{true:\'tile_movable\', false:\'tile_fixed\'}[tile.tileCanMove]" draggable="{{tile.tileCanMove}}"><div class="number">{{tile.tileModel.number}}</div></div>',
            link: function (scope, element, attrs) {

                if(scope.tile.tileModel !== null){
                    element.toggleClass('tile', true);
                    element.attr('id', scope.tile.tileModel.guid);
                }
                else{
                    element.toggleClass('tile', false);
                    element.attr('id', 'unk');
                    element.html('');
                }

                element.bind('click', function(e){
                    if (scope.tile.tileCanMove){
                        scope.handleClick(e, scope.tile.tileModel.guid);
                    }
                });

                element.bind('dragstart', scope.handleDrag);
                element.bind('dragend', scope.handleDragEnd);
            }
        };
    }]);

})(angular);
