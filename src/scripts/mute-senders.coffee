##
# De-emphasize messages from some senders
# TODO: find a way to manage the sender list via commands in client

MUTED = [
  'ecmabot-wm',
  'gh-datavalues',
  'gh-wmde',
  'github',
  'github-wmde',
  'grrrit-wm',
  'grrrit-wm1',
  'grrrit-wm2',
  'icinga-wm',
  'labs-morebots',
  'libel',
  'morebots',
  'mostbots',
  'mw-jenkinsbot',
  'phabot',
  'phawikibugs',
  'phawkes',
  'pywikibugs',
  'pywikibugs2',
  'qa-morebots',
  'snitch',
  'travis-ci',
  'wikibugs',
  'wikibugs2',
  'wikiphabot',
  'wm-bot',
  'wm-bot3',
  'wm-labs-meetbot',
  'wm-labs-meetbot`',
  'wmf-insecte',
  'wmf-selenium-bot',
]

Textual.bind 'newMessagePostedToView', (line) ->
  e = line.querySelector('.sender')
  cleanNick = (nick) ->
    nick = nick.toLowerCase()
    nick = nick.replace(/[`_]+$/, "")
    nick = nick.replace(/\|.*$/, "")
    nick.replace(/^(!\[|!\{)(.*)(\[.*\]|\{.*\})$/, "$2")

  if (e && cleanNick( e.getAttribute('nick') ) in MUTED)
    type = line.getAttribute 'type'
    line.setAttribute 'type', "#{type} muted"
  return
