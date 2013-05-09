(function($) { /*jslint nomen: true*/
  /*jslint plusplus: true */
  /*global console, SBW*/
  /**
   * @class LoginWidget
   * @namespace LoginWidget
   * @classdesc SocialByWay Post Widget to  Post messages on to social sites
   * @augments JQuery.Widget
   * @alias LoginWidget
   * @constructor
   */
  "use strict";
  $.widget("ui.LoginWidget", /** @lends LoginWidget.prototype */ {
    _create: function() {
      var self = this;
      self.serviceFactory = SBW.Singletons.serviceFactory;
      // Tabs UI
      self.$tabsDiv = $('<div/>').attr('class', "sbw-widget sbw-login-widget-" + self.options.theme);
      
      self.$actionStrip = $('<div/>', {
        'class': "checkbox-container"
      });

      self.$tabsDiv.on('click', '.check-container input', function(e) {
        var that = this,
          value = that.value;
        if ($(that).is(":checked")) {
          $(that).prop('checked', false);
          self.serviceFactory.getService(value).startActionHandler(function() {
            $(that).prop('checked', true);
            self.$actionStrip.find(".service-container." + value).addClass('selected');
            SBW.api.getProfilePic([value], null, function(response) {
              if (response) {
                self.$actionStrip.find('.' + value + " .userimage").css({"background": 'url("' + response + '")', "background-size": '40px 40px'});
              }
            }, function(error) {});
          });
        } else {
          self.$actionStrip.find(".service-container." + value).removeClass('selected');
        }
      });

      self.options.services.forEach(function(value) {
        var temp = $('<div/>').addClass("check-container " + value).
        append("<input type='checkbox' name='service' value='" + value + "'/>").
        append("<div class='userimage'></div>").
        append("<div class='service-container " + value + "'></div>");
        self.$actionStrip.append(temp);
      });

      self.$actionStrip.append('<div class="clear"></div>');
      self.$tabsDiv.append(self.$actionStrip);
      self.element.append(self.$tabsDiv);
    },
    /**
     * @desc Options for the widget.
     * @inner
     * @type {Object}
     * @property {String[]} services Name of the registered services.
     * @property {String} theme The theme for the widget.
     * @property {String} type The type of view.
     */
    options: {
      services: ['facebook'],
      theme: "default",
      type : "checkbox"
    },
    /**
     * @method
     * @desc Method to check user is logged in(has a authenticated session to service).
     * @param {Array} serviceArray Array of services to check for user's authenticated session.
     * @param {Callback} callback will be called after user's authenticated session to service is checked.
     * @private
     */
    checkUserLoggedIn: function (serviceArray, callback) {
      var aggregateResponse = [],i = serviceArray.length,j=0;
      serviceArray.forEach(function (service) {
        
       var Callback = function (response) {
        j=j+1;
        aggregateResponse.push({service: service, userLoggedIn: response});
        if(j==i){
          callback(aggregateResponse);
        }; 
      }
      
        SBW.api.checkUserLoggedIn(service, Callback);
      });
    },
    /**
     * @method
     * @desc Removes the widget from display
     */
    destroy: function () {
      this.$tabsDiv.remove();
      $.Widget.prototype.destroy.call(this);
    }
  });
})(jQuery);