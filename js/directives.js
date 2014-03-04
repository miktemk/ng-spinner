angular.module('ng').directive('ngSpinner', function () {
	function safeApply($scope, callback) {
		($scope.$$phase || $scope.$root.$$phase)
			? callback()
			: $scope.$apply(callback);
	}
	return {
		restrict: 'A',
		scope: {
			ngSpinner: '=',
			ngMin: '=',
			ngMax: '='
		},
		link: function (scope, element, attrs) {
			function checkBounds() {
				if (scope.ngMin != null && scope.ngMin != undefined && scope.ngSpinner < scope.ngMin)
					scope.ngSpinner = scope.ngMin;
				if (scope.ngMax != null && scope.ngMax != undefined && scope.ngSpinner > scope.ngMax)
					scope.ngSpinner = scope.ngMax;
			}
			element.val(scope.ngSpinner);
			element.spinner({
				min: scope.ngMin,
				max: scope.ngMax,
				spin: function (event, ui) {
					if (scope.ngSpinner != ui.value) {
						safeApply(scope, function () {
							scope.ngSpinner = ui.value;
						});
					}
				},
				change: function (event, ui) {
					if (event.handleObj && event.handleObj.type == "blur") {
						safeApply(scope, function () {
							scope.ngSpinner = element.spinner('value');
							checkBounds();
							// bounds check changed something! naughty naughty!
							if (scope.ngSpinner != element.spinner('value'))
								element.spinner('value', scope.ngSpinner);
						});
					}
				}
			});
			element.numeric();
			scope.$watch('ngSpinner', function (nv, ov) {
				if (nv != ov) {
					element.spinner('value', nv);
				}
			});
			scope.$watch('ngMin', function (nv, ov) {
				if (nv != ov) {
					element.spinner('option', 'min', nv);
					checkBounds();
				}
			});
			scope.$watch('ngMax', function (nv, ov) {
				if (nv != ov) {
					element.spinner('option', 'max', nv);
					checkBounds();
				}
			});
		}
	};
});