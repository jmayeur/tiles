(function(){
    'use strict';

    describe('Service: tileService', function () {

        var tileServiceInstance;

        // load the controller's module
        beforeEach(function(){
            module('tiles');
            inject(function(TileService){
                tileServiceInstance = TileService;
            });

        });

        it('Should have the provided number', function(){
            var tile;
            tile = tileServiceInstance.getTile(1);
            expect(tile.number).toBe(1);
        });

        it('Should have a guid', function(){
            var tile;
            tile =  tileServiceInstance.getTile(1);
            expect(tile.guid).not.toBeUndefined();
        });

        it('Should be sealed', function(){
            var tile;
            tile = tileServiceInstance.getTile(0);
            expect(Object.isSealed(tile)).toBeTruthy();
        });

        it('Should fail if a non-numeric char is passed in', function(){
            expect(function(){ tileServiceInstance.getTile('a'); }).toThrow('Param [number] must be a valid positive integer.');
        });

        it('Should fail if a boolean is passed in', function(){
            expect(function(){ tileServiceInstance.getTile(true); }).toThrow('Param [number] must be a valid positive integer.');
        });

        it('Should fail if a float is passed in', function(){
            expect(function(){ tileServiceInstance.getTile(2.342); }).toThrow('Param [number] must be a valid positive integer.');
        });

        it('Should fail if a negative integer is passed in', function(){
            expect(function(){ tileServiceInstance.getTile(-8); }).toThrow('Param [number] must be a valid positive integer.');
        });

    });
}());
