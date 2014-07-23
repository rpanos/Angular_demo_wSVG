'use strict';

/* Controllers */

angular.module('myApp.controllers', []).


    /*
     todos

     - MODES IN A DROP DOWN!
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
        '$scope', '$location', 'arcCalcService', 'domService', 'SVGDataService',
        function ($scope, $location, arcCalcService, domService, SVGDataService) {

            console.debug("YUP");
            $scope.hidePoints = false;
            $scope.hidePointsLabel = "Show Points";
            $scope.pathMode = true;
            $scope.pathModeLabel = "Path Mode";
            $scope.pathModeClass = "PathMode";  // TODO complete or remove - in index.html
            $scope.showPointsForm = true;
            $scope.showCurveForm = true;

            $scope.trueVal = true;   //TODO: find better sol
            $scope.falseVal = true;

            SVGDataService.newLineObj = {};  //TODO MOOT?
            $scope.clickLineObj = {};
            $scope.lastLine = {};//pointless?

            $scope.lineObjects = SVGDataService.lineObjects;  //moot?

            //TEMP!!!
            $scope.inClickMode = true;  //CONSIDER another method
            SVGDataService.firstPointSet = false;  //TODO  MOOT?! def set in service?
            $scope.isHovering = true;
            //set elsewhere?
            $scope.clickLineObj.strokeColor = "blue";

            //TODO make an obj
//            $scope.yStart = 0
//            $scope.xStart = 0
//            $scope.yEnd = 0
//            $scope.xEnd = 0

            //Service?
            $scope.svgObj = {
                width: 900,
                height: 750,
                strkColor: "grey",
                strkWdth: 5
            };


            // todo take form attr and apply an onChange?
            $scope.textX = $scope.svgObj.width - 90;
           //$scope.svgObj.width - 70
            $scope.textY = $scope.svgObj.height - 25;  //

            $scope.resetFromPathMode = function (event) {
                SVGDataService.firstPointSet = false;
                //SVGDataService.
                $scope.newLineObj = SVGDataService.giveBlankLineObj();
            };

            /*
             * IFF a click set has begun, let the line draw in anticipation
             *
             * TODO move both of these to the service?
             */
            $scope.checkPaperHover = function (event) {
                if ( $scope.inClickMode && SVGDataService.firstPointSet  ) {  //$scope.newPointForm.$valid &&
                    $scope.newLineObj.x2 = event.offsetX;
                    $scope.newLineObj.y2 = event.offsetY;
                }
            }
            //this is temp over a more all encopassing service that determines hover_paper vs hover_not_paper
            $scope.checkRightRailHover = function (event) {
                $scope.newLineObj.x2 = $scope.newLineObj.x1;
                $scope.newLineObj.y2 = $scope.newLineObj.y1;
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
                console.debug("!!****!! handlePaperClick STATE:", $scope.inClickMode, SVGDataService.firstPointSet);
                                // (newLineObj, inClickMode, pathMode, validForm, event)
                $scope.newLineObj = SVGDataService.newPoint($scope.newLineObj, $scope.inClickMode, $scope.pathMode, $scope.newPointForm.$valid, event);

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

                    $scope.newLineObj=SVGDataService.addLine(angular.copy($scope.newLineObj), fromPrev);
                    console.debug("RETURNED NEW obj:" + $scope.newLineObj.x1);
                    console.debug( $scope.newLineObj );
                    $scope.lineObjects = SVGDataService.lineObjects;  //TODO .getLineObjects();
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
            $scope.toggleCurveForm = function () {
                $scope.showCurveForm = !$scope.showCurveForm;
            };
            $scope.toggleHidePoints = function () {
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

            /// "INIT"
            $scope.resetFromPathMode();

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