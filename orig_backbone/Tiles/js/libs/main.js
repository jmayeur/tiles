TileAppRouter  = Backbone.Router.extend({
    routes: {
        '' : 'newGame'
    },

    newGame : function(){
        var tileBoardView = new TileBoardView;
        tileBoardView.render();
    }
});

TileModel = Backbone.Model.extend({
    defaults : {
        number  : null,
        tileSlotModel : null,
        guid : null
    }
});

TileSlotModel = Backbone.Model.extend({
    defaults : {
        row : null,
        column : null,
        tileModel : null,
        guid : null
    }
});

TileSlotCollection = Backbone.Collection.extend({
    model: TileSlotModel
});

TileSlotView = Backbone.View.extend({
    tagName     : "div",
    className       : "singleItemList",
    tileBoardView : null,
    initialize  : function(){
        _.bindAll(this, 'render');
    },
    render: function(tileBoardView){
        this.tileBoardView = tileBoardView;
        var tileSlotElement = $(this.el);
        tileSlotElement.attr("id", this.model.get('guid'));
        var tileModel = this.model.get('tileModel');
        if (null != tileModel){
            var tileView = new TileView({model : tileModel});
            tileView.render();
            tileSlotElement.html(tileView.el);
            var tileElement = $(".tile", tileSlotElement);
            tileElement.draggable({
                containment: "#tile-list",
                appendTo: "parent",
                addClasses : true,
                snap : true,
                snap: ".singleItemList",
                opacity : 0.9,
                helper: 'original',
                revert: 'invalid'
            }).disableSelection().click(function(){
                var dragEnabled = $(this).data('is-draggable');
                if(dragEnabled){
                    console.log('oohh cool');
                    var tileModel = $(this).data('backbone-model');
                    var currentTileSlotModel = tileModel.get('tileSlotModel');
                    var currentTileSlotElement = $("#" + currentTileSlotModel.get('guid'));
                    var currentRow = currentTileSlotModel.get('row');
                    var currentColumn = currentTileSlotModel.get('column');
                    var tileSlotElementView = currentTileSlotElement.data('backbone-view');

                    var handleTileMove = function (tileElement, targetTileSlotModel, tileBoardView){
                        var tileSlotElement = $("#" + targetTileSlotModel.get('guid'));
                        tileElement.css('top','0px');
                        tileElement.css('left','0px');
                        tileElement.css('bottom','0px');
                        tileElement.css('right','0px');
                        tileElement.appendTo(tileSlotElement);
                        tileBoardView.moveFromTo(tileModel, currentTileSlotModel, targetTileSlotModel);
                        tileBoardView.setDraggableState();

                    };

                    if (currentRow < 3 && null == tileSlotElementView.tileBoardView.tileSlots[currentRow + 1][currentColumn].get('tileModel')){
                        handleTileMove($(this), tileSlotElementView.tileBoardView.tileSlots[currentRow + 1][currentColumn], tileSlotElementView.tileBoardView);
                    }
                    else if (currentRow > 0 && null == tileSlotElementView.tileBoardView.tileSlots[currentRow - 1][currentColumn].get('tileModel')){
                        handleTileMove($(this), tileSlotElementView.tileBoardView.tileSlots[currentRow - 1][currentColumn], tileSlotElementView.tileBoardView);
                    }
                    else if (currentColumn < 3 && null == tileSlotElementView.tileBoardView.tileSlots[currentRow][currentColumn + 1].get('tileModel')){
                        handleTileMove($(this), tileSlotElementView.tileBoardView.tileSlots[currentRow][currentColumn + 1], tileSlotElementView.tileBoardView);
                    }
                    else if (currentColumn > 0 && null == tileSlotElementView.tileBoardView.tileSlots[currentRow][currentColumn - 1].get('tileModel')){
                        handleTileMove($(this), tileSlotElementView.tileBoardView.tileSlots[currentRow][currentColumn - 1], tileSlotElementView.tileBoardView);
                    }

                }
            });
        }

        tileSlotElement.droppable({
            accept: '.tile',
            drop : function (event, ui) {
                dropped = true;
                var tileElement = $(ui.draggable);
                var tileSlotElement = $(this);
                var tileSlotElementView = tileSlotElement.data('backbone-view');
                tileElement.css('top','0px');
                tileElement.css('left','0px');
                tileElement.css('bottom','0px');
                tileElement.css('right','0px');
                tileElement.appendTo(tileSlotElement);

                var targetTileSlotModel = tileSlotElement.data("backbone-model");
                var tileModel = ui.draggable.data("backbone-model");
                var currentTileSlotModel = tileModel.get('tileSlotModel');
                tileSlotElementView.tileBoardView.moveFromTo(tileModel, currentTileSlotModel, targetTileSlotModel);
                tileSlotElementView.tileBoardView.setDraggableState();
            }
        });

        tileSlotElement.data("backbone-model", this.model);
        tileSlotElement.data("backbone-view", this);
    }
});


TileView = Backbone.View.extend({
    tagName     : "div",
    className       : "tile",
    htmlTemplate    : $("#tile_template"),
    initialize  : function(){
        _.bindAll(this, 'render');
    },

    render: function(){
        //console.log(this.model.toJSON());
        var element = _.template( this.htmlTemplate.html(), this.model.toJSON() );
        var tileElement = $(this.el);
        tileElement.attr("id", this.model.get('guid'));
        tileElement.html( element );
        tileElement.data("backbone-model", this.model);
    }
});

