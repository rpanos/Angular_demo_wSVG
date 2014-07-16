'use strict';

/* Controllers */

angular.module('myApp.controllers', []).


    /*
     todos

     -possibly remove inclickmode - OR NO
     - move some logic to services
     - Maybe just remove valid for coords completely
     - maybe wrote a directive to show a "swicth"


     */

    controller('MyCtrl1', [
        '$scope', '$location', 'arcCalcService',
        function ($scope, $location, arcCalcService) {

            console.debug("YUP");
            $scope.hidePoints = false;
            $scope.hidePointsLabel = "Show Points";
            $scope.pathMode = true;
            $scope.pathModeLabel = "Path Mode";
            $scope.pathModeClass = "Path Mode";
            $scope.showPointsForm = true;
            $scope.showCurveForm = true;

            $scope.trueVal = true;   //TODO: find better sol
            $scope.falseVal = true;

            $scope.newLineObj = {};
            $scope.clickLineObj = {};
            $scope.lastLine = {};//pointless?

            $scope.lineObjects = [];

            //TEMP!!!
            $scope.inClickMode = true;  //CONSIDER another method
            $scope.firstPointSet = false;
            $scope.isHovering = true;
            //set elsewhere?
            $scope.clickLineObj.strokeColor = "blue";

            //TODO make an obj
            $scope.yStart = 0
            $scope.xStart = 0
            $scope.yEnd = 0
            $scope.xEnd = 0

            //Service?
            $scope.svgObj = {
                width: 1100,
                height: 750,
                strkColor: "grey",
                strkWdth: 5
            };

            $scope.arcObj = {
                startX: 400,
                startY: 400,
                rx: 200,
                ry: 200,
                xRot:45,

                largeArcFlag: 0 ,
                sweepFlag: 1 ,

                endX: 600,
                endY: 200
            };
            $scope.textX = $scope.svgObj.width - 90;
           //$scope.svgObj.width - 70
            $scope.textY = $scope.svgObj.height - 25;  //

            $scope.resetFromPathMode = function (event) {
                $scope.firstPointSet = false;

                $scope.newLineObj = {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 0
                };
            };
            $scope.resetFromPathMode();

            $scope.insertLines = function () {

                _.each(lineObjects, function (lObj) {


                });

            };
            /*
             * IFF a click set has begun, let the line draw in anticipation
             */
            $scope.checkHover = function (event) {
                if ( $scope.inClickMode && $scope.firstPointSet) {  //$scope.newPointForm.$valid &&
                    $scope.newLineObj.x2 = event.offsetX;
                    $scope.newLineObj.y2 = event.offsetY;

                    //console.debug("HOVER $scope.clickLineObj: ", $scope.clickLineObj, $scope.newPointForm.$valid);
                } else {
                    console.debug("NOT hover bc state:", $scope.newPointForm.$valid, $scope.inClickMode, $scope.firstPointSet);
                }
            };

            $scope.checkForm = function () {
                if (!$scope.newPointForm.$valid) {
                    //$scope.svgObj.strkWdth = 0;
                    console.debug("$scope.newPointForm.$valid:", $scope.newPointForm.$valid, $scope.newPointForm.$error);
                    //$scope.newLineObj_line_class="newLineObj_line_hide";
                } else {
                    //$scope.newLineObj_line_class="newLineObj_line_show";
                    //$scope.svgObj.strkWdth = 5;  //temp - need to keep track in another obj
                }
            };

            $scope.handlePaperClick = function (event) {
                //console.debug("!!!! handlePaperClick event", event);
                console.debug("!!****!! handlePaperClick STATE:", $scope.inClickMode, $scope.firstPointSet);
                if ($scope.inClickMode && !$scope.firstPointSet) {
                    console.debug("---1---Should be setting first point")
                    $scope.newLineObj.x1 = event.offsetX;
                    $scope.newLineObj.y1 = event.offsetY;

                    $scope.firstPointSet = true;
                    console.debug("!!$$$!! SET handlePaperClick STATE:", $scope.inClickMode, $scope.firstPointSet);
                } else if ($scope.inClickMode && $scope.firstPointSet) {
                    console.debug("---2---Should be setting second point")
                    $scope.newLineObj.x2 = event.offsetX;
                    $scope.newLineObj.y2 = event.offsetY;

                    $scope.firstPointSet = false;  //shuts off hover

                    $scope.submitAddForm($scope.pathMode);
                    //BUT now we want temp line gone?
                } else {
                    console.debug("ERROR in handleClick", $scope.inClickMode, $scope.firstPointSet);
                }
            };
            $scope.togglePointsForm = function () {
                $scope.showPointsForm = !$scope.showPointsForm;
                if ($scope.hidePoints) {

                } else {

                }
                ;
            };
            $scope.toggleCurveForm = function () {
                $scope.showCurveForm = !$scope.showCurveForm;
            };
            $scope.toggleCurveForm = function (flag) {
                flag = !flag;
            };
            $scope.toggleHidePoints = function () {
                $scope.hidePoints = !$scope.hidePoints;
                if ($scope.hidePoints) {
                    $scope.hidePointsLabel = "Hide Points";
                } else {
                    $scope.hidePointsLabel = "Show Points";
                }
            };

            $scope.handleLineClick = function (obj) {

                //$scope.selectedElem.attr("stroke", "blue");
                $scope.selectedElem = angular.element(obj.target);
                $scope.selectedElem.attr("stroke", "orange");


            };

            $scope.togglePathMode = function () {
                $scope.pathMode = !$scope.pathMode;
                if ($scope.pathMode) {
                    $scope.pathModeLabel = "Path Mode";
                    $scope.pathModeClass = "PathMode";
                } else {
                    $scope.pathModeLabel = "NOT Path Mode";
                    $scope.pathModeClass = "PathMode";//eventually disable or whatever?

                    $scope.resetFromPathMode();
                }
            };

            $scope.checkPathMode = function () {

                $scope.resetFromPathMode();  //This still valid?
            };

            $scope.convertSegment = function () {
                try {
//                var x1 = $scope.selectedElem.x1.value;
//                var y1 = $scope.selectedElem.y1.value;
//                var x2 = $scope.selectedElem.x2.value;
//                var y2 = $scope.selectedElem.y2.value;

                    var x1 = parseFloat($scope.selectedElem.attr("x1"));
                    var y1 = parseFloat($scope.selectedElem.attr("y1"));
                    var x2 = parseFloat($scope.selectedElem.attr("x2"));
                    var y2 = parseFloat($scope.selectedElem.attr("y2"));

                    $scope.slope = (y1 - y2) / (x1 - x2)

                    console.log("PT 1 at:" + x1 + ", " + y1 + " w " + $scope.slope);

                    //if (y1 > y2) {  //points right
                        $scope.yStart = (y1 + y2) / 2
                        $scope.xStart = (x1 + x2) / 2

                    console.log("PT MID at:" + $scope.xStart + ", " + $scope.yStart);

//                        $scope.yEnd = $scope.yStart + (100 * (1 / $scope.slope))
//                        $scope.xEnd = $scope.xStart + (-100 * (1 / $scope.slope))

                    $scope.tempDelta = 100

                    //THESE are also the equations for the centre point
                    $scope.xEnd = $scope.xStart + (-$scope.tempDelta )
                    $scope.yEnd = ( 1 / $scope.slope) * ($scope.tempDelta) + $scope.yStart

                    arcCalcService.setPoints($scope.xStart, $scope.yStart,  $scope.xEnd, $scope.yEnd)
                    $scope.xRot = arcCalcService.angle

                    console.log("Set angle at:" + $scope.xRot)

                    $scope.arcObj = {
                        startX: x1,
                        startY: y1,
                        rx: 500,
                        ry: 500,
                        xRot:$scope.xRot,

                        largeArcFlag: 0 ,
                        sweepFlag: 1 ,

                        endX: x2,
                        endY: y2
                    };


                    //}
                } catch (e) {
                    console.debug("ISSUE in convertSegment: " + e.message)
                }

            };
            $scope.handleRadiusLineClick = function () {

            }

            $scope.submitAddForm = function (fromPrev) {

                fromPrev = fromPrev || $scope.pathMode;
                console.debug("!!!! ADDING ", $scope.newLineObj, " W ", fromPrev);

                if ($scope.newPointForm.$valid) {

                    // newLineObj chng
                    $scope.newLineObj = angular.copy($scope.newLineObj);
                    $scope.newLineObj.strokeColor = "red";

                    // Also add an ID to refer to later?
                    // $scope.newLineObj.id = $scope.lineObjects.length

                    $scope.lineObjects.push($scope.newLineObj);
                    $scope.newLineObj.strokeColor = "blue";  //for while choosing

                    if (fromPrev) {
                        $scope.newLineObj = {
                            x1: $scope.newLineObj.x2,
                            y1: $scope.newLineObj.y2,
                            x2: $scope.newLineObj.x2,
                            y2: $scope.newLineObj.y2
                        };
                        $scope.firstPointSet = true;
                    } else {
                        $scope.newLineObj = {};
                    }

                }

            };


            /*
             $scope.lineObjects = [ {
             x1:  0,
             y1:  0,
             x2: 100,
             y2: 100,
             strokeColor: "red"
             },{
             x1:  100,
             y1:  100,
             x2:  200,
             y2:  300,
             strokeColor: "red"
             },
             {
             x1:  0,
             y1:  0,
             x2: 200,
             y2: 300,
             strokeColor: "red"
             }];
             */


            //pointless?
            /*
             $scope.lastLine = {
             x1:  200,
             y1:  300,
             x2:  400,
             y2:  500,
             strokeColor: "blue"
             };
             $scope.lineObjects.push($scope.lastLine);*/


        }])
    .controller('MyCtrl2', [function () {

    }]);