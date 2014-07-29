'use strict';

/*
 *
 *          Directives
 *
 *  The min/max/preventDefault directives are borrowed, the radio one is mine while utilizing css from foundationCSS.
 *
 */

angular.module('myApp.directives', []).
    directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]).
    directive('ngMin', ['utilService', function (utilService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ctrl) {
                scope.$watch(attr.ngMin, function () {
                    ctrl.$setViewValue(ctrl.$viewValue);
                });
                var minValidator = function (value) {
                    var min = scope.$eval(attr.ngMin) || 0;
                    if (!utilService.isEmpty(value) && value < min) {
                        ctrl.$setValidity('ngMin', false);
                        return undefined;
                    } else {
                        ctrl.$setValidity('ngMin', true);
                        return value;
                    }
                };

                ctrl.$parsers.push(minValidator);
                ctrl.$formatters.push(minValidator);
            }
        };
    }]).
    directive('ngMax', ['utilService', function (utilService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ctrl) {
                scope.$watch(attr.ngMax, function () {
                    ctrl.$setViewValue(ctrl.$viewValue);
                });
                var maxValidator = function (value) {
                    var max = scope.$eval(attr.ngMax) || Infinity;
                    if (!utilService.isEmpty(value) && value > max) {
                        ctrl.$setValidity('ngMax', false);
                        return undefined;
                    } else {
                        ctrl.$setValidity('ngMax', true);
                        return value;
                    }
                };

                ctrl.$parsers.push(maxValidator);
                ctrl.$formatters.push(maxValidator);
            }
        };
    }]).
    directive('preventDefault', function() {
        return function(scope, element, attrs) {
            angular.element(element).bind('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
            });
        }
    }).
    directive('resizable', function($window) {
        return function($scope) {
            return angular.element($window).bind('resize', function() {
                if (!$scope.isFFox) {
                    $scope.resetSizeAtt();
                }
                return $scope.$apply();
            });
        };
    }).
    directive('rcpRadio', [ function () {
        return {
            restrict: 'E',
            scope: {
            },
            template: "<div class='switch radius'><input type='radio' value='{{selection}}' name='{{selectionName}}' id='{{selectionName}}_id' ng-model='$parent.drawMode'><label for='currentMode'></label><span> {{label}} </span></div>",
            link: function ($scope, element, attr, controller) {
                try {
                    //TODO: consider warnings on essential attr members
                    if (typeof(attr) != "undefined" && typeof(attr.label) != "undefined") {
                        $scope.label = attr.label;
                    } else {
                        $scope.label = "";
                    }
                    if (typeof(attr) != "undefined" && typeof(attr.selection) != "undefined") {
                        $scope.selection = attr.selection;
                        //For default checked!
                        if (typeof(attr) != "undefined" && typeof(attr.isChecked) != "undefined" && attr.isChecked) {
                            $scope.$parent.drawMode = attr.selection;
                        }
                    } else {
                        $scope.selection = "";
                    }
                    if (typeof(attr) != "undefined" && typeof(attr.selectionName) != "undefined") {
                        $scope.selectionName = attr.selectionName;
                    } else {
                        $scope.selectionName = "";
                    }

                    element.on('click', function (event) {
                        //var inputElem = angular.element(event.srcElement.parentElement).find("input")[0];
                        // For crossbrowser TODO confirm this!
                        var inputElem = angular.element(event.target.parentElement).find("input")[0];
                        if (!inputElem.checked) {
                            inputElem.checked = true;
                            $scope.$parent.drawMode = angular.element(inputElem).attr("value");
                        }

                    });
                    // TODO: remove try/catch in "production"
                } catch (e) {
                    console.debug("%%% ERR IN rcpRadio-link");
                    console.debug(e.message)
                }
            }
        };
    }]);



