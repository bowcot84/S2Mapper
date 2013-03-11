define([
       'mapper/s2_ajax',
       'mapper/s2_resource_factory',
       'mapper/s2_base_resource',
       'mapper/s2_tube_resource',
       'mapper/s2_batch_resource'
], function(S2Ajax, ResourceFactory, BaseResource, Tube, Batch){
  'use strict';

  // register resources with root.
  var s2_ajax = new S2Ajax();

  var resourceClasses = {
    tubes: Tube,
    batches: Batch
  };

  // Symilar to BaseResource
  var processResources = function(response){
    var rawJson  = response.responseText;
    var processedResources = {};

    for (var resource in rawJson){
      var resourceJson       = {};
      // wrap the json so that it looks like any other resource
      resourceJson[resource] = rawJson[resource];

      var resourceClass = resourceClasses[resource]? resourceClasses[resource] : BaseResource;

      processedResources[resource] = resourceClass.instantiate({
        rawJson: resourceJson
      });

      // Extend the class if it has specialisation set up above.
      $.extend(processedResources[resource], resourceClass);
    }

    return processedResources;
  };

  var S2Root = Object.create(null);

  var instanceMethods = {
    find: function(uuid){
      return new ResourceFactory({uuid: uuid});
    }
  };

  var classMethods = {
    load: function(){
      var rootDeferred = $.Deferred();

      // Make a call for the S2 root...
      s2_ajax.send().done(function(response){


        var rootInstance = processResources(response);
        $.extend(rootInstance, instanceMethods);

        for (var resource in rootInstance){
          rootInstance[resource].root = rootInstance;
        }

        rootDeferred.resolve(rootInstance);
      });


      return rootDeferred;
    }

  };

  $.extend(S2Root, classMethods);


  return S2Root;
});