TileBoardView = Backbone.View.extend({
    el          : $("#boardHost"),
    htmlTemplate    : $("#tile_board_template"),
    boardStateLocalStorageKey : 'tileGameBoardStateLocalStorageKey',
    initialize  : function() {
        _.bindAll(this, 'render', 'addTileSlotAndTile', 'appendItem');
        this.collection = new TileSlotCollection(null, { view: this });
        this.collection.bind('add', this.appendItem);
    },

    getNumbers : function(){
        var cachedNumbersJSON = localStorage.getItem(this.boardStateLocalStorageKey);

        if (null != cachedNumbersJSON){
            console.log(cachedNumbersJSON);
            try {
                var requiredNumbers =  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
                var cachedNumbers = JSON.parse(cachedNumbersJSON);
                if (cachedNumbers.length == 16){
                    /*for(var i=0;i<15;i++){
                        var number = parseInt(cachedNumbers[i]);
                        //console.log(number);
                        requiredNumbers[number] = true;
                    }
                    for(var i=1;i<=15;i++){
                        if(!requiredNumbers[i]){
                            throw 'Failed to find required numbers';
                        }
                    }*/
                    return cachedNumbers;
                }

            }
            catch(e){
                console.log(e);
            }
        }

        return [2,4,5,1,7,6,8,9,11,15,12,13,14,3,10,null];
    },

    render: function() {
        var self = this;
        var html = _.template(this.htmlTemplate.html(), {});
        $(this.el).append(html);
        _(this.collection.models).each(function(item){
           self.appendItem(item);
        }, this);


        var numbers = this.getNumbers();
        for(var i= 0;i<16;i++){
            var row = parseInt(i/4);
            var column = i%4;
            var number = numbers[i];
            this.addTileSlotAndTile(number, row, column);
        }
        this.setDraggableState();
        $("#tile-list").data('backbone-view', this);

        $(window).unload(function(){
            var tileBoardView = $("#tile-list").data('backbone-view');
            var numbers = [];
            for(var i= 0;i<16;i++){
                var row = parseInt(i/4);
                var column = i%4;
                var tileModel = tileBoardView.tileSlots[row][column].get('tileModel');
                if (null != tileModel){
                    numbers.push(tileModel.get('number'));
                }
                else{
                    numbers.push(null);
                }
            }

            localStorage.setItem(tileBoardView.boardStateLocalStorageKey, JSON.stringify(numbers));

        });
    },

    addTileSlotAndTile   : function(number, row, column){
        var tileSlotModel = new TileSlotModel({ row : row, column : column, guid : this.guidGenerator() });
        if (number != null){
            var tileModel = new TileModel( {number : number, tileSlotModel : tileSlotModel, guid : this.guidGenerator() });
            tileSlotModel.set('tileModel', tileModel);
        }
        this.tileSlots[row][column] = tileSlotModel;
        this.collection.add(tileSlotModel);
    },

    appendItem   : function(item){
        var tileSlotView = new TileSlotView({model: item});
        tileSlotView.render(this);
        $("#tile-list", this.el).append(tileSlotView.el);
    },

    moveFromTo : function (tileModel, currentTileSlotModel, targetTileSlotModel){
        currentTileSlotModel.set('tileModel', null);
        tileModel.set('tileSlotModel', targetTileSlotModel);
        targetTileSlotModel.set('tileModel', tileModel);
    },

    setDraggableState : function(){
        for(var i= 0,len = this.tileSlots.length; i<len; i++){
            for(var x= 0, xlen = this.tileSlots[i].length;x<xlen;x++){

                var tileSlotModel = this.tileSlots[i][x];
                var tileSlotElement = $("#" + tileSlotModel.get('guid'));
                tileSlotElement.droppable('disable');
                var tileModel = tileSlotModel.get('tileModel');

                if (!this.isTileDraggable(tileSlotModel) && null != tileModel){
                    var tileElementId = "#" + tileModel.get('guid');
                    var tileElement = $(tileElementId);
                    var tileElementIsDraggable = tileElement.data('is-draggable');
                    if (tileElementIsDraggable){
                        tileElement.draggable('disable').disableSelection();
                        tileElement.data('is-draggable', false);
                        tileElement.toggleClass('tile_movable');
                    }
                }
                else if (null != tileModel){
                    var tileElementId = "#" + tileModel.get('guid');
                    var tileElement = $(tileElementId);
                    var tileElementIsDraggable = tileElement.data('is-draggable');
                    if (!tileElementIsDraggable){
                        tileElement.draggable('enable').disableSelection();
                        tileElement.data('is-draggable', true);
                        tileElement.toggleClass('tile_movable');
                    }
                }
                else {
                    tileSlotElement.droppable('enable');
                }
            }
        }
    },

    tileSlots : [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],

    guidGenerator : function() {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },

    isTileDraggable : function(tileObj){

        var row = tileObj.get('row');
        var column = tileObj.get('column');
        //console.log(row + " " + column)

        if(column > 0){
            if(this.tileSlots[row][column-1].get('tileModel') == null){
                //console.log('slot left is open');
                return true;
            }
        }

        if (column < 3){
            if(this.tileSlots[row][column+1].get('tileModel') == null){
                //console.log('slot right is open');
                return true;
            }
        }

        if(row > 0){
            if(this.tileSlots[row-1][column].get('tileModel') == null){
                //console.log('slot above is open');
                return true;
            }
        }

        if (row < 3){
            if(this.tileSlots[row+1][column].get('tileModel') == null){
                //console.log('slot below is open');
                return true;
            }
        }
    }
});

