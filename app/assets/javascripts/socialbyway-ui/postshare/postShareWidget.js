(function ($) {
  "use strict";
  /*jslint nomen: true*/
  /*jslint plusplus: true */
  /*global console, SBW*/
  /**
   * @class PostShareWidget
   * @namespace PostShareWidget
   * @classdesc
   * @augments JQuery.Widget
   * @alias PostShareWidget
   * @constructor
   */
  $.widget("ui.PostShareWidget",
    /** @lends PostShareWidget.prototype */
    {
      /**
       * @method
       * @private
       * @desc Constructor for the widget.
       * @ignore
       */
      _create: function () {
        var self = this;
        self.shareObject = {
          message: null,
          picture: self.options.icon,
          link: self.options.link,
          name: self.options.name,
          caption: self.options.caption,
          description: null,
          actions: {"name": self.options.action.name, "link": self.options.action.link}
        };
        self.$widgetContainer = $('<div/>').addClass("sbw-widget sbw-post-share-widget-" + self.options.theme);
        self.$title = $('<textarea/>').attr({
          'class': 'message',
          placeholder: 'Title'
        });
        self.$description = $('<textarea/>').attr({
          'class': 'description',
          placeholder: 'Description'
        });
        self.$iconContainer = $('<div/>').addClass('icon-container');
        self.$icon = $('<img/>').attr({ class: 'icon', src: self.options.icon});
        self.$iconContainer.append(self.$icon);
        self.$shareButton = $('<button/>').addClass('share-button').text('Share');

        //Create the checkbox container...
        self.$checkBoxContainer = $('<div/>').addClass('checkbox-widget-container');
        self.$checkBoxContainer.LoginWidget({
          services: self.options.serviceArray
        });
        self.$checkBoxContainer.append(self.$shareButton);
        if (self.options.shareButton !== 'on') {
          self.$shareButton.hide();
        }
        self.$postDescriptionContainer = $('<div/>').addClass('post-description-container');
        self.$postDescriptionContainer.append(self.$title, self.$description);
        self.$widgetContainer.append(self.$iconContainer, self.$postDescriptionContainer, self.$checkBoxContainer);
        self.element.append(self.$widgetContainer);

        self.$shareButton.on("click", this, this.postShare);
        self.$postDescriptionContainer.change(function (param) {
          var key = param.target.className,
            value = $(this).children('.' + param.target.className).val();
          self.shareObject[key] = value;
        });
      },
      /**
       * @desc Options for the widget.
       * @inner
       * @type {Object}
       * @property {String} theme Theme for the postShare widget
       * @property {Array} serviceArray Array of services to support
       * @property {String} shareButton
       */
      options: {
        theme: 'default',
        serviceArray: ['facebook'],
        shareButton: 'on',
        link: '',
        name: '',
        action : {name: '', link: ''},
        icon: 'http://www.socialbyway.com/style/images/logo.png',
        caption: ''
      },
      /**
       * @method
       * @desc Authenticate to the specified service to post share.
       * @param {String} service Name of the registered service to be authenticated.
       * @param {Function} loginSuccessHandler The callback to be executed on successful login.
       */
      authenticate: function (service, loginSuccessHandler) {
        SBW.Singletons.serviceFactory.getService(service).startActionHandler(loginSuccessHandler);
      },
      /**
       * @method
       * @desc Method to set the icon.
       * @param iconUrl The url of the icon.
       */
      setIcon: function (iconUrl) {
        this.shareObject.picture = iconUrl;
        this.$icon.attr('src', 'iconUrl');
      },
      /**
       * @method
       * @desc Method to set the title.
       * @param title The title to be set for the share.
       */
      setTitle: function (title) {
        this.shareObject.message = title;
        this.$title.text(title);
      },
      /**
       * @method
       * @desc Method to set the description.
       * @param description The description of the share.
       */
      setDescription: function (description) {
        this.shareObject.description = description;
        this.$description.text(description);
      },
      /**
       * @method
       * @desc Method to set the metadata.
       * @param {Object} metaData MetaData({link: null, name : null, caption : null}) of for the PostShare.
       */
      setMetaData: function (metaData) {
        this.shareObject.link = metaData.link;
        this.shareObject.name = metaData.name;
        this.shareObject.caption = metaData.name;
      },
      /**
       * @method
       * @desc Method to set the action.
       * @param {Object} action MetaData( actions: {"name": null, "link": null} ) of for the PostShare.
       */
      setAction: function (action) {
        this.shareObject.actions.link = action.link;
        this.shareObject.actions.name = "View on " + action.name;
      },
      /**
       * @method
       * @desc Method to set the data.
       * @param {Object} postData
       * postData = { message: null, picture: null, link: null, name: null, caption: null, description: null, actions: {"name": null, "link": null} };
       * postData of for the PostShare.
       */
      setData: function (postData) {
        this.shareObject = {
          message: postData.message,
          picture: postData.picture,
          link: postData.link,
          name: postData.name,
          caption: postData.caption,
          description: postData.description,
          actions: {"name": "View on " + postData.actions.name, "link": postData.actions.link}
        };
        this.$title.text(postData.message);
        this.$description.text(postData.description);
      },
      /**
       * @method
       * @desc Method to share the post.
       */
      postShare: function (context) {
        var self = context.data || this, serviceArr = [],
          postShareData = self.shareObject,
          successCallback = function (response) {
            if (self.$successText) {
              self.$successText.empty();
            }
            self.$successText = $("<p/>").text("Successfully posted in " + response.serviceName);
            self.$widgetContainer.append(self.$successText);
            self.$successText.delay(1000).fadeOut();
          },
          failureCallback = function (response) {
            if (self.$failureText) {
              self.$failureText.empty();
            }
            self.$failureText = $("<p/>").text("Error while publishing media in " + response.serviceName);
            self.$widgetContainer.append(self.$failureText);
          };
        self.$checkBoxContainer.find("input:checked").each(function () {
          serviceArr.push(this.value);
        });
        SBW.api.postShare(serviceArr, postShareData, successCallback, failureCallback);
      },
      /**
       * @method
       * @desc Function to destroy the widget.
       * @ignore
       */
      destroy: function () {
        $.Widget.prototype.destroy.call(this);
      }
    });
})(jQuery);
