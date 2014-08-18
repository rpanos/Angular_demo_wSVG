'use strict';

/* jasmine specs for services go here */

describe('service', function () {
    beforeEach(module('myApp.services'));


    describe('version', function () {

        it('should return current version', inject(function (version) {
            expect(version).toEqual('0.1');
        }));

    });


    describe('arcCalcService test', function(){
        describe('when I call arcCalcService.guide', function(){
            it('returns length: 400', function(){
                var $injector = angular.injector([ 'myApp' ]);
                var myService = $injector.get( 'arcCalcService' );
                expect( myService.guide ).toEqual({length: 400});
            })

        });

        // Do some expects with ranges 0-1500 in px or -2Pi to 2pi?  half Pi?


    });

//
//    describe('arcCalcService', function () {
//
//        it('should return good things', inject(function ($service) {
//
//            var arcServ = $service('arcCalcService', {$scope:scope});
//
//        }));
//
//    });
//
//    describe('PhoneListCtrl', function(){
//
//        beforeEach(module('phonecatApp'));
//
//        it('should create "phones" model with 3 phones', inject(function($controller) {
//            var scope = {},
//                ctrl = $controller('PhoneListCtrl', {$scope:scope});
//
//            expect(scope.phones.length).toBe(3);
//        }));
//
//    });

});
