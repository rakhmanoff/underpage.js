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

    self.callbackMap = {};

    self.init = function (params) {
      self.platform = params.platform || 'web';

      var options = {
        initobject: params.initobject,
        platform: params.platform
      };

      var readyEvent = new CustomEvent('underpageReady', options);
      window.document.dispatchEvent(readyEvent);
    };

    self.callback = function (id, params) {
      if (self.callbackMap[id]) {
        self.callbackMap[id](params);
        self.callbackMap[id] = null;
      }
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

        case 'setVariable':
          if (!params.key || !params.value) 
            return false;

          return true;

        case 'getVariable':
          if (!params.key || !params.callback) 
            return false;

          return true;
      }

      return false;
    };

    self.prepareMethod = function (method, params) {
      switch (method) {
        case 'getVariable':
          var id = Math.random().toString();
          self.callbackMap[id] = params.callback;
          break;
      }
    };

    self.exec = function (method, params) {
      if (self.validate(method, params)) {
        self.prepareMethod(method, params);

        switch (self.platform) {
          case 'web':
            self.execWeb(method, params);
            break;
          case 'ios':
            self.execiOS(method, params);
            break;
          case 'android': 
            self.execAndroid(method, params);
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

    self.execiOS = function (method, params) {
      var jsonParams = JSON.stringify(params);
      var escapedJsonParams = window.escape(jsonParams);
      var url = APP_NAME + '://' + method + '#' + escapedJsonParams;

      window.location.href = url;
    };
    
    self.execAndroid = function (method, params) {
      if (window.upinterface) {
        var jsonParams = JSON.stringify(params);
        var escapedJsonParams = window.escape(jsonParams);
        window.upinterface.exec(method, escapedJsonParams);
      }
    };

    self.getVariable = function (key, callback) {
      self.exec('getVariable', {
        key: key,
        callback: callback
      });
    };

    self.setVariable = function (key, value, sync) {
      sync = sync || 'device';
      self.exec('setVariable', {
        key: key,
        value: value,
        sync: sync
      });
    };

    // attach listeners on start
    self.listenMessages();

    return {
      init: self.init,
      exec: self.exec,
      callback: self.callback
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