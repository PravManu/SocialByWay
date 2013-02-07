(function($) {"use strict";
	/*jslint nomen: true*/
	/*jslint plusplus: true */
	/*global console, SBW*/
	/**
	 * @class PostWidget
	 * @namespace PostWidget
	 * @classdesc SocialByWay Like Widget to get the Like count and functionality to like a page
	 * @augments JQuery.Widget
	 * @alias PostWidget
	 * @constructor
	 */
	$.widget("ui.PostWidget", /** @lends PostWidget.prototype */
	{
		_create : function() {
			var self = this;

			self.tabsDiv = $('<div/>', {
				'class' : "tabs sbw-post-widget-" + self.options.theme
			});
			self.tabsUl = $('<ul/>', {
				'class' : 'tabs-ul'
			});
			self.element.append(self.tabsDiv);
			self.tabsDiv.append(self.tabsUl);

			self.postTab = $('<li/>');
			self.postTag = $('<a/>').attr({
				'class' : "tab-1"
			}).html("<span>Post</span>");
			self.postTab.append(self.postTag);
			self.tabsUl.append(self.postTab);

			self.postTabDiv = $('<div/>').attr({
				'class' : "tab-content"
			});
			self.postTabDiv.insertAfter(self.tabsUl);

			self.containerDiv = $('<div/>', {'class' : 'sbw-post-container'});
			self.postTabDiv.append(self.containerDiv);

			self.input = $('<textarea/>').attr({
				name : 'comment',
				'class' : 'post-box',
				maxlength : 5000,
				cols : 62,
				rows : 8,
				placeholder : 'Write here....'
			}).on('keyup', this, function() {
				self.charsleft.html(this.value.length);
			});

			self.charsleft = $("<p/>").attr({
				'class' : 'chars-count'
			}).text('0');

			self.containerDiv.append(self.input);

			self.postBtn = $('<button/>').attr({
				'class' : 'post-btn'
			}).text("publish");

			self.checkBoxesDiv = $('<div/>').attr('class', 'checkbox-container');

			self.options.services.forEach(function(value) {
				var temp = $('<div/>', {
					"class" : "checkbox " + value
				}).append($('<input/>', {
					'type' : 'checkbox',
					'name' : 'service',
					'value' : value
				})).append($('<div/>', {
					'class' : 'userimage'
				}).append($('<div/>', {
					'class' : 'service-container ' + value
				})));
				self.checkBoxesDiv.append(temp);
			});
			
			self.checkBoxesDiv.append(self.postBtn).append(self.charsleft).append($('<div/>', {'class' : 'clear'}));
			self.checkBoxesDiv.insertAfter(self.input);
			self.postBtn.on("click", this, this._addPost);
			
			$('#tabs ul li:first').addClass('active selected');
			$("#post-widget div.sbw-post-container div.checkbox-container").on('click', 'div.checkbox input', function() {
				var value = this.value;
				if ($(this).is("input:checked")) {
					$("div.service-container." + value).addClass('selected');
					SBW.Singletons.serviceFactory.getService(value).startActionHandler(function() {
						SBW.Singletons.serviceFactory.getService("controller").getProfilePic([value], null, function(response) {
							if (response) {
								$('div.' + value + " div.userimage").css('background', 'url(' + response + ')');
							}
						}, function(error) {

						});
					});
				} else {
					$("div.service-container." + value).removeClass('selected');
				}
			});

		},
		/**
		 * @desc Options for the widget.
		 * @inner
		 * @type {Object}
		 * @property {String} successMessage The success message to be displayed.
		 * @property {String[]} services Name of the registered services.
		 * @property {Number} limit The widget post limit.
		 * @property {Number} offset The offset for the widget.
		 * @property {String} theme The theme for the widget.
		 */
		options : {
			successMessage : '',
			services : ['facebook', 'twitter', 'linkedin'],
			limit : 10,
			offset : 0,
			theme : "default"
		},
		/**
		 * @method
		 * @desc Removes the widget from display
		 */
		destroy : function() {
			this.tabsDiv.remove();
			$.Widget.prototype.destroy.call(this);
		},
		/**
		 * @method
		 * @memberof PostWidget
		 * @param e
		 * @private
		 */
		_addPost : function(e) {
			var self = e.data, postText = $(self.input).val(), serviceArr = [], successCallback = function(response) {
				var elem = $("#post-widget div.sbw-post-container .sbw-success-message");
				if (elem.length !== 0) {
					elem.html(elem.text().substr(0, elem.text().length - 1) + ", " + response.service + ".");
				} else {
					self.containerDiv.append('<span class="sbw-success-message">Successfully posted on ' + response.service + '.</span>');
				}
			}, failureCallback = function(response) {
				self.containerDiv.append('<span class="sbw-error-message">Some problem in posting.</span>');
			};
			self.checkBoxesDiv.find("input:checked").each(function() {
				serviceArr.push(this.value);
			});
			$("#post-widget div.sbw-post-container .sbw-success-message").remove();
			
			SBW.Singletons.serviceFactory.getService("controller").publishMessage(serviceArr, postText, successCallback, failureCallback);

		}
	});
})(jQuery);
