(function () {
//Service for authentication 
app.service('filters', function(){
  var systemIncludes = [];
  var pcIncludes = [];
  var checkSystem = function(system) {
          var i = $.inArray(system, systemIncludes);
          if (i > -1) {
              systemIncludes.splice(i, 1);
          } else {
              systemIncludes.push(system);
          }
  }

  var checkPc = function(pc) {
          var i = $.inArray(pc, pcIncludes);
          if (i > -1) {
              pcIncludes.splice(i, 1);
          } else {
            pcIncludes = [];
            pcIncludes.push(pc);
        }
  }
    
  var systemFilter = function(event) {
      if (systemIncludes.length > 0) {
          if ($.inArray(event.system, systemIncludes) < 0)
              return;
      }
      
      return event;
  }

  var pcFilter = function(event) {
      if (pcIncludes.length > 0) {
        if($.inArray('', pcIncludes) >= 0){
          return event;
        }
          if ($.inArray(event.computerName, pcIncludes) < 0){
              return;
          }
      }
      
      return event;
  }
  

  return {
      checkSystem : checkSystem,
      checkPc : checkPc,
      systemFilter : systemFilter,
      pcFilter: pcFilter
    };
});
})();