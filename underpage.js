/**
 * Library for a user interaction with HTML widgets in the UnderPage project.
 * v0.1.0
 *
 * Authors: 
 * Andrey Rakhmanov (@rakhmanoff)
 */

(function (window) {
  'use strict';

  // const
  var APP_NAME = 'underpagejs';

  // interaction class
  var Translator = function () {
    var self = this;

    self.locationProvider = window.document.location;

    self.setLocationProvider = function (provider) {
      self.locationProvider = provider;
    };

    // TODO: add error description
    self.validate = function (method, params) {
      switch (method) {
        case 'goToPage':
          if (!params.number) 
            return false;

          if (parseInt(params.number) !== params.number) 
            return false;

          if (params.number < 0) 
            return false;

          return true;
      }

      return false;
    };

    self.exec = function (method, params) {
      if (self.validate(method, params)) {
        var jsonParams = JSON.stringify(params);
        var escapedJsonParams = window.escape(jsonParams);
        var url = APP_NAME + '://' + method + '#' + escapedJsonParams;

        self.locationProvider.href = url;
      }
    };
  };

  // export
  window.Underpage = new Translator();

})(window);