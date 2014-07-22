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
            sweepFlag: 1
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
                this.arcObj.x1 = this.chord.x1;
                this.arcObj.y1 = this.chord.y1;
                this.arcObj.x2 = this.chord.x2;
                this.arcObj.y2 = this.chord.y2;

                this.arcObj.angle = this.chord.angle;

            } catch (e) {
                console.debug("ISSUE in setChordPoints: " + e.message)
            }

        };
        //funcs.

        return funcs;

  }).
  value('version', '0.1');
