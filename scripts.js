// Generated by CoffeeScript 2.5.1
(function() {
  "use strict";
  var _handlers, _trigger, after, every;

  after = function(ms, cb) {
    return setTimeout(cb, ms);
  };

  every = function(ms, cb) {
    return setInterval(cb, ms);
  };

  // dict of message handlers
  _handlers = {};

  // call handlers for a message
  _trigger = function(event, ...args) {
    var handler, i, len, ref;
    if (_handlers[event]) {
      ref = _handlers[event];
      for (i = 0, len = ref.length; i < len; i++) {
        handler = ref[i];
        (function(handler) {
          var err;
          try {
            handler(...args);
          } catch (error) {
            err = error;
            console.log(`Error handling ${event} with ${handler}: ${err}`);
          }
        })(handler);
      }
    }
  };

  // register to receive a message
  Textual.bind = function(event, handler) {
    if (_handlers[event] == null) {
      _handlers[event] = [];
    }
    _handlers[event].push(handler);
  };

  Textual.viewBodyDidLoad = function() {
    _trigger("viewBodyDidLoad");
    return Textual.fadeOutLoadingScreen(1.00, 0.95);
  };

  Textual.messageAddedToView = function(line, fromBuffer) {
    var element;
    element = document.getElementById(`line-${line}`);
    if (!element) {
      return;
    }
    _trigger("messageAddedToView", element);
    ConversationTracking.updateNicknameWithNewMessage(element);
  };

  Textual.nicknameSingleClicked = function(e) {
    _trigger("nicknameSingleClicked");
    ConversationTracking.nicknameSingleClickEventCallback(e);
  };

  // vim:sw=2 ts=2 sts=2 et

}).call(this);
// Generated by CoffeeScript 2.5.1
(function() {
  //#
  // Links bug:<id> to gerrit
  var HTML_BUG, RE_BUG;

  RE_BUG = /\b(?:bug|bugzilla|bz)[\|:]?\s*#?(\d+)\b/ig;

  HTML_BUG = '<a href="https://bugzilla.wikimedia.org/$1">$&</a>';

  Textual.bind('messageAddedToView', function(line) {
    if (RE_BUG.test(line.innerHTML)) {
      return line.innerHTML = line.innerHTML.replace(RE_BUG, HTML_BUG);
    }
  });

}).call(this);
// Generated by CoffeeScript 2.5.1
(function() {
  "use strict";
  var NickColorizer, colorNicks;

  // colorNicks from https://github.com/hbang/Sapientia-Modifications
  // * (based on https://github.com/kirbylover4000/irccloud-colornicks
  // * (based on https://github.com/avidal/irccloud-colornicks
  // * (based on http://userscripts.org/scripts/show/88258
  // * (based on http://chatlogs.musicbrainz.org/mb_chatlogger.user.js))))

  NickColorizer = class NickColorizer {
    constructor() {
      this.key = 'textual.colorNicks';
      this.css = document.createElement('style');
      this.css.id = 'textual-colorNicks';
      this.css.type = 'text/css';
      this.css.media = 'all';
      // register callbacks
      Textual.bind('messageAddedToView', (line) => {
        return this.newMessagePostedToView(line);
      });
      Textual.bind('viewBodyDidLoad', () => {
        return this.viewFinishedLoading();
      });
    }

    load() {
      var val;
      val = localStorage.getItem(this.key);
      //console.log val
      if (val) {
        return JSON.parse(val);
      } else {
        return {};
      }
    }

    save(obj) {
      localStorage.setItem(this.key, JSON.stringify(obj));
    }

    cleanNick(nick) {
      // attempts to clean up a nickname
      // by removing alternate characters from the end
      // nc_ becomes nc, avidal` becomes avidal
      nick = nick.toLowerCase();
      // typically ` and _ are used on the end alone
      nick = nick.replace(/[`_]+$/, '');
      // remove |<anything> from the end
      nick = nick.replace(/\|.*$/, '');
      // remove [<anything>] or {<anything>} from the end
      return nick.replace(/^(!\[|!\{)(.*)(\[.*\]|\{.*\})$/, '$2');
    }

    getHash(nick) {
      var cleaned, hash, i;
      cleaned = this.cleanNick(nick);
      //console.log cleaned
      hash = 0;
      i = 0;
      while (i < cleaned.length) {
        hash = cleaned.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
        i++;
      }
      return hash;
    }

    getColor(nick) {
      var deg, h, l, nickHash, s;
      nickHash = this.getHash(nick);
      //console.log "#{nick} -> #{nickHash}"

      // get a positive value for the hue
      deg = nickHash % 360;
      h = (deg < 0 ? 360 + deg : deg);
      // default L is 50
      l = 50;
      if (h >= 30 && h <= 210) {
        // half of the hues are too light, for those we
        // decrease lightness
        l = 30;
      }
      // keep saturation above 20
      s = 20 + Math.abs(nickHash) % 80;
      return `hsl(${h}, ${s}%, ${l}%)`;
    }

    addNick(nick) {
      var c, color;
      //console.log "addNick"
      //console.log this
      c = this.load();
      if (nick in c) {
        return;
      }
      color = this.getColor(nick);
      c[nick] = color;
      this.save(c);
      this.addCss(nick, color);
    }

    //console.log c
    viewFinishedLoading() {
      var c, nick;
      c = this.load();
      for (nick in c) {
        this.addCss(nick, c[nick]);
      }
      document.head.appendChild(this.css);
    }

    newMessagePostedToView(line) {
      var e, j, len, ref;
      ref = line.querySelectorAll(".sender, .inline_nickname");
      for (j = 0, len = ref.length; j < len; j++) {
        e = ref[j];
        ((e) => {
          var nick;
          nick = false;
          if (e.className === "inline_nickname") {
            nick = e.innerText;
            e.setAttribute("data-nickname", e.innerText);
          } else {
            nick = e.getAttribute("data-nickname");
          }
          if (nick) {
            this.addNick(nick);
          }
        })(e);
        return;
      }
    }

    addCss(nick, color) {
      this.css.textContent += `\n.sender[data-nickname='${nick}'], ` + `.inline_nickname[data-nickname='${nick}']` + `{ color: ${color} !important; }`;
    }

  };

  colorNicks = new NickColorizer();

}).call(this);
// Generated by CoffeeScript 2.5.1
(function() {
  //#
  // Links gerrit:<id> to gerrit
  var HTML_GERRIT, RE_GERRIT;

  RE_GERRIT = /\b(?:gerrit)[|:](\S+)\b/ig;

  HTML_GERRIT = '<a href="https://gerrit.wikimedia.org/r/?#q,$1,n,z">$&</a>';

  Textual.bind('messageAddedToView', function(line) {
    if (RE_GERRIT.test(line.innerHTML)) {
      return line.innerHTML = line.innerHTML.replace(RE_GERRIT, HTML_GERRIT);
    }
  });

}).call(this);
// Generated by CoffeeScript 2.7.0
(function() {
  //#
  // De-emphasize messages from some senders
  // TODO: find a way to manage the sender list via commands in client
  var MUTED,
    indexOf = [].indexOf;

  MUTED = ['analytics-logbot', 'antispammeta', 'arseny', 'asimovbot', 'cerebrumbot', 'cp', 'cyberpower', 'danny_b', 'ecmabot-wm', 'eir', 'gh-datavalues', 'gh-wmde', 'github', 'github-wmde', 'grrrit-wm', 'guest', 'icinga-wm', 'ircnotifier', 'jinxer-wm', 'jinxer-wm-test', 'justberry', 'krrrit-wm', 'labs-morebots', 'libel', 'librenms-wmf', 'logmsgbot_cloud', 'mw-jenkinsbot', 'nokib', 'notefromgithub', 'opendevreview', 'paladox', 'phabot', 'phawikibugs', 'phawkes', 'pywikibugs', 'services_bot', 'shinken-wm', 'sirenbot', 'slander', 'snitch', 'stashbot', 'stewardbot', 'travis-ci', 'wikibugs', 'wikimediagithub', 'wikipedia-github', 'wikiphabot', 'wm-bot', 'wm-labs-meetbot', 'wmf-insecte', 'wmf-selenium-bot', 'wmopbot', 'zppix'];

  Textual.bind('messageAddedToView', function(line) {
    var cleanNick, e, ref, type;
    e = line.querySelector('.sender');
    cleanNick = function(nick) {
      // Normalize to lowercase
      // Strip trailing ` and/or _
      // Strip trailing |*
      // Strip trailing {*} and/or [*]
      // Strip trailing numbers
      return nick.toLowerCase().replace(/[`_]+$/, "").replace(/\|.*$/, "").replace(/^(!\[|!\{)(.*)(\[.*\]|\{.*\})$/, "$2").replace(/\d+$/, "");
    };
    if (e && (ref = cleanNick(e.getAttribute('data-nickname')), indexOf.call(MUTED, ref) >= 0)) {
      type = line.getAttribute('data-line-type');
      line.setAttribute('data-line-type', `${type} muted`);
    }
  });

}).call(this);
// Generated by CoffeeScript 2.5.1
(function() {
  //#
  // Make links to phabricator
  var HTML_PHAB, RE_PHAB;

  RE_PHAB = /([^\/])\b([TMP]\d+)\b/g;

  HTML_PHAB = '$1<a href="https://phabricator.wikimedia.org/$2">$2</a>';

  Textual.bind('messageAddedToView', function(line) {
    var e, i, len, ref, results;
    if (RE_PHAB.test(line.innerHTML)) {
      ref = line.querySelectorAll('.innerMessage');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        e = ref[i];
        results.push(((e) => {
          return e.innerHTML = e.innerHTML.replace(RE_PHAB, HTML_PHAB);
        })(e));
      }
      return results;
    }
  });

}).call(this);
