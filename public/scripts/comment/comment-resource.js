(function(angular){
	
		app.factory('CommentResource',function(Restangular){

		var retVal = {};

		
		//event/:eid/comment
		retVal.getEventComments =  function(ide){
			return Restangular.one('event',ide).all('comment').getList().then(function(response){
				return response;
			});
		}

        //event/:eid/comment
        retVal.postEventComment =  function(ide, text, owner){
            var postComment = {'text':text, 'owner':owner};
			return Restangular.one('event',ide).all('comment').post(postComment).then(function(response){
				return response;
			});
		}

        //event/:eid/comment/:cid/subcomment
        retVal.postEventSubComment =  function(ide, text, owner, cid){
            var postComment = {'text':text, 'owner':owner};
			return Restangular.one('event',ide).one('comment', cid).all('subcomment').post(postComment).then(function(response){
				return response;
			});
		}

		return retVal;
	})

})(angular);