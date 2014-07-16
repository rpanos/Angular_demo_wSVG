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

        var funcs = {};
        var x1, y1, x2, y2, xc= 0, yc=0;

        funcs.setPoints = function(x1, y1, x2, y2) {
            this.x1 = x1;
            this.y1 = y1;

            this.x2 = x2;
            this.y2 = y2;

            //if (cx == 0 || cy ==0) {

                this.angle = Math.atan2(Math.abs(this.y1-this.y2), Math.abs(this.x1-this.x2)  )


            //}
        }

        //funcs.

        return funcs;

  }).
  value('version', '0.1');
