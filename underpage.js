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

    self.init = function (params) {
      self.platform = params.platform || 'web';

      var readyEvent = new CustomEvent('underpageReady');
      window.document.dispatchEvent(readyEvent);
    };

    self.listenMessages = function () {
      window.addEventListener('message', function (event) {
        if (event.data == 'iframeLoaded') {
          window.Underpage.init('web');
        }
      });
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
        switch (self.platform) {
          case 'web':
            self.execWeb(method, params);
            break;

          case 'ios':
          case 'android': 
            self.execDevice(method, params);
            break;
        }
      }
    };

    self.execWeb = function (method, params) {
      var message = {
        message: 'underpagejs',
        containerType: params.pageType || 'page',
        method: method,
        params: params
      };

      window.parent.postMessage(JSON.stringify(message), '*');
    };

    self.execDevice = function (method, params) {
      var jsonParams = JSON.stringify(params);
      var escapedJsonParams = window.escape(jsonParams);
      var url = APP_NAME + '://' + method + '#' + escapedJsonParams;

      window.location.href = url;
    };

    // attach listeners on start
    self.listenMessages();

    return {
      init: self.init,
      exec: self.exec,
      validate: self.validate
    };
  };

  var instance = new Translator();

  if (typeof module === "object" && module.exports) {  
    // CommonJS support
    module.exports = instance;
  }
  else {
    window.Underpage = instance;
  }

})(window);