'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
    factory('utilService', function () {
        return {
            isEmpty: function (value) {
                return angular.isUndefined(value) || value === '' || value === null || value !== value;
            },
            findSVGElement: function(event){
                var node = event.target.parentNode;
                while( node.id != 'paper' ) {
                    //node = node.parent();
                    node = node.parentNode;
                }
                return node;
            },
            fixEvent: function( event ){
                if(event.offsetX==undefined) // this works for Firefox
                {
                    event.offsetX = event.layerX;
                    event.offsetY = event.layerY;
                }
                return event;
            }
        }
    }).
    // This is very TBD
    factory('domService', function () {
        var funcs = {

        };

        funcs.checkAscendants = function (elem, possibleParent, termParent) {
            // TODO make this work using elem.parent(), etc
        }
        return funcs;
    }).
    factory('LineDataService', ['utilService', function (utilService) {

        var funcs = {
            firstPointSet: false,
            lineObjects: [],
            newLineObj: {},
            initNewLineObj: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                strokeColor: "black"
            }
        };

        funcs.addLine = function (lineObj, fromPrev) {
            lineObj.strokeColor = "red";
            this.lineObjects.push(lineObj);

            // Also add an ID to refer to later?
            // $scope.newLineObj.id = $scope.lineObjects.length
            if (fromPrev) {
                var newLineObj = {
                    x1: lineObj.x2,
                    y1: lineObj.y2,
                    x2: lineObj.x2,
                    y2: lineObj.y2,
                    strokeColor: "blue"
                };
                this.firstPointSet = true;
            } else {
                var newLineObj = {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 0,
                    strokeColor: "black"
                };
            }
            return newLineObj;
        };
        funcs.newPoint = function (newLineObj, inClickMode, pathMode, validForm, event) { //$scope.inClickMode
            try {

                event = utilService.fixEvent(event);

                if (inClickMode && !this.firstPointSet) {
                    newLineObj.x1 = event.offsetX;
                    newLineObj.y1 = event.offsetY;
                    newLineObj.strokeColor = "orange";

                    this.firstPointSet = true;
                } else if (inClickMode && this.firstPointSet) {
                    newLineObj.x2 = event.offsetX;
                    newLineObj.y2 = event.offsetY;

                    this.firstPointSet = false;  //shuts off hover

                    if (validForm) {
                        newLineObj = this.addLine(angular.copy(newLineObj), pathMode);
                    } else {
                        console.debug(" NOT VALID FORM!!!");
                    }
                } else {
                    // Also true in non-inClickMode
                    //console.debug("ERROR in handleClick", inClickMode, this.firstPointSet);
                }
            } catch (e) {
                console.debug("ISSUE in newPoint: " + e.message)
            }
            return newLineObj;
        };

        funcs.giveBlankLineObj = function () {
            return {    x1: 0,
                y1: 0,
                x2: 0,
                y2: 0
                // color too?
            }
        }
        return funcs;
    }]).
    factory('arcCalcService', function () {

        var funcs = {

        };
        funcs.guide = {
            length: 400
        };
        funcs.arcObj = {
            radiusx: 400,
            radiusy: 400,
            largeArcFlag: 0,
            sweepFlag: 0
        };

        funcs.initArcObj = {
            x1: 1,
            y1: 1,
            x2: 1,
            y2: 1,
            largeArcFlag: 0,
            sweepFlag: 1,
            angle: 0,

            radiusx: 400,
            radiusy: 400
        };

        funcs.giveInitArc = function () {
            return angular.copy(this.initArcObj);
        };

        funcs.initGuide = {
            strkColor: "black",
            strkWdth: 0,
            x1: 1,
            y1: 1,
            x2: 1,
            y2: 1
        };

        funcs.chord = {

        };

        funcs.setGuidePoints = function (gx1, gy1, gx2, gy2) {
            this.guide.x1 = gx1;
            this.guide.y1 = gy1;

            this.guide.x2 = gx2;
            this.guide.y2 = gy2;

            this.guide.angle = Math.atan2(Math.abs(this.guide.y1 - this.guide.y2), Math.abs(this.guide.x1 - this.guide.x2))
        };

        funcs.setChordPoints = function (cx1, cy1, cx2, cy2) {

            try {
                this.chord.x1 = cx1;
                this.chord.y1 = cy1;
                this.chord.x2 = cx2;
                this.chord.y2 = cy2;

                this.guide.y1 = (this.chord.y1 + this.chord.y2) / 2;
                this.guide.x1 = (this.chord.x1 + this.chord.x2) / 2;

                // todo - using this?
                this.chord.slope = (this.chord.y1 - this.chord.y2) / (this.chord.x1 - this.chord.x2);
                this.guide.slope = -this.chord.slope; // not needed?

                this.chord.angle = Math.atan2(Math.abs(this.chord.y1 - this.chord.y2), Math.abs(this.chord.x1 - this.chord.x2));
                this.guide.angle = (Math.PI / 2) - this.chord.angle;

                var yDelt = (Math.sin(this.guide.angle) * this.guide.length);
                var xDelt = (Math.cos(this.guide.angle) * this.guide.length);

                // x1,y1 could be on the right or the left!
                if ((this.chord.y1 > this.chord.y2 && this.chord.x1 < this.chord.x2) || (this.chord.y1 < this.chord.y2 && this.chord.x1 > this.chord.x2)) {
                    this.guide.x2 = this.guide.x1 + xDelt;
                    this.guide.y2 = this.guide.y1 + yDelt;
                } else {
                    this.guide.x2 = this.guide.x1 - xDelt;
                    this.guide.y2 = this.guide.y1 + yDelt;
                }
                this.arcObj.sweepFlag = 1;

                if ((this.chord.y1 > this.chord.y2 && this.chord.x1 > this.chord.x2) || (this.chord.y1 < this.chord.y2 && this.chord.x1 > this.chord.x2)) {
                    this.arcObj.sweepFlag = 0;
                }

                this.arcObj.x1 = this.chord.x1;
                this.arcObj.y1 = this.chord.y1;
                this.arcObj.x2 = this.chord.x2;
                this.arcObj.y2 = this.chord.y2;

                this.arcObj.angle = this.chord.angle;

            } catch (e) {
                console.debug("ISSUE in setChordPoints: " + e.message)
            }

        };

        return funcs;
    }).
    value('version', '0.1');
