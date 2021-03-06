'use strict';

/* Controllers */

angular.module('myApp.controllers', []).

    /*
     TODOs

     - move some MORE logic to services
     - Maybe just remove valid for coords completely

     - move labels into one object
     - move more inits to services
     - Document code!

     */

    controller('DrawController', [
        '$scope', '$rootScope', '$location',  'arcCalcService', 'domService', 'LineDataService', '$window', 'utilService',          //'$watch', '$window',
        function ($scope, $rootScope, $location, arcCalcService, domService, LineDataService, $window, utilService) {          //$watch, $window,
            $scope.resetFromPathMode = function (event) {
                LineDataService.firstPointSet = false;
                $scope.newLineObj = LineDataService.giveBlankLineObj();
            };

            /*
             * IFF a click set has begun, let the line draw in anticipation
             *
             * TODO move some of this logic to a service?
             */
            $scope.checkPaperHover = function (event) {

                event = utilService.fixEvent(event);

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

            // For debug only
            $scope.checkForm = function () {
                if (!$scope.newPointForm.$valid) {
                    //$scope.svgObj.strkWdth = 0;
                    //console.debug("$scope.newPointForm.$valid:", $scope.newPointForm.$valid, $scope.newPointForm.$error);
                    //$scope.newLineObj_line_class="newLineObj_line_hide";
                } else {
                    //$scope.newLineObj_line_class="newLineObj_line_show";
                    //$scope.svgObj.strkWdth = 5;  //temp - need to keep track in another obj
                }
            };

            $scope.handlePaperClick = function (event) {
                // Deliberate de-coupling
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

            $scope.$watch('drawMode', function() {
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
                    //This is a complete replace!
                    $scope.currArcObj = arcCalcService.arcObj;

                } catch (e) {
                    console.debug("ISSUE in convertSegment: " + e.message)
                }
            };
            $scope.handleRadiusLineClick = function () {
                //TBD
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
             *
             *
             *
             */
            $scope.togglePointsTable = function () {
                $scope.hidePoints = !$scope.hidePoints;
                if ($scope.hidePoints) {
                    $scope.hidePointsLabel = "Hide Points";
                } else {
                    $scope.hidePointsLabel = "Show Points";
                }
                console.log("## togglePointsTable now: " + $scope.hidePointsLabel);
            };

            $scope.resetSizeAtt = function () {
                // NOTE: The user can change the size!

                if (typeof($scope.svgObj) != "undefined") {


                    $scope.svgObj.width = $scope.svgPaper.clientWidth;
                    $scope.svgObj.height = $scope.svgPaper.clientHeight;

                    $scope.textX = $scope.svgPaper.clientWidth - 190;
                    $scope.textY = $scope.svgPaper.clientHeight - 125;
                }
//
            };

            $scope.init = function() {

                $scope.guide = arcCalcService.initGuide;
                $scope.currArcObj = arcCalcService.giveInitArc();

                $scope.hidePoints = false;
                $scope.hidePointsLabel = "Show Points";

                $scope.mode_switch = "path";
                $scope.pathMode = true;
                $scope.isHovering = true;
                $scope.inClickMode = true

                $scope.lineObjects = LineDataService.lineObjects;

                $scope.newLineObj = LineDataService.initNewLineObj;

                //set elsewhere?
                $scope.clickLineObj = {};
                $scope.clickLineObj.strokeColor = "blue";

                var userAgent = $window.navigator.userAgent;

                $scope.fFoxIsFunctional = true;
                $scope.isFFox = (userAgent.indexOf("Firefox")!=-1);
                if ($scope.isFFox) {
                    console.log("FFOX!" + userAgent);
                    $scope.svgObj.width = "1000px";
                    $scope.svgObj.height = "650px";
                } else {
                    console.log("NOT FFOX!" + userAgent);
                }
            };

            angular.element(document).ready(function () {
                //move to a service?
                $scope.svgObj = {
                    width: '100%',
                    height: '650px',
                    strkColor: "grey",
                    strkWdth: 5
                };

                $scope.resetFromPathMode();
                $scope.svgPaper = angular.element(document.body.querySelector("#paper"))[0];
                $scope.resetSizeAtt();
            });
        }]);