'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  factory('utilService', function() {
    return {
        isEmpty: function(value) {
            return angular.isUndefined(value) || value === '' || value === null || value !== value;
        }
    }
  }).
  factory('domService', function() {
        var funcs = {

        };

        funcs.checkAscendants = function(elem, possibleParent, termParent) {
            // TODO make this work using elem.parent(), etc
        }
        return funcs;
  }).
    factory('LineDataService', function(){

        var funcs = {
            firstPointSet: false,
            lineObjects: []
        };

        funcs.getLineObjects =function() {  //todo moot?
            this.lineObjects;
        };

        funcs.addLine = function(lineObj, fromPrev) {
            // newLineObj chng
            //newLineObj = angular.copy(lineObj);
            console.log(" IN addLine: "     );
            console.log(  lineObj  );

            lineObj.strokeColor = "red";

            this.lineObjects.push(lineObj);

        // Also add an ID to refer to later?
        // $scope.newLineObj.id = $scope.lineObjects.length
            if (fromPrev) {
                //this.
                console.log("SHOULD BE SETTING NEW LINE TO END");
                var newLineObj = {
                    x1: lineObj.x2,
                    y1: lineObj.y2,
                    x2: lineObj.x2,
                    y2: lineObj.y2,
                    strokeColor : "blue"
                };
                this.firstPointSet = true;   console.debug("!!$$$!! SET handlePaperClick STATE:", this.firstPointSet);
            } else {
                //this.
                var newLineObj = {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 0,
                    strokeColor : "black"
                };
            }
            return newLineObj;
        };
        funcs.newPoint = function(newLineObj, inClickMode, pathMode, validForm, event) { //$scope.inClickMode
            try {
            if (inClickMode && !this.firstPointSet) {
                console.debug("---1---Should be setting first point ---- this.firstPointSet:" + this.firstPointSet);
                console.debug(event);
                newLineObj.x1 = event.offsetX;
                newLineObj.y1 = event.offsetY;
                newLineObj.strokeColor = "orange";

                this.firstPointSet = true;
                console.debug("!!$$$!! SET handlePaperClick STATE:", inClickMode, this.firstPointSet);
            } else if (inClickMode && this.firstPointSet) {
                console.debug("---2---Should be setting second point --- this.firstPointSet:" + this.firstPointSet + "-pathMode -" + pathMode )
                newLineObj.x2 = event.offsetX;
                newLineObj.y2 = event.offsetY;

                this.firstPointSet = false;  //shuts off hover

                if (validForm) {
                    newLineObj=this.addLine(angular.copy(newLineObj), pathMode);

                    console.debug("RETURNED NEW obj:" + newLineObj.x1);
                    console.debug( newLineObj );
                    ////////////////////////////////////////////////////////$scope.lineObjects = SVGDataService.lineObjects;  //TODO .getLineObjects();
                    console.debug(this.lineObjects);
                } else {
                    console.debug( " NOT VALID FORM!!!" );
                }
                //BUT now we want temp line gone?
            } else {
                console.debug("ERROR in handleClick", inClickMode, this.firstPointSet);
            }
            } catch (e) {
                console.debug("ISSUE in newPoint: " + e.message)
            }
            //could return newLineObj but dont have too.
            return newLineObj;
        };

        funcs.giveBlankLineObj = function() {
            return {    x1: 0,
                y1: 0,
                x2: 0,
                y2: 0
                // color too?
            }
        }


        return funcs;

    }).
    factory('arcCalcService', function(){

        var funcs = {

        };
        funcs.guide = {
            length: 400
        };
        funcs.arcObj = {
            rx: 400,
            ry: 400,
            largeArcFlag: 0,
            sweepFlag: 0
        }
        funcs.chord = {

        } ;

        //funcs.guide.length = 200;

        var cx1, cy1, cx2, cy2, gx1, y1, x2, gy2, xc= 0, yc= 0;


        //Possibly Moot
        funcs.setGuidePoints = function(gx1, gy1, gx2, gy2) {
            this.guide.x1 = gx1;
            this.guide.y1 = gy1;

            this.guide.x2 = gx2;
            this.guide.y2 = gy2;

            //if (cx == 0 || cy ==0) {
               //chord??
            this.guide.angle = Math.atan2(Math.abs(this.guide.y1-this.guide.y2), Math.abs(this.guide.x1-this.guide.x2)  )
            //}
        };

        funcs.setChordPoints = function(cx1, cy1, cx2, cy2) {

            try {
                this.chord.x1 = cx1;
                this.chord.y1 = cy1;
                this.chord.x2 = cx2;
                this.chord.y2 = cy2;

                this.guide.y1 = (this.chord.y1 + this.chord.y2) / 2;
                this.guide.x1 = (this.chord.x1 + this.chord.x2) / 2;

                // todo - using this?
                this.chord.slope = (this.chord.y1 - this.chord.y2) / (this.chord.x1 - this.chord.x2);
                this.guide.slope = - this.chord.slope ; // not needed?

                this.chord.angle = Math.atan2(Math.abs(this.chord.y1-this.chord.y2), Math.abs(this.chord.x1-this.chord.x2)  );
                this.guide.angle = (Math.PI/2) - this.chord.angle;

                var yDelt = (Math.sin(this.guide.angle) * this.guide.length);
                var xDelt = (Math.cos(this.guide.angle) * this.guide.length);
                // sign TBD

                //this.guide.y2 = this.guide.y1 + yDelt;
                    // x1,y1 could be on the right or the left!
                if ((this.chord.y1 > this.chord.y2 && this.chord.x1 < this.chord.x2) || (this.chord.y1 < this.chord.y2  && this.chord.x1 > this.chord.x2)) {
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
  service('helloWorldFromService', function() {
        this.sayHello = function() {
            return "BLAH"

        };
  }).
  value('version', '0.1');
