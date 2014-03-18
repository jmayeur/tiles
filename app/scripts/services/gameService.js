(function(angular){
    'use strict';

    angular.module('tiles').factory('GameService', ['GuidService', 'TileService', function(guidService, tileService){
        var gameServiceInstance;


        gameServiceInstance = {
            _: {
                currentGridModel: null,
                emptySlot: {
                    row: null,
                    col: null,
                    guid: null
                },
                tileMovedCallbacks: [],

                buildGridSlotModel: function(row, column, tileModel, tileCanMove){
                    return {
                        row: row,
                        column: column,
                        guid: guidService.guidGenerator(),
                        tileModel: tileModel,
                        tileCanMove: tileCanMove

                    };
                },

                buildGridModel: function(columnCount, rowCount) {
                    return {
                        columnCount: columnCount,
                        rowCount: rowCount,
                        gridSlots: []
                    };
                },

                isGridValid: function(gridModel){
                    var result, slotCount, i;
                    result = false;

                    if(gridModel){
                        slotCount = gridModel.rowCount * gridModel.columnCount;

                        if (slotCount === gridModel.gridSlots.length){
                            //optimistic now
                            result = true;
                            var sorted = gridModel.gridSlots.sort(function(a, b) {
                                var result;

                                result = -1;

                                if (a.tileModel !== null){
                                    if (b.tileModel === null){
                                        result = 1;
                                    }
                                    else {
                                        return a.tileModel.number - b.tileModel.number;
                                    }
                                }

                                return result;
                            });

                            for(i=0;i<slotCount;i++){
                                if (i===0){
                                    if (sorted[i].tileModel !== null){
                                        result = false;
                                        break;
                                    }
                                }
                                else if(sorted[i].tileModel.number !== i){
                                    result = false;
                                    break;
                                }
                            }
                        }
                    }

                    return result;
                },

                buildDefaultGridModel: function(){

                    var gridModel, defaultNumbers, i,
                        number, row, col, model;

                    gridModel = this.buildGridModel(4,4);
                    defaultNumbers = [2,4,5,1,7,6,8,9,11,15,12,13,14,3,10,null];

                    //set emptySlot
                    for (i=0;i<16;i++){
                        number = defaultNumbers[i];
                        row = Math.floor(i/4);
                        col = i%4;

                        if (null === number){
                            this.emptySlot.row = row;
                            this.emptySlot.col = col;

                            break;
                        }
                    }

                    for (i=0;i<16;i++){
                        number = defaultNumbers[i];
                        row = Math.floor(i/4);
                        col = i%4;

                        if (null === number){
                            model = this.buildGridSlotModel(row, col, null, false);
                            gridModel.gridSlots.push(model);
                            this.emptySlot.guid = model.guid;
                        }
                        else{
                            model = this.buildGridSlotModel(row, col, tileService.getTile(number), false);
                            model.tileCanMove = gameServiceInstance.canTileMove(model);
                            gridModel.gridSlots.push(model);
                        }
                    }

                    return gridModel;
                },

                findSlotModelByTileGuid: function(gridModel, tileGuid){
                    var i, len, slot, result;
                    len = gridModel.gridSlots.length;
                    for(i=0; i<len; i++){
                        slot = gridModel.gridSlots[i];
                        if(slot.tileModel !== null && slot.tileModel.guid === tileGuid){
                            result = slot;
                            break;
                        }
                    }

                    return result;
                },

                findSlotModelByGuid: function (gridModel, slotGuid){
                    var i, len, slot, result;
                    len = gridModel.gridSlots.length;
                    for(i=0; i<len; i++){
                        slot = gridModel.gridSlots[i];
                        if(slot.guid === slotGuid){
                            result = slot;
                            break;
                        }
                    }

                    return result;
                }
            },

            getGridModel: function(){
                var cachedGridModel, useCached;

                cachedGridModel = angular.fromJson(sessionStorage.cachedGridModel);
                useCached =  false;

                if (null != cachedGridModel){

                    try {

                        if (this._.isGridValid(cachedGridModel)){
                            this._.currentGridModel =  cachedGridModel;
                            useCached =  true;
                        }
                    }
                    catch(e){
                        console.log(e);
                    }
                }

                if (!useCached){
                    //default for now
                    this._.currentGridModel = this._.buildDefaultGridModel();
                }

                return this._.currentGridModel;
            },

            canTileMove: function(slotModel){
                var emptySlot, result;

                emptySlot = this._.emptySlot;

                if(null === slotModel){
                    result = false;
                }
                else {

                    var row = slotModel.row;
                    var column = slotModel.column;

                    if(column > 0){
                        if(emptySlot.row === row && emptySlot.col === column - 1){
                            //console.log('slot left is open -row:' + row + ' -col:' + column);
                            result = true;
                        }
                    }

                    if (!result && column < 3){
                        if(emptySlot.row === row && emptySlot.col === column + 1){
                            //console.log('slot right is open -row:' + row + ' -col:' + column);
                            result = true;
                        }
                    }

                    if(!result && row > 0){
                        if(emptySlot.col === column && emptySlot.row === row - 1){
                            //console.log('slot above is open -row:' + row + ' -col:' + column);
                            result = true;
                        }
                    }

                    if (!result && row < 3){
                        if(emptySlot.col === column && emptySlot.row === row + 1){
                            //console.log('slot below is open -row:' + row + ' -col:' + column);
                            result = true;
                        }
                    }
                }
                return result;
            },


            moveTile : function (tileGuid, slotGuid){
                var fromSlot, targetSlot, result;

                result = null;
                fromSlot = this._.findSlotModelByTileGuid(this._.currentGridModel, tileGuid);

                if (null === slotGuid){
                    slotGuid = this._.emptySlot.guid;
                }

                targetSlot = this._.findSlotModelByGuid(this._.currentGridModel, slotGuid);

                if(fromSlot && targetSlot){
                    targetSlot.tileModel = fromSlot.tileModel;
                    fromSlot.tileModel = null;
                    this._.emptySlot.row = fromSlot.row;
                    this._.emptySlot.col = fromSlot.column;
                    this._.emptySlot.guid = fromSlot.guid;

                    this._.currentGridModel.gridSlots.forEach(function(m){
                        m.tileCanMove = gameServiceInstance.canTileMove(m);
                    });
                    result = slotGuid;
                }

                return result;
            }

        };

        return gameServiceInstance;
    }]);
}(angular));