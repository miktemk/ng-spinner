angular.module('miktemk', ['ng']);
angular.module('miktemk').directive('ngSpinner', function () {
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
			ngMax: '=',
			ngStep: '=',
			ngDisabled: '=',
			ngReset: '='
		},
		link: function (scope, element, attrs) {
			function checkBounds() {
				if (scope.ngMin != null && scope.ngMin != undefined
					&& (scope.ngSpinner < scope.ngMin
					|| ((scope.ngSpinner == null || scope.ngSpinner == undefined) && scope.ngReset)))
					scope.ngSpinner = scope.ngMin;
				if (scope.ngMax != null && scope.ngMax != undefined && scope.ngSpinner > scope.ngMax)
					scope.ngSpinner = scope.ngMax;
				if (scope.boundByInt32 && scope.ngSpinner > 2147483647)
					scope.ngSpinner = 2147483647; // Int32.MaxValue
			}
			if (scope.ngMax == null || scope.ngMax == undefined)
				scope.boundByInt32 = true;
			var $spinner = $(element);
			$spinner.val(scope.ngSpinner);
			$spinner.spinner({
				min: scope.ngMin,
				max: scope.ngMax,
				step: scope.ngStep,
				value: $(this).attr('aria-valuenow'),
				disabled: scope.ngDisabled,
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
							scope.ngSpinner = $spinner.spinner('value');
							checkBounds();
							// bounds check changed something! naughty naughty!
							if (scope.ngSpinner != $spinner.spinner('value'))
								$spinner.spinner('value', scope.ngSpinner);
						});
					}
				}
			});
			$spinner.on('keyup', function (e) {
				if (scope.ngSpinner != $spinner.spinner('value')) {
					safeApply(scope, function () {
						scope.ngSpinner = $spinner.spinner('value');
					});
				}
			});
			$spinner.numeric();
			scope.$watch('ngSpinner', function (nv, ov) {
				if (nv != ov) {
					$spinner.spinner('value', nv);
				}
			});
			scope.$watch('ngMin', function (nv, ov) {
				if (nv != ov || nv != $spinner.spinner('option', 'min')) {
					$spinner.spinner('option', 'min', nv);
					checkBounds();
				}
			});
			scope.$watch('ngMax', function (nv, ov) {
				if (nv != ov || nv != $spinner.spinner('option', 'max')) {
					$spinner.spinner('option', 'max', nv);
					checkBounds();
				}
			});
			scope.$watch('ngStep', function (nv, ov) {
				if (nv != ov || nv != $spinner.spinner('option', 'step')) {
					$spinner.spinner('option', 'step', nv ? nv : 1);
					checkBounds();
				}
			});
			scope.$watch('ngDisabled', function (nv, ov) {
				if (nv != ov) {
					nv ? $spinner.spinner('disable') : $spinner.spinner('enable');
				}
			});
		}
	};
});