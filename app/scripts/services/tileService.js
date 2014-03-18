(function(w, angular){
    'use strict';

    angular.module('tiles').factory('TileService', ['GuidService', function(guidService){
        var tileServiceInstance;

        tileServiceInstance = {
            //privates
            _: {
                //via  http://stackoverflow.com/questions/6441787/how-do-i-check-if-a-javascript-parameter-is-a-number
                isInteger : function(n) {
                    return typeof(n) === 'number' &&
                        isFinite(n) &&
                        Math.round(n) === n;
                }
            },

            getTile : function(number){

                if (!this._.isInteger(number) || number < 0){
                    throw new Error('Param [number] must be a valid positive integer.');
                }

                var result;

                result =  {
                    number: number,
                    guid: guidService.guidGenerator()
                }

                if (Object.seal){
                    Object.seal(result);
                }

                return result;
            }
        };

        return tileServiceInstance;
    }]);
}(window, angular));