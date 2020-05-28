"use strict"

after = (ms, cb) -> setTimeout cb, ms
every = (ms, cb) -> setInterval cb, ms

# dict of message handlers
_handlers = {}

# call handlers for a message
_trigger = (event, args...) ->
  if _handlers[event]
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
  _handlers[event] ?= []
  _handlers[event].push handler
  return

Textual.viewBodyDidLoad = ->
  _trigger "viewBodyDidLoad"
  Textual.fadeOutLoadingScreen 1.00, 0.95

Textual.messageAddedToView = (line, fromBuffer) ->
  element = document.getElementById("line-#{line}")
  return unless element
  _trigger "messageAddedToView", element
  ConversationTracking.updateNicknameWithNewMessage element
  return

Textual.nicknameSingleClicked = (e) ->
  _trigger "nicknameSingleClicked"
  ConversationTracking.nicknameSingleClickEventCallback e
  return

# vim:sw=2 ts=2 sts=2 et
