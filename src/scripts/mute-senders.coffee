##
# De-emphasize messages from some senders
# TODO: find a way to manage the sender list via commands in client

MUTED = [
  'grrrit-wm',
  'icinga-wm',
  'icinga-wm_',
  'labs-morebots',
  'morebots',
  'snitch',
  'wikibugs',
  'wm-bot',
  'wm-bot3',
]

Textual.bind 'newMessagePostedToView', (line) ->
  e = line.querySelector('.sender')
  if (e && e.getAttribute('nick') in MUTED)
    type = line.getAttribute 'type'
    line.setAttribute 'type', "#{type} muted"
  return
