define ([], function () {
  'use strict';

  var config = {
    apiUrl:'', // NOT USED IN TESTING

    currentStage:1,

    getTestJson:function () {
      return config.testJSON[config.currentStage];
    },

    cpResource:function (original_uuid, new_uuid) {
      var resourceJsonClone = JSON.parse (JSON.stringify (
        config.getTestJson ()["/" + original_uuid]));
      resourceJsonClone.uuid = new_uuid;
      config.getTestJson ()["/" + new_uuid] = resourceJsonClone;
    },

    // Dummy out the ajax call returned by S2Ajax to test from file.
    // Returns a Deferred instead of jqXHR.
    ajax:      function (options) {
      var requestOptions = $.extend ({
        data:{
          uuid:undefined
        }
      }, options);

      // a blank options.url should default to '/'
      if (options.url.length === 0) requestOptions.url = '/';

      // We resolve the Deferred object before return so any callbacks added
      // with .done() are called as soon as they're added, which should solve 
      // testing latency issues.
      return $.Deferred ().resolve ({
        url:         '/something/other',
        'status':    200,
        responseTime:750,
        responseText:config.getTestJson ()[requestOptions.url]
      });
    }
  };

  return config;
});
