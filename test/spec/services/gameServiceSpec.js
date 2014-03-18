(function () {
    'use strict';

    describe('Service: gameService', function () {

        var gameServiceInstance, tileServiceInstance, guidServiceInstance;

        // load the controller's module
        beforeEach(function () {
            module('tiles');
            inject(function (GameService, TileService, GuidService) {
                gameServiceInstance = GameService;
                tileServiceInstance = TileService;
                guidServiceInstance = GuidService;
            });

        });

        it('Should return false when isGridValid is called with null', function () {

            var result = gameServiceInstance._.isGridValid(null);
            expect(result).toBeFalsy();
        });

        it('Should return false when isGridValid is called with undefined', function () {

            var undef;
            var result = gameServiceInstance._.isGridValid(undef);
            expect(result).toBeFalsy();
        });

        it('Should return false when isGridValid is called with too few SlotsFilled', function () {

            var gridModel = {
                columnCount: 2,
                rowCount: 2,
                gridSlots: [
                    {
                        row: 0,
                        column: 0,
                        tileModel: tileServiceInstance.getTile(1),
                        guid: null
                    },
                    {
                        row: 0,
                        column: 1,
                        tileModel: tileServiceInstance.getTile(2),
                        guid: null
                    },
                    {
                        row: 1,
                        column: 0,
                        tileModel: null,
                        guid: null
                    }
                ]
            };

            var result = gameServiceInstance._.isGridValid(gridModel);
            expect(result).toBeFalsy();
        });

        it('Should return false when isGridValid is called with too many slots', function () {

            var gridModel = {
                columnCount: 2,
                rowCount: 2,
                gridSlots: [
                    {
                        row: 0,
                        column: 0,
                        tileModel: tileServiceInstance.getTile(1),
                        guid: null
                    },
                    {
                        row: 0,
                        column: 1,
                        tileModel: tileServiceInstance.getTile(2),
                        guid: null
                    },
                    {
                        row: 1,
                        column: 0,
                        tileModel: null,
                        guid: null
                    },
                    {
                        row: 1,
                        column: 1,
                        tileModel: tileServiceInstance.getTile(3),
                        guid: null
                    },
                    {
                        row: 2,
                        column: 0,
                        tileModel: tileServiceInstance.getTile(4),
                        guid: null
                    }
                ]
            };

            var result = gameServiceInstance._.isGridValid(gridModel);
            expect(result).toBeFalsy();
        });

        it('Should return true when isGridValid is called with valid slots', function () {

            var gridModel = {
                columnCount: 2,
                rowCount: 2,
                gridSlots: [
                    {
                        row: 0,
                        column: 0,
                        tileModel: tileServiceInstance.getTile(1),
                        guid: null
                    },
                    {
                        row: 0,
                        column: 1,
                        tileModel: tileServiceInstance.getTile(2),
                        guid: null
                    },
                    {
                        row: 1,
                        Column: 0,
                        tileModel: tileServiceInstance.getTile(3),
                        guid: null
                    },
                    {
                        row: 1,
                        column: 1,
                        tileModel: null,
                        guid: null
                    }
                ]
            };

            var result = gameServiceInstance._.isGridValid(gridModel);
            expect(result).toBeTruthy();
        });

        it('Should return true when isGridValid is called with valid slots regardless of order', function () {

            var gridModel = {
                columnCount: 2,
                rowCount: 2,
                gridSlots: [
                    {
                        row: 1,
                        column: 0,
                        tileModel: tileServiceInstance.getTile(1),
                        guid: null
                    },
                    {
                        row: 1,
                        column: 1,
                        tileModel: tileServiceInstance.getTile(2),
                        guid: null
                    },
                    {
                        row: 0,
                        column: 0,
                        tileModel: tileServiceInstance.getTile(3),
                        guid: null
                    },
                    {
                        row: 0,
                        column: 1,
                        tileModel: null,
                        guid: null
                    }
                ]
            };

            var result = gameServiceInstance._.isGridValid(gridModel);
            expect(result).toBeTruthy();
        });

        it('Should return a valid GridModel when getDefaultGridModel is called', function () {

            var defaultModel = gameServiceInstance._.buildDefaultGridModel();
            expect(gameServiceInstance._.isGridValid(defaultModel)).toBeTruthy();
        });

        it('Should return the cachedGridModel if there is one when getGridModel is called', function () {
            var expectedGridModel = getValid2by2GridModel(tileServiceInstance, guidServiceInstance);
            sessionStorage.cachedGridModel = angular.toJson(expectedGridModel);


            var actualGridModel = gameServiceInstance.getGridModel();
            expect(actualGridModel.columnCount).toEqual(expectedGridModel.columnCount);
            expect(actualGridModel.rowCount).toEqual(expectedGridModel.rowCount);
            expect(actualGridModel.gridSlots.length).toEqual(expectedGridModel.gridSlots.length);
            for(var i = 0, ll = actualGridModel.gridSlots.length; i<ll; i++){
                var found = false;
                for (var x = 0, lx = expectedGridModel.gridSlots.length; x < lx; x++){
                    if (actualGridModel.gridSlots[i].guid == expectedGridModel.gridSlots[x].guid){
                        found = true;
                        break;
                    }
                }

                expect(found).toEqual(true);
            }


        });
    });


    var getValid2by2GridModel = function (tileServiceInstance, guidServiceInstance) {
        return {
            columnCount: 2,
            rowCount: 2,
            gridSlots: [
                {
                    row: 1,
                    column: 0,
                    tileModel: tileServiceInstance.getTile(1),
                    guid: guidServiceInstance.guidGenerator()
                },
                {
                    row: 1,
                    column: 1,
                    tileModel: tileServiceInstance.getTile(2),
                    guid: guidServiceInstance.guidGenerator()
                },
                {
                    row: 0,
                    column: 0,
                    tileModel: tileServiceInstance.getTile(3),
                    guid: guidServiceInstance.guidGenerator()
                },
                {
                    row: 0,
                    column: 1,
                    tileModel: null,
                    guid: guidServiceInstance.guidGenerator()
                }
            ]
        }
    };


}());