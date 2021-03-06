define([
    'lib/event',
    'partials/marker',
], function(Event, Marker) {

    var Player = function(matrix) {
        Marker.MoveableMarker.apply(this);
        this.gameBoxs = [];
        this.matrix = matrix;
    };

    var playerMoveStrategies = (function() {
        return {
            '#': function() {
                return;
            },
            '0': function(state, player, nextPosition) {
                player.setPosition(nextPosition);
                this.trigger('onMatrixChange', state);
            },
            'B': function(state, player, nextPosition, box) {
                box.moveControl(state, player);
            },
            'T': function() {
                this['0'].apply(this, arguments);
            }
        };
    })();

    Event.installEvent(playerMoveStrategies);

    Player.prototype = new Marker.MoveableMarker();

    Player.prototype.moveControl = function(state) {
        var nextPosition = this[state](this.position),
            nextMarker = this.getMarker(nextPosition);
        playerMoveStrategies[nextMarker.attribute || nextMarker](
            state, this,
            nextPosition, nextMarker);
    }

    Player.prototype.getMarker = function(position) {
        return this.isBox(position) || this.matrix[position.x][
            position.y
        ];
    };

    Player.prototype.bindBox = function(box) {
        this.gameBoxs.push(box);
    };

    Player.prototype.isBox = function(position) {
        for (var i = 0, box; box = this.gameBoxs[i++];) {
            if (box.position.x === position.x && box.position.y ===
                position.y) {
                return box;
            }
        }
        return false;
    };

    return Player;
});
