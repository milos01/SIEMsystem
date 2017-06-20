(function(angular){

	app.controller('reportCtrl', function(ReportResource) {
		var vm = this;
    	
		vm.getLogs = function(){
			var logFrom = vm.logFrom;
			var logDateFrom = new Date(logFrom);
    		var logTo = vm.logTo;
			
			ReportResource.getLogs(logDateFrom,logTo).then(function(res){
				vm.lista = res;
			});
		}

		vm.getAlarms = function(){
			var alarmFrom = vm.alarmFrom;
    		var alarmTo = vm.alarmTo;

			ReportResource.getAlarms(alarmFrom,alarmTo).then(function(res){
				vm.listaAlarm = res;
				console.log(vm.listaAlarm);
			});
    		
		}
		
	});
})(angular);