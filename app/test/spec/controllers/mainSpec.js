(function(){

    'use strict';



    describe('Controller: MainCtrl', function () {

        var MainCtrl,
            scope;

        // Initialize the controller and a mock scope
        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            MainCtrl = $controller('MainCtrl', {
                $scope: scope
            });
        }));

        it('should be truw', function () {
            expect(true).toEqual(true);
        });

    });

}());

