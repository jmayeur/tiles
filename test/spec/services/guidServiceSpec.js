(function(){
    'use strict';

    describe('Service: tileService', function () {

        var guidServiceInstance,
            guidRegEx;

        //via http://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
        guidRegEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        // load the controller's module
        beforeEach(function(){
            module('tiles');
            inject(function(GuidService){
                guidServiceInstance = GuidService;
            });
        });

        it('Should create a valid pseudo guid when guidGenerator is called', function(){

            var guid, regMatch;

            guid = guidServiceInstance.guidGenerator();
            regMatch = guidRegEx.test(guid);
            expect(guid.length).toBe(36);
            expect(regMatch).toBeTruthy();
        });

        it('Should return unigue guids when guidGenerator is called', function(){
            var i, guid, lastGuid = null;

            for (i=0;i<100;i++){
                guid = guidServiceInstance.guidGenerator();
                expect(guidRegEx.test(guid)).toBeTruthy();
                expect(guid).not.toEqual(lastGuid);
                lastGuid = guid;
            }
        });

    });
}());
