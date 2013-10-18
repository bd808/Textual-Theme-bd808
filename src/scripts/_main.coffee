"use strict";

after = (ms, cb) -> setTimeout cb, ms
every = (ms, cb) -> setInterval cb, ms

# dict of message handlers
_handlers = {}

# call handlers for a message
_trigger = (event, args...) ->
  for handler in _handlers[event]
    do (handler) ->
      try
        handler args...
      catch err
        console.log "Error handling #{event} with #{handler}: #{err}"
      return
    return

# register to receive a message
Textual.bind = (event, handler) ->
  _handlers[event] ?= [];
  _handlers[event].push handler
  return

Textual.viewFinishedLoading = ->
  #console.log "viewFinishedLoading"
  _trigger "viewFinishedLoading"
  Textual.fadeInLoadingScreen 1.00, 0.95
  after 500, ->
    Textual.scrollToBottomOfView()

Textual.viewFinishedReload = ->
  #console.log "viewFinishedReload"
  Textual.viewFinishedLoading()

Textual.newMessagePostedToView = (lineId) ->
  line = document.getElementById("line#{lineId}")
  line = document.getElementById("line-#{lineId}") unless line
  return unless line

  _trigger "newMessagePostedToView", line
  return

# vim:sw=2 ts=2 sts=2 et
