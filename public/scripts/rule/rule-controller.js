(function(angular){


	app.controller('ruleCtrl',function(RuleResource,$stateParams,ApplicationResource,$uibModal,filterFilter,$scope){
		var vm = this;
		
		vm.newRule = function(){
			var rule = {
				type: vm.selectedType,
				n: vm.numberFrom,
				t: vm.timeTo
			}
			RuleResource.newRule(rule).then(function(rule){

			});
			console.log(rule);
		}
	});

})(angular);