(function(angular){
    'use strict';

    angular.module('tiles').factory('GuidService', [function(){
        var guidServiceInstance;

        guidServiceInstance = {
            //via http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
            //with mods based on http://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
            guidGenerator : function() {
                var s4, s3, g15, g8b;
                s4 = function() {
                    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                };

                s3 = function() {
                    return (((1+Math.random())*0x10000)|0).toString(16).substring(2);
                };

                g15 = function() {
                    var res = Math.round(6*Math.random());
                    if (res < 1){
                        res = 1;
                    } else if (res > 5){
                        res = 5;
                    }
                    return res
                };

                g8b = function() {
                    var idx = Math.round(3*Math.random());
                    return [8,9,'a','b'][idx];
                };

                return (s4()+s4()+"-"+s4()+"-"+g15()+s3()+"-"+g8b()+s3()+"-"+s4()+s4()+s4());
            }
        };

        return guidServiceInstance;
    }]);
}(angular));
