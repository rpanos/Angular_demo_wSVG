'use strict';

/* Controllers */

angular.module('myApp.controllers', []).


    /*
     todos

     - "new line" goes invisible when above not-paper and then re-greys at paper = easy!
        - remove Label business?
     - Test sweepFlag more - maybe set dynamically?

     - possibly remove inclickmode - OR NO!!
     - move some MORE logic to services
     - Maybe just remove valid for coords completely
     - maybe wrote a directive to show a "swicth" - but start with select

     - move labels into one object
     - remove all of init not needed


     */

    controller('DrawController', [
        '$scope', '$rootScope', '$location',  'arcCalcService', 'domService', 'LineDataService',           //'$watch', '$window',
        function ($scope, $rootScope, $location, arcCalcService, domService, LineDataService) {          //$watch, $window,

            console.debug("YUP");
            $scope.hidePoints = false;
            $scope.hidePointsLabel = "Show Points";
            $scope.pathMode = true;
            $scope.pathModeLabel = "Path Mode";
            $scope.pathModeClass = "PathMode";  // TODO complete or remove - in index.html
            $scope.showPointsForm = true;
            $scope.showCurveForm = true;

            $scope.mode_switch = "path";

            $scope.trueVal = true;   //TODO: find better sol
            $scope.falseVal = true;

            LineDataService.newLineObj = {};  //TODO MOOT?
            $scope.clickLineObj = {};
            $scope.lastLine = {};//pointless?

            $scope.lineObjects = LineDataService.lineObjects;  //moot?

            //TEMP!!!
            $scope.inClickMode = true;  //CONSIDER another method
            LineDataService.firstPointSet = false;  //TODO  MOOT?! def set in service?
            $scope.isHovering = true;
            //set elsewhere?
            $scope.clickLineObj.strokeColor = "blue";

            //TODO make an obj
//            $scope.yStart = 0
//            $scope.xStart = 0
//            $scope.yEnd = 0
//            $scope.xEnd = 0
//            $scope.svgChange = function() {
//                //$scope.svgObj.width = $scope.selectedElem.attr("offsetwidth");
//                $scope.svgObj.width = event.offsetwidth;
//
//            };
            //Service?
            $scope.svgObj = {
//                width: 900,
                width: '100%',
                height: 750,
                strkColor: "grey",
                strkWdth: 5
            };

//            $scope.$watch(function(){
//                return $window.innerWidth;
//            }, function(value) {
//                console.log("innerWidth: " + value);
//            });

            $scope.updateSwitchText = function() {
                console.log("--> mode_switch: " + $scope.mode_switch);

                console.log("--> newPointForm: "); console.log($scope.newPointForm);

            };

            $scope.resetFromPathMode = function (event) {
                LineDataService.firstPointSet = false;
                //LineDataService.
                $scope.newLineObj = LineDataService.giveBlankLineObj();
            };

            /*
             * IFF a click set has begun, let the line draw in anticipation
             *
             * TODO move both of these to the service?
             */
            $scope.checkPaperHover = function (event) {
                if ( $scope.inClickMode && LineDataService.firstPointSet  ) {  //$scope.newPointForm.$valid &&
                    $scope.newLineObj.x2 = event.offsetX;
                    $scope.newLineObj.y2 = event.offsetY;
                }
            }
            //this is temp over a more all encopassing service that determines hover_paper vs hover_not_paper
            $scope.checkRightRailHover = function (event) {
                if ($scope.inClickMode && LineDataService.firstPointSet ) {
                    $scope.newLineObj.x2 = $scope.newLineObj.x1;
                    $scope.newLineObj.y2 = $scope.newLineObj.y1;
                }
            }
            $scope.checkAllHover = function (event) {

                //TODO - finish service
//                if (! domService.checkAscendants(event.target, possibleParent, termParent) ) {
//                        $scope.lineObjects.x2 = $scope.newLineObj.x1;
//                        $scope.newLineObj.y2 = $scope.newLineObj.y1;
//                        $scope.overPaper = false;
//                    }
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
                console.debug("!!****!! handlePaperClick STATE:", $scope.inClickMode, LineDataService.firstPointSet);
                                // (newLineObj, inClickMode, pathMode, validForm, event)
                $scope.newLineObj = LineDataService.newPoint($scope.newLineObj, $scope.inClickMode, $scope.pathMode, $scope.newPointForm.$valid, event);

            };

            $scope.handleLineClick = function (event) {
                //put old back
                if (typeof($scope.selectedElem) != "undefined"  ) {
                    $scope.selectedElem.attr("stroke", "blue");
                    $scope.selectedElem.attr("stroke-width", "5");
                }
                $scope.selectedElem = angular.element(event.target);
                $scope.selectedElem.attr("stroke", "orange");
                $scope.selectedElem.attr("stroke-width", "2");
            };
            $scope.confirmdrawMode = function(){
                console.log("### drawMode: " + $scope.drawMode);
            };
            $scope.$watch('drawMode', function() {
                console.log("## __2__ # drawMode: " + $scope.drawMode);
                if ($scope.drawMode == 'path') {
                    $scope.inClickMode = true;
                    $scope.pathMode = true;
                } else if ($scope.drawMode == 'segment') {
                    $scope.inClickMode = true;
                    $scope.pathMode = false;
                    $scope.resetFromPathMode();

                } else if ($scope.drawMode == 'convert') {
                    $scope.inClickMode = false;
                    $scope.pathMode = false;
                    $scope.resetFromPathMode();

                } else {
                    console.log("NO or wrong drawMode ?")
                }
            });

            $scope.checkPathMode = function () {
                $scope.resetFromPathMode();  //This still valid?
            };

            $scope.convertSegment = function () {
                try {
                    arcCalcService.setChordPoints(parseFloat($scope.selectedElem.attr("x1")), parseFloat($scope.selectedElem.attr("y1")),
                        parseFloat($scope.selectedElem.attr("x2")), parseFloat($scope.selectedElem.attr("y2")));

                    $scope.chord = arcCalcService.chord;
                    $scope.guide = arcCalcService.guide;
                    $scope.arcObj = arcCalcService.arcObj;

                } catch (e) {
                    console.debug("ISSUE in convertSegment: " + e.message)
                }

            };
            $scope.handleRadiusLineClick = function () {

            }

            /**
             * Adds the current proposed line to the list of line segments.  This is currently used by
             * both the
             *
             * @param {fromPrev} boolean for whether the next line starts at the end of this added line
             * @return {Circle} The new Circle object.
             */
            $scope.submitAddForm = function (fromPrev) {

                fromPrev = fromPrev || $scope.pathMode;

                if ($scope.newPointForm.$valid) {

                    $scope.newLineObj=LineDataService.addLine(angular.copy($scope.newLineObj), fromPrev);
                    console.debug("RETURNED NEW obj:" + $scope.newLineObj.x1);
                    console.debug( $scope.newLineObj );
                    $scope.lineObjects = LineDataService.lineObjects;  //TODO .getLineObjects();
                    console.debug($scope.lineObjects);

                }

            };

            /*****
             *
             * All the toggle silliness
             *
             *
             */
            $scope.togglePointsForm = function () {
                $scope.showPointsForm = !$scope.showPointsForm;
                if ($scope.hidePoints) {

                } else {

                };
            };
            $scope.togglePointsTable = function () {
                $scope.hidePoints = !$scope.hidePoints;
                if ($scope.hidePoints) {
                    $scope.hidePointsLabel = "Hide Points";
                } else {
                    $scope.hidePointsLabel = "Show Points";
                }
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

            angular.element(document).ready(function () {
                console.log('Hello World');
                /// "INIT"
                $scope.resetFromPathMode();

                $scope.svgPaper = angular.element(document.body.querySelector("#paper"))[0];
                console.log("$$$$$ HAVE: " + $scope.svgPaper.clientWidth );
                console.log($scope.svgPaper);

                // NOTE: The user can change the size!
                $scope.svgObj.width = $scope.svgPaper.clientWidth;
                $scope.svgObj.height = $scope.svgPaper.clientHeight;

                // todo take form attr and apply an onChange?
                $scope.textX = $scope.svgPaper.clientWidth - 90;
//                //$scope.svgObj.width - 70
                $scope.textY = $scope.svgPaper.clientHeight - 25;
            });




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