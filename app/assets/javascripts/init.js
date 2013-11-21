( function() {"use strict";
		/*jslint nomen: true*/
		/*jslint plusplus: true */
		/*global SBW*/
		SBW.init = function(config, callback) {
			
			SBW.Singletons.serviceFactory = new SBW.Controllers.ServiceFactory();
			SBW.logger = new SBW.Logger();
			SBW.Singletons.utils = new SBW.Utils();
			SBW.api = new SBW.Controllers.Services.ServiceController();

			if (SBW.Singletons.utils.isType(config, String)) {
				SBW.Singletons.utils.ajax({
					url : config,
					dataType : 'json'
				}, function(successResponse) {
					initializeServices(successResponse, callback);
				}, function(errorResponse) {
					callback(errorResponse);
				});
			} else if (SBW.Singletons.utils.isType(config, Object)) {
				initializeServices(config, callback);
			}
		};
		
		var initializeServices = function (config, callback) {
			var enabledServices, key, serviceName;
			SBW.Singletons.config = config;
			
			enabledServices = SBW.Singletons.config.services;
			SBW.logger.on = SBW.Singletons.config.debug === 'true' ? true : false;

			for (key in enabledServices) {
				if (enabledServices.hasOwnProperty(key)) {
					serviceName = key.toLowerCase();
					SBW.Singletons.serviceFactory.registerService(serviceName, SBW.Controllers.Services[key]);
					SBW.Singletons.serviceFactory.getService(serviceName).init();
				}
			}
			if(SBW.Singletons.utils.isType(callback, Function)) {
				callback();
			}
		}
	}());
// End of IIFE