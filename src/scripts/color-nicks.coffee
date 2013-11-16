"use strict";

# colorNicks from https://github.com/hbang/Sapientia-Modifications
# * (based on https://github.com/kirbylover4000/irccloud-colornicks
# * (based on https://github.com/avidal/irccloud-colornicks
# * (based on http://userscripts.org/scripts/show/88258
# * (based on http://chatlogs.musicbrainz.org/mb_chatlogger.user.js))))
#
class NickColorizer
  constructor: () ->
    @key = 'textual.colorNicks'
    @css = document.createElement('style')

    @css.id = 'textual-colorNicks'
    @css.type = 'text/css';
    @css.media = 'all';

    # register callbacks
    Textual.bind "newMessagePostedToView", (line) =>
      @newMessagePostedToView line

    Textual.bind "viewFinishedLoading", =>
      @viewFinishedLoading()

  load: ->
    val = localStorage.getItem @key
    #console.log val
    if val
      return JSON.parse val
    else
      return {}

  save: (obj) ->
    localStorage.setItem(@key, JSON.stringify obj)
    return

  cleanNick: (nick) ->
    # attempts to clean up a nickname
    # by removing alternate characters from the end
    # nc_ becomes nc, avidal` becomes avidal
    nick = nick.toLowerCase()

    # typically ` and _ are used on the end alone
    nick = nick.replace(/[`_]+$/, "")

    # remove |<anything> from the end
    nick = nick.replace(/\|.*$/, "")

    # remove [<anything>] or {<anything>} from the end
    nick.replace(/^(!\[|!\{)(.*)(\[.*\]|\{.*\})$/, "$2")

  getHash: (nick) ->
    cleaned = @cleanNick nick
    #console.log cleaned
    hash = 0
    i = 0
    while i < cleaned.length
      hash = cleaned.charCodeAt(i) + (hash << 6) + (hash << 16) - hash
      i++
    hash

  getColor: (nick) ->
    nickHash = @getHash nick
    #console.log "#{nick} -> #{nickHash}"

    # get a positive value for the hue
    deg = nickHash % 360
    h = (if deg < 0 then 360 + deg else deg)

    # default L is 50
    l = 50

    # half of the hues are too light, for those we
    # decrease lightness
    l = 30  if h >= 30 and h <= 210

    # keep saturation above 20
    s = 20 + Math.abs(nickHash) % 80
    "hsl(#{h}, #{s}%, #{l}%)"

  addNick: (nick) ->
    #console.log "addNick"
    #console.log this
    c = @load()
    return if nick of c
    color = @getColor nick
    c[nick] = color
    @save c
    @addCss nick, color
    #console.log c
    return

  viewFinishedLoading: ->
    c = @load()
    for nick of c
      @addCss nick, c[nick]
    document.head.appendChild @css
    return

  newMessagePostedToView: (line) ->
    for e in line.querySelectorAll(".sender, .inline_nickname")
      do (e) =>
        nick = false
        if e.className is "inline_nickname"
          nick = e.innerText
          e.setAttribute "nick", e.innerText
        else
          nick = e.getAttribute "nick"
        @addNick nick if nick
        return
      return

  addCss: (nick, color) ->
    @css.textContent += "\n.sender[nick='#{nick}'], .inline_nickname[nick='#{nick}'] { color: #{color} !important; }"
    return

colorNicks = new NickColorizer()

