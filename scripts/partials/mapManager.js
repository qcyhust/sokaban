define([
    'lib/event'
], function(Event) {

    var canvas = document.getElementById('gameCanvas');

    var states = {
        'moveUp': {
            x: 0,
            y: 200
        },
        'moveDown': {
            x: 0,
            y: 0
        },
        'moveRight': {
            x: 0,
            y: 134
        },
        'moveLeft': {
            x: 0,
            y: 70
        },
    };

    var wallPic = new Image();
    var targetPic = new Image();
    var boxPic = new Image();
    var personPic = new Image();
    var blankPic = new Image();
    wallPic.src = './images/wall.png';
    targetPic.src = './images/target2.png';
    boxPic.src = './images/box.png';
    personPic.src = './images/QQTang.png';
    blankPic.src = './images/blank.png';

    var MapManager = function() {
        this.ctx = canvas.getContext('2d');
        this.mapMatrix = [];
        this.playerPosition = {};
        this.boxPosition = [];
        this.state = null;
        this.personState = 0;

        this.drawStrategies = {
            '#': function(i, j) {
                this.ctx.drawImage(wallPic, j * 40, i * 40,
                    40, 40);
            },
            'T': function(i, j) {
                this.ctx.drawImage(targetPic, j * 40, i *
                    40, 40, 40);
            },
            'P': function(i, j, icon) {
                this.ctx.drawImage(personPic, this.state.x +
                    100 * this.personState, this.state.y,
                    55, 62, j * 40, i * 40, 40, 40);

                this.personState = (this.personState + 1 >=
                    4) ? 0 : this.personState + 1;
            },
            'B': function(i, j) {
                this.ctx.drawImage(boxPic, 0, 0, 40, 40, j *
                    40 + 4, i * 40 + 4, 32, 32);
            },
            '0': function(i, j) {
                this.ctx.drawImage(blankPic, j * 40, i *
                    40, 40, 40);
            }
        };
        Event.installEvent(this);
    };

    MapManager.prototype.setMapMatrix = function(matrix) {
        this.mapMatrix = matrix;
    };

    MapManager.prototype.setPlayerMarker = function(position) {
        this.playerPosition = position;
    };

    MapManager.prototype.setBoxMarkers = function(position) {
        this.boxPosition.push(position);
    };

    MapManager.prototype.render = function(state) {

        this.setState(state);
        this.renderMap();
        this.renderPerson();
        this.renderBox();

        //window.requestAnimationFrame(this.render.bind(this, state));
    };

    MapManager.prototype.renderMap = function() {
        this.ctx.fillStyle = '#94d52f';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var i = 0, yLen = this.mapMatrix.length; i < yLen; i++) {
            for (var j = 0, xLen = this.mapMatrix[i].length; j <
                xLen; j++) {
                var drwaFn = this.drawStrategies[this.mapMatrix[i][
                    j
                ]];
                if (drwaFn) {
                    drwaFn.call(this, i, j);
                }
            }
        }
    };

    MapManager.prototype.renderPerson = function() {
        this.renderWithPosition(this.playerPosition, 'P');
    };

    MapManager.prototype.renderBox = function() {
        for (var i = 0, boxPositon; boxPositon = this.boxPosition[i++];) {
            this.renderWithPosition(boxPositon, 'B');
        }
    };

    MapManager.prototype.renderWithPosition = function(position, icon,
        state) {
        var x = position.x,
            y = position.y;

        this.drawStrategies[icon].call(this, x, y, icon);
    };

    MapManager.prototype.setState = function(state) {
        state = typeof(state) === 'string' ? state : '';
        this.state = states[state || 'moveDown'];
    };

    return MapManager;
});
