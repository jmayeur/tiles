(function (angular) {
    'use strict';

    angular.module('tiles')
        .controller('MainCtrl', ['$scope', 'GameService',
            function ($scope, gameService) {

                $scope.tiles = gameService.getGridModel().gridSlots;
                $scope.canTileMove = gameService.canTileMove;


                $scope.handleDragStart = function(e){
                    this.style.opacity = '0.75';
                    e.dataTransfer.setData('text/plain', this.id);
                };

                $scope.handleDragEnd = function(e){
                    this.style.opacity = '1.0';
                };

                $scope.handleDrop = function(e){
                    e.preventDefault();
                    e.stopPropagation();

                    var tileGuid = e.dataTransfer.getData('text/plain');
                    if (null !== tileGuid  && tileGuid !== '' && null !== e.toElement){
                        var slotGuid = e.toElement.id;
                        if(null !== slotGuid && slotGuid !== ''){
                            gameService.moveTile(tileGuid, slotGuid);
                            var tile = document.getElementById(tileGuid);
                            if (null !== tile && tile !== e.toElement){
                                tile.parentNode.removeChild(tile);

                                e.toElement.appendChild(tile);
                                $scope.$apply();
                            }
                        }
                    }
                };

                $scope.handleDragOver = function (e) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                    return false;
                };

                $scope.handleClick = function(e, tileGuid){
                    e.preventDefault();
                    if (null !== tileGuid  && tileGuid !== '' && null !== e.toElement){
                        var slotGuid = gameService.moveTile(tileGuid, null);
                        if(null !== slotGuid && slotGuid !== ''){
                            var toElement = document.getElementById(slotGuid);
                            var tile = document.getElementById(tileGuid);

                            if (null !== tile && tile !== toElement && null !== toElement){
                                tile.parentNode.removeChild(tile);
                                toElement.appendChild(tile);
                                $scope.$apply();
                            }
                        }
                    }
                }

            }]);
}(angular));