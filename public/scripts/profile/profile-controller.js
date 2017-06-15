(function(angular){
	app.controller('profileCtrl',function(UserResource){
		var vm = this;

		vm.updatePassword = function(){
			var oldPassword = vm.oldPassword;
			var newPassword = vm.newPassword;
			var params = {
				oldPassword : oldPassword,
				newPassword : newPassword
			}
			UserResource.updatePassword(params).then(function(res){
				console.log(res);
			});
			
		}
	});
})(angular);