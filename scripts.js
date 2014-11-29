// Generated by CoffeeScript 1.6.3
(function() {
  "use strict";
  var after, every, _handlers, _trigger,
    __slice = [].slice;

  after = function(ms, cb) {
    return setTimeout(cb, ms);
  };

  every = function(ms, cb) {
    return setInterval(cb, ms);
  };

  _handlers = {};

  _trigger = function() {
    var args, event, handler, _fn, _i, _len, _ref;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    _ref = _handlers[event];
    _fn = function(handler) {
      var err;
      try {
        handler.apply(null, args);
      } catch (_error) {
        err = _error;
        console.log("Error handling " + event + " with " + handler + ": " + err);
      }
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      handler = _ref[_i];
      _fn(handler);
    }
  };

  Textual.bind = function(event, handler) {
    if (_handlers[event] == null) {
      _handlers[event] = [];
    }
    _handlers[event].push(handler);
  };

  Textual.viewFinishedLoading = function() {
    _trigger("viewFinishedLoading");
    Textual.fadeInLoadingScreen(1.00, 0.95);
    return after(500, function() {
      return Textual.scrollToBottomOfView();
    });
  };

  Textual.viewFinishedReload = function() {
    return Textual.viewFinishedLoading();
  };

  Textual.newMessagePostedToView = function(lineId) {
    var line;
    line = document.getElementById("line-" + lineId);
    if (!line) {
      line = document.getElementById("line" + lineId);
    }
    if (!line) {
      return;
    }
    _trigger("newMessagePostedToView", line);
  };

}).call(this);
// Generated by CoffeeScript 1.6.3
(function() {
  var HTML_BUG, RE_BUG;

  RE_BUG = /\b(?:bug|bugzilla|bz)[\|:]?\s*#?(\d+)\b/ig;

  HTML_BUG = '<a href="https://bugzilla.wikimedia.org/$1">$&</a>';

  Textual.bind('newMessagePostedToView', function(line) {
    if (RE_BUG.test(line.innerHTML)) {
      return line.innerHTML = line.innerHTML.replace(RE_BUG, HTML_BUG);
    }
  });

}).call(this);
// Generated by CoffeeScript 1.6.3
(function() {
  "use strict";
  var NickColorizer, colorNicks;

  NickColorizer = (function() {
    function NickColorizer() {
      var _this = this;
      this.key = 'textual.colorNicks';
      this.css = document.createElement('style');
      this.css.id = 'textual-colorNicks';
      this.css.type = 'text/css';
      this.css.media = 'all';
      Textual.bind("newMessagePostedToView", function(line) {
        return _this.newMessagePostedToView(line);
      });
      Textual.bind("viewFinishedLoading", function() {
        return _this.viewFinishedLoading();
      });
    }

    NickColorizer.prototype.load = function() {
      var val;
      val = localStorage.getItem(this.key);
      if (val) {
        return JSON.parse(val);
      } else {
        return {};
      }
    };

    NickColorizer.prototype.save = function(obj) {
      localStorage.setItem(this.key, JSON.stringify(obj));
    };

    NickColorizer.prototype.cleanNick = function(nick) {
      nick = nick.toLowerCase();
      nick = nick.replace(/[`_]+$/, "");
      nick = nick.replace(/\|.*$/, "");
      return nick.replace(/^(!\[|!\{)(.*)(\[.*\]|\{.*\})$/, "$2");
    };

    NickColorizer.prototype.getHash = function(nick) {
      var cleaned, hash, i;
      cleaned = this.cleanNick(nick);
      hash = 0;
      i = 0;
      while (i < cleaned.length) {
        hash = cleaned.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
        i++;
      }
      return hash;
    };

    NickColorizer.prototype.getColor = function(nick) {
      var deg, h, l, nickHash, s;
      nickHash = this.getHash(nick);
      deg = nickHash % 360;
      h = (deg < 0 ? 360 + deg : deg);
      l = 50;
      if (h >= 30 && h <= 210) {
        l = 30;
      }
      s = 20 + Math.abs(nickHash) % 80;
      return "hsl(" + h + ", " + s + "%, " + l + "%)";
    };

    NickColorizer.prototype.addNick = function(nick) {
      var c, color;
      c = this.load();
      if (nick in c) {
        return;
      }
      color = this.getColor(nick);
      c[nick] = color;
      this.save(c);
      this.addCss(nick, color);
    };

    NickColorizer.prototype.viewFinishedLoading = function() {
      var c, nick;
      c = this.load();
      for (nick in c) {
        this.addCss(nick, c[nick]);
      }
      document.head.appendChild(this.css);
    };

    NickColorizer.prototype.newMessagePostedToView = function(line) {
      var e, _fn, _i, _len, _ref,
        _this = this;
      _ref = line.querySelectorAll(".sender, .inline_nickname");
      _fn = function(e) {
        var nick;
        nick = false;
        if (e.className === "inline_nickname") {
          nick = e.innerText;
          e.setAttribute("nickname", e.innerText);
        } else {
          nick = e.getAttribute("nickname");
        }
        if (nick) {
          _this.addNick(nick);
        }
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        _fn(e);
        return;
      }
    };

    NickColorizer.prototype.addCss = function(nick, color) {
      this.css.textContent += "\n.sender[nickname='" + nick + "'], .inline_nickname[nickname='" + nick + "'] { color: " + color + " !important; }";
    };

    return NickColorizer;

  })();

  colorNicks = new NickColorizer();

}).call(this);
// Generated by CoffeeScript 1.6.3
(function() {
  var HTML_GERRIT, RE_GERRIT;

  RE_GERRIT = /\b(?:gerrit)[|:](\S+)\b/ig;

  HTML_GERRIT = '<a href="https://gerrit.wikimedia.org/r/?#q,$1,n,z">$&</a>';

  Textual.bind('newMessagePostedToView', function(line) {
    if (RE_GERRIT.test(line.innerHTML)) {
      return line.innerHTML = line.innerHTML.replace(RE_GERRIT, HTML_GERRIT);
    }
  });

}).call(this);
// Generated by CoffeeScript 1.6.3
(function() {
  var MUTED,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  MUTED = ['ecmabot-wm', 'gh-datavalues', 'gh-wmde', 'github', 'github-wmde', 'grrrit-wm', 'grrrit-wm1', 'grrrit-wm2', 'icinga-wm', 'labs-morebots', 'libel', 'morebots', 'mostbots', 'mw-jenkinsbot', 'phabot', 'phawikibugs', 'phawkes', 'pywikibugs', 'pywikibugs2', 'qa-morebots', 'shinken-wm', 'snitch', 'travis-ci', 'wikibugs', 'wikibugs2', 'wikiphabot', 'wm-bot', 'wm-bot3', 'wm-labs-meetbot', 'wm-labs-meetbot`', 'wmf-insecte', 'wmf-selenium-bot'];

  Textual.bind('newMessagePostedToView', function(line) {
    var cleanNick, e, type, _ref;
    e = line.querySelector('.sender');
    cleanNick = function(nick) {
      nick = nick.toLowerCase();
      nick = nick.replace(/[`_]+$/, "");
      nick = nick.replace(/\|.*$/, "");
      return nick.replace(/^(!\[|!\{)(.*)(\[.*\]|\{.*\})$/, "$2");
    };
    if (e && (_ref = cleanNick(e.getAttribute('nickname')), __indexOf.call(MUTED, _ref) >= 0)) {
      type = line.getAttribute('ltype');
      line.setAttribute('ltype', "" + type + " muted");
    }
  });

}).call(this);
// Generated by CoffeeScript 1.6.3
(function() {
  var HTML_PHAB, RE_PHAB;

  RE_PHAB = /([^/])\b([TMP]\d+)\b/g;

  HTML_PHAB = '$1<a href="https://phabricator.wikimedia.org/$2">$2</a>';

  Textual.bind('newMessagePostedToView', function(line) {
    if (RE_PHAB.test(line.innerHTML)) {
      return line.innerHTML = line.innerHTML.replace(RE_PHAB, HTML_PHAB);
    }
  });

}).call(this);
